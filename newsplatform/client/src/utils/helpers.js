export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
}

export const formatDateShort = (date) => {
  return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

export const getYouTubeId = (url) => {
  const match = url.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/user\/\S+|\/ytscreeningroom\?v=|\/sandalsResorts#\w\/\w\/.*\/))([^\/&\?]*)/i)
  return match?.[1] || null
}

export const getEmbedUrl = (url, type) => {
  if (type === 'youtube') {
    const id = getYouTubeId(url)
    return id ? `https://www.youtube.com/embed/${id}?autoplay=0&rel=0` : url
  }
  return url
}

export const truncate = (str, n) => str?.length > n ? str.substring(0, n) + '...' : str

export const shareArticle = (title, slug) => {
  const url = `${window.location.origin}/article/${slug}`
  if (navigator.share) {
    navigator.share({ title, url })
  } else {
    navigator.clipboard.writeText(url)
  }
}

export const bookmarkArticle = (slug) => {
  const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]')
  const idx = bookmarks.indexOf(slug)
  if (idx === -1) {
    bookmarks.push(slug)
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks))
    return true
  } else {
    bookmarks.splice(idx, 1)
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks))
    return false
  }
}

export const isBookmarked = (slug) => {
  const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]')
  return bookmarks.includes(slug)
}
