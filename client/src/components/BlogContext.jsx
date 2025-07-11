import { createContext, useContext, useState, useEffect } from 'react';
import { getPosts, getCategories } from '../services/api';

const BlogContext = createContext();

export const BlogProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1
  });

  const fetchPosts = async (page = 1, limit = 10, filters = {}) => {
    try {
      setLoading(true);
      const response = await getPosts({ page, limit, ...filters });
      setPosts(response.data);
      setPagination({
        page: response.currentPage,
        limit,
        total: response.count,
        totalPages: response.totalPages
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      setCategories(response.data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      await Promise.all([fetchPosts(), fetchCategories()]);
    };
    initializeData();
  }, []);

  const createPost = async (postData) => {
    try {
      const response = await createPost(postData);
      setPosts([response.data, ...posts]);
      return response.data;
    } catch (err) {
      throw err;
    }
  };

  const updatePost = async (id, postData) => {
    try {
      const response = await updatePost(id, postData);
      setPosts(posts.map(post => post._id === id ? response.data : post));
      return response.data;
    } catch (err) {
      throw err;
    }
  };

  const deletePost = async (id) => {
    try {
      await deletePost(id);
      setPosts(posts.filter(post => post._id !== id));
    } catch (err) {
      throw err;
    }
  };

  return (
    <BlogContext.Provider
      value={{
        posts,
        categories,
        loading,
        error,
        pagination,
        fetchPosts,
        fetchCategories,
        createPost,
        updatePost,
        deletePost
      }}
    >
      {children}
    </BlogContext.Provider>
  );
};

export const useBlog = () => useContext(BlogContext);