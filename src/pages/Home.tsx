import React from 'react';
import { Users, Heart, Shield, HandHeart, Star, ChevronRight } from 'lucide-react';
import ImageCarousel from '../components/ImageCarousel';
import AnnouncementManager from '../components/AnnouncementManager';
import MemberSearchPortal from '../components/MemberSearchPortal';
import Footer from '../components/Footer';
import SupportPage from './Support';
import SEOManager from '../components/SEO/SEOManager';
import { useFinance } from '../context/FinanceContext';
import { generateMetaTags } from '../utils/seo';

const Home = () => {
  const { getTotalMemberCount } = useFinance();
  const memberCount = getTotalMemberCount();
  const [showSupport, setShowSupport] = React.useState(false);
  const seoData = generateMetaTags('home');
  
  const features = [
    {
      icon: <Heart className="h-8 w-8 text-red-500" />,
      title: "Warm Welcome",
      description: "Creating a welcoming atmosphere for all who enter God's house"
    },
    {
      icon: <Shield className="h-8 w-8 text-blue-500" />,
      title: "Order & Security",
      description: "Maintaining peaceful worship environment with excellence"
    },
    {
      icon: <HandHeart className="h-8 w-8 text-purple-500" />,
      title: "Service Excellence",
      description: "Dedicated to serving with love, joy, and professionalism"
    },
    {
      icon: <Star className="h-8 w-8 text-yellow-500" />,
      title: "Spiritual Growth",
      description: "Growing together in faith and ministry excellence"
    }
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
  className="relative h-[600px] sm:h-[700px] lg:h-[800px] bg-cover bg-center bg-no-repeat flex items-center justify-center overflow-hidden"
  style={{
    backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("https://i.imgur.com/HmOjVz0.jpeg")`
  }}
>


        <div className="text-center text-white max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in">
            Welcome to DIGC
            <span className="block text-yellow-400 animate-pulse">Ushering Department</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-8 animate-fade-in-delay opacity-90">
            Serving with Excellence • Walking in Love • Growing in Faith
          </p>
          <button 
            onClick={handleJoinFamily}
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-6 sm:py-4 sm:px-8 rounded-lg text-base sm:text-lg transition-all duration-300 transform hover:scale-105 animate-fade-in-delay-2 shadow-lg hover:shadow-xl"
          >
            Join Our Family
            <ChevronRight className="inline ml-2 h-5 w-5" />
          </button>
          
          {/* Member Count */}
          <div className="mt-12 bg-white/20 backdrop-blur-sm rounded-lg p-4 sm:p-6 inline-block animate-fade-in-delay-3 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-center space-x-3">
              <Users className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-400" />
              <div>
                <p className="text-2xl sm:text-3xl font-bold">{memberCount}</p>
                <p className="text-xs sm:text-sm opacity-90">Active Members</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Member Search Portal */}
      <section id="member-search-section" className="py-12 sm:py-16 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">Check Your Records</h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300">Search for your payment history and financial records</p>
          </div>
          <MemberSearchPortal />
        </div>
      </section>

      {/* Announcements Section */}
      <section className="py-12 sm:py-16 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnnouncementManager />
        </div>
      </section>

      {/* Image Carousel */}
      <section className="py-12 sm:py-16 bg-white dark:bg-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">Our Ministry in Action</h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300">Witness the beauty of our service</p>
          </div>
          <ImageCarousel />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">Our Values & Features</h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300">What makes our ushering department special</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex justify-center mb-4 transform transition-transform duration-300 hover:scale-110">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
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

export default Home;