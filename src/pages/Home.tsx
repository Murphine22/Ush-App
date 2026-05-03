import React, { useState, useEffect } from 'react';
import { Users, Heart, Shield, HandHeart, Star, ChevronRight, Sparkles, ArrowRight, Play } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import ImageCarousel from '../components/ImageCarousel';
import AnnouncementManager from '../components/AnnouncementManager';
import Footer from '../components/Footer';
import SupportPage from './Support';
import SEOManager from '../components/SEO/SEOManager';
import { generateMetaTags } from '../utils/seo';

const Home = () => {
  const memberCount = 596;
  const [showSupport, setShowSupport] = React.useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const seoData = generateMetaTags('home');
  
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
  
  const features = [
    {
      icon: Heart,
      color: "from-pink-500 to-rose-500",
      title: "Warm Welcome",
      description: "Creating a welcoming atmosphere for all who enter God's house with genuine love and hospitality"
    },
    {
      icon: Shield,
      color: "from-blue-500 to-cyan-500",
      title: "Order & Security",
      description: "Maintaining peaceful worship environment with excellence and unwavering dedication"
    },
    {
      icon: HandHeart,
      color: "from-purple-500 to-violet-500",
      title: "Service Excellence",
      description: "Dedicated to serving with love, joy, and professionalism in every interaction"
    },
    {
      icon: Star,
      color: "from-amber-500 to-yellow-500",
      title: "Spiritual Growth",
      description: "Growing together in faith and ministry excellence as one united family"
    }
  ];

  const stats = [
    { value: "30+", label: "Years of Service", icon: Sparkles },
    { value: "596", label: "Active Members", icon: Users },
    { value: "2+", label: "Weekly Services", icon: Play },
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 overflow-x-hidden transition-colors duration-300">
      {/* Animated Background Glow */}
      <div 
        className="fixed w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] pointer-events-none transition-all duration-700 ease-out z-0"
        style={{ 
          left: mousePosition.x - 192, 
          top: mousePosition.y - 192,
        }}
      />

      {/* Hero Section - Modern Glassmorphism */}
      <motion.section 
        style={{ y: heroY, opacity: heroOpacity }}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Background with overlay */}
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110"
            style={{
              backgroundImage: `url("https://i.imgur.com/HmOjVz0.jpeg")`
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-gray-800/70 to-gray-900 dark:from-gray-950/80 dark:via-gray-900/70 dark:to-gray-950" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-blue-400/30 rounded-full"
              initial={{ 
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000), 
                y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800) 
              }}
              animate={{ 
                y: [null, -20, 20],
                opacity: [0.2, 0.5, 0.2]
              }}
              transition={{ 
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            />
          ))}
        </div>

        <div className="relative z-10 text-center max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-8"
          >
            <Sparkles className="h-4 w-4 text-yellow-400" />
            <span className="text-gray-800 dark:text-white/80 text-sm font-medium">Excellence in Service</span>
          </motion.div>

          {/* Main Title */}
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6"
          >
            <span className="bg-gradient-to-r from-gray-900 via-blue-600 to-gray-900 dark:from-white dark:via-blue-100 dark:to-white bg-clip-text text-transparent">
              Welcome to
            </span>
            <span className="block mt-2 bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
              DIGC Ushering Department
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-xl sm:text-2xl md:text-3xl text-gray-600 dark:text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed"
          >
            Serving with <span className="text-blue-400 font-semibold">Excellence</span> • 
            Walking in <span className="text-purple-400 font-semibold">Love</span> • 
            Growing in <span className="text-yellow-400 font-semibold">Faith</span>
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <motion.button 
              onClick={handleJoinFamily}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-bold text-lg rounded-2xl overflow-hidden shadow-lg shadow-yellow-500/30 transition-all duration-300"
            >
              <span className="relative z-10 flex items-center gap-2">
                Join Our Family
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.button>

            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white/10 backdrop-blur-md text-white font-semibold text-lg rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300"
            >
              Learn More
            </motion.button>
          </motion.div>

          {/* Stats Cards */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="grid grid-cols-3 gap-4 max-w-2xl mx-auto"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5, scale: 1.02 }}
                className="mt-12 bg-white/80 dark:bg-white/5 backdrop-blur-lg rounded-2xl p-4 border border-gray-200 dark:border-white/10 shadow-lg"
              >
                <stat.icon className="h-5 w-5 text-blue-400 mx-auto mb-2" />
                <p className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-xs sm:text-sm text-gray-400">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2"
          >
            <div className="w-1 h-2 bg-white/50 rounded-full" />
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Announcements Section - Modern Glass Card */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl rounded-3xl p-8 sm:p-12 border border-white/10 shadow-2xl"
          >
            <AnnouncementManager />
          </motion.div>
        </div>
      </section>

      {/* Image Carousel - Immersive Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/10 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <span className="inline-block px-4 py-2 bg-blue-500/20 rounded-full text-blue-400 text-sm font-medium mb-4">
              Gallery
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Our Ministry <span className="text-blue-400">in Action</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Witness the beauty of service and dedication
            </p>
          </motion.div>
          <ImageCarousel />
        </div>
      </section>

      {/* Features Section - Modern Cards with Hover Effects */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-2 bg-purple-500/20 rounded-full text-purple-400 text-sm font-medium mb-4">
              Core Values
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              What Makes Us <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Special</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              The pillars that guide our ministry and service
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-500"
              >
                {/* Gradient orb on hover */}
                <div className={`absolute -inset-px bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-20 rounded-2xl blur-xl transition-opacity duration-500`} />
                
                <div className="relative z-10">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 transition-all duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Modern Gradient */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Ready to Make a <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Difference</span>?
            </h2>
            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
              Join our family of dedicated ushers and become part of something extraordinary
            </p>
            <motion.button 
              onClick={handleJoinFamily}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-5 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-bold text-xl rounded-2xl shadow-xl shadow-orange-500/30 hover:shadow-orange-500/50 transition-all duration-300"
            >
              Join Our Family Today
            </motion.button>
          </motion.div>
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