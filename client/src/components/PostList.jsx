import { useState, useEffect } from 'react';
import { useBlog } from '../context/BlogContext';
import { Link } from 'react-router-dom';
import Pagination from './Pagination';
import Spinner from './Spinner';

const PostList = () => {
  const { posts, loading, error, pagination, fetchPosts } = useBlog();
  const [filters, setFilters] = useState({ status: 'published' });

  useEffect(() => {
    fetchPosts(1, pagination.limit, filters);
  }, [filters]);

  const handlePageChange = (page) => {
    fetchPosts(page, pagination.limit, filters);
  };

  if (loading) return <Spinner />;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="post-list">
      <div className="filter-controls mb-4">
        <select
          className="form-select"
          value={filters.status || ''}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="">All Statuses</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>

      {posts.length === 0 ? (
        <div className="alert alert-info">No posts found</div>
      ) : (
        <>
          <div className="row">
            {posts.map((post) => (
              <div className="col-md-6 col-lg-4 mb-4" key={post._id}>
                <div className="card h-100">
                  {post.featuredImage?.url && (
                    <img
                      src={post.featuredImage.url}
                      className="card-img-top"
                      alt={post.title}
                    />
                  )}
                  <div className="card-body">
                    <h5 className="card-title">
                      <Link to={`/posts/${post.slug}`}>{post.title}</Link>
                    </h5>
                    <p className="card-text">{post.excerpt}</p>
                    <div className="d-flex justify-content-between align-items-center">
                      <small className="text-muted">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </small>
                      <span className="badge bg-primary">
                        {post.category?.name}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

export default PostList;