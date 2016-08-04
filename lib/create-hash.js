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

const crypto = require('crypto');

/**
 * Create SHA-256 hash
 *
 * @param  {Buffer} content Image file contents
 * @returns {string}        Hash string in base64
 */
const createHash = (content) => {
  // Hash generator
  const hash = crypto.createHash('sha256');

  hash.update(content, 'binary');

  return hash.digest('hex');
};

module.exports = createHash;
