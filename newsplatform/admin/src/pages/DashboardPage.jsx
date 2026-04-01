import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../utils/api'
import { useAuth } from '../context/AuthContext'

function StatCard({ icon, label, value, color, loading }) {
  return (
    <div className="card flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0" style={{ backgroundColor: color + '15' }}>
        {icon}
      </div>
      <div>
        <p className="font-body text-sm text-ink-500">{label}</p>
        {loading ? (
          <div className="h-7 w-16 bg-ink-100 rounded animate-pulse mt-1" />
        ) : (
          <p className="font-display text-2xl font-bold text-ink-900">{value?.toLocaleString()}</p>
        )}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [recent, setRecent] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/articles/admin?limit=5'),
      api.get('/articles/trending'),
      api.get('/videos/admin/all'),
      api.get('/categories')
    ]).then(([arts, trending, vids, cats]) => {
      const totalViews = (trending.articles || []).reduce((s, a) => s + (a.views || 0), 0)
      setStats({
        totalArticles: arts.pagination?.total || 0,
        totalVideos: vids.videos?.length || 0,
        totalCategories: cats.categories?.length || 0,
        totalViews
      })
      setRecent(arts.articles || [])
    }).catch(console.error)
    .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-ink-900">
          Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="font-body text-sm text-ink-500 mt-1">Here's what's happening on IndiaInk today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon="📰" label="Total Articles" value={stats?.totalArticles} color="#E03535" loading={loading} />
        <StatCard icon="🎥" label="Total Videos" value={stats?.totalVideos} color="#6366F1" loading={loading} />
        <StatCard icon="📂" label="Categories" value={stats?.totalCategories} color="#F59E0B" loading={loading} />
        <StatCard icon="👁" label="Total Views" value={stats?.totalViews} color="#10B981" loading={loading} />
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          { to: '/articles/new', icon: '✍️', label: 'New Article', desc: 'Write and publish a story', color: '#E03535' },
          { to: '/videos/new', icon: '🎬', label: 'Add Video', desc: 'Embed a YouTube or Reel', color: '#6366F1' },
          { to: '/categories', icon: '📂', label: 'Manage Categories', desc: 'Add or edit categories', color: '#F59E0B' },
        ].map(action => (
          <Link key={action.to} to={action.to}
            className="card hover:shadow-md transition-shadow flex items-center gap-4 cursor-pointer group">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform" style={{ backgroundColor: action.color + '15' }}>
              {action.icon}
            </div>
            <div>
              <p className="font-body text-sm font-semibold text-ink-900 group-hover:text-crimson-500 transition-colors">{action.label}</p>
              <p className="font-body text-xs text-ink-400">{action.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent articles */}
      <div className="card">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-lg font-bold text-ink-900">Recent Articles</h2>
          <Link to="/articles" className="font-body text-xs text-crimson-500 hover:underline">View all</Link>
        </div>
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-ink-50 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {recent.map(article => (
              <div key={article._id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-ink-50 transition-colors">
                {article.thumbnail && (
                  <img src={article.thumbnail} alt={article.title} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-body text-sm font-medium text-ink-900 truncate">{article.title}</p>
                  <p className="font-body text-xs text-ink-400">{article.category?.name} · {article.views} views</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-body font-medium ${article.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                    {article.status}
                  </span>
                  <Link to={`/articles/edit/${article._id}`} className="p-1.5 rounded-lg hover:bg-ink-100 text-ink-400 hover:text-ink-700 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
