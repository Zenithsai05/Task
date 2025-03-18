const express = require('express');
const router = express.Router();
const db = require('../config/db');
const jwt = require('jsonwebtoken');

router.post('/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    db.query('SELECT * FROM employees WHERE email = ?', [email], (err, result) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        if (result.length === 0 || result[0].password !== password) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const user = result[0];
        const token = jwt.sign({ id: user.id, role: user.role, name: user.name }, process.env.JWT_SECRET);
        res.json({ token, role: user.role });
    });
});

router.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }
    if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    db.query('INSERT INTO employees (name, email, password) VALUES (?, ?, ?)', 
        [name, email, password], (err) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ message: 'Email already exists' });
                return res.status(500).json({ message: 'Database error' });
            }
            res.json({ message: 'Employee registered successfully' });
        });
});

// New Forgot Password Endpoint
router.post('/forgot-password', (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    db.query('SELECT password FROM employees WHERE email = ?', [email], (err, result) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        if (result.length === 0) {
            return res.status(404).json({ message: 'Email not found' });
        }
        res.json({ message: `Your password is: ${result[0].password}` });
    });
});

module.exports = router;