import { useEffect, useState, useMemo } from 'react'
import DashboardLayout from '../../layout/DashboardLayout'
import { getKaryawan } from '../../api/karyawan'
import { ChevronLeft, ChevronRight, ChevronsUpDown } from 'lucide-react'

const PAGE_SIZE = 10

export default function KaryawanPage() {
  const [data, setData]       = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)
  const [page, setPage]       = useState(1)
  const [search, setSearch]   = useState('')
  const [sortKey, setSortKey] = useState('name')
  const [sortDir, setSortDir] = useState('asc')

  useEffect(() => {
    let mounted = true
    const fetch = async () => {
      try {
        const users = await getKaryawan()
        if (mounted) { setData(users); setError(null) }
      } catch (err) {
        if (mounted) setError(err?.message || 'Gagal memuat data karyawan')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    fetch()
    return () => (mounted = false)
  }, [])

  function toggleSort(key) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
    setPage(1)
  }

  const processed = useMemo(() => {
    let result = [...data]

    // Filter by search
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (k) =>
          k.name?.toLowerCase().includes(q) ||
          k.email?.toLowerCase().includes(q) ||
          k.role?.toLowerCase().includes(q)
      )
    }

    // Sort
    result.sort((a, b) => {
      let valA = a[sortKey] ?? ''
      let valB = b[sortKey] ?? ''

      if (sortKey === 'birthdate') {
        valA = valA ? new Date(valA) : new Date(0)
        valB = valB ? new Date(valB) : new Date(0)
        return sortDir === 'asc' ? valA - valB : valB - valA
      }

      valA = String(valA).toLowerCase()
      valB = String(valB).toLowerCase()
      if (valA < valB) return sortDir === 'asc' ? -1 : 1
      if (valA > valB) return sortDir === 'asc' ? 1 : -1
      return 0
    })

    return result
  }, [data, search, sortKey, sortDir])

  const totalPages  = Math.max(1, Math.ceil(processed.length / PAGE_SIZE))
  const paged       = processed.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function SortIcon({ colKey }) {
    if (sortKey !== colKey) return <ChevronsUpDown size={14} className="inline ml-1 text-slate-300" />
    return (
      <span className="inline ml-1 text-sky-500 text-xs">
        {sortDir === 'asc' ? '↑' : '↓'}
      </span>
    )
  }

  const thClass = "py-3 px-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide cursor-pointer select-none hover:text-slate-700"

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Karyawan</h2>
            <p className="text-sm text-slate-500">Daftar karyawan terdaftar</p>
          </div>

          {/* Filter bar */}
          <div className="flex flex-wrap gap-3 items-center">
            <input
              type="text"
              placeholder="Cari nama / email / jabatan..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              className="input w-64"
            />
            <select
              value={`${sortKey}-${sortDir}`}
              onChange={(e) => {
                const [key, dir] = e.target.value.split('-')
                setSortKey(key); setSortDir(dir); setPage(1)
              }}
              className="input w-auto"
            >
              <option value="name-asc">Nama A–Z</option>
              <option value="name-desc">Nama Z–A</option>
              <option value="birthdate-asc">Kelahiran Tertua</option>
              <option value="birthdate-desc">Kelahiran Termuda</option>
            </select>
          </div>
        </div>

        {/* Table card */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-8 space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-4 bg-slate-100 rounded animate-pulse" />
                ))}
              </div>
            ) : error ? (
              <div className="py-12 text-center text-red-500">{error}</div>
            ) : (
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className={thClass} onClick={() => toggleSort('name')}>
                      Nama <SortIcon colKey="name" />
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Telepon
                    </th>
                    <th className={thClass} onClick={() => toggleSort('email')}>
                      Email <SortIcon colKey="email" />
                    </th>
                    <th className={thClass} onClick={() => toggleSort('birthdate')}>
                      Tgl Lahir <SortIcon colKey="birthdate" />
                    </th>
                    <th className={thClass} onClick={() => toggleSort('role')}>
                      Jabatan <SortIcon colKey="role" />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paged.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-400">
                        Tidak ada data ditemukan
                      </td>
                    </tr>
                  ) : (
                    paged.map((k) => (
                      <tr key={k.id} className="border-t border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4 font-medium text-slate-800">{k.name}</td>
                        <td className="py-3 px-4 text-slate-600">{k.phone || '-'}</td>
                        <td className="py-3 px-4 text-slate-600">{k.email || '-'}</td>
                        <td className="py-3 px-4 text-slate-600">{k.birthdate || '-'}</td>
                        <td className="py-3 px-4 text-slate-600">{k.role || k.position || '-'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          {!loading && !error && processed.length > 0 && (
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <p className="text-sm text-slate-500">
                Menampilkan{' '}
                <span className="font-semibold text-slate-700">
                  {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, processed.length)}
                </span>{' '}
                dari <span className="font-semibold text-slate-700">{processed.length}</span> karyawan
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-sm font-medium text-slate-700">
                  {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}