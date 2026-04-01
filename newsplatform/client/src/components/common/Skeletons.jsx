export function ArticleCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-ink-100">
      <div className="skeleton h-48 w-full" />
      <div className="p-5 space-y-3">
        <div className="skeleton h-4 w-20 rounded-full" />
        <div className="skeleton h-5 w-full rounded" />
        <div className="skeleton h-5 w-4/5 rounded" />
        <div className="skeleton h-4 w-2/3 rounded" />
      </div>
    </div>
  )
}

export function HeroSkeleton() {
  return (
    <div className="h-[600px] bg-ink-100 animate-pulse rounded-3xl" />
  )
}

export function ArticlePageSkeleton() {
  return (
    <div className="container-narrow py-12 space-y-6">
      <div className="skeleton h-6 w-32 rounded-full" />
      <div className="skeleton h-12 w-full rounded" />
      <div className="skeleton h-8 w-3/4 rounded" />
      <div className="skeleton h-5 w-48 rounded" />
      <div className="skeleton h-80 w-full rounded-2xl" />
      {[...Array(5)].map((_, i) => <div key={i} className={`skeleton h-5 rounded ${i === 4 ? 'w-2/3' : 'w-full'}`} />)}
    </div>
  )
}
