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

const identifyImage = require('./identify-image');

/**
 * Read meta informations from file and save to database
 *
 * @param {string} filepath Image file path
 * @param {sqlite3.Database} db Database connection
 * @returns {void}
 */
const readImage = (filepath, db) => {
  const meta = identifyImage(filepath);
  //const color = getPixelColor(filepath);
  const content = fs.readFileSync(filepath);
  const sha256 = hasha(content, {
    algorithm: 'sha256'
  });

  const values = [
    filepath,
    sha256,
    meta.bitdepth,
    meta.compression,
    meta.filesize,
    meta.height,
    meta.uniquecolors,
    meta.width
  ];
  const questions = Array(values.length).fill('?').join(', ');
  db.serialize(() => {
    const statement = db.prepare(`INSERT INTO files VALUES (${questions})`);
    statement.run(values);
    statement.finalize();
  });
};

module.exports = readImage;
