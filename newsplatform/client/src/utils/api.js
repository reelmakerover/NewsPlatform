import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 15000,
})

api.interceptors.request.use(config => {
  // Use userToken for user routes, adminToken for admin routes
  const userToken = localStorage.getItem('userToken')
  const adminToken = localStorage.getItem('token')
  const token = userToken || adminToken
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  res => res.data,
  err => Promise.reject(err.response?.data || { message: 'Network error' })
)

export default api
