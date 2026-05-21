// File: src/api/absensi.js
// Service untuk semua operasi absensi (CRUD)

import api from './axios';

/**
 * Ambil semua data absensi
 * @param {object} params - Query params (tanggal, karyawan_id, dll)
 */
export const getAbsensi = (params = {}) =>
  api.get('/api/attendance/today', { params });

/**
 * Ambil absensi berdasarkan ID
 */
export const getAbsensiById = (id) =>
  api.get(`/api/attendance/${id}`);

/**
 * Absensi masuk
 */
export const absenMasuk = (data) =>
  api.post('/api/clock-in', data);

/**
 * Absensi keluar
 */
export const absenKeluar = (data) =>
  api.post('/api/clock-out', data);

/**
 * Update data absensi (admin only)
 */
export const updateAbsensi = (id, data) =>
  api.put(`/api/attendance/${id}`, data);

/**
 * Hapus data absensi (admin only)
 */
export const deleteAbsensi = (id) =>
  api.delete(`/api/attendance/${id}`);

/**
 * Export laporan absensi
 * @param {object} params - { bulan, tahun, format: 'xlsx'|'pdf' }
 */
export const exportAbsensi = (params = {}) =>
  api.get('/api/attendance/export', {
    params,
    responseType: 'blob', // Penting untuk download file
  });

/**
 * Ambil rekapitulasi absensi
 */
export const getRekapAbsensi = (params = {}) =>
  api.get('/api/attendance/recap', { params });