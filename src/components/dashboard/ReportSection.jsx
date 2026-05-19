// components/dashboard/ReportSection.jsx

import ReportFilter from './ReportFilter';

export default function ReportSection({
  onExport
}) {
  return (
    <div className="card p-6">

      <div className="flex items-start justify-between mb-6">

        <div>
          <h2 className="text-xl font-bold text-slate-800">
            Export Laporan
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Download laporan absensi harian,
            bulanan, atau tahunan.
          </p>
        </div>

      </div>

      <ReportFilter onExport={onExport} />

    </div>
  );
}