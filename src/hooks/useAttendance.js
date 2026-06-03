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
    selectedMonth: new Date().toISOString().slice(0, 7),
    selectedYear:  String(new Date().getFullYear()),
    selectedWeek:  (() => {
      const now  = new Date();
      const d    = new Date(now); d.setHours(0,0,0,0);
      d.setDate(d.getDate() + 4 - (d.getDay() || 7));
      const y    = new Date(d.getFullYear(), 0, 1);
      const week = String(Math.ceil((((d - y) / 86400000) + 1) / 7)).padStart(2, '0');
      return `${now.getFullYear()}-W${week}`;
    })(),
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