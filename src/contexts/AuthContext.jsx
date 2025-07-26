import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  axios.defaults.baseURL = 'https://in-home.onrender.com';

  // Robust Axios interceptor for correct authorization header
  axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    let userInfo = null;
    try {
      userInfo = JSON.parse(localStorage.getItem('user'));
    } catch {}
    if (token) {
      if (
        userInfo &&
        userInfo.role &&
        typeof userInfo.role === 'string' &&
        userInfo.role.toLowerCase() === 'superadmin'
      ) {
        config.headers.Authorization = `Super ${token}`;
      } else {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    let userInfo = null;
    try {
      userInfo = JSON.parse(localStorage.getItem('user'));
    } catch {}
    if (token && userInfo) {
      setUser(userInfo);
      setLoading(false);
    } else if (token) {
      getProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const getProfile = async () => {
    try {
      const response = await axios.post('/users/GetProfile');
      setUser(response.data.user);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post('/users/login', { email, password });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      toast.success('تم تسجيل الدخول بنجاح');
      // Navigation handled in Login.jsx, do not reload
      return true;
    } catch (error) {
      const message = error.response?.data?.message || 'حدث خطأ في تسجيل الدخول';
      toast.error(message);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    toast.success('تم تسجيل الخروج بنجاح');
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await axios.patch('/users/UpdateProfile', profileData);
      setUser(response.data.user);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      toast.success('تم تحديث الملف الشخصي بنجاح');
      return true;
    } catch (error) {
      const message = error.response?.data?.message || 'حدث خطأ في تحديث الملف الشخصي';
      toast.error(message);
      return false;
    }
  };

  const createUser = async (userData) => {
    try {
      const response = await axios.post('/users/createUserByAdmin', userData);
      toast.success('تم إنشاء المستخدم بنجاح');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'حدث خطأ في إنشاء المستخدم';
      toast.error(message);
      throw error;
    }
  };

  const updatePassword = async (userId, passwordData) => {
    try {
      const response = await axios.patch(`/users/UpdatePassword/${userId}`, passwordData);
      toast.success('تم تحديث كلمة المرور بنجاح');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'حدث خطأ في تحديث كلمة المرور';
      toast.error(message);
      throw error;
    }
  };

  const freezeUser = async (userId) => {
    try {
      const response = await axios.delete(`/users/FreazUser/${userId}`);
      toast.success('تم تجميد المستخدم بنجاح');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'حدث خطأ في تجميد المستخدم';
      toast.error(message);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    updateProfile,
    createUser,
    updatePassword,
    freezeUser,
    getProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 