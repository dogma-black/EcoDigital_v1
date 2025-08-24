/**
 * Sistema de precarga inteligente
 */

class IntelligentPreloader {
  private loadQueue: Array<() => Promise<any>> = [];
  private loadedModules = new Set<string>();
  private userInteractionHistory: string[] = [];
  
  queuePreload(moduleId: string, importFn: () => Promise<any>): void {
    if (this.loadedModules.has(moduleId)) return;
    
    this.loadQueue.push(async () => {
      try {
        await importFn();
        this.loadedModules.add(moduleId);
        console.log(`Preloaded module: ${moduleId}`);
      } catch (error) {
        console.warn(`Failed to preload module: ${moduleId}`, error);
      }
    });
  }
  
  async startPreloading(): Promise<void> {
    if (this.loadQueue.length === 0) return;
    
    const processQueue = () => {
      if (this.loadQueue.length === 0) return;
      
      const loadNext = this.loadQueue.shift();
      if (loadNext) {
        loadNext().finally(() => {
          if ('requestIdleCallback' in window) {
            requestIdleCallback(processQueue);
          } else {
            setTimeout(processQueue, 100);
          }
        });
      }
    };
    
    if ('requestIdleCallback' in window) {
      requestIdleCallback(processQueue);
    } else {
      setTimeout(processQueue, 100);
    }
  }
  
  trackUserInteraction(route: string): void {
    this.userInteractionHistory.push(route);
    
    if (this.userInteractionHistory.length > 10) {
      this.userInteractionHistory.shift();
    }
    
    this.predictNextRoute();
  }
  
  private predictNextRoute(): void {
    const routeFrequency: Record<string, number> = {};
    
    this.userInteractionHistory.forEach(route => {
      routeFrequency[route] = (routeFrequency[route] || 0) + 1;
    });
    
    const sortedRoutes = Object.entries(routeFrequency)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3);
    
    sortedRoutes.forEach(([route]) => {
      this.preloadRoute(route);
    });
  }
  
  private preloadRoute(route: string): void {
    const routeImports: Record<string, () => Promise<any>> = {
      'patients': () => import('../components/PatientManagement'),
      'appointments': () => import('../components/AppointmentSchedule'),
      'documents': () => import('../components/DocumentManagement'),
      'reports': () => import('../components/Reports'),
      'ai-assistant': () => import('../components/AIAssistant'),
      'administration': () => import('../components/Administration')
    };
    
    const importFn = routeImports[route];
    if (importFn) {
      this.queuePreload(route, importFn);
    }
  }
}

export const intelligentPreloader = new IntelligentPreloader();