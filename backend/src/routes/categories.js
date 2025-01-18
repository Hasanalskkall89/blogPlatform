const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const { categoryValidators } = require('../middleware/validators');
const { adminAuth } = require('../middleware/auth');
const config = require('../config');

// Database connection setup
const pool = new Pool({
  connectionString: config.database.connectionString,
  ssl: config.database.ssl
});

// Get all categories - Public access
router.get('/', async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM categories ORDER BY name');
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

// Get single category by ID - Public access
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT c.*, 
             COUNT(p.id) as post_count
      FROM categories c
      LEFT JOIN posts p ON c.id = p.category_id
      WHERE c.id = $1
      GROUP BY c.id
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

// Get posts by category - Public access
router.get('/:id/posts', async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT p.*, c.name as category_name 
      FROM posts p 
      JOIN categories c ON p.category_id = c.id 
      WHERE c.id = $1 
      ORDER BY p.created_at DESC
    `, [id]);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

// Create new category - Admin only
router.post('/', adminAuth, categoryValidators.create, async (req, res, next) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    const { name } = req.body;
    
    // Check if category name already exists
    const existingCategory = await client.query(
      'SELECT id FROM categories WHERE name = $1',
      [name]
    );
    
    if (existingCategory.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Category name already exists' });
    }
    
    const result = await client.query(
      'INSERT INTO categories (name) VALUES ($1) RETURNING *',
      [name]
    );
    
    await client.query('COMMIT');
    res.status(201).json(result.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    next(err);
  } finally {
    client.release();
  }
});

// Update category - Admin only
router.put('/:id', adminAuth, categoryValidators.update, async (req, res, next) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    const { id } = req.params;
    const { name } = req.body;
    
    // Check if another category with the same name exists
    const existingCategory = await client.query(
      'SELECT id FROM categories WHERE name = $1 AND id != $2',
      [name, id]
    );
    
    if (existingCategory.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Another category with the same name exists' });
    }
    
    const result = await client.query(
      'UPDATE categories SET name = $1 WHERE id = $2 RETURNING *',
      [name, id]
    );
    
    if (result.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Category not found' });
    }
    
    await client.query('COMMIT');
    res.json(result.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    next(err);
  } finally {
    client.release();
  }
});

// Delete category - Admin only
router.delete('/:id', adminAuth, categoryValidators.update[0], async (req, res, next) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    const { id } = req.params;
    
    // Check if there are posts in this category
    const posts = await client.query(
      'SELECT id FROM posts WHERE category_id = $1 LIMIT 1',
      [id]
    );
    
    if (posts.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ 
        error: 'Cannot delete category because it has posts' 
      });
    }
    
    const result = await client.query(
      'DELETE FROM categories WHERE id = $1 RETURNING *',
      [id]
    );
    
    if (result.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Category not found' });
    }
    
    await client.query('COMMIT');
    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    await client.query('ROLLBACK');
    next(err);
  } finally {
    client.release();
  }
});

module.exports = router;
