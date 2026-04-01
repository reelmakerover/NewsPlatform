import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import AdminLayout from './components/AdminLayout'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import ArticlesPage from './pages/ArticlesPage'
import ArticleFormPage from './pages/ArticleFormPage'
import VideosPage from './pages/VideosPage'
import VideoFormPage from './pages/VideoFormPage'
import CategoriesPage from './pages/CategoriesPage'
import SubscribersPage from './pages/SubscribersPage'
import BroadcastPage from './pages/BroadcastPage'
import PlansPage from './pages/PlansPage'
import AdsPage from './pages/AdsPage'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-crimson-500 border-t-transparent rounded-full animate-spin" /></div>
  if (!user) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="articles" element={<ArticlesPage />} />
          <Route path="articles/new" element={<ArticleFormPage />} />
          <Route path="articles/edit/:id" element={<ArticleFormPage />} />
          <Route path="videos" element={<VideosPage />} />
          <Route path="videos/new" element={<VideoFormPage />} />
          <Route path="videos/edit/:id" element={<VideoFormPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="plans" element={<PlansPage />} />
          <Route path="subscribers" element={<SubscribersPage />} />
          <Route path="broadcast" element={<BroadcastPage />} />
          <Route path="ads" element={<AdsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
