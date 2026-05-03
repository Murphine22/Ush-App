import React, { useState, useEffect } from 'react';
import { Users, Heart, Navigation, Calendar, Accessibility, Users as UsersIcon, Shield, Coffee, Gift, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Footer from '../components/Footer';
import SupportPage from './Support';
import SEOManager from '../components/SEO/SEOManager';
import { generateMetaTags } from '../utils/seo';

const Services = () => {
  const memberCount = 596;
  const [showSupport, setShowSupport] = React.useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoveredService, setHoveredService] = useState<number | null>(null);
  const seoData = generateMetaTags('services');

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

  const services = [
    {
      icon: Heart,
      color: "from-rose-400 to-red-500",
      title: "Warm Welcome & Orientation",
      description: "Providing a heartfelt welcome to all visitors and new members, ensuring they feel at home in God's house from the moment they arrive."
    },
    {
      icon: Navigation,
      color: "from-blue-400 to-cyan-500",
      title: "Guidance & Assistance",
      description: "Offering direction and support to help congregation members navigate the church premises and services with ease and comfort."
    },
    {
      icon: Calendar,
      color: "from-green-400 to-emerald-500",
      title: "Event Coordination",
      description: "Expertly managing seating arrangements, crowd control, and logistics for all church events and services with precision."
    },
    {
      icon: Accessibility,
      color: "from-purple-400 to-violet-500",
      title: "Accessibility & Support",
      description: "Ensuring all members, including those with special needs, can fully participate in worship services without barriers."
    },
    {
      icon: UsersIcon,
      color: "from-indigo-400 to-blue-600",
      title: "Pastoral Care Support",
      description: "Assisting pastoral team in providing care and support to congregation members during services and special moments."
    },
    {
      icon: Shield,
      color: "from-gray-400 to-slate-500",
      title: "Security & Safety",
      description: "Maintaining a safe and secure environment for all attendees during worship and special events with vigilance."
    },
    {
      icon: Coffee,
      color: "from-orange-400 to-amber-500",
      title: "Hospitality Services",
      description: "Managing and serving refreshments during Love Feast services and creating comfortable spaces for fellowship."
    },
    {
      icon: Gift,
      color: "from-teal-400 to-cyan-500",
      title: "Special Events Management",
      description: "Organizing and coordinating special church events, conferences, and celebration services with excellence."
    }
  ];

  const stats = [
    { value: "50+", label: "Services Monthly", color: "from-blue-400 to-cyan-400" },
    { value: "100%", label: "Commitment", color: "from-green-400 to-emerald-400" },
    { value: "15+", label: "Years Experience", color: "from-purple-400 to-pink-400" },
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 overflow-x-hidden transition-colors duration-300">
      {/* Animated Background Glow */}
      <div 
        className="fixed w-96 h-96 bg-teal-500/20 rounded-full blur-[120px] pointer-events-none transition-all duration-700 ease-out z-0"
        style={{ 
          left: mousePosition.x - 192, 
          top: mousePosition.y - 192,
        }}
      />

      {/* Hero Section - Modern Glassmorphism */}
      <motion.section 
        style={{ y: heroY, opacity: heroOpacity }}
        className="relative min-h-[80vh] flex items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110"
            style={{
              backgroundImage: `url("https://i.imgur.com/Q0V53H5.jpg")`
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-gray-800/70 to-gray-900 dark:from-gray-950/80 dark:via-gray-900/70 dark:to-gray-950" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-teal-900/20 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 text-center max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 dark:bg-gray-800/10 backdrop-blur-md rounded-full border border-white/20 dark:border-gray-800/20 mb-8"
          >
            <Sparkles className="h-4 w-4 text-teal-400" />
            <span className="text-gray-800 dark:text-white/80 text-sm font-medium">Excellence in Service</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6"
          >
            <span className="bg-gradient-to-r from-gray-900 via-teal-600 to-gray-900 dark:from-white dark:via-teal-100 dark:to-white bg-clip-text text-transparent">
              Our Services
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-xl sm:text-2xl md:text-3xl text-gray-300 mb-10"
          >
            Excellence in <span className="text-teal-400 font-semibold">Hospitality Ministry</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="inline-flex items-center gap-4 bg-white/10 backdrop-blur-xl rounded-2xl px-8 py-4 border border-white/20"
          >
            <Users className="h-8 w-8 sm:h-10 sm:w-10 text-yellow-400" />
            <div className="text-left">
              <p className="text-3xl sm:text-4xl font-bold text-white">{memberCount}</p>
              <p className="text-sm text-gray-300">Serving Members</p>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* What We Offer - Modern Card */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-teal-900/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl p-8 sm:p-12 border border-white/10 shadow-2xl"
          >
            <div className="text-center mb-8">
              <span className="inline-block px-4 py-2 bg-teal-500/20 rounded-full text-teal-400 text-sm font-medium mb-4">
                Comprehensive Care
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
                What We <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400">Offer</span>
              </h2>
            </div>
            
            <p className="text-lg text-gray-300 leading-relaxed text-center">
              The <span className="text-teal-400 font-semibold">Dunamis Ushering Department</span> offers comprehensive hospitality services designed to create a welcoming and orderly worship environment. Our dedicated team works tirelessly to ensure every person who enters our church feels <span className="text-cyan-400 font-semibold">valued</span>, <span className="text-teal-400 font-semibold">cared for</span>, and <span className="text-green-400 font-semibold">spiritually nourished</span>.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-3 gap-6">
            {stats.map((stat, index) => (
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

      {/* Services Grid - Modern Interactive Cards */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-900/20 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-2 bg-teal-500/20 rounded-full text-teal-400 text-sm font-medium mb-4">
              Ministry Services
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Comprehensive <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400">Support</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Everything we do to serve our church community with excellence
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onMouseEnter={() => setHoveredService(index)}
                onMouseLeave={() => setHoveredService(null)}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-500 overflow-hidden"
              >
                {/* Animated gradient background on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                
                {/* Number indicator */}
                <div className="absolute top-4 right-4 text-5xl font-bold text-white/5 group-hover:text-white/10 transition-all duration-500">
                  {String(index + 1).padStart(2, '0')}
                </div>
                
                <div className="relative z-10">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <service.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 transition-all duration-300">
                    {service.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {service.description}
                  </p>
                  
                  {/* Learn more link */}
                  <div className={`mt-4 flex items-center gap-2 text-sm font-medium text-teal-400 transition-all duration-300 ${hoveredService === index ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`}>
                    <span>Learn more</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action - Modern */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-600/30 via-blue-600/30 to-purple-600/30" />
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
              Ready to Join Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Family</span>?
            </h2>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Become part of a ministry that makes a difference in people's lives every Sunday
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.button 
                onClick={handleJoinFamily}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group px-10 py-5 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-bold text-xl rounded-2xl shadow-xl shadow-orange-500/30 hover:shadow-orange-500/50 transition-all duration-300 flex items-center gap-3"
              >
                <span>Join the Family</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </div>

            {/* Trust indicators */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-gray-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-400" />
                <span className="text-sm">No experience needed</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-400" />
                <span className="text-sm">Full training provided</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-400" />
                <span className="text-sm">Join 596+ members</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Service Images - Modern Gallery */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-teal-900/10 to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <span className="inline-block px-4 py-2 bg-teal-500/20 rounded-full text-teal-400 text-sm font-medium mb-4">
              Gallery
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Our Ministry <span className="text-teal-400">in Action</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              See our dedicated team serving with excellence
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {serviceImages.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group relative overflow-hidden rounded-2xl shadow-lg"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img 
                    src={image} 
                    alt={`Service ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <div>
                    <p className="text-white font-bold text-lg">Service Excellence</p>
                    <p className="text-gray-300 text-sm">In action</p>
                  </div>
                </div>
                <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white text-sm font-bold">
                  {index + 1}
                </div>
              </motion.div>
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