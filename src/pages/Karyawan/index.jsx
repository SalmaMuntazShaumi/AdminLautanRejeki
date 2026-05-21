import { useEffect, useState } from 'react'
import DashboardLayout from '../../layout/DashboardLayout'
import { getKaryawan } from '../../api/karyawan'

export default function KaryawanPage() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    const fetch = async () => {
      try {
        const res = await getKaryawan()
        if (mounted) setData(res.data || [])
      } catch (err) {
        console.error('Failed to fetch karyawan', err)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetch()
    return () => (mounted = false)
  }, [])

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Karyawan</h2>
            <p className="text-sm text-slate-500">Daftar karyawan terdaftar</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-4">
          {loading ? (
            <div className="animate-pulse space-y-2">
              <div className="h-4 bg-slate-200 rounded w-1/3" />
              <div className="h-4 bg-slate-200 rounded w-full" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left table-auto">
                <thead>
                  <tr className="text-sm text-slate-500">
                    <th className="py-3">Nama</th>
                    <th className="py-3">Email</th>
                    <th className="py-3">Jabatan</th>
                  </tr>
                </thead>

                <tbody>
                  {data.length === 0 && (
                    <tr>
                      <td colSpan={3} className="py-6 text-center text-slate-500">Belum ada karyawan</td>
                    </tr>
                  )}

                  {data.map((k) => (
                    <tr key={k.id} className="border-t">
                      <td className="py-3">{k.name}</td>
                      <td className="py-3">{k.email}</td>
                      <td className="py-3">{k.position || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
