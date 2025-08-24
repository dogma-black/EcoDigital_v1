import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { 
  FileSearch,
  Calendar,
  User,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  TrendingUp,
  BarChart3,
  FileText,
  Download,
  Eye,
  Search,
  Filter,
  Stethoscope,
  Activity,
  Shield
} from 'lucide-react';
import { useAuth } from './AuthContext';

interface MedicalAudit {
  id: string;
  titulo: string;
  tipo: 'Calidad Médica' | 'Seguridad Paciente' | 'Cumplimiento' | 'Proceso Quirúrgico' | 'Documentación';
  descripcion: string;
  fecha_inicio: string;
  fecha_fin?: string;
  estado: 'planificada' | 'en-progreso' | 'completada' | 'cancelada';
  auditor_principal: string;
  departamento_auditado: string;
  alcance: string[];
  hallazgos: AuditFinding[];
  recomendaciones: AuditRecommendation[];
  plan_accion: ActionPlan[];
  puntuacion_global: number;
  nivel_riesgo: 'bajo' | 'medio' | 'alto' | 'critico';
}

interface AuditFinding {
  id: string;
  categoria: string;
  descripcion: string;
  evidencia: string;
  impacto: 'bajo' | 'medio' | 'alto' | 'critico';
  estado: 'abierto' | 'en-progreso' | 'cerrado';
  fecha_identificacion: string;
}

interface AuditRecommendation {
  id: string;
  descripcion: string;
  prioridad: 'baja' | 'media' | 'alta';
  plazo_implementacion: string;
  responsable: string;
  estado: 'pendiente' | 'en-progreso' | 'implementada';
}

interface ActionPlan {
  id: string;
  accion: string;
  responsable: string;
  fecha_limite: string;
  progreso: number;
  estado: 'no-iniciada' | 'en-progreso' | 'completada' | 'retrasada';
}

