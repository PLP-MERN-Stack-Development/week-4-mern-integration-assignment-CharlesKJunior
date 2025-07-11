//const Post = require('../routes/postRoutes');
const asyncHandler = require('express-async-handler');
//const { cloudinary } = require('../utils/cloudinary');

// @desc    Get all posts
// @route   GET /api/v1/posts
// @access  Public
exports.getPosts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;
  const query = status ? { status } : {};
  
  const posts = await Post.find(query)
    .populate('author', 'name email')
    .populate('category', 'name slug')
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 });

  const count = await Post.countDocuments(query);

  res.json({
    success: true,
    count,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    data: posts
  });
});

// @desc    Get single post
// @route   GET /api/v1/posts/:id
// @access  Public
exports.getPost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id)
    .populate('author', 'name email')
    .populate('category', 'name slug')
    .populate('comments');

  if (!post) {
    return res.status(404).json({ success: false, error: 'Post not found' });
  }

  // Increment view count
  await post.incrementViewCount();

  res.json({ success: true, data: post });
});

// @desc    Create post
// @route   POST /api/v1/posts
// @access  Private
exports.createPost = asyncHandler(async (req, res) => {
  req.body.author = req.user.id;

  // Handle image upload
  if (req.file) {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'blog/posts',
      width: 1200,
      crop: 'scale'
    });
    req.body.featuredImage = {
      url: result.secure_url,
      publicId: result.public_id
    };
  }

  const post = await Post.create(req.body);
  res.status(201).json({ success: true, data: post });
});

// @desc    Update post
// @route   PUT /api/v1/posts/:id
// @access  Private
exports.updatePost = asyncHandler(async (req, res) => {
  let post = await Post.findById(req.params.id);

  if (!post) {
    return res.status(404).json({ success: false, error: 'Post not found' });
  }

  // Verify ownership or admin
  if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(401).json({ success: false, error: 'Not authorized' });
  }

  // Handle image update
  if (req.file) {
    // Delete old image if exists
    if (post.featuredImage.publicId) {
      await cloudinary.uploader.destroy(post.featuredImage.publicId);
    }
    
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'blog/posts',
      width: 1200,
      crop: 'scale'
    });
    req.body.featuredImage = {
      url: result.secure_url,
      publicId: result.public_id
    };
  }

  post = await Post.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.json({ success: true, data: post });
});

// @desc    Delete post
// @route   DELETE /api/v1/posts/:id
// @access  Private
exports.deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return res.status(404).json({ success: false, error: 'Post not found' });
  }

  // Verify ownership or admin
  if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(401).json({ success: false, error: 'Not authorized' });
  }

  // Delete image if exists
  if (post.featuredImage.publicId) {
    await cloudinary.uploader.destroy(post.featuredImage.publicId);
  }

  await post.remove();

  res.json({ success: true, data: {} });
});