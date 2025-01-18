const express = require('express');
const { Pool } = require('pg');
const config = require('./config');
const postsRouter = require('./routes/posts');
const categoriesRouter = require('./routes/categories');
const commentsRouter = require('./routes/comments');
const likesRouter = require('./routes/likes');
const authRouter = require('./routes/auth');
const videosRouter = require('./routes/videos');
const statsRouter = require('./routes/stats');
const mediaRouter = require('./routes/media');
const { adminAuth } = require('./middleware/auth');

const app = express();
const port = config.port;

// Increase allowed request size
app.use(express.json({ limit: process.env.REQUEST_SIZE_LIMIT || '50mb' }));
app.use(express.urlencoded({ limit: process.env.REQUEST_SIZE_LIMIT || '50mb', extended: true }));

// Database connection setup
const pool = new Pool({
  connectionString: config.database.connectionString,
  ssl: config.database.ssl
});

// Middleware
app.use('/api/posts/uploads', express.static('uploads'));
app.use('/api/videos', express.static('uploads/videos'));

// Get real IP behind proxy
app.set('trust proxy', true);

// Create uploads directory if it doesn't exist
const fs = require('fs');
if (!fs.existsSync(config.upload.path)) {
  fs.mkdirSync(config.upload.path, { recursive: true });
}

// Test database connection
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error connecting to database:', err.stack);
  }
  console.log('Successfully connected to database');
  release();
});

// Setup API routes
app.use('/api/posts', postsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/comments', commentsRouter);
app.use('/api/likes', likesRouter);
app.use('/api/auth', authRouter);
app.use('/api/videos', videosRouter);
app.use('/api/media', mediaRouter);
app.use('/api/stats', adminAuth, statsRouter);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'API is working correctly',
    environment: config.nodeEnv
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  const message = config.nodeEnv === 'production' 
    ? 'Server error occurred' 
    : err.message;
  
  res.status(statusCode).json({ error: message });
});

app.listen(port, () => {
  console.log(`Server running on port ${port} in ${config.nodeEnv} environment`);
});
