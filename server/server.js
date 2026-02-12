const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure upload directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Database Setup
const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) {
        console.error('Error opening database', err);
    } else {
        console.log('Connected to SQLite database');
        db.run(`CREATE TABLE IF NOT EXISTS listings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            brand TEXT,
            model TEXT,
            year INTEGER,
            price INTEGER,
            mileage INTEGER,
            description TEXT,
            contact_name TEXT,
            contact_phone TEXT,
            contact_email TEXT,
            password TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            status TEXT DEFAULT 'available'
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS images (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            listing_id INTEGER,
            url TEXT,
            FOREIGN KEY(listing_id) REFERENCES listings(id)
        )`);
    }
});

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'server/uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// API Routes

// Get all listings
app.get('/api/listings', (req, res) => {
    const query = `
        SELECT l.*, i.url as main_image 
        FROM listings l 
        LEFT JOIN images i ON l.id = i.listing_id 
        GROUP BY l.id 
        ORDER BY l.created_at DESC
    `;
    db.all(query, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Get single listing with images
app.get('/api/listings/:id', (req, res) => {
    const { id } = req.params;
    db.get('SELECT * FROM listings WHERE id = ?', [id], (err, listing) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!listing) {
            res.status(404).json({ error: 'Listing not found' });
            return;
        }

        db.all('SELECT url FROM images WHERE listing_id = ?', [id], (err, images) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ ...listing, images });
        });
    });
});

// Create new listing
app.post('/api/listings', upload.array('images', 5), (req, res) => {
    const { title, brand, model, year, price, mileage, description, contactName, contactPhone, contactEmail, password } = req.body;

    // Basic validation
    if (!title || !price || !contactPhone) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const stmt = db.prepare(`INSERT INTO listings (title, brand, model, year, price, mileage, description, contact_name, contact_phone, contact_email, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

    stmt.run([title, brand, model, year, price, mileage, description, contactName, contactPhone, contactEmail, password], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        const listingId = this.lastID;

        if (req.files && req.files.length > 0) {
            const imgStmt = db.prepare('INSERT INTO images (listing_id, url) VALUES (?, ?)');
            req.files.forEach(file => {
                const imageUrl = `/uploads/${file.filename}`;
                imgStmt.run([listingId, imageUrl]);
            });
            imgStmt.finalize();
        }

        res.status(201).json({ id: listingId, message: 'Listing created successfully' });
    });
    stmt.finalize();
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
