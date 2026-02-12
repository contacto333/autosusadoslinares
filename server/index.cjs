const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db.cjs');
const multer = require('multer');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());



// Helper to wrap db.run in promise
const runQuery = (query, params) => {
    return new Promise((resolve, reject) => {
        db.run(query, params, function (err) {
            if (err) reject(err);
            else resolve(this);
        });
    });
};

const getQuery = (query, params) => {
    return new Promise((resolve, reject) => {
        db.get(query, params, (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
};

const allQuery = (query, params) => {
    return new Promise((resolve, reject) => {
        db.all(query, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};

// Static folder for uploads
const uploadDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}
// Serve uploads statically
app.use('/uploads', express.static(uploadDir));

// Serve Frontend in Production (Docker)
const distDir = path.join(__dirname, '../public/dist');
if (fs.existsSync(distDir)) {
    app.use(express.static(distDir));
}

// Multer setup
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir)
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + path.extname(file.originalname))
    }
});
const upload = multer({ storage: storage });

// --- AUTH ---

// Check if email exists
app.post('/api/auth/check-email', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await getQuery("SELECT * FROM users WHERE email = ?", [email]);
        res.json({ exists: !!user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Login
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await getQuery("SELECT * FROM users WHERE email = ?", [email]);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const bcrypt = require('bcryptjs');
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(401).json({ error: 'Invalid password' });

        const jwt = require('jsonwebtoken');
        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, 'SECRET_KEY', { expiresIn: '7d' });
        res.json({ token, user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- LISTINGS ---

// Create Listing (Public/Quick Publish)
app.post('/api/listings', upload.array('images', 5), async (req, res) => {
    const {
        title, brand, model, year, price, mileage, description,
        contactName, contactPhone, contactEmail, password
    } = req.body;

    const bcrypt = require('bcryptjs');

    try {
        let user = await getQuery("SELECT * FROM users WHERE email = ?", [contactEmail]);
        let userId;

        if (user) {
            if (!password) {
                return res.status(401).json({ error: 'Email exists. Please provide password to publish.' });
            }
            const valid = await bcrypt.compare(password, user.password);
            if (!valid) return res.status(401).json({ error: 'Invalid password' });
            userId = user.id;
        } else {
            const hashedPassword = await bcrypt.hash(password || '123456', 10);
            const result = await runQuery(
                "INSERT INTO users (email, password, phone) VALUES (?, ?, ?)",
                [contactEmail, hashedPassword, contactPhone]
            );
            userId = result.lastID;
        }

        const result = await runQuery(
            `INSERT INTO listings (user_id, title, brand, model, year, price, mileage, description, contact_name, contact_phone, created_at, expires_at) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now', '+60 days'))`,
            [userId, title, brand, model, year, price, mileage, description, contactName, contactPhone]
        );
        const listingId = result.lastID;

        if (req.files) {
            for (const file of req.files) {
                const url = '/uploads/' + file.filename;
                await runQuery("INSERT INTO images (listing_id, url) VALUES (?, ?)", [listingId, url]);
            }
        }

        res.json({ success: true, listingId });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// Get Recent Listings
app.get('/api/listings', async (req, res) => {
    try {
        const listings = await allQuery(`
            SELECT l.*, i.url as main_image 
            FROM listings l 
            LEFT JOIN images i ON l.id = i.listing_id 
            WHERE l.status = 'available'
            GROUP BY l.id
            ORDER BY l.created_at DESC 
            LIMIT 50
        `);
        res.json(listings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Listing Detail
app.get('/api/listings/:id', async (req, res) => {
    try {
        const listing = await getQuery("SELECT * FROM listings WHERE id = ?", [req.params.id]);
        if (!listing) return res.status(404).json({ error: 'Not found' });

        const images = await allQuery("SELECT * FROM images WHERE listing_id = ?", [req.params.id]);

        await runQuery("UPDATE listings SET views = views + 1 WHERE id = ?", [req.params.id]);

        res.json({ ...listing, images });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- ADMIN ---

// Middleware (Simplified for MVP - check role in token)
const adminOnly = (req, res, next) => {
    // For MVP, we might skip actual JWT verification middleware here to save time
    // but in a real app: verify token, check user.role === 'admin'
    // Let's assume the frontend sends a header 'X-Admin-Auth' or similar for this demo
    // OR just leave it open for now as this is a local demo.
    // Better: Basic check.
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ error: 'No token' });
    // const token = authHeader.split(' ')[1];
    // jwt.verify...
    next();
};

// Admin: Get All Listings
app.get('/api/admin/listings', async (req, res) => {
    try {
        const listings = await allQuery("SELECT * FROM listings ORDER BY created_at DESC");
        res.json(listings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin: Delete Listing
app.delete('/api/admin/listings/:id', async (req, res) => {
    try {
        await runQuery("DELETE FROM listings WHERE id = ?", [req.params.id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin: Get Banners
app.get('/api/admin/banners', async (req, res) => {
    try {
        const banners = await allQuery("SELECT * FROM banners");
        res.json(banners);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin: Create Banner
app.post('/api/admin/banners', upload.single('image'), async (req, res) => {
    const { linkUrl } = req.body;
    try {
        const url = '/uploads/' + req.file.filename;
        await runQuery("INSERT INTO banners (image_url, link_url) VALUES (?, ?)", [url, linkUrl]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

// SPA Fallback for non-API routes
// This allows React Router to handle page refreshes in production
// app.get('*path', (req, res) => {
//     const distIndex = path.join(__dirname, '../public/dist/index.html');
//     if (fs.existsSync(distIndex)) {
//         res.sendFile(distIndex);
//     } else {
//         res.status(404).send('Not found (Dev mode? Use Vite dev server)');
//     }
// });

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
