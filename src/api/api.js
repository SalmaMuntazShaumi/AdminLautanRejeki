import api from './axios';
import { getWeekRange } from '../utils/week_helper';

export const absensiService = {
  getAllAbsensi: async (params = {}) => {
    try {
      const queryParams = {};

      if (params.reportType === 'daily' && params.selectedDate) {
        queryParams.date = params.selectedDate;
      } else if (params.reportType === 'weekly' && params.selectedWeek) {
        // Kirim start & end date ke backend
        const { start, end } = getWeekRange(params.selectedWeek);
        queryParams.start_date = start.toISOString().split('T')[0];
        queryParams.end_date   = end.toISOString().split('T')[0];
      } else if (params.reportType === 'monthly' && params.selectedMonth) {
        queryParams.month = params.selectedMonth;
      } else if (params.reportType === 'yearly' && params.selectedYear) {
        queryParams.year = params.selectedYear;
      } else {
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