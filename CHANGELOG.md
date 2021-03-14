# Version history for image-duplicate-remover

This changelog covers the version history and possible upcoming changes.
It follows the guidance from https://keepachangelog.com/en/1.0.0/.

## Unreleased `v0.x.0` (2021)
- Move testing with Node.js version 14 to GitHub Actions, away from Travis CI, since Travis has now stricter limitations on usage. Travis in now used to test only with Node.js version 10.

## `v0.3.0` (2020-06-03)
- Minimum Node.js version lifted from `8.11.1` to `10.13.0`
- Run tests also against Node.js version 14. Now versions 10 (Travis), 12 (AppVeyor), and 14 (Travis) of Node.js are covered

## `v0.2.3` (2019-05-29)
- Update dependencies to avoid any security issues
- Update tested [GraphicsMagick](https://sourceforge.net/projects/graphicsmagick/) to version `1.3.31`

## `v0.2.2` (2018-12-19)
- Use [`npm-shrinkwrap.json`](https://docs.npmjs.com/files/shrinkwrap.json) for locking the working set of 3rd party dependencies
- Previous migration from `node-sqlite3` to `better-sqlite3` was not properly tested #25
- Renamed the column `sha256` to `hash` in the database table `files`

## `v0.2.1` (2018-08-13)
- Switched from using `node-sqlite3` to `better-sqlite3` #15

## `v0.2.0` (2018-05-14)
- Enable the use of existing SQLite database
- Use `filesize` to find matches too, when `sha256` was not a match
- Minimum Node.js version lifted from `4.2.0` to `8.11.1`

## `v0.1.0` (2017-02-07)
- Gets the job simply done with SHA-256 :neckbeard: checking, hence first release. Released 6 months late.
