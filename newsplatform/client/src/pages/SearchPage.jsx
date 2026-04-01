import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import api from '../utils/api'
import SEOHead from '../components/common/SEOHead'
import ArticleCard from '../components/common/ArticleCard'
import { ArticleCardSkeleton } from '../components/common/Skeletons'

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const [inputValue, setInputValue] = useState(query)
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const doSearch = useCallback(async (q) => {
    if (!q.trim()) return
    setLoading(true)
    setSearched(true)
    try {
      const data = await api.get(`/search?q=${encodeURIComponent(q.trim())}`)
      setArticles(data.articles || [])
    } catch { setArticles([]) }
    finally { setLoading(false) }
  }, [])

  useEffect(() => {
    if (query) {
      setInputValue(query)
      doSearch(query)
    }
  }, [query])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (inputValue.trim()) {
      setSearchParams({ q: inputValue.trim() })
    }
  }

  return (
    <>
      <SEOHead title={query ? `Search: ${query}` : 'Search'} />
      <div className="container-wide py-12 pb-20">
        {/* Search bar */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto mb-12">
          <h1 className="font-display text-4xl font-bold text-ink-900 text-center mb-8">Search IndiaInk</h1>
          <form onSubmit={handleSubmit} className="relative">
            <input value={inputValue} onChange={e => setInputValue(e.target.value)} autoFocus
              placeholder="Search news, topics, keywords..."
              className="w-full h-14 pl-6 pr-14 bg-white border-2 border-ink-200 rounded-full font-body text-base focus:outline-none focus:border-crimson-500 transition-colors shadow-sm" />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-crimson-500 rounded-full text-white hover:bg-crimson-600 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>
        </motion.div>

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <ArticleCardSkeleton key={i} />)}
          </div>
        ) : searched && articles.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🔍</p>
            <p className="font-display text-2xl text-ink-700 mb-2">No results for "{query}"</p>
            <p className="font-body text-ink-400 mb-8">Try different keywords or browse categories</p>
            <div className="flex flex-wrap justify-center gap-3">
              {['Technology', 'Business', 'Viral', 'Law'].map(c => (
                <Link key={c} to={`/category/${c.toLowerCase()}`} className="btn-outline">{c}</Link>
              ))}
            </div>
          </div>
        ) : articles.length > 0 ? (
          <>
            <p className="font-body text-sm text-ink-400 mb-6">
              {articles.length} result{articles.length !== 1 ? 's' : ''} for <strong className="text-ink-700">"{query}"</strong>
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article, i) => (
                <ArticleCard key={article._id} article={article} index={i} />
              ))}
            </div>
          </>
        ) : !searched ? (
          <div className="text-center py-20 text-ink-300">
            <p className="text-6xl mb-4">📰</p>
            <p className="font-display text-xl">Start typing to search</p>
          </div>
        ) : null}
      </div>
    </>
  )
}
