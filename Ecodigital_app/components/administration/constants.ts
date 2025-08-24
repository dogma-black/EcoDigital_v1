export const ROLES = {
  ADMIN_PRINCIPAL: 'admin-principal',
  ADMIN_SECUNDARIO: 'admin-secundario',
  ASISTENTE: 'asistente',
  INVITADO: 'invitado'
} as const;

export const ROLE_DISPLAY_NAMES = {
  [ROLES.ADMIN_PRINCIPAL]: 'Admin Principal',
  [ROLES.ADMIN_SECUNDARIO]: 'Admin Secundario',
  [ROLES.ASISTENTE]: 'Asistente',
  [ROLES.INVITADO]: 'Invitado'
} as const;

export const ROLE_COLORS = {
  [ROLES.ADMIN_PRINCIPAL]: 'bg-red-500/20 text-red-400 border-red-500/30',
  [ROLES.ADMIN_SECUNDARIO]: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  [ROLES.ASISTENTE]: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  [ROLES.INVITADO]: 'bg-gray-500/20 text-gray-400 border-gray-500/30'
} as const;

export const STATUS_COLORS = {
  'Activo': 'bg-green-500/20 text-green-400 border-green-500/30',
  'Inactivo': 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  'Suspendido': 'bg-red-500/20 text-red-400 border-red-500/30'
} as const;

export const PERMISSION_MODULES = [
  { key: 'dashboard', name: 'Dashboard', icon: 'Settings' },
  { key: 'pacientes', name: 'Pacientes', icon: 'Users' },
  { key: 'citas', name: 'Citas', icon: 'Calendar' },
  { key: 'documentos', name: 'Documentos', icon: 'Archive' },
  { key: 'reportes', name: 'Reportes', icon: 'Activity' },
  { key: 'administracion', name: 'Administración', icon: 'Shield' },
  { key: 'ia-asistente', name: 'IA Asistente', icon: 'BrainCircuit' },
  { key: 'compliance', name: 'Compliance', icon: 'CheckCircle' },
  { key: 'auditorias', name: 'Auditorías', icon: 'Eye' },
  { key: 'system-logs', name: 'System Logs', icon: 'Activity' }
] as const;