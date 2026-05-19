// components/dashboard/Topbar.jsx

import { Bell } from 'lucide-react';

export default function Topbar() {
  return (
    <header className="h-20 bg-white border-b border-slate-200 px-6 lg:px-8 flex items-center justify-between">

      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Dashboard
        </h1>

        <p className="text-sm text-slate-500 mt-1">
          Monitor aktivitas absensi karyawan
        </p>
      </div>

      <div className="flex items-center gap-4">

        <button className="w-11 h-11 rounded-2xl border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition">
          <Bell size={18} />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-sky-600 text-white flex items-center justify-center font-semibold">
            A
          </div>

          <div>
            <h3 className="font-semibold text-sm">
              Admin
            </h3>

            <p className="text-xs text-slate-500">
              HR Management
            </p>
          </div>
        </div>

      </div>

    </header>
  );
}