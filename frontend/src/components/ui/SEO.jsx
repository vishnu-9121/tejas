import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/utils/api';

export const SEO = ({ 
  pageKey,
  title, 
  description = 'Tejas Academy of Excellence delivers practical capability-building programs in business, entrepreneurship, leadership, AI literacy, career readiness, and future skills.', 
  keywords = 'Tejas Academy, Tejas Academy of Excellence, Business School India, Entrepreneurship Academy, Leadership Training, AI Literacy, Career Readiness, Future Skills', 
  image = 'https://unlocktejas.com/logo.png', 
  url,
  canonical,
  robots,
  type = 'website',
  schema 
}) => {
  // 1. Fetch dynamic page-specific SEO overrides from MongoDB if pageKey is supplied
  const { data: dbSeo } = useQuery({
    queryKey: ['seo-page', pageKey],
    queryFn: async () => {
      if (!pageKey) return null;
      try {
        const res = await api.get(`/seo/${pageKey}`);
        return res.data?.data;
      } catch (err) {
        return null;
      }
    },
    enabled: Boolean(pageKey),
    staleTime: 60 * 1000,
  });

  // Effective values prioritized: MongoDB Admin Entry -> Props -> Defaults
  const activeTitle = dbSeo?.title || title || 'Tejas Academy of Excellence | Leadership & Innovation';
  const activeDescription = dbSeo?.description || description;
  const activeKeywords = Array.isArray(dbSeo?.keywords) 
    ? dbSeo.keywords.join(', ') 
    : (dbSeo?.keywords || keywords);
  const activeRobots = dbSeo?.robots || robots || 'index, follow';
  const activeOgTitle = dbSeo?.ogTitle || activeTitle;
  const activeOgDescription = dbSeo?.ogDescription || activeDescription;
  const activeOgImage = dbSeo?.ogImage || image || 'https://unlocktejas.com/logo.png';

  // Clean canonical URL without tracking parameters
  const getCleanUrl = () => {
    if (dbSeo?.canonical) return dbSeo.canonical;
    if (canonical) return canonical;
    if (url) return url;
    if (typeof window !== 'undefined') {
      return `${window.location.origin}${window.location.pathname}`;
    }
    return 'https://unlocktejas.com';
  };

  const pageUrl = getCleanUrl();
  const siteTitle = activeTitle.includes('Tejas') ? activeTitle : `${activeTitle} | Tejas Academy of Excellence`;

  // Default Global EducationalOrganization & WebSite Schema
  const defaultSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "EducationalOrganization",
        "@id": "https://unlocktejas.com/#organization",
        "name": "Tejas Academy of Excellence Private Limited",
        "alternateName": ["Tejas Academy of Excellence", "Tejas Academy"],
        "url": "https://unlocktejas.com",
        "logo": "https://unlocktejas.com/logo.png",
        "description": "Tejas Academy of Excellence is an educational and capability-development institution focused on Business, Entrepreneurship, Leadership, AI Literacy, Career Readiness, and Human Excellence.",
        "email": "support@unlocktejas.com",
        "telephone": "+91 83310 51327",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Beside L K Towers, Roy Nagar",
          "addressLocality": "Gannavaram, Vijayawada, Amaravathi",
          "postalCode": "521101",
          "addressRegion": "Andhra Pradesh",
          "addressCountry": "IN"
        },
        "sameAs": [
          "https://twitter.com/unlocktejas",
          "https://linkedin.com/company/unlocktejas",
          "https://instagram.com/unlocktejas",
          "https://youtube.com/@unlocktejas",
          "https://facebook.com/unlocktejas"
        ]
      },
      {
        "@type": "WebSite",
        "@id": "https://unlocktejas.com/#website",
        "url": "https://unlocktejas.com",
        "name": "Tejas Academy of Excellence",
        "publisher": {
          "@id": "https://unlocktejas.com/#organization"
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://unlocktejas.com/programs?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      }
    ]
  };

  const activeSchema = dbSeo?.schemaJson || schema || defaultSchema;

  return (
    <Helmet>
      {/* Standard Meta Tags */}
      <title>{siteTitle}</title>
      <meta name="description" content={activeDescription} />
      {activeKeywords && <meta name="keywords" content={activeKeywords} />}
      <meta name="robots" content={activeRobots} />
      <link rel="canonical" href={pageUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:title" content={activeOgTitle} />
      <meta property="og:description" content={activeOgDescription} />
      <meta property="og:image" content={activeOgImage} />
      <meta property="og:site_name" content="Tejas Academy of Excellence" />
      <meta property="og:locale" content="en_IN" />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={pageUrl} />
      <meta name="twitter:title" content={activeOgTitle} />
      <meta name="twitter:description" content={activeOgDescription} />
      <meta name="twitter:image" content={activeOgImage} />
      <meta name="twitter:site" content="@unlocktejas" />

      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {typeof activeSchema === 'string' ? activeSchema : JSON.stringify(activeSchema)}
      </script>
    </Helmet>
  );
};

export default SEO;
