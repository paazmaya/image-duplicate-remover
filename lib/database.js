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

const fs = require('fs');

const Better3 = require('better-sqlite3');

const DEFAULT_DATABASE = ':memory:';

/**
 * Create and initialise SQLite database and tables, which by default is in memory.
 *
 * @param  {string} location Where shall the database be stored, defauts to ':memory:'
 * @returns {sqlite3.Database} Database instance
 * @see http://sqlite.org/lang_createtable.html
 */
const createDatabase = (location) => {
  location = location || DEFAULT_DATABASE;

  const opts = {
    memory: false
  };

  if (location === DEFAULT_DATABASE) {
    location = 'in-memory';
    opts.memory = true;
  }

  const db = new Better3(location, opts);

  // Create tables that are needed. Alphaletically ordered keys after primary key and sha256
  // https://www.sqlite.org/withoutrowid.html
  db.exec(`
    CREATE TABLE IF NOT EXISTS files (
      filepath TEXT PRIMARY KEY,
      sha256 TEXT,
      filesize REAL,
      bitdepth REAL,
      height REAL,
      timestamp REAL,
      uniquecolors REAL,
      width REAL
    ) WITHOUT ROWID
  `);

  return db;
};

const saveDatabaseContents = (db, filename) => {
  // TODO: check that filename can be written first
  const query = db.prepare('SELECT * FROM files');
  const data = {
    files: []
  };
  const rows = query.all(query);

  if (!rows) {
    console.error('Database query failed');
  }
  else {
    data.files = rows;
    const json = JSON.stringify(data, null, ' ');

    fs.writeFileSync(filename, json, 'utf8');
  }
};

module.exports = {
  connect: createDatabase,
  saveJSON: saveDatabaseContents
};
