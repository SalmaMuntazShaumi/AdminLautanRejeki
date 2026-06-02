import { useCallback, useEffect, useMemo, useState } from 'react';
import { exportAttendanceExcel } from '../utils/export_excel';
import { calculateStatistics } from '../utils/statistics';
import { absensiService } from '../api/api';

export function useAttendance() {
  const [loading, setLoading]         = useState(true);
  const [data, setData]               = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterParams, setFilterParams] = useState({
    reportType:    'daily',
    selectedDate:  new Date().toISOString().split('T')[0],
    selectedMonth: '2026-05',
    selectedYear:  '2026',
  });

  useEffect(() => {
    fetchData(filterParams);
  }, []);

  async function fetchData(params = filterParams) {
    try {
      setLoading(true);
      const response = await absensiService.getAllAbsensi(params);
      setData(response);
    } catch (error) {
      console.error(error);
      setData([]);
    } finally {
      setLoading(false);
    }
  }

  const handleFilterDate = useCallback((params) => {
    setFilterParams(params);
    fetchData(params);
  }, []);

  const filteredData = useMemo(() => {
    if (!searchQuery) return data;
    return data.filter((item) =>
      item.nama?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [data, searchQuery]);

  const statistics = useMemo(() => calculateStatistics(data), [data]);

  const exportExcel = (payload) => exportAttendanceExcel(data, payload);

  return {
    loading,
    data,
    filteredData,
    statistics,
    searchQuery,
    setSearchQuery,
    exportExcel,
    handleFilterDate,
  };
}