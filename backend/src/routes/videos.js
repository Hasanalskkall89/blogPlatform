const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const { adminAuth } = require('../middleware/auth');
const config = require('../config');

// Database connection setup
const pool = new Pool({
  connectionString: config.database.connectionString,
});

// Get all standalone videos
router.get('/standalone-videos', async (req, res) => {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'SELECT * FROM standalone_videos ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching standalone videos:', err);
    res.status(500).json({ message: 'Error fetching videos' });
  } finally {
    client.release();
  }
});

// Get specific standalone video by ID
router.get('/standalone-videos/:id', async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    const result = await client.query(
      'SELECT * FROM standalone_videos WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Video not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching standalone video:', err);
    res.status(500).json({ message: 'Error fetching video' });
  } finally {
    client.release();
  }
});

// Create new standalone video
router.post('/standalone-videos', adminAuth, async (req, res) => {
  const client = await pool.connect();
  try {
    const { title, description, video_url } = req.body;
    console.log('Creating video with data:', { title, description, video_url });
    
    // Check required data
    if (!title || !video_url) {
      return res.status(400).json({ message: 'Title and video URL are required' });
    }

    // Clean the URL path
    const cleanVideoUrl = (url) => {
      // Remove domain if present
      let cleanUrl = url.replace(/^https?:\/\/[^\/]+/, '');
      // Ensure path starts with /api
      if (!cleanUrl.startsWith('/api')) {
        cleanUrl = '/api' + cleanUrl;
      }
      return cleanUrl;
    };

    const finalVideoUrl = cleanVideoUrl(video_url);
    console.log('Clean URL:', { finalVideoUrl });

    const result = await client.query(
      `INSERT INTO standalone_videos (title, description, video_url)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [title, description, finalVideoUrl]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating standalone video:', err);
    res.status(500).json({ message: 'Error creating video' });
  } finally {
    client.release();
  }
});

// Update standalone video
router.put('/standalone-videos/:id', adminAuth, async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    const { title, description, video_url } = req.body;
    console.log('Updating video with data:', { id, title, description, video_url });

    // Check required data
    if (!title || !video_url) {
      return res.status(400).json({ message: 'Title and video URL are required' });
    }

    // Clean the URL path
    const cleanVideoUrl = (url) => {
      // Remove domain if present
      let cleanUrl = url.replace(/^https?:\/\/[^\/]+/, '');
      // Ensure path starts with /api
      if (!cleanUrl.startsWith('/api')) {
        cleanUrl = '/api' + cleanUrl;
      }
      return cleanUrl;
    };

    const finalVideoUrl = cleanVideoUrl(video_url);
    console.log('Clean URL:', { finalVideoUrl });

    const result = await client.query(
      `UPDATE standalone_videos 
       SET title = $1, description = $2, video_url = $3
       WHERE id = $4
       RETURNING *`,
      [title, description, finalVideoUrl, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Video not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating standalone video:', err);
    res.status(500).json({ message: 'Error updating video' });
  } finally {
    client.release();
  }
});

// Delete standalone video
router.delete('/standalone-videos/:id', adminAuth, async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    const result = await client.query(
      'DELETE FROM standalone_videos WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Video not found' });
    }

    res.json({ message: 'Video deleted successfully' });
  } catch (err) {
    console.error('Error deleting standalone video:', err);
    res.status(500).json({ message: 'Error deleting video' });
  } finally {
    client.release();
  }
});

module.exports = router;
