import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold">404</h1>
        <p className="mt-2 text-slate-600">Halaman tidak ditemukan.</p>
        <div className="mt-4">
          <Link to="/" className="button-primary">Kembali ke Dashboard</Link>
        </div>
      </div>
    </div>
  )
}
