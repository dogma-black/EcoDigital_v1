export interface ComplianceReport {
  id: string;
  titulo: string;
  tipo: 'HIPAA' | 'FDA' | 'COFEPRIS' | 'ISO27001' | 'Interno' | 'Auditoria';
  descripcion: string;
  fecha_creacion: string;
  fecha_vencimiento?: string;
  estado: 'cumplido' | 'pendiente' | 'vencido' | 'en-revision';
  porcentaje_cumplimiento: number;
  responsable: string;
  departamento: string;
  prioridad: 'alta' | 'media' | 'baja';
  hallazgos: ComplianceFinding[];
  acciones_correctivas: CorrectiveAction[];
  evidencias: Evidence[];
  ultima_revision: string;
}

export interface ComplianceFinding {
  id: string;
  categoria: string;
  descripcion: string;
  nivel_riesgo: 'critico' | 'alto' | 'medio' | 'bajo';
  estado: 'abierto' | 'en-progreso' | 'cerrado';
  fecha_identificacion: string;
  fecha_cierre?: string;
}

export interface CorrectiveAction {
  id: string;
  descripcion: string;
  responsable: string;
  fecha_limite: string;
  estado: 'pendiente' | 'en-progreso' | 'completada';
  progreso: number;
}

export interface Evidence {
  id: string;
  tipo: 'documento' | 'imagen' | 'certificado' | 'reporte';
  nombre: string;
  descripcion: string;
  fecha_subida: string;
  url: string;
}

export interface ComplianceMetric {
  categoria: string;
  cumplimiento: number;
  tendencia: 'up' | 'down' | 'stable';
  cambio: number;
  total_items: number;
  items_cumplidos: number;
}

export interface ComplianceType {
  value: string;
  label: string;
  color: string;
}