import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import api from '../utils/api'
import SEOHead from '../components/common/SEOHead'
import { getEmbedUrl } from '../utils/helpers'

// Hover-to-play reel card for grid view
function HoverReelCard({ video, index }) {
  const [hovered, setHovered] = useState(false)
  const embedUrl = getEmbedUrl(video.videoUrl, video.videoType)
  const autoplayUrl = embedUrl + (embedUrl.includes('?') ? '&' : '?') + 'autoplay=1&mute=1&controls=0&loop=1&rel=0'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}
      className="group relative bg-ink-900 rounded-2xl overflow-hidden cursor-pointer"
      style={{ aspectRatio: '9/16' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Thumbnail always shown */}
      {video.thumbnail && (
        <img src={video.thumbnail} alt={video.title}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${hovered ? 'opacity-0 scale-105' : 'opacity-100 scale-100'}`}
          loading="lazy" />
      )}

      {/* Iframe loads on hover */}
      {hovered && (
        <iframe
          src={autoplayUrl}
          className="absolute inset-0 w-full h-full"
          allowFullScreen
          allow="autoplay; encrypted-media"
          title={video.title}
        />
      )}

      {/* Overlay - visible when not hovered */}
      <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent transition-opacity duration-300 ${hovered ? 'opacity-0' : 'opacity-100'}`}>
        {/* Play icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/40 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          </div>
        </div>
        {/* Info at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          {video.category && (
            <span className="font-body text-xs text-white/70 uppercase tracking-wider block mb-1">
              {video.category.icon} {video.category.name}
            </span>
          )}
          <p className="font-display text-sm font-bold text-white leading-snug line-clamp-2">{video.title}</p>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="font-body text-xs text-white/50">👁 {video.views?.toLocaleString()}</span>
            {video.duration && <span className="font-body text-xs text-white/50">⏱ {video.duration}</span>}
          </div>
        </div>
      </div>

      {/* Hover hint badge */}
      {!hovered && (
        <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white text-xs font-body px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
          Hover to play
        </div>
      )}
    </motion.div>
  )
}

// Full-screen vertical reel for /reels view
function FullscreenReel({ video, isActive }) {
  const [playing, setPlaying] = useState(false)
  const embedUrl = getEmbedUrl(video.videoUrl, video.videoType)

  useEffect(() => {
    if (!isActive) setPlaying(false)
  }, [isActive])

  return (
    <div className="reel-item relative bg-black flex items-center justify-center">
      {video.thumbnail && !playing && (
        <img src={video.thumbnail} alt="" className="absolute inset-0 w-full h-full object-cover scale-110 blur-xl opacity-20 pointer-events-none" />
      )}
      <div className="relative w-full max-w-sm mx-auto h-full flex flex-col">
        <div className="flex-1 relative overflow-hidden">
          {playing ? (
            <iframe src={`${embedUrl}?autoplay=1`} className="w-full h-full" allowFullScreen allow="autoplay; encrypted-media" />
          ) : (
            <div className="w-full h-full relative cursor-pointer" onClick={() => setPlaying(true)}>
              {video.thumbnail
                ? <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                : <div className="w-full h-full bg-ink-800 flex items-center justify-center text-6xl">📹</div>}
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                  className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md border-2 border-white/50 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white ml-1.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                </motion.div>
              </div>
            </div>
          )}
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/80 to-transparent pointer-events-none">
          <h2 className="font-display text-lg font-bold text-white leading-snug mb-1">{video.title}</h2>
          {video.description && <p className="font-body text-sm text-white/70 line-clamp-2">{video.description}</p>}
          <span className="font-body text-xs text-white/50 mt-1 block">👁 {video.views?.toLocaleString()} views</span>
        </div>
      </div>
    </div>
  )
}

export default function VideosPage() {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState('grid') // 'grid' or 'reels'
  const [activeIdx, setActiveIdx] = useState(0)
  const containerRef = useRef(null)

  useEffect(() => {
    api.get('/videos?limit=24').then(d => { setVideos(d.videos || []); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (view !== 'reels') return
    const container = containerRef.current
    if (!container) return
    const handleScroll = () => {
      const idx = Math.round(container.scrollTop / container.clientHeight)
      setActiveIdx(idx)
    }
    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => container.removeEventListener('scroll', handleScroll)
  }, [view])

  return (
    <>
      <SEOHead title="Video Reels" description="Watch trending news reels, viral videos and short clips from IndiaInk"
        keywords={['news reels', 'viral videos', 'india news videos', 'short videos']} />

      {view === 'reels' ? (
        // Full-screen vertical scroll
        <div className="relative bg-black">
          <button onClick={() => setView('grid')}
            className="fixed top-20 left-4 z-50 bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-full font-body text-xs hover:bg-black/80 transition-colors">
            ← Grid View
          </button>
          <div className="hidden md:flex fixed right-6 top-1/2 -translate-y-1/2 z-50 flex-col gap-2">
            {videos.map((_, i) => (
              <button key={i} onClick={() => containerRef.current?.scrollTo({ top: i * containerRef.current.clientHeight, behavior: 'smooth' })}
                className={`rounded-full transition-all duration-300 ${i === activeIdx ? 'bg-white w-2 h-8' : 'bg-white/30 w-2 h-2 hover:bg-white/60'}`} />
            ))}
          </div>
          <div ref={containerRef} className="reel-container">
            {videos.map((video, i) => <FullscreenReel key={video._id} video={video} isActive={i === activeIdx} />)}
          </div>
        </div>
      ) : (
        // Grid with hover-to-play
        <div className="container-wide py-10 pb-20">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-display text-3xl font-bold text-ink-900">Video Reels</h1>
              <p className="font-body text-sm text-ink-500 mt-1">Hover on any video to preview • Click for fullscreen</p>
            </div>
            <button onClick={() => setView('reels')}
              className="flex items-center gap-2 px-4 py-2 bg-ink-900 text-white font-body text-sm font-medium rounded-full hover:bg-ink-800 transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              Reel Mode
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="bg-ink-200 rounded-2xl animate-pulse" style={{ aspectRatio: '9/16' }} />
              ))}
            </div>
          ) : videos.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-5xl mb-3">🎥</p>
              <p className="font-display text-2xl text-ink-400">No videos yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {videos.map((video, i) => <HoverReelCard key={video._id} video={video} index={i} />)}
            </div>
          )}
        </div>
      )}
    </>
  )
}
