import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Profile from './pages/Profile';
import CreateUser from './pages/CreateUser';
import Layout from './components/Layout';

const Spinner = () => (
  <div className="flex justify-center items-center w-screen h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-200 dark:border-gray-700"></div>
  </div>
);

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <Spinner />;
  return user ? children : <Navigate to="/login" />;
};

const SuperAdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <Spinner />;
  return user && user.role === 'superadmin' ? children : <Navigate to="/dashboard" />;
};

function App() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-arabic">
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="products" element={<Products />} />
              <Route path="profile" element={<Profile />} />
              <Route 
                path="create-user" 
                element={
                  <SuperAdminRoute>
                    <CreateUser />
                  </SuperAdminRoute>
                } 
              />
            </Route>
          </Routes>
        </Router>
        <ToastContainer position="top-right" autoClose={3000} rtl theme="dark" />
      </AuthProvider>
    </div>
  );
}

export default App; 