const { body, param, query, validationResult } = require('express-validator');

// Validation results middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Post validation rules
const postValidators = {
  create: [
    body('title')
      .trim()
      .notEmpty().withMessage('Post title is required')
      .isLength({ min: 3, max: 200 }).withMessage('Title must be between 3 and 200 characters'),
    body('content')
      .trim()
      .notEmpty().withMessage('Post content is required')
      .isLength({ min: 50 }).withMessage('Content must be at least 50 characters'),
    body('category_id')
      .notEmpty().withMessage('Category is required')
      .isInt().withMessage('Category ID must be an integer'),
    validate
  ],
  update: [
    param('id')
      .isInt().withMessage('Post ID must be an integer'),
    body('title')
      .optional()
      .trim()
      .isLength({ min: 3, max: 200 }).withMessage('Title must be between 3 and 200 characters'),
    body('content')
      .optional()
      .trim()
      .isLength({ min: 50 }).withMessage('Content must be at least 50 characters'),
    body('category_id')
      .optional()
      .isInt().withMessage('Category ID must be an integer'),
    validate
  ]
};

// Category validation rules
const categoryValidators = {
  create: [
    body('name')
      .trim()
      .notEmpty().withMessage('Category name is required')
      .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
    validate
  ],
  update: [
    param('id')
      .isInt().withMessage('Category ID must be an integer'),
    body('name')
      .trim()
      .notEmpty().withMessage('Category name is required')
      .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
    validate
  ]
};

// Comment validation rules
const commentValidators = {
  create: [
    param('postId')
      .isInt().withMessage('Post ID must be an integer'),
    body('author_name')
      .trim()
      .notEmpty().withMessage('Author name is required')
      .isLength({ min: 2, max: 50 }).withMessage('Author name must be between 2 and 50 characters'),
    body('content')
      .trim()
      .notEmpty().withMessage('Comment content is required')
      .isLength({ min: 1, max: 1000 }).withMessage('Comment must be between 1 and 1000 characters'),
    validate
  ],
  delete: [
    param('id')
      .isInt().withMessage('Comment ID must be an integer'),
    validate
  ]
};

// Like validation rules
const likeValidators = {
  toggle: [
    param('postId')
      .isInt().withMessage('Post ID must be an integer'),
    validate
  ]
};

module.exports = {
  postValidators,
  categoryValidators,
  commentValidators,
  likeValidators,
  validate
};
