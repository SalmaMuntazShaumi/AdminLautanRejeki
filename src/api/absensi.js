// File: src/api/absensi.js
// Service untuk semua operasi absensi (CRUD)

import api from './axios';

/**
 * Ambil semua data absensi
 * @param {object} params - Query params (tanggal, karyawan_id, dll)
 */
export const getAbsensi = (params = {}) =>
  api.get('/api/absensi', { params });

/**
 * Ambil absensi berdasarkan ID
 */
export const getAbsensiById = (id) =>
  api.get(`/api/absensi/${id}`);

/**
 * Absensi masuk
 */
export const absenMasuk = (data) =>
  api.post('/api/absensi/masuk', data);

/**
 * Absensi keluar
 */
export const absenKeluar = (data) =>
  api.post('/api/absensi/keluar', data);

/**
 * Update data absensi (admin only)
 */
export const updateAbsensi = (id, data) =>
  api.put(`/api/absensi/${id}`, data);

/**
 * Hapus data absensi (admin only)
 */
export const deleteAbsensi = (id) =>
  api.delete(`/api/absensi/${id}`);

/**
 * Export laporan absensi
 * @param {object} params - { bulan, tahun, format: 'xlsx'|'pdf' }
 */
export const exportAbsensi = (params = {}) =>
  api.get('/api/absensi/export', {
    params,
    responseType: 'blob', // Penting untuk download file
  });

/**
 * Ambil rekapitulasi absensi
 */
export const getRekapAbsensi = (params = {}) =>
  api.get('/api/absensi/rekap', { params });