const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.route('/')
  .get(postController.getPosts)
  .post(protect, authorize('author', 'admin'), upload.single('featuredImage'), postController.createPost);

router.route('/:id')
  .get(postController.getPost)
  .put(protect, authorize('author', 'admin'), upload.single('featuredImage'), postController.updatePost)
  .delete(protect, authorize('author', 'admin'), postController.deletePost);

module.exports = router;