import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import api from '../utils/api'
import SEOHead from '../components/common/SEOHead'
import ArticleCard from '../components/common/ArticleCard'
import { ArticlePageSkeleton } from '../components/common/Skeletons'
import AdZone from '../components/common/AdZone'
import { formatDate, getEmbedUrl, shareArticle, bookmarkArticle, isBookmarked } from '../utils/helpers'
import toast from 'react-hot-toast'

export default function ArticlePage() {
  const { slug } = useParams()
  const [article, setArticle] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [bookmarked, setBookmarked] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      try {
        const data = await api.get(`/articles/${slug}`)
        setArticle(data.article)
        setRelated(data.related || [])
        setBookmarked(isBookmarked(slug))
      } catch {}
      finally { setLoading(false) }
    }
    fetch()
    window.scrollTo(0, 0)
  }, [slug])

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement
      setProgress(el.scrollHeight > el.clientHeight ? (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100 : 0)
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (loading) return <ArticlePageSkeleton />
  if (!article) return (
    <div className="container-narrow py-20 text-center">
      <p className="font-display text-2xl text-ink-400">Article nahi mila</p>
      <Link to="/" className="btn-primary mt-6 inline-block">← Wapas jao</Link>
    </div>
  )

  const { title, excerpt, content, thumbnail, category, author, createdAt, readTime, tags, embeddedVideo, metaTitle, metaDescription, metaKeywords } = article
  const embedUrl = embeddedVideo ? getEmbedUrl(embeddedVideo, 'youtube') : null
  const parts = content.split('</p>')
  const mid = Math.floor(parts.length / 2)
  const firstHalf = parts.slice(0, mid).join('</p>') + '</p>'
  const secondHalf = parts.slice(mid).join('</p>')

  return (
    <>
      <SEOHead
        title={metaTitle || title}
        description={metaDescription || excerpt}
        image={thumbnail}
        url={`${window.location.origin}/article/${slug}`}
        type="article"
        keywords={metaKeywords?.length ? metaKeywords : tags}
        article={{ publishedAt: createdAt, author: author?.name }}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: category?.name, url: `/category/${category?.slug}` },
          { name: title, url: `/article/${slug}` }
        ]}
      />

      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 z-[100] h-0.5 bg-ink-100">
        <div className="h-full bg-crimson-500 transition-all duration-100" style={{ width: `${progress}%` }} />
      </div>

      {/* Top Banner Ad */}
      <div className="container-wide pt-4">
        <AdZone position="top-banner" page="article" />
      </div>

      <article className="pt-6 pb-10">
        <div className="container-narrow mb-5">
          <nav className="flex items-center gap-2 font-body text-xs text-ink-400">
            <Link to="/" className="hover:text-crimson-500">Home</Link>
            <span>›</span>
            {category && <Link to={`/category/${category.slug}`} className="hover:text-crimson-500">{category.name}</Link>}
            <span>›</span>
            <span className="text-ink-600 line-clamp-1">{title}</span>
          </nav>
        </div>

        <header className="container-narrow mb-8">
          {category && (
            <Link to={`/category/${category.slug}`}>
              <span className="category-badge mb-4 inline-block" style={{ color: category.color, backgroundColor: category.color + '15' }}>
                {category.icon} {category.name}
              </span>
            </Link>
          )}
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="font-display text-3xl md:text-5xl font-bold text-ink-900 leading-tight mb-5 text-balance">
            {title}
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
            className="font-body text-xl text-ink-500 leading-relaxed mb-6">{excerpt}</motion.p>

          <div className="flex items-center justify-between flex-wrap gap-4 pb-6 border-b border-ink-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-crimson-100 flex items-center justify-center font-display font-bold text-crimson-600">
                {author?.name?.[0] || 'A'}
              </div>
              <div>
                <p className="font-body text-sm font-semibold text-ink-900">{author?.name}</p>
                <p className="font-body text-xs text-ink-400">{formatDate(createdAt)} · {readTime} min read</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => { const s = bookmarkArticle(slug); setBookmarked(s); toast.success(s ? '🔖 Saved!' : 'Removed') }}
                className={`p-2.5 rounded-full border transition-all ${bookmarked ? 'bg-crimson-500 border-crimson-500 text-white' : 'border-ink-200 text-ink-400 hover:border-ink-400'}`}>
                <svg className="w-4 h-4" fill={bookmarked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>
              </button>
              <button onClick={() => { shareArticle(title, slug); toast.success('Link copied!') }}
                className="p-2.5 rounded-full border border-ink-200 text-ink-400 hover:border-ink-400 transition-all">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>
              </button>
            </div>
          </div>
        </header>

        {thumbnail && (
          <div className="container-wide mb-10">
            <img src={thumbnail} alt={title} className="w-full max-h-[500px] object-cover rounded-3xl shadow-xl" />
          </div>
        )}

        {/* Content first half */}
        <div className="container-narrow article-prose" dangerouslySetInnerHTML={{ __html: firstHalf }} />

        {/* Mid-article Ad */}
        <div className="container-narrow my-8">
          <AdZone position="mid-article" page="article" />
        </div>

        {/* Content second half */}
        <div className="container-narrow article-prose" dangerouslySetInnerHTML={{ __html: secondHalf }} />

        {embedUrl && (
          <div className="container-narrow mt-10">
            <div className="relative rounded-2xl overflow-hidden aspect-video bg-ink-900 shadow-xl">
              <iframe src={embedUrl} className="w-full h-full" allowFullScreen title={title} />
            </div>
          </div>
        )}

        {tags?.length > 0 && (
          <div className="container-narrow mt-10 flex flex-wrap gap-2">
            {tags.map(tag => (
              <Link key={tag} to={`/search?q=${encodeURIComponent(tag)}`}
                className="px-3 py-1.5 bg-ink-100 text-ink-600 font-body text-xs rounded-full hover:bg-ink-200">
                #{tag}
              </Link>
            ))}
          </div>
        )}

        <div className="container-narrow mt-12">
          <div className="bg-ink-50 border border-ink-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-display text-lg font-bold text-ink-900">Yeh story pasand aayi?</p>
              <p className="font-body text-sm text-ink-500 mt-1">Share karo apne doston ke saath</p>
            </div>
            <button onClick={() => { shareArticle(title, slug); toast.success('Link copied!') }} className="btn-primary shrink-0">
              Share Karo 📤
            </button>
          </div>
        </div>
      </article>

      {/* Bottom Banner Ad */}
      <div className="container-wide mb-10">
        <AdZone position="bottom-banner" page="article" />
      </div>

      {related.length > 0 && (
        <section className="container-wide pb-20">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-6 bg-crimson-500 rounded-full" />
            <h2 className="font-display text-2xl font-bold text-ink-900">Aur Padho</h2>
          </div>
          {/* Between articles ad */}
          <div className="mb-6"><AdZone position="between-articles" page="article" /></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {related.map((a, i) => <ArticleCard key={a._id} article={a} index={i} />)}
          </div>
        </section>
      )}
    </>
  )
}
