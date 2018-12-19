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

const readImage = require('./read-image');

const ITEMS_IN_DATA = 8;

/**
 * Generate and store the metadata for all the image files in the list
 *
 * @param {array} list List of image files
 * @param {sqlite3.Database} db Database instance
 * @param {object} options          Set of options that are all boolean
 * @param {boolean} options.verbose Print out current process
 * @param {boolean} options.dryRun  Do not touch any files, just show what could be done
 * @param {string} options.metric   Method to use when comparing two images with GraphicsMagick
 * @returns {sqlite3.Database|boolean} Database instance or false
 */
const storeImageData = (list, db, options) => {
  if (!(list instanceof Array) || list.length === 0) {
    return false;
  }

  const questions = Array(ITEMS_IN_DATA).fill('?').join(', ');
  const statement = db.prepare(`INSERT OR REPLACE INTO files VALUES (${questions})`);

  list.forEach((item) => {
    if (options.verbose) {
      console.log(`Reading file: ${item}`);
    }
    const data = readImage(item);
    if (data) {
      statement.run([
        data.filepath,
        data.hash,
        data.filesize,
        data.bitdepth,
        data.height,
        Math.round(Date.now() / 1000),
        data.uniquecolors,
        data.width
      ]);
    }
  });

  return db;
};

module.exports = storeImageData;
