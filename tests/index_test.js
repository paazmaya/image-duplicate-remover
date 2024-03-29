/**
 * image-duplicate-remover
 * https://github.com/paazmaya/image-duplicate-remover
 *
 * Remove duplicate images from the two given directories recursively
 *
 * Copyright (c) Juga Paazmaya <paazmaya@yahoo.com> (https://paazmaya.fi)
 * Licensed under the MIT license
 */

import fs from 'node:fs';
import path from 'node:path';

import tape from 'tape';
import duplicateRemover from '../index.js';

tape('a function is exported', (test) => {
  test.plan(2);

  test.equal(typeof duplicateRemover, 'function');
  test.equal(duplicateRemover.length, 3, 'has three arguments');
});
