import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { formatDateShort } from '../../utils/helpers'

export default function ArticleCard({ article, index = 0, variant = 'default' }) {
  if (!article) return null
  const { title, excerpt, slug, thumbnail, category, author, createdAt, readTime, isTrending } = article

  if (variant === 'featured') {
    return (
      <motion.article initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}
        className="group relative overflow-hidden rounded-3xl bg-ink-900 h-[480px] card-hover cursor-pointer">
        <Link to={`/article/${slug}`}>
          {thumbnail && <img src={thumbnail} alt={title} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 group-hover:scale-105 transition-all duration-700" loading="lazy" />}
          <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            {category && (
              <span className="category-badge mb-3 text-white border border-white/30" style={{ backgroundColor: category.color + '33' }}>
                {category.icon} {category.name}
              </span>
            )}
            <h2 className="font-display text-2xl md:text-3xl font-bold text-white leading-tight mb-3 text-balance group-hover:text-crimson-400 transition-colors">{title}</h2>
            <p className="font-body text-sm text-ink-300 line-clamp-2 mb-4">{excerpt}</p>
            <div className="flex items-center gap-3 font-body text-xs text-ink-400">
              <span>{author?.name}</span>
              <span>·</span>
              <span>{formatDateShort(createdAt)}</span>
              <span>·</span>
              <span>{readTime} min read</span>
              {isTrending && <span className="ml-auto px-2 py-0.5 bg-crimson-500 text-white rounded-full text-xs">🔥 Trending</span>}
            </div>
          </div>
        </Link>
      </motion.article>
    )
  }

  if (variant === 'horizontal') {
    return (
      <motion.article initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}
        className="group flex gap-4 items-start bg-white rounded-2xl p-4 border border-ink-100 card-hover">
        <Link to={`/article/${slug}`} className="shrink-0">
          {thumbnail ? (
            <img src={thumbnail} alt={title} className="w-24 h-20 object-cover rounded-xl group-hover:scale-105 transition-transform duration-300" loading="lazy" />
          ) : (
            <div className="w-24 h-20 rounded-xl bg-ink-100 flex items-center justify-center text-2xl">{category?.icon || '📰'}</div>
          )}
        </Link>
        <div className="flex-1 min-w-0">
          {category && (
            <span className="font-body text-xs font-medium uppercase tracking-wider" style={{ color: category.color }}>{category.name}</span>
          )}
          <Link to={`/article/${slug}`}>
            <h3 className="font-display text-base font-bold text-ink-900 leading-snug mt-0.5 mb-1 group-hover:text-crimson-500 transition-colors line-clamp-2">{title}</h3>
          </Link>
          <div className="flex items-center gap-2 font-body text-xs text-ink-400">
            <span>{formatDateShort(createdAt)}</span>
            <span>·</span>
            <span>{readTime} min</span>
          </div>
        </div>
      </motion.article>
    )
  }

  // default card
  return (
    <motion.article initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}
      className="group bg-white rounded-2xl overflow-hidden border border-ink-100 card-hover">
      <Link to={`/article/${slug}`} className="block overflow-hidden">
        {thumbnail ? (
          <img src={thumbnail} alt={title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
        ) : (
          <div className="w-full h-48 bg-ink-100 flex items-center justify-center text-4xl">{category?.icon || '📰'}</div>
        )}
      </Link>
      <div className="p-5">
        {category && (
          <span className="category-badge mb-2" style={{ color: category.color, backgroundColor: category.color + '15' }}>
            {category.icon} {category.name}
          </span>
        )}
        <Link to={`/article/${slug}`}>
          <h3 className="font-display text-lg font-bold text-ink-900 leading-snug mb-2 group-hover:text-crimson-500 transition-colors line-clamp-2">{title}</h3>
        </Link>
        <p className="font-body text-sm text-ink-500 line-clamp-2 mb-4">{excerpt}</p>
        <div className="flex items-center justify-between font-body text-xs text-ink-400 pt-3 border-t border-ink-100">
          <div className="flex items-center gap-2">
            <span>{author?.name}</span>
            <span>·</span>
            <span>{formatDateShort(createdAt)}</span>
          </div>
          <span>{readTime} min read</span>
        </div>
      </div>
    </motion.article>
  )
}
