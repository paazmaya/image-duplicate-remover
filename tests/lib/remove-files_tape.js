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
  path = require('path');

const tape = require('tape'),
  removeFiles = require('../../lib/remove-files');

tape('identify jpeg image', (test) => {
  test.plan(1);

  const dirA = path.join(__dirname, '..', 'fixtures', 'a');
  const dirB = path.join(__dirname, '..', 'fixtures', 'b');

  const list = removeFiles(dirA, dirB);

  test.equal(list.length, 0);
});
