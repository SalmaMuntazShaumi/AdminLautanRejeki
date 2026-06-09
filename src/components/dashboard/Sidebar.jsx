// components/dashboard/Sidebar.jsx

import { useEffect, useState } from 'react'
import {
  LayoutDashboard,
  FileSpreadsheet,
  Users,
  X,
  Car,
} from 'lucide-react'

import { NavLink } from 'react-router-dom'
import { getUser } from '../../api/auth'

const menus = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    to: '/',
  },
  {
    label: 'Request Time Off',
    icon: FileSpreadsheet,
    to: '/request-time-off',
  },
  {
    label: 'Track Drivers',
    icon: Car,
    to: '/track-drivers',
  },
  {
    label: 'Workers',
    icon: Users,
    to: '/karyawan',
  },
]

export default function Sidebar({ isOpen, onClose }) {

  const [user, setUser] = useState(null)

  useEffect(() => {

    let mounted = true

    const fetchUser = async () => {
      try {

        const data = await getUser()

        if (mounted) {
          setUser(data)
          console.log('User loaded:', data)
        }

      } catch (err) {
        console.error('Failed to fetch user', err)
      }
    }

    fetchUser()

    return () => {
      mounted = false
    }

  }, [])

  return (
    <aside
      className={`fixed top-0 left-0 w-72 h-screen overflow-y-auto transform bg-slate-900 text-white flex flex-col p-6 transition-transform duration-300 ease-in-out z-40 ${
        isOpen
          ? 'translate-x-0'
          : '-translate-x-full'
      } lg:translate-x-0`}>

      {/* HEADER */}
      <div className="flex items-center justify-between gap-4 mb-10">

        <div className="flex items-center gap-4">

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

        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center justify-center rounded-2xl border border-slate-700 p-2 text-slate-300 hover:bg-slate-800 lg:hidden"
        >
          <X size={18} />
        </button>

      </div>

      {/* USER INFO */}
      {user && (
        <div className="mb-6 bg-slate-800 rounded-2xl p-4">
          <p className="font-semibold">
            {user.name}
          </p>

          <p className="text-sm text-slate-400">
            {user.role}
          </p>
        </div>
      )}

      {/* MENU */}
      <nav className="space-y-2 flex-1">

        {menus.map((menu) => {

          const Icon = menu.icon

          return (
            <NavLink
              key={menu.label}
              to={menu.to}
              end={menu.to === '/'}
              className={({ isActive }) =>
                `w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition ${
                  isActive
                    ? 'bg-sky-600 text-white'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <Icon size={20} />

              <span className="font-medium">
                {menu.label}
              </span>

            </NavLink>
          )
        })}

      </nav>

      {/* FOOTER */}
      <div className="bg-slate-800 rounded-2xl p-4 mt-6">

        <p className="text-sm text-slate-300 leading-relaxed">
          Kelola absensi dan export laporan secara realtime.
        </p>

      </div>

    </aside>
  )
}