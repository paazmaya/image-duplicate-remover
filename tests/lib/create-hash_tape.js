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

const tape = require('tape'),
  createHash = require('../../lib/create-hash');

tape('generate SHA-256 hash', (test) => {
  test.plan(1);

  const filepath = 'tests/fixtures/a/jukka-paasonen.jpg';
  const hash = createHash(filepath);

  test.equal(hash, '8bc08e6a205ca03124ce2ab971157e13475607a2058424c4389400bc4fc14659');
});

tape('generate SHA-256 hash from JS file', (test) => {
  test.plan(1);

  const filepath = 'tests/index_tape.js';
  const hash = createHash(filepath);

  test.equal(hash, 'b3ab3ac413f441078d24c3fbb535650c4600c129e7e606b4d2f1e8e85f2cc935');
});

