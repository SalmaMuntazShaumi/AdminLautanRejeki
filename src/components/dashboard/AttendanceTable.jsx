import { useEffect, useRef, useState } from 'react';
import { Search, Download, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AttendanceRow from './AttendanceRow';
import LoadingSkeleton from '../ui/LoadingSkeleton';
import EmptyState from '../ui/EmptyState';
import { getWeekNumber } from '../../utils/week_helper';

const PREVIEW_LIMIT = 5;

export default function AttendanceTable({
  data,
  loading,
  searchQuery,
  setSearchQuery,
  onFilterDate,
  onExport,
}) {
  const navigate = useNavigate();
  const [reportType, setReportType]       = useState('daily');
  const [selectedDate, setSelectedDate]   = useState(
    new Date().toISOString().split('T')[0]
  );
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );
  const [selectedYear, setSelectedYear]   = useState(
    String(new Date().getFullYear())
  );
  const hasMounted = useRef(false);
  const [selectedWeek, setSelectedWeek] = useState(() => {
    const now = new Date();
    const week = getWeekNumber(now);
    return `${now.getFullYear()}-W${week}`;
  });

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }
    onFilterDate({ reportType, selectedDate, selectedMonth, selectedYear, selectedWeek });
  }, [reportType, selectedDate, selectedMonth, selectedYear, selectedWeek]);

  function handleExport() {
    onExport({ reportType, selectedDate, selectedMonth, selectedYear, selectedWeek });
  }

  const previewData = data.slice(0, PREVIEW_LIMIT);
  const hasMore     = data.length > PREVIEW_LIMIT;

  return (
    <div className="card overflow-hidden">
      <div className="p-6 border-b border-slate-200">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Riwayat Absensi</h2>
            <p className="text-sm text-slate-500 mt-1">Data realtime absensi karyawan</p>
          </div>
          <div className="relative w-full lg:w-80">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-11"
            />
          </div>
        </div>

        {/* Filter Bar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium mb-2">Jenis Laporan</label>
            <select value={reportType} onChange={(e) => {
                setReportType(e.target.value);
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
                onChange={(e) => setSelectedDate(e.target.value)} className="input" />
            </div>
          )}
          {reportType === 'weekly' && (
            <div>
              <label className="block text-sm font-medium mb-2">Minggu</label>
              <input
                type="week"
                value={selectedWeek}
                onChange={(e) => setSelectedWeek(e.target.value)}
                className="input"
              />
            </div>
          )}
          {reportType === 'monthly' && (
            <div>
              <label className="block text-sm font-medium mb-2">Bulan</label>
              <input type="month" value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)} className="input" />
            </div>
          )}
          {reportType === 'yearly' && (
            <div>
              <label className="block text-sm font-medium mb-2">Tahun</label>
              <select value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)} className="input">
                {Array.from({ length: 5 }, (_, i) => {
                  const year = new Date().getFullYear() - i;
                  return <option key={year} value={String(year)}>{year}</option>;
                })}
              </select>
            </div>
          )}

          <div className="lg:col-start-4">
            <button onClick={handleExport} className="button-primary flex items-center gap-2 w-full justify-center">
              <Download size={18} /> Export Excel
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="p-6"><LoadingSkeleton /></div>
        ) : data.length === 0 ? (
          <EmptyState />
        ) : (
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
              {previewData.map((item) => (
                <AttendanceRow key={item.id} item={item} />
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer — Lihat Semua */}
      {hasMore && (
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Menampilkan <span className="font-semibold text-slate-700">5</span> dari{' '}
            <span className="font-semibold text-slate-700">{data.length}</span> data
          </p>
          <button
            onClick={() => navigate('/reports')}
            className="flex items-center gap-2 text-sm font-medium text-sky-600 hover:text-sky-700"
          >
            Lihat Semua <ArrowRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}