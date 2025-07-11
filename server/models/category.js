// models/Category.js - Mongoose model for blog categories

const mongoose = require('mongoose');
const slugify = require('slugify');

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a category name'],
      unique: true,
      trim: true,
      maxlength: [50, 'Category name cannot be more than 50 characters'],
      minlength: [3, 'Category name must be at least 3 characters']
    },
    slug: {
      type: String,
      unique: true,
      index: true
    },
    description: {
      type: String,
      maxlength: [200, 'Description cannot be more than 200 characters']
    },
    featuredImage: {
      url: {
        type: String,
        default: 'https://res.cloudinary.com/your-cloud-name/image/upload/v1620000000/default-category.jpg'
      },
      publicId: {
        type: String,
        default: 'default-category'
      }
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    seo: {
      title: String,
      description: String,
      keywords: [String]
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Create slug from name before saving
CategorySchema.pre('save', function(next) {
  if (!this.isModified('name')) return next();
  
  this.slug = slugify(this.name, { 
    lower: true,
    strict: true,
    remove: /[*+~.()'"!:@]/g
  });
  
  next();
});

// Virtual for category URL
CategorySchema.virtual('url').get(function() {
  return `/categories/${this.slug}`;
});

// Virtual for post count
CategorySchema.virtual('postCount', {
  ref: 'Post',
  localField: '_id',
  foreignField: 'category',
  count: true
});

// Query helper for featured categories
CategorySchema.query.featured = function() {
  return this.where({ isFeatured: true });
};

// Static method to get categories with post count
CategorySchema.statics.withPostCount = function() {
  return this.aggregate([
    {
      $lookup: {
        from: 'posts',
        localField: '_id',
        foreignField: 'category',
        as: 'posts'
      }
    },
    {
      $addFields: {
        postCount: { $size: '$posts' }
      }
    },
    {
      $project: {
        posts: 0
      }
    }
  ]);
};

// Middleware to handle category deletion
CategorySchema.pre('remove', async function(next) {
  // Set all posts in this category to a default category
  const defaultCategory = await this.model('Category').findOne({ name: 'Uncategorized' });
  if (defaultCategory) {
    await this.model('Post').updateMany(
      { category: this._id },
      { $set: { category: defaultCategory._id } }
    );
  }
  next();
});

// Indexes for better query performance
CategorySchema.index({ name: 'text', description: 'text' });
CategorySchema.index({ slug: 1 });
CategorySchema.index({ isFeatured: 1 });

module.exports = mongoose.model('Category', CategorySchema);