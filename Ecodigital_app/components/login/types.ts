import { LoginCredentials } from '../../types/database';

// Estado del formulario de inicio de sesión
export interface LoginFormState {
  credentials: LoginCredentials;
  showPassword: boolean;
  isLoading: boolean;
  error: string | null;
  showDemoUsers: boolean;
  validationErrors: ValidationErrors;
}

// Errores de validación del formulario
export interface ValidationErrors {
  email?: string;
  password?: string;
}

// Usuario demo para desarrollo y pruebas
export interface DemoUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  department: string;
  description: string;
  permissions: string[];
  avatar: string;
}

// Información de conexión del sistema
export interface ConnectionInfo {
  status: 'connected' | 'connecting' | 'disconnected' | 'error';
  database: string;
  region: string;
  performance: {
    response_time_ms: number;
    active_connections: number;
  };
}

// Props para el componente ConnectionStatus
export interface ConnectionStatusProps {
  connectionInfo: ConnectionInfo;
}

// Estado de la conexión
export type ConnectionStatus = 'connected' | 'connecting' | 'disconnected' | 'error';

// Configuración de seguridad
export interface SecuritySettings {
  minPasswordLength: number;
  maxLoginAttempts: number;
  lockoutDurationMinutes: number;
  sessionTimeoutMinutes: number;
  requireHttps: boolean;
  enable2FA: boolean;
}

// Metadatos de la sesión
export interface SessionMetadata {
  userAgent: string;
  ipAddress: string;
  loginTime: string;
  lastActivity: string;
  sessionId: string;
  deviceInfo: {
    platform: string;
    browser: string;
    screenResolution: string;
    timezone: string;
  };
}

// Evento de auditoría de login
export interface LoginAuditEvent {
  timestamp: string;
  email: string;
  success: boolean;
  ipAddress: string;
  userAgent: string;
  errorMessage?: string;
  sessionId?: string;
  attemptNumber: number;
}

// Respuesta de verificación de credenciales
export interface CredentialVerificationResult {
  isValid: boolean;
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
    department: string;
  };
  error?: string;
  requiresTwoFactor?: boolean;
  lockoutInfo?: {
    isLockedOut: boolean;
    remainingTime: number;
    attemptCount: number;
  };
}

// Configuración del entorno de login
export interface LoginEnvironmentConfig {
  isDevelopment: boolean;
  showDebugInfo: boolean;
  enableConsoleLogs: boolean;
  mockApiDelay: number;
  showDemoUsers: boolean;
  enableAuditLogging: boolean;
}

// Información del sistema médico
export interface MedicalSystemInfo {
  name: string;
  doctorName: string;
  subtitle: string;
  version: string;
  lastUpdate: string;
  supportContact: {
    email: string;
    phone: string;
    hours: string;
  };
}

// Estadísticas de uso del sistema
export interface SystemUsageStats {
  totalUsers: number;
  activeUsers: number;
  totalSessions: number;
  averageSessionDuration: number;
  lastLogin: string;
  systemUptime: number;
}

// Configuración de la interfaz de usuario
export interface UIConfiguration {
  theme: 'light' | 'dark';
  animationDuration: number;
  blurIntensity: number;
  glassOpacity: number;
  auroraSpeed: number;
  showAnimations: boolean;
}