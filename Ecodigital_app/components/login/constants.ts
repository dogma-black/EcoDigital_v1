import { DemoUser } from './types';

// Información del sistema
export const SYSTEM_INFO = {
  APP_NAME: 'ECOSISTEMA DIGITAL INTELIGENTE',
  DOCTOR_NAME: 'Dr. Joel Sánchez García',
  SUBTITLE: 'Para Cirugía Ortopédica y de Columna',
  DATABASE_NAME: 'cirugia_especial_db',
  DEFAULT_REGION: 'us-central1'
};

// Estados de conexión
export const CONNECTION_STATUS = {
  CONNECTED: 'connected' as const,
  CONNECTING: 'connecting' as const,
  DISCONNECTED: 'disconnected' as const,
  ERROR: 'error' as const
};

// Mensajes de estado de conexión
export const STATUS_MESSAGES = {
  [CONNECTION_STATUS.CONNECTED]: 'Conectado a Cloud SQL',
  [CONNECTION_STATUS.CONNECTING]: 'Conectando al servidor...',
  [CONNECTION_STATUS.DISCONNECTED]: 'Desconectado',
  [CONNECTION_STATUS.ERROR]: 'Error de conexión'
};

// Colores de estado de conexión
export const STATUS_COLORS = {
  [CONNECTION_STATUS.CONNECTED]: 'bg-green-400',
  [CONNECTION_STATUS.CONNECTING]: 'bg-yellow-400',
  [CONNECTION_STATUS.DISCONNECTED]: 'bg-gray-400',
  [CONNECTION_STATUS.ERROR]: 'bg-red-400'
};

// Valores por defecto del formulario
export const FORM_DEFAULTS = {
  EMAIL: '',
  PASSWORD: '',
  REMEMBER_ME: false
};

// Mensajes de validación
export const VALIDATION_MESSAGES = {
  EMAIL_REQUIRED: 'El email es obligatorio',
  EMAIL_INVALID: 'Formato de email inválido',
  PASSWORD_REQUIRED: 'La contraseña es obligatoria',
  PASSWORD_MIN_LENGTH: 'La contraseña debe tener al menos 6 caracteres',
  CONNECTION_ERROR: 'Error de conexión. Verifique su conexión a internet.',
  AUTH_ERROR: 'Error de autenticación. Intente nuevamente.'
};

// USUARIOS FINALES DEL PROYECTO REAL
// Estos son los únicos 4 usuarios que tendrán acceso al sistema
export const DEMO_USERS: DemoUser[] = [
  {
    id: 'joel-sanchez-garcia',
    name: 'Dr. Joel Sánchez García',
    email: 'joel.sanchez@cirugiaespecial.com',
    password: 'demo123456',
    role: 'Admin Principal',
    department: 'Cirugía Ortopédica y de Columna',
    description: 'Administrador principal del sistema médico especializado',
    permissions: ['Crear', 'Leer', 'Actualizar', 'Archivar', 'Administrar', 'Reportes', 'IA'],
    avatar: '👨‍⚕️'
  },
  {
    id: 'ana-laura-aguilar',
    name: 'Ana Laura Aguilar',
    email: 'ana.aguilar@cirugiaespecial.com',
    password: 'demo123456',
    role: 'Admin Secundario',
    department: 'Administración Médica',
    description: 'Administradora secundaria con gestión operativa',
    permissions: ['Crear', 'Leer', 'Actualizar', 'Archivar', 'Reportes', 'IA'],
    avatar: '👩‍💼'
  },
  {
    id: 'invitado-general',
    name: 'Usuario Invitado',
    email: 'invitado@cirugiaespecial.com',
    password: 'demo123456',
    role: 'Solo Lectura',
    department: 'Acceso de Solo Lectura',
    description: 'Usuario invitado con acceso limitado para consultas',
    permissions: ['Leer'],
    avatar: '👤'
  },
  {
    id: 'soporte-dogma-black',
    name: 'Soporte Técnico Dogma',
    email: 'soporte@dogma.black',
    password: 'AltermindSpace07',
    role: 'Soporte Absoluto',
    department: 'Soporte Técnico Especializado',
    description: 'Acceso técnico absoluto - ELIMINAR definitivamente permitido',
    permissions: ['ACCESO TOTAL', 'Eliminar Definitivo', 'Debug', 'Backup'],
    avatar: '🔧'
  }
];

// Configuración de seguridad
export const SECURITY_CONFIG = {
  MIN_PASSWORD_LENGTH: 6,
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION_MINUTES: 15,
  SESSION_TIMEOUT_MINUTES: 60,
  REQUIRE_HTTPS: true,
  ENABLE_2FA: false // Se habilitará en producción
};

// Configuración de auditoría
export const AUDIT_CONFIG = {
  LOG_ALL_ATTEMPTS: true,
  LOG_SUCCESSFUL_LOGINS: true,
  LOG_FAILED_LOGINS: true,
  LOG_LOGOUTS: true,
  RETENTION_DAYS: 365 // 1 año de retención de logs
};

// Configuración del entorno
export const ENVIRONMENT_CONFIG = {
  IS_DEVELOPMENT: true, // Se cambiaría a false en producción
  SHOW_DEBUG_INFO: true,
  ENABLE_CONSOLE_LOGS: true,
  MOCK_API_DELAY: 800 // milisegundos
};

// Mensajes del sistema
export const SYSTEM_MESSAGES = {
  WELCOME: '¡Bienvenido al Ecosistema Digital Inteligente!',
  LOGIN_SUCCESS: 'Autenticación exitosa',
  LOGIN_FAILED: 'Error de autenticación',
  CONNECTION_ESTABLISHED: 'Conexión establecida con éxito',
  SYSTEM_READY: 'Sistema listo para operar',
  UNAUTHORIZED_ACCESS: 'Acceso no autorizado detectado'
};

// Configuración de la interfaz
export const UI_CONFIG = {
  ANIMATION_DURATION: 300,
  BLUR_INTENSITY: 20,
  GLASS_OPACITY: 0.04,
  AURORA_ANIMATION_SPEED: 20
};

// Información de contacto para soporte
export const SUPPORT_INFO = {
  EMAIL: 'soporte@dogma.black',
  PHONE: '+52 55 1234 5678',
  HOURS: 'Lunes a Viernes, 9:00 AM - 6:00 PM',
  EMERGENCY: '24/7 para urgencias médicas'
};