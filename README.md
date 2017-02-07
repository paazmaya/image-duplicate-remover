# image-duplicate-remover

> Remove duplicate images from the two given directories recursively

[![Ubuntu build Status](https://travis-ci.org/paazmaya/image-duplicate-remover.svg?branch=master)](https://travis-ci.org/paazmaya/image-duplicate-remover)
[![Windows build status](https://ci.appveyor.com/api/projects/status/gmjc0bi0bbydb667/branch/master?svg=true)](https://ci.appveyor.com/project/paazmaya/image-duplicate-remover/branch/master)
[![codecov](https://codecov.io/gh/paazmaya/image-duplicate-remover/branch/master/graph/badge.svg)](https://codecov.io/gh/paazmaya/image-duplicate-remover)

Too many images that are the same but might have different dates and other metadata.
This tool compares images based on the following criteria:

* [x] SHA-256 hash of the file, since `v0.1.0`
* [ ] File size in bytes, will be in `v0.2.0`
* [ ] Width and height, will be in `v0.3.0`
* [ ] Bit depth, will be in `v0.3.0`
* [ ] Number of unique colors, will be in `v0.3.0`
* [ ] Image contents comparison, will be in `v0.4.0`

Please note that the minimum supported version of [Node.js](https://nodejs.org/en/) is `4.2.0`.

Underneath [SQLite](https://github.com/mapbox/node-sqlite3) is used for storing any meta information about the files,
as sometimes the amount of files to compare is huge.

It will be possible to reuse the resulting database file and skip reading the files, in the `v0.2.0` release.
Reading the information from image file is the most time consuming part within the execution of this tool.

## Installation

Starting with version `0.3.0`, additional tools are needed.

Make sure to have [GraphicsMagick](http://www.graphicsmagick.org/) (minimum version `1.3.24`) available in the `PATH`.
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

## Command line options

```sh
image-duplicate-remover --help
```

```sh
image-duplicate-remover [options] <primary directory> <secondary directory>

  -h, --help            Help and usage instructions
  -V, --version         Version number
  -v, --verbose         Verbose output, will print which file is currently being processed
  -n, --dry-run         Try it out without actually removing anything

Version 0.1.0
```

### Example commands

The following command shows how two folders are compared, but nothing will be removed since the `--dry-run` option is used.

```sh
image-duplicate-remover -vn a b
```

## Contributing

First thing to do is to file [an issue](https://github.com/paazmaya/image-duplicate-remover/issues).

["A Beginner's Guide to Open Source: The Best Advice for Making your First Contribution"](http://hf.heidilabs.com/blog/a-beginners-guide-to-open-source-making-your-first-contribution).

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

* `v0.1.0` (2017-02-07)
    - Gets the job simply done with SHA-256 :neckbeard: checking, hence first release. Released 6 months late.

## License

Licensed under [the MIT license](LICENSE).

Copyright (c) [Juga Paazmaya](https://paazmaya.fi) <paazmaya@yahoo.com>
