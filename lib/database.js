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

import constants from 'tozan/lib/constants.js';
import createDatabase from 'tozan/lib/create-database.js';

const CREATE_TABLE = `
  CREATE TABLE IF NOT EXISTS files (
    filepath TEXT PRIMARY KEY,
    hash TEXT,
    filesize REAL,
    bitdepth REAL,
    height REAL,
    timestamp REAL,
    uniquecolors REAL,
    width REAL
  ) WITHOUT ROWID
`;

/**
 * Create and initialise SQLite database and tables, which by default is in memory.
 *
 * @param {string} location Where shall the database be stored, defauts to ':memory:'
 * @returns {sqlite3.Database} Database instance
 * @see http://sqlite.org/lang_createtable.html
 */
const connect = (location) => {
  location = location || constants.DEFAULT_DATABASE;

  return createDatabase(location, CREATE_TABLE);
};

const saveDatabaseContents = (db, filename) => {
  // TODO: check that filename can be written first
  const query = db.prepare('SELECT * FROM files');
  const data = {
    files: []
  };
  const rows = query.all();

  if (!rows) {
    console.error('Database query failed');
  }
  else {
    data.files = rows;
    const json = JSON.stringify(data, null, ' ');

    fs.writeFileSync(filename, json, 'utf8');
  }
};

export default {
  connect: connect,
  saveJSON: saveDatabaseContents
};
