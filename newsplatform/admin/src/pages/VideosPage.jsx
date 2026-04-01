import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../utils/api'
import toast from 'react-hot-toast'

export default function VideosPage() {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchVideos = async () => {
    setLoading(true)
    try {
      const data = await api.get('/videos/admin/all')
      setVideos(data.videos || [])
    } catch (err) { toast.error(err.message) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchVideos() }, [])

  const handleDelete = async (id, title) => {
    if (!confirm(`Delete "${title}"?`)) return
    try {
      await api.delete(`/videos/${id}`)
      toast.success('Video deleted')
      fetchVideos()
    } catch (err) { toast.error(err.message) }
  }

  const toggleStatus = async (video) => {
    try {
      await api.put(`/videos/${video._id}`, { status: video.status === 'published' ? 'draft' : 'published' })
      toast.success('Status updated')
      fetchVideos()
    } catch (err) { toast.error(err.message) }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-900">Videos</h1>
          <p className="font-body text-sm text-ink-500 mt-0.5">{videos.length} videos</p>
        </div>
        <Link to="/videos/new" className="btn-primary">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add Video
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="h-48 bg-white rounded-2xl border border-ink-100 animate-pulse" />)}
        </div>
      ) : videos.length === 0 ? (
        <div className="card text-center py-16">
          <p className="text-4xl mb-3">🎥</p>
          <p className="font-display text-xl text-ink-400">No videos yet</p>
          <Link to="/videos/new" className="btn-primary mt-4">Add your first video</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map(video => (
            <div key={video._id} className="bg-white rounded-2xl border border-ink-100 overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative h-36 bg-ink-900">
                {video.thumbnail ? (
                  <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover opacity-80" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl">📹</div>
                )}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                    <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                  </div>
                </div>
                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-body font-medium ${video.status === 'published' ? 'bg-green-500 text-white' : 'bg-amber-500 text-white'}`}>
                    {video.status}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <p className="font-body text-sm font-medium text-ink-900 line-clamp-2 mb-1">{video.title}</p>
                <p className="font-body text-xs text-ink-400 mb-3 capitalize">
                  {video.videoType} · {video.category?.name || 'Uncategorized'} · {video.views} views
                </p>
                <div className="flex items-center gap-2">
                  <button onClick={() => toggleStatus(video)}
                    className="flex-1 btn-secondary text-xs py-1.5 justify-center">
                    {video.status === 'published' ? 'Unpublish' : 'Publish'}
                  </button>
                  <Link to={`/videos/edit/${video._id}`} className="p-2 rounded-lg hover:bg-ink-100 text-ink-400 hover:text-ink-700 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  </Link>
                  <button onClick={() => handleDelete(video._id, video.title)} className="p-2 rounded-lg hover:bg-red-50 text-ink-400 hover:text-red-500 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
