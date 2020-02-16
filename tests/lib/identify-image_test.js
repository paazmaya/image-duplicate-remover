/**
 * image-duplicate-remover
 * https://github.com/paazmaya/image-duplicate-remover
 *
 * Remove duplicate images from the two given directories recursively
 *
 * Copyright (c) Juga Paazmaya <paazmaya@yahoo.com> (https://paazmaya.fi)
 * Licensed under the MIT license
 */



const path = require('path');

const tape = require('tape'),
  identifyImage = require('../../lib/identify-image');

tape('identify jpeg image', (test) => {
  test.plan(3);

  const filepath = path.join(__dirname, '..', 'fixtures', 'a', 'jukka-paasonen.jpg');
  const meta = identifyImage(filepath);

  // Check all properties, except the uniquecolors which differs in win/mac 24441 and linux 24529
  test.equal(meta.bitdepth, 8);
  test.equal(meta.height, 200);
  test.equal(meta.width, 200);
});

tape('identify png image with spaces in its name', (test) => {
  test.plan(1);

  const filepath = path.join(__dirname, '..', 'fixtures', 'a', 'You Dont Know npm.png');
  const meta = identifyImage(filepath);

  test.deepEqual(meta, {
    bitdepth: 8,
    height: 662,
    uniquecolors: 2,
    width: 1236
  });
});

tape('identify fails on text file', (test) => {
  test.plan(1);

  const filepath = path.join(__dirname, '..', 'index_test.js');
  const meta = identifyImage(filepath);

  test.deepEqual(meta, false);
});

tape('identify fails on non existing file', (test) => {
  test.plan(1);

  const filepath = 'not-here-to-be-found';
  const meta = identifyImage(filepath);

  test.deepEqual(meta, false);
});
