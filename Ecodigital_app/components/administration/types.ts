export interface MedicalUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin-principal' | 'admin-secundario' | 'asistente' | 'invitado';
  department: string;
  specialization?: string;
  licenseNumber?: string;
  status: 'Activo' | 'Inactivo' | 'Suspendido';
  lastLogin: string;
  createdDate: string;
  permissions: {
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
  };
  twoFactorEnabled: boolean;
  lastPasswordChange: string;
  failedLoginAttempts: number;
}

export interface NewUserForm {
  name: string;
  email: string;
  phone: string;
  role: 'admin-secundario' | 'asistente' | 'invitado';
  department: string;
  specialization: string;
  licenseNumber: string;
}