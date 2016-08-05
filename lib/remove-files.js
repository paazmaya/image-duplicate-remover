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

// const fs = require('fs');

const compareImages = require('./compare-images');

/**
 * Remove the given file
 *
 * @param {string} primaryItem      Image filepath that is used only for verbose information
 * @param {string} secondaryItem    Image filepath that would be removed when not options.dryRun
 * @param {object} options          Set of options that are all boolean
 * @param {boolean} options.verbose Print out current process
 * @param {boolean} options.dryRun  Do not touch any files, just show what could be done
 * @returns {string|boolean} Filepath to the removed file or false when not removed
 */
const removeSecondaryFile = (primaryItem, secondaryItem, options) => {
  if (options.verbose) {
    console.log(`Removing ${secondaryItem} since it is the same as ${primaryItem}`);
  }

  if (!options.dryRun) {
    // fs.unlinkSync(secondaryItem);
    return secondaryItem;
  }

  return false;
};

/**
 * Remove images that are duplicates
 *
 * @param {string} primaryImages    Image filepath that is used only for verbose information
 * @param {string} secondaryImages  Image filepath that would be removed when not options.dryRun
 * @param {sqlite3.Database} db     Database instance
 * @param {object} options          Set of options that are all boolean
 * @param {boolean} options.verbose Print out current process
 * @param {boolean} options.dryRun  Do not touch any files, just show what could be done
 * @param {string} options.metric   Method to use when comparing two images with GraphicsMagick
 * @returns {Promise|boolean} Promised to resolve with a list of removed files or false when images are not arrays
 */
const removeFiles = (primaryImages, secondaryImages, db, options) => {
  if (!(primaryImages instanceof Array) || !(secondaryImages instanceof Array)) {
    return false;
  }

  const promises = primaryImages.map((primaryItem) => {
    return new Promise((resolve, reject) => {

      // List of files that are to be removed
      const removableFiles = [];

      // Find files that have the same SHA256 hash as the current primary item
      const query = `SELECT B.filepath FROM files A, files B
        WHERE A.filepath = "${primaryItem}" AND A.filepath != B.filepath AND A.sha256 = B.sha256`;

      // Read the meta for this file
      //const query = `SELECT * FROM files WHERE filepath = "${primaryItem}"`;
      console.log('Quering', query);
      db.serialize(() => {
        db.all(query, (error, rows) => {
          if (error) {
            console.error('Database query failed');
            reject(error);
          }
          // Find the matching items in secondary list
          rows.forEach((row) => {
            const index = secondaryImages.indexOf(row.filepath);
            if (index !== -1) {
              removableFiles.push(row.filepath);
            }
          });
          resolve(removableFiles);
        });
      });

    });

  });

  return Promise.all(promises).then(solved => {
    return solved.reduce((previous, current) => {
      return previous.concat(current);
    }, []);
  }).then(removableFiles => {
    // removableFiles should be secondaryImages that have had the same SHA256 with primaryImages
    console.log('removableFiles:');
    console.log(removableFiles);

    //removeSecondaryFile(primaryItem, secondaryItem, options)

    //secondaryImages.forEach((secondaryItem) => {

      // Get the image metric comparison
      //const comparison = compareImages(primaryItem, secondaryItem);
      //if (comparison.total === 0) {
      //}
    //});
    if (options.verbose) {
      console.log(`Removed total of ${removableFiles.length} files`);
    }

    return removableFiles;

  });
};

module.exports = removeFiles;
