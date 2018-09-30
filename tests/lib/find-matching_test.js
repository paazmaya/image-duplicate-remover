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
  findMatching = require('../../lib/find-matching');

tape('does not find any files when lists are empty', (test) => {
  test.plan(1);

  const db = {
    prepare: function (callback) {
      return {
        all: function () {
          test.fail('All queried unexpectedly');
          return null;
        }
      };
    }
  };

  findMatching([], [], db)
    .then((list) => {
      test.equal(Object.keys(list).length, 0);
    }).catch(err => {
      console.log('Something went wrong: ' + err);
    });

});

tape('lists expected duplicates without removing on dry run', (test) => {
  test.plan(4); // all called 4 times, amount of files

  const options = {
    dryRun: true,
    verbose: false
  };
  const dirA = path.join(__dirname, '..', 'fixtures', 'a');
  const listA = getImageFiles(dirA, options);
  const dirB = path.join(__dirname, '..', 'fixtures', 'b');
  const listB = getImageFiles(dirB, options);

  const db = {
    prepare: function (query) {
      test.equal(query, findMatching.QUERY_PREPARE);

      return {
        all: function () {}
      };
    }
  };

  findMatching(listA, listB, db)
    .then((list) => {
      test.equal(Object.keys(list).length, 0); // because database is empty
    }).catch(err => {
      console.log('Something went wrong: ' + err);
    });
});
