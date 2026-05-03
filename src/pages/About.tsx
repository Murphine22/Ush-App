import React, { useState, useEffect } from 'react';
import { Users, Target, BookOpen, Award, Heart, Shield, Lightbulb, Handshake, Sparkles, TrendingUp, Clock, Globe } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import ImageCarousel from '../components/ImageCarousel';
import Footer from '../components/Footer';
import SEOManager from '../components/SEO/SEOManager';
import { generateMetaTags } from '../utils/seo';

const About = () => {
  const memberCount = 596;
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const seoData = generateMetaTags('about');

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

  const coreValues = [
    {
      icon: Award,
      color: "from-yellow-400 to-amber-500",
      title: "Excellence",
      description: "We strive for excellence in all we do, representing Christ with the highest standards of service"
    },
    {
      icon: Target,
      color: "from-blue-400 to-cyan-500",
      title: "Integrity",
      description: "Maintaining honesty and transparency in all our dealings, building trust through consistent actions"
    },
    {
      icon: BookOpen,
      color: "from-green-400 to-emerald-500",
      title: "Service",
      description: "Dedicated to serving God's people with humility, love, and a heart of genuine care"
    },
    {
      icon: Users,
      color: "from-purple-400 to-violet-500",
      title: "Unity",
      description: "Working together as one body in Christ, supporting each other in ministry and growth"
    },
    {
      icon: Heart,
      color: "from-pink-400 to-rose-500",
      title: "Compassion",
      description: "Showing genuine care and empathy to every person we encounter, reflecting God's love"
    },
    {
      icon: Shield,
      color: "from-indigo-400 to-blue-600",
      title: "Faithfulness",
      description: "Remaining steadfast and reliable in our commitment to God, His church, and His people"
    },
    {
      icon: Lightbulb,
      color: "from-orange-400 to-red-500",
      title: "Innovation",
      description: "Embracing new ideas and methods to enhance our ministry effectiveness and reach"
    },
    {
      icon: Handshake,
      color: "from-teal-400 to-cyan-500",
      title: "Partnership",
      description: "Building strong relationships and collaborating with other ministries for greater impact"
    }
  ];

  const milestones = [
    { year: "1996", event: "Department Founded", icon: Sparkles },
    { year: "2018", event: "500+ Members", icon: Users },
    { year: "2024", event: "Digital Transformation", icon: TrendingUp },
    { year: "2026", event: "596 Strong Members", icon: Globe },
  ];

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
        className="fixed w-96 h-96 bg-purple-500/20 rounded-full blur-[120px] pointer-events-none transition-all duration-700 ease-out z-0"
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
              backgroundImage: `url("https://i.imgur.com/9uLISMc.jpeg")`
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-gray-800/70 to-gray-900 dark:from-gray-950/80 dark:via-gray-900/70 dark:to-gray-950" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 text-center max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-8"
          >
            <Sparkles className="h-4 w-4 text-purple-400" />
            <span className="text-gray-800 dark:text-white/80 text-sm font-medium">Est. 1996</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6"
          >
            <span className="bg-gradient-to-r from-gray-900 via-purple-600 to-gray-900 dark:from-white dark:via-purple-100 dark:to-white bg-clip-text text-transparent">
              Our Mission
            </span>
            <span className="block mt-2 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              & Legacy
            </span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="inline-flex items-center gap-4 bg-white/10 backdrop-blur-xl rounded-2xl px-8 py-4 border border-white/20"
          >
            <Users className="h-8 w-8 sm:h-10 sm:w-10 text-yellow-400" />
            <div className="text-left">
              <p className="text-3xl sm:text-4xl font-bold text-white">{memberCount}</p>
              <p className="text-sm text-gray-300">Dedicated Members</p>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Mission Statement - Modern Card */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl p-8 sm:p-12 border border-white/10 shadow-2xl"
          >
            <div className="text-center mb-8">
              <span className="inline-block px-4 py-2 bg-purple-500/20 rounded-full text-purple-400 text-sm font-medium mb-4">
                Who We Are
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
                About Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Department</span>
              </h2>
            </div>
            
            <div className="space-y-6 text-lg text-gray-300 leading-relaxed">
              <p>
                The <span className="text-purple-400 font-semibold">Dunamis International Gospel Centre Ushering Department</span> is a dedicated ministry committed to creating a welcoming and orderly environment for all who enter God's house. Established with the vision of serving with excellence, our department has grown to become a cornerstone of the church's hospitality ministry.
              </p>
              <p>
                Our mission is to facilitate seamless worship experiences while maintaining the highest standards of professionalism, love, and spiritual excellence. We believe that every person who walks through our doors deserves to feel <span className="text-pink-400 font-semibold">welcomed</span>, <span className="text-purple-400 font-semibold">valued</span>, and <span className="text-blue-400 font-semibold">cared for</span> as part of God's family.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Timeline/Milestones */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-2 bg-pink-500/20 rounded-full text-pink-400 text-sm font-medium mb-4">
              Our Journey
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-white">
              Milestones of <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">Excellence</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-white/10 text-center group"
              >
                <div className="absolute -inset-px bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-20 rounded-2xl blur-xl transition-opacity duration-500" />
                <div className="relative z-10">
                  <milestone.icon className="h-8 w-8 text-purple-400 mx-auto mb-4" />
                  <p className="text-3xl font-bold text-white mb-1">{milestone.year}</p>
                  <p className="text-sm text-gray-400">{milestone.event}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values - Modern Cards */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-2 bg-purple-500/20 rounded-full text-purple-400 text-sm font-medium mb-4">
              Foundation
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Our Core <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Values</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              The principles that guide our ministry and shape our service
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-500"
              >
                <div className={`absolute -inset-px bg-gradient-to-r ${value.color} opacity-0 group-hover:opacity-20 rounded-2xl blur-xl transition-opacity duration-500`} />
                
                <div className="relative z-10">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${value.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <value.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 transition-all duration-300">
                    {value.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Image Carousel - Modern */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/10 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <span className="inline-block px-4 py-2 bg-pink-500/20 rounded-full text-pink-400 text-sm font-medium mb-4">
              Memories
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Our Journey <span className="text-pink-400">Together</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Moments that define our ministry and strengthen our bonds
            </p>
          </motion.div>
          <ImageCarousel />
        </div>
      </section>

      {/* Vision and Training - Modern Cards */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/10 to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Vision Card */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="group relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl p-8 sm:p-10 border border-white/10 hover:border-purple-500/30 transition-all duration-500"
            >
              <div className="absolute -inset-px bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-10 rounded-3xl blur-xl transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-6">
                  <Lightbulb className="h-7 w-7 text-white" />
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">Our Vision</h2>
                <p className="text-lg text-gray-300 leading-relaxed mb-4">
                  To be a <span className="text-purple-400 font-semibold">model ushering department</span> that sets the standard for excellence in hospitality ministry, creating an atmosphere where every person experiences the love of Christ through our service.
                </p>
                <p className="text-lg text-gray-300 leading-relaxed">
                  We envision a department where members are <span className="text-pink-400 font-semibold">equipped</span>, <span className="text-purple-400 font-semibold">empowered</span>, and <span className="text-blue-400 font-semibold">passionate</span> about serving.
                </p>
              </div>
            </motion.div>

            {/* Training Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="group relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl p-8 sm:p-10 border border-white/10 hover:border-blue-500/30 transition-all duration-500"
            >
              <div className="absolute -inset-px bg-gradient-to-r from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-10 rounded-3xl blur-xl transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-6">
                  <BookOpen className="h-7 w-7 text-white" />
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">Training & Development</h2>
                <p className="text-lg text-gray-300 leading-relaxed mb-6">
                  We believe in continuous growth and development. Our comprehensive training program includes:
                </p>
                <ul className="space-y-4">
                  {[
                    "Monthly training on customer service excellence",
                    "Spiritual development and leadership workshops",
                    "Event management and coordination training",
                    "New member orientation and mentorship"
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      <span className="text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
    </>
  );
};

export default About;