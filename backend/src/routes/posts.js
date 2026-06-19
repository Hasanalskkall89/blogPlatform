const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const config = require('../config');
const { adminAuth } = require('../middleware/auth');
const { pool } = require('../db');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath;
    if (file.mimetype.startsWith('image/')) {
      uploadPath = path.join(config.upload.path, 'images');
    } else if (file.mimetype.startsWith('video/')) {
      uploadPath = path.join(config.upload.path, 'videos', 'posts');
    }
    
    // Create directory if it doesn't exist
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Use original filename with timestamp to avoid name conflicts
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: parseInt(config.upload.maxFileSize)
  },
  fileFilter: (req, file, cb) => {
    // Validate file type
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('File type not supported'));
    }
  }
});

// Serve uploaded files
router.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

// Disable caching for all post routes
router.use((req, res, next) => {
  res.set({
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
    'Surrogate-Control': 'no-store'
  });
  next();
});

// Get all posts
router.get('/', async (req, res, next) => {
  try {
    const result = await pool.query(`
      SELECT 
        p.*,
        c.name as category_name,
        json_agg(
          json_build_object(
            'id', pm.id,
            'media_url', pm.media_url,
            'media_type', pm.media_type
          )
        ) as media
      FROM posts p 
      LEFT JOIN categories c ON p.category_id = c.id 
      LEFT JOIN post_media pm ON p.id = pm.post_id
      GROUP BY p.id, c.name
      ORDER BY p.created_at DESC
    `);
    
    // Clean up null media arrays and add nested category object
    result.rows = result.rows.map(post => ({
      ...post,
      media: post.media[0] === null ? [] : post.media,
      category: post.category_id ? { id: post.category_id, name: post.category_name } : null
    }));
    
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

// Get specific post with associated media
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const postResult = await pool.query(`
      SELECT p.*, c.name as category_name 
      FROM posts p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.id = $1
    `, [id]);
    
    if (postResult.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Get associated media
    const mediaResult = await pool.query(`
      SELECT * FROM post_media 
      WHERE post_id = $1
    `, [id]);
    
    const post = postResult.rows[0];
    post.media = mediaResult.rows;
    post.category = post.category_id ? { id: post.category_id, name: post.category_name } : null;
    
    res.json(post);
  } catch (err) {
    next(err);
  }
});

// Create new post with multiple media support
router.post('/', adminAuth, async (req, res, next) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    const { title, content, category_id, media } = req.body;
    
    if (!title || !content || !category_id) {
      throw new Error('Required data is incomplete');
    }
    
    // Validate media paths
    const validateMediaUrl = (url, type) => {
      if (type === 'image') {
        return url.startsWith('/api/posts/uploads/images/');
      } else if (type === 'video') {
        return url.startsWith('/api/posts/uploads/videos/posts/');
      }
      return false;
    };

    // Validate all media items
    if (media && media.length > 0) {
      const invalidMedia = media.find(item => !validateMediaUrl(item.media_url, item.media_type));
      if (invalidMedia) {
        throw new Error(`Invalid media path: ${invalidMedia.media_url}`);
      }
    }
    
    // Create post
    const postResult = await client.query(`
      INSERT INTO posts (title, content, category_id) 
      VALUES ($1, $2, $3) 
      RETURNING *
    `, [title, content, category_id]);
    
    const post = postResult.rows[0];

    // Add selected media
    if (media && media.length > 0) {
      for (const item of media) {
        await client.query(`
          INSERT INTO post_media (post_id, media_url, media_type) 
          VALUES ($1, $2, $3)
        `, [
          post.id,
          item.media_url,
          item.media_type
        ]);
      }
    }

    await client.query('COMMIT');
    
    // Fetch post with associated media
    const finalResult = await client.query(`
      SELECT 
        p.*,
        c.name as category_name,
        json_agg(
          json_build_object(
            'id', pm.id,
            'media_url', pm.media_url,
            'media_type', pm.media_type
          )
        ) as media
      FROM posts p 
      LEFT JOIN categories c ON p.category_id = c.id 
      LEFT JOIN post_media pm ON p.id = pm.post_id
      WHERE p.id = $1
      GROUP BY p.id, c.name
    `, [post.id]);

    const row = finalResult.rows[0];
    const finalPost = {
      ...row,
      media: row.media[0] === null ? [] : row.media,
      category: row.category_id ? { id: row.category_id, name: row.category_name } : null
    };

    res.status(201).json(finalPost);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error in post creation:', err);
    res.status(500).json({ 
      error: err.message || 'Failed to create post',
      details: err.stack 
    });
  } finally {
    client.release();
  }
});

