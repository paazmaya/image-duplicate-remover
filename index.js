/**
 * image-duplicate-remover
 * https://github.com/paazmaya/image-duplicate-remover
 *
 * Remove duplicate images from the two given directories recursively
 *
 * Copyright (c) Juga Paazmaya <paazmaya@yahoo.com> (https://paazmaya.fi)
 * Licensed under the MIT license
 */

'use strict';

const fs = require('fs'),
  path = require('path'),
  childProcess = require('child_process'),
  crypto = require('crypto');

const imageExtensions = require('image-extensions'),
  sqlite3 = require('sqlite3');

const compareImages = require('./lib/compare-images'),
  identifyImage = require('./lib/identify-image'),
  isMedia = require('./lib/is-media');

const INDEX_NOT_FOUND = -1,
  // Find keys and numerical values
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

