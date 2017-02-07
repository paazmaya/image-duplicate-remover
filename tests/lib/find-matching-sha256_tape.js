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
  getImageFiles = require('../../lib/get-image-files'),
  findMatchingSha256 = require('../../lib/find-matching-sha256');

tape('does not find any files when lists are empty', (test) => {
  test.plan(1);

  const db = {
    serialize: function (callback) {
      callback();
    },
    all: function (query, callback) {
      test.fail('All queried unexpectedly');
      callback(null, []);
    }
  };
  const options = {
    dryRun: true,
    verbose: false
  };

  findMatchingSha256([], [], db, options).then((list) => {
    test.equal(Object.keys(list).length, 0);
  });

});

tape('lists expected duplicates without removing on dry run', (test) => {
  test.plan(5); // all called 4 times, amount of files

  const options = {
    dryRun: true,
    verbose: false
  };
  const dirA = path.join(__dirname, '..', 'fixtures', 'a');
  const listA = getImageFiles(dirA, options);
  const dirB = path.join(__dirname, '..', 'fixtures', 'b');
  const listB = getImageFiles(dirB, options);

  const db = {
    serialize: function (callback) {
      callback();
    },
    all: function (query, callback) {
      test.ok(query.indexOf('SELECT B.filepath FROM files A, files B') === 0, 'Query prepared properly');
      callback(null, []);
    }
  };

  findMatchingSha256(listA, listB, db, options).then((list) => {
    test.equal(Object.keys(list).length, 0); // because database is empty
  });

});
