import React from 'react';
import { Users, Target, BookOpen, Award, Heart, Shield, Lightbulb, Handshake } from 'lucide-react';
import ImageCarousel from '../components/ImageCarousel';
import Footer from '../components/Footer';
import { useFinance } from '../context/FinanceContext';

const About = () => {
  const { getTotalMemberCount } = useFinance();
  const memberCount = getTotalMemberCount();

  const coreValues = [
    {
      icon: <Award className="h-8 w-8 text-yellow-500" />,
      title: "Excellence",
      description: "We strive for excellence in all we do, representing Christ with the highest standards"
    },
    {
      icon: <Target className="h-8 w-8 text-blue-500" />,
      title: "Integrity",
      description: "Maintaining honesty and transparency in all our dealings and relationships"
    },
    {
      icon: <BookOpen className="h-8 w-8 text-green-500" />,
      title: "Service",
      description: "Dedicated to serving God's people with humility and love"
    },
    {
      icon: <Users className="h-8 w-8 text-purple-500" />,
      title: "Unity",
      description: "Working together as one body, supporting each other in ministry"
    },
    {
      icon: <Heart className="h-8 w-8 text-red-500" />,
      title: "Compassion",
      description: "Showing genuine care and empathy to every person we encounter"
    },
    {
      icon: <Shield className="h-8 w-8 text-indigo-500" />,
      title: "Faithfulness",
      description: "Remaining steadfast and reliable in our commitment to God and His people"
    },
    {
      icon: <Lightbulb className="h-8 w-8 text-orange-500" />,
      title: "Innovation",
      description: "Embracing new ideas and methods to enhance our ministry effectiveness"
    },
    {
      icon: <Handshake className="h-8 w-8 text-teal-500" />,
      title: "Partnership",
      description: "Building strong relationships and collaborating with other ministries"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section - Made Taller */}
      <section 
        className="relative h-[500px] sm:h-[600px] lg:h-[700px] bg-cover bg-center bg-no-repeat flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url("https://i.imgur.com/9uLISMc.jpeg")'
        }}
      >
        <div className="text-center text-white max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 animate-fade-in">Our Mission & Legacy</h1>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 sm:p-6 inline-block animate-fade-in-delay transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-center space-x-3">
              <Users className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-400" />
              <div>
                <p className="text-2xl sm:text-3xl font-bold">{memberCount}</p>
                <p className="text-xs sm:text-sm opacity-90">Dedicated Members</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-12 sm:py-16 bg-white dark:bg-gray-800 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8">About Our Ushering Department</h2>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6 sm:mb-8">
            The Dunamis International Gospel Centre Ushering Department is a dedicated ministry committed to creating 
            a welcoming and orderly environment for all who enter God's house. Established with the vision of serving 
            with excellence, our department has grown to become a cornerstone of the church's hospitality ministry.
          </p>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            Our mission is to facilitate seamless worship experiences while maintaining the highest standards of 
            professionalism, love, and spiritual excellence. We believe that every person who walks through our 
            doors deserves to feel welcomed, valued, and cared for as part of God's family.
          </p>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-12 sm:py-16 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">Our Core Values</h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300">The principles that guide our ministry</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {coreValues.map((value, index) => (
              <div 
                key={index} 
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex justify-center mb-4 transform transition-transform duration-300 hover:scale-110">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{value.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Image Carousel */}
      <section className="py-12 sm:py-16 bg-white dark:bg-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">Our Journey Together</h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300">Moments that define our ministry</p>
          </div>
          <ImageCarousel />
        </div>
      </section>

      {/* Vision and Training */}
      <section className="py-12 sm:py-16 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            <div className="animate-fade-in">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">Our Vision</h2>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                To be a model ushering department that sets the standard for excellence in hospitality ministry, 
                creating an atmosphere where every person experiences the love of Christ through our service.
              </p>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                We envision a department where members are equipped, empowered, and passionate about serving, 
                contributing to the overall growth and impact of Dunamis International Gospel Centre.
              </p>
            </div>
            
            <div className="animate-fade-in-delay">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">Training & Development</h2>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                We believe in continuous growth and development. Our comprehensive training program includes:
              </p>
              <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                <li className="flex items-start">
                  <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5 flex-shrink-0">1</span>
                  <span>Monthly training sessions on customer service excellence</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5 flex-shrink-0">2</span>
                  <span>Spiritual development and leadership workshops</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5 flex-shrink-0">3</span>
                  <span>Event management and coordination training</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5 flex-shrink-0">4</span>
                  <span>New member orientation and mentorship programs</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;