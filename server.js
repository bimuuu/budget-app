const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

// 1. Middleware
app.use(cors());
app.use(express.json()); // สำคัญ! ให้อ่าน JSON ที่ส่งมาจากหน้าบ้านได้
app.use(express.static('public'));

// 2. Setup Database (SQLite)
// เปิดไฟล์ database (ถ้าไม่มี มันจะสร้างไฟล์ budget.db ให้เอง)
const db = new sqlite3.Database('./budget.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the budget database.');
});

// สร้าง Table ถ้ายังไม่มี
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        text TEXT NOT NULL,
        amount REAL NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
});

// 3. API Routes (เส้นทางรับส่งข้อมูล)

// [GET] ดึงข้อมูลทั้งหมด
app.get('/api/transactions', (req, res) => {
    const sql = "SELECT * FROM transactions ORDER BY created_at DESC";
    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ data: rows });
    });
});

// [POST] เพิ่มรายการใหม่
app.post('/api/transactions', (req, res) => {
    const { text, amount } = req.body;
    const sql = "INSERT INTO transactions (text, amount) VALUES (?, ?)";
    const params = [text, amount];

    db.run(sql, params, function(err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({
            message: "success",
            data: { id: this.lastID, text, amount }
        });
    });
});

// [DELETE] ลบรายการตาม ID
app.delete('/api/transactions/:id', (req, res) => {
    const sql = "DELETE FROM transactions WHERE id = ?";
    const params = [req.params.id];

    db.run(sql, params, function(err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ message: "deleted", changes: this.changes });
    });
});

// เริ่มต้น Server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});