const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body } = require('express-validator');
const { validate } = require('../middleware/validators');
const config = require('../config');
const { verifyToken } = require('../middleware/auth');
const { pool } = require('../db');

// Login validation rules
const loginValidation = [
  body('username')
    .trim()
    .notEmpty().withMessage('Username is required'),
  body('password')
    .trim()
    .notEmpty().withMessage('Password is required'),
  validate
];

// Admin login route
router.post('/login', loginValidation, async (req, res, next) => {
  const client = await pool.connect();
  try {
    const { username, password } = req.body;

    // Check if user exists
    const result = await client.query(
      'SELECT * FROM admins WHERE username = $1',
      [username]
    );

    const admin = result.rows[0];
    if (!admin) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, admin.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Generate token
    const token = jwt.sign(
      { id: admin.id, username: admin.username, isAdmin: true },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    res.json({
      token,
      user: {
        id: admin.id,
        username: admin.username
      }
    });
  } catch (err) {
    next(err);
  } finally {
    client.release();
  }
});

// Change password route
router.post('/change-password', [
  verifyToken,
  body('currentPassword')
    .trim()
    .notEmpty().withMessage('Current password is required'),
  body('newPassword')
    .trim()
    .notEmpty().withMessage('New password is required')
    .isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
  validate
], async (req, res, next) => {
  const client = await pool.connect();
  try {
    const { currentPassword, newPassword } = req.body;

    // Check if user exists
    const result = await client.query(
      'SELECT * FROM admins WHERE id = $1',
      [req.user.id]
    );

    const admin = result.rows[0];
    if (!admin) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify current password
    const validPassword = await bcrypt.compare(currentPassword, admin.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    await client.query(
      'UPDATE admins SET password = $1 WHERE id = $2',
      [hashedPassword, req.user.id]
    );

    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    next(err);
  } finally {
    client.release();
  }
});

module.exports = router;
