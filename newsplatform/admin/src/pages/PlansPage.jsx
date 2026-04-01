import { useState, useEffect } from 'react'
import api from '../utils/api'
import toast from 'react-hot-toast'

const EMPTY = { name: '', slug: '', description: '', price: '', duration: 30, features: '', isActive: true, isPopular: false, color: '#E03535' }

export default function PlansPage() {
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(EMPTY)
  const [editId, setEditId] = useState(null)
  const [saving, setSaving] = useState(false)

  const fetch = async () => {
    setLoading(true)
    try {
      const d = await api.get('/payment/admin/plans')
      setPlans(d.plans || [])
    } catch (err) { toast.error(err.message) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetch() }, [])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleEdit = (plan) => {
    setForm({
      name: plan.name, slug: plan.slug, description: plan.description,
      price: plan.price, duration: plan.duration,
      features: (plan.features || []).join('\n'),
      isActive: plan.isActive, isPopular: plan.isPopular, color: plan.color
    })
    setEditId(plan._id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCancel = () => { setForm(EMPTY); setEditId(null) }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || form.price === '') return toast.error('Name aur price required hai')
    setSaving(true)
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        duration: Number(form.duration),
        features: form.features.split('\n').map(f => f.trim()).filter(Boolean)
      }
      if (editId) {
        await api.put(`/payment/plans/${editId}`, payload)
        toast.success('Plan update ho gaya!')
      } else {
        await api.post('/payment/plans', payload)
        toast.success('Naya plan ban gaya!')
      }
      handleCancel()
      fetch()
    } catch (err) { toast.error(err.message) }
    finally { setSaving(false) }
  }

  const handleDelete = async (id, name) => {
    if (!confirm(`"${name}" plan delete karo? Existing subscribers affected honge.`)) return
    try {
      await api.delete(`/payment/plans/${id}`)
      toast.success('Plan deleted')
      fetch()
    } catch (err) { toast.error(err.message) }
  }

  const toggleActive = async (plan) => {
    try {
      await api.put(`/payment/plans/${plan._id}`, { isActive: !plan.isActive })
      toast.success(plan.isActive ? 'Plan hide kiya' : 'Plan show kiya')
      fetch()
    } catch (err) { toast.error(err.message) }
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-900">Subscription Plans</h1>
          <p className="font-body text-sm text-ink-500 mt-0.5">Prices aur features manage karo</p>
        </div>
      </div>

      {/* Form */}
      <div className="card mb-8">
        <h2 className="font-display text-lg font-bold text-ink-900 mb-5">
          {editId ? '✏️ Plan Edit Karo' : '➕ Naya Plan Banao'}
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="form-label">Plan Name *</label>
            <input value={form.name} onChange={e => set('name', e.target.value)} className="form-input" placeholder="Premium" required />
          </div>
          <div>
            <label className="form-label">Slug *</label>
            <input value={form.slug} onChange={e => set('slug', e.target.value.toLowerCase().replace(/\s+/g,'-'))} className="form-input" placeholder="premium" required />
          </div>
          <div>
            <label className="form-label">Price (₹) *</label>
            <input type="number" value={form.price} onChange={e => set('price', e.target.value)} className="form-input" placeholder="249" min="0" required />
          </div>
          <div>
            <label className="form-label">Duration (days) *</label>
            <input type="number" value={form.duration} onChange={e => set('duration', e.target.value)} className="form-input" placeholder="30" min="1" required />
          </div>
          <div className="md:col-span-2">
            <label className="form-label">Description</label>
            <input value={form.description} onChange={e => set('description', e.target.value)} className="form-input" placeholder="Full access to all premium articles" />
          </div>
          <div className="md:col-span-2">
            <label className="form-label">Features (ek line mein ek feature)</label>
            <textarea value={form.features} onChange={e => set('features', e.target.value)}
              className="form-input resize-none" rows={5}
              placeholder={"Everything in Free\nAll premium articles\nAd-free experience\nPriority support"} />
          </div>
          <div className="flex items-center gap-3">
            <label className="form-label mb-0">Color:</label>
            <input type="color" value={form.color} onChange={e => set('color', e.target.value)} className="w-10 h-10 rounded-lg cursor-pointer border border-ink-200 p-1" />
            <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: form.color }} />
          </div>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isPopular} onChange={e => set('isPopular', e.target.checked)} className="w-4 h-4 accent-crimson-500" />
              <span className="font-body text-sm text-ink-700">⭐ Popular badge</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isActive} onChange={e => set('isActive', e.target.checked)} className="w-4 h-4 accent-crimson-500" />
              <span className="font-body text-sm text-ink-700">Active</span>
            </label>
          </div>
          <div className="md:col-span-2 flex gap-3 pt-1 border-t border-ink-100">
            <button type="submit" disabled={saving} className="btn-primary py-2.5 px-8">
              {saving ? 'Saving...' : editId ? '💾 Update Plan' : '➕ Create Plan'}
            </button>
            {editId && <button type="button" onClick={handleCancel} className="btn-secondary">Cancel</button>}
          </div>
        </form>
      </div>

      {/* Plans list */}
      <div className="space-y-4">
        {loading ? (
          [...Array(4)].map((_, i) => <div key={i} className="h-24 bg-white rounded-2xl border border-ink-100 animate-pulse" />)
        ) : plans.map(plan => (
          <div key={plan._id} className={`bg-white rounded-2xl border-2 p-5 ${plan.isPopular ? 'border-crimson-200' : 'border-ink-100'} ${!plan.isActive ? 'opacity-60' : ''}`}>
            <div className="flex items-center gap-4 flex-wrap">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center font-display font-bold text-white text-lg shrink-0" style={{ backgroundColor: plan.color }}>
                ₹
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-display text-lg font-bold text-ink-900">{plan.name}</p>
                  {plan.isPopular && <span className="text-xs bg-crimson-100 text-crimson-700 px-2 py-0.5 rounded-full font-body">⭐ Popular</span>}
                  {!plan.isActive && <span className="text-xs bg-ink-100 text-ink-500 px-2 py-0.5 rounded-full font-body">Hidden</span>}
                </div>
                <p className="font-body text-sm text-ink-500">{plan.description}</p>
                <p className="font-body text-xs text-ink-400 mt-0.5">
                  {plan.features?.slice(0,3).join(' · ')}
                  {plan.features?.length > 3 && ` +${plan.features.length - 3} more`}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-display text-2xl font-bold text-ink-900">
                  {plan.price === 0 ? 'Free' : `₹${plan.price}`}
                </p>
                <p className="font-body text-xs text-ink-400">{plan.duration} days</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => toggleActive(plan)}
                  className={`px-3 py-1.5 rounded-lg font-body text-xs font-medium transition-colors ${plan.isActive ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-ink-100 text-ink-600 hover:bg-ink-200'}`}>
                  {plan.isActive ? '✅ Live' : '⏸ Hidden'}
                </button>
                <button onClick={() => handleEdit(plan)} className="p-2 rounded-lg hover:bg-ink-100 text-ink-400 hover:text-ink-700 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                </button>
                <button onClick={() => handleDelete(plan._id, plan.name)} className="p-2 rounded-lg hover:bg-red-50 text-ink-400 hover:text-red-500 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
