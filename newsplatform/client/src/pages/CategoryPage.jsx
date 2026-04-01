import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import api from '../utils/api'
import SEOHead from '../components/common/SEOHead'
import ArticleCard from '../components/common/ArticleCard'
import { ArticleCardSkeleton } from '../components/common/Skeletons'

export default function CategoryPage() {
  const { slug } = useParams()
  const [category, setCategory] = useState(null)
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState(null)
  const [loadingMore, setLoadingMore] = useState(false)

  useEffect(() => {
    const fetchCategory = async () => {
      setLoading(true)
      setArticles([])
      setPage(1)
      try {
        const [catData, artData] = await Promise.all([
          api.get(`/categories/${slug}`),
          api.get(`/articles?category=${slug}&page=1&limit=12`)
        ])
        // Need category _id for article filtering — re-fetch with id
        const catId = catData.category._id
        const artData2 = await api.get(`/articles?category=${catId}&page=1&limit=12`)
        setCategory(catData.category)
        setArticles(artData2.articles || [])
        setPagination(artData2.pagination)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchCategory()
    window.scrollTo(0, 0)
  }, [slug])

  const loadMore = async () => {
    if (!pagination || page >= pagination.pages || loadingMore) return
    setLoadingMore(true)
    try {
      const nextPage = page + 1
      const data = await api.get(`/articles?category=${category._id}&page=${nextPage}&limit=12`)
      setArticles(prev => [...prev, ...(data.articles || [])])
      setPage(nextPage)
      setPagination(data.pagination)
    } catch {}
    finally { setLoadingMore(false) }
  }

  return (
    <>
      <SEOHead title={category?.name} description={category?.description} />
      <div className="pb-20">
        {/* Hero banner */}
        <div className="relative overflow-hidden" style={{ backgroundColor: category?.color || '#E63946' }}>
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 20% 50%, white 0%, transparent 50%), radial-gradient(circle at 80% 20%, white 0%, transparent 40%)'
            }} />
          </div>
          <div className="container-wide py-16 relative">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <span className="text-5xl mb-4 block">{category?.icon || '📰'}</span>
              <h1 className="font-display text-4xl md:text-6xl font-bold text-white mb-3">{category?.name || slug}</h1>
              <p className="font-body text-white/80 text-lg max-w-xl">{category?.description}</p>
              {pagination && (
                <p className="font-body text-white/60 text-sm mt-3">{pagination.total} articles</p>
              )}
            </motion.div>
          </div>
        </div>

        {/* Articles grid */}
        <div className="container-wide mt-12">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(9)].map((_, i) => <ArticleCardSkeleton key={i} />)}
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-display text-2xl text-ink-400">No articles yet</p>
              <Link to="/" className="btn-primary mt-6">← Back to home</Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((article, i) => (
                  <ArticleCard key={article._id} article={article} index={i} />
                ))}
              </div>
              {loadingMore && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                  {[...Array(3)].map((_, i) => <ArticleCardSkeleton key={i} />)}
                </div>
              )}
              {pagination && page < pagination.pages && (
                <div className="text-center mt-10">
                  <button onClick={loadMore} disabled={loadingMore} className="btn-outline px-8 py-3 text-base">
                    {loadingMore ? 'Loading...' : 'Load more articles'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  )
}
