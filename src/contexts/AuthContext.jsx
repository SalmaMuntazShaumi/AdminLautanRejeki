import { createContext, useContext, useState, useEffect } from 'react';
import {
  login as loginApi,
  logout as logoutApi,
  getUser,
  isAuthenticated,
  getStoredUser,
  requestOtp as requestOtpApi,
  loginWithOtp as loginWithOtpApi,
} from '../api/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (isAuthenticated()) {
        try {
          const data = await getUser();
          setUser(data);
          localStorage.setItem('user', JSON.stringify(data));
        } catch (err) {
          const status = err.response?.status;
          if (status === 401 || status === 419 || status === 403) {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
            setUser(null);
          } else {
            console.warn('Auth check warning:', err);
          }
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  // ✅ Tambah companyId, diteruskan ke loginApi (perlu diupdate juga di api/auth.js)
  const login = async (email, password, companyId) => {
    const data = await loginApi(email, password, companyId);
    const userData = data.user || data;

    // ✅ Cek role
    if (userData.role?.toLowerCase() !== 'admin') {
      // Hapus token yang sudah tersimpan
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      throw new Error('Akses ditolak. Hanya admin yang dapat login.');
    }

    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    return userData;
  };

  // ✅ Tambah companyId
  const requestOtp = async (phone, companyId) => {
    const data = await requestOtpApi(phone, companyId);
    return data;
  };

  // ✅ Tambah companyId, sekaligus hapus dynamic import yang gak perlu
  const loginWithOtp = async (phone, otp, companyId) => {
    const response = await loginWithOtpApi(phone, otp, companyId);
    const userData = response.user || response;

    // Konsisten dengan login(): cek role admin juga di jalur OTP
    if (userData.role?.toLowerCase() !== 'admin') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      throw new Error('Akses ditolak. Hanya admin yang dapat login.');
    }

    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    return userData;
  };

  const logout = async () => {
    await logoutApi();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, requestOtp, loginWithOtp, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );  
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth harus digunakan di dalam AuthProvider');
  return context;
};