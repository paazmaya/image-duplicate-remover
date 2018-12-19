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

const hasha = require('hasha');

// const identifyImage = require('./identify-image');

/**
 * Get the byte file size of the given image file.
 * Better to do this via Node.js rather than GraphicsMagick due to portability.
 *
 * @param {string} filepath Image file path
 * @returns {Number} File size in bytes
 * @see https://nodejs.org/docs/latest-v6.x/api/fs.html#fs_class_fs_stats
 */
const imageSize = (filepath) => {
  const stat = fs.statSync(filepath);

  return stat.size;
};

/**
 * Read meta informations from file and save to database
 *
 * @param {string} filepath Image file path
 * @param {sqlite3.Database} db Database connection
 * @returns {void|bool} False on possible failure
 */
const readImage = (filepath) => {
  try {
    fs.accessSync(filepath);
  }
  catch (error) {
    return false;
  }

  /*
  let meta = identifyImage(filepath);
  if (!meta) {
    // Identifying via GM failed...
    meta = {};
  }
  */

  const meta = {};
  //const color = getPixelColor(filepath);
  const sha256 = hasha.fromFileSync(filepath, {
    algorithm: 'sha256'
  });
  const size = imageSize(filepath);

  const data = Object.assign({
    filepath: filepath,
    hash: sha256,
    filesize: size
  }, meta);

  return data;
};

module.exports = readImage;
