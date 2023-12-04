/**
 * image-duplicate-remover
 * https://github.com/paazmaya/image-duplicate-remover
 *
 * Remove duplicate images from the two given directories recursively
 *
 * Copyright (c) Juga Paazmaya <paazmaya@yahoo.com> (https://paazmaya.fi)
 * Licensed under the MIT license
 */

import childProcess from 'node:child_process';

const INDEX_NOT_FOUND = -1,
  // Find keys and numerical values
  GM_IDENTIFY_SPACES = /\d+\s\d+\s\d+\s\d+/u;

/**
 * Normalise the output from GM.
 *
 * @param {string} gmOutput Output from GraphicsMagick
 * @returns {object|bool}     Meta information object or false when failed
 */
const normaliseOutput = (gmOutput) => {
  // Trim removes the new line
  const raws = gmOutput.trim().split(' '),
    values = {},
    keys = [
      'bitdepth',
      'height',
      'uniquecolors',
      'width'
    ];

  keys.forEach((item, index) => {
    values[item] = parseInt(raws[index], 10);
  });

  return values;
};

/**
 * Get information about the image file. Format modifiers used:
 *   %h   height
 *   %k   number of unique colors
 *   %Q   compression quality, since GM 1.3.22 (2015-10-04). Not used at the moment due to version requirements
 *   %q   image bit depth
 *   %w   width
 *
 * @see http://www.graphicsmagick.org/GraphicsMagick.html#details-format
 * @see http://www.graphicsmagick.org/identify.html
 * @param {string} filepath  Image file path
 * @returns {object|bool}     Meta information object or false when failed
 */
const identifyImage = (filepath) => {
  const options = {
      encoding: 'utf8'
    },
    command = `gm identify -depth 8 -ping -format "%q %h %k %w" "${filepath}"`;

  let stdout = '';
  try {
    stdout = childProcess.execSync(command, options);
  }
  catch (error) {
    console.error('Identification failed', filepath);

    return false;
  }

  if (stdout.search(GM_IDENTIFY_SPACES) === INDEX_NOT_FOUND) {
    return false;
  }

  return normaliseOutput(stdout);
};

export default identifyImage;
