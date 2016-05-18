/**
 * image-duplicate-remover
 * https://github.com/paazmaya/image-duplicate-remover
 *
 * Remove duplicate images from the two given directories recursively
 *
 * Copyright (c) Juga Paazmaya <paazmaya@yahoo.com> (http://paazmaya.fi)
 * Licensed under the MIT license
 */

'use strict';

const fs = require('fs'),
  path = require('path'),
  childProcess = require('child_process'),
  crypto = require('crypto');

const imageExtensions = require('image-extensions'),
  sqlite3 = require('sqlite3');

const INDEX_NOT_FOUND = -1,
  EXTENSIONS = imageExtensions.concat(['mp4', 'avi', 'mpg', 'mpeg', 'mts', 'mov']),
  // Find keys and numerical values
  GM_COMPARE_NUMBERS_EXPR = /^\s+(\w+):\s+([\d\.]+)/gm,
  GM_IDENTIFY_SIZE = /\s\d+\.\d+Ki\s/;

// In memory database for storing meta information
let db;

/**
 * Create and initialise SQLite database and tables
 * @param  {string} location Where shall the database be stored
 * @returns {void}
 */
const createDatabase = (location = ':memory:') => {
  db = new sqlite3.Database(location);

  // Create tables needed
  db.serialize(() => {
    // https://www.sqlite.org/lang_createtable.html
    // https://www.sqlite.org/withoutrowid.html
    db.run(`
      CREATE TABLE files (
        filepath TEXT PRIMARY KEY,
        sha256 TEXT,
        bitdepth REAL,
        compression REAL,
        filesize TEXT,
        height REAL,
        uniquecolors REAL,
        width REAL
      ) WITHOUT ROWID
    `);
  });
};

/**
 * Check if the given file path has a suffix matching the
 * available media file suffixes.
 *
 * @param {string} filepath  Absolute file path
 * @returns {bool} True in case the filepath is a media file according to the suffix
 */
const isMedia = function _isMedia (filepath) {
  const ext = path.extname(filepath).slice(1).toLowerCase();

  return EXTENSIONS.indexOf(ext) !== INDEX_NOT_FOUND;
};

/**
 * Read a directory, by returning all files with full filepath
 *
 * @param {string} directory        Directory to read
 * @param {object} options          Set of options that are all boolean
 * @param {boolean} options.verbose Print out current process
 * @param {boolean} options.dryRun  Do not touch any files, just show what could be done
 * @returns {array} List of image with full path
 */
const getImages = function _getImages (directory, options) {
  if (options.verbose) {
    console.log(`Reading directory ${directory}`);
  }
  let images = [];

  const items = fs.readdirSync(directory)
    .map((item) =>
      path.join(directory, item)
    );

  items.forEach((item) => {
    const stat = fs.statSync(item);

    if (stat.isFile() && isMedia(item)) {
      images.push(item);
    }
    else if (stat.isDirectory()) {
      images = images.concat(_getImages(item, options));
    }
  });

  return images;
};

/**
 * Create SHA-256 hash
 *
 * @param  {Buffer} content Image file contents
 * @returns {string}        Hash string in base64
 */
const createHash = (content) => {
  // Hash generator
  const hash = crypto.createHash('sha256');

  hash.update(content, 'binary');

  return hash.digest('hex');
};

/**
 * Get information about the image file. Format modifiers used:
 *   %b   file size
 *   %h   height
 *   %k   number of unique colors
 *   %Q   compression quality
 *   %q   image bit depth
 *   %w   width
 *
 * @see http://www.graphicsmagick.org/GraphicsMagick.html#details-format
 * @param {string} filepath  Image file path
 * @returns {object|bool}     Meta information object or false when failed
 */
const identifyImage = (filepath) => {
  const options = {
      cwd: path.dirname(filepath),
      encoding: 'utf8'
    },
    command = `gm identify -format "%q %Q %b %h %k %w" ${filepath}`;

  let stdout = '';
  try {
    stdout = childProcess.execSync(command, options);
  }
  catch (error) {
    console.error(error.cmd);
    return false;
  }

  // When file size did not appear in the middle, assume failure
  if (stdout.search(GM_IDENTIFY_SIZE) === INDEX_NOT_FOUND) {
    return false;
  }

  // Trim removes the new line
  const raws = stdout.trim().split(' '),
    values = {},
    keys = [
      'bitdepth',
      'compression',
      'filesize',
      'height',
      'uniquecolors',
      'width'
    ];

  keys.forEach((item, index) => {
    values[item] = raws[index];
  });

  return values;
};

/**
 * Get the pixel color for the given position in the image
 *
 * @param  {string} filepath Image file path
 * @param  {Number} x        Position in the image
 * @param  {Number} y        Position in the image
 * @return {string|bool}     Color value or false when failed
 */
