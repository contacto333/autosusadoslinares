const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

async function seedAdmin() {
    const email = 'admin@autoslinares.cl';
    const password = 'admin123';
    const hashedPassword = await bcrypt.hash(password, 10);

    db.serialize(() => {
        db.run("INSERT OR IGNORE INTO users (email, password, role) VALUES (?, ?, ?)",
            [email, hashedPassword, 'admin'], (err) => {
                if (err) {
                    console.error('Error seeding admin:', err.message);
                } else {
                    console.log('Admin user seeded successfully or already exists.');
                    console.log('Email: ' + email);
                    console.log('Password: ' + password);
                }
                db.close();
            });
    });
}

seedAdmin();
