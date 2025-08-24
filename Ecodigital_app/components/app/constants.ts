import { 
  Home, 
  Users, 
  Calendar, 
  FileText, 
  BarChart3, 
  Bot, 
  Shield,
  Activity,
  FileCheck,
  Stethoscope,
  Grid3X3,
  Folder
} from 'lucide-react';

export type ActivePanel = 
  | 'dashboard' 
  | 'patients' 
  | 'appointments' 
  | 'documents' 
  | 'reports' 
  | 'administration' 
  | 'ai-assistant'
  | 'compliance-reports'
  | 'system-logs'
  | 'medical-audits'
  | 'treatment-oversight';

export const navigationItems = [
  { 
    id: 'dashboard' as const, 
    label: 'Inicio', 
    icon: Home, 
    requiredPermission: { module: 'dashboard', action: 'leer' },
    category: 'main'
  },
  { 
    id: 'patients' as const, 
    label: 'Registros', 
    icon: FileText, 
    requiredPermission: { module: 'pacientes', action: 'leer' },
    category: 'main'
  },
  { 
    id: 'administration' as const, 
    label: 'Colaboradores', 
    icon: Users, 
    requiredPermission: { module: 'administracion', action: 'leer' },
    category: 'main'
  },
  { 
    id: 'reports' as const, 
    label: 'Reportes', 
    icon: BarChart3, 
    requiredPermission: { module: 'reportes', action: 'leer' },
    category: 'main'
  },
  { 
    id: 'appointments' as const, 
    label: 'Integraciones', 
    icon: Grid3X3, 
    requiredPermission: { module: 'citas', action: 'leer' },
    category: 'main'
  },
  { 
    id: 'compliance-reports' as const, 
    label: 'Reportes de Compliance', 
    icon: Shield, 
    requiredPermission: { module: 'compliance', action: 'leer' },
    category: 'compliance'
  },
  { 
    id: 'medical-audits' as const, 
    label: 'Auditorías Médicas', 
    icon: FileCheck, 
    requiredPermission: { module: 'auditorias', action: 'leer' },
    category: 'compliance'
  },
  { 
    id: 'treatment-oversight' as const, 
    label: 'Supervisión de Tratamientos', 
    icon: Stethoscope, 
    requiredPermission: { module: 'pacientes', action: 'leer' },
    category: 'compliance'
  },
  { 
    id: 'system-logs' as const, 
    label: 'Logs del Sistema', 
    icon: Activity, 
    requiredPermission: { module: 'system-logs', action: 'leer' },
    category: 'compliance'
  },
  { 
    id: 'ai-assistant' as const, 
    label: 'Asistente IA', 
    icon: Bot, 
    requiredPermission: { module: 'ia-asistente', action: 'leer' },
    category: 'ai'
  },
];

export const fileFolders = [
  { 
    id: 'general', 
    name: 'General', 
    icon: Folder, 
    count: 245,
    isOpen: false 
  },
  { 
    id: 'operaciones', 
    name: 'Operaciones', 
    icon: Folder, 
    count: 67,
    isOpen: false 
  },
  { 
    id: 'consultas', 
    name: 'Consultas', 
    icon: Folder, 
    count: 189,
    isOpen: false 
  },
  { 
    id: 'laboratorio', 
    name: 'Laboratorio', 
    icon: Folder, 
    count: 134,
    isOpen: false 
  },
];