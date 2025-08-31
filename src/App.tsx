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
              {/* Route de secours pour les pages non trouvées */}
              <Route 
                path="*" 
                element={
                  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                    <div className="text-center p-8 max-w-md">
                      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
                      <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">Page non trouvée</p>
                      <a 
                        href="/" 
                        className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200"
                      >
                        Retour à l'accueil
                      </a>
                    </div>
                  </div>
                } 
              />
            </Routes>
          </Layout>
        </Router>
      </AppProvider>
    </HelmetProvider>
  )
}

export default App