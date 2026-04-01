import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../utils/api'
import toast from 'react-hot-toast'

export default function ArticlesPage() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [pagination, setPagination] = useState(null)
  const [page, setPage] = useState(1)

  const fetchArticles = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page, limit: 20 })
      if (filter !== 'all') params.set('status', filter)
      const data = await api.get(`/articles/admin?${params}`)
      setArticles(data.articles || [])
      setPagination(data.pagination)
    } catch (err) { toast.error(err.message) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchArticles() }, [filter, page])

  const handleDelete = async (id, title) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return
    try {
      await api.delete(`/articles/${id}`)
      toast.success('Article deleted')
      fetchArticles()
    } catch (err) { toast.error(err.message) }
  }

  const toggleStatus = async (article) => {
    try {
      const newStatus = article.status === 'published' ? 'draft' : 'published'
      await api.put(`/articles/${article._id}`, { status: newStatus })
      toast.success(`Article ${newStatus}`)
      fetchArticles()
    } catch (err) { toast.error(err.message) }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-900">Articles</h1>
          {pagination && <p className="font-body text-sm text-ink-500 mt-0.5">{pagination.total} total</p>}
        </div>
        <Link to="/articles/new" className="btn-primary">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          New Article
        </Link>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-5">
        {['all', 'published', 'draft'].map(f => (
          <button key={f} onClick={() => { setFilter(f); setPage(1) }}
            className={`px-4 py-1.5 rounded-full font-body text-sm font-medium transition-colors capitalize ${filter === f ? 'bg-ink-900 text-white' : 'bg-white border border-ink-200 text-ink-600 hover:border-ink-400'}`}>
            {f}
          </button>
        ))}
      </div>

      <div className="card p-0 overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">
            {[...Array(8)].map((_, i) => <div key={i} className="h-14 bg-ink-50 rounded-xl animate-pulse" />)}
          </div>
        ) : articles.length === 0 ? (
          <div className="p-12 text-center">
            <p className="font-display text-xl text-ink-400">No articles found</p>
            <Link to="/articles/new" className="btn-primary mt-4">Write your first article</Link>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-ink-100">
                <th className="text-left px-5 py-3 font-body text-xs font-semibold text-ink-400 uppercase tracking-wider">Article</th>
                <th className="text-left px-4 py-3 font-body text-xs font-semibold text-ink-400 uppercase tracking-wider hidden md:table-cell">Category</th>
                <th className="text-left px-4 py-3 font-body text-xs font-semibold text-ink-400 uppercase tracking-wider hidden lg:table-cell">Views</th>
                <th className="text-left px-4 py-3 font-body text-xs font-semibold text-ink-400 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-50">
              {articles.map(article => (
                <tr key={article._id} className="hover:bg-ink-50/50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      {article.thumbnail && (
                        <img src={article.thumbnail} alt={article.title} className="w-10 h-10 rounded-lg object-cover shrink-0 hidden sm:block" />
                      )}
                      <div className="min-w-0">
                        <p className="font-body text-sm font-medium text-ink-900 truncate max-w-xs">{article.title}</p>
                        <p className="font-body text-xs text-ink-400">{new Date(article.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 hidden md:table-cell">
                    <span className="font-body text-xs text-ink-600">{article.category?.name}</span>
                  </td>
                  <td className="px-4 py-3.5 hidden lg:table-cell">
                    <span className="font-body text-xs text-ink-600">{article.views?.toLocaleString()}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <button onClick={() => toggleStatus(article)}
                      className={`px-2.5 py-1 rounded-full text-xs font-body font-medium transition-colors ${article.status === 'published' ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-amber-100 text-amber-700 hover:bg-amber-200'}`}>
                      {article.status}
                    </button>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1 justify-end">
                      <Link to={`/articles/edit/${article._id}`} className="p-1.5 rounded-lg hover:bg-ink-100 text-ink-400 hover:text-ink-700 transition-colors" title="Edit">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      </Link>
                      <button onClick={() => handleDelete(article._id, article.title)} className="p-1.5 rounded-lg hover:bg-red-50 text-ink-400 hover:text-red-500 transition-colors" title="Delete">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-5">
          <button onClick={() => setPage(p => p - 1)} disabled={page === 1} className="btn-secondary disabled:opacity-40">← Prev</button>
          <span className="font-body text-sm text-ink-500">Page {page} of {pagination.pages}</span>
          <button onClick={() => setPage(p => p + 1)} disabled={page >= pagination.pages} className="btn-secondary disabled:opacity-40">Next →</button>
        </div>
      )}
    </div>
  )
}
