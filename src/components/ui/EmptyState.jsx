// components/common/EmptyState.jsx

import { AlertCircle } from 'lucide-react';

export default function EmptyState({
  title = 'Data tidak ditemukan',
  description = 'Belum ada data yang tersedia'
}) {
  return (
    <div className="py-16 flex flex-col items-center justify-center text-center">

      <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
        <AlertCircle className="text-slate-400" />
      </div>

      <h3 className="font-semibold text-slate-700">
        {title}
      </h3>

      <p className="text-sm text-slate-500 mt-1">
        {description}
      </p>

    </div>
  );
}