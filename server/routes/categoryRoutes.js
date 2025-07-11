const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.route('/')
  .get(categoryController.getCategories)
  .post(protect, authorize('admin'), upload.single('featuredImage'), categoryController.createCategory);

router.route('/:id')
  .get(categoryController.getCategory)
  .put(protect, authorize('admin'), upload.single('featuredImage'), categoryController.updateCategory)
  .delete(protect, authorize('admin'), categoryController.deleteCategory);

module.exports = router;