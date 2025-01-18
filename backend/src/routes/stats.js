const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const config = require('../config');

const pool = new Pool({
  connectionString: config.database.connectionString,
  ssl: config.database.ssl
});

router.get('/', async (req, res) => {
  try {
    const client = await pool.connect();
    try {
      const query = `
        SELECT 
          (SELECT COUNT(*) FROM posts) as posts_count,
          (SELECT COUNT(*) FROM standalone_videos) as videos_count,
          (SELECT COUNT(*) FROM categories) as categories_count,
          (SELECT created_at FROM posts ORDER BY created_at DESC LIMIT 1) as latest_post,
          (SELECT created_at FROM standalone_videos ORDER BY created_at DESC LIMIT 1) as latest_video
      `;
      
      const result = await client.query(query);
      const stats = result.rows[0];
      
      res.json({
        success: true,
        data: {
          posts: {
            count: parseInt(stats.posts_count),
            latestPost: stats.latest_post
          },
          videos: {
            count: parseInt(stats.videos_count),
            latestVideo: stats.latest_video
          },
          categories: {
            count: parseInt(stats.categories_count)
          }
        }
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics'
    });
  }
});

module.exports = router;
