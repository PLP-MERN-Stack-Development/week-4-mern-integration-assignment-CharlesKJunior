import { useState, useEffect } from 'react';
import { useBlog } from '../context/BlogContext';
import { useNavigate, useParams } from 'react-router-dom';
import Spinner from './Spinner';

const PostForm = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { posts, categories, createPost, updatePost, loading } = useBlog();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: '',
    tags: [],
    status: 'draft',
    featuredImage: null
  });
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    if (postId) {
      const post = posts.find(p => p._id === postId);
      if (post) {
        setFormData({
          title: post.title,
          content: post.content,
          excerpt: post.excerpt,
          category: post.category?._id,
          tags: post.tags || [],
          status: post.status,
          featuredImage: null
        });
        if (post.featuredImage?.url) {
          setImagePreview(post.featuredImage.url);
        }
      }
    }
  }, [postId, posts]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleTagsChange = (e) => {
    const tags = e.target.value.split(',').map(tag => tag.trim());
    setFormData({
      ...formData,
      tags
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        featuredImage: file
      });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (postId) {
        await updatePost(postId, formData);
      } else {
        await createPost(formData);
      }
      navigate('/posts');
    } catch (err) {
      console.error('Error saving post:', err);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="post-form">
      <h2>{postId ? 'Edit Post' : 'Create New Post'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input
            type="text"
            className="form-control"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Content</label>
          <textarea
            className="form-control"
            name="content"
            rows="10"
            value={formData.content}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Excerpt</label>
          <textarea
            className="form-control"
            name="excerpt"
            rows="3"
            value={formData.excerpt}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Category</label>
          <select
            className="form-select"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select a category</option>
            {categories.map(category => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Tags (comma separated)</label>
          <input
            type="text"
            className="form-control"
            value={formData.tags.join(', ')}
            onChange={handleTagsChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Status</label>
          <select
            className="form-select"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Featured Image</label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={handleImageChange}
          />
          {imagePreview && (
            <div className="mt-2">
              <img
                src={imagePreview}
                alt="Preview"
                style={{ maxWidth: '100%', maxHeight: '200px' }}
              />
            </div>
          )}
        </div>

        <button type="submit" className="btn btn-primary">
          {postId ? 'Update Post' : 'Create Post'}
        </button>
      </form>
    </div>
  );
};

export default PostForm;