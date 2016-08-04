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

const path = require('path'),
  childProcess = require('child_process');

const INDEX_NOT_FOUND = -1,
  // Find keys and numerical values
  GM_IDENTIFY_SIZE = /\s\d+\.\d+Ki\s/;

/**
 * Get information about the image file. Format modifiers used:
 *   %b   file size
 *   %h   height
 *   %k   number of unique colors
 *   %Q   compression quality
 *   %q   image bit depth
 *   %w   width
 *
 * @see http://www.graphicsmagick.org/GraphicsMagick.html#details-format
 * @param {string} filepath  Image file path
 * @returns {object|bool}     Meta information object or false when failed
 */
const identifyImage = (filepath) => {
  const options = {
      cwd: path.dirname(filepath),
      encoding: 'utf8'
    },
    command = `gm identify -format "%q %Q %b %h %k %w" ${filepath}`;

  let stdout = '';
  try {
    stdout = childProcess.execSync(command, options);
  }
  catch (error) {
    console.error(error.cmd);
    return false;
  }

  // When file size did not appear in the middle, assume failure
  if (stdout.search(GM_IDENTIFY_SIZE) === INDEX_NOT_FOUND) {
    return false;
  }

  // Trim removes the new line
  const raws = stdout.trim().split(' '),
    values = {},
    keys = [
      'bitdepth',
      'compression',
      'filesize',
      'height',
      'uniquecolors',
      'width'
    ];

  keys.forEach((item, index) => {
    values[item] = raws[index];
  });

  return values;
};

module.exports = identifyImage;
