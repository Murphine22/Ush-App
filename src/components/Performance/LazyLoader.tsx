import React, { Suspense, lazy, ComponentType } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface LazyLoaderProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  delay?: number;
}

const DefaultFallback = () => (
  <div className="flex items-center justify-center min-h-[200px]">
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center space-y-4"
    >
      <div className="relative">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <div className="absolute inset-0 h-8 w-8 animate-ping rounded-full bg-blue-400 opacity-20"></div>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 animate-pulse">Loading amazing content...</p>
    </motion.div>
  </div>
);

const LazyLoader: React.FC<LazyLoaderProps> = ({ 
  children, 
  fallback = <DefaultFallback />, 
  delay = 0 
}) => {
  return (
    <Suspense fallback={fallback}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay }}
      >
        {children}
      </motion.div>
    </Suspense>
  );
};

// HOC for lazy loading components
export const withLazyLoading = <P extends object>(
  Component: ComponentType<P>,
  fallback?: React.ReactNode
) => {
  const LazyComponent = lazy(() => Promise.resolve({ default: Component }));
  
  return (props: P) => (
    <LazyLoader fallback={fallback}>
      <LazyComponent {...props} />
    </LazyLoader>
  );
};

export default LazyLoader;