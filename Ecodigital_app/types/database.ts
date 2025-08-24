// Interfaces TypeScript que corresponden exactamente a las tablas de Cloud SQL
// Basadas en el "Documento de Diseño de la Base de Datos (Cloud SQL)"

export interface Paciente {
  id_paciente: number;
  nombre: string;
  apellido: string;
  fecha_nac: string | null; // DATE se maneja como string en formato ISO
  datos_contacto: ContactoData | null; // JSON field
  activo: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ContactoData {
  telefono?: string;
  email?: string;
  direccion?: string;
  telefono_emergencia?: string;
  contacto_emergencia?: string;
}

export interface HistorialClinico {
  id_historial: number;
  id_paciente: number;
  fecha_consulta: string; // DATE
  diagnostico: string | null;
  notas_medico: string | null;
  activo: boolean;
  created_at?: string;
  updated_at?: string;
  // Relaciones
  paciente?: Paciente;
  documentos?: Documento[];
}

export interface Usuario {
  id_usuario: number;
  nombre: string; // Username para login
  hash_password: string;
  id_role: number;
  activo: boolean;
  // Campos adicionales para funcionalidad completa
  nombre_completo?: string;
  email?: string;
  telefono?: string;
  departamento?: string;
  especialidad?: string;
  cedula_profesional?: string;
  two_factor_enabled?: boolean;
  ultimo_acceso?: string;
  intentos_fallidos?: number;
  fecha_cambio_password?: string;
  created_at?: string;
  updated_at?: string;
  // Relaciones
  rol?: Rol;
}

export interface Rol {
  id_role: number;
  nombre_rol: string;
  permisos: PermisosRol; // JSON field
  created_at?: string;
  updated_at?: string;
}

export interface PermisosRol {
  dashboard: { leer: boolean; escribir: boolean; eliminar: boolean };
  pacientes: { leer: boolean; escribir: boolean; eliminar: boolean };
  citas: { leer: boolean; escribir: boolean; eliminar: boolean };
  documentos: { leer: boolean; escribir: boolean; eliminar: boolean };
  reportes: { leer: boolean; escribir: boolean; eliminar: boolean };
  administracion: { leer: boolean; escribir: boolean; eliminar: boolean };
  'ia-asistente': { leer: boolean; escribir: boolean; eliminar: boolean };
  compliance: { leer: boolean; escribir: boolean; eliminar: boolean };
  auditorias: { leer: boolean; escribir: boolean; eliminar: boolean };
  'system-logs': { leer: boolean; escribir: boolean; eliminar: boolean };
}

export interface LogAuditoria {
  id_log: number;
  tabla_afectada: string;
  id_registro_afectado: number;
  tipo_operacion: TipoOperacion;
  datos_anteriores: any | null; // JSON field
  datos_nuevos: any | null; // JSON field
  fecha_hora: string; // DATETIME
  id_usuario_autor: number;
  // Relaciones
  usuario_autor?: Usuario;
}

export type TipoOperacion = 
  | 'login_exitoso' 
  | 'login_fallido' 
  | 'crear' 
  | 'actualizar' 
  | 'eliminar' 
  | 'leer'
  | 'export'
  | 'import'
  | 'backup'
  | 'restore';

// Tablas adicionales inferidas del sistema actual

export interface Cita {
  id_cita: number;
  id_paciente: number;
  fecha_hora: string; // DATETIME
  estado: EstadoCita;
  tipo_cita: TipoCita;
  motivo: string | null;
  notas: string | null;
  duracion_minutos: number;
  recordatorio_enviado: boolean;
  activo: boolean;
  created_at?: string;
  updated_at?: string;
  // Relaciones
  paciente?: Paciente;
  procedimientos?: ProcedimientoCita[];
}

export type EstadoCita = 'Programada' | 'Confirmada' | 'En Proceso' | 'Completada' | 'Cancelada' | 'No Asistió';
export type TipoCita = 'Consulta' | 'Seguimiento' | 'Cirugía' | 'Emergencia' | 'Rehabilitación';

export interface Procedimiento {
  id_procedimiento: number;
  nombre: string;
  descripcion: string | null;
  duracion_estimada: number; // minutos
  costo: number | null;
  activo: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ProcedimientoCita {
  id_procedimiento_cita: number;
  id_cita: number;
  id_procedimiento: number;
  notas: string | null;
  created_at?: string;
  // Relaciones
  cita?: Cita;
  procedimiento?: Procedimiento;
}

export interface Documento {
  id_documento: number;
  id_historial?: number; // FK a HISTORIAL_CLINICO
  id_paciente?: number; // FK directa a PACIENTES para docs generales
  nombre_archivo: string;
  tipo_archivo: string;
  tamano_bytes: number;
  url_almacenamiento: string; // URL en Cloud Storage
  descripcion: string | null;
  fecha_subida: string; // DATETIME
  subido_por: number; // FK a USUARIOS
  categoria: CategoriaDocumento;
  es_confidencial: boolean;
  activo: boolean;
  // Análisis IA
  analisis_ia?: AnalisisIADocumento | null;
  created_at?: string;
  updated_at?: string;
  // Relaciones
  historial_clinico?: HistorialClinico;
  paciente?: Paciente;
  usuario_subida?: Usuario;
}

export type CategoriaDocumento = 
  | 'Radiología' 
  | 'Laboratorio' 
  | 'Cirugía' 
  | 'Consulta' 
  | 'Administrativo'
  | 'Imagenes Médicas'
  | 'Videos'
  | 'Reportes';

export interface AnalisisIADocumento {
  completado: boolean;
  fecha_analisis: string;
  hallazgos: string[];
  confianza: number; // 0-100
  resumen: string;
  recomendaciones_medicas: string[];
  tipo_analisis: 'imagen-medica' | 'documento-texto' | 'video-procedimiento';
}

// Interfaces para operaciones de la base de datos

export interface DatabaseConnection {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  ssl: boolean;
}

export interface QueryResult<T = any> {
  rows: T[];
  rowCount: number;
  command: string;
  success: boolean;
  error?: string;
}

export interface DatabaseTransaction {
  id: string;
  queries: string[];
  timestamp: string;
  committed: boolean;
}

// Interfaces para autenticación y sesiones

export interface SesionUsuario {
  token: string;
  id_usuario: number;
  usuario: Usuario;
  fecha_inicio: string;
  fecha_expiracion: string;
  ip_address: string;
  user_agent: string;
  activa: boolean;
}

export interface LoginCredentials {
  email: string; // email para autenticación
  password: string;
  remember_me?: boolean;
}

export interface LoginResponse {
  success: boolean;
  token?: string;
  usuario?: Usuario;
  permisos?: PermisosRol;
  error?: string;
  requires_2fa?: boolean;
}

// Interfaces para reportes y analytics

export interface ReporteMetrica {
  nombre: string;
  valor: number;
  unidad: string;
  fecha: string;
  comparacion_anterior?: number;
  tendencia: 'up' | 'down' | 'stable';
}

export interface DatosPacientesPorMes {
  mes: string;
  nuevos: number;
  seguimiento: number;
  cirugias: number;
}

export interface DistribucionDiagnosticos {
  diagnostico: string;
  cantidad: number;
  porcentaje: number;
}

// Tipos de utilidad para operaciones CRUD

export type CreatePaciente = Omit<Paciente, 'id_paciente' | 'created_at' | 'updated_at'>;
export type UpdatePaciente = Partial<CreatePaciente> & { id_paciente: number };

export type CreateHistorialClinico = Omit<HistorialClinico, 'id_historial' | 'created_at' | 'updated_at'>;
export type UpdateHistorialClinico = Partial<CreateHistorialClinico> & { id_historial: number };

export type CreateUsuario = Omit<Usuario, 'id_usuario' | 'hash_password' | 'created_at' | 'updated_at'> & { 
  password: string; 
};
export type UpdateUsuario = Partial<Omit<CreateUsuario, 'password'>> & { 
  id_usuario: number;
  password?: string;
};

export type CreateCita = Omit<Cita, 'id_cita' | 'created_at' | 'updated_at'>;
export type UpdateCita = Partial<CreateCita> & { id_cita: number };

export type CreateDocumento = Omit<Documento, 'id_documento' | 'created_at' | 'updated_at'>;
export type UpdateDocumento = Partial<CreateDocumento> & { id_documento: number };

// Filtros y búsquedas

export interface FiltrosPacientes {
  nombre?: string;
  apellido?: string;
  activo?: boolean;
  fecha_desde?: string;
  fecha_hasta?: string;
  tiene_citas_pendientes?: boolean;
}

export interface FiltrosCitas {
  id_paciente?: number;
  estado?: EstadoCita;
  tipo_cita?: TipoCita;
  fecha_desde?: string;
  fecha_hasta?: string;
  medico?: string;
}

export interface FiltrosDocumentos {
  id_paciente?: number;
  categoria?: CategoriaDocumento;
  fecha_desde?: string;
  fecha_hasta?: string;
  con_analisis_ia?: boolean;
  tipo_archivo?: string;
}

export interface FiltrosAuditoria {
  tabla_afectada?: string;
  tipo_operacion?: TipoOperacion;
  id_usuario_autor?: number;
  fecha_desde?: string;
  fecha_hasta?: string;
}

// Configuración de índices (para referencia de la estrategia de indexación)

export interface ConfiguracionIndice {
  tabla: string;
  columnas: string[];
  tipo: 'btree' | 'hash' | 'gin' | 'gist';
  unico: boolean;
  nombre: string;
}

export const INDICES_RECOMENDADOS: ConfiguracionIndice[] = [
  // Tabla PACIENTES
  { tabla: 'pacientes', columnas: ['nombre', 'apellido'], tipo: 'btree', unico: false, nombre: 'idx_pacientes_nombre_apellido' },
  { tabla: 'pacientes', columnas: ['activo'], tipo: 'btree', unico: false, nombre: 'idx_pacientes_activo' },
  
  // Tabla HISTORIAL_CLINICO
  { tabla: 'historial_clinico', columnas: ['id_paciente'], tipo: 'btree', unico: false, nombre: 'idx_historial_paciente' },
  { tabla: 'historial_clinico', columnas: ['fecha_consulta'], tipo: 'btree', unico: false, nombre: 'idx_historial_fecha' },
  
  // Tabla CITAS
  { tabla: 'citas', columnas: ['id_paciente'], tipo: 'btree', unico: false, nombre: 'idx_citas_paciente' },
  { tabla: 'citas', columnas: ['fecha_hora'], tipo: 'btree', unico: false, nombre: 'idx_citas_fecha_hora' },
  { tabla: 'citas', columnas: ['estado'], tipo: 'btree', unico: false, nombre: 'idx_citas_estado' },
  
  // Tabla USUARIOS
  { tabla: 'usuarios', columnas: ['nombre'], tipo: 'btree', unico: true, nombre: 'idx_usuarios_nombre_unique' },
  { tabla: 'usuarios', columnas: ['id_role'], tipo: 'btree', unico: false, nombre: 'idx_usuarios_role' },
  { tabla: 'usuarios', columnas: ['activo'], tipo: 'btree', unico: false, nombre: 'idx_usuarios_activo' },
  
  // Tabla LOGS_AUDITORIA
  { tabla: 'logs_auditoria', columnas: ['fecha_hora'], tipo: 'btree', unico: false, nombre: 'idx_logs_fecha_hora' },
  { tabla: 'logs_auditoria', columnas: ['id_usuario_autor'], tipo: 'btree', unico: false, nombre: 'idx_logs_usuario' },
  { tabla: 'logs_auditoria', columnas: ['tabla_afectada', 'id_registro_afectado'], tipo: 'btree', unico: false, nombre: 'idx_logs_tabla_registro' },
  { tabla: 'logs_auditoria', columnas: ['tipo_operacion'], tipo: 'btree', unico: false, nombre: 'idx_logs_operacion' },
  
  // Tabla DOCUMENTOS
  { tabla: 'documentos', columnas: ['id_paciente'], tipo: 'btree', unico: false, nombre: 'idx_documentos_paciente' },
  { tabla: 'documentos', columnas: ['id_historial'], tipo: 'btree', unico: false, nombre: 'idx_documentos_historial' },
  { tabla: 'documentos', columnas: ['categoria'], tipo: 'btree', unico: false, nombre: 'idx_documentos_categoria' },
  { tabla: 'documentos', columnas: ['fecha_subida'], tipo: 'btree', unico: false, nombre: 'idx_documentos_fecha_subida' }
];