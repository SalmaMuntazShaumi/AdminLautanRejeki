// components/dashboard/ReportFilter.jsx

import { useState } from 'react';

import { Download } from 'lucide-react';

export default function ReportFilter({
  onExport
}) {
  const [reportType, setReportType] =
    useState('daily');

  const [selectedDate, setSelectedDate] =
    useState(
      new Date().toISOString().split('T')[0]
    );

  const [selectedMonth, setSelectedMonth] =
    useState('2026-05');

  const [selectedYear, setSelectedYear] =
    useState('2026');

  function handleExport() {
    onExport({
      reportType,
      selectedDate,
      selectedMonth,
      selectedYear
    });
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-end">

      <div>
        <label className="block text-sm font-medium mb-2">
          Jenis Laporan
        </label>

        <select
          value={reportType}
          onChange={(e) =>
            setReportType(e.target.value)
          }
          className="input"
        >
          <option value="daily">
            Harian
          </option>

          <option value="monthly">
            Bulanan
          </option>

          <option value="yearly">
            Tahunan
          </option>
        </select>
      </div>

      {reportType === 'daily' && (
        <div>
          <label className="block text-sm font-medium mb-2">
            Tanggal
          </label>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) =>
              setSelectedDate(e.target.value)
            }
            className="input"
          />
        </div>
      )}

      {reportType === 'monthly' && (
        <div>
          <label className="block text-sm font-medium mb-2">
            Bulan
          </label>

          <input
            type="month"
            value={selectedMonth}
            onChange={(e) =>
              setSelectedMonth(e.target.value)
            }
            className="input"
          />
        </div>
      )}

      {reportType === 'yearly' && (
        <div>
          <label className="block text-sm font-medium mb-2">
            Tahun
          </label>

          <select
            value={selectedYear}
            onChange={(e) =>
              setSelectedYear(e.target.value)
            }
            className="input"
          >
            <option value="2026">
              2026
            </option>

            <option value="2025">
              2025
            </option>
          </select>
        </div>
      )}

      <button
        onClick={handleExport}
        className="button-primary"
      >
        <Download size={18} />

        Download Excel
      </button>

    </div>
  );
}