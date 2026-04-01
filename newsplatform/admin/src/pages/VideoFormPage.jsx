import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { getEmbedUrl } from '../utils/helpers'

export default function VideoFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [form, setForm] = useState({
    title: '', description: '', videoUrl: '', videoType: 'youtube',
    thumbnail: '', category: '', status: 'published', duration: '', tags: '', isFeatured: false
  })
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api.get('/categories').then(d => setCategories(d.categories || [])).catch(console.error)
    if (isEdit) {
      api.get('/videos/admin/all').then(d => {
        const video = d.videos?.find(v => v._id === id)
        if (video) {
          setForm({
            title: video.title || '',
            description: video.description || '',
            videoUrl: video.videoUrl || '',
            videoType: video.videoType || 'youtube',
            thumbnail: video.thumbnail || '',
            category: video.category?._id || '',
            status: video.status || 'published',
            duration: video.duration || '',
            tags: (video.tags || []).join(', '),
            isFeatured: video.isFeatured || false
          })
        }
      }).catch(console.error)
    }
  }, [id])

  const set = (field, value) => setForm(f => ({ ...f, [field]: value }))

  // Auto-detect video type from URL
  const handleUrlChange = (url) => {
    set('videoUrl', url)
    if (url.includes('youtube.com') || url.includes('youtu.be')) set('videoType', 'youtube')
    else if (url.includes('instagram.com')) set('videoType', 'instagram')
    else set('videoType', 'direct')
  }

  // Auto-extract YouTube thumbnail
  const handleAutoThumb = () => {
    if (form.videoType === 'youtube' && form.videoUrl) {
      const match = form.videoUrl.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=))([^\/&\?]*)/i)
      if (match?.[1]) {
        set('thumbnail', `https://img.youtube.com/vi/${match[1]}/maxresdefault.jpg`)
        toast.success('Thumbnail extracted from YouTube!')
      }
    }
  }

  const embedPreviewUrl = form.videoUrl ? getEmbedUrl(form.videoUrl, form.videoType) : null

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) return toast.error('Title required')
    if (!form.videoUrl.trim()) return toast.error('Video URL required')

    setLoading(true)
    try {
      const payload = { ...form, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) }
      if (isEdit) {
        await api.put(`/videos/${id}`, payload)
        toast.success('Video updated!')
      } else {
        await api.post('/videos', payload)
        toast.success('Video added!')
      }
      navigate('/videos')
    } catch (err) {
      toast.error(err.message || 'Failed to save')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-ink-900">{isEdit ? 'Edit Video' : 'Add Video'}</h1>
        <button onClick={() => navigate('/videos')} className="btn-secondary">← Back</button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="card space-y-5">
          <div>
            <label className="form-label">Title *</label>
            <input value={form.title} onChange={e => set('title', e.target.value)}
              className="form-input" placeholder="Video title..." required />
          </div>
          <div>
            <label className="form-label">Description</label>
            <textarea value={form.description} onChange={e => set('description', e.target.value)}
              className="form-input resize-none" rows={3} placeholder="Brief description of the video..." />
          </div>
        </div>

        <div className="card space-y-5">
          <h3 className="font-display text-base font-bold text-ink-900">Video Source</h3>
          <div>
            <label className="form-label">Video Type</label>
            <div className="flex gap-2">
              {['youtube', 'instagram', 'direct'].map(t => (
                <button key={t} type="button" onClick={() => set('videoType', t)}
                  className={`px-4 py-2 rounded-lg font-body text-sm font-medium capitalize transition-colors ${form.videoType === t ? 'bg-ink-900 text-white' : 'bg-ink-100 text-ink-600 hover:bg-ink-200'}`}>
                  {t === 'youtube' ? '▶️ YouTube' : t === 'instagram' ? '📸 Instagram' : '🔗 Direct'}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="form-label">Video URL *</label>
            <input value={form.videoUrl} onChange={e => handleUrlChange(e.target.value)}
              className="form-input" placeholder="https://www.youtube.com/watch?v=..." required />
            <p className="font-body text-xs text-ink-400 mt-1">
              YouTube: youtube.com/watch?v=ID · Instagram: instagram.com/reel/...
            </p>
          </div>

          {/* Embed preview */}
          {embedPreviewUrl && (
            <div>
              <p className="form-label">Preview</p>
              <div className="aspect-video rounded-xl overflow-hidden bg-ink-900">
                <iframe src={embedPreviewUrl} className="w-full h-full" allowFullScreen title="Preview" />
              </div>
            </div>
          )}
        </div>

        <div className="card space-y-5">
          <h3 className="font-display text-base font-bold text-ink-900">Thumbnail</h3>
          <div className="flex gap-2">
            <input value={form.thumbnail} onChange={e => set('thumbnail', e.target.value)}
              className="form-input flex-1" placeholder="https://example.com/thumb.jpg" />
            {form.videoType === 'youtube' && (
              <button type="button" onClick={handleAutoThumb} className="btn-secondary shrink-0 whitespace-nowrap">
                Auto-extract
              </button>
            )}
          </div>
          {form.thumbnail && (
            <img src={form.thumbnail} alt="Thumbnail preview" className="w-40 h-24 object-cover rounded-xl" />
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="card">
            <label className="form-label">Category</label>
            <select value={form.category} onChange={e => set('category', e.target.value)} className="form-input">
              <option value="">Select category...</option>
              {categories.map(cat => (
                <option key={cat._id} value={cat._id}>{cat.icon} {cat.name}</option>
              ))}
            </select>
          </div>
          <div className="card">
            <label className="form-label">Duration</label>
            <input value={form.duration} onChange={e => set('duration', e.target.value)}
              className="form-input" placeholder="e.g. 2:30" />
          </div>
        </div>

        <div className="card space-y-4">
          <div>
            <label className="form-label">Tags</label>
            <input value={form.tags} onChange={e => set('tags', e.target.value)}
              className="form-input" placeholder="news, viral, india" />
          </div>
          <div>
            <label className="form-label">Status</label>
            <select value={form.status} onChange={e => set('status', e.target.value)} className="form-input">
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={form.isFeatured} onChange={e => set('isFeatured', e.target.checked)}
              className="w-4 h-4 accent-crimson-500" />
            <span className="font-body text-sm font-medium text-ink-700">Featured video</span>
          </label>
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={loading} className="btn-primary py-3 px-8">
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Saving...
              </span>
            ) : isEdit ? '💾 Save Changes' : '🎬 Add Video'}
          </button>
          <button type="button" onClick={() => navigate('/videos')} className="btn-secondary py-3 px-6">Cancel</button>
        </div>
      </form>
    </div>
  )
}
