import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [email, setEmail] = useState('admin@newsplatform.com')
  const [password, setPassword] = useState('Admin@123')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(email, password)
      toast.success('Welcome back!')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-ink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="font-display text-3xl font-bold text-ink-900">India<span className="text-crimson-500">Ink</span></p>
          <p className="font-body text-sm text-ink-500 mt-1">Admin Panel — Sign in to continue</p>
        </div>
        <div className="bg-white rounded-2xl border border-ink-100 p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="form-label">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                className="form-input" placeholder="admin@newsplatform.com" />
            </div>
            <div>
              <label className="form-label">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                className="form-input" placeholder="••••••••" />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 text-base">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : 'Sign In'}
            </button>
          </form>
          <div className="mt-5 p-3 bg-ink-50 rounded-xl">
            <p className="font-body text-xs text-ink-500 text-center">
              Default: <strong>admin@newsplatform.com</strong> / <strong>Admin@123</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
