/**
 * image-duplicate-remover
 * https://github.com/paazmaya/image-duplicate-remover
 *
 * Remove duplicate images from the two given directories recursively
 *
 * Copyright (c) Juga Paazmaya <paazmaya@yahoo.com> (https://paazmaya.fi)
 * Licensed under the MIT license
 */

import path from 'node:path';

import tape from 'tape';
import identifyImage from '../../lib/identify-image.js';

tape('identifyImage - identify jpeg image', (test) => {
  test.plan(3);

  const filepath = path.join('tests', 'fixtures', 'a', 'jukka-paasonen.jpg');
  const meta = identifyImage(filepath);

  // Check all properties, except the uniquecolors which differs in win/mac 24441 and linux 24529
  test.equal(meta.bitdepth, 8);
  test.equal(meta.height, 200);
  test.equal(meta.width, 200);
});

tape('identifyImage - identify png image with spaces in its name', (test) => {
  test.plan(1);

  const filepath = path.join('tests', 'fixtures', 'a', 'You Dont Know npm.png');
  const meta = identifyImage(filepath);

  test.deepEqual(meta, {
    bitdepth: 8,
    height: 662,
    uniquecolors: 2,
    width: 1236
  });
});

tape('identifyImage - identify fails on text file', (test) => {
  test.plan(1);

  const filepath = path.join('tests', 'index_test.js');
  const meta = identifyImage(filepath);

  test.deepEqual(meta, false);
});

tape('identifyImage - identify fails on non existing file', (test) => {
  test.plan(1);

  const filepath = 'not-here-to-be-found';
  const meta = identifyImage(filepath);

  test.deepEqual(meta, false);
});
