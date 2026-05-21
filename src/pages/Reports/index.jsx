import { useState } from 'react'
import DashboardLayout from '../../layout/DashboardLayout'
import { exportAbsensi } from '../../api/absensi'

export default function ReportsPage() {
  const [bulan, setBulan] = useState('')
  const [tahun, setTahun] = useState('')
  const [loading, setLoading] = useState(false)

  const handleExport = async () => {
    setLoading(true)
    try {
      const blob = await exportAbsensi({ bulan, tahun, format: 'xlsx' })
      const url = window.URL.createObjectURL(new Blob([blob.data]))
      const a = document.createElement('a')
      a.href = url
      a.download = `laporan-absensi-${tahun || 'all'}-${bulan || 'all'}.xlsx`
      document.body.appendChild(a)
      a.click()
      a.remove()
    } catch (err) {
      console.error('Export failed', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Laporan Absensi</h2>
          <p className="text-sm text-slate-500">Export laporan bulanan atau tahunan</p>
        </div>

        <div className="bg-white rounded-2xl shadow p-6 flex flex-col gap-4 sm:flex-row items-end">
          <div className="w-full sm:w-auto">
            <label className="text-sm font-medium">Bulan</label>
            <input value={bulan} onChange={(e)=>setBulan(e.target.value)} placeholder="01" className="input mt-1" />
          </div>

          <div className="w-full sm:w-auto">
            <label className="text-sm font-medium">Tahun</label>
            <input value={tahun} onChange={(e)=>setTahun(e.target.value)} placeholder="2026" className="input mt-1" />
          </div>

          <div className="w-full sm:w-auto">
            <button onClick={handleExport} className="button-primary w-full sm:w-auto" disabled={loading}>
              {loading ? 'Mengekspor...' : 'Export (.xlsx)'}
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
