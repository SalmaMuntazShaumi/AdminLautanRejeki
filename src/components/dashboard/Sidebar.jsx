// components/dashboard/Sidebar.jsx

import {
  LayoutDashboard,
  FileSpreadsheet,
  Users,
  Calendar
} from 'lucide-react';

const menus = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    active: true
  },
  {
    label: 'Laporan',
    icon: FileSpreadsheet
  },
  {
    label: 'Karyawan',
    icon: Users
  },
  {
    label: 'Kalender',
    icon: Calendar
  }
];

export default function Sidebar() {
  return (
    <aside className="hidden lg:flex w-72 bg-slate-900 text-white flex-col p-6">
      
      <div className="flex items-center gap-4 mb-10">
        <div className="w-12 h-12 rounded-2xl bg-sky-600 flex items-center justify-center font-bold">
          LR
        </div>

        <div>
          <h1 className="font-bold text-lg">
            Lautan Rejeki
          </h1>

          <p className="text-sm text-slate-400">
            Attendance Dashboard
          </p>
        </div>
      </div>

      <nav className="space-y-2 flex-1">
        {menus.map((menu) => {
          const Icon = menu.icon;

          return (
            <button
              key={menu.label}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition
                ${
                  menu.active
                    ? 'bg-sky-600 text-white'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }
              `}
            >
              <Icon size={20} />

              <span className="font-medium">
                {menu.label}
              </span>
            </button>
          );
        })}
      </nav>

      <div className="bg-slate-800 rounded-2xl p-4">
        <p className="text-sm text-slate-300 leading-relaxed">
          Kelola absensi dan export laporan secara realtime.
        </p>
      </div>

    </aside>
  );
}