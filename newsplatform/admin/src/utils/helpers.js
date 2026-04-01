export const getEmbedUrl = (url, type) => {
  if (type === 'youtube') {
    const match = url.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/user\/\S+\/))([^\/&\?]*)/i)
    const id = match?.[1]
    return id ? `https://www.youtube.com/embed/${id}?rel=0` : url
  }
  return url
}
