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
  meta?: Array<{
    name?: string
    property?: string
    content: string
  }>
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  type = 'website',
  image,
  canonicalUrl,
  hreflangUrls,
  meta = []
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

  // Métadonnées de base
  const defaultMeta = [
    { name: 'description', content: metaDescription },
    { property: 'og:title', content: fullTitle },
    { property: 'og:description', content: metaDescription },
    { property: 'og:type', content: type },
    { property: 'og:locale', content: language === 'en' ? 'en_US' : language === 'fr' ? 'fr_FR' : 'pt_BR' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: fullTitle },
    { name: 'twitter:description', content: metaDescription },
  ];

  // Ajouter l'image si elle existe
  if (image) {
    defaultMeta.push(
      { property: 'og:image', content: image },
      { name: 'twitter:image', content: image }
    );
  }

  // Fusionner les métadonnées par défaut avec celles fournies
  const mergedMeta = [...defaultMeta, ...meta];

  return (
    <Helmet>
      <title>{fullTitle}</title>
      
      {/* Balises meta de base */}
      {mergedMeta.map((tag, index) => {
        if (tag.name) {
          return <meta key={`name-${index}`} name={tag.name} content={tag.content} />;
        } else if (tag.property) {
          return <meta key={`prop-${index}`} property={tag.property} content={tag.content} />;
        }
        return null;
      })}
      
      {/* URL canonique */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      
      {/* Balises hreflang */}
      {hreflangUrls && Object.entries(hreflangUrls).map(([lang, url]) => (
        <link key={lang} rel="alternate" hrefLang={lang} href={url} />
      ))}
    </Helmet>
  )
}