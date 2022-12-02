#!/usr/bin/env node

/**
 * image-duplicate-remover
 * https://github.com/paazmaya/image-duplicate-remover
 *
 * Remove duplicate images from the two given directories recursively
 *
 * Copyright (c) Juga Paazmaya <paazmaya@yahoo.com> (https://paazmaya.fi)
 * Licensed under the MIT license
 */


import fs from 'fs';
import path from 'path';

import optionator from 'optionator';

import duplicateRemover from '../index.js';

import pkg from '../package.json' assert { type: 'json' };

const optsParser = optionator({
  prepend: `${pkg.name} [options] <primary directory> <secondary directory>`,
  append: `Version ${pkg.version}`,
  options: [
    {
      option: 'help',
      alias: 'h',
      type: 'Boolean',
      description: 'Help and usage instructions'
    },
    {
      option: 'version',
      alias: 'V',
      type: 'Boolean',
      description: 'Version number',
      example: '-V'
    },
    {
      option: 'verbose',
      alias: 'v',
      type: 'Boolean',
      description: 'Verbose output, will print which file is currently being processed'
    },
    {
      option: 'database',
      alias: 'D',
      type: 'String',
      description: 'SQLite database to use'
    },
    {
      option: 'skip-reading',
      alias: 'S',
      type: 'Boolean',
      description: 'Skip reading the directories, just use the existing database. Requires database'
    },
    {
      option: 'dry-run',
      alias: 'n',
      type: 'Boolean',
      description: 'Try it out without actually removing anything'
    }
  ]
});

let opts;

try {
  opts = optsParser.parse(process.argv);
}
catch (error) {
  console.error(error.message);
  console.log(optsParser.generateHelp());
  process.exit(1);
}

if (opts.version) {
  console.log(pkg.version);
  process.exit(0);
}

if (opts.help) {
  console.log(optsParser.generateHelp());
  process.exit(0);
}

if (opts.skipReading && !opts.database) {
  console.log('Must have existing database defined, when skipping the reading part');
  process.exit(0);
}

if (opts._.length !== 2) {
  console.error('Directories not specified');
  console.log(optsParser.generateHelp());
  process.exit(1);
}

const primaryDir = path.resolve(opts._[0]),
  secondaryDir = path.resolve(opts._[1]);

if (!fs.existsSync(primaryDir)) {
  console.error(`Primary directory (${primaryDir}) does not exist`);
  process.exit(1);
}
if (!fs.existsSync(secondaryDir)) {
  console.error(`Secondary directory (${secondaryDir}) does not exist`);
  process.exit(1);
}

// TODO: Is GraphicsMagick available?

// Fire away
duplicateRemover(primaryDir, secondaryDir, {
  verbose: typeof opts.verbose === 'boolean' ?
    opts.verbose :
    false,
  dryRun: typeof opts.dryRun === 'boolean' ?
    opts.dryRun :
    false,
  database: typeof opts.database === 'string' ?
    opts.database :
    null,
  skipReading: typeof opts.skipReading === 'boolean' ?
    opts.skipReading :
    false
});
