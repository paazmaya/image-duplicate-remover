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

const ITEMS_IN_DATA = 7;

/**
 * Generate and store the metadata for all the image files in the list
 *
 * @param {array} list List of image files
 * @param {sqlite3.Database} db Database instance
 * @returns {sqlite3.Database|boolean} Database instance or false
 */
const storeImageData = (list, db) => {
  if (!(list instanceof Array) || list.length === 0) {
    return false;
  }

  const questions = Array(ITEMS_IN_DATA).fill('?').join(', ');
  const statement = db.prepare(`INSERT INTO files VALUES (${questions})`);

  list.forEach((item) => {
    const data = readImage(item);
    if (data) {
      statement.run([
        data.filepath,
        data.sha256,
        data.filesize,
        data.bitdepth,
        data.height,
        data.uniquecolors,
        data.width
      ]);
    }
  });
  statement.finalize();

  return db;
};

module.exports = storeImageData;
