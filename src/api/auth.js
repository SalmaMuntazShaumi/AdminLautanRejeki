// File: src/api/auth.js
// Service untuk autentikasi menggunakan Laravel Sanctum

import api, { initCsrf } from './axios';

/**
 * Login ke API
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{user: object, token?: string}>}
 */
export const login = async (email, password) => {
  // Ambil CSRF cookie dulu (wajib untuk Sanctum)
  try {
    await initCsrf();
  } catch (err) {
    // Jika backend tidak tersedia (dev), biarkan terus — kita pakai fake login below
    console.warn('initCsrf gagal, lanjutkan (dev mode):', err?.message || err);
  }

  // Jika ingin menggunakan API nyata, uncomment baris berikut:
  // const response = await api.post('/api/admin/login', { email, password });

  // Fake login (development)
  if (email === 'admin@gmail.com' && password === '123456') {
    const response = {
      data: {
        user: {
          id: 1,
          name: 'Admin',
          email: 'admin@gmail.com',
          role: 'admin',
        },
        token: 'fake-jwt-token-for-admin',
      },
    };

    // Persist untuk sesi lokal supaya isAuthenticated() dan reload bekerja
    if (response.data?.token) {
      localStorage.setItem('auth_token', response.data.token);
    }

    if (response.data?.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }

    return response.data;
  }

  // Jika menggunakan API nyata, kembalikan hasil request di sini.
  // Jika tidak cocok kredensial fake, lempar error.
  throw new Error('Gagal login. Periksa kredensial.');
};

/**
 * Logout
 */
export const logout = async () => {
  try {
    await api.post('/api/logout');
  } finally {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  }
};

/**
 * Ambil data user yang sedang login
 */
export const getUser = async () => {
  const response = await api.get('/api/user');
  return response.data;
};

/**
 * Cek apakah user sudah login (dari localStorage)
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem('auth_token');
};

/**
 * Ambil data user dari localStorage
 */
export const getStoredUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};