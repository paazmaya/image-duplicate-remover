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

//const fs = require('fs');

//const compareImages = require('./compare-images');

/**
 * Remove images that are duplicates
 *
 * @param {Array} removableFiles    Image filepaths that are to be removed
 * @param {sqlite3.Database} db     Database instance
 * @param {object} options          Set of options that are all boolean
 * @param {boolean} options.verbose Print out current process
 * @param {boolean} options.dryRun  Do not touch any files, just show what could be done
 * @param {string} options.metric   Method to use when comparing two images with GraphicsMagick
 * @returns {Promise|boolean} Promised to resolve with a list of removed files or false when images are not arrays
 */
const removeFiles = (removableFiles, db, options) => {
  // removableFiles should be secondaryImages that have had the same SHA256 with primaryImages
  if (options.verbose) {
    console.log(`Goind to remove total of ${removableFiles.length} files`);
  }

  console.log('removableFiles:');
  console.log(removableFiles);

  removableFiles.forEach((item) => {

    if (options.verbose) {
      console.log(`Removing "${item}"`);
    }

    if (!options.dryRun) {
      //fs.unlinkSync(item);
    }
  });
  //secondaryImages.forEach((secondaryItem) => {

    // Get the image metric comparison
    //const comparison = compareImages(primaryItem, secondaryItem);
    //if (comparison.total === 0) {
    //}
  //});

  return removableFiles;
};

module.exports = removeFiles;
