import { useEffect, useRef, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale,
  BarElement, Title, Tooltip, Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Download } from 'lucide-react';
import { getWeekNumber } from '../../utils/week_helper';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const YEARS = Array.from({ length: 5 }, (_, i) => String(new Date().getFullYear() - i));
const MONTHS = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Ags','Sep','Okt','Nov','Des'];

export default function AttendanceChart({ data, loading, onFilterDate, onExport }) {
  const [reportType, setReportType]       = useState('daily');
  const [selectedDate, setSelectedDate]   = useState(new Date().toISOString().split('T')[0]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [selectedYear, setSelectedYear]   = useState(String(new Date().getFullYear()));
  const hasMounted = useRef(false);
  const [selectedWeek, setSelectedWeek] = useState(() => {
    const now = new Date();
    const week = getWeekNumber(now);
    return `${now.getFullYear()}-W${week}`;
  });

  useEffect(() => {
    if (!hasMounted.current) { hasMounted.current = true; return; }
    onFilterDate({ reportType, selectedDate, selectedMonth, selectedYear, selectedWeek });
  }, [reportType, selectedDate, selectedMonth, selectedYear]);

  const chartData = buildChartData(data, reportType);

  const chartConfig = {
    labels: chartData.map((d) => d.label),
    datasets: [
      {
        label: 'Tepat Waktu',
        data: chartData.map((d) => d['Tepat Waktu']),
        backgroundColor: '#10b981',
        borderRadius: 4,
      },
      {
        label: 'Terlambat',
        data: chartData.map((d) => d['Terlambat']),
        backgroundColor: '#f59e0b',
        borderRadius: 4,
      },
      {
        label: 'Izin/Cuti',
        data: chartData.map((d) => d['Izin/Cuti']),
        backgroundColor: '#6366f1',
        borderRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // ← tambah ini
    plugins: {
        legend: { position: 'top' },
        title:  { display: false },
    },
    scales: {
        y: { beginAtZero: true, ticks: { stepSize: 1 } },
    },
  };

  function handleExport() {
    onExport({ reportType, selectedDate, selectedMonth, selectedYear, selectedWeek });
  }

  return (
    <div className="card p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Grafik Kehadiran</h2>
          <p className="text-sm text-slate-500 mt-1">Ringkasan data absensi karyawan</p>
        </div>
        <button onClick={handleExport} className="button-primary flex items-center gap-2 self-start">
          <Download size={18} /> Export Excel
        </button>
      </div>

      {/* Filter */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-2">Jenis Laporan</label>
          <select value={reportType} onChange={(e) => setReportType(e.target.value)} className="input">
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
              {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        )}
      </div>

    {/* Chart */}
    {loading ? (
            <div className="h-48 flex items-center justify-center text-slate-400">Memuat data...</div>) : chartData.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-slate-400">Tidak ada data</div>
        ) : (
            <div style={{ height: '250px' }}>  {/* ← kontrol tinggi di sini */}
                <Bar data={chartConfig} options={chartOptions} />
            </div>
        )}
    </div>
  );
}

// ─── Helper ───────────────────────────────────────────────────────────────────
function buildChartData(data, reportType) {
  if (!Array.isArray(data) || data.length === 0) return [];

  function countByStatus(items) {
    return {
      'Tepat Waktu': items.filter((i) => i.status === 'on_time').length,
      'Terlambat':   items.filter((i) => i.status === 'late').length,
      'Izin/Cuti':   items.filter((i) => i.status === 'leave').length,
    };
  }

  if (reportType === 'daily') {
    return [{ label: 'Hari Ini', ...countByStatus(data) }];
  }

  if (reportType === 'weekly') {
    const grouped = {};
    data.forEach((item) => {
      const day = item.date?.slice(0, 10);
      if (!day) return;
      if (!grouped[day]) grouped[day] = [];
      grouped[day].push(item);
    });
    
    return Object.entries(grouped)
      .sort(([a], [b]) => new Date(a) - new Date(b))
      .map(([day, items]) => ({ label: day.slice(5), ...countByStatus(items) }));
  }

  if (reportType === 'monthly') {
    const grouped = {};
    data.forEach((item) => {
      const day = item.date?.slice(8, 10);
      if (!day) return;
      if (!grouped[day]) grouped[day] = [];
      grouped[day].push(item);
    });
    return Object.entries(grouped)
      .sort(([a], [b]) => Number(a) - Number(b))
      .map(([day, items]) => ({ label: day, ...countByStatus(items) }));
  }

  if (reportType === 'yearly') {
    const grouped = {};
    data.forEach((item) => {
      const month = item.date?.slice(5, 7);
      if (!month) return;
      if (!grouped[month]) grouped[month] = [];
      grouped[month].push(item);
    });
    return Object.entries(grouped)
      .sort(([a], [b]) => Number(a) - Number(b))
      .map(([month, items]) => ({
        label: MONTHS[Number(month) - 1],
        ...countByStatus(items),
      }));
  }

  return [];
}