import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { useAuth } from '../../contexts/AuthContext'

export default function LoginPage() {
  const [mode, setMode] = useState('email')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)

  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const { login, requestOtp, loginWithOtp } = useAuth() // ✅ ambil loginWithOtp

  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const handleEmailLogin = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await login(email, password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || 'Email atau password salah.')
    } finally {
      setLoading(false)
    }
  }

  // ✅ Fix: panggil loginWithPhone bukan requestOtp langsung
  const loginWithPhone = async () => {
    setError(null)
    setLoading(true)
    try {
      await requestOtp(phone)
      setOtpSent(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal mengirim OTP.')
    } finally {
      setLoading(false)
    }
  }

  // ✅ Fix: pakai loginWithOtp dari context, bukan axios langsung
  const verifyOtp = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await loginWithOtp(phone, otp)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || 'OTP tidak valid.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="max-w-md w-full p-8 bg-white rounded-2xl shadow">

        <h2 className="text-2xl font-bold mb-2">Masuk ke Lautan Rejeki</h2>
        <p className="text-sm text-slate-500 mb-6">Kelola absensi karyawan dengan mudah.</p>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => { setMode('email'); setError(null) }}
            className={`flex-1 py-2 rounded-lg border ${mode === 'email' ? 'bg-sky-500 text-white' : 'bg-white'}`}
          >
            Email
          </button>
          <button
            onClick={() => { setMode('phone'); setError(null) }}
            className={`flex-1 py-2 rounded-lg border ${mode === 'phone' ? 'bg-sky-500 text-white' : 'bg-white'}`}
          >
            Nomor Telepon
          </button>
        </div>

        {error && <div className="text-sm text-red-600 mb-4">{error}</div>}

        {mode === 'email' && (
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Email</label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                required placeholder="you@company.com" className="mt-1 w-full" />
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

        {mode === 'phone' && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Nomor Telepon</label>
              <Input type="text" value={phone} onChange={(e) => setPhone(e.target.value)}
                placeholder="08xxxxxxxxxx" className="mt-1 w-full" />
            </div>

            {!otpSent ? (
              <Button onClick={loginWithPhone} className="w-full py-3" disabled={loading}>
                {loading ? 'Mengirim OTP...' : 'Kirim OTP'}
              </Button>
            ) : (
              <form onSubmit={verifyOtp} className="space-y-4">
                <div>
                  <label className="text-sm font-medium">OTP</label>
                  <Input type="text" value={otp} onChange={(e) => setOtp(e.target.value)}
                    placeholder="Masukkan OTP" className="mt-1 w-full" />
                </div>
                <Button type="submit" className="w-full py-3" disabled={loading}>
                  {loading ? 'Memverifikasi...' : 'Verifikasi OTP'}
                </Button>
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