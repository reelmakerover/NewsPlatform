import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import api from '../utils/api'
import SEOHead from '../components/common/SEOHead'
import ArticleCard from '../components/common/ArticleCard'
import AdZone from '../components/common/AdZone'
import { ArticleCardSkeleton } from '../components/common/Skeletons'
import { formatDateShort, getEmbedUrl } from '../utils/helpers'

function Section({ children, className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} className={className}>
      {children}
    </motion.div>
  )
}

function HeroSection({ featured }) {
  const [activeIdx, setActiveIdx] = useState(0)
  useEffect(() => {
    if (!featured.length) return
    const t = setInterval(() => setActiveIdx(i => (i + 1) % Math.min(featured.length, 3)), 6000)
    return () => clearInterval(t)
  }, [featured])

  if (!featured.length) return <div className="h-[580px] bg-ink-100 animate-pulse rounded-3xl mx-4 mt-4" />

  const article = featured[activeIdx]
  return (
    <div className="relative h-[580px] md:h-[640px] overflow-hidden rounded-3xl mx-4 mt-4 bg-ink-900">
      <motion.div key={article._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className="absolute inset-0">
        <img src={article.thumbnail} alt={article.title} className="w-full h-full object-cover opacity-55" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-900/60 to-transparent" />
      </motion.div>
      <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12 max-w-3xl">
        {article.category && (
          <motion.span key={article._id + 'cat'} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
            className="category-badge mb-4 text-white border border-white/30 w-fit" style={{ backgroundColor: article.category.color + '40' }}>
            {article.category.icon} {article.category.name}
          </motion.span>
        )}
        <motion.h1 key={article._id + 'h'} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="font-display text-3xl md:text-5xl font-bold text-white leading-tight mb-4 text-balance">{article.title}</motion.h1>
        <motion.p key={article._id + 'p'} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="font-body text-ink-300 text-base md:text-lg mb-6 line-clamp-2 max-w-xl">{article.excerpt}</motion.p>
        <motion.div key={article._id + 'btn'} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="flex items-center gap-4">
          <Link to={`/article/${article.slug}`} className="btn-primary">
            Read Story <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
          </Link>
          <span className="font-body text-xs text-ink-400">{article.readTime} min read</span>
        </motion.div>
      </div>
      {featured.length > 1 && (
        <div className="absolute bottom-8 right-8 flex gap-2">
          {featured.slice(0, 3).map((_, i) => (
            <button key={i} onClick={() => setActiveIdx(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === activeIdx ? 'bg-white w-6' : 'bg-white/40 w-1.5'}`} />
          ))}
        </div>
      )}
    </div>
  )
}

function TrendingSlider({ articles }) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
      {articles.map((article, i) => (
        <Link key={article._id} to={`/article/${article.slug}`}
          className="group shrink-0 w-64 bg-white rounded-2xl overflow-hidden border border-ink-100 card-hover">
          <div className="relative overflow-hidden h-36">
            {article.thumbnail
              ? <img src={article.thumbnail} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
              : <div className="w-full h-full bg-ink-100 flex items-center justify-center text-3xl">{article.category?.icon}</div>}
            <span className="absolute top-2 left-2 bg-crimson-500 text-white text-xs font-body font-bold px-2 py-0.5 rounded-full">#{i + 1}</span>
          </div>
          <div className="p-3">
            <p className="font-display text-sm font-bold text-ink-900 line-clamp-2 group-hover:text-crimson-500 transition-colors leading-snug">{article.title}</p>
            <p className="font-body text-xs text-ink-400 mt-1">{formatDateShort(article.createdAt)}</p>
          </div>
        </Link>
      ))}
    </div>
  )
}

function VideoCard({ video }) {
  const [hovered, setHovered] = useState(false)
  const embedUrl = getEmbedUrl(video.videoUrl, video.videoType)
  const autoUrl = embedUrl + (embedUrl.includes('?') ? '&' : '?') + 'autoplay=1&mute=1&controls=0&loop=1'

  return (
    <div className="group relative bg-ink-900 rounded-2xl overflow-hidden aspect-[9/16] cursor-pointer"
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      {video.thumbnail && !hovered && (
        <img src={video.thumbnail} alt={video.title} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
      )}
      {hovered && <iframe src={autoUrl} className="absolute inset-0 w-full h-full" allow="autoplay; encrypted-media" allowFullScreen />}
      {!hovered && (
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform">
            <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          </div>
        </div>
      )}
      <div className={`absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent transition-opacity ${hovered ? 'opacity-0' : 'opacity-100'}`}>
        <p className="font-body text-xs font-medium text-white line-clamp-2">{video.title}</p>
      </div>
    </div>
  )
}

export default function HomePage() {
  const [featured, setFeatured] = useState([])
  const [trending, setTrending] = useState([])
  const [latest, setLatest] = useState([])
  const [videos, setVideos] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const loaderRef = useRef(null)

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [f, t, l, v, c] = await Promise.all([
          api.get('/articles?featured=true&limit=3'),
          api.get('/articles/trending'),
          api.get('/articles?limit=9&page=1'),
          api.get('/videos?limit=6'),
          api.get('/categories')
        ])
        setFeatured(f.articles || [])
        setTrending(t.articles || [])
        setLatest(l.articles || [])
        setHasMore((l.pagination?.pages || 1) > 1)
        setVideos(v.videos || [])
        setCategories(c.categories || [])
      } catch {}
      finally { setLoading(false) }
    }
    fetchAll()
  }, [])

  const loadMore = async () => {
    if (loadingMore || !hasMore) return
    setLoadingMore(true)
    try {
      const next = page + 1
      const data = await api.get(`/articles?limit=9&page=${next}`)
      setLatest(prev => [...prev, ...(data.articles || [])])
      setPage(next)
      setHasMore(next < (data.pagination?.pages || 1))
    } catch {}
    finally { setLoadingMore(false) }
  }

  useEffect(() => {
    if (!loaderRef.current) return
    const observer = new IntersectionObserver(entries => { if (entries[0].isIntersecting) loadMore() }, { threshold: 0.1 })
    observer.observe(loaderRef.current)
    return () => observer.disconnect()
  }, [page, hasMore, loadingMore])

  return (
    <>
      <SEOHead />
      <div className="pb-20">
        <HeroSection featured={featured} />

        {/* Top Banner Ad - Home */}
        <Section className="container-wide mt-6">
          <AdZone position="top-banner" page="home" />
        </Section>

        <Section className="container-wide mt-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 bg-crimson-500 rounded-full" />
              <h2 className="font-display text-2xl font-bold text-ink-900">Trending Now 🔥</h2>
            </div>
            <Link to="/search?q=trending" className="font-body text-sm text-crimson-500 hover:text-crimson-600 font-medium">See all →</Link>
          </div>
          {trending.length ? <TrendingSlider articles={trending} /> : <div className="h-48 skeleton rounded-2xl" />}
        </Section>

        <Section className="container-wide mt-14">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 bg-saffron-500 rounded-full" />
            <h2 className="font-display text-2xl font-bold text-ink-900">Explore Topics</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {categories.map(cat => (
              <Link key={cat._id} to={`/category/${cat.slug}`}
                className="group flex flex-col items-center justify-center p-6 bg-white rounded-2xl border border-ink-100 card-hover text-center">
                <span className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">{cat.icon}</span>
                <h3 className="font-display text-lg font-bold text-ink-900 group-hover:text-crimson-500 transition-colors">{cat.name}</h3>
                <p className="font-body text-xs text-ink-400 mt-1">{cat.articleCount} articles</p>
                <div className="mt-3 h-0.5 w-0 group-hover:w-full rounded-full transition-all duration-300" style={{ backgroundColor: cat.color }} />
              </Link>
            ))}
          </div>
        </Section>

        <Section className="container-wide mt-14">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 bg-ink-900 rounded-full" />
              <h2 className="font-display text-2xl font-bold text-ink-900">Latest Stories</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading
              ? [...Array(9)].map((_, i) => <ArticleCardSkeleton key={i} />)
              : latest.map((article, i) => (
                  <>
                    <ArticleCard key={article._id} article={article} index={i} />
                    {/* Ad after every 6 articles */}
                    {(i + 1) % 6 === 0 && (
                      <div key={`ad-${i}`} className="sm:col-span-2 lg:col-span-3">
                        <AdZone position="between-articles" page="home" />
                      </div>
                    )}
                  </>
                ))
            }
          </div>
          {loadingMore && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {[...Array(3)].map((_, i) => <ArticleCardSkeleton key={i} />)}
            </div>
          )}
          <div ref={loaderRef} className="h-4" />
        </Section>

        {videos.length > 0 && (
          <Section className="container-wide mt-14">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-1 h-6 bg-crimson-500 rounded-full" />
                <h2 className="font-display text-2xl font-bold text-ink-900">Video Reels</h2>
              </div>
              <Link to="/videos" className="btn-outline text-sm">View all</Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {videos.map(v => <VideoCard key={v._id} video={v} />)}
            </div>
          </Section>
        )}

        {/* Bottom Ad */}
        <Section className="container-wide mt-14">
          <AdZone position="bottom-banner" page="home" />
        </Section>
      </div>
    </>
  )
}
