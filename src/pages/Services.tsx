import React from 'react';
import { Users, Heart, Navigation, Calendar, Accessibility, UsersIcon, ChevronRight, Shield, Headphones, Coffee, Gift, MapPin, Clock } from 'lucide-react';
import Footer from '../components/Footer';
import SupportPage from './Support';
import SEOManager from '../components/SEO/SEOManager';
import { useFinance } from '../context/FinanceContext';
import { generateMetaTags } from '../utils/seo';

const Services = () => {
  const { getTotalMemberCount } = useFinance();
  const memberCount = getTotalMemberCount();
  const [showSupport, setShowSupport] = React.useState(false);
  const seoData = generateMetaTags('services');

  const services = [
    {
      icon: <Heart className="h-12 w-12 text-red-500" />,
      title: "Warm Welcome & Orientation",
      description: "Providing a heartfelt welcome to all visitors and new members, ensuring they feel at home in God's house."
    },
    {
      icon: <Navigation className="h-12 w-12 text-blue-500" />,
      title: "Guidance & Assistance",
      description: "Offering direction and support to help congregation members navigate the church premises and services."
    },
    {
      icon: <Calendar className="h-12 w-12 text-green-500" />,
      title: "Event Coordination",
      description: "Expertly managing seating arrangements, crowd control, and logistics for all church events and services."
    },
    {
      icon: <Accessibility className="h-12 w-12 text-purple-500" />,
      title: "Accessibility & Support",
      description: "Ensuring all members, including those with special needs, can fully participate in worship services."
    },
    {
      icon: <Users className="h-12 w-12 text-indigo-500" />,
      title: "Pastoral Care Support",
      description: "Assisting pastoral team in providing care and support to congregation members during services."
    },
    {
      icon: <Shield className="h-12 w-12 text-gray-600" />,
      title: "Security & Safety",
      description: "Maintaining a safe and secure environment for all attendees during worship and special events."
    },
    {
      icon: <Coffee className="h-12 w-12 text-orange-500" />,
      title: "Hospitality Services",
      description: "Managing and serving refreshments during Love Feast services and creating comfortable spaces for fellowship and interaction."
    },
    {
      icon: <Gift className="h-12 w-12 text-teal-500" />,
      title: "Special Events Management",
      description: "Organizing and coordinating special church events, conferences, and celebration services."
    }
    ];

  const serviceImages = [
    "https://i.imgur.com/3VlHjZp.jpg",
    "https://i.imgur.com/qOT78L7.jpg",
    "https://i.imgur.com/vqBH2I0.jpg",
    "https://i.imgur.com/k5TiNla.jpg"
  ];

  const handleJoinFamily = () => {
    setShowSupport(true);
  };

  return (
    <>
      <SEOManager
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
        image={seoData.image}
        url={seoData.url}
        type="website"
      />
    <div className="min-h-screen">
      {/* Hero Section - Made Taller */}
      <section 
        className="relative h-[500px] sm:h-[600px] lg:h-[700px] bg-cover bg-center bg-no-repeat flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url("https://i.imgur.com/Q0V53H5.jpg")'
        }}
      >
        <div className="text-center text-white max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 animate-fade-in">Our Services</h1>
          <p className="text-lg sm:text-xl mb-8 animate-fade-in-delay">Excellence in Hospitality Ministry</p>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 sm:p-6 inline-block animate-fade-in-delay-2 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-center space-x-3">
              <Users className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-400" />
              <div>
                <p className="text-2xl sm:text-3xl font-bold">{memberCount}</p>
                <p className="text-xs sm:text-sm opacity-90">Serving Members</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-12 sm:py-16 bg-white dark:bg-gray-800 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8">What We Offer</h2>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            The Dunamis Ushering Department offers comprehensive hospitality services designed to create a 
            welcoming and orderly worship environment. Our dedicated team works tirelessly to ensure every 
            person who enters our church feels valued, cared for, and spiritually nourished.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-12 sm:py-16 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">Our Ministry Services</h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300">Comprehensive support for our church community</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {services.map((service, index) => (
              <div 
                key={index} 
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex justify-center mb-6 transform transition-transform duration-300 hover:scale-110">
                  {service.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4">{service.title}</h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 sm:py-16 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-800 dark:to-purple-800 text-white transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">Ready to Join Our Family?</h2>
          <p className="text-lg sm:text-xl mb-8 opacity-90">
            Become part of a ministry that makes a difference in people's lives every Sunday
          </p>
          <button 
            onClick={handleJoinFamily}
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-6 sm:py-4 sm:px-8 rounded-lg text-base sm:text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Join the Family
            <ChevronRight className="inline ml-2 h-5 w-5" />
          </button>
        </div>
      </section>

      {/* Service Images - Now 4 Pictures */}
      <section className="py-12 sm:py-16 bg-white dark:bg-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">Our Ministry in Action</h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300">See our services in action</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {serviceImages.map((image, index) => (
              <div 
                key={index} 
                className="relative overflow-hidden rounded-xl shadow-lg group transform hover:scale-105 transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <img 
                  src={image} 
                  alt={`Service ${index + 1}`}
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <p className="text-white text-lg font-semibold">Service Excellence</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Support Page Modal */}
      {showSupport && (
        <SupportPage onClose={() => setShowSupport(false)} />
      )}

      <Footer />
    </div>
    </>
  );
};

export default Services;