const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const config = require('../config');

// Database connection setup
const pool = new Pool({
  connectionString: config.database.connectionString,
  ssl: config.database.ssl
});

// Multer setup for file uploads
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
    // Use original filename with timestamp to avoid duplicates
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
    // Check file type
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file type'));
    }
  }
});

// Serve uploaded files
router.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

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
    
    // Clean up null media arrays
    result.rows = result.rows.map(post => ({
      ...post,
      media: post.media[0] === null ? [] : post.media
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
    
    res.json(post);
  } catch (err) {
    next(err);
  }
});

// Create new post with multiple media support
router.post('/', async (req, res, next) => {
  const client = await pool.connect();
  try {
    console.log('Received request body:', req.body);
    
    await client.query('BEGIN');
    
    const { title, content, category_id, media } = req.body;
    console.log('Extracted data:', { title, content, category_id, mediaCount: media?.length });
    
    if (!title || !content || !category_id) {
      throw new Error('Required data is incomplete');
    }
    
    // Validate media URLs
    function validateMediaUrl(url, type) {
        if (!url) return false;
        
        // Check if URL starts with the correct path
        if (!url.startsWith('/api/posts/uploads/')) {
            return false;
        }
        
        // Validate file type based on URL
        if (type === 'image' && !url.match(/\.(jpg|jpeg|png|gif)$/i)) {
            return false;
        }
        if (type === 'video' && !url.match(/\.(mp4|webm|ogg)$/i)) {
            return false;
        }
        
        return true;
    }

    // Validate all media items
    if (media && media.length > 0) {
      console.log('Validating media items:', media);
      const invalidMedia = media.find(item => !validateMediaUrl(item.media_url, item.media_type));
      if (invalidMedia) {
        throw new Error(`Invalid media URL: ${invalidMedia.media_url}`);
      }
    }
    
    // Create post
    console.log('Creating post with values:', [title, content, category_id]);
    const postResult = await client.query(`
      INSERT INTO posts (title, content, category_id) 
      VALUES ($1, $2, $3) 
      RETURNING *
    `, [title, content, category_id]);
    
    const post = postResult.rows[0];
    console.log('Post created:', post);

    // Add specified media
    if (media && media.length > 0) {
      for (const item of media) {
        console.log('Adding media:', { 
          postId: post.id, 
          mediaUrl: item.media_url, 
          mediaType: item.media_type 
        });
        
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
    
    // Get post with associated media
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

    const finalPost = {
      ...finalResult.rows[0],
      media: finalResult.rows[0].media[0] === null ? [] : finalResult.rows[0].media
    };

    console.log('Final response:', finalPost);
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
router.put('/:id', async (req, res, next) => {
  const client = await pool.connect();
  try {
    console.log('Received update request body:', req.body);
    
    await client.query('BEGIN');
    
    const { title, content, category_id, media } = req.body;
    console.log('Extracted update data:', { title, content, category_id, mediaCount: media?.length });
    
    if (!title || !content || !category_id) {
      throw new Error('Required data is incomplete');
    }
    
    // Validate media URLs
    function validateMediaUrl(url, type) {
        if (!url) return false;
        
        // Check if URL starts with the correct path
        if (!url.startsWith('/api/posts/uploads/')) {
            return false;
        }
        
        // Validate file type based on URL
        if (type === 'image' && !url.match(/\.(jpg|jpeg|png|gif)$/i)) {
            return false;
        }
        if (type === 'video' && !url.match(/\.(mp4|webm|ogg)$/i)) {
            return false;
        }
        
        return true;
    }

    // Validate all media items
    if (media && media.length > 0) {
      console.log('Validating media items:', media);
      const invalidMedia = media.find(item => !validateMediaUrl(item.media_url, item.media_type));
      if (invalidMedia) {
        throw new Error(`Invalid media URL: ${invalidMedia.media_url}`);
      }
    }
    
    // Update post
    console.log('Updating post with values:', [title, content, category_id, req.params.id]);
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
    console.log('Post updated:', post);

    // Delete old media
    await client.query('DELETE FROM post_media WHERE post_id = $1', [post.id]);
    
    // Add new media
    if (media && media.length > 0) {
      for (const item of media) {
        console.log('Adding media:', { 
          postId: post.id, 
          mediaUrl: item.media_url, 
          mediaType: item.media_type 
        });
        
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
    
    // Get updated post with associated media
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

    const finalPost = {
      ...finalResult.rows[0],
      media: finalResult.rows[0].media[0] === null ? [] : finalResult.rows[0].media
    };

    console.log('Final response:', finalPost);
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
router.delete('/:id', async (req, res, next) => {
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
        fs.unlinkSync(media.media_url);
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
