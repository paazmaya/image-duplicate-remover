/**
 * image-duplicate-remover
 * https://github.com/paazmaya/image-duplicate-remover
 *
 * Remove duplicate images from the two given directories recursively
 *
 * Copyright (c) Juga Paazmaya <paazmaya@yahoo.com> (https://paazmaya.fi)
 * Licensed under the MIT license
 */

const path = require('path');

const imageExtensions = require('image-extensions');

const INDEX_NOT_FOUND = -1,
  EXTENSIONS = imageExtensions.concat(['mp4', 'avi', 'mpg', 'mpeg', 'mts', 'mov']);

/**
 * Check if the given file path has a suffix matching the
 * available media file suffixes.
 *
 * @param {string} filepath  Absolute file path
 * @returns {bool} True in case the filepath is a media file according to the suffix
 */
const isMedia = (filepath) => {
  const ext = path.extname(filepath).slice(1).toLowerCase();

  return EXTENSIONS.indexOf(ext) !== INDEX_NOT_FOUND;
};

module.exports = isMedia;
