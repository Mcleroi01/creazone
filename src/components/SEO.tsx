import React from 'react'
import { Helmet } from 'react-helmet-async'
import { useApp } from '../contexts/AppContext'

interface SEOProps {
  title?: string
  description?: string
  type?: 'website' | 'article'
  image?: string
  canonicalUrl?: string
  hreflangUrls?: Record<string, string>
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  type = 'website',
  image,
  canonicalUrl,
  hreflangUrls
}) => {
  const { language } = useApp()
  
  const siteTitle = 'CréaZone'
  const defaultDescription = {
    fr: 'Blog moderne avec tutoriels et articles techniques',
    en: 'Modern blog with tutorials and technical articles',
    pt: 'Blog moderno com tutoriais e artigos técnicos'
  }

  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle
  const metaDescription = description || defaultDescription[language]

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:type" content={type} />
      <meta property="og:locale" content={language === 'en' ? 'en_US' : language === 'fr' ? 'fr_FR' : 'pt_BR'} />
      
      {image && <meta property="og:image" content={image} />}
      
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      
      {hreflangUrls && Object.entries(hreflangUrls).map(([lang, url]) => (
        <link key={lang} rel="alternate" hrefLang={lang} href={url} />
      ))}
      
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      {image && <meta name="twitter:image" content={image} />}
    </Helmet>
  )
}