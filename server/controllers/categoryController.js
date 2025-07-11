const Category = require('../models/Category');
const asyncHandler = require('express-async-handler');
const { cloudinary } = require('../utils/cloudinary');

// @desc    Get all categories
// @route   GET /api/v1/categories
// @access  Public
exports.getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().populate('createdBy', 'name');
  res.json({ success: true, count: categories.length, data: categories });
});

// @desc    Get single category
// @route   GET /api/v1/categories/:id
// @access  Public
exports.getCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id).populate('createdBy', 'name');

  if (!category) {
    return res.status(404).json({ success: false, error: 'Category not found' });
  }

  res.json({ success: true, data: category });
});

// @desc    Create category
// @route   POST /api/v1/categories
// @access  Private/Admin
exports.createCategory = asyncHandler(async (req, res) => {
  req.body.createdBy = req.user.id;

  // Handle image upload
  if (req.file) {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'blog/categories',
      width: 800,
      crop: 'scale'
    });
    req.body.featuredImage = {
      url: result.secure_url,
      publicId: result.public_id
    };
  }

  const category = await Category.create(req.body);
  res.status(201).json({ success: true, data: category });
});

// @desc    Update category
// @route   PUT /api/v1/categories/:id
// @access  Private/Admin
exports.updateCategory = asyncHandler(async (req, res) => {
  let category = await Category.findById(req.params.id);

  if (!category) {
    return res.status(404).json({ success: false, error: 'Category not found' });
  }

  // Handle image update
  if (req.file) {
    // Delete old image if exists
    if (category.featuredImage.publicId) {
      await cloudinary.uploader.destroy(category.featuredImage.publicId);
    }
    
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'blog/categories',
      width: 800,
      crop: 'scale'
    });
    req.body.featuredImage = {
      url: result.secure_url,
      publicId: result.public_id
    };
  }

  req.body.updatedBy = req.user.id;
  category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.json({ success: true, data: category });
});

// @desc    Delete category
// @route   DELETE /api/v1/categories/:id
// @access  Private/Admin
exports.deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return res.status(404).json({ success: false, error: 'Category not found' });
  }

  // Delete image if exists
  if (category.featuredImage.publicId) {
    await cloudinary.uploader.destroy(category.featuredImage.publicId);
  }

  await category.remove();

  res.json({ success: true, data: {} });
});