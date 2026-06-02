import { useEffect, useState } from 'react';
import DashboardLayout from '../../layout/DashboardLayout';
import { timeOffService } from '../../api/time_off';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

const STATUS_STYLE = {
  'Menunggu Konfirmasi': 'bg-amber-100 text-amber-700',
  'diterima':           'bg-emerald-100 text-emerald-700',
  'ditolak':            'bg-rose-100 text-rose-700',
};

const STATUS_ICON = {
  'Menunggu Konfirmasi': <Clock size={14} />,
  'diterima':           <CheckCircle size={14} />,
  'ditolak':            <XCircle size={14} />,
};

export default function TimeOffPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [actionId, setActionId] = useState(null); // untuk loading state per-row

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      const data = await timeOffService.getAll();
      setRequests(data);
    } catch (err) {
      console.error('Failed to fetch time off', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove(id) {
    setActionId(id);
    try {
      await timeOffService.approve(id);
      await fetchData(); // refresh
    } catch (err) {
      console.error('Approve failed', err);
    } finally {
      setActionId(null);
    }
  }

  async function handleReject(id) {
    setActionId(id);
    try {
      await timeOffService.reject(id);
      await fetchData();
    } catch (err) {
      console.error('Reject failed', err);
    } finally {
      setActionId(null);
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Request Time Off</h2>
          <p className="text-sm text-slate-500 mt-1">
            Kelola pengajuan cuti dan izin karyawan
          </p>
        </div>

        {/* Table Card */}
        <div className="card overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-800">Semua Pengajuan</h3>
              <span className="text-sm text-slate-500">
                {requests.length} pengajuan
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-12 text-center text-slate-400">Memuat data...</div>
            ) : requests.length === 0 ? (
              <div className="p-12 text-center text-slate-400">
                Belum ada pengajuan time off
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="table-header table-cell">Nama</th>
                    <th className="table-header table-cell">Tipe</th>
                    <th className="table-header table-cell">Tanggal Mulai</th>
                    <th className="table-header table-cell">Tanggal Selesai</th>
                    <th className="table-header table-cell">Alasan</th>
                    <th className="table-header table-cell">Status</th>
                    <th className="table-header table-cell">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((req) => (
                    <tr key={req.id} className="border-t border-slate-100 hover:bg-slate-50">
                      <td className="px-6 py-4 font-medium text-slate-800">{req.nama}</td>
                      <td className="px-6 py-4 capitalize text-slate-600">{req.type}</td>
                      <td className="px-6 py-4 text-slate-600">{req.start_date}</td>
                      <td className="px-6 py-4 text-slate-600">{req.end_date}</td>
                      <td className="px-6 py-4 text-slate-600 max-w-xs truncate">{req.reason}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${STATUS_STYLE[req.status] ?? 'bg-slate-100 text-slate-600'}`}>
                          {STATUS_ICON[req.status]}
                          {req.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {req.status === 'Menunggu Konfirmasi' ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleApprove(req.id)}
                              disabled={actionId === req.id}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-700 hover:bg-emerald-200 text-xs font-medium disabled:opacity-50"
                            >
                              <CheckCircle size={14} />
                              {actionId === req.id ? '...' : 'Terima'}
                            </button>
                            <button
                              onClick={() => handleReject(req.id)}
                              disabled={actionId === req.id}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-100 text-rose-700 hover:bg-rose-200 text-xs font-medium disabled:opacity-50"
                            >
                              <XCircle size={14} />
                              {actionId === req.id ? '...' : 'Tolak'}
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}