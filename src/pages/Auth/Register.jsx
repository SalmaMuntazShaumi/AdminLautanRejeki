import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'

import axios from '../../api/axios'

// Sesuai data yang di-seed di migration companies (slug: pusat, cabang).
// Kalau nanti ada endpoint GET /api/companies, ganti bagian ini dengan fetch dinamis.
const COMPANIES = [
  { slug: 'pusat', name: 'Lautan Rejeki Pusat' },
  { slug: 'cabang', name: 'Lautan Rejeki Cabang' },
]

export default function RegisterPage() {

  const navigate = useNavigate()

  const [form, setForm] = useState({
    company_id: '', // dikirim sebagai slug, resolveCompany() di backend menerima slug atau id numerik
    name: '',
    email: '',
    phone: '',
    password: '',
    birthdate: '',
    role: 'Employee',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.company_id) {
      setError('Silakan pilih perusahaan terlebih dahulu.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // AuthController@register mengharapkan: name, email, phone, password, role, birthdate
      // + company_id (dipakai resolveCompany() untuk menentukan tenant)
      await axios.post('/api/register', form)
      navigate('/login')
    } catch (err) {
      // Laravel validation error biasanya ada di err.response.data.errors (per-field)
      const errors = err.response?.data?.errors
      const firstError = errors ? Object.values(errors)[0]?.[0] : null

      setError(
        firstError ||
        err.response?.data?.message ||
        'Gagal register'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">

      <Card className="max-w-md w-full p-8 bg-white rounded-2xl shadow">

        <h2 className="text-2xl font-bold mb-2">
          Buat Akun
        </h2>

        <p className="text-sm text-slate-500 mb-6">
          Daftarkan akun karyawan baru.
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          {error && (
            <div className="text-sm text-red-600">
              {error}
            </div>
          )}

          <div>
            <label className="text-sm font-medium">Perusahaan</label>
            <select
              name="company_id"
              value={form.company_id}
              onChange={handleChange}
              required
              className="w-full border rounded-xl px-4 py-3 mt-1"
            >
              <option value="" disabled>
                Pilih Perusahaan
              </option>
              {COMPANIES.map((company) => (
                <option key={company.slug} value={company.slug}>
                  {company.name}
                </option>
              ))}
            </select>
          </div>

          <Input
            name="name"
            placeholder="Nama Lengkap"
            value={form.name}
            onChange={handleChange}
            required
          />

          <Input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <Input
            name="phone"
            placeholder="Nomor Telepon"
            value={form.phone}
            onChange={handleChange}
            required
          />

          <Input
            name="birthdate"
            type="date"
            value={form.birthdate}
            onChange={handleChange}
            required
          />

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full border rounded-xl px-4 py-3"
          >
            <option value="Employee">
              Employee
            </option>

            <option value="Driver">
              Driver
            </option>

            <option value="Admin">
              Admin
            </option>

            <option value="Supervisor">
              Supervisor
            </option>
          </select>

          <Input
            name="password"
            type="password"
            placeholder="Password (min. 6 karakter)"
            value={form.password}
            onChange={handleChange}
            required
            minLength={6}
          />

          <Button
            type="submit"
            className="w-full py-3"
            disabled={loading}
          >
            {
              loading
                ? 'Memproses...'
                : 'Daftar'
            }
          </Button>

        </form>

        <div className="mt-6 text-sm text-center text-slate-500">

          Sudah punya akun?

          <Link
            to="/login"
            className="text-sky-600 ml-1 hover:underline"
          >
            Masuk
          </Link>

        </div>

      </Card>

    </div>
  )
}