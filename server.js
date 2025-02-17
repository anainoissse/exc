require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const PORT = process.env.PORT || 3000;
const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

app.post('/book', async (req, res) => {
    const { name, email, date } = req.body;
    try {
        await pool.query('INSERT INTO bookings (name, email, date) VALUES ($1, $2, $3)', [name, email, date]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/bookings', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM bookings');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// Добавляем серверу возможность отдавать статичные файлы
app.use(express.static('public'));

// Если нужно обработать корневой путь:
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}...`));
