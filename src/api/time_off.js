// src/api/timeOffService.js
import api from './axios';

export const timeOffService = {
  getAll: async () => {
    const response = await api.get('/api/time-off/all');
    return response.data.data;
  },
  approve: async (id) => {
    const response = await api.post(`/api/time-off/${id}/approve`);
    return response.data;
  },
  reject: async (id) => {
    const response = await api.post(`/api/time-off/${id}/reject`);
    return response.data;
  },
};