// components/dashboard/Sidebar.jsx

import {
  LayoutDashboard,
  FileSpreadsheet,
  Users,
  X,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

const menus = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/' },
  { label: 'Laporan', icon: FileSpreadsheet, to: '/laporan' },
  { label: 'Karyawan', icon: Users, to: '/karyawan' },
];

export default function Sidebar({ isOpen, onClose }) {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-72 transform bg-slate-900 text-white flex-col p-6 transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:static lg:translate-x-0 lg:flex lg:screen lg:overflow-y-auto`}
    >
      <div className="flex items-center justify-between gap-4 mb-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-sky-600 flex items-center justify-center font-bold">
            LR
          </div>

          <div>
            <h1 className="font-bold text-lg">Lautan Rejeki</h1>
            <p className="text-sm text-slate-400">Attendance Dashboard</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center justify-center rounded-2xl border border-slate-700 p-2 text-slate-300 hover:bg-slate-800 lg:hidden"
        >
          <X size={18} />
        </button>
      </div>

      <nav className="space-y-2 flex-1">
        {menus.map((menu) => {
          const Icon = menu.icon;

          return (
            <NavLink
              key={menu.label}
              to={menu.to}
              end={menu.to === '/'}
              className={({ isActive }) =>
                `w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition ${
                  isActive ? 'bg-sky-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <Icon size={20} />
              <span className="font-medium">{menu.label}</span>
            </NavLink>
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