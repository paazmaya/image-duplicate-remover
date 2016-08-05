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

const fs = require('fs');

const sqlite3 = require('sqlite3');

const getImageFiles = require('./lib/get-image-files'),
  removeFiles = require('./lib/remove-files'),
  storeImageData = require('./lib/store-image-data');

const INDEX_NOT_FOUND = -1;

/**
 * Create and initialise SQLite database and tables, which by default is in memory.
 *
 * @param  {string} location Where shall the database be stored
 * @returns {sqlite3.Database} Database instanse
 */
const createDatabase = (location) => {
  location = location || ':memory:';
  const db = new sqlite3.Database(location, (error) => {
    if (error) {
      console.error('Database opening/creation failed');
      console.error(error);
    }
    console.log('Database opened after it was possibly created');
  });

  // Create tables needed. Alphaletically ordered keys after primary key and sha256
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

  return db;
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

const saveDatabaseContents = (db, filename) => {
  db.serialize(() => {
    const query = 'SELECT * FROM files';
    const data = {
      files: []
    };
    db.all(query, (error, rows) => {
      if (error) {
        console.error('Database query failed');
        console.error(error);
      }
      else {
        data.files = rows;
        const json = JSON.stringify(data, null, ' ');

        fs.writeFileSync(filename, json, 'utf8');
      }
    });
  });
};

/**
 * Remove duplicates found from the secondary directory after comparing against the primary directory
 *
 * @param {string} primaryDir       Primary directory from which files will not be deleted
 * @param {string} secondaryDir     Secondary directory from which files are deleted
 * @param {object} options          Set of options that are all boolean
 * @param {boolean} options.verbose Print out current process
 * @param {boolean} options.dryRun  Do not touch any files, just show what could be done
 * @param {string} options.metric   Method to use when comparing two images with GraphicsMagick
 * @returns {void}
 */
module.exports = function duplicateRemover (primaryDir, secondaryDir, options) {
  const db = createDatabase();

  const primaryImages = getImageFiles(primaryDir, options);
  let secondaryImages = getImageFiles(secondaryDir, options);

  // Remove possible duplicate file paths, just in case
  secondaryImages = secondaryImages.filter((item) => {
    return primaryImages.indexOf(item) === INDEX_NOT_FOUND;
  });

  if (options.verbose) {
    console.log(`Found ${primaryImages.length} primary images to compare with ${secondaryImages.length} secondary images`);
  }

  db.serialize(() => {
    storeImageData(primaryImages, db);
  });

  db.serialize(() => {
    storeImageData(secondaryImages, db);
  });

  removeFiles(primaryImages, secondaryImages, db, options).then((/*removedFiles*/) => {

    saveDatabaseContents(db, 'database-content.json');

    db.close();
  });

};
