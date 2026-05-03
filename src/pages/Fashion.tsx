import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Phone, Maximize2, X, Play, Pause } from 'lucide-react';
import Footer from '../components/Footer';
import SEOManager from '../components/SEO/SEOManager';
import { generateMetaTags } from '../utils/seo';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';

const Fashion = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const seoData = generateMetaTags('fashion');

  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Compressed image URLs for better loading
  const uniforms = [
    {
      id: 1,
      name: 'Classic Black Gown',
      image: 'https://i.imgur.com/3DwP5KR.png',
      thumb: 'https://i.imgur.com/3DwP5KR.png?w=400',
      description: 'Elegant flowing black ceremonial gown for formal church services and special occasions'
    },
    {
      id: 2,
      name: 'Regal Red Accent Gown',
      image: 'https://i.imgur.com/AJLVEBh.png',
      thumb: 'https://i.imgur.com/AJLVEBh.png?w=400',
      description: 'Stunning black gown adorned with vibrant red headgear, perfect for Sunday worship celebrations'
    },
    {
      id: 3,
      name: 'Graceful Pink Rose Gown',
      image: 'https://i.imgur.com/cwnhQlF.png',
      thumb: 'https://i.imgur.com/cwnhQlF.png?w=400',
      description: 'Beautiful black gown complemented with soft pink headgear for midweek services and fellowship'
    },
    {
      id: 4,
      name: 'Navy Blue Executive Suit',
      image: 'https://i.imgur.com/RigBE96.png',
      thumb: 'https://i.imgur.com/RigBE96.png?w=400',
      description: 'Sophisticated navy and cream tailored suit for male ushers at formal church events'
    },
    {
      id: 5,
      name: 'Vibrant Cultural Wrapper',
      image: 'https://i.imgur.com/keqlMP8.png',
      thumb: 'https://i.imgur.com/keqlMP8.png?w=400',
      description: 'Colorful traditional ensemble celebrating our rich African heritage and cultural identity'
    },
    {
      id: 6,
      name: 'Royal Blue Velvet Gown',
      image: 'https://i.imgur.com/VgKo8iO.png',
      thumb: 'https://i.imgur.com/VgKo8iO.png?w=400',
      description: 'Majestic deep blue velvet gown exuding elegance and dignity during special ceremonies'
    },
    {
      id: 7,
      name: 'Pristine White Sunday Dress',
      image: 'https://i.imgur.com/Zc0iFEF.png',
      thumb: 'https://i.imgur.com/Zc0iFEF.png?w=400',
      description: 'Radiant white flowing attire symbolizing purity and grace for Sunday morning worship'
    },
    {
      id: 8,
      name: 'Elegant Cream Lace Attire',
      image: 'https://i.imgur.com/IiCXAgn.png',
      thumb: 'https://i.imgur.com/IiCXAgn.png?w=400',
      description: 'Delicate cream lace ensemble with intricate patterns for festive church celebrations'
    },
    {
      id: 9,
      name: 'Midnight Black Ceremonial',
      image: 'https://i.imgur.com/C9S4EE7.png',
      thumb: 'https://i.imgur.com/C9S4EE7.png?w=400',
      description: 'Timeless midnight black formal wear representing solemnity and reverence during holy services'
    },
    {
      id: 10,
      name: 'Crimson Crown Elegance',
      image: 'https://i.imgur.com/BOdLH8V.png',
      thumb: 'https://i.imgur.com/BOdLH8V.png?w=400',
      description: 'Striking black gown paired with bold crimson head wrap for high-profile church occasions'
    },
    {
      id: 11,
      name: 'Blush Pink Pearl Gown',
      image: 'https://i.imgur.com/RMq0WGu.png',
      thumb: 'https://i.imgur.com/RMq0WGu.png?w=400',
      description: 'Charming black gown with blush pink accessories, ideal for women fellowship gatherings'
    },
    {
      id: 12,
      name: 'Distinguished Gentleman Suit',
      image: 'https://i.imgur.com/hNGmmDm.png',
      thumb: 'https://i.imgur.com/hNGmmDm.png?w=400',
      description: 'Sharp two-tone blue and cream suit showcasing professionalism and masculine elegance'
    },
    {
      id: 13,
      name: 'Ankara Heritage Collection',
      image: 'https://i.imgur.com/ECe84Ug.png',
      thumb: 'https://i.imgur.com/ECe84Ug.png?w=400',
      description: 'Vibrant Ankara print attire celebrating Nigerian culture during special thanksgiving services'
    },
    {
      id: 14,
      name: 'Sapphire Blue Evening Gown',
      image: 'https://i.imgur.com/ODtEpq0.png',
      thumb: 'https://i.imgur.com/ODtEpq0.png?w=400',
      description: 'Luxurious sapphire blue flowing gown for evening vigils and night-time church events'
    },
    {
      id: 15,
      name: 'Golden Ivory Sunday Best',
      image: 'https://i.imgur.com/wuuU0o1.png',
      thumb: 'https://i.imgur.com/wuuU0o1.png?w=400',
      description: 'Exquisite ivory and gold detailed attire reserved for our finest Sunday worship presentations'
    }
  ];

  const nextSlide = useCallback(() => {
    setSelectedIndex((prev) => (prev + 1) % uniforms.length);
  }, [uniforms.length]);

  const prevSlide = useCallback(() => {
    setSelectedIndex((prev) => (prev - 1 + uniforms.length) % uniforms.length);
  }, [uniforms.length]);

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 4000);
    return () => clearInterval(interval);
  }, [isPlaying, nextSlide]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'Escape') setIsFullscreen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  // Touch swipe handling
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? nextSlide() : prevSlide();
    }
    setTouchStart(null);
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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 overflow-x-hidden transition-colors duration-300">
        {/* Animated Background Glow */}
        <div 
          className="fixed w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] pointer-events-none transition-all duration-700 ease-out z-0"
          style={{ 
            left: mousePosition.x - 192, 
            top: mousePosition.y - 192,
          }}
        />

        {/* Hero Section - Modern with Parallax */}
        <motion.section 
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative min-h-[60vh] flex items-center justify-center overflow-hidden"
        >
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-b from-gray-900/90 via-gray-800/80 to-gray-900 dark:from-gray-950/90 dark:via-gray-900/80 dark:to-gray-950" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/30 via-purple-900/10 to-transparent" />
          </div>

          {/* Floating Particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-blue-400/40 rounded-full"
                initial={{ 
                  x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000), 
                  y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 600) 
                }}
                animate={{ 
                  y: [null, -30, 30],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{ 
                  duration: 4 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2
                }}
              />
            ))}
          </div>

          <div className="relative z-10 text-center max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 backdrop-blur-md rounded-full border border-blue-500/30 text-blue-300 text-sm font-medium mb-8"
            >
              <span className="text-gray-800 dark:text-white/80 text-sm font-medium">{uniforms.length} Collections Available</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6"
            >
              <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-purple-600 dark:from-blue-400 dark:via-cyan-300 dark:to-purple-400 bg-clip-text text-transparent">
                Uniform Lookbook
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-xl sm:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
            >
              Elegant departmental attire showcasing <span className="text-blue-400 font-semibold">excellence</span>, <span className="text-cyan-400 font-semibold">unity</span>, and <span className="text-purple-400 font-semibold">grace</span> in service
            </motion.p>
          </div>
        </motion.section>

        {/* Modern Carousel Section */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/10 to-transparent pointer-events-none" />
          <div className="max-w-7xl mx-auto relative z-10">
            {/* Main Carousel Container */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="relative bg-gray-800/50 backdrop-blur-xl rounded-3xl p-4 sm:p-6 border border-gray-700/50 shadow-2xl"
            >
              {/* Top Controls */}
              <div className="flex items-center justify-between mb-4 px-2">
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 text-sm font-medium">
                    {selectedIndex + 1} <span className="text-gray-600">/</span> {uniforms.length}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-2 rounded-full bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 transition-all"
                    title={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => setIsFullscreen(true)}
                    className="p-2 rounded-full bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 transition-all"
                    title="Fullscreen"
                  >
                    <Maximize2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Main Image Display */}
              <div
                className="relative aspect-[4/3] sm:aspect-[16/9] lg:aspect-[2/1] rounded-2xl overflow-hidden bg-gray-900"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedIndex}
                    initial={{ opacity: 0, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                    className="absolute inset-0"
                  >
                    <img
                      src={uniforms[selectedIndex].image}
                      alt={uniforms[selectedIndex].name}
                      className="w-full h-full object-contain bg-gray-800"
                      loading="lazy"
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Gradient Overlays */}
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none"></div>
                <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black/30 to-transparent pointer-events-none"></div>
                <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black/30 to-transparent pointer-events-none"></div>

                {/* Navigation Arrows */}
                <button
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>

                {/* Image Info Overlay */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="absolute bottom-0 left-0 right-0 p-6 sm:p-8"
                >
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
                    {uniforms[selectedIndex].name}
                  </h2>
                  <p className="text-gray-300 text-base sm:text-lg max-w-2xl">
                    {uniforms[selectedIndex].description}
                  </p>
                </motion.div>

                {/* Progress Bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gray-700/50">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-400 to-cyan-400"
                    initial={{ width: '0%' }}
                    animate={{ width: isPlaying ? '100%' : '0%' }}
                    transition={{ duration: 4, ease: 'linear' }}
                    key={selectedIndex + (isPlaying ? '-playing' : '-paused')}
                  />
                </div>
              </div>

              {/* Progress Dots */}
              <div className="flex justify-center gap-2 mt-6 flex-wrap">
                {uniforms.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedIndex(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      selectedIndex === index
                        ? 'w-8 bg-gradient-to-r from-blue-400 to-cyan-400'
                        : 'w-2 bg-gray-600 hover:bg-gray-500'
                    }`}
                  />
                ))}
              </div>
            </motion.div>

            {/* Modern Thumbnail Strip */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-6"
            >
              <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-4 border border-gray-700/30">
                <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
                  {uniforms.map((uniform, index) => (
                    <motion.button
                      key={uniform.id}
                      onClick={() => setSelectedIndex(index)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`relative flex-shrink-0 w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden transition-all duration-300 ${
                        selectedIndex === index
                          ? 'ring-2 ring-blue-400 ring-offset-2 ring-offset-gray-900'
                          : 'opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={uniform.thumb}
                        alt={uniform.name}
                        className="w-full h-full object-contain bg-gray-700"
                        loading="lazy"
                      />
                      {selectedIndex === index && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="absolute inset-0 bg-gradient-to-t from-blue-500/40 to-transparent"
                        />
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Department Head Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-8 bg-gradient-to-r from-blue-900/30 to-cyan-900/30 backdrop-blur-lg rounded-2xl p-6 sm:p-8 border border-blue-500/20"
            >
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/30">
                  <span className="text-4xl">👔</span>
                </div>
                <div className="text-center sm:text-left flex-1">
                  <p className="text-blue-400 text-sm font-semibold uppercase tracking-wider mb-1">Head of Uniform Unit</p>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">Bro Tony  Ekong</h3>
                  <div className="flex flex-col sm:flex-row items-center gap-4 text-gray-300">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-blue-400" />
                      <span>+234 803 651 6964</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Quick Stats Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10" />
          <div className="max-w-5xl mx-auto relative z-10">
            <div className="grid grid-cols-3 gap-6">
              {[
                { value: "15", label: "Collections", color: "from-blue-400 to-cyan-400" },
                { value: "100%", label: "Quality", color: "from-green-400 to-emerald-400" },
                { value: "30+", label: "Years", color: "from-purple-400 to-pink-400" },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-white/10 text-center group overflow-hidden"
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                  <p className="text-3xl sm:text-4xl font-bold text-white mb-2">{stat.value}</p>
                  <p className="text-sm text-gray-400">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <Footer />

        {/* Fullscreen Modal - Enhanced */}
        <AnimatePresence>
          {isFullscreen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center"
              onClick={() => setIsFullscreen(false)}
            >
              {/* Close Button */}
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                onClick={(e) => { e.stopPropagation(); setIsFullscreen(false); }}
                className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all z-10 backdrop-blur-md border border-white/20"
              >
                <X className="h-6 w-6" />
              </motion.button>

              {/* Navigation Arrows */}
              <button
                onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-all duration-300 hover:scale-110 z-10"
              >
                <ChevronLeft className="h-8 w-8" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-all duration-300 hover:scale-110 z-10"
              >
                <ChevronRight className="h-8 w-8" />
              </button>

              {/* Image */}
              <motion.img
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                src={uniforms[selectedIndex].image}
                alt={uniforms[selectedIndex].name}
                className="max-w-[90vw] max-h-[85vh] object-contain rounded-2xl"
                onClick={(e) => e.stopPropagation()}
              />

              {/* Info Overlay */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="absolute bottom-8 left-0 right-0 text-center px-4"
              >
                <div className="inline-block bg-black/50 backdrop-blur-xl rounded-2xl px-8 py-4 border border-white/10">
                  <h3 className="text-2xl font-bold text-white mb-1">{uniforms[selectedIndex].name}</h3>
                  <p className="text-gray-300">{uniforms[selectedIndex].description}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {selectedIndex + 1} / {uniforms.length}
                  </p>
                </div>
              </motion.div>

              {/* Thumbnails */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="absolute bottom-28 left-1/2 -translate-x-1/2 flex gap-2"
              >
                {uniforms.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => { e.stopPropagation(); setSelectedIndex(index); }}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      selectedIndex === index
                        ? 'w-6 bg-gradient-to-r from-blue-400 to-cyan-400'
                        : 'bg-white/30 hover:bg-white/50'
                    }`}
                  />
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default Fashion;
