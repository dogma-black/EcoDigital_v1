/**
 * Monitor de rendimiento del sistema
 */

import { medicalDataCache } from './cache';

export class PerformanceMonitor {
  private metrics: {
    renderTimes: number[];
    memoryUsage: number[];
    cacheHitRate: number;
    networkRequests: number;
    errorCount: number;
  } = {
    renderTimes: [],
    memoryUsage: [],
    cacheHitRate: 0,
    networkRequests: 0,
    errorCount: 0
  };
  
  private observers: PerformanceObserver[] = [];
  
  start(): void {
    if ('PerformanceObserver' in window) {
      const longTaskObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) {
            console.warn(`Long task detected: ${entry.duration}ms`);
          }
        }
      });
      
      try {
        longTaskObserver.observe({ entryTypes: ['longtask'] });
        this.observers.push(longTaskObserver);
      } catch (e) {
        // Longtask API not supported
      }
      
      const layoutShiftObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if ((entry as any).value > 0.1) {
            console.warn(`Layout shift detected: ${(entry as any).value}`);
          }
        }
      });
      
      try {
        layoutShiftObserver.observe({ entryTypes: ['layout-shift'] });
        this.observers.push(layoutShiftObserver);
      } catch (e) {
        // Layout shift API not supported
      }
    }
    
    this.monitorMemoryUsage();
  }
  
  stop(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
  
  private monitorMemoryUsage(): void {
    const updateMemory = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        this.metrics.memoryUsage.push(memory.usedJSHeapSize);
        
        if (this.metrics.memoryUsage.length > 100) {
          this.metrics.memoryUsage.shift();
        }
      }
    };
    
    setInterval(updateMemory, 10000);
  }
  
  recordRenderTime(componentName: string, renderTime: number): void {
    this.metrics.renderTimes.push(renderTime);
    
    if (renderTime > 16) {
      console.warn(`Slow render detected in ${componentName}: ${renderTime}ms`);
    }
    
    if (this.metrics.renderTimes.length > 100) {
      this.metrics.renderTimes.shift();
    }
  }
  
  getMetrics(): typeof this.metrics {
    return {
      ...this.metrics,
      cacheHitRate: medicalDataCache.getStats().hitRate
    };
  }
  
  getRecommendations(): string[] {
    const recommendations: string[] = [];
    const avgRenderTime = this.metrics.renderTimes.reduce((a, b) => a + b, 0) / this.metrics.renderTimes.length;
    
    if (avgRenderTime > 16) {
      recommendations.push('Consider optimizing component renders');
    }
    
    const cacheStats = medicalDataCache.getStats();
    if (cacheStats.hitRate < 0.7) {
      recommendations.push('Cache hit rate is low, consider adjusting caching strategy');
    }
    
    if (this.metrics.errorCount > 10) {
      recommendations.push('High error count detected, check error handling');
    }
    
    return recommendations;
  }
}

export const performanceMonitor = new PerformanceMonitor();