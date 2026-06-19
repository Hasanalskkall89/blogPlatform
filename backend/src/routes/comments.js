const express = require('express');
const router = express.Router();
const { commentValidators } = require('../middleware/validators');
const { adminAuth } = require('../middleware/auth');
const { pool } = require('../db');

// Get comments for a specific post
router.get('/post/:postId', commentValidators.create[0], async (req, res, next) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { postId } = req.params;
    
    // Check if post exists and comments are enabled
    const postCheck = await client.query(
      'SELECT comments_enabled FROM posts WHERE id = $1',
      [postId]
    );
    
    if (postCheck.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Post not found' });
    }
    
    const result = await client.query(`
      SELECT * FROM comments 
      WHERE post_id = $1 
      ORDER BY created_at DESC
    `, [postId]);
    
    await client.query('COMMIT');
    res.json(result.rows);
  } catch (err) {
    await client.query('ROLLBACK');
    next(err);
  } finally {
    client.release();
  }
});

// Add new comment
router.post('/post/:postId', commentValidators.create, async (req, res, next) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    const { postId } = req.params;
    const { author_name, content } = req.body;
    
    // Check if post exists and comments are enabled
    const postCheck = await client.query(
      'SELECT comments_enabled FROM posts WHERE id = $1',
      [postId]
    );
    
    if (postCheck.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Post not found' });
    }
    
    if (!postCheck.rows[0].comments_enabled) {
      await client.query('ROLLBACK');
      return res.status(403).json({ error: 'Comments are disabled for this post' });
    }
    
    const result = await client.query(`
      INSERT INTO comments (post_id, author_name, content) 
      VALUES ($1, $2, $3) 
      RETURNING *
    `, [postId, author_name, content]);
    
    await client.query('COMMIT');
    res.status(201).json(result.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    next(err);
  } finally {
    client.release();
  }
});

// [ADMIN] Delete comment
router.delete('/:id', adminAuth, commentValidators.delete, async (req, res, next) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    const { id } = req.params;
    
    const result = await client.query(
      'DELETE FROM comments WHERE id = $1 RETURNING *',
      [id]
    );
    
    if (result.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Comment not found' });
    }
    
    await client.query('COMMIT');
    res.json({ message: 'Comment deleted successfully' });
  } catch (err) {
    await client.query('ROLLBACK');
    next(err);
  } finally {
    client.release();
  }
});

// [ADMIN] Enable/disable comments for a post
router.put('/toggle/:postId', adminAuth, commentValidators.create[0], async (req, res, next) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    const { postId } = req.params;
    
    const result = await client.query(`
      UPDATE posts 
      SET comments_enabled = NOT comments_enabled 
      WHERE id = $1 
      RETURNING id, comments_enabled
    `, [postId]);
    
    if (result.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Post not found' });
    }
    
    await client.query('COMMIT');
    res.json({
      message: result.rows[0].comments_enabled 
        ? 'Comments enabled successfully' 
        : 'Comments disabled successfully'
    });
  } catch (err) {
    await client.query('ROLLBACK');
    next(err);
  } finally {
    client.release();
  }
});

module.exports = router;
