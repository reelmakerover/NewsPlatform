import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useUserAuth } from '../context/UserAuthContext'
import SEOHead from '../components/common/SEOHead'
import toast from 'react-hot-toast'

export default function AuthPage({ mode = 'login' }) {
  const [isLogin, setIsLogin] = useState(mode === 'login')
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' })
  const [loading, setLoading] = useState(false)
  const { login, register } = useUserAuth()
  const navigate = useNavigate()

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (isLogin) {
        await login(form.email, form.password)
        toast.success('Welcome back! 👋')
      } else {
        await register(form.name, form.email, form.password, form.phone)
        toast.success('Account ban gaya! 🎉')
      }
      navigate('/')
    } catch (err) {
      toast.error(err.message || 'Kuch galat hua')
    } finally { setLoading(false) }
  }

  return (
    <>
      <SEOHead title={isLogin ? 'Login' : 'Register'} />
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/" className="font-display text-3xl font-bold text-ink-900">
              India<span className="text-crimson-500">Ink</span>
            </Link>
            <p className="font-body text-sm text-ink-500 mt-2">
              {isLogin ? 'Apne account mein login karo' : 'Naya account banao, free mein'}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-ink-100 shadow-sm overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-ink-100">
              {[['Login', true], ['Register', false]].map(([label, val]) => (
                <button key={label} onClick={() => setIsLogin(val)}
                  className={`flex-1 py-4 font-body text-sm font-medium transition-colors ${isLogin === val ? 'text-crimson-500 border-b-2 border-crimson-500 bg-crimson-50/50' : 'text-ink-500 hover:text-ink-700'}`}>
                  {label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              {!isLogin && (
                <div>
                  <label className="block font-body text-sm font-medium text-ink-700 mb-1.5">Poora Naam *</label>
                  <input value={form.name} onChange={e => set('name', e.target.value)} required={!isLogin}
                    className="w-full h-11 px-4 bg-ink-50 border border-ink-200 rounded-xl font-body text-sm focus:outline-none focus:ring-2 focus:ring-crimson-500 focus:border-transparent"
                    placeholder="Rahul Sharma" />
                </div>
              )}

              <div>
                <label className="block font-body text-sm font-medium text-ink-700 mb-1.5">Email Address *</label>
                <input type="email" value={form.email} onChange={e => set('email', e.target.value)} required
                  className="w-full h-11 px-4 bg-ink-50 border border-ink-200 rounded-xl font-body text-sm focus:outline-none focus:ring-2 focus:ring-crimson-500 focus:border-transparent"
                  placeholder="rahul@example.com" />
              </div>

              {!isLogin && (
                <div>
                  <label className="block font-body text-sm font-medium text-ink-700 mb-1.5">Phone Number</label>
                  <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)}
                    className="w-full h-11 px-4 bg-ink-50 border border-ink-200 rounded-xl font-body text-sm focus:outline-none focus:ring-2 focus:ring-crimson-500 focus:border-transparent"
                    placeholder="+91 98765 43210" />
                </div>
              )}

              <div>
                <label className="block font-body text-sm font-medium text-ink-700 mb-1.5">Password *</label>
                <input type="password" value={form.password} onChange={e => set('password', e.target.value)} required
                  className="w-full h-11 px-4 bg-ink-50 border border-ink-200 rounded-xl font-body text-sm focus:outline-none focus:ring-2 focus:ring-crimson-500 focus:border-transparent"
                  placeholder={isLogin ? '••••••••' : 'Kam se kam 6 characters'} />
              </div>

              <button type="submit" disabled={loading}
                className="w-full h-12 bg-crimson-500 hover:bg-crimson-600 text-white font-body font-medium rounded-xl transition-colors flex items-center justify-center gap-2">
                {loading
                  ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : isLogin ? '🔓 Login Karo' : '🚀 Account Banao'}
              </button>

              {!isLogin && (
                <p className="font-body text-xs text-ink-400 text-center leading-relaxed">
                  Register karke aap hamare Terms of Service aur Privacy Policy se agree karte ho
                </p>
              )}
            </form>
          </div>

          <p className="text-center font-body text-sm text-ink-500 mt-6">
            {isLogin ? "Account nahi hai? " : "Pehle se account hai? "}
            <button onClick={() => setIsLogin(!isLogin)} className="text-crimson-500 font-medium hover:underline">
              {isLogin ? 'Register karo' : 'Login karo'}
            </button>
          </p>
        </motion.div>
      </div>
    </>
  )
}
