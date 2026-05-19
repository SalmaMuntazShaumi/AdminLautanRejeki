import { useEffect, useMemo, useState } from 'react';

import { exportAttendanceExcel } from '../utils/export_excel';
import { calculateStatistics } from '../utils/statistics';
import { absensiService } from '../services/api';


export function useAttendance() {
  const [loading, setLoading] = useState(true);

  const [data, setData] = useState([]);

  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);

      const response =
        await absensiService.getAllAbsensi();

      setData(response);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const filteredData = useMemo(() => {
    return data.filter((item) =>
      item.nama
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
  }, [data, searchQuery]);

  const statistics = useMemo(() => {
    return calculateStatistics(data);
  }, [data]);

  const exportExcel = (payload) => {
    exportAttendanceExcel(data, payload);
  };

  return {
    loading,
    data,
    filteredData,
    statistics,
    searchQuery,
    setSearchQuery,
    exportExcel
  };
}