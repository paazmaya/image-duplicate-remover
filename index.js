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
  readline = require('readline');

const sqlite3 = require('sqlite3');

const getImageFiles = require('./lib/get-image-files'),
  findMatchingSha256 = require('./lib/find-matching-sha256'),
  removeFiles = require('./lib/remove-files'),
  storeImageData = require('./lib/store-image-data');

const INDEX_NOT_FOUND = -1;

/**
 * Create and initialise SQLite database and tables, which by default is in memory.
 *
 * @param  {string} location Where shall the database be stored, defauts to ':memory:'
 * @returns {sqlite3.Database} Database instanse
 */
const createDatabase = (location) => {
  location = location || ':memory:';
  const db = new sqlite3.Database(location, (error) => {
    if (error) {
      console.error('Database opening/creation failed');
      console.error(error);
      process.exit(1);
    }
    console.log('Database opened after it was possibly created');
  });

  // Create tables that are needed. Alphaletically ordered keys after primary key and sha256
  // TODO: Should be able to check if the table already exists
  db.serialize(() => {
    // https://www.sqlite.org/lang_createtable.html
    // https://www.sqlite.org/withoutrowid.html
    /*
    db.run(`
      CREATE TABLE files (
        filepath TEXT PRIMARY KEY,
        sha256 TEXT,
        filesize REAL,
        bitdepth REAL,
        height REAL,
        timestamp REAL,
        uniquecolors REAL,
        width REAL
      ) WITHOUT ROWID
    `);
    */
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
 * @param {string} options.database Possible database file to be used with SQLite
 * @param {boolean} options.skipReading Skip reading the directories, just use the existing database
 * @returns {void}
 */
module.exports = function duplicateRemover (primaryDir, secondaryDir, options) {
  const db = createDatabase(options.database);

  const primaryImages = getImageFiles(primaryDir, options);
  let secondaryImages = getImageFiles(secondaryDir, options);

  // Remove possible duplicate file paths, just in case
  secondaryImages = secondaryImages.filter((item) => {
    return primaryImages.indexOf(item) === INDEX_NOT_FOUND;
  });

  if (options.verbose) {
    console.log(`Found ${primaryImages.length} primary images to compare with ${secondaryImages.length} secondary images`);
  }

  if (!options.skipReading) {
    db.serialize(() => {
      storeImageData(primaryImages, db, options);
    });

    db.serialize(() => {
      storeImageData(secondaryImages, db, options);
    });
  }

  findMatchingSha256(primaryImages, secondaryImages, db).then((matchingFiles) => {
    const keys = Object.keys(matchingFiles);
    console.log(`Total of ${keys.length} primary image files had matches under the secondary directory`);

    keys.forEach((primaryItem) => {
      console.log(`  ${primaryItem}`);
      console.log(`    Number of matches ${matchingFiles[primaryItem].length}`);
      matchingFiles[primaryItem].forEach((matchItem) => {
        console.log(`      ${matchItem}`);
      });
    });

    // For each ask first readline

    saveDatabaseContents(db, 'database-content.json');

    db.close();
  });

};
