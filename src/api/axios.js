// File: src/api/axios.js
// Axios instance yang terhubung ke api.lautanrejeki.id

import axios from 'axios';

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    'https://api.lautanrejeki.id',

  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true, // Penting untuk cookie-based auth
  timeout: 15000,
})

// ────────────────────────────────────────────────
// Request Interceptor
// ────────────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    // Ambil token dari localStorage jika ada (untuk token-based auth)
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ────────────────────────────────────────────────
// Response Interceptor
// ────────────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      // Session expired / tidak terautentikasi.
      // Jangan langsung redirect dari interceptor, karena React auth state harus mengontrol navigasi.
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
    }

    if (status === 403) {
      console.warn('Akses ditolak (403).');
    }

    if (status === 419) {
      // CSRF token mismatch → refresh halaman untuk ambil token baru
      console.warn('CSRF token expired, refreshing...');
      window.location.reload();
    }

    if (status >= 500) {
      console.error('Server error:', error.response?.data?.message || 'Terjadi kesalahan server.');
    }

    return Promise.reject(error);
  }
);

export default api;