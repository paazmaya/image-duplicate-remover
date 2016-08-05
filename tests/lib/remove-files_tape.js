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

tape('does not remove any files when lists are empty', (test) => {
  test.plan(1);

  const db = {
    serialize: function (callback) {
      callback();
    },
    all: function (query, callback) {
      test.equal(query, 'INSERT INTO files VALUES (?, ?, ?, ?, ?, ?, ?, ?)', 'Query prepared properly');
      callback(null, []);
    }
  };
  const options = {
    dryRun: true,
    verbose: false
  };

  removeFiles([], [], db, options).then((list) => {
    test.equal(list.length, 0);
  });

});

/*
tape('does not remove any files when lists are empty', (test) => {
  test.plan(1);

  const dirA = path.join(__dirname, '..', 'fixtures', 'a');
  const dirB = path.join(__dirname, '..', 'fixtures', 'b');

  const db = {
    serialize: function (callback) {
      callback();
    },
    all: function (query, callback) {
      test.equal(query, 'INSERT INTO files VALUES (?, ?, ?, ?, ?, ?, ?, ?)', 'Query prepared properly');
      callback(null, []);
    }
  };
  const options = {
    dryRun: true,
    verbose: false
  };

  removeFiles(dirA, dirB, db, options).then((list) => {
    test.equal(list.length, 0);
  });

});
*/