import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'

const navItems = [
  { to: '/dashboard', icon: '📊', label: 'Dashboard' },
  { to: '/articles', icon: '📰', label: 'Articles' },
  { to: '/videos', icon: '🎥', label: 'Videos' },
  { to: '/categories', icon: '📂', label: 'Categories' },
  { to: '/ads', icon: '📢', label: 'Ad Manager' },
  { to: '/plans', icon: '💰', label: 'Plans & Pricing' },
  { to: '/subscribers', icon: '👑', label: 'Subscribers' },
  { to: '/broadcast', icon: '📣', label: 'Broadcast' },
]

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const Sidebar = () => (
    <div className="flex flex-col h-full">
      <div className="p-5 border-b border-ink-100">
        <p className="font-display text-xl font-bold text-ink-900">India<span className="text-crimson-500">Ink</span></p>
        <p className="font-body text-xs text-ink-400 mt-0.5">Admin Panel</p>
      </div>
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map(item => (
          <NavLink key={item.to} to={item.to} onClick={() => setSidebarOpen(false)}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <span className="text-lg shrink-0">{item.icon}</span>
            <span className="truncate">{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-ink-100">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-crimson-100 text-crimson-600 font-display font-bold flex items-center justify-center text-sm shrink-0">
            {user?.name?.[0] || 'A'}
          </div>
          <div className="min-w-0">
            <p className="font-body text-sm font-medium text-ink-900 truncate">{user?.name}</p>
            <p className="font-body text-xs text-ink-400 capitalize">{user?.role}</p>
          </div>
        </div>
        <button onClick={() => { logout(); navigate('/login') }}
          className="w-full text-left sidebar-link text-red-500 hover:bg-red-50 hover:text-red-600">
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
          Sign out
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-ink-50 flex">
      <aside className="hidden md:flex flex-col w-60 bg-white border-r border-ink-100 fixed inset-y-0 left-0 z-30"><Sidebar /></aside>
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-60 bg-white flex flex-col z-50"><Sidebar /></aside>
        </div>
      )}
      <div className="flex-1 md:ml-60 flex flex-col min-h-screen">
        <header className="h-14 bg-white border-b border-ink-100 flex items-center justify-between px-4 md:px-6 sticky top-0 z-20">
          <button className="md:hidden p-2 rounded-lg hover:bg-ink-100" onClick={() => setSidebarOpen(true)}>
            <svg className="w-5 h-5 text-ink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/></svg>
          </button>
          <a href="http://localhost:5173" target="_blank" rel="noopener noreferrer"
            className="ml-auto flex items-center gap-1.5 font-body text-xs text-ink-500 hover:text-crimson-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
            View site
          </a>
        </header>
        <main className="flex-1 p-4 md:p-8"><Outlet /></main>
      </div>
    </div>
  )
}
