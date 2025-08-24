/**
 * Optimizador de rendimiento principal
 * Exporta todas las utilidades de optimización
 */

// Re-export all performance utilities
export * from './lazyLoading';
export * from './preloader';
export * from './cache';
export * from './imageOptimizer';
export * from './performanceMonitor';

// Re-export VirtualList component
export { VirtualList } from '../components/ui/virtual-list';

// Utility function to initialize all performance optimizations
export function initializePerformanceOptimizations(): void {
  // Start performance monitoring
  const { performanceMonitor } = require('./performanceMonitor');
  performanceMonitor.start();
  
  // Start intelligent preloading
  const { intelligentPreloader } = require('./preloader');
  intelligentPreloader.startPreloading();
  
  console.log('🚀 Performance optimizations initialized');
}

// Utility to get overall performance stats
export function getPerformanceStats(): {
  monitor: any;
  cache: any;
  recommendations: string[];
} {
  const { performanceMonitor } = require('./performanceMonitor');
  const { medicalDataCache } = require('./cache');
  
  return {
    monitor: performanceMonitor.getMetrics(),
    cache: medicalDataCache.getStats(),
    recommendations: performanceMonitor.getRecommendations()
  };
}