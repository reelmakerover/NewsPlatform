import { createContext, useContext, useState, useEffect } from 'react'
import api from '../utils/api'

const AuthContext = createContext(null)
export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (token) {
      api.get('/auth/me')
        .then(d => setUser(d.user))
        .catch(() => localStorage.removeItem('adminToken'))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    const data = await api.post('/auth/login', { email, password })
    localStorage.setItem('adminToken', data.token)
    setUser(data.user)
    return data
  }

  const logout = () => {
    localStorage.removeItem('adminToken')
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>
}
