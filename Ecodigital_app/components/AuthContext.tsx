import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Usuario, PermisosRol, LoginCredentials, TipoOperacion } from '../types/database';
import medicalAPIService from '../services/medicalAPIService';
import { inicializarBaseDatos } from '../services/cloudSQLService';
import apiService from '../services/apiService';

interface AuthContextType {
  // Estados de autenticación
  isAuthenticated: boolean;
  isLoading: boolean;
  currentUser: Usuario | null;
  permisos: PermisosRol | null;
  
  // Métodos de autenticación
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  
  // Métodos de permisos
  hasPermission: (modulo: string, accion: 'read' | 'write' | 'delete' | 'archive') => boolean;
  
  // Métodos de auditoría
  trackActivity: (operacion: TipoOperacion, detalles: any) => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<Usuario | null>(null);
  const [permisos, setPermisos] = useState<PermisosRol | null>(null);

  // Inicialización de la aplicación
  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    setIsLoading(true);
    
    try {
      // 1. Verificar si hay sesión existente en localStorage
      console.log('🔍 Verificando sesión existente...');
      const token = localStorage.getItem('auth_token');
      
      if (token && apiService.isAuthenticated()) {
        console.log('✅ Token encontrado, validando sesión...');
        // En este caso simplificado, asumimos que el token es válido
        // En producción se verificaría con el servidor
        console.log('ℹ️ Sesión activa detectada');
        
        // No establecemos el usuario aquí porque necesita autenticación real
      } else {
        console.log('ℹ️ No hay sesión válida, usuario debe autenticarse');
      }
    } catch (error) {
      console.error('❌ Error inicializando aplicación:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      
      console.log('🔐 Intentando autenticación para:', credentials.email);
      
      const loginResponse = await apiService.login({
        email: credentials.email,
        password: credentials.password
      });
      
      if (loginResponse.token && loginResponse.user) {
        console.log('✅ Autenticación exitosa para:', loginResponse.user.name);
        
        // Adaptar la respuesta del API al formato esperado
        const adaptedUser = {
          id: loginResponse.user.id,
          nombre: loginResponse.user.name,
          nombre_completo: loginResponse.user.name,
          email: loginResponse.user.email,
          role: loginResponse.user.role,
          activo: true,
          ultimo_acceso: new Date().toISOString(),
          two_factor_enabled: false,
          departamento: ''
        };
        
        setCurrentUser(adaptedUser);
        setIsAuthenticated(true);
        
        // Trackear login exitoso
        await trackActivityInternal('LOGIN_SUCCESS', {
          usuario: credentials.email,
          timestamp: new Date().toISOString(),
          ip_address: await getClientIP(),
          user_agent: navigator.userAgent
        });
        
        return { success: true };
      } else {
        console.log('❌ Fallo de autenticación: respuesta inválida del servidor');
        
        return { 
          success: false, 
          error: 'Respuesta inválida del servidor' 
        };
      }
    } catch (error: any) {
      console.error('❌ Error durante login:', error);
      
      // Trackear error de sistema
      await trackActivityInternal('LOGIN_FAILED', {
        usuario: credentials.email,
        error: error.error || error.message || 'Error de sistema',
        timestamp: new Date().toISOString(),
        system_error: String(error)
      });
      
      // Manejar diferentes tipos de errores
      let errorMessage = 'Error de conexión. Intente nuevamente.';
      
      if (error.error) {
        errorMessage = error.error;
      } else if (error.message) {
        errorMessage = error.message;
      } else if (error.code === 401) {
        errorMessage = 'Credenciales incorrectas';
      } else if (error.code === 500) {
        errorMessage = 'Error del servidor. Intente más tarde.';
      } else if (error.code === 400) {
        errorMessage = 'Datos de autenticación incompletos';
      }
      
      return { 
        success: false, 
        error: errorMessage
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      console.log('🚪 Cerrando sesión para:', currentUser?.nombre_completo);
      
      // Trackear logout
      if (currentUser) {
        await trackActivityInternal('logout', {
          usuario: currentUser.nombre,
          session_duration: calculateSessionDuration(),
          timestamp: new Date().toISOString()
        });
      }
      
      // Limpiar estado de autenticación
      await apiService.logout();
      setCurrentUser(null);
      setPermisos(null);
      setIsAuthenticated(false);
      
      console.log('✅ Sesión cerrada exitosamente');
    } catch (error) {
      console.error('❌ Error durante logout:', error);
    }
  };

  const hasPermission = (modulo: string, accion: 'read' | 'write' | 'delete' | 'archive'): boolean => {
    if (!currentUser || !currentUser.role) {
      return false;
    }

    // Define role permissions locally since we're using apiService
    interface Permission {
      module: string;
      action: 'read' | 'write' | 'delete' | 'archive';
    }

    const rolePermissions: Record<string, Permission[]> = {
      'admin-principal': [
        // Full access except hard delete
        { module: 'dashboard', action: 'read' },
        { module: 'dashboard', action: 'write' },
        { module: 'patients', action: 'read' },
        { module: 'patients', action: 'write' },
        { module: 'patients', action: 'archive' }, // soft delete only
        { module: 'appointments', action: 'read' },
        { module: 'appointments', action: 'write' },
        { module: 'appointments', action: 'archive' }, // soft delete only
        { module: 'documents', action: 'read' },
        { module: 'documents', action: 'write' },
        { module: 'documents', action: 'archive' }, // soft delete only
        { module: 'reports', action: 'read' },
        { module: 'reports', action: 'write' },
        { module: 'ai', action: 'read' },
        { module: 'ai', action: 'write' },
        { module: 'administration', action: 'read' },
        { module: 'administration', action: 'write' },
        { module: 'compliance', action: 'read' },
        { module: 'compliance', action: 'write' },
        { module: 'audits', action: 'read' },
        { module: 'audits', action: 'write' },
        { module: 'oversight', action: 'read' },
        { module: 'oversight', action: 'write' },
        { module: 'logs', action: 'read' },
        { module: 'logs', action: 'write' }
      ],
      
      'admin-secundario': [
        // Limited admin access, no delete/archive
        { module: 'dashboard', action: 'read' },
        { module: 'dashboard', action: 'write' },
        { module: 'patients', action: 'read' },
        { module: 'patients', action: 'write' },
        { module: 'appointments', action: 'read' },
        { module: 'appointments', action: 'write' },
        { module: 'documents', action: 'read' },
        { module: 'documents', action: 'write' },
        { module: 'reports', action: 'read' },
        { module: 'ai', action: 'read' },
        { module: 'ai', action: 'write' },
        { module: 'compliance', action: 'read' },
        { module: 'audits', action: 'read' },
        { module: 'oversight', action: 'read' },
        { module: 'logs', action: 'read' }
      ],
      
      'invitado': [
        // Read-only access
        { module: 'dashboard', action: 'read' },
        { module: 'patients', action: 'read' },
        { module: 'appointments', action: 'read' },
        { module: 'documents', action: 'read' },
        { module: 'reports', action: 'read' }
      ],
      
      'soporte-absoluto': [
        // Absolute access including hard delete
        { module: 'dashboard', action: 'read' },
        { module: 'dashboard', action: 'write' },
        { module: 'dashboard', action: 'delete' },
        { module: 'patients', action: 'read' },
        { module: 'patients', action: 'write' },
        { module: 'patients', action: 'archive' },
        { module: 'patients', action: 'delete' }, // hard delete allowed
        { module: 'appointments', action: 'read' },
        { module: 'appointments', action: 'write' },
        { module: 'appointments', action: 'archive' },
        { module: 'appointments', action: 'delete' }, // hard delete allowed
        { module: 'documents', action: 'read' },
        { module: 'documents', action: 'write' },
        { module: 'documents', action: 'archive' },
        { module: 'documents', action: 'delete' }, // hard delete allowed
        { module: 'reports', action: 'read' },
        { module: 'reports', action: 'write' },
        { module: 'reports', action: 'delete' },
        { module: 'ai', action: 'read' },
        { module: 'ai', action: 'write' },
        { module: 'ai', action: 'delete' },
        { module: 'administration', action: 'read' },
        { module: 'administration', action: 'write' },
        { module: 'administration', action: 'delete' },
        { module: 'compliance', action: 'read' },
        { module: 'compliance', action: 'write' },
        { module: 'compliance', action: 'delete' },
        { module: 'audits', action: 'read' },
        { module: 'audits', action: 'write' },
        { module: 'audits', action: 'delete' },
        { module: 'oversight', action: 'read' },
        { module: 'oversight', action: 'write' },
        { module: 'oversight', action: 'delete' },
        { module: 'logs', action: 'read' },
        { module: 'logs', action: 'write' },
        { module: 'logs', action: 'delete' },
        { module: 'system', action: 'read' },
        { module: 'system', action: 'write' },
        { module: 'system', action: 'delete' },
        { module: 'debug', action: 'read' },
        { module: 'debug', action: 'write' },
        { module: 'backup', action: 'read' },
        { module: 'backup', action: 'write' }
      ]
    };

    const userPermissions = rolePermissions[currentUser.role];
    
    if (!userPermissions) {
      console.warn(`⚠️ Rol '${currentUser.role}' no encontrado en permisos`);
      return false;
    }

    const hasModulePermission = userPermissions.some(
      permission => permission.module === modulo && permission.action === accion
    );
    
    // Log de verificación de permisos para auditoría
    if (!hasModulePermission) {
      console.log(`🔒 Permiso denegado: ${currentUser.nombre} intentó ${accion} en ${modulo}`);
    }
    
    return hasModulePermission;
  };

  const trackActivity = async (operacion: TipoOperacion, detalles: any): Promise<void> => {
    await trackActivityInternal(operacion, detalles);
  };

  // Función interna para tracking sin verificación de permisos
  const trackActivityInternal = async (operacion: TipoOperacion, detalles: any): Promise<void> => {
    try {
      // En producción, esto se registraría en LOGS_AUDITORIA a través del API
      const logEntry = {
        operacion,
        usuario: currentUser?.nombre || 'sistema',
        timestamp: new Date().toISOString(),
        detalles,
        session_id: localStorage.getItem('medical_system_token')?.slice(-8) || 'unknown'
      };

      console.log('📝 Actividad registrada:', logEntry);
      
      // Aquí se haría la llamada real al API para guardar en LOGS_AUDITORIA
      // await medicalAPIService.crearLogAuditoria(logEntry);
      
    } catch (error) {
      console.error('❌ Error registrando actividad:', error);
    }
  };

  // Funciones helper
  const calculateSessionDuration = (): number => {
    if (!currentUser?.ultimo_acceso) return 0;
    
    const sessionStart = new Date(currentUser.ultimo_acceso).getTime();
    const sessionEnd = Date.now();
    
    return sessionEnd - sessionStart; // duración en milisegundos
  };

  const getClientIP = async (): Promise<string> => {
    try {
      // En producción: obtener IP real del cliente
      // const response = await fetch('https://api.ipify.org?format=json');
      // const data = await response.json();
      // return data.ip;
      
      return 'localhost'; // Simulado para desarrollo
    } catch (error) {
      return 'unknown';
    }
  };

  const contextValue: AuthContextType = {
    isAuthenticated,
    isLoading,
    currentUser,
    permisos,
    login,
    logout,
    hasPermission,
    trackActivity
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  
  return context;
}

// Hook personalizado para verificar permisos específicos
export function usePermissions() {
  const { hasPermission, currentUser } = useAuth();
  
  return {
    // Permisos por módulo
    canReadPatients: () => hasPermission('pacientes', 'read'),
    canWritePatients: () => hasPermission('pacientes', 'write'),
    canDeletePatients: () => hasPermission('pacientes', 'delete'),
    
    canReadAppointments: () => hasPermission('citas', 'read'),
    canWriteAppointments: () => hasPermission('citas', 'write'),
    canDeleteAppointments: () => hasPermission('citas', 'delete'),
    
    canReadDocuments: () => hasPermission('documentos', 'read'),
    canWriteDocuments: () => hasPermission('documentos', 'write'),
    canDeleteDocuments: () => hasPermission('documentos', 'delete'),
    
    canReadReports: () => hasPermission('reportes', 'read'),
    canWriteReports: () => hasPermission('reportes', 'write'),
    canDeleteReports: () => hasPermission('reportes', 'delete'),
    
    canReadAdmin: () => hasPermission('administracion', 'read'),
    canWriteAdmin: () => hasPermission('administracion', 'write'),
    canDeleteAdmin: () => hasPermission('administracion', 'delete'),
    
    canReadAI: () => hasPermission('ia-asistente', 'read'),
    canWriteAI: () => hasPermission('ia-asistente', 'write'),
    
    canReadCompliance: () => hasPermission('compliance', 'read'),
    canWriteCompliance: () => hasPermission('compliance', 'write'),
    
    canReadAudits: () => hasPermission('auditorias', 'read'),
    canWriteAudits: () => hasPermission('auditorias', 'write'),
    
    canReadSystemLogs: () => hasPermission('system-logs', 'read'),
    
    // Verificaciones de rol
    isAdminPrincipal: () => currentUser?.role === 'admin-principal',
    isAdminSecundario: () => currentUser?.role === 'admin-secundario',
    isAsistente: () => currentUser?.role === 'asistente',
    isInvitado: () => currentUser?.role === 'invitado',
    isSoporteAbsoluto: () => currentUser?.role === 'soporte-absoluto',
    
    // Verificación de usuario activo
    isActiveUser: () => currentUser?.activo === true,
    
    // Información del usuario actual
    getCurrentUserInfo: () => ({
      id: currentUser?.id,
      nombre: currentUser?.nombre,
      nombre_completo: currentUser?.nombre_completo,
      email: currentUser?.email,
      departamento: currentUser?.departamento,
      rol: currentUser?.role,
      ultimo_acceso: currentUser?.ultimo_acceso,
      two_factor_enabled: currentUser?.two_factor_enabled
    })
  };
}

// Hook para tracking de actividades específicas
export function useActivityTracker() {
  const { trackActivity, currentUser } = useAuth();
  
  return {
    trackActivity,
    
    // Métodos específicos de tracking
    trackPageView: (pagina: string) => trackActivity('leer', { 
      tipo: 'page_view', 
      pagina, 
      timestamp: new Date().toISOString() 
    }),
    
    trackDocumentAccess: (documentId: number, action: string) => trackActivity('leer', {
      tipo: 'document_access',
      documento_id: documentId,
      accion: action,
      timestamp: new Date().toISOString()
    }),
    
    trackPatientAccess: (patientId: number, action: string) => trackActivity('leer', {
      tipo: 'patient_access',
      paciente_id: patientId,
      accion: action,
      timestamp: new Date().toISOString()
    }),
    
    trackReportGeneration: (reportType: string, filters: any) => trackActivity('crear', {
      tipo: 'report_generated',
      report_type: reportType,
      filtros: filters,
      timestamp: new Date().toISOString()
    }),
    
    trackSystemError: (error: string, context: any) => trackActivity('error', {
      tipo: 'system_error',
      error_message: error,
      contexto: context,
      timestamp: new Date().toISOString()
    }),
    
    getCurrentUser: () => currentUser
  };
}

export type { AuthContextType };