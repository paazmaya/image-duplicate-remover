/**
 * image-duplicate-remover
 * https://github.com/paazmaya/image-duplicate-remover
 *
 * Remove duplicate images from the two given directories recursively
 *
 * Copyright (c) Juga Paazmaya <paazmaya@yahoo.com> (http://paazmaya.fi)
 * Licensed under the MIT license
 */

'use strict';

const fs = require('fs'),
  path = require('path');

const tape = require('tape'),
  duplicateRemover = require('../index');

tape('a function is exported', (test) => {
  test.plan(2);

  test.equal(typeof duplicateRemover, 'function');
  test.equal(duplicateRemover.length, 3, 'has three arguments');
});


tape('private methods exposed for testing', (test) => {
  test.plan(1);

  test.equal(typeof duplicateRemover._isMedia, 'function');
});
