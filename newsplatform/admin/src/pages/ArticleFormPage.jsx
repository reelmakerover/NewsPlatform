import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../utils/api'
import RichTextEditor from '../components/RichTextEditor'
import toast from 'react-hot-toast'

const INITIAL_FORM = {
  title: '', excerpt: '', content: '', thumbnail: '', thumbnailPublicId: '',
  category: '', tags: '', status: 'draft', isFeatured: false, isTrending: false,
  embeddedVideo: '', metaTitle: '', metaDescription: '', metaKeywords: ''
}

export default function ArticleFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [form, setForm] = useState(INITIAL_FORM)
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [activeTab, setActiveTab] = useState('content')

  useEffect(() => {
    api.get('/categories').then(d => setCategories(d.categories || [])).catch(console.error)
    if (isEdit) {
      api.get(`/articles/admin?limit=100`).then(d => {
        const article = d.articles?.find(a => a._id === id)
        if (article) {
          setForm({
            title: article.title || '',
            excerpt: article.excerpt || '',
            content: article.content || '',
            thumbnail: article.thumbnail || '',
            thumbnailPublicId: article.thumbnailPublicId || '',
            category: article.category?._id || '',
            tags: (article.tags || []).join(', '),
            status: article.status || 'draft',
            isFeatured: article.isFeatured || false,
            isTrending: article.isTrending || false,
            embeddedVideo: article.embeddedVideo || '',
            metaTitle: article.metaTitle || '',
            metaDescription: article.metaDescription || '',
            metaKeywords: (article.metaKeywords || []).join(', ')
          })
        }
      }).catch(console.error)
    }
  }, [id])

  const set = (field, value) => setForm(f => ({ ...f, [field]: value }))

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('thumbnail', file)
      const data = await api.post('/articles/upload/thumbnail', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      set('thumbnail', data.url)
      set('thumbnailPublicId', data.publicId)
      toast.success('Image uploaded')
    } catch (err) {
      toast.error('Upload failed: ' + (err.message || 'Check Cloudinary config'))
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e, publishNow = false) => {
    e.preventDefault()
    if (!form.title.trim()) return toast.error('Title is required')
    if (!form.excerpt.trim()) return toast.error('Excerpt is required')
    if (!form.content || form.content === '<p></p>') return toast.error('Content is required')
    if (!form.category) return toast.error('Please select a category')

    setLoading(true)
    try {
      const payload = {
        ...form,
        status: publishNow ? 'published' : form.status,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        metaKeywords: form.metaKeywords.split(',').map(t => t.trim()).filter(Boolean)
      }
      if (isEdit) {
        await api.put(`/articles/${id}`, payload)
        toast.success('Article updated!')
      } else {
        await api.post('/articles', payload)
        toast.success('Article created!')
      }
      navigate('/articles')
    } catch (err) {
      toast.error(err.message || 'Failed to save article')
    } finally {
      setLoading(false)
    }
  }

  const tabs = ['content', 'media', 'seo', 'settings']

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-900">{isEdit ? 'Edit Article' : 'New Article'}</h1>
          <p className="font-body text-sm text-ink-500 mt-0.5">{isEdit ? 'Update your story' : 'Write and publish a new story'}</p>
        </div>
        <button onClick={() => navigate('/articles')} className="btn-secondary">← Back</button>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-white rounded-xl border border-ink-100 p-1 w-fit">
          {tabs.map(tab => (
            <button key={tab} type="button" onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-lg font-body text-sm font-medium capitalize transition-colors ${activeTab === tab ? 'bg-ink-900 text-white' : 'text-ink-600 hover:text-ink-900'}`}>
              {tab}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-5">
            {activeTab === 'content' && (
              <>
                <div className="card space-y-5">
                  <div>
                    <label className="form-label">Title *</label>
                    <input value={form.title} onChange={e => set('title', e.target.value)}
                      className="form-input text-lg font-display font-bold" placeholder="Article headline..." required />
                  </div>
                  <div>
                    <label className="form-label">Excerpt / Summary *</label>
                    <textarea value={form.excerpt} onChange={e => set('excerpt', e.target.value)}
                      className="form-input resize-none" rows={3}
                      placeholder="A compelling 1-2 sentence summary..." required maxLength={500} />
                    <p className="font-body text-xs text-ink-400 mt-1">{form.excerpt.length}/500</p>
                  </div>
                </div>
                <div className="card">
                  <label className="form-label mb-3">Content *</label>
                  <RichTextEditor value={form.content} onChange={v => set('content', v)} />
                </div>
              </>
            )}

            {activeTab === 'media' && (
              <div className="card space-y-5">
                <div>
                  <label className="form-label">Thumbnail Image</label>
                  <div className="mt-2 space-y-3">
                    {form.thumbnail ? (
                      <div className="relative">
                        <img src={form.thumbnail} alt="Thumbnail" className="w-full h-48 object-cover rounded-xl" />
                        <button type="button" onClick={() => { set('thumbnail', ''); set('thumbnailPublicId', '') }}
                          className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors">
                          ✕
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-ink-200 rounded-xl cursor-pointer hover:border-crimson-400 transition-colors bg-ink-50">
                        <span className="text-3xl mb-2">🖼</span>
                        <span className="font-body text-sm text-ink-500">{uploading ? 'Uploading...' : 'Click to upload image'}</span>
                        <span className="font-body text-xs text-ink-400 mt-1">JPG, PNG, WebP · max 5MB</span>
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
                      </label>
                    )}
                    <div>
                      <label className="form-label text-xs">Or paste image URL</label>
                      <input value={form.thumbnail} onChange={e => set('thumbnail', e.target.value)}
                        className="form-input text-sm" placeholder="https://example.com/image.jpg" />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="form-label">Embedded Video URL</label>
                  <input value={form.embeddedVideo} onChange={e => set('embeddedVideo', e.target.value)}
                    className="form-input" placeholder="https://www.youtube.com/watch?v=..." />
                  <p className="font-body text-xs text-ink-400 mt-1">Supports YouTube and Instagram Reels</p>
                </div>
              </div>
            )}

            {activeTab === 'seo' && (
              <div className="card space-y-5">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">🔍</span>
                  <h3 className="font-display text-base font-bold text-ink-900">SEO Settings</h3>
                </div>
                <div>
                  <label className="form-label">Meta Title</label>
                  <input value={form.metaTitle} onChange={e => set('metaTitle', e.target.value)}
                    className="form-input" placeholder="Leave blank to use article title" maxLength={70} />
                  <p className="font-body text-xs text-ink-400 mt-1">{form.metaTitle.length}/70 — ideal under 60 chars</p>
                </div>
                <div>
                  <label className="form-label">Meta Description</label>
                  <textarea value={form.metaDescription} onChange={e => set('metaDescription', e.target.value)}
                    className="form-input resize-none" rows={3} placeholder="Leave blank to use excerpt" maxLength={160} />
                  <p className="font-body text-xs text-ink-400 mt-1">{form.metaDescription.length}/160</p>
                </div>
                <div>
                  <label className="form-label">Meta Keywords</label>
                  <input value={form.metaKeywords} onChange={e => set('metaKeywords', e.target.value)}
                    className="form-input" placeholder="keyword1, keyword2, keyword3" />
                </div>
                {/* SEO preview */}
                <div className="p-4 bg-ink-50 rounded-xl">
                  <p className="font-body text-xs text-ink-400 mb-2 uppercase tracking-wider">Google Preview</p>
                  <p className="font-body text-base text-blue-700 font-medium">{form.metaTitle || form.title || 'Article Title'}</p>
                  <p className="font-body text-xs text-green-700">indiaink.com/article/{form.title ? form.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') : 'article-slug'}</p>
                  <p className="font-body text-sm text-ink-500 mt-0.5 line-clamp-2">{form.metaDescription || form.excerpt || 'Article excerpt will appear here...'}</p>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="card space-y-5">
                <div>
                  <label className="form-label">Tags</label>
                  <input value={form.tags} onChange={e => set('tags', e.target.value)}
                    className="form-input" placeholder="technology, startup, india" />
                  <p className="font-body text-xs text-ink-400 mt-1">Comma separated</p>
                </div>
                <div className="flex flex-col gap-3">
                  {[
                    { field: 'isFeatured', label: '⭐ Featured Article', desc: 'Show in featured sections' },
                    { field: 'isTrending', label: '🔥 Trending Article', desc: 'Show in trending sections' },
                  ].map(({ field, label, desc }) => (
                    <label key={field} className="flex items-center justify-between p-4 bg-ink-50 rounded-xl cursor-pointer hover:bg-ink-100 transition-colors">
                      <div>
                        <p className="font-body text-sm font-medium text-ink-900">{label}</p>
                        <p className="font-body text-xs text-ink-400">{desc}</p>
                      </div>
                      <div className={`w-10 h-6 rounded-full transition-colors relative ${form[field] ? 'bg-crimson-500' : 'bg-ink-300'}`}
                        onClick={() => set(field, !form[field])}>
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${form[field] ? 'translate-x-5' : 'translate-x-1'}`} />
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Publish box */}
            <div className="card space-y-4">
              <h3 className="font-display text-base font-bold text-ink-900">Publish</h3>
              <div>
                <label className="form-label">Status</label>
                <select value={form.status} onChange={e => set('status', e.target.value)} className="form-input">
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
              <div className="flex flex-col gap-2 pt-1">
                <button type="submit" disabled={loading}
                  className="btn-primary w-full justify-center py-2.5">
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Saving...
                    </span>
                  ) : isEdit ? '💾 Save Changes' : '💾 Save Draft'}
                </button>
                {!isEdit && (
                  <button type="button" disabled={loading}
                    onClick={e => handleSubmit(e, true)}
                    className="btn-secondary w-full justify-center py-2.5 border border-ink-200">
                    🚀 Publish Now
                  </button>
                )}
              </div>
            </div>

            {/* Category */}
            <div className="card">
              <label className="form-label">Category *</label>
              <select value={form.category} onChange={e => set('category', e.target.value)}
                className="form-input" required>
                <option value="">Select category...</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.icon} {cat.name}</option>
                ))}
              </select>
            </div>

            {/* Word count estimate */}
            <div className="card">
              <p className="font-body text-xs text-ink-400 uppercase tracking-wider mb-2">Estimated</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-ink-50 rounded-xl">
                  <p className="font-display text-xl font-bold text-ink-900">
                    {Math.ceil(form.content.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length / 200) || 0}
                  </p>
                  <p className="font-body text-xs text-ink-400">min read</p>
                </div>
                <div className="text-center p-3 bg-ink-50 rounded-xl">
                  <p className="font-display text-xl font-bold text-ink-900">
                    {form.content.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length}
                  </p>
                  <p className="font-body text-xs text-ink-400">words</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
