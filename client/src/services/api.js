import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1',
});

// Set auth token header
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Posts API
export const getPosts = (params = {}) => api.get('/posts', { params });
export const getPost = (id) => api.get(`/posts/${id}`);
export const createPost = (postData) => {
  const formData = new FormData();
  Object.keys(postData).forEach(key => {
    if (key === 'featuredImage' && postData[key] instanceof File) {
      formData.append('featuredImage', postData[key]);
    } else if (postData[key] !== null && postData[key] !== undefined) {
      formData.append(key, postData[key]);
    }
  });
  return api.post('/posts', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};
export const updatePost = (id, postData) => {
  const formData = new FormData();
  Object.keys(postData).forEach(key => {
    if (key === 'featuredImage' && postData[key] instanceof File) {
      formData.append('featuredImage', postData[key]);
    } else if (postData[key] !== null && postData[key] !== undefined) {
      formData.append(key, postData[key]);
    }
  });
  return api.put(`/posts/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};
export const deletePost = (id) => api.delete(`/posts/${id}`);

// Categories API
export const getCategories = () => api.get('/categories');
export const getCategory = (id) => api.get(`/categories/${id}`);
export const createCategory = (categoryData) => {
  const formData = new FormData();
  Object.keys(categoryData).forEach(key => {
    if (key === 'featuredImage' && categoryData[key] instanceof File) {
      formData.append('featuredImage', categoryData[key]);
    } else {
      formData.append(key, categoryData[key]);
    }
  });
  return api.post('/categories', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};
export const updateCategory = (id, categoryData) => {
  const formData = new FormData();
  Object.keys(categoryData).forEach(key => {
    if (key === 'featuredImage' && categoryData[key] instanceof File) {
      formData.append('featuredImage', categoryData[key]);
    } else {
      formData.append(key, categoryData[key]);
    }
  });
  return api.put(`/categories/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};
export const deleteCategory = (id) => api.delete(`/categories/${id}`);

// Auth API
export const register = (userData) => api.post('/auth/register', userData);
export const login = (credentials) => api.post('/auth/login', credentials);
export const getMe = () => api.get('/auth/me');
export const updateUser = (userData) => api.put('/auth/updatedetails', userData);
export const updatePassword = (passwords) => api.put('/auth/updatepassword', passwords);
export const logout = () => api.get('/auth/logout');

export default api;