// File: src/api/karyawan.js
// Service untuk manajemen data karyawan

import api from './axios';

export const getKaryawan = (params = {}) =>
  api.get('/api/karyawan', { params });

export const getKaryawanById = (id) =>
  api.get(`/api/karyawan/${id}`);

export const createKaryawan = (data) =>
  api.post('/api/karyawan', data);

export const updateKaryawan = (id, data) =>
  api.put(`/api/karyawan/${id}`, data);

export const deleteKaryawan = (id) =>
  api.delete(`/api/karyawan/${id}`);

/**
 * Upload foto karyawan
 */
export const uploadFotoKaryawan = (id, formData) =>
  api.post(`/api/karyawan/${id}/foto`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });