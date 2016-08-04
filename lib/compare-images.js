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

const fs = require('fs'),
  path = require('path'),
  childProcess = require('child_process');

const INDEX_NOT_FOUND = -1,
  // Find keys and numerical values
  GM_COMPARE_NUMBERS_EXPR = /^\s+(\w+):\s+([\d\.]+)/gm,
  GM_IDENTIFY_SIZE = /\s\d+\.\d+Ki\s/;

/**
 * Compare two images against each other
 *
 * @see http://www.graphicsmagick.org/compare.html
 * @param {string} a Image filepath
 * @param {string} b Image filepath
 * @returns {object|bool} Comparison numbers or false when failed
 */
const compareImages = (a, b) => {
  const options = {
      cwd: path.dirname(a),
      encoding: 'utf8'
    },
    metric = 'mse', // mae, mse, pae, psnr, rmse
    command = `gm compare -metric ${metric} ${a} ${b}`;

  let stdout = '';
  try {
    stdout = childProcess.execSync(command, options);
  }
  catch (error) {
    console.error(error.cmd);
    return false;
  }

  const norm = {};
  let normalised;

  while ((normalised = GM_COMPARE_NUMBERS_EXPR.exec(stdout)) !== null) {
    norm[normalised[1].toLowerCase()] = parseFloat(normalised[2], 10);
  }

  if (Object.keys(norm).length !== 4) {
    return false;
  }

  return norm;
};

module.exports = compareImages;
