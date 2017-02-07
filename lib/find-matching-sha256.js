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

/**
 * Find images that are duplicates, based on the SHA256 stored in the database.
 *
 * @param {Array} primaryImages     List of image filepaths that is used only for verbose information
 * @param {Array} secondaryImages   List of image filepaths that would be removed when not options.dryRun
 * @param {sqlite3.Database} db     Database instance
 * @returns {Promise|boolean} Promise to resolve with a collection of identical files or false when images are not arrays
 */
const findMatchingSha256 = (primaryImages, secondaryImages, db) => {
  if (!(primaryImages instanceof Array) || !(secondaryImages instanceof Array)) {
    return false;
  }

  const promises = primaryImages.map((primaryItem) => {
    return new Promise((resolve, reject) => {

      // List of files that are to be removed
      const matchingFiles = {
        primary: primaryItem,
        matches: []
      };

      // Find files that have the same SHA256 hash as the current primary item
      const query = `SELECT B.filepath FROM files A, files B
        WHERE A.filepath IS "${primaryItem}" AND A.filepath IS NOT B.filepath AND A.sha256 IS B.sha256`;

      // Read the meta for this file
      //const query = `SELECT * FROM files WHERE filepath = "${primaryItem}"`;
      // console.log('Quering', query);
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
              matchingFiles.matches.push(row.filepath);
            }
          });
          resolve(matchingFiles);
        });
      });

    });

  });

  return Promise.all(promises).then(solved => {
    // Solved is an array of objects. Those objects have two properties: primary and matches.
    // matches is an array of files that have the same sha256 with the primary.
    const collection = {};

    // Reduce while converting to the collection
    solved.forEach((item) => {
      if (item.matches.length > 0) {
        collection[item.primary] = item.matches;
      }
    });

    return collection;
  });
};

module.exports = findMatchingSha256;
