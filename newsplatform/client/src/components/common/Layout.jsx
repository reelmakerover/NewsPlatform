import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../../utils/api'
import { useUserAuth } from '../../context/UserAuthContext'

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/category/technology', label: 'Tech' },
  { to: '/category/business', label: 'Business' },
  { to: '/category/viral', label: 'Viral' },
  { to: '/category/law', label: 'Law' },
  { to: '/videos', label: '▶ Reels' },
]

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [menuOpen, setMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout, isPremium } = useUserAuth()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMenuOpen(false); setSearchOpen(false); setUserMenuOpen(false) }, [location])

  useEffect(() => {
    if (query.length < 2) { setSuggestions([]); return }
    const t = setTimeout(async () => {
      try {
        const data = await api.get(`/search/suggestions?q=${encodeURIComponent(query)}`)
        setSuggestions(data.suggestions || [])
      } catch {}
    }, 250)
    return () => clearTimeout(t)
  }, [query])

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) { navigate(`/search?q=${encodeURIComponent(query.trim())}`); setSearchOpen(false) }
  }

  const handleLogout = () => { logout(); navigate('/') }

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm border-b border-ink-100' : 'bg-white border-b border-ink-100'}`}>
      <div className="container-wide h-16 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <span className="font-display text-2xl font-bold text-ink-900">India<span className="text-crimson-500">Ink</span></span>
          <span className="hidden sm:block w-px h-5 bg-ink-300" />
          <span className="hidden sm:block font-body text-xs text-ink-400 uppercase tracking-widest">News & Culture</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map(({ to, label }) => (
            <Link key={to} to={to} className={`px-3 py-1.5 font-body text-sm font-medium rounded-full transition-colors ${location.pathname === to ? 'bg-ink-100 text-ink-900' : 'text-ink-600 hover:text-ink-900 hover:bg-ink-50'}`}>
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link to="/pricing" className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-crimson-500 text-white font-body text-xs font-semibold rounded-full hover:bg-crimson-600 transition-colors">
            👑 Subscribe
          </Link>

          <button onClick={() => setSearchOpen(!searchOpen)} className="p-2 rounded-full hover:bg-ink-100 transition-colors">
            <svg className="w-5 h-5 text-ink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </button>

          {/* User menu */}
          {user ? (
            <div className="relative">
              <button onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full hover:bg-ink-100 transition-colors">
                <div className="w-7 h-7 rounded-full bg-crimson-100 text-crimson-600 font-display font-bold flex items-center justify-center text-sm">
                  {user.name?.[0]?.toUpperCase()}
                </div>
                <span className="hidden sm:block font-body text-sm text-ink-700 max-w-[80px] truncate">{user.name?.split(' ')[0]}</span>
                {isPremium() && <span className="text-xs">👑</span>}
              </button>
              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                    className="absolute right-0 top-12 w-52 bg-white rounded-2xl border border-ink-100 shadow-xl overflow-hidden z-50">
                    <div className="p-4 border-b border-ink-100">
                      <p className="font-body text-sm font-semibold text-ink-900 truncate">{user.name}</p>
                      <p className="font-body text-xs text-ink-400 truncate">{user.email}</p>
                      <span className={`mt-1.5 inline-block px-2 py-0.5 rounded-full text-xs font-body font-medium capitalize ${isPremium() ? 'bg-crimson-100 text-crimson-700' : 'bg-ink-100 text-ink-600'}`}>
                        {isPremium() ? '👑 ' + (user.subscription?.plan || 'Premium') : '🆓 Free Plan'}
                      </span>
                    </div>
                    {!isPremium() && (
                      <Link to="/pricing" className="flex items-center gap-2 px-4 py-2.5 font-body text-sm text-crimson-500 hover:bg-crimson-50 transition-colors">
                        👑 Upgrade to Premium
                      </Link>
                    )}
                    <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2.5 font-body text-sm text-ink-600 hover:bg-ink-50 transition-colors">
                      🚪 Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link to="/login" className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 border border-ink-200 text-ink-600 font-body text-sm font-medium rounded-full hover:border-ink-400 transition-colors">
              Login
            </Link>
          )}

          <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden p-2 rounded-full hover:bg-ink-100 transition-colors">
            <svg className="w-5 h-5 text-ink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Search dropdown */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="absolute top-16 left-0 right-0 bg-white border-b border-ink-100 shadow-lg px-4 py-4">
            <form onSubmit={handleSearch} className="container-wide">
              <div className="relative">
                <input autoFocus value={query} onChange={e => setQuery(e.target.value)}
                  placeholder="Search news, articles, topics..."
                  className="w-full h-12 pl-5 pr-12 bg-ink-50 border border-ink-200 rounded-full font-body text-sm focus:outline-none focus:ring-2 focus:ring-crimson-500 focus:border-transparent" />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-ink-400 hover:text-crimson-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </button>
              </div>
              {suggestions.length > 0 && (
                <ul className="mt-2 bg-white rounded-xl border border-ink-100 shadow-md overflow-hidden">
                  {suggestions.map(s => (
                    <li key={s._id}>
                      <Link to={`/article/${s.slug}`} onClick={() => setSearchOpen(false)}
                        className="flex items-center gap-3 px-5 py-3 hover:bg-ink-50 font-body text-sm text-ink-700">
                        <svg className="w-4 h-4 text-ink-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        {s.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-ink-100 bg-white overflow-hidden">
            <div className="container-wide py-4 flex flex-col gap-1">
              {NAV_LINKS.map(({ to, label }) => (
                <Link key={to} to={to} className="px-4 py-2.5 font-body text-sm font-medium text-ink-700 rounded-lg hover:bg-ink-50">{label}</Link>
              ))}
              <div className="border-t border-ink-100 mt-2 pt-2">
                {user ? (
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 font-body text-sm font-medium text-red-500 rounded-lg hover:bg-red-50">🚪 Logout</button>
                ) : (
                  <>
                    <Link to="/login" className="block px-4 py-2.5 font-body text-sm font-medium text-ink-700 rounded-lg hover:bg-ink-50">Login</Link>
                    <Link to="/register" className="block px-4 py-2.5 font-body text-sm font-medium text-crimson-500 rounded-lg hover:bg-crimson-50">Register</Link>
                  </>
                )}
                <Link to="/pricing" className="block px-4 py-2.5 font-body text-sm font-medium text-crimson-500 rounded-lg hover:bg-crimson-50">👑 Subscribe</Link>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}

function BreakingTicker() {
  const [items, setItems] = useState([])
  useEffect(() => {
    api.get('/articles?trending=true&limit=8').then(d => setItems(d.articles || [])).catch(() => {})
  }, [])
  if (!items.length) return null
  const text = items.map(a => `🔴 ${a.title}`).join('   •   ')
  return (
    <div className="bg-ink-900 text-white h-8 flex items-center overflow-hidden border-b border-ink-800">
      <span className="px-3 bg-crimson-500 text-white text-xs font-body font-semibold uppercase tracking-wider h-full flex items-center shrink-0">Breaking</span>
      <div className="ticker-wrap flex-1 overflow-hidden">
        <span className="ticker-content text-xs font-body text-ink-300">{text}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{text}</span>
      </div>
    </div>
  )
}

function Footer() {
  return (
    <footer className="bg-ink-900 text-ink-300 mt-20">
      <div className="container-wide py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <span className="font-display text-2xl font-bold text-white">India<span className="text-crimson-500">Ink</span></span>
          <p className="mt-3 font-body text-sm text-ink-400 leading-relaxed max-w-sm">
            Premium journalism for modern India. Covering tech, business, law, and culture with depth and clarity.
          </p>
          <div className="flex gap-3 mt-5">
            {['Twitter', 'Instagram', 'LinkedIn'].map(s => (
              <a key={s} href="#" className="px-3 py-1.5 bg-ink-800 rounded-full font-body text-xs hover:bg-ink-700 transition-colors">{s}</a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-body font-semibold text-white text-sm uppercase tracking-widest mb-4">Categories</h4>
          <ul className="space-y-2">
            {['Technology', 'Business', 'Viral', 'Law & Policy'].map(c => (
              <li key={c}><Link to={`/category/${c.toLowerCase().split(' ')[0]}`} className="font-body text-sm hover:text-white transition-colors">{c}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-body font-semibold text-white text-sm uppercase tracking-widest mb-4">Company</h4>
          <ul className="space-y-2">
            {[['About', '/about'], ['Contact', '/contact'], ['Pricing', '/pricing'], ['Videos', '/videos']].map(([label, to]) => (
              <li key={to}><Link to={to} className="font-body text-sm hover:text-white transition-colors">{label}</Link></li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-ink-800">
        <div className="container-wide py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-body text-xs text-ink-500">© {new Date().getFullYear()} IndiaInk. All rights reserved.</p>
          <p className="font-body text-xs text-ink-500">Made with ❤️ in India</p>
        </div>
      </div>
    </footer>
  )
}

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <BreakingTicker />
      <Navbar />
      <main className="flex-1 mt-16"><Outlet /></main>
      <Footer />
    </div>
  )
}
