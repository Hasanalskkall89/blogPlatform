const express = require('express');
const router = express.Router();
const { likeValidators } = require('../middleware/validators');
const { pool } = require('../db');

// Add like to a post
router.post('/post/:postId', likeValidators.toggle, async (req, res, next) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    const { postId } = req.params;
    const ip_address = req.ip;
    
    // Check if post exists
    const postCheck = await client.query(
      'SELECT id FROM posts WHERE id = $1',
      [postId]
    );
    
    if (postCheck.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Post not found' });
    }
    
    // Check if already liked
    const existingLike = await client.query(
      'SELECT id FROM likes WHERE post_id = $1 AND ip_address = $2',
      [postId, ip_address]
    );
    
    if (existingLike.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'You have already liked this post' });
    }
    
    // Add the like
    await client.query(
      'INSERT INTO likes (post_id, ip_address) VALUES ($1, $2)',
      [postId, ip_address]
    );
    
    // Update likes count in posts table
    await client.query(
      'UPDATE posts SET likes_count = likes_count + 1 WHERE id = $1',
      [postId]
    );
    
    await client.query('COMMIT');
    res.status(201).json({ message: 'Like added successfully' });
  } catch (err) {
    await client.query('ROLLBACK');
    next(err);
  } finally {
    client.release();
  }
});

// Remove like from a post
router.delete('/post/:postId', likeValidators.toggle, async (req, res, next) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    const { postId } = req.params;
    const ip_address = req.ip;
    
    // Check if post exists
    const postCheck = await client.query(
      'SELECT id FROM posts WHERE id = $1',
      [postId]
    );
    
    if (postCheck.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Post not found' });
    }
    
    // Remove the like
    const result = await client.query(
      'DELETE FROM likes WHERE post_id = $1 AND ip_address = $2 RETURNING id',
      [postId, ip_address]
    );
    
    if (result.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'You have not liked this post' });
    }
    
    // Update likes count in posts table
    await client.query(
      'UPDATE posts SET likes_count = likes_count - 1 WHERE id = $1',
      [postId]
    );
    
    await client.query('COMMIT');
    res.json({ message: 'Like removed successfully' });
  } catch (err) {
    await client.query('ROLLBACK');
    next(err);
  } finally {
    client.release();
  }
});

// Check if user has liked a specific post
router.get('/post/:postId/status', likeValidators.toggle, async (req, res, next) => {
  try {
    const { postId } = req.params;
    const ip_address = req.ip;
    
    const result = await pool.query(
      'SELECT EXISTS(SELECT 1 FROM likes WHERE post_id = $1 AND ip_address = $2)',
      [postId, ip_address]
    );
    
    res.json({ hasLiked: result.rows[0].exists });
  } catch (err) {
    next(err);
  }
});

// Get likes count for a specific post
router.get('/post/:postId/count', likeValidators.toggle, async (req, res, next) => {
  try {
    const { postId } = req.params;
    
    const result = await pool.query(
      'SELECT likes_count FROM posts WHERE id = $1',
      [postId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    res.json({ count: result.rows[0].likes_count });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
