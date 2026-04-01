import { useState, useEffect } from 'react'
import api from '../utils/api'
import toast from 'react-hot-toast'

const COLORS = ['#E03535', '#6366F1', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#14B8A6']
const INITIAL = { name: '', description: '', color: '#E03535', icon: '📰' }

export default function CategoriesPage() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(INITIAL)
  const [editId, setEditId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)

  const fetch = async () => {
    setLoading(true)
    try {
      const data = await api.get('/categories')
      setCategories(data.categories || [])
    } catch (err) { toast.error(err.message) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetch() }, [])

  const set = (field, value) => setForm(f => ({ ...f, [field]: value }))

  const handleEdit = (cat) => {
    setForm({ name: cat.name, description: cat.description || '', color: cat.color || '#E03535', icon: cat.icon || '📰' })
    setEditId(cat._id)
    setShowForm(true)
  }

  const handleCancel = () => {
    setForm(INITIAL)
    setEditId(null)
    setShowForm(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) return toast.error('Name required')
    setSaving(true)
    try {
      if (editId) {
        await api.put(`/categories/${editId}`, form)
        toast.success('Category updated')
      } else {
        await api.post('/categories', form)
        toast.success('Category created')
      }
      handleCancel()
      fetch()
    } catch (err) { toast.error(err.message) }
    finally { setSaving(false) }
  }

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete category "${name}"? Articles in this category will be unaffected.`)) return
    try {
      await api.delete(`/categories/${id}`)
      toast.success('Category deleted')
      fetch()
    } catch (err) { toast.error(err.message) }
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-900">Categories</h1>
          <p className="font-body text-sm text-ink-500 mt-0.5">{categories.length} categories</p>
        </div>
        <button onClick={() => { handleCancel(); setShowForm(true) }} className="btn-primary">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          New Category
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="card mb-6">
          <h2 className="font-display text-lg font-bold text-ink-900 mb-5">{editId ? 'Edit Category' : 'New Category'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="form-label">Name *</label>
                <input value={form.name} onChange={e => set('name', e.target.value)}
                  className="form-input" placeholder="Technology" required />
              </div>
              <div>
                <label className="form-label">Icon (emoji)</label>
                <input value={form.icon} onChange={e => set('icon', e.target.value)}
                  className="form-input text-2xl text-center" placeholder="💻" maxLength={4} />
              </div>
            </div>
            <div>
              <label className="form-label">Description</label>
              <input value={form.description} onChange={e => set('description', e.target.value)}
                className="form-input" placeholder="Latest tech news and innovation" />
            </div>
            <div>
              <label className="form-label">Color</label>
              <div className="flex items-center gap-3 flex-wrap mt-1">
                {COLORS.map(c => (
                  <button key={c} type="button" onClick={() => set('color', c)}
                    className={`w-8 h-8 rounded-full transition-transform hover:scale-110 ${form.color === c ? 'ring-2 ring-offset-2 ring-ink-900 scale-110' : ''}`}
                    style={{ backgroundColor: c }} />
                ))}
                <input type="color" value={form.color} onChange={e => set('color', e.target.value)}
                  className="w-8 h-8 rounded-full cursor-pointer border-0 p-0 bg-transparent" title="Custom color" />
              </div>
              <div className="flex items-center gap-2 mt-3">
                <div className="w-6 h-6 rounded-full" style={{ backgroundColor: form.color }} />
                <span className="font-body text-sm text-ink-600">{form.name || 'Preview'}</span>
              </div>
            </div>
            <div className="flex gap-3 pt-1">
              <button type="submit" disabled={saving} className="btn-primary">
                {saving ? 'Saving...' : editId ? 'Save Changes' : 'Create Category'}
              </button>
              <button type="button" onClick={handleCancel} className="btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Category list */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => <div key={i} className="h-16 bg-white rounded-xl border border-ink-100 animate-pulse" />)}
        </div>
      ) : (
        <div className="space-y-3">
          {categories.map(cat => (
            <div key={cat._id} className="bg-white rounded-xl border border-ink-100 p-4 flex items-center gap-4 hover:shadow-sm transition-shadow">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0" style={{ backgroundColor: cat.color + '20' }}>
                {cat.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-body text-sm font-semibold text-ink-900">{cat.name}</p>
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                </div>
                <p className="font-body text-xs text-ink-400 truncate">{cat.description || 'No description'}</p>
                <p className="font-body text-xs text-ink-300 mt-0.5">{cat.articleCount || 0} articles · /{cat.slug}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => handleEdit(cat)} className="p-2 rounded-lg hover:bg-ink-100 text-ink-400 hover:text-ink-700 transition-colors" title="Edit">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                </button>
                <button onClick={() => handleDelete(cat._id, cat.name)} className="p-2 rounded-lg hover:bg-red-50 text-ink-400 hover:text-red-500 transition-colors" title="Delete">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
