import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { UserAuthProvider } from './context/UserAuthContext'
import Layout from './components/common/Layout'
import HomePage from './pages/HomePage'
import ArticlePage from './pages/ArticlePage'
import CategoryPage from './pages/CategoryPage'
import VideosPage from './pages/VideosPage'
import SearchPage from './pages/SearchPage'
import { AboutPage, ContactPage } from './pages/StaticPages'
import AuthPage from './pages/AuthPage'
import PricingPage from './pages/PricingPage'

export default function App() {
  return (
    <UserAuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="article/:slug" element={<ArticlePage />} />
            <Route path="category/:slug" element={<CategoryPage />} />
            <Route path="videos" element={<VideosPage />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="login" element={<AuthPage mode="login" />} />
            <Route path="register" element={<AuthPage mode="register" />} />
            <Route path="pricing" element={<PricingPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </UserAuthProvider>
  )
}
