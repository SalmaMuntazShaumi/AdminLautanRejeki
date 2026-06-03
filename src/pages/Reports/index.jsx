import { useState } from 'react';
import DashboardLayout from '../../layout/DashboardLayout';
import { useAttendance } from '../../hooks/useAttendance';
import AttendanceRow from '../../components/dashboard/AttendanceRow';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';
import EmptyState from '../../components/ui/EmptyState';
import { Download } from 'lucide-react';

export default function ReportsPage() {
  const { loading, filteredData, searchQuery, setSearchQuery, exportExcel, handleFilterDate } = useAttendance();

  const [reportType, setReportType]       = useState('monthly');
  const [selectedDate, setSelectedDate]   = useState(new Date().toISOString().split('T')[0]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [selectedYear, setSelectedYear]   = useState(String(new Date().getFullYear()));

  function handleFilter(params) {
    handleFilterDate(params);
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Laporan Absensi</h2>
          <p className="text-sm text-slate-500">Seluruh data absensi karyawan</p>
        </div>

        <div className="card overflow-hidden">
          {/* Filter */}
          <div className="p-6 border-b border-slate-200">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-end">
              <div>
                <label className="block text-sm font-medium mb-2">Jenis Laporan</label>
                <select value={reportType}
                  onChange={(e) => {
                    setReportType(e.target.value);
                    handleFilter({ reportType: e.target.value, selectedDate, selectedMonth, selectedYear });
                  }} className="input">
                  <option value="daily">Harian</option>
                  <option value="weekly">Mingguan</option>
                  <option value="monthly">Bulanan</option>
                  <option value="yearly">Tahunan</option>
                </select>
              </div>

              {reportType === 'daily' && (
                <div>
                  <label className="block text-sm font-medium mb-2">Tanggal</label>
                  <input type="date" value={selectedDate}
                    onChange={(e) => { setSelectedDate(e.target.value); handleFilter({ reportType, selectedDate: e.target.value, selectedMonth, selectedYear }); }}
                    className="input" />
                </div>
              )}
              {reportType === 'weekly' && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Minggu</label>
                    <input type="week" value={selectedDate.slice(0, 8) + 'W' + getWeekNumber(new Date(selectedDate))}
                      onChange={(e) => { setSelectedDate(e.target.value.replace('W', '-W') + '-1'); handleFilter({ reportType, selectedDate: e.target.value.replace('W', '-W') + '-1', selectedMonth, selectedYear }); }}
                      className="input" />
                  </div>
                )}
              {reportType === 'monthly' && (
                <div>
                  <label className="block text-sm font-medium mb-2">Bulan</label>
                  <input type="month" value={selectedMonth}
                    onChange={(e) => { setSelectedMonth(e.target.value); handleFilter({ reportType, selectedDate, selectedMonth: e.target.value, selectedYear }); }}
                    className="input" />
                </div>
              )}
              {reportType === 'yearly' && (
                <div>
                  <label className="block text-sm font-medium mb-2">Tahun</label>
                  <select value={selectedYear}
                    onChange={(e) => { setSelectedYear(e.target.value); handleFilter({ reportType, selectedDate, selectedMonth, selectedYear: e.target.value }); }}
                    className="input">
                    {Array.from({ length: 5 }, (_, i) => {
                      const year = new Date().getFullYear() - i;
                      return <option key={year} value={String(year)}>{year}</option>;
                    })}
                  </select>
                </div>
              )}

              <div className="lg:col-start-4 flex gap-2">
                <input type="text" placeholder="Cari nama..." value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)} className="input flex-1" />
                <button onClick={() => exportExcel({ reportType, selectedDate, selectedMonth, selectedYear })}
                  className="button-primary flex items-center gap-2">
                  <Download size={18} /> Export
                </button>
              </div>
            </div>
          </div>

          {/* Table — semua data tanpa limit */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-6"><LoadingSkeleton /></div>
            ) : filteredData.length === 0 ? (
              <EmptyState />
            ) : (
              <>
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="table-header table-cell">Nama</th>
                      <th className="table-header table-cell">Tanggal</th>
                      <th className="table-header table-cell">Jam Masuk</th>
                      <th className="table-header table-cell">Jam Keluar</th>
                      <th className="table-header table-cell">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((item) => (
                      <AttendanceRow key={item.id} item={item} />
                    ))}
                  </tbody>
                </table>
                <div className="px-6 py-3 border-t border-slate-200 bg-slate-50">
                  <p className="text-sm text-slate-500">
                    Total <span className="font-semibold text-slate-700">{filteredData.length}</span> data
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}