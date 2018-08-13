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
  storeImageData = require('../../lib/store-image-data'),
  database = require('../../lib/database');

tape('inserts data to database when file exists', (test) => {
  test.plan(4);

  const filepath = path.join(__dirname, '..', 'fixtures', 'a', 'You Dont Know npm.png');

  const db = {
    prepare: function (query) {
      test.equal(query, 'INSERT OR REPLACE INTO files VALUES (?, ?, ?, ?, ?, ?, ?, ?)', 'Query prepared properly');

      return {
        run: function (values) {
          test.ok(values.indexOf(filepath) !== -1, 'Has filepath');
          test.ok(values.indexOf('60673c95c25853d7e199d5f0d2632f99657383ad18a56e30ab464a1aa97d21c2') !== -1, 'Has sha256');
          test.ok(values.indexOf(3155) !== -1, 'Has filesize');
        }
      };
    }
  };
  storeImageData([filepath], db, {});

});

tape('updates data to database when file already has a row', (test) => {
  test.plan(1);

  const filepath = path.join(__dirname, '..', 'fixtures', 'a', 'You Dont Know npm.png');
  const db = database.connect();
  storeImageData([filepath], db, {});
  storeImageData([filepath], db, {});

  const row = db.prepare(`SELECT COUNT(filepath) AS total FROM files WHERE filepath = '${filepath}' GROUP BY filepath`).get();
  test.equal(row.total, 1);
});

tape('does not use database when list is empty', (test) => {
  test.plan(1);

  const ret = storeImageData([], null, {});
  test.notOk(ret);
});
