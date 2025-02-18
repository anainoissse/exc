require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const PORT = process.env.PORT || 3000;
const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
    connectionString: "postgresql://booking_user:50BzYaEds0xRvslLNXR84BWTVLBpG6Gm@dpg-cupn87pu0jms73bpohl0-a.oregon-postgres.render.com/ks_6m34",
    ssl: { rejectUnauthorized: false } // Важно для Render!
});

pool.connect()
  .then(() => console.log("✅ Успешное подключение к базе данных"))
  .catch(err => console.error("❌ Ошибка подключения к базе:", err));



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
    res.sendFile(__dirname + '/public/exc.html');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}...`));
