import axios from 'axios'

const api = axios.create({ baseURL: '/api', timeout: 15000 })
api.interceptors.request.use(config => {
  const token = localStorage.getItem('adminToken')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})
api.interceptors.response.use(res => res.data, err => Promise.reject(err.response?.data || { message: 'Network error' }))
export default api
