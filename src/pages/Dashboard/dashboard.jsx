import AttendanceChart from '../../components/charts/AttendanceChart';
import StatsGrid from '../../components/dashboard/StatsGrid';
import DashboardLayout from '../../layout/DashboardLayout';
import { useAttendance } from '../../hooks/useAttendance';
import AttendanceTable from '../../components/dashboard/AttendanceTable';
import { useState } from 'react';

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const {
    loading,
    data,
    statistics,
    exportExcel,
    handleFilterDate,
  } = useAttendance();

  const filteredData = data.filter((item) =>
    item.nama?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <StatsGrid statistics={statistics} />
        <AttendanceTable
          data={filteredData}
          loading={loading}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onFilterDate={handleFilterDate}
          onExport={exportExcel}
        />
        <AttendanceChart
          data={data}
          loading={loading}
          onFilterDate={handleFilterDate}
          onExport={exportExcel}
        />
      </div>
    </DashboardLayout>
  );
}