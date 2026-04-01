import { createContext, useContext, useState, useEffect } from 'react'
import api from '../utils/api'

const UserAuthContext = createContext(null)
export const useUserAuth = () => useContext(UserAuthContext)

export function UserAuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('userToken')
    if (token) {
      api.get('/user/profile')
        .then(d => setUser(d.user))
        .catch(() => localStorage.removeItem('userToken'))
        .finally(() => setLoading(false))
    } else { setLoading(false) }
  }, [])

  const login = async (email, password) => {
    const data = await api.post('/user/login', { email, password })
    localStorage.setItem('userToken', data.token)
    setUser(data.user)
    return data
  }

  const register = async (name, email, password, phone) => {
    const data = await api.post('/user/register', { name, email, password, phone })
    localStorage.setItem('userToken', data.token)
    setUser(data.user)
    return data
  }

  const logout = () => { localStorage.removeItem('userToken'); setUser(null) }

  const isPremium = () => {
    if (!user) return false
    if (user.role === 'admin' || user.role === 'editor') return true
    const sub = user.subscription
    if (!sub) return false
    return ['basic','premium','annual'].includes(sub.plan) && sub.status === 'active' && (!sub.endDate || new Date() < new Date(sub.endDate))
  }

  const refreshUser = async () => {
    try { const d = await api.get('/user/profile'); setUser(d.user) } catch {}
  }

  return (
    <UserAuthContext.Provider value={{ user, loading, login, register, logout, isPremium, refreshUser }}>
      {children}
    </UserAuthContext.Provider>
  )
}
