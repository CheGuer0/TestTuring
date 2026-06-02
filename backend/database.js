const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

const dbPath = path.resolve(__dirname, process.env.DATABASE_FILE || 'turing_tech_store.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error al conectar con la base de datos SQLite:', err.message);
  } else {
    console.log(`Conectado a la base de datos SQLite en: ${dbPath}`);
    db.run('PRAGMA foreign_keys = ON;', (fkErr) => {
      if (fkErr) {
        console.error('Error al habilitar llaves foráneas:', fkErr.message);
      } else {
        console.log('Soporte de llaves foráneas habilitado.');
      }
    });
  }
});

const dbQuery = {
  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      db.run(sql, params, function (err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, changes: this.changes });
        }
      });
    });
  },

  get(sql, params = []) {
    return new Promise((resolve, reject) => {
      db.get(sql, params, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  },

  all(sql, params = []) {
    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  },

  exec(sql) {
    return new Promise((resolve, reject) => {
      db.exec(sql, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
};

const initDatabase = async () => {
  try {
    await dbQuery.exec(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario TEXT NOT NULL UNIQUE,
        correo TEXT NOT NULL UNIQUE,
        contrasena_hash TEXT NOT NULL,
        rol TEXT NOT NULL DEFAULT 'user',
        creado_en DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await dbQuery.exec(`
      CREATE TABLE IF NOT EXISTS categorias (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL UNIQUE,
        descripcion TEXT
      );
    `);

    await dbQuery.exec(`
      CREATE TABLE IF NOT EXISTS productos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        descripcion TEXT NOT NULL,
        especificaciones TEXT,
        precio REAL NOT NULL,
        stock INTEGER NOT NULL DEFAULT 0,
        imagen_url TEXT,
        categoria_id INTEGER NOT NULL,
        creado_por INTEGER NOT NULL,
        creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (categoria_id) REFERENCES categorias (id) ON DELETE CASCADE,
        FOREIGN KEY (creado_por) REFERENCES usuarios (id) ON DELETE RESTRICT
      );
    `);

    console.log('Esquema de base de datos verificado/creado con éxito en español (3 tablas).');
  } catch (error) {
    console.error('Error al inicializar el esquema de la base de datos:', error);
    process.exit(1);
  }
};

module.exports = {
  db,
  dbQuery,
  initDatabase
};

