// File: src/contexts/AuthContext.jsx
// Context untuk state autentikasi di seluruh aplikasi

import { createContext, useContext, useState, useEffect } from 'react';
import { login as loginApi, logout as logoutApi, getUser, isAuthenticated, getStoredUser } from '../api/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser());
  const [loading, setLoading] = useState(true);

  // Cek session saat pertama kali load
  useEffect(() => {
    const checkAuth = async () => {
      if (isAuthenticated()) {
        try {
          const data = await getUser();
          setUser(data);
          localStorage.setItem('user', JSON.stringify(data));
        } catch {
          // Token invalid / expired
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user');
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    const data = await loginApi(email, password);
    const userData = data.user || data;
    setUser(userData);
    return userData;
  };

  const logout = async () => {
    await logoutApi();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth harus digunakan di dalam AuthProvider');
  return context;
};