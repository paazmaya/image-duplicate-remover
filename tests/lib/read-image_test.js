/**
 * image-duplicate-remover
 * https://github.com/paazmaya/image-duplicate-remover
 *
 * Remove duplicate images from the two given directories recursively
 *
 * Copyright (c) Juga Paazmaya <paazmaya@yahoo.com> (https://paazmaya.fi)
 * Licensed under the MIT license
 */

//import path from 'path';

import tape from 'tape';
import readImage from '../../lib/read-image.js';

/*
tape('inserts data to database when file exists', (test) => {
  test.plan(1);

  const filepath = path.join('tests', 'fixtures', 'a', 'You Dont Know npm.png');
  const actual = readImage(filepath);
  test.deepEqual(actual, {
    filepath: filepath,
    hash: '60673c95c25853d7e199d5f0d2632f99657383ad18a56e30ab464a1aa97d21c2',
    filesize: 3155,
    bitdepth: 8,
    height: 662,
    uniquecolors: 2,
    width: 1236
  });
});
*/

tape('does not use database when file does not exist', (test) => {
  test.plan(1);

  const filepath = 'i am not here';
  const actual = readImage(filepath);
  test.notOk(actual);
});
