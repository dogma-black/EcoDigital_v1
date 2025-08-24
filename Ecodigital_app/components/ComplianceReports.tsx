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
  Shield, 
  FileCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Clock,
  TrendingUp,
  FileText,
  Search,
  BarChart3,
  PieChart,
  Zap
} from 'lucide-react';
import { useAuth } from './AuthContext';
import { ComplianceReport, ComplianceMetric } from './compliance/types';
import { COMPLIANCE_TYPES, MOCK_REPORTS, MOCK_METRICS } from './compliance/constants';
import { 
  calculateOverallCompliance,
  filterReports,
  getStatusColor,
  getStatusIcon,
  getPriorityColor,
  getComplianceTypeConfig,
  getTrendIcon,
  getRiskDistribution,
  getPendingActions
} from './compliance/helpers';
import { ReportDetailModal } from './compliance/ReportDetailModal';

export function ComplianceReports() {
  const { currentUser, hasPermission } = useAuth();
  const [reports, setReports] = useState<ComplianceReport[]>([]);
  const [metrics, setMetrics] = useState<ComplianceMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<ComplianceReport | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  useEffect(() => {
    loadComplianceData();
  }, []);

  const loadComplianceData = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setReports(MOCK_REPORTS);
      setMetrics(MOCK_METRICS);
    } catch (error) {
      console.error('Error loading compliance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredReports = filterReports(reports, searchTerm, selectedType, selectedStatus);
  const overallCompliance = calculateOverallCompliance(reports);
  const riskDistribution = getRiskDistribution(reports);
  const pendingActions = getPendingActions(reports);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white text-2xl font-bold flex items-center gap-3">
            <Shield className="w-8 h-8 text-blue-400" />
            Reportes de Cumplimiento
          </h1>
          <p className="text-white/60">Gestión de normativas y cumplimiento regulatorio</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-green-400 text-sm">Cumplimiento: {overallCompliance}%</span>
          </div>
          {hasPermission('compliance', 'write') && (
            <Button className="apple-button-primary">
              <FileText className="w-4 h-4 mr-2" />
              Nuevo Reporte
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
                <p className="text-white/60 text-sm">Cumplidos</p>
                <p className="text-white text-xl font-bold">
                  {reports.filter(r => r.estado === 'cumplido').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="apple-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-white/60 text-sm">Pendientes</p>
                <p className="text-white text-xl font-bold">
                  {reports.filter(r => r.estado === 'pendiente').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="apple-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <p className="text-white/60 text-sm">Vencidos</p>
                <p className="text-white text-xl font-bold">
                  {reports.filter(r => r.estado === 'vencido').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="apple-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-white/60 text-sm">Promedio</p>
                <p className="text-white text-xl font-bold">{overallCompliance}%</p>
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
          <TabsTrigger value="reports" className="text-white data-[state=active]:bg-white/10">
            <FileCheck className="w-4 h-4 mr-2" />
            Reportes
          </TabsTrigger>
          <TabsTrigger value="findings" className="text-white data-[state=active]:bg-white/10">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Hallazgos
          </TabsTrigger>
          <TabsTrigger value="analytics" className="text-white data-[state=active]:bg-white/10">
            <PieChart className="w-4 h-4 mr-2" />
            Análisis
          </TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard">
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Compliance Metrics */}
              <Card className="apple-card">
                <CardHeader>
                  <CardTitle className="text-white">Métricas de Cumplimiento</CardTitle>
                  <CardDescription>Estado actual por categoría</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {metrics.map(metric => {
                    const TrendIcon = getTrendIcon(metric.tendencia);
                    return (
                      <div key={metric.categoria} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-white text-sm">{metric.categoria}</span>
                          <div className="flex items-center gap-2">
                            <TrendIcon className={`w-4 h-4 ${
                              metric.tendencia === 'up' ? 'text-green-400' :
                              metric.tendencia === 'down' ? 'text-red-400' : 'text-gray-400'
                            }`} />
                            <span className="text-white text-sm">{metric.cumplimiento}%</span>
                          </div>
                        </div>
                        <Progress value={metric.cumplimiento} className="h-2" />
                        <div className="flex justify-between text-xs text-white/60">
                          <span>{metric.items_cumplidos}/{metric.total_items} items</span>
                          <span className={
                            metric.tendencia === 'up' ? 'text-green-400' :
                            metric.tendencia === 'down' ? 'text-red-400' : 'text-gray-400'
                          }>
                            {metric.cambio > 0 ? '+' : ''}{metric.cambio}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              {/* Pending Actions */}
              <Card className="apple-card">
                <CardHeader>
                  <CardTitle className="text-white">Acciones Pendientes</CardTitle>
                  <CardDescription>Acciones correctivas que requieren atención</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pendingActions.map(action => (
                      <div key={action.id} className="p-3 bg-white/5 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white text-sm font-medium">{action.responsable}</span>
                          <Badge className={
                            action.estado === 'en-progreso' 
                              ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                              : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                          }>
                            {action.estado}
                          </Badge>
                        </div>
                        <p className="text-white/80 text-xs mb-2">{action.descripcion}</p>
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
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Reports */}
            <Card className="apple-card">
              <CardHeader>
                <CardTitle className="text-white">Reportes Recientes</CardTitle>
                <CardDescription>Últimos reportes actualizados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reports.slice(0, 3).map(report => {
                    const StatusIcon = getStatusIcon(report.estado);
                    return (
                      <div key={report.id} className="p-4 apple-card apple-card-hover cursor-pointer"
                           onClick={() => setSelectedReport(report)}>
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-white font-medium">{report.titulo}</h3>
                              <Badge className={getStatusColor(report.estado)}>
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {report.estado}
                              </Badge>
                              <Badge className={getPriorityColor(report.prioridad)}>
                                {report.prioridad}
                              </Badge>
                            </div>
                            <p className="text-white/60 text-sm mb-2">{report.descripcion}</p>
                            <div className="flex items-center gap-4 text-xs text-white/40">
                              <span>{report.responsable}</span>
                              <span>{report.departamento}</span>
                              <span>Actualizado: {new Date(report.ultima_revision).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-white mb-1">{report.porcentaje_cumplimiento}%</div>
                            <Progress value={report.porcentaje_cumplimiento} className="w-24 h-2" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports">
          <div className="space-y-6">
            {/* Filters */}
            <Card className="apple-card">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1">
                    <Label className="text-white mb-2 block">Buscar reportes</Label>
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
                        {COMPLIANCE_TYPES.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
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
                        <SelectItem value="cumplido">Cumplido</SelectItem>
                        <SelectItem value="pendiente">Pendiente</SelectItem>
                        <SelectItem value="en-revision">En revisión</SelectItem>
                        <SelectItem value="vencido">Vencido</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reports List */}
            <div className="space-y-4">
              {loading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <Card key={i} className="apple-card animate-pulse">
                      <CardContent className="p-6">
                        <div className="h-4 bg-white/10 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-white/5 rounded w-1/2"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : filteredReports.length === 0 ? (
                <Card className="apple-card">
                  <CardContent className="p-12 text-center">
                    <FileCheck className="w-12 h-12 text-white/40 mx-auto mb-4" />
                    <h3 className="text-white text-lg mb-2">No hay reportes</h3>
                    <p className="text-white/60">No se encontraron reportes que coincidan con los filtros aplicados.</p>
                  </CardContent>
                </Card>
              ) : (
                filteredReports.map(report => {
                  const StatusIcon = getStatusIcon(report.estado);
                  const typeConfig = getComplianceTypeConfig(report.tipo);
                  
                  return (
                    <Card key={report.id} className="apple-card apple-card-hover cursor-pointer"
                          onClick={() => setSelectedReport(report)}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-white font-medium">{report.titulo}</h3>
                              <Badge className={typeConfig?.color || 'bg-gray-500/20 text-gray-400 border-gray-500/30'}>
                                {report.tipo}
                              </Badge>
                              <Badge className={getStatusColor(report.estado)}>
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {report.estado}
                              </Badge>
                              <Badge className={getPriorityColor(report.prioridad)}>
                                {report.prioridad}
                              </Badge>
                            </div>
                            
                            <p className="text-white/60 text-sm mb-3">{report.descripcion}</p>
                            
                            <div className="flex items-center gap-6 text-xs text-white/40">
                              <span>📅 Creado: {new Date(report.fecha_creacion).toLocaleDateString()}</span>
                              {report.fecha_vencimiento && (
                                <span>⏰ Vence: {new Date(report.fecha_vencimiento).toLocaleDateString()}</span>
                              )}
                              <span>👤 {report.responsable}</span>
                              <span>🏢 {report.departamento}</span>
                            </div>
                          </div>
                          
                          <div className="text-right ml-4">
                            <div className="text-2xl font-bold text-white mb-1">{report.porcentaje_cumplimiento}%</div>
                            <Progress value={report.porcentaje_cumplimiento} className="w-24 h-2 mb-2" />
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-white/60">
                                {report.hallazgos.length} hallazgos
                              </span>
                              <span className="text-xs text-white/60">
                                {report.acciones_correctivas.length} acciones
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </div>
        </TabsContent>

        {/* Findings Tab */}
        <TabsContent value="findings">
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Risk Distribution */}
              <Card className="apple-card">
                <CardHeader>
                  <CardTitle className="text-white">Distribución de Riesgos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {riskDistribution.map(({ risk, count, percentage }) => (
                    <div key={risk} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-white text-sm capitalize">{risk}</span>
                        <span className="text-white text-sm">{count} ({percentage}%)</span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Recent Findings */}
              <Card className="apple-card lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-white">Hallazgos Recientes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 max-h-80 overflow-y-auto">
                  {reports.flatMap(report => 
                    report.hallazgos.map(finding => ({ ...finding, report_title: report.titulo }))
                  ).slice(0, 10).map(finding => (
                    <div key={finding.id} className="p-3 bg-white/5 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-white text-sm font-medium">{finding.categoria}</span>
                            <Badge className={
                              finding.nivel_riesgo === 'critico' ? 'bg-red-600/20 text-red-300 border-red-600/30' :
                              finding.nivel_riesgo === 'alto' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                              finding.nivel_riesgo === 'medio' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                              'bg-green-500/20 text-green-400 border-green-500/30'
                            }>
                              {finding.nivel_riesgo}
                            </Badge>
                            <Badge className={
                              finding.estado === 'cerrado' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                              finding.estado === 'en-progreso' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                              'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                            }>
                              {finding.estado}
                            </Badge>
                          </div>
                          <p className="text-white/80 text-xs mb-1">{finding.descripcion}</p>
                          <p className="text-white/60 text-xs">{finding.report_title}</p>
                        </div>
                      </div>
                      <div className="flex justify-between text-xs text-white/40">
                        <span>Identificado: {new Date(finding.fecha_identificacion).toLocaleDateString()}</span>
                        {finding.fecha_cierre && (
                          <span>Cerrado: {new Date(finding.fecha_cierre).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Compliance Trends */}
              <Card className="apple-card">
                <CardHeader>
                  <CardTitle className="text-white">Tendencias de Cumplimiento</CardTitle>
                  <CardDescription>Evolución del cumplimiento en el tiempo</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center border border-white/10 rounded-lg">
                    <div className="text-center">
                      <BarChart3 className="w-12 h-12 text-white/40 mx-auto mb-2" />
                      <p className="text-white/60">Gráfico de tendencias</p>
                      <p className="text-white/40 text-sm">Visualización de datos en tiempo real</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Risk Analysis */}
              <Card className="apple-card">
                <CardHeader>
                  <CardTitle className="text-white">Análisis de Riesgos</CardTitle>
                  <CardDescription>Distribución y evolución de riesgos identificados</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center border border-white/10 rounded-lg">
                    <div className="text-center">
                      <PieChart className="w-12 h-12 text-white/40 mx-auto mb-2" />
                      <p className="text-white/60">Análisis de riesgos</p>
                      <p className="text-white/40 text-sm">Matriz de riesgos actualizada</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Compliance Summary */}
            <Card className="apple-card">
              <CardHeader>
                <CardTitle className="text-white">Resumen Ejecutivo</CardTitle>
                <CardDescription>Análisis consolidado de cumplimiento y recomendaciones</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert className="border-blue-500/30 bg-blue-500/10">
                  <Shield className="h-4 w-4 text-blue-400" />
                  <AlertDescription className="text-blue-400">
                    <strong>Estado General:</strong> El sistema mantiene un nivel de cumplimiento del {overallCompliance}%, 
                    dentro de los parámetros aceptables. Se identificaron {reports.flatMap(r => r.hallazgos).filter(f => f.estado === 'abierto').length} hallazgos 
                    abiertos que requieren atención inmediata.
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                      <span className="text-green-400 font-medium">Fortalezas</span>
                    </div>
                    <ul className="text-white/80 text-sm space-y-1">
                      <li>• Cumplimiento HIPAA {'>'}90%</li>
                      <li>• Protocolos actualizados</li>
                      <li>• Personal capacitado</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-5 h-5 text-yellow-400" />
                      <span className="text-yellow-400 font-medium">Áreas de Mejora</span>
                    </div>
                    <ul className="text-white/80 text-sm space-y-1">
                      <li>• Autenticación 2FA</li>
                      <li>• Documentación respaldos</li>
                      <li>• Certificaciones equipos</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-5 h-5 text-blue-400" />
                      <span className="text-blue-400 font-medium">Recomendaciones</span>
                    </div>
                    <ul className="text-white/80 text-sm space-y-1">
                      <li>• Implementar 2FA Q1</li>
                      <li>• Auditoría mensual</li>
                      <li>• Capacitación continua</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Report Detail Modal */}
      {selectedReport && (
        <ReportDetailModal
          selectedReport={selectedReport}
          onClose={() => setSelectedReport(null)}
        />
      )}
    </div>
  );
}