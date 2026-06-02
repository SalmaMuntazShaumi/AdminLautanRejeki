import api from './axios';

export const absensiService = {
  getAllAbsensi: async (params = {}) => {
    try {
      const queryParams = {};

      if (params.reportType === 'daily' && params.selectedDate) {
        queryParams.date = params.selectedDate;
      } else if (params.reportType === 'monthly' && params.selectedMonth) {
        queryParams.month = params.selectedMonth; // format: 2026-05
      } else if (params.reportType === 'yearly' && params.selectedYear) {
        queryParams.year = params.selectedYear;
      } else {
        // Default: hari ini
        queryParams.date = new Date().toISOString().split('T')[0];
      }

      const response = await api.get('/api/history', { params: queryParams });
      return response.data.data;
    } catch (error) {
      console.error("Gagal memuat data absensi:", error);
      return [];
    }
  }
};