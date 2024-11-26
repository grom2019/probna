const express = require('express');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
const port = 3000;

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'new_password',
    database: 'mydatabase',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));


// Реєстрація
app.post('/api/register', async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Усі поля обов’язкові!' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
        await pool.execute(query, [name, email, hashedPassword]);
        res.json({ message: 'Користувач успішно зареєстрований!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Помилка сервера!' });
    }
});

// Вхід
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Усі поля обов’язкові!' });
    }

    try {
        const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length === 0) {
            return res.status(400).json({ message: 'Користувача не знайдено!' });
        }

        const user = rows[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ message: 'Невірний пароль!' });
        }

        res.json({ message: 'Успішний вхід!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Помилка сервера!' });
    }
});

// Запуск сервера
app.listen(port, () => {
    console.log(`Сервер працює на http://localhost:${port}`);
});
