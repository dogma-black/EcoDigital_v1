import { ComplianceReport, ComplianceMetric, ComplianceType } from './types';

export const COMPLIANCE_TYPES: ComplianceType[] = [
  { value: 'HIPAA', label: 'HIPAA', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  { value: 'FDA', label: 'FDA', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
  { value: 'COFEPRIS', label: 'COFEPRIS', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
  { value: 'ISO27001', label: 'ISO 27001', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  { value: 'Interno', label: 'Interno', color: 'bg-gray-500/20 text-gray-400 border-gray-500/30' },
  { value: 'Auditoria', label: 'Auditoría', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' }
];

export const MOCK_REPORTS: ComplianceReport[] = [
  {
    id: 'comp-001',
    titulo: 'Cumplimiento HIPAA - Q1 2024',
    tipo: 'HIPAA',
    descripcion: 'Evaluación trimestral de cumplimiento con regulaciones HIPAA para protección de datos de pacientes',
    fecha_creacion: '2024-01-01T00:00:00Z',
    fecha_vencimiento: '2024-03-31T23:59:59Z',
    estado: 'cumplido',
    porcentaje_cumplimiento: 94,
    responsable: 'Ana Laura Aguilar',
    departamento: 'Administración Médica',
    prioridad: 'alta',
    ultima_revision: '2024-01-15T10:30:00Z',
    hallazgos: [
      {
        id: 'find-001',
        categoria: 'Acceso de Datos',
        descripcion: 'Algunos usuarios mantienen sesiones activas por más de 8 horas',
        nivel_riesgo: 'medio',
        estado: 'cerrado',
        fecha_identificacion: '2024-01-10T00:00:00Z',
        fecha_cierre: '2024-01-20T00:00:00Z'
      }
    ],
    acciones_correctivas: [
      {
        id: 'action-001',
        descripcion: 'Implementar timeout automático de sesión después de 2 horas de inactividad',
        responsable: 'Soporte Técnico',
        fecha_limite: '2024-02-01T00:00:00Z',
        estado: 'completada',
        progreso: 100
      }
    ],
    evidencias: [
      {
        id: 'ev-001',
        tipo: 'documento',
        nombre: 'Reporte_Cumplimiento_HIPAA_Q1.pdf',
        descripcion: 'Reporte detallado de cumplimiento HIPAA',
        fecha_subida: '2024-01-15T00:00:00Z',
        url: '/documents/hipaa-q1-2024.pdf'
      }
    ]
  },
  {
    id: 'comp-002',
    titulo: 'Auditoría ISO 27001 - Seguridad Información',
    tipo: 'ISO27001',
    descripcion: 'Auditoría anual de seguridad de la información según ISO 27001',
    fecha_creacion: '2024-01-05T00:00:00Z',
    fecha_vencimiento: '2024-12-31T23:59:59Z',
    estado: 'en-revision',
    porcentaje_cumplimiento: 87,
    responsable: 'Dr. Joel Sánchez García',
    departamento: 'Dirección Médica',
    prioridad: 'alta',
    ultima_revision: '2024-01-18T14:20:00Z',
    hallazgos: [
      {
        id: 'find-002',
        categoria: 'Gestión de Contraseñas',
        descripcion: 'Política de contraseñas no incluye autenticación de dos factores',
        nivel_riesgo: 'alto',
        estado: 'en-progreso',
        fecha_identificacion: '2024-01-12T00:00:00Z'
      },
      {
        id: 'find-003',
        categoria: 'Respaldos',
        descripcion: 'Pruebas de restauración de respaldos no documentadas adecuadamente',
        nivel_riesgo: 'medio',
        estado: 'abierto',
        fecha_identificacion: '2024-01-15T00:00:00Z'
      }
    ],
    acciones_correctivas: [
      {
        id: 'action-002',
        descripcion: 'Implementar autenticación de dos factores para todos los usuarios',
        responsable: 'Soporte Técnico',
        fecha_limite: '2024-02-28T00:00:00Z',
        estado: 'en-progreso',
        progreso: 65
      },
      {
        id: 'action-003',
        descripcion: 'Documentar y programar pruebas mensuales de restauración',
        responsable: 'Administración Médica',
        fecha_limite: '2024-02-15T00:00:00Z',
        estado: 'pendiente',
        progreso: 0
      }
    ],
    evidencias: [
      {
        id: 'ev-002',
        tipo: 'reporte',
        nombre: 'Auditoria_ISO27001_2024.pdf',
        descripcion: 'Reporte de auditoría ISO 27001',
        fecha_subida: '2024-01-18T00:00:00Z',
        url: '/documents/iso27001-audit-2024.pdf'
      }
    ]
  },
  {
    id: 'comp-003',
    titulo: 'Normativa COFEPRIS - Dispositivos Médicos',
    tipo: 'COFEPRIS',
    descripcion: 'Cumplimiento de normativas mexicanas para uso de dispositivos médicos',
    fecha_creacion: '2024-01-10T00:00:00Z',
    fecha_vencimiento: '2024-06-30T23:59:59Z',
    estado: 'pendiente',
    porcentaje_cumplimiento: 72,
    responsable: 'Dr. Joel Sánchez García',
    departamento: 'Dirección Médica',
    prioridad: 'media',
    ultima_revision: '2024-01-20T09:15:00Z',
    hallazgos: [
      {
        id: 'find-004',
        categoria: 'Certificación Equipos',
        descripcion: 'Renovación pendiente de certificados de algunos equipos quirúrgicos',
        nivel_riesgo: 'alto',
        estado: 'abierto',
        fecha_identificacion: '2024-01-18T00:00:00Z'
      }
    ],
    acciones_correctivas: [
      {
        id: 'action-004',
        descripcion: 'Renovar certificaciones de equipos quirúrgicos',
        responsable: 'Dirección Médica',
        fecha_limite: '2024-03-15T00:00:00Z',
        estado: 'pendiente',
        progreso: 25
      }
    ],
    evidencias: []
  }
];

export const MOCK_METRICS: ComplianceMetric[] = [
  {
    categoria: 'Protección de Datos',
    cumplimiento: 94,
    tendencia: 'up',
    cambio: 3,
    total_items: 25,
    items_cumplidos: 23
  },
  {
    categoria: 'Seguridad Información',
    cumplimiento: 87,
    tendencia: 'down',
    cambio: -2,
    total_items: 30,
    items_cumplidos: 26
  },
  {
    categoria: 'Dispositivos Médicos',
    cumplimiento: 92,
    tendencia: 'stable',
    cambio: 0,
    total_items: 18,
    items_cumplidos: 16
  },
  {
    categoria: 'Auditorías Internas',
    cumplimiento: 89,
    tendencia: 'up',
    cambio: 5,
    total_items: 12,
    items_cumplidos: 11
  }
];