/*
const getPixelColor = (filepath, x = 0, y = 0) => {
  const options = {
    cwd: path.dirname(filepath),
    encoding: 'utf8'
  };
  const command = `gm convert ${filepath} -format "'%[pixel:p{${x},${y}}]'" info:-`;
  console.log(command, options);
};
*/
/**
 * Read meta informations from file and save to database
 *
 * @param {string} filepath Image file path
 * @returns {void}
 */
const readImage = (filepath) => {
  const meta = identifyImage(filepath);
  //const color = getPixelColor(filepath);
  const content = fs.readFileSync(filepath);
  const sha256 = createHash(content);

  const values = [
    filepath,
    sha256,
    meta.bitdepth,
    meta.compression,
    meta.filesize,
    meta.height,
    meta.uniquecolors,
    meta.width
  ];
  const questions = Array(values.length).fill('?').join(', ');
  db.serialize(() => {
    const statement = db.prepare(`INSERT INTO files VALUES (${questions})`);
    statement.run(values);
    statement.finalize();
  });
};

/**
 * Compare two images against each other
 *
 * @see http://www.graphicsmagick.org/compare.html
 * @param {string} a Image filepath
 * @param {string} b Image filepath
 * @returns {object|bool} Comparison numbers or false when failed
 */
const compareImages = (a, b) => {
  const options = {
      cwd: path.dirname(a),
      encoding: 'utf8'
    },
    metric = 'mse', // mae, mse, pae, psnr, rmse
    command = `gm compare -metric ${metric} ${a} ${b}`;

  let stdout = '';
  try {
    stdout = childProcess.execSync(command, options);
  }
  catch (error) {
    console.error(error.cmd);
    return false;
  }


  const norm = {};
  let normalised;

  while ((normalised = GM_COMPARE_NUMBERS_EXPR.exec(stdout)) !== null) {
    norm[normalised[1].toLowerCase()] = parseFloat(normalised[2], 10);
  }

  if (Object.keys(norm).length !== 4) {
    return false;
  }

  return norm;
};

/**
 * Remove the given file
 *
 * @param {string} primaryItem      Image filepath that is used only for verbose information
 * @param {string} secondaryItem    Image filepath that would be removed when not options.dryRun
 * @param {object} options          Set of options that are all boolean
 * @param {boolean} options.verbose Print out current process
 * @param {boolean} options.dryRun  Do not touch any files, just show what could be done
 * @returns {Number} Count of reoved files, being zero or one
 */
const removeSecondaryFile = (primaryItem, secondaryItem, options) => {
  if (options.verbose) {
    console.log(`Removing ${secondaryItem} since it is the same as ${primaryItem}`);
  }

  if (!options.dryRun) {
    // fs.unlinkSync(secondaryItem);
    return 1;
  }

  return 0;
};

/**
 * Remove duplicates found from the secondary directory after comparing against the primary directory
 *
 * @param {string} primaryDir       Primary directory from which files will not be deleted
 * @param {string} secondaryDir     Secondary directory from which files are deleted
 * @param {object} options          Set of options that are all boolean
 * @param {boolean} options.verbose Print out current process
 * @param {boolean} options.dryRun  Do not touch any files, just show what could be done
 * @returns {void}
 */
module.exports = function duplicateRemover (primaryDir, secondaryDir, options) {
  createDatabase();

  const primaryImages = getImages(primaryDir, options);
  let secondaryImages = getImages(secondaryDir, options);

  // Remove possible duplicate file paths, just in case
  secondaryImages = secondaryImages.filter((item) => {
    return primaryImages.indexOf(item) === INDEX_NOT_FOUND;
  });

  if (options.verbose) {
    console.log(`Found total of ${primaryImages.length} to compare with image ${secondaryImages.length}`);
  }

  // Counter for files that were removed
  let removedFiles = 0;

  primaryImages.forEach((primaryItem) => {
    readImage(primaryItem);
    secondaryImages.forEach((secondaryItem) => {

      const comparison = compareImages(primaryItem, secondaryItem);
      console.log(comparison);

      if (comparison.total === 0) {
        removedFiles += removeSecondaryFile(primaryItem, secondaryItem, options);
      }
    });
  });

  console.log(`Removed total of ${removedFiles} files`);

  db.each('SELECT * FROM files', (error, row) => {
    if (error) {
      console.error('Database query failed');
      console.error(error);
    }
    console.log(row);
  });

  console.log(`Removed total of ${removedFiles} duplicate image files`);
};

// Exposed for testing
module.exports._createDatabase = createDatabase;
module.exports._isMedia = isMedia;
module.exports._getImages = getImages;
module.exports._createHash = createHash;
module.exports._identifyImage = identifyImage;
//module.exports._getPixelColor = getPixelColor;
module.exports._compareImages = compareImages;
module.exports._readImage = readImage;
module.exports._removeSecondaryFile = removeSecondaryFile;

