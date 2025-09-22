import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
}

const SEOManager: React.FC<SEOProps> = ({
  title = "DIGC Ushering Department - Finance Management Portal",
  description = "Dunamis International Gospel Centre Ushering Department official finance management application. Track dues, contributions, donations, and manage department finances with transparency and excellence.",
  keywords = "DIGC, Dunamis International Gospel Centre, Ushering Department, Finance Management, Church Finance, Monthly Dues, Contributions, Donations, Transparency, Accountability",
  image = "https://images.pexels.com/photos/8468469/pexels-photo-8468469.jpeg?auto=compress&cs=tinysrgb&w=1200&h=630&dpr=1",
  url = typeof window !== 'undefined' ? window.location.href : '',
  type = "website",
  author = "DIGC Ushering Department",
  publishedTime,
  modifiedTime,
  section = "Finance",
  tags = []
}) => {
  const siteName = "DIGC Ushering Department";
  const twitterHandle = "@DunamisGospel";

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={twitterHandle} />
      <meta name="twitter:creator" content={twitterHandle} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Article Meta Tags */}
      {type === 'article' && (
        <>
          <meta property="article:author" content={author} />
          <meta property="article:section" content={section} />
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
          {tags.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}
        </>
      )}
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
      
      {/* Favicon and Icons */}
      <link rel="icon" type="image/svg+xml" href="/vite.svg" />
      <link rel="apple-touch-icon" href="/vite.svg" />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Dunamis International Gospel Centre - Ushering Department",
          "description": description,
          "url": url,
          "logo": image,
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+234-803-786-5842",
            "contactType": "customer service",
            "email": "digcusheringdepartment@gmail.com"
          },
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Abuja",
            "addressCountry": "Nigeria"
          },
          "sameAs": [
            "https://www.dunamisgospel.org"
          ]
        })}
      </script>
    </Helmet>
  );
};

export default SEOManager;