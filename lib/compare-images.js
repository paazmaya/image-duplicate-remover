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

const GM_COMPARE_NUMBERS_EXPR = /^\s+(\w+):\s+([\d\.]+)/gm;

/**
 * Normalise the metrics coming out from GM output.
 *
 * @see http://www.graphicsmagick.org/compare.html
 * @param {string} gmOutput Output from GraphicsMagick
 * @returns {object|bool} Comparison numbers or false when failed
 */
const normaliseMetrics = (gmOutput) => {

  const norm = {};
  let normalised;

  while ((normalised = GM_COMPARE_NUMBERS_EXPR.exec(gmOutput)) !== null) {
    norm[normalised[1].toLowerCase()] = parseFloat(normalised[2], 10);
  }

  if (Object.keys(norm).length !== 4) {
    return false;
  }

  return norm;
};

/**
 * Compare two images against each other
 *
 * @see http://www.graphicsmagick.org/compare.html
 * @param {string} a Image filepath
 * @param {string} b Image filepath
 * @param {object} options          Set of options that are all boolean
 * @param {boolean} options.verbose Print out current process
 * @param {boolean} options.dryRun  Do not touch any files, just show what could be done
 * @param {string} options.metric   Method to use when comparing two images with GraphicsMagick
 * @returns {object|bool} Comparison numbers or false when failed
 */
const compareImages = (a, b, options) => {
  options = options || {};
  options.metric = options.metric || 'mse'; // mae, mse, pae, psnr, rmse

  const cmdOpts = {
      cwd: path.dirname(a),
      encoding: 'utf8'
    },
    command = `gm compare -depth 8 -colorspace RGB -metric ${options.metric} "${a}" "${b}"`;

  let stdout = '';
  try {
    stdout = childProcess.execSync(command, cmdOpts);
  }
  catch (error) {
    console.error('Comparison failed', a, b);
    console.error(error.cmd);
    return false;
  }

  console.log('stdout from', command);
  console.log(stdout);

  return normaliseMetrics(stdout);
};

module.exports = compareImages;
