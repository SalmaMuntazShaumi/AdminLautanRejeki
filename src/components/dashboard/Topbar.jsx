// components/dashboard/Topbar.jsx

import { Bell, LogOut, Menu } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const titles = {
  '/': 'Dashboard',
  '/karyawan': 'Karyawan',
  '/laporan': 'Laporan',
};

export default function Topbar({ onOpenSidebar }) {
  const location = useLocation();
  const title = titles[location.pathname] || 'Dashboard';
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-slate-300 px-4 sm:px-6 lg:px-8 py-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="inline-flex items-center justify-center rounded-2xl border border-slate-200 p-3 text-slate-600 hover:bg-slate-100 lg:hidden"
        >
          <Menu size={18} />
        </button>

        <div>
          <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
          <p className="text-sm text-slate-500 mt-1">Monitor aktivitas absensi karyawan</p>
        </div>

      </div>

      <div className="flex flex-row gap-2 sm:flex-row sm:items-center sm:justify-end w-full sm:w-auto">
        
        <button className="w-full flex sm:w-full h-11 rounded-2xl border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition">
          <Bell size={18} />
        </button>

        <button onClick={handleLogout} className="w-32 sm:w-32 h-11 rounded-2xl border border-slate-200 flex items-center justify-center transition 
        bg-red-600 text-white hover:bg-red-700">
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}