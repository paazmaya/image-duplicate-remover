# image-duplicate-remover

> Remove duplicate images from the two given directories recursively

[![Ubuntu build Status](https://travis-ci.org/paazmaya/image-duplicate-remover.svg?branch=master)](https://travis-ci.org/paazmaya/image-duplicate-remover)
[![Windows build status](https://ci.appveyor.com/api/projects/status/gmjc0bi0bbydb667/branch/master?svg=true)](https://ci.appveyor.com/project/paazmaya/image-duplicate-remover/branch/master)
[![codecov](https://codecov.io/gh/paazmaya/image-duplicate-remover/branch/master/graph/badge.svg)](https://codecov.io/gh/paazmaya/image-duplicate-remover)
[![Dependencies Status](https://david-dm.org/paazmaya/image-duplicate-remover/status.svg)](https://david-dm.org/paazmaya/image-duplicate-remover)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=paazmaya_image-duplicate-remover&metric=code_smells)](https://sonarcloud.io/dashboard?id=paazmaya_image-duplicate-remover)

Too many images that are the same but might have different dates and other metadata.
This tool compares images based on the following criteria:

* [x] SHA-256 hash of the file, since `v0.1.0`
* [x] File size in bytes, will be in `v0.2.0`
* [ ] Width and height, will be in `v0.4.0`
* [ ] Bit depth, will be in `v0.5.0`
* [ ] Number of unique colors, will be in `v0.6.0`
* [ ] Image contents comparison, will be in `v0.7.0`

The idea is to start from stronger method, while progressing towards a weaker method.

Please note that the minimum supported version of [Node.js](https://nodejs.org/en/) is `10.13.0`, which is [the active Long Term Support (LTS) version](https://github.com/nodejs/Release#release-schedule).

Underneath [SQLite](https://github.com/JoshuaWise/better-sqlite3) is used for storing any meta information about the files,
as sometimes the amount of files to compare is huge.

It will be possible to reuse the resulting database file and skip reading the files, in the `v0.2.0` release.
Reading the information from image file is the most time consuming part within the execution of this tool.

## Installation

Starting with version `0.3.0`, additional tools are needed.

Make sure to have [GraphicsMagick](http://www.graphicsmagick.org/) (minimum version `1.3.18`) available in the `PATH`.
It can be installed for example in Mac via [Brew](http://brew.sh):

```sh
brew install graphicsmagick
```

In Ubuntu it is usually available via:

```sh
sudo apt-get install graphicsmagick
```

Windows users could [download an installer package](http://www.graphicsmagick.org/INSTALL-windows.html#installing-using-installer-package).

Now install the command line tool globally, which might need increased privileges:

```sh
[sudo] npm install --global image-duplicate-remover
```

Please note that while in Linux and with `sudo`, some of the dependencies might fail to install,
which can be fixed in some case by `sudo npm install --global --unsafe-perm image-duplicate-remover`.
See more details at [docs.npmjs.com](https://docs.npmjs.com/misc/config#unsafe-perm).

## Command line options

The available command line options can be seen via command:

```sh
image-duplicate-remover --help
```

The output will be something similar to:

```sh
image-duplicate-remover [options] <primary directory> <secondary directory>

  -h, --help             Help and usage instructions
  -V, --version          Version number
  -v, --verbose          Verbose output, will print which file is currently being processed
  -D, --database String  SQLite database to use
  -S, --skip-reading     Skip reading the directories, just use the existing database. Requires database
  -n, --dry-run          Try it out without actually removing anything

Version 0.2.0
```

### Example commands

The following command shows how two folders are compared, but nothing will be removed since the `--dry-run` option is used.

```sh
image-duplicate-remover -vn a b
```

## Contributing

First thing to do is to file [an issue](https://github.com/paazmaya/image-duplicate-remover/issues).

["A Beginner's Guide to Open Source: The Best Advice for Making your First Contribution"](http://www.erikaheidi.com/blog/a-beginners-guide-to-open-source-the-best-advice-for-making-your-first-contribution/).

[Also there is a blog post about "45 Github Issues Dos and Don’ts"](https://davidwalsh.name/45-github-issues-dos-donts).

Linting is done with [ESLint](http://eslint.org) and can be executed with `npm run lint`.
There should be no errors appearing after any JavaScript file changes.

```sh
npm install
npm run lint
```

Automated testing is done against [Ubuntu Trusty at Travis CI](https://travis-ci.org/paazmaya/image-duplicate-remover/)
and [Windows at AppVeyor](https://ci.appveyor.com/project/paazmaya/image-duplicate-remover).

Unit tests are written with [`tape`](https://github.com/substack/tape) and can be executed with `npm test`.
Code coverage is inspected with [`nyc`](https://github.com/istanbuljs/nyc) and
can be executed with `npm run coverage` after running `npm test`.
Please make sure it is over 90% at all times.

## Version history

* `v0.3.0` (2020-06-03)
  - Minimum Node.js version lifted from `8.11.1` to `10.13.0`
  - Run tests also against Node.js version 14. Now versions 10 (Travis), 12 (AppVeyor), and 14 (Travis) of Node.js are covered
* `v0.2.3` (2019-05-29)
  - Update dependencies to avoid any security issues
  - Update tested [GraphicsMagick](https://sourceforge.net/projects/graphicsmagick/) to version `1.3.31`
* `v0.2.2` (2018-12-19)
  - Use [`npm-shrinkwrap.json`](https://docs.npmjs.com/files/shrinkwrap.json) for locking the working set of 3rd party dependencies
  - Previous migration from `node-sqlite3` to `better-sqlite3` was not properly tested #25
  - Renamed the column `sha256` to `hash` in the database table `files`
* `v0.2.1` (2018-08-13)
  - Switched from using `node-sqlite3` to `better-sqlite3` #15
* `v0.2.0` (2018-05-14)
  - Enable the use of existing SQLite database
  - Use `filesize` to find matches too, when `sha256` was not a match
  - Minimum Node.js version lifted from `4.2.0` to `8.11.1`
* `v0.1.0` (2017-02-07)
  - Gets the job simply done with SHA-256 :neckbeard: checking, hence first release. Released 6 months late.

## License

Licensed under [the MIT license](LICENSE).

Copyright (c) [Juga Paazmaya](https://paazmaya.fi) <paazmaya@yahoo.com>
