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
import getImageFiles from '../../lib/get-image-files.js';

const options = {
  dryRun: true,
  verbose: false
};

tape('getImageFiles - finds fixtures', (test) => {
  test.plan(1);

  const dirpath = path.join('tests', 'fixtures', 'a');
  const list = getImageFiles(dirpath, options);

  test.equal(list.length, 4);
});
