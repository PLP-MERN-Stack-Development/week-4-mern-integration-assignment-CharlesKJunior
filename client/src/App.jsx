import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { BlogProvider } from './context/BlogContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import PostList from './components/PostList';
import PostForm from './components/PostForm';
import PostDetail from './components/PostDetail';
import Login from './components/Login';
import Register from './components/Register';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import CategoryList from './components/CategoryList';
import CategoryForm from './components/CategoryForm';
import Home from './components/Home';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <BlogProvider>
        <Router>
          <Navbar />
          <div className="container mt-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/posts" element={<PostList />} />
              <Route path="/posts/:slug" element={<PostDetail />} />
              <Route path="/categories" element={<CategoryList />} />
              
              {/* Protected routes */}
              <Route element={<PrivateRoute />}>
                <Route path="/posts/new" element={<PostForm />} />
                <Route path="/posts/edit/:postId" element={<PostForm />} />
              </Route>

              {/* Admin routes */}
              <Route element={<AdminRoute />}>
                <Route path="/categories/new" element={<CategoryForm />} />
                <Route path="/categories/edit/:categoryId" element={<CategoryForm />} />
              </Route>

              {/* Auth routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </div>
        </Router>
      </BlogProvider>
    </AuthProvider>
  );
}

export default App;