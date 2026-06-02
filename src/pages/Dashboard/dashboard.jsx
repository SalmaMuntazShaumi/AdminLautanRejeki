import AttendanceChart from '../../components/charts/AttendanceChart';
import StatsGrid from '../../components/dashboard/StatsGrid';
import DashboardLayout from '../../layout/DashboardLayout';
import { useAttendance } from '../../hooks/useAttendance';

export default function DashboardPage() {
  const {
    loading,
    data,
    statistics,
    exportExcel,
    handleFilterDate,
  } = useAttendance();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <StatsGrid statistics={statistics} />
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