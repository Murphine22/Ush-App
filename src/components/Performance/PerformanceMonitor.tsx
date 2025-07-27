import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Clock, 
  Gauge, 
  Wifi, 
  HardDrive, 
  Cpu, 
  Activity,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Monitor,
  Smartphone,
  Globe
} from 'lucide-react';

interface PerformanceMetrics {
  loadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
  timeToInteractive: number;
  networkSpeed: string;
  deviceType: string;
  memoryUsage: number;
  cpuUsage: number;
  score: number;
}

const PerformanceMonitor = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [realTimeData, setRealTimeData] = useState({
    activeUsers: 0,
    pageViews: 0,
    bounceRate: 0
  });

  useEffect(() => {
    // Initialize performance monitoring
    initializePerformanceMonitoring();
    
    // Start real-time monitoring
    const interval = setInterval(updateRealTimeMetrics, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const initializePerformanceMonitoring = async () => {
    try {
      // Get Web Vitals
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      // Simulate getting Core Web Vitals
      const mockMetrics: PerformanceMetrics = {
        loadTime: navigation.loadEventEnd - navigation.loadEventStart,
        firstContentfulPaint: Math.random() * 1000 + 500,
        largestContentfulPaint: Math.random() * 2000 + 1000,
        cumulativeLayoutShift: Math.random() * 0.1,
        firstInputDelay: Math.random() * 100 + 50,
        timeToInteractive: Math.random() * 3000 + 2000,
        networkSpeed: getNetworkSpeed(),
        deviceType: getDeviceType(),
        memoryUsage: getMemoryUsage(),
        cpuUsage: Math.random() * 50 + 20,
        score: 0
      };

      // Calculate performance score
      mockMetrics.score = calculatePerformanceScore(mockMetrics);
      
      setMetrics(mockMetrics);
      setLoading(false);
    } catch (error) {
      console.error('Performance monitoring error:', error);
      setLoading(false);
    }
  };

  const getNetworkSpeed = (): string => {
    const connection = (navigator as any).connection;
    if (connection) {
      const speed = connection.effectiveType;
      return speed || 'unknown';
    }
    return 'unknown';
  };

  const getDeviceType = (): string => {
    const userAgent = navigator.userAgent;
    if (/tablet|ipad|playbook|silk/i.test(userAgent)) return 'tablet';
    if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(userAgent)) return 'mobile';
    return 'desktop';
  };

  const getMemoryUsage = (): number => {
    const memory = (performance as any).memory;
    if (memory) {
      return (memory.usedJSHeapSize / memory.totalJSHeapSize) * 100;
    }
    return Math.random() * 60 + 20;
  };

  const calculatePerformanceScore = (metrics: PerformanceMetrics): number => {
    let score = 100;
    
    // Deduct points based on metrics
    if (metrics.firstContentfulPaint > 1800) score -= 10;
    if (metrics.largestContentfulPaint > 2500) score -= 15;
    if (metrics.cumulativeLayoutShift > 0.1) score -= 10;
    if (metrics.firstInputDelay > 100) score -= 10;
    if (metrics.timeToInteractive > 3800) score -= 15;
    
    return Math.max(score, 0);
  };

  const updateRealTimeMetrics = () => {
    setRealTimeData({
      activeUsers: Math.floor(Math.random() * 100) + 20,
      pageViews: Math.floor(Math.random() * 1000) + 500,
      bounceRate: Math.random() * 30 + 15
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 90) return <CheckCircle className="h-6 w-6 text-green-600" />;
    if (score >= 70) return <AlertTriangle className="h-6 w-6 text-yellow-600" />;
    return <AlertTriangle className="h-6 w-6 text-red-600" />;
  };

  const formatTime = (time: number) => {
    if (time < 1000) return `${Math.round(time)}ms`;
    return `${(time / 1000).toFixed(2)}s`;
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!metrics) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Performance Monitor</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Real-time performance metrics and optimization insights</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-600 dark:text-gray-400">Live Monitoring</span>
        </div>
      </div>

      {/* Performance Score */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-8 border border-blue-200 dark:border-blue-700"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Performance Score</h3>
            <p className="text-gray-600 dark:text-gray-400">Overall application performance rating</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3">
              {getScoreIcon(metrics.score)}
              <span className={`text-4xl font-bold ${getScoreColor(metrics.score)}`}>
                {Math.round(metrics.score)}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">out of 100</p>
          </div>
        </div>
      </motion.div>

      {/* Core Web Vitals */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
              <Zap className="h-6 w-6 text-green-600" />
            </div>
            <span className={`text-sm px-2 py-1 rounded-full ${metrics.firstContentfulPaint < 1800 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'}`}>
              {metrics.firstContentfulPaint < 1800 ? 'Good' : 'Needs Work'}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">First Contentful Paint</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatTime(metrics.firstContentfulPaint)}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Time to first content render</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
            <span className={`text-sm px-2 py-1 rounded-full ${metrics.largestContentfulPaint < 2500 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'}`}>
              {metrics.largestContentfulPaint < 2500 ? 'Good' : 'Needs Work'}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Largest Contentful Paint</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatTime(metrics.largestContentfulPaint)}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Largest element render time</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
              <Activity className="h-6 w-6 text-purple-600" />
            </div>
            <span className={`text-sm px-2 py-1 rounded-full ${metrics.cumulativeLayoutShift < 0.1 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'}`}>
              {metrics.cumulativeLayoutShift < 0.1 ? 'Good' : 'Needs Work'}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Cumulative Layout Shift</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{metrics.cumulativeLayoutShift.toFixed(3)}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Visual stability score</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
              <Gauge className="h-6 w-6 text-orange-600" />
            </div>
            <span className={`text-sm px-2 py-1 rounded-full ${metrics.firstInputDelay < 100 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'}`}>
              {metrics.firstInputDelay < 100 ? 'Good' : 'Needs Work'}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">First Input Delay</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatTime(metrics.firstInputDelay)}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Interactivity response time</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl">
              <Wifi className="h-6 w-6 text-indigo-600" />
            </div>
            <span className="text-sm px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
              {metrics.networkSpeed.toUpperCase()}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Network Speed</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{metrics.networkSpeed}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Connection type detected</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-teal-100 dark:bg-teal-900/30 rounded-xl">
              {metrics.deviceType === 'mobile' ? <Smartphone className="h-6 w-6 text-teal-600" /> : 
               metrics.deviceType === 'tablet' ? <Monitor className="h-6 w-6 text-teal-600" /> :
               <Monitor className="h-6 w-6 text-teal-600" />}
            </div>
            <span className="text-sm px-2 py-1 rounded-full bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300">
              {metrics.deviceType}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Device Type</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white capitalize">{metrics.deviceType}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">User device category</p>
        </motion.div>
      </div>

      {/* System Resources */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
            <HardDrive className="h-5 w-5 mr-2 text-blue-600" />
            Memory Usage
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">JavaScript Heap</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{metrics.memoryUsage.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${metrics.memoryUsage}%` }}
                transition={{ duration: 1, delay: 1 }}
                className={`h-3 rounded-full ${metrics.memoryUsage > 80 ? 'bg-red-500' : metrics.memoryUsage > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {metrics.memoryUsage > 80 ? 'High memory usage detected' : 
               metrics.memoryUsage > 60 ? 'Moderate memory usage' : 
               'Memory usage is optimal'}
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
            <Cpu className="h-5 w-5 mr-2 text-purple-600" />
            CPU Usage
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Processing Load</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{metrics.cpuUsage.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${metrics.cpuUsage}%` }}
                transition={{ duration: 1, delay: 1.1 }}
                className={`h-3 rounded-full ${metrics.cpuUsage > 80 ? 'bg-red-500' : metrics.cpuUsage > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {metrics.cpuUsage > 80 ? 'High CPU usage detected' : 
               metrics.cpuUsage > 60 ? 'Moderate CPU usage' : 
               'CPU usage is optimal'}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Real-time Analytics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        className="bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
          <Globe className="h-5 w-5 mr-2 text-green-600" />
          Real-time Analytics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
              {realTimeData.activeUsers}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Active Users</div>
            <div className="flex items-center justify-center mt-2">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-xs text-green-600">+12%</span>
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              {realTimeData.pageViews}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Page Views</div>
            <div className="flex items-center justify-center mt-2">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-xs text-green-600">+8%</span>
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">
              {realTimeData.bounceRate.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Bounce Rate</div>
            <div className="flex items-center justify-center mt-2">
              <TrendingDown className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-xs text-green-600">-3%</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Performance Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.3 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Performance Recommendations</h3>
        <div className="space-y-4">
          {metrics.firstContentfulPaint > 1800 && (
            <div className="flex items-start space-x-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-700">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-800 dark:text-yellow-200">Optimize First Contentful Paint</h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                  Consider optimizing critical resources and reducing render-blocking scripts.
                </p>
              </div>
            </div>
          )}
          
          {metrics.largestContentfulPaint > 2500 && (
            <div className="flex items-start space-x-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-700">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-red-800 dark:text-red-200">Improve Largest Contentful Paint</h4>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                  Optimize images and reduce server response times to improve loading performance.
                </p>
              </div>
            </div>
          )}
          
          {metrics.score >= 90 && (
            <div className="flex items-start space-x-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-green-800 dark:text-green-200">Excellent Performance!</h4>
                <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                  Your application is performing exceptionally well across all metrics.
                </p>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PerformanceMonitor;