import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Phone, MapPin } from 'lucide-react';
import Footer from '../components/Footer';
import SEOManager from '../components/SEO/SEOManager';
import { generateMetaTags } from '../utils/seo';
import { motion } from 'framer-motion';

const Fashion = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const seoData = generateMetaTags('fashion');

  const uniforms = [
    {
      id: 1,
      name: 'Formal Service Attire (Black Gown)',
      image: 'https://i.imgur.com/3DwP5KR.png?auto=compress&cs=tinysrgb&w=600',
      description: 'Professional black gown for formal church services and special ceremonies'
    },
    {
      id: 2,
      name: 'Formal Service Attire (Black Gown & Red Headgear)',
      image: 'https://i.imgur.com/AJLVEBh.png',
      description: 'Elegant black gown with red headgear for Sunday worship services'
    },
    {
      id: 3,
      name: 'Formal Service Attire (Black Gown & Pink Headgear)',
      image: 'https://i.imgur.com/cwnhQlF.png',
      description: 'Professional dress with pink headgear for midweek activities'
    },
    {
      id: 4,
      name: 'Suit (Blue & Cream)',
      image: 'https://i.imgur.com/RigBE96.png',
      description: 'Distinguished formal wear for special church events and celebrations'
    },
    {
      id: 5,
      name: 'Traditional Ensemble',
      image: 'https://i.imgur.com/keqlMP8.png',
      description: 'Cultural attire reflecting our heritage and identity'
    },
    {
      id: 6,
      name: 'Formal Service Attire (Blue Gown)',
      image: 'https://i.imgur.com/VgKo8iO.png',
      description: 'Sophisticated blue gown collection for after-service events'
    },
    {
      id: 7,
      name: 'Formal/Traditional Service Attire',
      image: 'https://i.imgur.com/Zc0iFEF.png',
      description: 'Professional cante top for formal church services and special ceremonies'
    },
    {
      id: 8,
      name: 'Sunday Best',
      image: 'https://i.imgur.com/IiCXAgn.png',
      description: 'Elegant attire for regular Sunday worship services'
    },
    {
      id: 9,
      name: 'Casual Ministry',
      image: 'https://i.imgur.com/C9S4EE7.png',
      description: 'Comfortable yet professional dress for Sunday services'
    },
    {
      id: 10,
      name: 'Ceremonial Regalia',
      image: 'https://i.imgur.com/BOdLH8V.png',
      description: 'Distinguished formal wear for special church events and celebrations'
    },
    {
      id: 11,
      name: 'Traditional Ensemble II',
      image: 'https://i.imgur.com/RMq0WGu.png',
      description: 'Cultural attire reflecting our heritage and identity'
    },
    {
      id: 12,
      name: 'Evening Wear',
      image: 'https://i.imgur.com/hNGmmDm.png',
      description: 'Sophisticated collection for evening church service events'
    },
    {
      id: 13,
      name: 'Ceremonial Regalia II',
      image: 'https://i.imgur.com/ECe84Ug.png',
      description: 'Distinguished formal wear for special church events and celebrations'
    },
    {
      id: 14,
      name: 'Corporate Outfit',
      image: 'https://i.imgur.com/ODtEpq0.png',
      description: 'Professional corporate attire for official department functions'
    },
    {
      id: 15,
      name: 'Casual Wear',
      image: 'https://i.imgur.com/wuuU0o1.png',
      description: 'Sophisticated casual collection for informal service events'
    }
  ];

  const nextSlide = () => {
    setSelectedIndex((prev) => (prev + 1) % uniforms.length);
  };

  const prevSlide = () => {
    setSelectedIndex((prev) => (prev - 1 + uniforms.length) % uniforms.length);
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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 dark:bg-gray-900">
        {/* Hero Section */}
        <section className="relative pt-32 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
            <div className="absolute top-40 right-10 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-2000"></div>
          </div>

          <div className="relative max-w-7xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-blue-400 via-blue-300 to-cyan-400 bg-clip-text text-transparent mb-6"
            >
              Uniform Lookbook
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl sm:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto"
            >
              Explore our elegant departmental uniform collection designed for excellence and grace
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="inline-block px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full text-white font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300"
            >
              {uniforms.length} Collections
            </motion.div>
          </div>
        </section>

        {/* Main Carousel Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            {/* Main Image Display with Hover Expansion */}
            <motion.div
              layout
              className="relative group mb-12"
              onMouseEnter={() => setHoveredCard(selectedIndex)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <motion.div
                initial={{ scale: 1 }}
                animate={{ scale: hoveredCard === selectedIndex ? 1.05 : 1 }}
                transition={{ duration: 0.3 }}
                className="relative rounded-2xl overflow-hidden shadow-2xl"
              >
                <div className="relative h-96 sm:h-[500px] lg:h-[600px] overflow-hidden rounded-2xl">
                  <motion.img
                    key={uniforms[selectedIndex].id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5 }}
                    src={uniforms[selectedIndex].image}
                    alt={uniforms[selectedIndex].name}
                    className="w-full h-full object-cover"
                  />

                  {/* Dark overlay for better text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>

                  {/* Title and Description Overlay */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="absolute bottom-0 left-0 right-0 p-8 sm:p-12 text-white"
                  >
                    <h2 className="text-4xl sm:text-5xl font-bold mb-3">{uniforms[selectedIndex].name}</h2>
                    <p className="text-lg sm:text-xl text-gray-200">{uniforms[selectedIndex].description}</p>
                  </motion.div>

                  {/* Counter */}
                  <div className="absolute top-6 right-6 bg-black/50 backdrop-blur-sm rounded-full px-6 py-3 text-white font-semibold">
                    {selectedIndex + 1} / {uniforms.length}
                  </div>
                </div>
              </motion.div>

              {/* Navigation Arrows */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={prevSlide}
                className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 p-3 rounded-full shadow-lg z-20 transition-all duration-300 group-hover:left-8"
              >
                <ChevronLeft className="h-6 w-6" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={nextSlide}
                className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 p-3 rounded-full shadow-lg z-20 transition-all duration-300 group-hover:right-8"
              >
                <ChevronRight className="h-6 w-6" />
              </motion.button>
            </motion.div>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4 mb-12">
              {uniforms.map((uniform, index) => (
                <motion.button
                  key={uniform.id}
                  onClick={() => setSelectedIndex(index)}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative rounded-lg overflow-hidden cursor-pointer transition-all duration-300 h-24 sm:h-28 ${
                    selectedIndex === index ? 'ring-4 ring-blue-400 shadow-lg shadow-blue-500/50' : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={uniform.image}
                    alt={uniform.name}
                    className="w-full h-full object-cover"
                  />
                  <div className={`absolute inset-0 ${selectedIndex === index ? 'bg-transparent' : 'bg-black/40'} transition-all duration-300`}></div>
                </motion.button>
              ))}
            </div>

            {/* Department Head Information */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-gradient-to-r from-blue-900/40 to-cyan-900/40 backdrop-blur-md rounded-2xl p-8 border border-blue-500/30"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div>
                  <p className="text-blue-300 text-sm font-semibold uppercase tracking-wider mb-2">Head of Department</p>
                  <h3 className="text-3xl sm:text-4xl font-bold text-white mb-4">Engr Abraham Oshiomah</h3>
                  <div className="flex flex-col sm:flex-row gap-6">
                    <div className="flex items-center gap-3 text-gray-300">
                      <Phone className="h-5 w-5 text-blue-400" />
                      <span className="text-lg">+234 803 634 7730</span>
                    </div>
                  </div>
                </div>
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center flex-shrink-0 shadow-lg"
                >
                  <div className="text-4xl sm:text-5xl">👔</div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-black/30">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-white text-center mb-12">Why Our Uniforms Matter</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Professional Excellence',
                  description: 'Our uniforms reflect the dignity and professionalism of our ushering department'
                },
                {
                  title: 'Unity & Identity',
                  description: 'Every uniform showcases our collective commitment to service and belonging'
                },
                {
                  title: 'Elegant Design',
                  description: 'Carefully curated styles that balance tradition with contemporary fashion'
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl p-8 border border-blue-400/30 hover:border-blue-400/60 transition-all duration-300"
                >
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-300">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default Fashion;
