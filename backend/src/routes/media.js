const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const config = require('../config');
const { adminAuth } = require('../middleware/auth');

// Configure storage based on file type and destination
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      const baseUploadPath = path.resolve(config.upload.path);
      let uploadPath;
      
      if (file.mimetype.startsWith('image/')) {
        uploadPath = path.join(baseUploadPath, 'images');
      } else if (file.mimetype.startsWith('video/')) {
        const videoType = req.body.videoType || 'post';
        uploadPath = path.join(baseUploadPath, 'videos', videoType === 'standalone' ? 'standalone' : 'posts');
      }

      // Ensure directory exists
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }

      // Test write permissions
      try {
        const testFile = path.join(uploadPath, '.write-test');
        fs.writeFileSync(testFile, '');
        fs.unlinkSync(testFile);
      } catch (err) {
        console.error('Upload directory write test failed:', err);
        return cb(new Error('Failed to write to upload directory'));
      }

      cb(null, uploadPath);
    } catch (err) {
      console.error('Error in multer destination:', err);
      cb(err);
    }
  },
  filename: (req, file, cb) => {
    try {
      // Create unique filename while preserving original extension
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      cb(null, uniqueSuffix + ext);
    } catch (err) {
      console.error('Error in multer filename:', err);
      cb(err);
    }
  }
});

// Filter files by type
const fileFilter = (req, file, cb) => {
  try {
    const allowedTypes = config.upload.allowedTypes;
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Unsupported file type: ' + file.mimetype), false);
    }
    cb(null, true);
  } catch (err) {
    console.error('Error in multer fileFilter:', err);
    cb(err);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: parseInt(config.upload.maxFileSize)
  }
}).single('file');

// Upload new media file
router.post('/upload/', adminAuth, (req, res) => {
  upload(req, res, function(err) {
    if (err) {
      console.error('Multer error:', err);
      return res.status(400).json({
        success: false,
        message: err.message || 'Error uploading file'
      });
    }

    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No file selected for upload'
        });
      }

      // Create direct file link
      const baseUrl = process.env.API_URL || 'http://localhost:3000/api';
      let fileUrl;

      // Determine URL type based on file type and location
      if (req.file.mimetype.startsWith('image/')) {
        fileUrl = `${baseUrl}/posts/uploads/images/${req.file.filename}`;
      } else if (req.file.mimetype.startsWith('video/')) {
        const videoType = req.body.videoType || 'post';
        if (videoType === 'standalone') {
          fileUrl = `${baseUrl}/videos/standalone/${req.file.filename}`;
        } else {
          fileUrl = `${baseUrl}/posts/uploads/videos/posts/${req.file.filename}`;
        }
      }

      res.json({
        success: true,
        file: {
          url: fileUrl,
          filename: req.file.filename,
          mimetype: req.file.mimetype,
          size: req.file.size,
          type: req.file.mimetype.startsWith('image/') ? 'image' : 'video'
        }
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      res.status(500).json({
        success: false,
        message: 'Error uploading file'
      });
    }
  });
});

// List all media files by type
router.get('/list/:type/', adminAuth, (req, res) => {
  try {
    const { type } = req.params; // 'images', 'videos'
    const baseUploadPath = path.resolve(config.upload.path);
    let basePath;
    
    if (type === 'images') {
      basePath = path.join(baseUploadPath, 'images');
    } else if (type === 'videos') {
      basePath = path.join(baseUploadPath, 'videos');
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid type'
      });
    }

    const files = [];
    const baseUrl = process.env.API_URL || 'http://localhost:3000/api';

    // Read files from specified directory
    const readFilesRecursively = (dir) => {
      if (!fs.existsSync(dir)) {
        return;
      }

      const items = fs.readdirSync(dir);
      
      items.forEach(item => {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isFile()) {
          const relativePath = path.relative(baseUploadPath, fullPath);
          const pathParts = relativePath.split(path.sep);
          let fileUrl;

          // Determine URL type based on path
          if (pathParts[0] === 'images') {
            fileUrl = `${baseUrl}/posts/uploads/images/${item}`;
          } else if (pathParts[0] === 'videos') {
            if (pathParts[1] === 'standalone') {
              fileUrl = `${baseUrl}/videos/standalone/${item}`;
            } else if (pathParts[1] === 'posts') {
              fileUrl = `${baseUrl}/posts/uploads/videos/posts/${item}`;
            }
          }

          if (fileUrl) {
            files.push({
              url: fileUrl,
              filename: item,
              size: stat.size,
              created: stat.birthtime,
              type: pathParts[0] === 'images' ? 'image' : 'video'
            });
          }
        } else if (stat.isDirectory()) {
          readFilesRecursively(fullPath);
        }
      });
    };

    readFilesRecursively(basePath);

    res.json({
      success: true,
      files: files.sort((a, b) => b.created - a.created)
    });
  } catch (error) {
    console.error('Error listing files:', error);
    res.status(500).json({
      success: false,
      message: 'Error listing files'
    });
  }
});

// Delete file
router.delete('/:filename/', adminAuth, (req, res) => {
  try {
    const { filename } = req.params;
    const baseUploadPath = path.resolve(config.upload.path);
    
    // Find and delete file in all directories
    const findAndDeleteFile = (dir) => {
      if (!fs.existsSync(dir)) {
        return false;
      }

      const items = fs.readdirSync(dir);
      
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isFile() && item === filename) {
          fs.unlinkSync(fullPath);
          return true;
        } else if (stat.isDirectory()) {
          const found = findAndDeleteFile(fullPath);
          if (found) return true;
        }
      }
      
      return false;
    };

    const deleted = findAndDeleteFile(baseUploadPath);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    res.json({
      success: true,
      message: 'File deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting file'
    });
  }
});

module.exports = router;
