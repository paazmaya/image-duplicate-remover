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

const readlineSync = require('readline-sync');

const database = require('./lib/database'),
  getImageFiles = require('./lib/get-image-files'),
  findMatching = require('./lib/find-matching'),
  storeImageData = require('./lib/store-image-data');

const INDEX_NOT_FOUND = -1;

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
 * Remove a single file, based on the user input.
 *
 * @param {string} filepath  File that is asked to be deleted
 * @param {object} options          Set of options that are all boolean
 * @param {boolean} options.verbose Print out current process
 * @param {boolean} options.dryRun  Do not touch any files, just show what could be done
 * @return {boolean} True when the file was removed
 */
const deleteConfirmFile = (filepath, options) => {
  console.log(`      ${filepath}`);

  const answer = readlineSync.question('      Delete the above file y/N: ');
  if (answer.match(/^y(es)?$/i)) {

    if (options.verbose) {
      console.log(`      Removing "${filepath}"`);
    }

    if (!options.dryRun) {
      //fs.unlinkSync(filepath);
      return true;
    }
  }

  return false;
};

/**
 * Delete candicates from the list, based on user input, that are all duplicates to the item.
 *
 * @param {string} item     File that is kept
 * @param {Array} list      Array of files that are matches to the item
 * @param {object} options          Set of options that are all boolean
 * @param {boolean} options.verbose Print out current process
 * @param {boolean} options.dryRun  Do not touch any files, just show what could be done
 * @return {Number} Total number of files that were removed
 */
const deleteConfirmList = (item, list, options) => {
  let total = 0;

  console.log(`  ${item}`);
  console.log(`    Number of matches ${list.length}`);

  list.forEach((matchItem) => {
    if (deleteConfirmFile(matchItem, options)) {
      ++total;
    }
  });

  return total;
};

const handleMatchingFiles = (matchingFiles, key, options) => {

  const keys = Object.keys(matchingFiles);
  console.log(`Total of ${keys.length} primary image files had exact "${key}" matches under the secondary directory`);

  let total = 0;

  keys.forEach((primaryItem) => {
    const list = matchingFiles[primaryItem];
    total += deleteConfirmList(primaryItem, list, options);
  });

  console.log(`Total of ${total} files removed`);
};

/**
 * Remove duplicates found from the secondary directory after comparing against the primary directory
 *
 * @param {string} primaryDir       Primary directory from which files will not be deleted
 * @param {string} secondaryDir     Secondary directory from which files are deleted
 * @param {object} options          Set of options that are all boolean
 * @param {boolean} options.verbose Print out current process
 * @param {boolean} options.dryRun  Do not touch any files, just show what could be done
 *
 * @param {string} options.metric   Method to use when comparing two images with GraphicsMagick
 * @param {string} options.database Possible database file to be used with SQLite
 * @param {boolean} options.skipReading Skip reading the directories, just use the existing database
 * @returns {void}
 */
module.exports = function duplicateRemover (primaryDir, secondaryDir, options) {
  const db = database.connect(options.database);

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

  findMatching(primaryImages, secondaryImages, db, 'sha256').then((matchingFiles) => {
    handleMatchingFiles(matchingFiles, 'sha256', options);

    return findMatching(primaryImages, secondaryImages, db, 'filesize');
  }).then((matchingFiles) => {
    handleMatchingFiles(matchingFiles, 'filesize', options);

    // Testing purposes, to see what goes in there
    database.saveJSON(db, 'database-content.json');

    db.close();
  });

};
