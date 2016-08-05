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
 * @returns {void|bool} False on possible failure
 */
const readImage = (filepath) => {
  if (!fs.existsSync(filepath)) {
    return false;
  }
  const meta = identifyImage(filepath);
  //const color = getPixelColor(filepath);
  const content = fs.readFileSync(filepath);
  const sha256 = hasha(content, {
    algorithm: 'sha256'
  });

  const data = Object.assign({
    filepath: filepath,
    sha256: sha256
  }, meta);

  return data;
};

module.exports = readImage;
