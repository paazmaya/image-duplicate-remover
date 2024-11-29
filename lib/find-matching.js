/**
 * image-duplicate-remover
 * https://github.com/paazmaya/image-duplicate-remover
 *
 * Remove duplicate images from the two given directories recursively
 *
 * Copyright (c) Juga Paazmaya <paazmaya@yahoo.com> (https://paazmaya.fi)
 * Licensed under the MIT license
 */

export const QUERY_PREPARE = `SELECT B.filepath
  FROM files A, files B
  WHERE A.filepath IS "?"
    AND A.filepath IS NOT B.filepath
    AND A.? IS B.?`;

/**
 * Solved is an array of objects. Those objects have two properties: primary and matches.
 * matches is an array of files that have the same hash or filesize with the primary.
 *
 * @param {Array} solved ist of promises that were all finished.
 * @returns {Object} Collection of items that have matches
 */
const solvePromises = (solved) => {
  //
  const collection = {};

  // Reduce while converting to the collection
  solved.forEach((item) => {
    if (item.matches.length > 0) {
      collection[item.primary] = item.matches;
    }
  });

  return collection;
};

/**
 * Find duplicates for this image item.
 *
 * @param {string} primaryItem      Primary image filepath
 * @param {Array} secondaryImages   List of image filepaths that would be removed when not options.dryRun
 * @param {sqlite3.Database} db     Database instance
 * @param {string} key              Key which should be used, defaults to hash
 * @returns {Promise|boolean} Promise to resolve with a collection of identical files or
 *                            false when images are not arrays
 */
const queryDatabase = (primaryItem, secondaryImages, db, key) => {
  key = key || 'hash';

  return new Promise((resolve, reject) => {

    // List of files that are to be removed
    const matchingFiles = {
      primary: primaryItem,
      matches: []
    };

    // Find files that have the same SHA-256 hash or filesize as the current primary item
    const query = db.prepare(QUERY_PREPARE);

    // Read the meta for this file
    //const query = db.prepare(`SELECT * FROM files WHERE filepath = "${primaryItem}"`);
    // console.log('Quering', query);

    const rows = query.all([primaryItem, key, key]);

    if (!rows) {
      console.error('Database query failed');
      reject();
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
};

/**
 * Find images that are duplicates, based on either SHA-256 or filesize, stored in the database.
 *
 * @param {Array} primaryImages     List of image filepaths that is used only for verbose information
 * @param {Array} secondaryImages   List of image filepaths that would be removed when not options.dryRun
 * @param {sqlite3.Database} db     Database instance
 * @param {string} key              Key which should be used, defaults to hash
 * @returns {Promise|boolean} Promise to resolve with a collection of identical files or
 *                            false when images are not arrays
 */
const findMatching = (primaryImages, secondaryImages, db, key) => {
  if (!(primaryImages instanceof Array) || !(secondaryImages instanceof Array)) {
    return false;
  }

  key = key || 'hash';
  if (typeof key !== 'string' || !/^(hash|filesize)$/u.exec(key)) {
    return false;
  }

  const promises = primaryImages.map((primaryItem) => {
    return queryDatabase(primaryItem, secondaryImages, db, key);
  });

  return Promise.all(promises).then(solvePromises);
};

export default findMatching;
