import { useState, useEffect } from 'react'
import api from '../utils/api'
import toast from 'react-hot-toast'

export default function BroadcastPage() {
  const [tab, setTab] = useState('email')
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ subject: '', message: '', targetPlan: 'all' })

  useEffect(() => {
    api.get('/broadcast/stats').then(d => setStats(d.stats)).catch(console.error)
  }, [])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const getTargetCount = () => {
    if (!stats) return 0
    if (form.targetPlan === 'premium') return stats.premium
    if (form.targetPlan === 'free') return stats.free
    return tab === 'sms' ? stats.withPhone : stats.withEmail
  }

  const handleSend = async () => {
    if (!form.message) return toast.error('Message likhna zaroori hai')
    if (tab === 'email' && !form.subject) return toast.error('Subject likhna zaroori hai')
    if (!confirm(`${getTargetCount()} ${tab === 'email' ? 'emails' : 'SMS'} bhejna hai? Confirm karo.`)) return

    setLoading(true)
    try {
      const endpoint = tab === 'email' ? '/broadcast/email' : '/broadcast/sms'
      const data = await api.post(endpoint, { ...form })
      toast.success(data.message)
      setForm({ subject: '', message: '', targetPlan: 'all' })
    } catch (err) {
      toast.error(err.message || 'Send failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-ink-900">Broadcast Messages</h1>
        <p className="font-body text-sm text-ink-500 mt-0.5">Bulk Email ya SMS bhejo apne users ko</p>
      </div>

      {/* Audience stats */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Total Users', value: stats.total, icon: '👥' },
            { label: 'Premium', value: stats.premium, icon: '👑' },
            { label: 'Free Users', value: stats.free, icon: '🆓' },
            { label: 'With Phone', value: stats.withPhone, icon: '📱' },
          ].map((s, i) => (
            <div key={i} className="card p-4 text-center">
              <span className="text-2xl block mb-1">{s.icon}</span>
              <p className="font-display text-xl font-bold text-ink-900">{s.value}</p>
              <p className="font-body text-xs text-ink-400">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Channel tabs */}
      <div className="flex gap-2 mb-5">
        {[['email', '📧 Email'], ['sms', '📱 SMS']].map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)}
            className={`px-5 py-2 rounded-full font-body text-sm font-medium transition-colors ${tab === key ? 'bg-ink-900 text-white' : 'bg-white border border-ink-200 text-ink-600 hover:border-ink-400'}`}>
            {label}
          </button>
        ))}
      </div>

      <div className="card space-y-5">
        {/* Target audience */}
        <div>
          <label className="form-label">Target Audience</label>
          <div className="grid grid-cols-3 gap-2 mt-1">
            {[
              ['all', '👥 Sab', stats?.total || 0],
              ['premium', '👑 Premium', stats?.premium || 0],
              ['free', '🆓 Free', stats?.free || 0],
            ].map(([val, label, count]) => (
              <button key={val} type="button" onClick={() => set('targetPlan', val)}
                className={`p-3 rounded-xl border text-center transition-all ${form.targetPlan === val ? 'border-crimson-500 bg-crimson-50 text-crimson-700' : 'border-ink-200 hover:border-ink-300'}`}>
                <span className="font-body text-sm font-medium block">{label}</span>
                <span className="font-display text-lg font-bold text-ink-900">{count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Email subject */}
        {tab === 'email' && (
          <div>
            <label className="form-label">Subject Line *</label>
            <input value={form.subject} onChange={e => set('subject', e.target.value)}
              className="form-input" placeholder="Breaking: India's biggest news today..." />
          </div>
        )}

        {/* Message */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="form-label mb-0">
              {tab === 'email' ? 'Email Body *' : 'SMS Message *'}
            </label>
            {tab === 'sms' && (
              <span className={`font-body text-xs ${form.message.length > 160 ? 'text-red-500' : 'text-ink-400'}`}>
                {form.message.length}/160
              </span>
            )}
          </div>
          <textarea value={form.message} onChange={e => set('message', e.target.value)}
            className="form-input resize-none"
            rows={tab === 'email' ? 8 : 4}
            placeholder={tab === 'email'
              ? 'Namaste! Aaj ki khabar...\n\nAaj hum aapke liye lekar aaye hain...'
              : 'IndiaInk: Aaj ki breaking news - [link]'} />
          {tab === 'sms' && (
            <p className="font-body text-xs text-ink-400 mt-1">
              💡 SMS mein website link zaroor dalo: {window.location.origin.replace('5174','5173')}
            </p>
          )}
        </div>

        {/* Preview box */}
        {form.message && (
          <div className="bg-ink-50 rounded-xl p-4 border border-ink-100">
            <p className="font-body text-xs text-ink-400 uppercase tracking-wider mb-2">Preview</p>
            {tab === 'email' && form.subject && (
              <p className="font-body text-sm font-semibold text-ink-800 mb-1">📧 {form.subject}</p>
            )}
            <p className="font-body text-sm text-ink-700 whitespace-pre-wrap">{form.message}</p>
          </div>
        )}

        {/* Send button */}
        <div className="flex items-center gap-3 pt-1">
          <button onClick={handleSend} disabled={loading || !form.message}
            className="btn-primary py-3 px-8 text-base disabled:opacity-40">
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Sending...
              </span>
            ) : (
              <>
                {tab === 'email' ? '📧' : '📱'} {getTargetCount()} ko {tab === 'email' ? 'Email' : 'SMS'} Bhejo
              </>
            )}
          </button>
          <p className="font-body text-xs text-ink-400">
            {tab === 'email' ? 'Gmail se bheja jayega' : 'Fast2SMS se bheja jayega'}
          </p>
        </div>
      </div>

      {/* Setup instructions */}
      <div className="mt-6 p-5 bg-amber-50 border border-amber-200 rounded-xl">
        <p className="font-body text-sm font-semibold text-amber-800 mb-2">⚙️ Setup Required</p>
        {tab === 'email' ? (
          <ul className="font-body text-xs text-amber-700 space-y-1">
            <li>1. Gmail account → Google Account → Security → 2-Step Verification ON karo</li>
            <li>2. App Passwords → "Mail" select karo → Generate karo</li>
            <li>3. <code className="bg-amber-100 px-1 rounded">server/.env</code> mein <code className="bg-amber-100 px-1 rounded">EMAIL_USER</code> aur <code className="bg-amber-100 px-1 rounded">EMAIL_PASS</code> daalo</li>
          </ul>
        ) : (
          <ul className="font-body text-xs text-amber-700 space-y-1">
            <li>1. fast2sms.com pe free account banao</li>
            <li>2. Dashboard → Dev API → API Key copy karo</li>
            <li>3. <code className="bg-amber-100 px-1 rounded">server/.env</code> mein <code className="bg-amber-100 px-1 rounded">FAST2SMS_API_KEY</code> daalo</li>
            <li>4. Free plan mein 200 SMS/day milte hain</li>
          </ul>
        )}
      </div>
    </div>
  )
}
