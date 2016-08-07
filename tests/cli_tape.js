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
  path = require('path'),
  execFile = require('child_process').execFile;

const tape = require('tape');

const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));

tape('cli should output version number', function (test) {
  test.plan(1);

  execFile('node', [pkg.bin, '-V'], null, function (error, stdout) {
    test.equals(stdout.trim(), pkg.version, 'Version is the same as in package.json');
  });

});

tape('cli help output contains version number', function (test) {
  test.plan(2);

  execFile('node', [pkg.bin, '-Vv'], null, function (error, stdout) {
    const lines = stdout.split('\n');
    test.equals(lines[0], pkg.name + ' [options] <primary directory> <secondary directory>');
    test.equals(lines[lines.length - 1], 'Version ' + pkg.version);
  });

});

tape('cli should fail when directories not specified', function (test) {
  test.plan(1);

  execFile('node', [pkg.bin], null, function (error, stdout, stderr) {
    test.equals(stderr.trim(), 'Sorry but the previously created images directory should exist', 'Error message');
  });

});

tape('cli should fail when primary directory do not exist', function (test) {
  test.plan(1);

  execFile('node', [pkg.bin, 'not-around-here', 'tests/fixtures'], null, function (error, stdout, stderr) {
    test.equals(stderr.trim(), 'Sorry but the currently created images directory should exist', 'Error message');
  });

});

tape('cli should fail when secondary directory do not exist', function (test) {
  test.plan(1);

  execFile('node', [pkg.bin, 'tests/fixtures', 'not-around-here'], null, function (error, stdout, stderr) {
    test.equals(stderr.trim(), 'Sorry but the currently created images directory should exist', 'Error message');
  });

});


