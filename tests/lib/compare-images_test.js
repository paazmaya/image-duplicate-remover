/**
 * image-duplicate-remover
 * https://github.com/paazmaya/image-duplicate-remover
 *
 * Remove duplicate images from the two given directories recursively
 *
 * Copyright (c) Juga Paazmaya <paazmaya@yahoo.com> (https://paazmaya.fi)
 * Licensed under the MIT license
 */

import path from 'path';

import tape from 'tape';
import compareImages from '../../lib/compare-images.js';

tape('compareImages - compare identical images with different exif', (test) => {
  test.plan(1);

  const a = path.join('tests', 'fixtures', 'a', 'jukka-paasonen.jpg');
  const b = path.join('tests', 'fixtures', 'b', 'jukka-paasonen.jpg');
  const data = compareImages(a, b);

  test.deepEqual(data, {
    blue: 0,
    green: 0,
    red: 0,
    total: 0
  });
});
/*
tape('compareImages - compare different images', (test) => {
  test.plan(1);

  const a = path.join('tests', 'fixtures', 'a', 'black-white-red.png');
  const b = path.join('tests', 'fixtures', 'b', 'black-white-violet.png');
  const data = compareImages(a, b);

  test.deepEqual(data, {
    blue: 0.2903703704,
    green: 0.0866333461,
    red: 0.0014814815,
    total: 0.1261617327
  });
});
*/
tape('compareImages - compare identical images with different optimisation', (test) => {
  test.plan(1);

  const a = path.join('tests', 'fixtures', 'a', 'You Dont Know npm.png');
  const b = path.join('tests', 'fixtures', 'b', 'You Dont Know npm.png');
  const data = compareImages(a, b);

  test.deepEqual(data, {
    blue: 0,
    green: 0,
    red: 0,
    total: 0
  });
});
