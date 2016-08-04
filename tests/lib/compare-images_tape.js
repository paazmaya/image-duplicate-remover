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
  compareImages = require('../../lib/compare-images');

tape('compare identical images with different exif', (test) => {
  test.plan(1);

  const a = path.join(__dirname, '..', 'fixtures', 'a', 'jukka-paasonen.jpg');
  const b = path.join(__dirname, '..', 'fixtures', 'b', 'jukka-paasonen.jpg');
  const data = compareImages(a, b);

  test.deepEqual(data, {
    blue: 0,
    green: 0,
    red: 0,
    total: 0
  });
});

tape('compare different images', (test) => {
  test.plan(1);

  const a = path.join(__dirname, '..', 'fixtures', 'a', 'black-white-red.png');
  const b = path.join(__dirname, '..', 'fixtures', 'b', 'black-white-violet.png');
  const data = compareImages(a, b);

  test.deepEqual(data, {
    blue: 0.2903703704,
    green: 0.0866333461,
    red: 0.0014814815,
    total: 0.1261617327
  });
});
