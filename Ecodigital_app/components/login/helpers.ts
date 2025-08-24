import { LoginCredentials } from '../../types/database';
import { VALIDATION_MESSAGES } from './constants';
import configService from '../../services/configService';

export interface ValidationErrors {
  email?: string;
  password?: string;
}

export function validateLoginForm(credentials: LoginCredentials): ValidationErrors {
  const errors: ValidationErrors = {};
  
  if (!credentials.email?.trim()) {
    errors.email = 'El email es obligatorio';
  } else if (!isValidEmail(credentials.email.trim())) {
    errors.email = 'Formato de email inválido';
  }
  
  if (!credentials.password) {
    errors.password = VALIDATION_MESSAGES.PASSWORD_REQUIRED;
  } else if (credentials.password.length < 6) {
    errors.password = VALIDATION_MESSAGES.PASSWORD_MIN_LENGTH;
  }
  
  return errors;
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function hasValidationErrors(errors: ValidationErrors): boolean {
  return Object.keys(errors).length > 0;
}

export function clearFormField(
  credentials: LoginCredentials, 
  field: keyof LoginCredentials, 
  value: string | boolean = ''
): LoginCredentials {
  return { ...credentials, [field]: value };
}

export function getConnectionStatus(): {
  status: string;
  database: string;
  region: string;
} {
  // Usar el servicio de configuración en lugar de process.env
  const dbConfig = configService.getDatabaseConfig();
  
  return {
    status: 'connected',
    database: dbConfig.database,
    region: 'us-central1' // En producción obtener de configuración
  };
}

export async function getClientIP(): Promise<string> {
  try {
    // En producción: obtener IP real del cliente
    // const response = await fetch('https://api.ipify.org?format=json');
    // const data = await response.json();
    // return data.ip;
    
    return 'localhost'; // Simulado para desarrollo
  } catch (error) {
    return 'unknown';
  }
}

export function logLoginAttempt(username: string, success: boolean, error?: string): void {
  const logEntry = {
    timestamp: new Date().toISOString(),
    username,
    success,
    error,
    user_agent: navigator.userAgent,
    ip_address: 'localhost', // En producción obtener IP real
    environment: configService.getEnvironment()
  };
  
  // Solo mostrar logs detallados en desarrollo
  if (configService.isDevelopment()) {
    console.log('🔐 Login attempt:', logEntry);
  } else {
    console.log(`🔐 Login ${success ? 'successful' : 'failed'} for user: ${username}`);
  }
}

export function clearPasswordOnError(
  credentials: LoginCredentials
): LoginCredentials {
  return clearFormField(credentials, 'password', '');
}

export function sanitizeUsername(username: string): string {
  return username.trim().toLowerCase();
}

export function formatErrorMessage(error: string | undefined | any): string {
  if (!error) return VALIDATION_MESSAGES.AUTH_ERROR;
  
  // Si error es un objeto, extraer el mensaje principal
  let errorMessage = '';
  
  if (typeof error === 'object') {
    if (error.error) {
      errorMessage = error.error;
    } else if (error.message) {
      errorMessage = error.message;
    } else if (error.details) {
      errorMessage = error.details;
    } else {
      errorMessage = JSON.stringify(error);
    }
  } else if (typeof error === 'string') {
    errorMessage = error;
  } else {
    errorMessage = String(error);
  }
  
  // Mapear errores comunes a mensajes más amigables
  const lowerError = errorMessage.toLowerCase();
  
  if (lowerError.includes('usuario no encontrado') || lowerError.includes('user not found')) {
    return 'El email proporcionado no está registrado en el sistema.';
  }
  
  if (lowerError.includes('contraseña incorrecta') || lowerError.includes('password') || lowerError.includes('credentials')) {
    return 'Contraseña incorrecta. Verifique sus credenciales.';
  }
  
  if (lowerError.includes('network') || lowerError.includes('connection') || lowerError.includes('conexión')) {
    return VALIDATION_MESSAGES.CONNECTION_ERROR;
  }
  
  if (lowerError.includes('server') || lowerError.includes('servidor') || lowerError.includes('500')) {
    return 'Error del servidor. Intente más tarde.';
  }
  
  if (lowerError.includes('datos de autenticación incompletos') || lowerError.includes('400')) {
    return 'Complete todos los campos requeridos.';
  }
  
  if (lowerError.includes('unauthorized') || lowerError.includes('401')) {
    return 'Credenciales incorrectas. Verifique su usuario y contraseña.';
  }
  
  if (lowerError.includes('forbidden') || lowerError.includes('403')) {
    return 'No tiene permisos para acceder al sistema.';
  }
  
  if (lowerError.includes('timeout')) {
    return 'La conexión ha excedido el tiempo límite. Intente nuevamente.';
  }
  
  // Si no coincide con ningún patrón conocido, devolver el mensaje original
  return errorMessage;
}

export function shouldShowDemoUsers(): boolean {
  // Usar el servicio de configuración en lugar de process.env
  return configService.shouldShowDemoUsers();
}

export function generateSessionMetadata() {
  return {
    timestamp: new Date().toISOString(),
    user_agent: navigator.userAgent,
    screen_resolution: `${window.screen.width}x${window.screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    language: navigator.language,
    environment: configService.getEnvironment(),
    version: configService.getVersion()
  };
}

export function getBrowserInfo() {
  return {
    user_agent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
    cookie_enabled: navigator.cookieEnabled,
    online: navigator.onLine,
    screen_width: window.screen.width,
    screen_height: window.screen.height,
    viewport_width: window.innerWidth,
    viewport_height: window.innerHeight,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    url: window.location.href,
    hostname: window.location.hostname,
    protocol: window.location.protocol,
    port: window.location.port
  };
}

export function isLocalDevelopment(): boolean {
  return configService.isDevelopment() && (
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.port !== ''
  );
}

export function isProductionEnvironment(): boolean {
  return configService.isProduction();
}

export function getAppVersion(): string {
  return configService.getVersion();
}

export function getDebugInfo() {
  const debugInfo = configService.getDebugInfo();
  const browserInfo = getBrowserInfo();
  
  return {
    ...debugInfo,
    browser: browserInfo,
    features: {
      twoFactorAuth: configService.isFeatureEnabled('twoFactorAuth'),
      realTimeUpdates: configService.isFeatureEnabled('realTimeUpdates'),
      offlineMode: configService.isFeatureEnabled('offlineMode')
    }
  };
}

// Helper para validar configuración antes del login
export function validateSystemConfiguration(): { isValid: boolean; errors: string[] } {
  return configService.validateConfig();
}

// Logger mejorado que respeta el entorno
export function logMessage(level: 'info' | 'warn' | 'error', message: string, data?: any): void {
  const timestamp = new Date().toISOString();
  const environment = configService.getEnvironment();
  
  const logEntry = {
    timestamp,
    level,
    message,
    environment,
    data
  };
  
  if (configService.isDevelopment()) {
    // En desarrollo, mostrar logs completos
    switch (level) {
      case 'info':
        console.log(`ℹ️ [${timestamp}] ${message}`, data || '');
        break;
      case 'warn':
        console.warn(`⚠️ [${timestamp}] ${message}`, data || '');
        break;
      case 'error':
        console.error(`❌ [${timestamp}] ${message}`, data || '');
        break;
    }
  } else {
    // En producción, logs más simples
    switch (level) {
      case 'info':
        console.log(message);
        break;
      case 'warn':
        console.warn(message);
        break;
      case 'error':
        console.error(message);
        break;
    }
  }
  
  // En producción, aquí se enviarían los logs a un servicio externo
  // como Cloud Logging, Sentry, etc.
}