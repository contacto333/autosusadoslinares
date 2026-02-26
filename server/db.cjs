const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const isVercel = process.env.VERCEL === '1' || !!process.env.VERCEL;
const useTurso = !!process.env.TURSO_DATABASE_URL;

console.log('[DB DIAGOSTIC] VERCEL:', process.env.VERCEL);
console.log('[DB DIAGOSTIC] HAS_TURSO_DATABASE_URL:', !!process.env.TURSO_DATABASE_URL);
console.log('[DB DIAGOSTIC] HAS_TURSO_AUTH_TOKEN:', !!process.env.TURSO_AUTH_TOKEN);

let db;

if (useTurso) {
  console.log('[DB LOG] Establishing connection to Turso Cloud...');
  const { createClient } = require('@libsql/client');
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  // Wrapper to mimic sqlite3 behavior for index.cjs helpers
  db = {
    run: async (sql, params, callback) => {
      try {
        const result = await client.execute({ sql, args: params || [] });
        // Convert BigInt to Number to avoid serialization errors
        const lastID = result.lastInsertRowid ? Number(result.lastInsertRowid) : null;
        if (callback) callback.call({ lastID }, null);
      } catch (err) {
        if (callback) callback(err);
      }
    },
    get: async (sql, params, callback) => {
      try {
        const result = await client.execute({ sql, args: params || [] });
        if (callback) callback(null, result.rows[0]);
      } catch (err) {
        if (callback) callback(err);
      }
    },
    all: async (sql, params, callback) => {
      try {
        const result = await client.execute({ sql, args: params || [] });
        if (callback) callback(null, result.rows);
      } catch (err) {
        if (callback) callback(err);
      }
    },
    prepare: (sql) => {
      // Minimal prepare mock for current usage
      return {
        run: async (params, callback) => {
          try {
            const result = await client.execute({ sql, args: params || [] });
            // Convert BigInt to Number to avoid serialization errors
            const lastID = result.lastInsertRowid ? Number(result.lastInsertRowid) : null;
            if (callback) callback.call({ lastID }, null);
          } catch (err) {
            if (callback) callback(err);
          }
        },
        finalize: () => { }
      };
    },
    serialize: (cb) => cb() // LibSQL doesn't need serialize
  };
} else {
  const bundleDbPath = path.resolve(__dirname, 'database.sqlite');
  let dbPath = bundleDbPath;

  if (isVercel) {
    dbPath = '/tmp/database.sqlite';
    if (!fs.existsSync(dbPath) && fs.existsSync(bundleDbPath)) {
      try {
        fs.copyFileSync(bundleDbPath, dbPath);
        console.log('Database provisioned in /tmp');
      } catch (err) {
        console.error('Database provisioning failed:', err);
      }
    }
  }

  db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) console.error('Database connection error:', err.message);
  });
}

// Initialization Logic
const initDb = async () => {
  console.log('Initializing database...');
  const queries = [
    `CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE,
            password TEXT,
            phone TEXT,
            role TEXT DEFAULT 'user',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`,
    `CREATE TABLE IF NOT EXISTS listings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            title TEXT,
            brand TEXT,
            model TEXT,
            year INTEGER,
            price INTEGER,
            mileage INTEGER,
            description TEXT,
            contact_name TEXT,
            contact_phone TEXT,
            status TEXT DEFAULT 'available',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            expires_at DATETIME,
            views INTEGER DEFAULT 0,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )`,
    `CREATE TABLE IF NOT EXISTS images (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            listing_id INTEGER,
            url TEXT,
            FOREIGN KEY(listing_id) REFERENCES listings(id)
        )`,
    `CREATE TABLE IF NOT EXISTS banners (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            image_url TEXT,
            link_url TEXT,
            click_count INTEGER DEFAULT 0,
            active BOOLEAN DEFAULT 1
        )`,
    `CREATE TABLE IF NOT EXISTS featured (
            listing_id INTEGER UNIQUE,
            order_index INTEGER,
            FOREIGN KEY(listing_id) REFERENCES listings(id)
        )`
  ];

  if (useTurso) {
    try {
      console.log('[DB LOG] Turso: Creating/checking tables...');
      for (const q of queries) {
        // Extract table name from query for logging
        const tableName = q.match(/CREATE TABLE IF NOT EXISTS (\w+)/)[1];
        await new Promise((resolve, reject) => {
          db.run(q, [], (err) => {
            if (err) {
              console.error(`[DB ERROR] Failed to initialize table ${tableName}:`, err);
              reject(err);
            } else {
              console.log(`[DB LOG] Table ${tableName} verified.`);
              resolve();
            }
          });
        });
      }
      console.log('[DB SUCCESS] Turso Database tables verified/created successfully');

      // Seed Admin User if not exists (Synchronous/Awaited flow)
      console.log('[DB LOG] Checking for admin user...');
      const adminEmail = 'admin@autoslinares.cl';
      const bcrypt = require('bcryptjs');
      const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

      try {
        const row = await new Promise((resolve, reject) => {
          db.get("SELECT * FROM users WHERE email = ?", [adminEmail], (err, row) => {
            if (err) reject(err); else resolve(row);
          });
        });

        if (!row) {
          console.log('[DB LOG] Admin user missing. Seeding...');
          const hashedPassword = await bcrypt.hash(adminPassword, 10);
          await new Promise((resolve, reject) => {
            db.run("INSERT INTO users (email, password, role) VALUES (?, ?, ?)", [adminEmail, hashedPassword, 'admin'], (err) => {
              if (err) reject(err); else resolve();
            });
          });
          console.log('[DB SUCCESS] Admin user seeded successfully.');
        } else {
          console.log('[DB LOG] Admin user already exists.');
        }
      } catch (seedErr) {
        console.error('[DB ERROR] Error seeding admin:', seedErr);
      }

    } catch (err) {
      console.error('[DB CRITICAL ERROR] Error initializing Turso Database:', err);
    }
  } else {
    db.serialize(() => {
      queries.forEach(q => {
        db.run(q, (err) => {
          if (err) console.error('Error creating table:', err);
        });
      });
      console.log('Local SQLite Database tables verified/created successfully');

      // Also seed local for consistency
      const adminEmail = 'admin@autoslinares.cl';
      const bcrypt = require('bcryptjs');
      db.get("SELECT * FROM users WHERE email = ?", [adminEmail], async (err, row) => {
        if (!row) {
          const hashedPassword = await bcrypt.hash('admin123', 10);
          db.run("INSERT INTO users (email, password, role) VALUES (?, ?, ?)", [adminEmail, hashedPassword, 'admin']);
        }
      });
    });
  }
};

// Start initialization
initDb().catch(err => console.error('Unhandled initialization error:', err));


module.exports = db;

