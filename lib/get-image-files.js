/**
 * image-duplicate-remover
 * https://github.com/paazmaya/image-duplicate-remover
 *
 * Remove duplicate images from the two given directories recursively
 *
 * Copyright (c) Juga Paazmaya <paazmaya@yahoo.com> (https://paazmaya.fi)
 * Licensed under the MIT license
 */

const findFiles = require('tozan/lib/find-files');

const isMedia = require('./is-media');

/**
 * Read a directory, by returning all files with full filepath
 *
 * @param {string} directory        Directory to read
 * @param {object} options          Set of options that are all boolean
 * @param {boolean} options.verbose Print out current process
 * @param {boolean} options.dryRun  Do not touch any files, just show what could be done
 * @param {string} options.metric   Method to use when comparing two images with GraphicsMagick
 * @returns {array} List of image with full path
 */
const getImageFiles = (directory, options) => {
  if (options.verbose) {
    console.log(`Reading directory "${directory}"`);
  }

  return findFiles(directory, {}).filter((item) => isMedia(item));
};

module.exports = getImageFiles;