export function MedicalAudits() {
  const { currentUser, hasPermission } = useAuth();
  const [audits, setAudits] = useState<MedicalAudit[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAudit, setSelectedAudit] = useState<MedicalAudit | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Mock data
  const mockAudits: MedicalAudit[] = [
    {
      id: 'audit-001',
      titulo: 'Auditoría de Calidad - Procedimientos Quirúrgicos Q1 2024',
      tipo: 'Calidad Médica',
      descripcion: 'Evaluación integral de la calidad en procedimientos de cirugía de columna',
      fecha_inicio: '2024-01-15T00:00:00Z',
      fecha_fin: '2024-02-15T00:00:00Z',
      estado: 'completada',
      auditor_principal: 'Dr. Joel Sánchez García',
      departamento_auditado: 'Cirugía de Columna',
      alcance: ['Procedimientos quirúrgicos', 'Protocolos de seguridad', 'Documentación médica'],
      puntuacion_global: 92,
      nivel_riesgo: 'bajo',
      hallazgos: [
        {
          id: 'finding-001',
          categoria: 'Protocolo Quirúrgico',
          descripcion: 'Excelente adherencia a protocolos de asepsia y antisepsia',
          evidencia: 'Observación directa de 15 procedimientos',
          impacto: 'bajo',
          estado: 'cerrado',
          fecha_identificacion: '2024-01-20T00:00:00Z'
        },
        {
          id: 'finding-002',
          categoria: 'Documentación',
          descripcion: 'Oportunidad de mejora en documentación post-operatoria inmediata',
          evidencia: 'Revisión de 25 expedientes',
          impacto: 'medio',
          estado: 'cerrado',
          fecha_identificacion: '2024-01-25T00:00:00Z'
        }
      ],
      recomendaciones: [
        {
          id: 'rec-001',
          descripcion: 'Implementar checklist digital para documentación post-operatoria',
          prioridad: 'media',
          plazo_implementacion: '2024-03-31',
          responsable: 'Ana Laura Aguilar',
          estado: 'implementada'
        }
      ],
      plan_accion: [
        {
          id: 'action-001',
          accion: 'Desarrollar e implementar checklist digital post-quirúrgico',
          responsable: 'Ana Laura Aguilar',
          fecha_limite: '2024-03-31T00:00:00Z',
          progreso: 100,
          estado: 'completada'
        }
      ]
    },
    {
      id: 'audit-002',
      titulo: 'Auditoría de Seguridad del Paciente - Prevención de Infecciones',
      tipo: 'Seguridad Paciente',
      descripcion: 'Evaluación de medidas de prevención y control de infecciones hospitalarias',
      fecha_inicio: '2024-02-01T00:00:00Z',
      estado: 'en-progreso',
      auditor_principal: 'Ana Laura Aguilar',
      departamento_auditado: 'Toda la Unidad',
      alcance: ['Control de infecciones', 'Higiene hospitalaria', 'Protocolos de aislamiento'],
      puntuacion_global: 0,
      nivel_riesgo: 'medio',
      hallazgos: [
        {
          id: 'finding-003',
          categoria: 'Higiene de Manos',
          descripcion: 'Cumplimiento del 95% en protocolo de higiene de manos',
          evidencia: 'Observación durante 2 semanas',
          impacto: 'bajo',
          estado: 'abierto',
          fecha_identificacion: '2024-02-05T00:00:00Z'
        }
      ],
      recomendaciones: [
        {
          id: 'rec-002',
          descripcion: 'Reforzar capacitación en técnicas de higiene de manos',
          prioridad: 'alta',
          plazo_implementacion: '2024-03-15',
          responsable: 'Dr. Joel Sánchez García',
          estado: 'en-progreso'
        }
      ],
      plan_accion: [
        {
          id: 'action-002',
          accion: 'Programa de capacitación mensual en higiene hospitalaria',
          responsable: 'Dr. Joel Sánchez García',
          fecha_limite: '2024-03-15T00:00:00Z',
          progreso: 60,
          estado: 'en-progreso'
        }
      ]
    },
    {
      id: 'audit-003',
      titulo: 'Auditoría de Documentación Médica - Expedientes Clínicos',
      tipo: 'Documentación',
      descripcion: 'Revisión de la completitud y calidad de expedientes clínicos',
      fecha_inicio: '2024-02-15T00:00:00Z',
      estado: 'planificada',
      auditor_principal: 'Ana Laura Aguilar',
      departamento_auditado: 'Administración Médica',
      alcance: ['Expedientes clínicos', 'Consentimientos informados', 'Notas médicas'],
      puntuacion_global: 0,
      nivel_riesgo: 'medio',
      hallazgos: [],
      recomendaciones: [],
      plan_accion: []
    }
  ];

  useEffect(() => {
    loadAuditsData();
  }, []);

  const loadAuditsData = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAudits(mockAudits);
    } catch (error) {
      console.error('Error loading audits data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAudits = audits.filter(audit => {
    const matchesSearch = audit.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         audit.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || audit.tipo === selectedType;
    const matchesStatus = selectedStatus === 'all' || audit.estado === selectedStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'completada':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'en-progreso':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'planificada':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'cancelada':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusIcon = (estado: string) => {
    switch (estado) {
      case 'completada':
        return CheckCircle2;
      case 'en-progreso':
        return Clock;
      case 'planificada':
        return Calendar;
      case 'cancelada':
        return XCircle;
      default:
        return Activity;
    }
  };

  const getRiskColor = (nivel: string) => {
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

  const getImpactColor = (impacto: string) => {
    switch (impacto) {
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

  const calculateOverallScore = () => {
    const completedAudits = audits.filter(a => a.estado === 'completada' && a.puntuacion_global > 0);
    if (completedAudits.length === 0) return 0;
    
    const total = completedAudits.reduce((sum, audit) => sum + audit.puntuacion_global, 0);
    return Math.round(total / completedAudits.length);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white text-2xl font-bold flex items-center gap-3">
            <FileSearch className="w-8 h-8 text-blue-400" />
            Auditorías Médicas
          </h1>
          <p className="text-white/60">Sistema de auditorías y control de calidad médica</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <span className="text-blue-400 text-sm">Puntuación Promedio: {calculateOverallScore()}%</span>
          </div>
          {hasPermission('audits', 'write') && (
            <Button className="apple-button-primary">
              <FileText className="w-4 h-4 mr-2" />
              Nueva Auditoría
            </Button>
          )}
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="apple-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-white/60 text-sm">Completadas</p>
                <p className="text-white text-xl font-bold">
                  {audits.filter(a => a.estado === 'completada').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="apple-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-white/60 text-sm">En Progreso</p>
                <p className="text-white text-xl font-bold">
                  {audits.filter(a => a.estado === 'en-progreso').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="apple-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-white/60 text-sm">Planificadas</p>
                <p className="text-white text-xl font-bold">
                  {audits.filter(a => a.estado === 'planificada').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="apple-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-white/60 text-sm">Puntuación</p>
                <p className="text-white text-xl font-bold">{calculateOverallScore()}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 bg-white/5">
          <TabsTrigger value="dashboard" className="text-white data-[state=active]:bg-white/10">
            <BarChart3 className="w-4 h-4 mr-2" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="audits" className="text-white data-[state=active]:bg-white/10">
            <FileSearch className="w-4 h-4 mr-2" />
            Auditorías
          </TabsTrigger>
          <TabsTrigger value="findings" className="text-white data-[state=active]:bg-white/10">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Hallazgos
          </TabsTrigger>
          <TabsTrigger value="analytics" className="text-white data-[state=active]:bg-white/10">
            <TrendingUp className="w-4 h-4 mr-2" />
            Análisis
          </TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard">
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Audits */}
              <Card className="apple-card">
                <CardHeader>
                  <CardTitle className="text-white">Auditorías Recientes</CardTitle>
                  <CardDescription>Últimas auditorías realizadas</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {audits.slice(0, 3).map(audit => {
                    const StatusIcon = getStatusIcon(audit.estado);
                    return (
                      <div key={audit.id} className="p-3 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors"
                           onClick={() => setSelectedAudit(audit)}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white text-sm font-medium">{audit.titulo}</span>
                          <Badge className={getStatusColor(audit.estado)}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {audit.estado}
                          </Badge>
                        </div>
                        <p className="text-white/60 text-xs mb-2">{audit.descripcion}</p>
                        <div className="flex items-center justify-between text-xs text-white/40">
                          <span>Por: {audit.auditor_principal}</span>
                          {audit.puntuacion_global > 0 && (
                            <span>Puntuación: {audit.puntuacion_global}%</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              {/* Action Plans Status */}
              <Card className="apple-card">
                <CardHeader>
                  <CardTitle className="text-white">Estado de Planes de Acción</CardTitle>
                  <CardDescription>Progreso de acciones correctivas</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {audits.flatMap(audit => audit.plan_accion).slice(0, 4).map(action => (
                    <div key={action.id} className="p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white text-sm font-medium">{action.responsable}</span>
                        <Badge className={
                          action.estado === 'completada' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                          action.estado === 'en-progreso' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                          action.estado === 'retrasada' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                          'bg-gray-500/20 text-gray-400 border-gray-500/30'
                        }>
                          {action.estado}
                        </Badge>
                      </div>
                      <p className="text-white/80 text-xs mb-2">{action.accion}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-white/60 text-xs">
                          Vence: {new Date(action.fecha_limite).toLocaleDateString()}
                        </span>
                        <div className="flex items-center gap-2">
                          <Progress value={action.progreso} className="w-16 h-2" />
                          <span className="text-white/60 text-xs">{action.progreso}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Quality Metrics */}
            <Card className="apple-card">
              <CardHeader>
                <CardTitle className="text-white">Métricas de Calidad</CardTitle>
                <CardDescription>Indicadores de rendimiento por área</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <h4 className="text-white font-medium">Calidad Médica</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-white/60">Procedimientos</span>
                        <span className="text-white">92%</span>
                      </div>
                      <Progress value={92} className="h-2" />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="text-white font-medium">Seguridad Paciente</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-white/60">Protocolos</span>
                        <span className="text-white">95%</span>
                      </div>
                      <Progress value={95} className="h-2" />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="text-white font-medium">Documentación</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-white/60">Completitud</span>
                        <span className="text-white">88%</span>
                      </div>
                      <Progress value={88} className="h-2" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Audits Tab */}
        <TabsContent value="audits">
          <div className="space-y-6">
            {/* Filters */}
            <Card className="apple-card">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1">
                    <Label className="text-white mb-2 block">Buscar auditorías</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-white/40" />
                      <Input
                        placeholder="Buscar por título o descripción..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-white/5 border-white/20 text-white"
                      />
                    </div>
                  </div>
                  
                  <div className="w-full lg:w-48">
                    <Label className="text-white mb-2 block">Tipo</Label>
                    <Select value={selectedType} onValueChange={setSelectedType}>
                      <SelectTrigger className="bg-white/5 border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos los tipos</SelectItem>
                        <SelectItem value="Calidad Médica">Calidad Médica</SelectItem>
                        <SelectItem value="Seguridad Paciente">Seguridad Paciente</SelectItem>
                        <SelectItem value="Cumplimiento">Cumplimiento</SelectItem>
                        <SelectItem value="Proceso Quirúrgico">Proceso Quirúrgico</SelectItem>
                        <SelectItem value="Documentación">Documentación</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="w-full lg:w-48">
                    <Label className="text-white mb-2 block">Estado</Label>
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger className="bg-white/5 border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos los estados</SelectItem>
                        <SelectItem value="completada">Completada</SelectItem>
                        <SelectItem value="en-progreso">En Progreso</SelectItem>
                        <SelectItem value="planificada">Planificada</SelectItem>
                        <SelectItem value="cancelada">Cancelada</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Audits List */}
            <div className="space-y-4">
              {filteredAudits.map(audit => {
                const StatusIcon = getStatusIcon(audit.estado);
                return (
                  <Card key={audit.id} className="apple-card apple-card-hover cursor-pointer"
                        onClick={() => setSelectedAudit(audit)}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-white font-medium">{audit.titulo}</h3>
                            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                              {audit.tipo}
                            </Badge>
                            <Badge className={getStatusColor(audit.estado)}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {audit.estado}
                            </Badge>
                            <Badge className={getRiskColor(audit.nivel_riesgo)}>
                              {audit.nivel_riesgo}
                            </Badge>
                          </div>
                          
                          <p className="text-white/60 text-sm mb-3">{audit.descripcion}</p>
                          
                          <div className="flex items-center gap-6 text-xs text-white/40">
                            <span>📅 Inicio: {new Date(audit.fecha_inicio).toLocaleDateString()}</span>
                            {audit.fecha_fin && (
                              <span>🏁 Fin: {new Date(audit.fecha_fin).toLocaleDateString()}</span>
                            )}
                            <span>👤 {audit.auditor_principal}</span>
                            <span>🏢 {audit.departamento_auditado}</span>
                          </div>
                        </div>
                        
                        <div className="text-right ml-4">
                          {audit.puntuacion_global > 0 ? (
                            <>
                              <div className="text-2xl font-bold text-white mb-1">{audit.puntuacion_global}%</div>
                              <Progress value={audit.puntuacion_global} className="w-24 h-2 mb-2" />
                            </>
                          ) : (
                            <div className="text-white/40 text-sm">Sin calificar</div>
                          )}
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-white/60">
                              {audit.hallazgos.length} hallazgos
                            </span>
                            <span className="text-xs text-white/60">
                              {audit.plan_accion.length} acciones
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </TabsContent>

        {/* Findings Tab */}
        <TabsContent value="findings">
          <div className="space-y-6">
            <Card className="apple-card">
              <CardHeader>
                <CardTitle className="text-white">Hallazgos de Auditoría</CardTitle>
                <CardDescription>Todos los hallazgos identificados en auditorías</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {audits.flatMap(audit => 
                  audit.hallazgos.map(finding => ({ ...finding, audit_title: audit.titulo }))
                ).map(finding => (
                  <div key={finding.id} className="p-4 bg-white/5 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-white font-medium">{finding.categoria}</span>
                          <Badge className={getImpactColor(finding.impacto)}>
                            {finding.impacto}
                          </Badge>
                          <Badge className={
                            finding.estado === 'cerrado' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                            finding.estado === 'en-progreso' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                            'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                          }>
                            {finding.estado}
                          </Badge>
                        </div>
                        <p className="text-white/80 text-sm mb-2">{finding.descripcion}</p>
                        <p className="text-white/60 text-xs mb-2">
                          <strong>Evidencia:</strong> {finding.evidencia}
                        </p>
                        <p className="text-white/40 text-xs">{finding.audit_title}</p>
                      </div>
                    </div>
                    <div className="text-xs text-white/40">
                      Identificado: {new Date(finding.fecha_identificacion).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Audit Trends */}
              <Card className="apple-card">
                <CardHeader>
                  <CardTitle className="text-white">Tendencias de Auditoría</CardTitle>
                  <CardDescription>Evolución de puntuaciones en el tiempo</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center border border-white/10 rounded-lg">
                    <div className="text-center">
                      <TrendingUp className="w-12 h-12 text-white/40 mx-auto mb-2" />
                      <p className="text-white/60">Gráfico de tendencias</p>
                      <p className="text-white/40 text-sm">Análisis temporal de calidad</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Risk Analysis */}
              <Card className="apple-card">
                <CardHeader>
                  <CardTitle className="text-white">Análisis de Riesgos</CardTitle>
                  <CardDescription>Distribución de niveles de riesgo</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center border border-white/10 rounded-lg">
                    <div className="text-center">
                      <BarChart3 className="w-12 h-12 text-white/40 mx-auto mb-2" />
                      <p className="text-white/60">Matriz de riesgos</p>
                      <p className="text-white/40 text-sm">Evaluación de impactos</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Performance Summary */}
            <Card className="apple-card">
              <CardHeader>
                <CardTitle className="text-white">Resumen de Rendimiento</CardTitle>
                <CardDescription>Indicadores clave de calidad médica</CardDescription>
              </CardHeader>
              <CardContent>
                <Alert className="border-blue-500/30 bg-blue-500/10">
                  <Stethoscope className="h-4 w-4 text-blue-400" />
                  <AlertDescription className="text-blue-400">
                    <strong>Estado General:</strong> El sistema mantiene altos estándares de calidad con una puntuación 
                    promedio del {calculateOverallScore()}%. Las auditorías han identificado {audits.flatMap(a => a.hallazgos).length} hallazgos 
                    con {audits.flatMap(a => a.plan_accion).filter(p => p.estado === 'completada').length} acciones correctivas implementadas exitosamente.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Audit Detail Modal */}
      {selectedAudit && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="apple-card w-full max-w-6xl max-h-[90vh] overflow-auto">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white">{selectedAudit.titulo}</CardTitle>
                  <CardDescription>{selectedAudit.descripcion}</CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white/60 hover:text-white"
                  onClick={() => setSelectedAudit(null)}
                >
                  ✕
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Audit Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-white/5 rounded-lg">
                <div>
                  <Label className="text-white/60">Tipo</Label>
                  <p className="text-white">{selectedAudit.tipo}</p>
                </div>
                <div>
                  <Label className="text-white/60">Estado</Label>
                  <Badge className={getStatusColor(selectedAudit.estado)}>
                    {selectedAudit.estado}
                  </Badge>
                </div>
                <div>
                  <Label className="text-white/60">Riesgo</Label>
                  <Badge className={getRiskColor(selectedAudit.nivel_riesgo)}>
                    {selectedAudit.nivel_riesgo}
                  </Badge>
                </div>
                <div>
                  <Label className="text-white/60">Puntuación</Label>
                  <p className="text-white text-lg font-bold">
                    {selectedAudit.puntuacion_global > 0 ? `${selectedAudit.puntuacion_global}%` : 'N/A'}
                  </p>
                </div>
              </div>

              {/* Scope */}
              {selectedAudit.alcance.length > 0 && (
                <div>
                  <Label className="text-white/60">Alcance de la Auditoría</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedAudit.alcance.map((item, index) => (
                      <Badge key={index} className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Findings */}
              {selectedAudit.hallazgos.length > 0 && (
                <div>
                  <Label className="text-white/60 text-lg">Hallazgos</Label>
                  <div className="space-y-3 mt-3">
                    {selectedAudit.hallazgos.map(finding => (
                      <div key={finding.id} className="p-3 bg-white/5 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-white font-medium">{finding.categoria}</span>
                          <Badge className={getImpactColor(finding.impacto)}>
                            {finding.impacto}
                          </Badge>
                          <Badge className={
                            finding.estado === 'cerrado' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                            finding.estado === 'en-progreso' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                            'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                          }>
                            {finding.estado}
                          </Badge>
                        </div>
                        <p className="text-white/80 text-sm mb-2">{finding.descripcion}</p>
                        <p className="text-white/60 text-xs">
                          <strong>Evidencia:</strong> {finding.evidencia}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Plan */}
              {selectedAudit.plan_accion.length > 0 && (
                <div>
                  <Label className="text-white/60 text-lg">Plan de Acción</Label>
                  <div className="space-y-3 mt-3">
                    {selectedAudit.plan_accion.map(action => (
                      <div key={action.id} className="p-3 bg-white/5 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white font-medium">{action.responsable}</span>
                          <Badge className={
                            action.estado === 'completada' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                            action.estado === 'en-progreso' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                            action.estado === 'retrasada' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                            'bg-gray-500/20 text-gray-400 border-gray-500/30'
                          }>
                            {action.estado}
                          </Badge>
                        </div>
                        <p className="text-white/80 text-sm mb-3">{action.accion}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-white/60 text-xs">
                            Fecha límite: {new Date(action.fecha_limite).toLocaleDateString()}
                          </span>
                          <div className="flex items-center gap-2">
                            <Progress value={action.progreso} className="w-24 h-2" />
                            <span className="text-white/60 text-xs">{action.progreso}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Button className="flex-1 apple-button-primary">
                  <Download className="w-4 h-4 mr-2" />
                  Descargar Reporte
                </Button>
                <Button className="flex-1 apple-button-secondary">
                  <Eye className="w-4 h-4 mr-2" />
                  Ver Evidencias
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}