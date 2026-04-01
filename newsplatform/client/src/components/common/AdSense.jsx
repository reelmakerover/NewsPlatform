import { useEffect } from 'react'

export default function AdSense({ slot, format = 'auto', style = {} }) {
  const client = import.meta.env.VITE_ADSENSE_CLIENT

  useEffect(() => {
    try {
      if (window.adsbygoogle) (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {}
  }, [])

  if (!client || client === 'ca-pub-xxxxxxxxxxxxxxxx') {
    // Placeholder jab AdSense configure na ho
    return (
      <div className="w-full bg-ink-100 rounded-xl flex items-center justify-center text-ink-400 font-body text-xs border border-dashed border-ink-200" style={{ minHeight: 90, ...style }}>
        📢 Advertisement Space
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl" style={style}>
      <ins className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true" />
    </div>
  )
}

// Horizontal banner ad
export function AdBanner({ slot }) {
  return <AdSense slot={slot} format="horizontal" style={{ minHeight: 90 }} />
}

// In-article ad
export function AdInArticle({ slot }) {
  return (
    <div className="my-8">
      <p className="font-body text-xs text-ink-300 text-center mb-2 uppercase tracking-wider">Advertisement</p>
      <AdSense slot={slot} format="fluid" style={{ minHeight: 250 }} />
    </div>
  )
}

// Sidebar ad
export function AdSidebar({ slot }) {
  return <AdSense slot={slot} format="rectangle" style={{ minHeight: 250 }} />
}
