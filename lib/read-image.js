/**
 * image-duplicate-remover
 * https://github.com/paazmaya/image-duplicate-remover
 *
 * Remove duplicate images from the two given directories recursively
 *
 * Copyright (c) Juga Paazmaya <paazmaya@yahoo.com> (https://paazmaya.fi)
 * Licensed under the MIT license
 */

import fs from 'node:fs';

import generateHash from 'tozan/lib/generate-hash.js';
import canAccessFile from 'tozan/lib/can-access-file.js';

// import identifyImage from './identify-image.js';

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
  if (!canAccessFile(filepath)) {
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
  const sha256 = generateHash(filepath, 'sha256');
  const size = imageSize(filepath);

  const data = Object.assign({
    filepath: filepath,
    hash: sha256,
    filesize: size
  }, meta);

  return data;
};

export default readImage;
