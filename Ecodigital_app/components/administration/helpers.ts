import { ROLE_DISPLAY_NAMES, ROLE_COLORS, STATUS_COLORS, ROLES } from './constants';
import { MedicalUser } from './types';

export const getRoleDisplayName = (role: string): string => {
  return ROLE_DISPLAY_NAMES[role as keyof typeof ROLE_DISPLAY_NAMES] || role;
};

export const getRoleColor = (role: string): string => {
  return ROLE_COLORS[role as keyof typeof ROLE_COLORS] || ROLE_COLORS[ROLES.INVITADO];
};

export const getStatusColor = (status: string): string => {
  return STATUS_COLORS[status as keyof typeof STATUS_COLORS] || STATUS_COLORS['Inactivo'];
};

export const formatLastLogin = (lastLogin: string): string => {
  if (!lastLogin) return 'Nunca';
  return new Date(lastLogin).toLocaleString('es-ES', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getDefaultPermissions = (role: MedicalUser['role']): MedicalUser['permissions'] => {
  switch (role) {
    case ROLES.ADMIN_PRINCIPAL:
      return {
        dashboard: { leer: true, escribir: true, eliminar: true },
        pacientes: { leer: true, escribir: true, eliminar: true },
        citas: { leer: true, escribir: true, eliminar: true },
        documentos: { leer: true, escribir: true, eliminar: true },
        reportes: { leer: true, escribir: true, eliminar: true },
        administracion: { leer: true, escribir: true, eliminar: true },
        'ia-asistente': { leer: true, escribir: true, eliminar: true },
        compliance: { leer: true, escribir: true, eliminar: true },
        auditorias: { leer: true, escribir: true, eliminar: true },
        'system-logs': { leer: true, escribir: true, eliminar: true }
      };
    case ROLES.ADMIN_SECUNDARIO:
      return {
        dashboard: { leer: true, escribir: true, eliminar: false },
        pacientes: { leer: true, escribir: true, eliminar: false },
        citas: { leer: true, escribir: true, eliminar: true },
        documentos: { leer: true, escribir: true, eliminar: false },
        reportes: { leer: true, escribir: true, eliminar: false },
        administracion: { leer: true, escribir: false, eliminar: false },
        'ia-asistente': { leer: true, escribir: true, eliminar: false },
        compliance: { leer: true, escribir: true, eliminar: false },
        auditorias: { leer: true, escribir: false, eliminar: false },
        'system-logs': { leer: true, escribir: false, eliminar: false }
      };
    case ROLES.ASISTENTE:
      return {
        dashboard: { leer: true, escribir: false, eliminar: false },
        pacientes: { leer: true, escribir: true, eliminar: false },
        citas: { leer: true, escribir: true, eliminar: false },
        documentos: { leer: true, escribir: true, eliminar: false },
        reportes: { leer: true, escribir: false, eliminar: false },
        administracion: { leer: false, escribir: false, eliminar: false },
        'ia-asistente': { leer: true, escribir: false, eliminar: false },
        compliance: { leer: false, escribir: false, eliminar: false },
        auditorias: { leer: false, escribir: false, eliminar: false },
        'system-logs': { leer: false, escribir: false, eliminar: false }
      };
    case ROLES.INVITADO:
    default:
      return {
        dashboard: { leer: true, escribir: false, eliminar: false },
        pacientes: { leer: true, escribir: false, eliminar: false },
        citas: { leer: true, escribir: false, eliminar: false },
        documentos: { leer: true, escribir: false, eliminar: false },
        reportes: { leer: true, escribir: false, eliminar: false },
        administracion: { leer: false, escribir: false, eliminar: false },
        'ia-asistente': { leer: true, escribir: false, eliminar: false },
        compliance: { leer: false, escribir: false, eliminar: false },
        auditorias: { leer: false, escribir: false, eliminar: false },
        'system-logs': { leer: false, escribir: false, eliminar: false }
      };
  }
};