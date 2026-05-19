import AttendanceTable from '../../components/dashboard/AttendanceTable';
import ReportSection from '../../components/dashboard/ReportSection';
import StatsGrid from '../../components/dashboard/StatsGrid';
import DashboardLayout from '../../layout/DashboardLayout';
import { useAttendance } from '../../hooks/useAttendance';

export default function DashboardPage() {
  const {
    loading,
    filteredData,
    statistics,
    searchQuery,
    setSearchQuery,
    exportExcel
  } = useAttendance();

  return (
    <DashboardLayout>
      <div className="space-y-6">

        <StatsGrid statistics={statistics} />

        <ReportSection onExport={exportExcel} />

        <AttendanceTable
          data={filteredData}
          loading={loading}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

      </div>
    </DashboardLayout>
  );
}