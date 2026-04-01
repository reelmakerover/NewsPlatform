import { useState, useEffect, useRef } from 'react'
import api from '../../utils/api'

// Cache ads to avoid too many requests
const adCache = {}

function AdUnit({ ad }) {
  const ref = useRef(null)

  useEffect(() => {
    if (!ad?._id) return
    // Track impression
    api.post(`/ads/${ad._id}/impression`).catch(() => {})
    // Inject AdSense script if type is adsense
    if (ad.type === 'adsense' && ref.current) {
      try { (window.adsbygoogle = window.adsbygoogle || []).push({}) } catch {}
    }
  }, [ad?._id])

  if (!ad) return null

  const handleClick = () => {
    api.post(`/ads/${ad._id}/click`).catch(() => {})
  }

  // Image ad
  if (ad.type === 'image' && ad.imageUrl) {
    return (
      <a href={ad.linkUrl || '#'} target="_blank" rel="noopener noreferrer" onClick={handleClick}
        className="block w-full overflow-hidden rounded-xl">
        <img src={ad.imageUrl} alt={ad.altText || 'Advertisement'} className="w-full h-auto object-cover hover:opacity-95 transition-opacity" loading="lazy" />
      </a>
    )
  }

  // HTML/custom code ad
  if (ad.type === 'html' && ad.htmlCode) {
    return (
      <div onClick={handleClick} className="w-full overflow-hidden rounded-xl"
        dangerouslySetInnerHTML={{ __html: ad.htmlCode }} />
    )
  }

  // AdSense ad
  if (ad.type === 'adsense' && ad.adsenseSlot) {
    return (
      <div ref={ref} className="w-full overflow-hidden rounded-xl">
        <ins className="adsbygoogle" style={{ display: 'block' }}
          data-ad-client={import.meta.env.VITE_ADSENSE_CLIENT}
          data-ad-slot={ad.adsenseSlot}
          data-ad-format="auto"
          data-full-width-responsive="true" />
      </div>
    )
  }

  return null
}

export default function AdZone({ position, page = 'all', className = '' }) {
  const [ads, setAds] = useState([])

  useEffect(() => {
    const cacheKey = `${position}_${page}`
    if (adCache[cacheKey]) { setAds(adCache[cacheKey]); return }
    api.get(`/ads?position=${position}&page=${page}`)
      .then(d => {
        const result = d.ads || []
        adCache[cacheKey] = result
        setAds(result)
      })
      .catch(() => {})
  }, [position, page])

  if (!ads.length) return null

  return (
    <div className={`w-full ${className}`}>
      <p className="font-body text-xs text-ink-300 text-center mb-1.5 uppercase tracking-wider">Advertisement</p>
      {ads.map(ad => <AdUnit key={ad._id} ad={ad} />)}
    </div>
  )
}
