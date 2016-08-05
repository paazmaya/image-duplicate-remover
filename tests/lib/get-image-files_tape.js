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

const path = require('path');

const tape = require('tape'),
  getImageFiles = require('../../lib/get-image-files');

const options = {
  dryRun: true,
  verbose: false
};

tape('finds fixtures', (test) => {
  test.plan(1);

  const dirpath = path.join(__dirname, '..', 'fixtures', 'a');
  const list = getImageFiles(dirpath, options);

  test.equal(list.length, 4);
});
