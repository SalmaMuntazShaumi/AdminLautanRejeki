import { createContext, useContext, useState, useEffect } from 'react';
import { 
  login as loginApi, 
  logout as logoutApi, 
  getUser, 
  isAuthenticated, 
  getStoredUser, 
  requestOtp as requestOtpApi  // ✅ rename import
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

  const login = async (email, password) => {
    const data = await loginApi(email, password);
    const userData = data.user || data;
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    return userData;
  };

  // ✅ Fix: requestOtp tidak set user, hanya kirim OTP
  const requestOtp = async (phone) => {
    const data = await requestOtpApi(phone);
    return data;
  };

  // ✅ Tambah: set user setelah verify OTP berhasil
  const loginWithOtp = async (phone, otp) => {
    const response = await import('../api/auth').then(m => m.loginWithOtp(phone, otp));
    const userData = response.user || response;
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