const express = require('express');
const router = express.Router();
const db = require('../config/db');
const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ message: 'No token provided' });
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ message: 'Invalid token' });
        req.user = decoded;
        next();
    });
};

router.get('/employees', authenticate, (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Unauthorized' });
    db.query('SELECT id, name FROM employees WHERE role = "employee"', (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        res.json(results);
    });
});

router.post('/add', authenticate, (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Unauthorized' });
    const { employee_id, task_name, description } = req.body;
    if (!employee_id || !task_name || !description) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    db.query('INSERT INTO tasks (employee_id, task_name, description, created_at) VALUES (?, ?, ?, NOW())', 
        [employee_id, task_name, description], (err) => {
            if (err) return res.status(500).json({ message: 'Database error' });
            res.json({ message: 'Task added successfully' });
        });
});

// Updated to fetch all tasks for admin
router.get('/all', authenticate, (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Unauthorized' });
    db.query('SELECT t.*, e.name AS employee_name FROM tasks t JOIN employees e ON t.employee_id = e.id', (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        res.json(results);
    });
});

router.get('/employee', authenticate, (req, res) => {
    db.query('SELECT * FROM tasks WHERE employee_id = ?', [req.user.id], (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        res.json(results);
    });
});

router.put('/update/:id', authenticate, (req, res) => {
    const { status } = req.body;
    if (!['active', 'completed', 'failed'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
    }

    db.query('UPDATE tasks SET status = ?, updated_at = NOW() WHERE id = ? AND employee_id = ?', 
        [status, req.params.id, req.user.id], (err) => {
            if (err) return res.status(500).json({ message: 'Database error' });
            res.json({ message: 'Task updated successfully' });
        });
});

module.exports = router;