import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { AppProvider } from './contexts/AppContext'
import { Layout } from './components/Layout'
import { HomePage } from './pages/HomePage'
import { BlogPage } from './pages/BlogPage'
import { CategoryPage } from './pages/CategoryPage'
import { PostPage } from './pages/PostPage'
import { AboutPage } from './pages/AboutPage'
import { ContactPage } from './pages/ContactPage'

function App() {
  return (
    <HelmetProvider>
      <AppProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/categories/:category" element={<CategoryPage />} />
              <Route path="/blog/:slug" element={<PostPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
            </Routes>
          </Layout>
        </Router>
      </AppProvider>
    </HelmetProvider>
  )
}

export default App