// Update post
router.put('/:id', adminAuth, async (req, res, next) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    const { title, content, category_id, media } = req.body;
    
    if (!title || !content || !category_id) {
      throw new Error('Required data is incomplete');
    }
    
    // Validate media paths
    const validateMediaUrl = (url, type) => {
      if (type === 'image') {
        return url.startsWith('/api/posts/uploads/images/');
      } else if (type === 'video') {
        return url.startsWith('/api/posts/uploads/videos/posts/');
      }
      return false;
    };

    // Validate all media items
    if (media && media.length > 0) {
      const invalidMedia = media.find(item => !validateMediaUrl(item.media_url, item.media_type));
      if (invalidMedia) {
        throw new Error(`Invalid media path: ${invalidMedia.media_url}`);
      }
    }
    
    // Update post
    const postResult = await client.query(`
      UPDATE posts 
      SET title = $1, content = $2, category_id = $3, updated_at = CURRENT_TIMESTAMP
      WHERE id = $4
      RETURNING *
    `, [title, content, category_id, req.params.id]);
    
    if (postResult.rows.length === 0) {
      throw new Error('Post not found');
    }
    
    const post = postResult.rows[0];

    // Delete old media
    await client.query('DELETE FROM post_media WHERE post_id = $1', [post.id]);
    
    // Add new media
    if (media && media.length > 0) {
      for (const item of media) {
        await client.query(`
          INSERT INTO post_media (post_id, media_url, media_type) 
          VALUES ($1, $2, $3)
        `, [
          post.id,
          item.media_url,
          item.media_type
        ]);
      }
    }

    await client.query('COMMIT');
    
    // Fetch updated post with associated media
    const finalResult = await client.query(`
      SELECT 
        p.*,
        c.name as category_name,
        json_agg(
          json_build_object(
            'id', pm.id,
            'media_url', pm.media_url,
            'media_type', pm.media_type
          )
        ) as media
      FROM posts p 
      LEFT JOIN categories c ON p.category_id = c.id 
      LEFT JOIN post_media pm ON p.id = pm.post_id
      WHERE p.id = $1
      GROUP BY p.id, c.name
    `, [post.id]);

    const row = finalResult.rows[0];
    const finalPost = {
      ...row,
      media: row.media[0] === null ? [] : row.media,
      category: row.category_id ? { id: row.category_id, name: row.category_name } : null
    };

    res.json(finalPost);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error in post update:', err);
    res.status(500).json({ 
      error: err.message || 'Failed to update post',
      details: err.stack 
    });
  } finally {
    client.release();
  }
});

// Delete post and associated media
router.delete('/:id', adminAuth, async (req, res, next) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    const { id } = req.params;

    // Get media files before deleting
    const mediaResult = await client.query(
      'SELECT media_url FROM post_media WHERE post_id = $1',
      [id]
    );

    // Delete media files from storage
    for (const media of mediaResult.rows) {
      try {
        // Convert API URL path to filesystem path
        // e.g. /api/posts/uploads/images/xxx.jpg -> ./uploads/images/xxx.jpg
        const filePath = media.media_url
          .replace('/api/posts/uploads/', './uploads/')
          .replace('/api/videos/', './uploads/videos/');
        fs.unlinkSync(filePath);
      } catch (err) {
        console.error(`Failed to delete file: ${media.media_url}`, err);
      }
    }

    // Delete post and associated records
    const result = await client.query(
      'DELETE FROM posts WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Post not found' });
    }

    await client.query('COMMIT');
    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    await client.query('ROLLBACK');
    next(err);
  } finally {
    client.release();
  }
});

module.exports = router;

