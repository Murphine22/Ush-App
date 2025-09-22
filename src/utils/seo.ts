// SEO Utility Functions
export const generateMetaTags = (page: string) => {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  
  const seoData = {
    home: {
      title: "DIGC Ushering Department - Welcome Home | Finance Management Portal",
      description: "Welcome to Dunamis International Gospel Centre Ushering Department. Serving with excellence, walking in love, and growing in faith. Access our finance management portal, view announcements, and connect with our ministry.",
      keywords: "DIGC, Dunamis International Gospel Centre, Ushering Department, Church Ministry, Finance Management, Monthly Dues, Contributions, Donations, Abuja Church, Nigeria",
      image: "https://images.pexels.com/photos/8468469/pexels-photo-8468469.jpeg?auto=compress&cs=tinysrgb&w=1200&h=630&dpr=1",
      url: `${baseUrl}/`
    },
    about: {
      title: "About Us - DIGC Ushering Department | Our Mission & Values",
      description: "Learn about the Dunamis International Gospel Centre Ushering Department. Discover our mission, core values, training programs, and commitment to excellence in hospitality ministry.",
      keywords: "DIGC About, Ushering Department Mission, Church Values, Ministry Excellence, Training Programs, Hospitality Ministry, Christian Service",
      image: "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=1200&h=630&dpr=1",
      url: `${baseUrl}/about`
    },
    services: {
      title: "Our Services - DIGC Ushering Department | Ministry Excellence",
      description: "Explore the comprehensive services offered by DIGC Ushering Department. From warm welcomes to event coordination, accessibility support, and hospitality services.",
      keywords: "Church Services, Ushering Services, Event Coordination, Hospitality Ministry, Accessibility Support, Welcome Services, Church Events",
      image: "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1200&h=630&dpr=1",
      url: `${baseUrl}/services`
    },
    finance: {
      title: "Finance Portal - DIGC Ushering Department | Transparent Financial Management",
      description: "Access the DIGC Ushering Department finance portal. View financial reports, monthly dues, contributions, donations, and bank account details. Transparent and accountable financial management.",
      keywords: "Church Finance, Financial Management, Monthly Dues, Contributions, Donations, Financial Reports, Bank Account, Transparency, Accountability",
      image: "https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=1200&h=630&dpr=1",
      url: `${baseUrl}/finance`
    },
    'monthly-dues-record': {
      title: "Monthly Dues Record - DIGC Ushering Department | Member Payment Tracking",
      description: "Access the monthly dues record system for DIGC Ushering Department. Track member payments, manage dues collection, and maintain accurate financial records.",
      keywords: "Monthly Dues, Payment Tracking, Member Records, Financial Tracking, Dues Collection, Payment Management",
      image: "https://images.pexels.com/photos/210600/pexels-photo-210600.jpeg?auto=compress&cs=tinysrgb&w=1200&h=630&dpr=1",
      url: `${baseUrl}/monthly-dues-record`
    }
  };

  return seoData[page as keyof typeof seoData] || seoData.home;
};

export const generateStructuredData = (type: 'organization' | 'article' | 'event', data: any) => {
  const baseStructuredData = {
    "@context": "https://schema.org",
    "@type": type === 'organization' ? "Organization" : type === 'article' ? "Article" : "Event"
  };

  switch (type) {
    case 'organization':
      return {
        ...baseStructuredData,
        "name": "Dunamis International Gospel Centre - Ushering Department",
        "description": "Excellence in hospitality ministry and financial management",
        "url": typeof window !== 'undefined' ? window.location.origin : '',
        "logo": "https://images.pexels.com/photos/8468469/pexels-photo-8468469.jpeg",
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
        "sameAs": ["https://www.dunamisgospel.org"]
      };
    
    case 'article':
      return {
        ...baseStructuredData,
        "headline": data.title,
        "description": data.description,
        "author": {
          "@type": "Organization",
          "name": data.author || "DIGC Ushering Department"
        },
        "publisher": {
          "@type": "Organization",
          "name": "DIGC Ushering Department"
        },
        "datePublished": data.publishedTime,
        "dateModified": data.modifiedTime || data.publishedTime,
        "image": data.image
      };
    
    case 'event':
      return {
        ...baseStructuredData,
        "name": data.title,
        "description": data.description,
        "startDate": data.startDate,
        "location": {
          "@type": "Place",
          "name": data.venue || "Dunamis International Gospel Centre",
          "address": "Abuja, Nigeria"
        },
        "organizer": {
          "@type": "Organization",
          "name": "DIGC Ushering Department"
        }
      };
    
    default:
      return baseStructuredData;
  }
};

export const optimizeImages = (imageUrl: string, width?: number, height?: number) => {
  if (imageUrl.includes('pexels.com')) {
    const baseUrl = imageUrl.split('?')[0];
    const params = new URLSearchParams();
    params.set('auto', 'compress');
    params.set('cs', 'tinysrgb');
    if (width) params.set('w', width.toString());
    if (height) params.set('h', height.toString());
    params.set('dpr', '1');
    
    return `${baseUrl}?${params.toString()}`;
  }
  return imageUrl;
};