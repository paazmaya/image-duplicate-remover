/**
 * image-duplicate-remover
 * https://github.com/paazmaya/image-duplicate-remover
 *
 * Remove duplicate images from the two given directories recursively
 *
 * Copyright (c) Juga Paazmaya <paazmaya@yahoo.com> (https://paazmaya.fi)
 * Licensed under the MIT license
 */



const fs = require('fs'),
  path = require('path'),
  {
    execFile
  } = require('child_process');

const tape = require('tape');

const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'));

tape('cli should output version number', (test) => {
  test.plan(1);

  execFile('node', [pkg.bin, '-V'], null, function (error, stdout) {
    test.equals(stdout.trim(), pkg.version, 'Version is the same as in package.json');
  });

});

tape('cli should output help by default', (test) => {
  test.plan(1);

  execFile('node', [pkg.bin], null, (error, stdout) => {
    test.ok(stdout.trim().indexOf(pkg.name + ' [options] <primary directory> <secondary directory>') !== -1, 'Help appeared');
  });

});

tape('cli help output contains version number', (test) => {
  test.plan(2);

  execFile('node', [pkg.bin, '-h'], null, function (error, stdout) {
    const lines = stdout.trim().split('\n');
    test.equals(lines[0], pkg.name + ' [options] <primary directory> <secondary directory>');
    test.equals(lines[lines.length - 1], 'Version ' + pkg.version);
  });

});

tape('cli should fail when directories not specified', (test) => {
  test.plan(1);

  execFile('node', [pkg.bin], null, function (error, stdout, stderr) {
    test.equals(stderr.trim(), 'Directories not specified');
  });

});

tape('cli should fail when primary directory do not exist', (test) => {
  test.plan(2);

  execFile('node', [pkg.bin, 'not-around-here', 'tests/fixtures'], null, function (error, stdout, stderr) {
    test.ok(stderr.trim().indexOf('Primary directory (') !== -1);
    test.ok(stderr.trim().indexOf(') does not exist') !== -1);
  });

});

tape('cli should fail when secondary directory do not exist', (test) => {
  test.plan(2);

  execFile('node', [pkg.bin, 'tests/fixtures', 'not-around-here'], null, function (error, stdout, stderr) {
    test.ok(stderr.trim().indexOf('Secondary directory (') !== -1);
    test.ok(stderr.trim().indexOf(') does not exist') !== -1);
  });

});

/*
tape('cli should not remove anything when dry run used and duplicates are found', (test) => {
  test.plan(4);

  const dirA = path.join(__dirname, 'fixtures', 'a');
  const dirB = path.join(__dirname, 'fixtures', 'b');
  const initLengthB = fs.readdirSync(dirB);

  execFile('node', [pkg.bin, '-n', dirA, dirB], null, function (error, stdout, stderr) {
    const afterLengthB = fs.readdirSync(dirB);
    test.equals(afterLengthB.length, initLengthB.length, 'All files kept intact');
    test.ok(stdout.indexOf('removableFiles:') !== -1);
    test.ok(stdout.indexOf('black-white-red.png') !== -1);
    test.ok(stdout.indexOf('black-white-violet.png') !== -1);
  });

});
*/
