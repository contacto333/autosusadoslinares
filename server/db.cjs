const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// For Vercel, we might need the DB in /tmp to allow writes, 
// but it will reset on cold starts. For an MVP, we use the bundled one.
const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) console.error('Database connection error:', err.message);
});

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT,
    phone TEXT,
    role TEXT DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS listings (
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
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    listing_id INTEGER,
    url TEXT,
    FOREIGN KEY(listing_id) REFERENCES listings(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS banners (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        image_url TEXT,
        link_url TEXT,
        click_count INTEGER DEFAULT 0,
        active BOOLEAN DEFAULT 1
    )`);

  db.run(`CREATE TABLE IF NOT EXISTS featured (
        listing_id INTEGER UNIQUE,
        order_index INTEGER,
        FOREIGN KEY(listing_id) REFERENCES listings(id)
    )`);
});

module.exports = db;
