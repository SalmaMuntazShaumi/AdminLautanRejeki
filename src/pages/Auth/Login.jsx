import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { useAuth } from '../../contexts/AuthContext'

// Sesuai data yang di-seed di migration companies (slug: pusat, cabang).
// Kalau nanti ada endpoint GET /api/companies, ganti bagian ini dengan fetch dinamis.
const COMPANIES = [
  { slug: 'pusat', name: 'Lautan Rejeki Pusat' },
  { slug: 'cabang', name: 'Lautan Rejeki Cabang' },
]

export default function LoginPage() {
  const [mode, setMode] = useState('password') // 'password' | 'otp'

  const [companyId, setCompanyId] = useState('')

  // AuthController@login menerima field tunggal "login" (auto-detect email vs phone)
  const [loginField, setLoginField] = useState('')
  const [password, setPassword] = useState('')

  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)

  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  // AuthContext perlu diupdate supaya meneruskan companyId ke endpoint yang sesuai:
  // - login(loginField, password, companyId)      -> POST /api/login      { login, password, company_id }
  // - requestOtp(phone, companyId)                 -> POST /api/otp/request { phone, company_id }
  // - verifyOtp(phone, otp, companyId)              -> POST /api/otp/verify  { phone, otp, company_id }
  const { login, requestOtp, verifyOtp } = useAuth()

  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const getErrorMessage = (err, fallback) => {
    const errors = err.response?.data?.errors
    const firstError = errors ? Object.values(errors)[0]?.[0] : null
    return firstError || err.response?.data?.message || fallback
  }

  const handlePasswordLogin = async (e) => {
    e.preventDefault()

    if (!companyId) {
      setError('Silakan pilih perusahaan terlebih dahulu.')
      return
    }

    setError(null)
    setLoading(true)
    try {
      await login(loginField, password, companyId)
      navigate(from, { replace: true })
    } catch (err) {
      setError(getErrorMessage(err, 'Email/nomor telepon atau password salah.'))
    } finally {
      setLoading(false)
    }
  }

  const handleRequestOtp = async () => {
    if (!companyId) {
      setError('Silakan pilih perusahaan terlebih dahulu.')
      return
    }

    setError(null)
    setLoading(true)
    try {
      await requestOtp(phone, companyId)
      setOtpSent(true)
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal mengirim OTP.'))
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault()

    setError(null)
    setLoading(true)
    try {
      await verifyOtp(phone, otp, companyId)
      navigate(from, { replace: true })
    } catch (err) {
      setError(getErrorMessage(err, 'OTP tidak valid.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="max-w-md w-full p-8 bg-white rounded-2xl shadow">

        <h2 className="text-2xl font-bold mb-2">Masuk ke Lautan Rejeki</h2>
        <p className="text-sm text-slate-500 mb-6">Kelola absensi karyawan dengan mudah.</p>

        <div className="mb-6">
          <label className="text-sm font-medium">Perusahaan</label>
          <select
            value={companyId}
            onChange={(e) => setCompanyId(e.target.value)}
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

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => { setMode('password'); setError(null) }}
            className={`flex-1 py-2 rounded-lg border ${mode === 'password' ? 'bg-sky-500 text-white' : 'bg-white'}`}
          >
            Password
          </button>
          <button
            onClick={() => { setMode('otp'); setError(null) }}
            className={`flex-1 py-2 rounded-lg border ${mode === 'otp' ? 'bg-sky-500 text-white' : 'bg-white'}`}
          >
            OTP WhatsApp
          </button>
        </div>

        {error && <div className="text-sm text-red-600 mb-4">{error}</div>}

        {mode === 'password' && (
          <form onSubmit={handlePasswordLogin} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Email atau Nomor Telepon</label>
              <Input type="text" value={loginField} onChange={(e) => setLoginField(e.target.value)}
                required placeholder="you@company.com / 08xxxxxxxxxx" className="mt-1 w-full" />
            </div>
            <div>
              <label className="text-sm font-medium">Password</label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                required placeholder="••••••••" className="mt-1 w-full" />
            </div>
            <Button type="submit" className="w-full py-3" disabled={loading}>
              {loading ? 'Memproses...' : 'Masuk'}
            </Button>
          </form>
        )}

        {mode === 'otp' && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Nomor Telepon</label>
              <Input type="text" value={phone} onChange={(e) => setPhone(e.target.value)}
                placeholder="08xxxxxxxxxx" className="mt-1 w-full" disabled={otpSent} />
            </div>

            {!otpSent ? (
              <Button onClick={handleRequestOtp} className="w-full py-3" disabled={loading}>
                {loading ? 'Mengirim OTP...' : 'Kirim OTP'}
              </Button>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Kode OTP</label>
                  <Input type="text" value={otp} onChange={(e) => setOtp(e.target.value)}
                    placeholder="6 digit kode OTP" maxLength={6} className="mt-1 w-full" />
                </div>
                <Button type="submit" className="w-full py-3" disabled={loading}>
                  {loading ? 'Memverifikasi...' : 'Verifikasi OTP'}
                </Button>
                <button
                  type="button"
                  onClick={() => { setOtpSent(false); setOtp('') }}
                  className="text-sm text-sky-600 hover:underline w-full text-center"
                >
                  Ganti nomor telepon
                </button>
              </form>
            )}
          </div>
        )}

        <div className="text-sm text-center text-slate-500 mt-6">
          Belum punya akun?
          <Link to="/register" className="text-sky-600 ml-1 hover:underline">Daftar disini</Link>
        </div>
      </Card>
    </div>
  )
}