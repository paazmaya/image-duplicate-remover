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

const sqlite3 = require('sqlite3');

/**
 * Create and initialise SQLite database and tables, which by default is in memory.
 *
 * @param  {string} location Where shall the database be stored, defauts to ':memory:'
 * @returns {sqlite3.Database} Database instanse
 */
const createDatabase = (location) => {
  location = location || ':memory:';
  const db = new sqlite3.Database(location, (error) => {
    if (error) {
      console.error('Database opening/creation failed');
      console.error(error);
      process.exit(1);
    }
  });

  // Create tables that are needed. Alphaletically ordered keys after primary key and sha256
  // TODO: Should be able to check if the table already exists
  db.serialize(() => {
    // https://www.sqlite.org/lang_createtable.html
    // https://www.sqlite.org/withoutrowid.html
    db.run(`
      CREATE TABLE files (
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
  });

  return db;
};


const saveDatabaseContents = (db, filename) => {
  db.serialize(() => {
    const query = 'SELECT * FROM files';
    const data = {
      files: []
    };
    db.all(query, (error, rows) => {
      if (error) {
        console.error('Database query failed');
        console.error(error);
      }
      else {
        data.files = rows;
        const json = JSON.stringify(data, null, ' ');

        fs.writeFileSync(filename, json, 'utf8');
      }
    });
  });
};


module.exports = {
  connect: createDatabase,
  saveJSON: saveDatabaseContents
};
