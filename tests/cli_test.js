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
import {
  execFile
} from 'node:child_process';

import tape from 'tape';

/* import pkg from '../package.json' assert { type: 'json' };*/
const packageFile = new URL('../package.json', import.meta.url);
const pkg = JSON.parse(fs.readFileSync(packageFile, 'utf8'));

tape('cli should output version number', (test) => {
  test.plan(1);

  execFile('node', [pkg.bin[pkg.name], '-V'], null, function (error, stdout) {
    test.equals(stdout.trim(), pkg.version, 'Version is the same as in package.json');
  });

});

tape('cli should output help by default', (test) => {
  test.plan(1);

  execFile('node', [pkg.bin[pkg.name]], null, (error, stdout) => {
    test.ok(stdout.trim().indexOf(pkg.name + ' [options] <primary directory> <secondary directory>') !== -1, 'Help appeared');
  });

});

tape('cli help output contains version number', (test) => {
  test.plan(2);

  execFile('node', [pkg.bin[pkg.name], '-h'], null, function (error, stdout) {
    const lines = stdout.trim().split('\n');
    test.equals(lines[0], pkg.name + ' [options] <primary directory> <secondary directory>');
    test.equals(lines[lines.length - 1], 'Version ' + pkg.version);
  });

});

tape('cli should fail when directories not specified', (test) => {
  test.plan(1);

  execFile('node', [pkg.bin[pkg.name]], null, function (error, stdout, stderr) {
    test.ok(stderr.trim().indexOf('Directories not specified') !== -1);
  });

});

tape('cli should fail when primary directory do not exist', (test) => {
  test.plan(2);

  execFile('node', [pkg.bin[pkg.name], 'not-around-here', 'tests/fixtures'], null, function (error, stdout, stderr) {
    test.ok(stderr.trim().indexOf('Primary directory (') !== -1);
    test.ok(stderr.trim().indexOf(') does not exist') !== -1);
  });

});

tape('cli should fail when secondary directory do not exist', (test) => {
  test.plan(2);

  execFile('node', [pkg.bin[pkg.name], 'tests/fixtures', 'not-around-here'], null, function (error, stdout, stderr) {
    test.ok(stderr.trim().indexOf('Secondary directory (') !== -1);
    test.ok(stderr.trim().indexOf(') does not exist') !== -1);
  });

});

/*
tape('cli should not remove anything when dry run used and duplicates are found', (test) => {
  test.plan(4);

  const dirA = path.join('tests', 'fixtures', 'a');
  const dirB = path.join('tests', 'fixtures', 'b');
  const initLengthB = fs.readdirSync(dirB);

  execFile('node', [pkg.bin[pkg.name], '-n', dirA, dirB], null, function (error, stdout, stderr) {
    const afterLengthB = fs.readdirSync(dirB);
    test.equals(afterLengthB.length, initLengthB.length, 'All files kept intact');
    test.ok(stdout.indexOf('removableFiles:') !== -1);
    test.ok(stdout.indexOf('black-white-red.png') !== -1);
    test.ok(stdout.indexOf('black-white-violet.png') !== -1);
  });

});
*/
