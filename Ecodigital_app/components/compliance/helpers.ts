import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  XCircle, 
  Activity,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { ComplianceReport } from './types';
import { COMPLIANCE_TYPES } from './constants';

export const getStatusColor = (estado: string): string => {
  switch (estado) {
    case 'cumplido':
      return 'bg-green-500/20 text-green-400 border-green-500/30';
    case 'en-revision':
      return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    case 'pendiente':
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    case 'vencido':
      return 'bg-red-500/20 text-red-400 border-red-500/30';
    default:
      return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  }
};

export const getStatusIcon = (estado: string) => {
  switch (estado) {
    case 'cumplido':
      return CheckCircle2;
    case 'en-revision':
      return Clock;
    case 'pendiente':
      return AlertTriangle;
    case 'vencido':
      return XCircle;
    default:
      return Activity;
  }
};

export const getRiskColor = (nivel: string): string => {
  switch (nivel) {
    case 'critico':
      return 'bg-red-600/20 text-red-300 border-red-600/30';
    case 'alto':
      return 'bg-red-500/20 text-red-400 border-red-500/30';
    case 'medio':
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    case 'bajo':
      return 'bg-green-500/20 text-green-400 border-green-500/30';
    default:
      return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  }
};

export const getPriorityColor = (prioridad: string): string => {
  switch (prioridad) {
    case 'alta':
      return 'bg-red-500/20 text-red-400 border-red-500/30';
    case 'media':
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    case 'baja':
      return 'bg-green-500/20 text-green-400 border-green-500/30';
    default:
      return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  }
};

export const getTrendIcon = (tendencia: string) => {
  switch (tendencia) {
    case 'up':
      return TrendingUp;
    case 'down':
      return TrendingDown;
    default:
      return Activity;
  }
};

export const calculateOverallCompliance = (reports: ComplianceReport[]): number => {
  if (reports.length === 0) return 0;
  const total = reports.reduce((sum, report) => sum + report.porcentaje_cumplimiento, 0);
  return Math.round(total / reports.length);
};

export const filterReports = (
  reports: ComplianceReport[],
  searchTerm: string,
  selectedType: string,
  selectedStatus: string
): ComplianceReport[] => {
  return reports.filter(report => {
    const matchesSearch = report.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedType === 'all' || report.tipo === selectedType;
    const matchesStatus = selectedStatus === 'all' || report.estado === selectedStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });
};

export const getComplianceTypeConfig = (tipo: string) => {
  return COMPLIANCE_TYPES.find(t => t.value === tipo);
};

export const getRiskDistribution = (reports: ComplianceReport[]) => {
  const allFindings = reports.flatMap(r => r.hallazgos);
  const total = allFindings.length;
  
  return ['critico', 'alto', 'medio', 'bajo'].map(risk => {
    const count = allFindings.filter(f => f.nivel_riesgo === risk).length;
    const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
    
    return {
      risk,
      count,
      percentage,
      total
    };
  });
};

export const getRecentFindings = (reports: ComplianceReport[], limit: number = 10) => {
  return reports.flatMap(report => 
    report.hallazgos.map(finding => ({ ...finding, report_title: report.titulo }))
  ).slice(0, limit);
};

export const getPendingActions = (reports: ComplianceReport[], limit: number = 4) => {
  return reports.flatMap(report => 
    report.acciones_correctivas.filter(action => action.estado !== 'completada')
  ).slice(0, limit);
};