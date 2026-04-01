import { useState, useEffect } from 'react'
import api from '../utils/api'
import toast from 'react-hot-toast'

const POSITIONS = [
  { value: 'top-banner', label: '📌 Top Banner', desc: 'Page ke ekdum upar' },
  { value: 'mid-article', label: '📄 Mid Article', desc: 'Article ke beech mein' },
  { value: 'bottom-banner', label: '📍 Bottom Banner', desc: 'Page ke neeche' },
  { value: 'between-articles', label: '📰 Between Articles', desc: 'Articles ke beech' },
  { value: 'sidebar', label: '📊 Sidebar', desc: 'Side mein' },
  { value: 'popup', label: '🔔 Popup', desc: 'Popup ad' },
]

const PAGES = [
  { value: 'all', label: 'Sabhi Pages' },
  { value: 'home', label: 'Home Page' },
  { value: 'article', label: 'Article Pages' },
  { value: 'category', label: 'Category Pages' },
]

const EMPTY = {
  name: '', position: 'top-banner', type: 'image',
  imageUrl: '', linkUrl: '', altText: '',
  htmlCode: '', adsenseSlot: '',
  isActive: true, showOnPages: ['all'],
  startDate: '', endDate: ''
}

export default function AdsPage() {
  const [ads, setAds] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(EMPTY)
  const [editId, setEditId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)

  const fetch = async () => {
    setLoading(true)
    try {
      const d = await api.get('/ads/admin/all')
      setAds(d.ads || [])
    } catch (err) { toast.error(err.message) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetch() }, [])
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleEdit = (ad) => {
    setForm({
      name: ad.name, position: ad.position, type: ad.type,
      imageUrl: ad.imageUrl || '', linkUrl: ad.linkUrl || '', altText: ad.altText || '',
      htmlCode: ad.htmlCode || '', adsenseSlot: ad.adsenseSlot || '',
      isActive: ad.isActive, showOnPages: ad.showOnPages?.length ? ad.showOnPages : ['all'],
      startDate: ad.startDate ? ad.startDate.split('T')[0] : '',
      endDate: ad.endDate ? ad.endDate.split('T')[0] : ''
    })
    setEditId(ad._id)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCancel = () => { setForm(EMPTY); setEditId(null); setShowForm(false) }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name) return toast.error('Ad ka naam likho')
    setSaving(true)
    try {
      const payload = { ...form, startDate: form.startDate || null, endDate: form.endDate || null }
      if (editId) {
        await api.put(`/ads/${editId}`, payload)
        toast.success('Ad update ho gaya!')
      } else {
        await api.post('/ads', payload)
        toast.success('Naya ad ban gaya!')
      }
      handleCancel()
      fetch()
    } catch (err) { toast.error(err.message) }
    finally { setSaving(false) }
  }

  const handleDelete = async (id, name) => {
    if (!confirm(`"${name}" delete karo?`)) return
    try { await api.delete(`/ads/${id}`); toast.success('Ad deleted'); fetch() }
    catch (err) { toast.error(err.message) }
  }

  const toggleActive = async (ad) => {
    try {
      await api.put(`/ads/${ad._id}`, { isActive: !ad.isActive })
      fetch()
    } catch (err) { toast.error(err.message) }
  }

  const totalClicks = ads.reduce((s, a) => s + (a.clicks || 0), 0)
  const totalImpressions = ads.reduce((s, a) => s + (a.impressions || 0), 0)
  const ctr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : '0'

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-900">Ad Manager</h1>
          <p className="font-body text-sm text-ink-500 mt-0.5">Apni website ke liye ads khud manage karo</p>
        </div>
        <button onClick={() => { setShowForm(true); setEditId(null); setForm(EMPTY) }} className="btn-primary">
          + Naya Ad
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Ads', value: ads.length, icon: '📢' },
          { label: 'Total Clicks', value: totalClicks.toLocaleString(), icon: '👆' },
          { label: 'CTR', value: `${ctr}%`, icon: '📈' },
        ].map((s, i) => (
          <div key={i} className="card p-4 text-center">
            <span className="text-2xl block mb-1">{s.icon}</span>
            <p className="font-display text-xl font-bold text-ink-900">{s.value}</p>
            <p className="font-body text-xs text-ink-400">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Form */}
      {showForm && (
        <div className="card mb-8 border-2 border-crimson-100">
          <h2 className="font-display text-lg font-bold text-ink-900 mb-5">
            {editId ? '✏️ Ad Edit Karo' : '➕ Naya Ad Banao'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="form-label">Ad Ka Naam *</label>
                <input value={form.name} onChange={e => set('name', e.target.value)} className="form-input" placeholder="Homepage Top Banner" required />
              </div>
              <div>
                <label className="form-label">Position *</label>
                <select value={form.position} onChange={e => set('position', e.target.value)} className="form-input">
                  {POSITIONS.map(p => <option key={p.value} value={p.value}>{p.label} — {p.desc}</option>)}
                </select>
              </div>
            </div>

            {/* Ad Type */}
            <div>
              <label className="form-label">Ad Type</label>
              <div className="flex gap-3">
                {[['image', '🖼 Image Ad'], ['html', '💻 HTML/Custom Code'], ['adsense', '📊 Google AdSense']].map(([val, label]) => (
                  <button key={val} type="button" onClick={() => set('type', val)}
                    className={`px-4 py-2 rounded-xl border font-body text-sm transition-all ${form.type === val ? 'border-crimson-500 bg-crimson-50 text-crimson-700 font-medium' : 'border-ink-200 text-ink-600 hover:border-ink-300'}`}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Image Ad fields */}
            {form.type === 'image' && (
              <div className="space-y-4 p-4 bg-ink-50 rounded-xl">
                <div>
                  <label className="form-label">Image URL *</label>
                  <input value={form.imageUrl} onChange={e => set('imageUrl', e.target.value)} className="form-input" placeholder="https://example.com/banner.jpg" />
                  {form.imageUrl && <img src={form.imageUrl} alt="Preview" className="mt-2 h-24 rounded-lg object-cover" onError={e => e.target.style.display='none'} />}
                </div>
                <div>
                  <label className="form-label">Click karne pe kahan jaaye (URL)</label>
                  <input value={form.linkUrl} onChange={e => set('linkUrl', e.target.value)} className="form-input" placeholder="https://advertiser.com/landing-page" />
                </div>
                <div>
                  <label className="form-label">Alt Text (SEO ke liye)</label>
                  <input value={form.altText} onChange={e => set('altText', e.target.value)} className="form-input" placeholder="Advertisement banner" />
                </div>
              </div>
            )}

            {/* HTML Ad */}
            {form.type === 'html' && (
              <div className="p-4 bg-ink-50 rounded-xl">
                <label className="form-label">HTML/JavaScript Code</label>
                <textarea value={form.htmlCode} onChange={e => set('htmlCode', e.target.value)}
                  className="form-input font-mono text-xs resize-none" rows={8}
                  placeholder={'<!-- Koi bhi ad code yahan paste karo -->\n<a href="https://advertiser.com">\n  <img src="banner.jpg" width="728" height="90" />\n</a>\n\n<!-- Ya koi bhi custom HTML -->'} />
                <p className="font-body text-xs text-ink-400 mt-1">⚠️ Sirf trusted advertisers ka code daalo</p>
              </div>
            )}

            {/* AdSense */}
            {form.type === 'adsense' && (
              <div className="p-4 bg-blue-50 rounded-xl space-y-3">
                <p className="font-body text-sm font-medium text-blue-800">Google AdSense Setup</p>
                <div>
                  <label className="form-label">AdSense Ad Slot ID</label>
                  <input value={form.adsenseSlot} onChange={e => set('adsenseSlot', e.target.value)} className="form-input" placeholder="1234567890" />
                </div>
                <div className="font-body text-xs text-blue-700 space-y-1">
                  <p>1. adsense.google.com → Ads → By ad unit → Display ads</p>
                  <p>2. Slot ID copy karo (10 digit number)</p>
                  <p>3. client/.env mein VITE_ADSENSE_CLIENT=ca-pub-xxx daalo</p>
                </div>
              </div>
            )}

            {/* Pages & Schedule */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="form-label">Kis page pe dikhao</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {PAGES.map(p => (
                    <button key={p.value} type="button"
                      onClick={() => {
                        const cur = form.showOnPages || []
                        if (p.value === 'all') { set('showOnPages', ['all']); return }
                        const without = cur.filter(x => x !== 'all')
                        if (without.includes(p.value)) set('showOnPages', without.filter(x => x !== p.value))
                        else set('showOnPages', [...without, p.value])
                      }}
                      className={`px-3 py-1.5 rounded-lg border font-body text-xs transition-all ${(form.showOnPages || []).includes(p.value) ? 'border-crimson-500 bg-crimson-50 text-crimson-700' : 'border-ink-200 text-ink-600'}`}>
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="form-label">Start Date (optional)</label>
                  <input type="date" value={form.startDate} onChange={e => set('startDate', e.target.value)} className="form-input" />
                </div>
                <div>
                  <label className="form-label">End Date (optional)</label>
                  <input type="date" value={form.endDate} onChange={e => set('endDate', e.target.value)} className="form-input" />
                </div>
              </div>
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={form.isActive} onChange={e => set('isActive', e.target.checked)} className="w-4 h-4 accent-crimson-500" />
              <span className="font-body text-sm font-medium text-ink-700">Active (immediately show karo)</span>
            </label>

            <div className="flex gap-3 pt-2 border-t border-ink-100">
              <button type="submit" disabled={saving} className="btn-primary py-2.5 px-8">
                {saving ? 'Saving...' : editId ? '💾 Update' : '🚀 Create Ad'}
              </button>
              <button type="button" onClick={handleCancel} className="btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Ads list */}
      {loading ? (
        <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="h-20 bg-white rounded-xl border border-ink-100 animate-pulse" />)}</div>
      ) : ads.length === 0 ? (
        <div className="card text-center py-16">
          <p className="text-4xl mb-3">📢</p>
          <p className="font-display text-xl text-ink-400 mb-2">Koi ad nahi hai abhi</p>
          <p className="font-body text-sm text-ink-400 mb-5">Pehla ad banao aur website pe dikhao</p>
          <button onClick={() => setShowForm(true)} className="btn-primary">+ Pehla Ad Banao</button>
        </div>
      ) : (
        <div className="space-y-3">
          {ads.map(ad => (
            <div key={ad._id} className={`bg-white rounded-2xl border p-4 flex items-center gap-4 flex-wrap ${ad.isActive ? 'border-ink-100' : 'border-ink-100 opacity-60'}`}>
              {/* Preview */}
              <div className="w-16 h-12 rounded-xl bg-ink-100 flex items-center justify-center text-2xl shrink-0 overflow-hidden">
                {ad.type === 'image' && ad.imageUrl
                  ? <img src={ad.imageUrl} alt={ad.name} className="w-full h-full object-cover" onError={e => e.target.style.display='none'} />
                  : ad.type === 'html' ? '💻' : '📊'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-body text-sm font-semibold text-ink-900">{ad.name}</p>
                  <span className="text-xs bg-ink-100 text-ink-600 px-2 py-0.5 rounded-full font-body capitalize">{ad.position.replace('-', ' ')}</span>
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-body capitalize">{ad.type}</span>
                </div>
                <div className="flex items-center gap-4 mt-1">
                  <span className="font-body text-xs text-ink-400">👆 {ad.clicks} clicks</span>
                  <span className="font-body text-xs text-ink-400">👁 {ad.impressions} views</span>
                  <span className="font-body text-xs text-ink-400">
                    {ad.impressions > 0 ? `📈 ${((ad.clicks/ad.impressions)*100).toFixed(1)}% CTR` : ''}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => toggleActive(ad)}
                  className={`px-3 py-1.5 rounded-lg font-body text-xs font-medium transition-colors ${ad.isActive ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-ink-100 text-ink-500 hover:bg-ink-200'}`}>
                  {ad.isActive ? '✅ Live' : '⏸ Off'}
                </button>
                <button onClick={() => handleEdit(ad)} className="p-2 rounded-lg hover:bg-ink-100 text-ink-400 hover:text-ink-700">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                </button>
                <button onClick={() => handleDelete(ad._id, ad.name)} className="p-2 rounded-lg hover:bg-red-50 text-ink-400 hover:text-red-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
