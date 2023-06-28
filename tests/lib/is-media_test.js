/**
 * image-duplicate-remover
 * https://github.com/paazmaya/image-duplicate-remover
 *
 * Remove duplicate images from the two given directories recursively
 *
 * Copyright (c) Juga Paazmaya <paazmaya@yahoo.com> (https://paazmaya.fi)
 * Licensed under the MIT license
 */

import tape from 'tape';
import isMedia from '../../lib/is-media.js';

tape('isMedia - recognises mov file as media', (test) => {
  test.plan(3);

  test.ok(isMedia('awesome.mov'));
  test.ok(isMedia('awesome.MOV'));
  test.ok(isMedia('awesome-.s.1.mov'));
});

tape('isMedia - recognises mts file as media', (test) => {
  test.plan(3);

  test.ok(isMedia('VIDEO.mts'));
  test.ok(isMedia('VIDEO.d.mTS'));
  test.ok(isMedia('VIDEO_22334444.MTS'));
});
