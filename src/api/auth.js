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
  await initCsrf();

  const response = await api.post('/api/login', { email, password });

  // Jika API mengembalikan token (token-based), simpan
  if (response.data?.token) {
    localStorage.setItem('auth_token', response.data.token);
  }

  // Simpan data user
  if (response.data?.user) {
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }

  return response.data;
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