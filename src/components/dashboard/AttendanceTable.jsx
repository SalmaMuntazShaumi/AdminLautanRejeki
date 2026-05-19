// components/dashboard/AttendanceTable.jsx

import { Search } from 'lucide-react';

import AttendanceRow from './AttendanceRow';
import LoadingSkeleton from '../ui/LoadingSkeleton';
import EmptyState from '../ui/EmptyState';

export default function AttendanceTable({
  data,
  loading,
  searchQuery,
  setSearchQuery
}) {
  return (
    <div className="card overflow-hidden">

      <div className="p-6 border-b border-slate-200 flex flex-col lg:flex-row lg:items-center justify-between gap-4">

        <div>
          <h2 className="text-xl font-bold text-slate-800">
            Riwayat Absensi
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Data realtime absensi karyawan
          </p>
        </div>

        <div className="relative w-full lg:w-80">

          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Cari nama..."
            value={searchQuery}
            onChange={(e) =>
              setSearchQuery(e.target.value)
            }
            className="input pl-11"
          />

        </div>

      </div>

      <div className="overflow-x-auto">

        {loading ? (
          <div className="p-6">
            <LoadingSkeleton />
          </div>
        ) : data.length === 0 ? (
          <EmptyState />
        ) : (
          <table className="w-full">

            <thead className="bg-slate-50 border-b border-slate-200">

              <tr>

                <th className="table-header table-cell">
                  Nama
                </th>

                <th className="table-header table-cell">
                  Tanggal
                </th>

                <th className="table-header table-cell">
                  Jam Masuk
                </th>

                <th className="table-header table-cell">
                  Jam Keluar
                </th>

                <th className="table-header table-cell">
                  Status
                </th>

              </tr>

            </thead>

            <tbody>

              {data.map((item) => (
                <AttendanceRow
                  key={item.id}
                  item={item}
                />
              ))}

            </tbody>

          </table>
        )}

      </div>

    </div>
  );
}