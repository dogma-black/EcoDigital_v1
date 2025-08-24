/**
 * Utilidades para carga lazy de componentes
 */

import { ComponentType, lazy, Suspense } from 'react';

export interface LazyComponentOptions {
  fallback?: ComponentType;
  retryCount?: number;
  preload?: boolean;
}

export function createLazyComponent<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options: LazyComponentOptions = {}
): ComponentType<React.ComponentProps<T>> {
  const { fallback: Fallback, retryCount = 3, preload = false } = options;
  
  // Retry mechanism for failed imports
  const retryImport = async (attempt = 0): Promise<{ default: T }> => {
    try {
      return await importFn();
    } catch (error) {
      if (attempt < retryCount) {
        console.warn(`Failed to load component, retrying... (${attempt + 1}/${retryCount})`);
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
        return retryImport(attempt + 1);
      }
      throw error;
    }
  };
  
  const LazyComponent = lazy(() => retryImport());
  
  // Preload if requested
  if (preload) {
    importFn().catch(() => {
      // Ignore preload errors
    });
  }
  
  return (props: React.ComponentProps<T>) => (
    <Suspense fallback={Fallback ? <Fallback /> : <div>Cargando...</div>}>
      <LazyComponent {...props} />
    </Suspense>
  );
}

// Predefined lazy components for the medical system
export const LazyPatientManagement = createLazyComponent(
  () => import('../components/PatientManagement'),
  { preload: true }
);

export const LazyAppointmentSchedule = createLazyComponent(
  () => import('../components/AppointmentSchedule'),
  { preload: true }
);

export const LazyDocumentManagement = createLazyComponent(
  () => import('../components/DocumentManagement')
);

export const LazyReports = createLazyComponent(
  () => import('../components/Reports')
);

export const LazyAIAssistant = createLazyComponent(
  () => import('../components/AIAssistant')
);

export const LazyAdministration = createLazyComponent(
  () => import('../components/Administration')
);