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
  test.plan(6);

  test.equal(typeof duplicateRemover._createDatabase, 'function');
  test.equal(typeof duplicateRemover._isMedia, 'function');
  test.equal(typeof duplicateRemover._getImages, 'function');
  test.equal(typeof duplicateRemover._createHash, 'function');
  test.equal(typeof duplicateRemover._identifyImage, 'function');
  test.equal(typeof duplicateRemover._readImage, 'function');
});


tape('generate SHA-256 hash', (test) => {
  test.plan(1);

  const filepath = 'tests/fixtures/a/jukka-paasonen.jpg';
  const hash = duplicateRemover._createHash(filepath);

  test.equal(hash, '8bc08e6a205ca03124ce2ab971157e13475607a2058424c4389400bc4fc14659');
});

tape('generate SHA-256 hash from JS file', (test) => {
  test.plan(1);

  const filepath = 'tests/index_tape.js';
  const hash = duplicateRemover._createHash(filepath);

  test.equal(hash, 'b3ab3ac413f441078d24c3fbb535650c4600c129e7e606b4d2f1e8e85f2cc935');
});

tape('identify jpeg image', (test) => {
  test.plan(1);

  const filepath = path.join(__dirname, 'fixtures', 'a', 'jukka-paasonen.jpg');
  const meta = duplicateRemover._identifyImage(filepath);

  test.deepEqual(meta, {
    bitdepth: '8',
    compression: '75',
    filesize: '7.3Ki',
    height: '200',
    uniquecolors: '24441',
    width: '200'
  });
});

tape('identify fails on text file', (test) => {
  test.plan(1);

  const filepath = path.join(__dirname, 'index_tape.js');
  const meta = duplicateRemover._identifyImage(filepath);

  test.deepEqual(meta, false);
});

tape('identify fails on non existing file', (test) => {
  test.plan(1);

  const filepath = 'not-here-to-be-found';
  const meta = duplicateRemover._identifyImage(filepath);

  test.deepEqual(meta, false);
});


tape('compare identical images with different exif', (test) => {
  test.plan(1);

  const a = path.join(__dirname, 'fixtures', 'a', 'jukka-paasonen.jpg');
  const b = path.join(__dirname, 'fixtures', 'b', 'jukka-paasonen.jpg');
  const data = duplicateRemover._compareImages(a, b);

  test.deepEqual(data, {
    blue: 0,
    green: 0,
    red: 0,
    total: 0
  });
});

tape('compare different images', (test) => {
  test.plan(1);

  const a = path.join(__dirname, 'fixtures', 'a', 'black-white-red.png');
  const b = path.join(__dirname, 'fixtures', 'b', 'black-white-violet.png');
  const data = duplicateRemover._compareImages(a, b);

  test.deepEqual(data, {
    blue: 0.2903703704,
    green: 0.0866333461,
    red: 0.0014814815,
    total: 0.1261617327
  });
});
