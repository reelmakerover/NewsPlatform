import { useState, useEffect } from 'react'
import api from '../utils/api'
import toast from 'react-hot-toast'

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState([])
  const [payments, setPayments] = useState([])
  const [plans, setPlans] = useState([])
  const [revenue, setRevenue] = useState(0)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('subscribers')
  const [grantModal, setGrantModal] = useState(null)
  const [grantForm, setGrantForm] = useState({ planId: '', days: '' })

  const fetchAll = async () => {
    setLoading(true)
    try {
      const [subData, payData, planData] = await Promise.all([
        api.get('/payment/subscribers'),
        api.get('/payment/payments'),
        api.get('/payment/plans')
      ])
      setSubscribers(subData.users || [])
      setPayments(payData.payments || [])
      setRevenue(payData.totalRevenue || 0)
      setPlans(planData.plans || [])
    } catch (err) { toast.error(err.message) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchAll() }, [])

  const handleGrant = async () => {
    try {
      await api.post('/payment/grant', { userId: grantModal._id, planId: grantForm.planId, days: Number(grantForm.days) || undefined })
      toast.success('Subscription grant ho gaya!')
      setGrantModal(null)
      fetchAll()
    } catch (err) { toast.error(err.message) }
  }

  const activeSubscribers = subscribers.filter(u => u.subscription?.status === 'active' && u.role === 'subscriber')

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-900">Subscribers & Revenue</h1>
          <p className="font-body text-sm text-ink-500 mt-0.5">Users manage karo, plans dekho</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { icon: '👥', label: 'Total Users', value: subscribers.length, color: '#6366F1' },
          { icon: '👑', label: 'Active Subscribers', value: activeSubscribers.length, color: '#E03535' },
          { icon: '💰', label: 'Total Revenue', value: `₹${revenue.toLocaleString()}`, color: '#10B981' },
          { icon: '💳', label: 'Payments', value: payments.length, color: '#F59E0B' },
        ].map((s, i) => (
          <div key={i} className="card flex items-center gap-3 p-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ backgroundColor: s.color + '20' }}>{s.icon}</div>
            <div>
              <p className="font-body text-xs text-ink-400">{s.label}</p>
              <p className="font-display text-xl font-bold text-ink-900">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5">
        {[['subscribers', '👥 Users'], ['payments', '💰 Payments'], ['plans', '📋 Plans']].map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)}
            className={`px-4 py-1.5 rounded-full font-body text-sm font-medium transition-colors ${tab === key ? 'bg-ink-900 text-white' : 'bg-white border border-ink-200 text-ink-600 hover:border-ink-400'}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Subscribers Tab */}
      {tab === 'subscribers' && (
        <div className="card p-0 overflow-hidden">
          {loading ? <div className="p-8 text-center font-body text-sm text-ink-400">Loading...</div> : (
            <table className="w-full">
              <thead><tr className="border-b border-ink-100">
                <th className="text-left px-5 py-3 font-body text-xs text-ink-400 uppercase tracking-wider">User</th>
                <th className="text-left px-4 py-3 font-body text-xs text-ink-400 uppercase tracking-wider hidden md:table-cell">Phone</th>
                <th className="text-left px-4 py-3 font-body text-xs text-ink-400 uppercase tracking-wider">Plan</th>
                <th className="text-left px-4 py-3 font-body text-xs text-ink-400 uppercase tracking-wider hidden lg:table-cell">Expires</th>
                <th className="px-4 py-3"></th>
              </tr></thead>
              <tbody className="divide-y divide-ink-50">
                {subscribers.map(u => (
                  <tr key={u._id} className="hover:bg-ink-50/50">
                    <td className="px-5 py-3.5">
                      <p className="font-body text-sm font-medium text-ink-900">{u.name}</p>
                      <p className="font-body text-xs text-ink-400">{u.email}</p>
                    </td>
                    <td className="px-4 py-3.5 hidden md:table-cell">
                      <span className="font-body text-xs text-ink-600">{u.phone || '—'}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-body font-medium capitalize ${
                        u.subscription?.plan === 'premium' ? 'bg-crimson-100 text-crimson-700' :
                        u.subscription?.plan === 'basic' ? 'bg-purple-100 text-purple-700' :
                        u.subscription?.plan === 'annual' ? 'bg-amber-100 text-amber-700' :
                        'bg-ink-100 text-ink-600'}`}>
                        {u.subscription?.plan || 'free'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 hidden lg:table-cell">
                      <span className="font-body text-xs text-ink-500">
                        {u.subscription?.endDate ? new Date(u.subscription.endDate).toLocaleDateString('en-IN') : '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <button onClick={() => setGrantModal(u)}
                        className="px-3 py-1 bg-crimson-50 text-crimson-600 rounded-lg font-body text-xs hover:bg-crimson-100 transition-colors">
                        + Grant
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Payments Tab */}
      {tab === 'payments' && (
        <div className="card p-0 overflow-hidden">
          <table className="w-full">
            <thead><tr className="border-b border-ink-100">
              <th className="text-left px-5 py-3 font-body text-xs text-ink-400 uppercase tracking-wider">User</th>
              <th className="text-left px-4 py-3 font-body text-xs text-ink-400 uppercase tracking-wider">Plan</th>
              <th className="text-left px-4 py-3 font-body text-xs text-ink-400 uppercase tracking-wider">Amount</th>
              <th className="text-left px-4 py-3 font-body text-xs text-ink-400 uppercase tracking-wider hidden md:table-cell">Date</th>
            </tr></thead>
            <tbody className="divide-y divide-ink-50">
              {payments.map(p => (
                <tr key={p._id} className="hover:bg-ink-50/50">
                  <td className="px-5 py-3.5">
                    <p className="font-body text-sm font-medium text-ink-900">{p.user?.name}</p>
                    <p className="font-body text-xs text-ink-400">{p.user?.email}</p>
                  </td>
                  <td className="px-4 py-3.5"><span className="font-body text-sm text-ink-700 capitalize">{p.plan?.name}</span></td>
                  <td className="px-4 py-3.5"><span className="font-body text-sm font-semibold text-green-600">₹{p.amount}</span></td>
                  <td className="px-4 py-3.5 hidden md:table-cell"><span className="font-body text-xs text-ink-500">{new Date(p.createdAt).toLocaleDateString('en-IN')}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Plans Tab */}
      {tab === 'plans' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {plans.map(plan => (
            <div key={plan._id} className="card">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg mb-3" style={{ backgroundColor: plan.color + '20' }}>
                {plan.slug === 'free' ? '🆓' : plan.slug === 'basic' ? '⚡' : plan.slug === 'premium' ? '👑' : '🏆'}
              </div>
              <h3 className="font-display text-lg font-bold text-ink-900">{plan.name}</h3>
              <p className="font-display text-2xl font-bold mt-1" style={{ color: plan.color }}>
                {plan.price === 0 ? 'Free' : `₹${plan.price}`}
              </p>
              <p className="font-body text-xs text-ink-400">{plan.duration} days</p>
              <ul className="mt-3 space-y-1">
                {plan.features.slice(0, 3).map((f, i) => <li key={i} className="font-body text-xs text-ink-600">✓ {f}</li>)}
              </ul>
              <div className="mt-3 pt-3 border-t border-ink-100 flex items-center justify-between">
                <span className={`px-2 py-0.5 rounded-full text-xs font-body ${plan.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {plan.isActive ? 'Active' : 'Inactive'}
                </span>
                {plan.isPopular && <span className="text-xs font-body text-amber-600">⭐ Popular</span>}
              </div>
            </div>
          ))}
          <div className="card border-dashed border-2 border-ink-200 flex flex-col items-center justify-center text-center p-6 cursor-pointer hover:border-crimson-300 transition-colors"
            onClick={() => toast('Plan editing coming soon! Seed karo ya MongoDB se directly edit karo.')}>
            <span className="text-3xl mb-2">➕</span>
            <p className="font-body text-sm text-ink-500">Plan add karo</p>
          </div>
        </div>
      )}

      {/* Grant Modal */}
      {grantModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <h3 className="font-display text-lg font-bold text-ink-900 mb-1">Subscription Grant Karo</h3>
            <p className="font-body text-sm text-ink-500 mb-5">{grantModal.name} — {grantModal.email}</p>
            <div className="space-y-4">
              <div>
                <label className="block font-body text-sm font-medium text-ink-700 mb-1.5">Plan Select Karo</label>
                <select value={grantForm.planId} onChange={e => setGrantForm(f => ({ ...f, planId: e.target.value }))}
                  className="w-full h-11 px-4 bg-ink-50 border border-ink-200 rounded-xl font-body text-sm focus:outline-none focus:ring-2 focus:ring-crimson-500">
                  <option value="">Plan choose karo...</option>
                  {plans.filter(p => p.price > 0).map(p => (
                    <option key={p._id} value={p._id}>{p.name} — ₹{p.price} ({p.duration} days)</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-body text-sm font-medium text-ink-700 mb-1.5">Custom Days (optional)</label>
                <input type="number" value={grantForm.days} onChange={e => setGrantForm(f => ({ ...f, days: e.target.value }))}
                  className="w-full h-11 px-4 bg-ink-50 border border-ink-200 rounded-xl font-body text-sm focus:outline-none focus:ring-2 focus:ring-crimson-500"
                  placeholder="Khali chhodo default ke liye" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleGrant} disabled={!grantForm.planId}
                className="flex-1 py-2.5 bg-crimson-500 hover:bg-crimson-600 text-white font-body font-medium rounded-xl transition-colors disabled:opacity-40">
                ✅ Grant Karo
              </button>
              <button onClick={() => setGrantModal(null)} className="flex-1 py-2.5 bg-ink-100 text-ink-700 font-body font-medium rounded-xl hover:bg-ink-200 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
