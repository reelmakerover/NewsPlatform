import { Helmet } from 'react-helmet-async'

export default function SEOHead({ title, description, image, url, type = 'website', keywords, article, breadcrumbs }) {
  const siteName = 'IndiaInk'
  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://indiaink.com'
  const defaultDesc = 'Premium journalism for modern India — covering tech, business, law and culture with depth and clarity.'
  const defaultImg = `${siteUrl}/og-default.jpg`
  const fullTitle = title ? `${title} | ${siteName}` : `${siteName} — News, Business & Culture`
  const canonicalUrl = url || (typeof window !== 'undefined' ? window.location.href : siteUrl)
  const ogImage = image || defaultImg

  // Article structured data
  const articleSchema = article ? JSON.stringify({
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": title,
    "description": description || defaultDesc,
    "image": ogImage,
    "datePublished": article.publishedAt,
    "dateModified": article.updatedAt || article.publishedAt,
    "author": { "@type": "Person", "name": article.author || 'IndiaInk Team' },
    "publisher": {
      "@type": "Organization",
      "name": "IndiaInk",
      "logo": { "@type": "ImageObject", "url": `${siteUrl}/logo.png` }
    },
    "mainEntityOfPage": { "@type": "WebPage", "@id": canonicalUrl }
  }) : null

  // Breadcrumb structured data
  const breadcrumbSchema = breadcrumbs ? JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((b, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "name": b.name,
      "item": `${siteUrl}${b.url}`
    }))
  }) : null

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description || defaultDesc} />
      {keywords && <meta name="keywords" content={Array.isArray(keywords) ? keywords.join(', ') : keywords} />}
      <meta name="robots" content="index, follow, max-image-preview:large" />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || defaultDesc} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="en_IN" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@indiaink" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description || defaultDesc} />
      <meta name="twitter:image" content={ogImage} />

      {/* Article specific */}
      {article?.publishedAt && <meta property="article:published_time" content={article.publishedAt} />}
      {article?.author && <meta property="article:author" content={article.author} />}

      {/* Structured data */}
      {articleSchema && <script type="application/ld+json">{articleSchema}</script>}
      {breadcrumbSchema && <script type="application/ld+json">{breadcrumbSchema}</script>}
    </Helmet>
  )
}
