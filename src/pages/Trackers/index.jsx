import { useEffect, useState } from "react";
import DashboardLayout from "../../layout/DashboardLayout";
import api from "../../api/axios";

const statusConfig = {
  on_delivery: { label: "Dalam Perjalanan", color: "bg-blue-100 text-blue-700" },
  arrived:     { label: "Selesai",          color: "bg-green-100 text-green-700" },
  idle:        { label: "Idle",             color: "bg-gray-100 text-gray-600" },
};

function formatDate(dateStr) {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleString("id-ID", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function formatDuration(start, end) {
  if (!start || !end) return "-";
  const diff = Math.floor((new Date(end) - new Date(start)) / 1000);
  const h = Math.floor(diff / 3600);
  const m = Math.floor((diff % 3600) / 60);
  if (h > 0) return `${h}j ${m}m`;
  return `${m} menit`;
}

function CoordLink({ lat, lng, label }) {
  if (!lat || !lng) return <span className="text-gray-400">-</span>;
  return (
    <a
      href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}&zoom=16`}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 hover:underline text-xs flex items-center gap-1"
    >
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
      {label}
    </a>
  );
}

export default function TrackDrivers() {
  const [history, setHistory]         = useState([]);
  const [activeDrivers, setActive]    = useState([]);
  const [loading, setLoading]         = useState(true);
  const [activeLoading, setActiveLoading] = useState(true);
  const [search, setSearch]           = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [tab, setTab]                 = useState("active"); // "active" | "history"

  useEffect(() => {
    fetchActive();
    fetchHistory();
    const interval = setInterval(fetchActive, 10000);
    return () => clearInterval(interval);
  }, []);

  async function fetchActive() {
    try {
      setActiveLoading(true);
      const res = await api.get("/api/admin/drivers/active");
      setActive(res.data.data ?? []);
    } catch (e) {
      console.error(e);
    } finally {
      setActiveLoading(false);
    }
  }

  async function fetchHistory() {
    try {
      setLoading(true);
      const res = await api.get("/api/admin/drivers/history");
      setHistory(res.data.data ?? []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const filteredHistory = history.filter((row) => {
    const matchSearch = row.name?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || row.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Lacak Driver</h1>
            <p className="text-sm text-gray-500 mt-1">
              Monitor driver aktif dan riwayat pengiriman
            </p>
          </div>
          <button
            onClick={() => { fetchActive(); fetchHistory(); }}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
          {[
            { key: "active",  label: `Driver Aktif (${activeDrivers.length})` },
            { key: "history", label: "Riwayat Pengiriman" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                tab === t.key
                  ? "bg-white text-gray-800 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── ACTIVE DRIVERS TAB ── */}
        {tab === "active" && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {activeLoading ? (
              <div className="flex justify-center py-16">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : activeDrivers.length === 0 ? (
              <div className="flex flex-col items-center py-16 text-gray-400">
                <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                <p className="font-medium">Tidak ada driver aktif</p>
                <p className="text-sm mt-1">Semua driver sedang istirahat</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {activeDrivers.map((driver) => (
                  <div key={driver.driver_id}
                    className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600">
                        {driver.name?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{driver.name}</p>
                        <p className="text-xs text-gray-500">
                          Mulai: {formatDate(driver.started_at)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <CoordLink
                        lat={driver.latitude}
                        lng={driver.longitude}
                        label="Lihat Lokasi"
                      />
                      <span className="flex items-center gap-1 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                        Live
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── HISTORY TAB ── */}
        {tab === "history" && (
          <div className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Cari nama driver..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="all">Semua Status</option>
                <option value="on_delivery">Dalam Perjalanan</option>
                <option value="arrived">Selesai</option>
                <option value="idle">Idle</option>
              </select>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {loading ? (
                <div className="flex justify-center py-16">
                  <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : filteredHistory.length === 0 ? (
                <div className="flex flex-col items-center py-16 text-gray-400">
                  <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <p className="font-medium">Belum ada riwayat</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100">
                        <th className="text-left px-6 py-3 font-semibold text-gray-600">Driver</th>
                        <th className="text-left px-6 py-3 font-semibold text-gray-600">Lokasi Mulai</th>
                        <th className="text-left px-6 py-3 font-semibold text-gray-600">Lokasi Selesai</th>
                        <th className="text-left px-6 py-3 font-semibold text-gray-600">Waktu Mulai</th>
                        <th className="text-left px-6 py-3 font-semibold text-gray-600">Waktu Selesai</th>
                        <th className="text-left px-6 py-3 font-semibold text-gray-600">Durasi</th>
                        <th className="text-left px-6 py-3 font-semibold text-gray-600">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {filteredHistory.map((row) => {
                        const status = statusConfig[row.status] ?? statusConfig.idle;
                        return (
                          <tr key={row.id} className="hover:bg-gray-50 transition">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600 text-xs">
                                  {row.name?.[0]?.toUpperCase()}
                                </div>
                                <span className="font-medium text-gray-800">{row.name}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <CoordLink
                                lat={row.start_lat}
                                lng={row.start_lng}
                                label={`${Number(row.start_lat).toFixed(4)}, ${Number(row.start_lng).toFixed(4)}`}
                              />
                            </td>
                            <td className="px-6 py-4">
                              {row.status === 'arrived' ? (
                                <CoordLink
                                  lat={row.end_lat}
                                  lng={row.end_lng}
                                  label={`${Number(row.end_lat).toFixed(4)}, ${Number(row.end_lng).toFixed(4)}`}
                                />
                              ) : (
                                <span className="text-gray-400 text-xs">Belum selesai</span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                              {formatDate(row.started_at)}
                            </td>
                            <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                              {formatDate(row.arrived_at)}
                            </td>
                            <td className="px-6 py-4 text-gray-600">
                              {formatDuration(row.started_at, row.arrived_at)}
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}>
                                {status.label}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}