import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { 
  Stethoscope, 
  Search, 
  TrendingUp,
  TrendingDown,
  Users,
  Activity,
  Heart,
  AlertTriangle,
  CheckCircle,
  Clock,
  Calendar,
  User,
  FileText,
  Target,
  BarChart3,
  Eye
} from 'lucide-react';
import { useAuth, useActivityTracker } from './AuthContext';

interface TreatmentPlan {
  id: string;
  patientId: string;
  patientName: string;
  diagnosis: string;
  treatmentType: 'Conservador' | 'Quirúrgico' | 'Rehabilitación' | 'Combinado';
  status: 'Activo' | 'Completado' | 'Suspendido' | 'En Revisión';
  priority: 'Alta' | 'Media' | 'Baja';
  physician: string;
  startDate: string;
  expectedEndDate: string;
  actualEndDate?: string;
  progress: number;
  adherence: number;
  outcomes: TreatmentOutcome[];
  nextAppointment?: string;
  goals: TreatmentGoal[];
  medications: string[];
  complications: Complication[];
}

interface TreatmentOutcome {
  id: string;
  date: string;
  metric: string;
  value: number;
  target: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
}

interface TreatmentGoal {
  id: string;
  description: string;
  target: string;
  currentStatus: string;
  progress: number;
  dueDate: string;
  achieved: boolean;
}

interface Complication {
  id: string;
  date: string;
  type: 'Menor' | 'Mayor' | 'Grave';
  description: string;
  status: 'Activa' | 'Resuelta';
  intervention: string;
}

export function TreatmentOversight() {
  const { currentUser, hasPermission } = useAuth();
  const { trackActivity } = useActivityTracker();

  const [treatments, setTreatments] = useState<TreatmentPlan[]>([
    {
      id: 'TRT-001',
      patientId: 'PAT-001',
      patientName: 'María Elena González R.',
      diagnosis: 'Hernia discal L4-L5 con compresión radicular',
      treatmentType: 'Quirúrgico',
      status: 'Activo',
      priority: 'Alta',
      physician: 'Dr. Joel Sánchez García',
      startDate: '2024-12-15',
      expectedEndDate: '2025-03-15',
      progress: 25,
      adherence: 88,
      nextAppointment: '2025-01-15',
      goals: [
        {
          id: 'G1',
          description: 'Reducir dolor lumbar a 3/10 o menos',
          target: '≤3/10 en escala EVA',
          currentStatus: '5/10',
          progress: 60,
          dueDate: '2025-02-01',
          achieved: false
        },
        {
          id: 'G2',
          description: 'Recuperar movilidad completa',
          target: '100% rango de movimiento',
          currentStatus: '75%',
          progress: 75,
          dueDate: '2025-03-01',
          achieved: false
        }
      ],
      outcomes: [
        {
          id: 'OUT-1',
          date: '2024-12-15',
          metric: 'Dolor EVA',
          value: 8,
          target: 3,
          unit: '/10',
          trend: 'down'
        },
        {
          id: 'OUT-2',
          date: '2024-12-15',
          metric: 'Movilidad',
          value: 60,
          target: 90,
          unit: '%',
          trend: 'up'
        }
      ],
      medications: ['Ibuprofeno 400mg c/8hrs', 'Gabapentina 300mg c/12hrs'],
      complications: []
    },
    {
      id: 'TRT-002',
      patientId: 'PAT-002',
      patientName: 'Carlos Alberto Mendoza L.',
      diagnosis: 'Síndrome facetario cervical C5-C6 post-traumático',
      treatmentType: 'Conservador',
      status: 'Activo',
      priority: 'Media',
      physician: 'Dr. Joel Sánchez García',
      startDate: '2024-11-20',
      expectedEndDate: '2025-02-20',
      progress: 70,
      adherence: 92,
      nextAppointment: '2025-01-10',
      goals: [
        {
          id: 'G3',
          description: 'Eliminar cefalea occipital',
          target: '0 episodios por semana',
          currentStatus: '2 episodios/semana',
          progress: 80,
          dueDate: '2025-01-15',
          achieved: false
        }
      ],
      outcomes: [
        {
          id: 'OUT-3',
          date: '2024-12-10',
          metric: 'Dolor Cervical',
          value: 4,
          target: 2,
          unit: '/10',
          trend: 'down'
        }
      ],
      medications: ['Gabapentina 300mg c/12hrs', 'Fisioterapia cervical'],
      complications: []
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedTreatment, setSelectedTreatment] = useState<TreatmentPlan | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  const filteredTreatments = treatments.filter(treatment => {
    const matchesSearch = searchTerm === '' || 
      treatment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      treatment.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
      treatment.physician.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || treatment.status === statusFilter;
    const matchesType = typeFilter === 'all' || treatment.treatmentType === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Activo': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Completado': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Suspendido': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'En Revisión': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Alta': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'Media': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Baja': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-400" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-400" />;
      default: return <Activity className="h-4 w-4 text-gray-400" />;
    }
  };

  const getAdherenceColor = (adherence: number) => {
    if (adherence >= 90) return 'text-green-400';
    if (adherence >= 75) return 'text-yellow-400';
    return 'text-red-400';
  };

  const calculateOverallOutcome = (treatment: TreatmentPlan) => {
    if (treatment.outcomes.length === 0) return 0;
    const avg = treatment.outcomes.reduce((acc, outcome) => 
      acc + ((outcome.value / outcome.target) * 100), 0
    ) / treatment.outcomes.length;
    return Math.min(100, avg);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Supervisión de Tratamientos</h1>
          <p className="text-white/60 mt-1">
            Monitoreo integral de planes de tratamiento y resultados clínicos
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="apple-button-secondary">
            <BarChart3 className="h-4 w-4 mr-2" />
            Reportes de Resultados
          </Button>
          <Button className="apple-button-primary">
            <Target className="h-4 w-4 mr-2" />
            Nuevo Plan
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="apple-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm font-medium">Tratamientos Activos</p>
                <p className="text-3xl font-bold text-white">
                  {treatments.filter(t => t.status === 'Activo').length}
                </p>
                <p className="text-green-400 text-sm mt-1">
                  {treatments.filter(t => t.priority === 'Alta').length} alta prioridad
                </p>
              </div>
              <div className="p-3 bg-green-500/20 rounded-full">
                <Stethoscope className="h-8 w-8 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="apple-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm font-medium">Adherencia Promedio</p>
                <p className="text-3xl font-bold text-blue-400">
                  {Math.round(treatments.reduce((acc, t) => acc + t.adherence, 0) / treatments.length)}%
                </p>
                <p className="text-blue-400 text-sm mt-1">Excelente compliance</p>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-full">
                <Target className="h-8 w-8 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="apple-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm font-medium">Progreso Promedio</p>
                <p className="text-3xl font-bold text-purple-400">
                  {Math.round(treatments.reduce((acc, t) => acc + t.progress, 0) / treatments.length)}%
                </p>
                <p className="text-purple-400 text-sm mt-1">En progreso</p>
              </div>
              <div className="p-3 bg-purple-500/20 rounded-full">
                <Activity className="h-8 w-8 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="apple-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm font-medium">Complicaciones</p>
                <p className="text-3xl font-bold text-yellow-400">
                  {treatments.reduce((acc, t) => acc + t.complications.filter(c => c.status === 'Activa').length, 0)}
                </p>
                <p className="text-yellow-400 text-sm mt-1">Casos activos</p>
              </div>
              <div className="p-3 bg-yellow-500/20 rounded-full">
                <AlertTriangle className="h-8 w-8 text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="apple-card">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-white/40" />
              <Input
                placeholder="Buscar por paciente, diagnóstico o médico..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/5 border-white/20 text-white"
              />
            </div>
            
            <div className="flex gap-3">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40 bg-white/5 border-white/20 text-white">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent className="apple-card border border-white/20">
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="Activo">Activo</SelectItem>
                  <SelectItem value="Completado">Completado</SelectItem>
                  <SelectItem value="Suspendido">Suspendido</SelectItem>
                  <SelectItem value="En Revisión">En Revisión</SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-40 bg-white/5 border-white/20 text-white">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent className="apple-card border border-white/20">
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="Conservador">Conservador</SelectItem>
                  <SelectItem value="Quirúrgico">Quirúrgico</SelectItem>
                  <SelectItem value="Rehabilitación">Rehabilitación</SelectItem>
                  <SelectItem value="Combinado">Combinado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Treatments Table */}
      <Card className="apple-card">
        <CardHeader>
          <CardTitle className="text-white">Planes de Tratamiento</CardTitle>
          <CardDescription>
            {filteredTreatments.length} tratamientos bajo supervisión
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-white/80">Paciente</TableHead>
                <TableHead className="text-white/80">Tratamiento</TableHead>
                <TableHead className="text-white/80">Estado</TableHead>
                <TableHead className="text-white/80">Progreso</TableHead>
                <TableHead className="text-white/80">Adherencia</TableHead>
                <TableHead className="text-white/80">Próxima Cita</TableHead>
                <TableHead className="text-white/80">Médico</TableHead>
                <TableHead className="text-white/80">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTreatments.map((treatment) => (
                <TableRow key={treatment.id} className="hover:bg-white/5 transition-colors">
                  <TableCell>
                    <div>
                      <p className="font-medium text-white">{treatment.patientName}</p>
                      <p className="text-sm text-white/60 line-clamp-1">{treatment.diagnosis}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className={getPriorityColor(treatment.priority)}>
                          {treatment.priority}
                        </Badge>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                      {treatment.treatmentType}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(treatment.status)}>
                      {treatment.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-white">{treatment.progress}%</span>
                      </div>
                      <Progress value={treatment.progress} className="bg-white/10" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-center">
                      <p className={`text-lg font-bold ${getAdherenceColor(treatment.adherence)}`}>
                        {treatment.adherence}%
                      </p>
                      <p className="text-xs text-white/60">compliance</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {treatment.nextAppointment ? (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-blue-400" />
                        <span className="text-white text-sm">
                          {new Date(treatment.nextAppointment).toLocaleDateString('es-ES')}
                        </span>
                      </div>
                    ) : (
                      <span className="text-white/40 text-sm">Sin cita</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-blue-400" />
                      <span className="text-white text-sm">{treatment.physician}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedTreatment(treatment);
                        setShowDetail(true);
                      }}
                      className="apple-button-secondary"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Ver Detalles
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredTreatments.length === 0 && (
            <div className="text-center py-12">
              <Stethoscope className="h-12 w-12 text-white/20 mx-auto mb-4" />
              <p className="text-white/60">No se encontraron tratamientos con los filtros aplicados</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Treatment Detail Modal */}
      {selectedTreatment && (
        <div className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 ${showDetail ? '' : 'hidden'}`}>
          <Card className="apple-card max-w-4xl max-h-[90vh] overflow-y-auto w-full">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-white">{selectedTreatment.patientName}</CardTitle>
                  <CardDescription>{selectedTreatment.diagnosis}</CardDescription>
                </div>
                <Button variant="ghost" onClick={() => setShowDetail(false)} className="text-white/60">
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-white/5">
                  <TabsTrigger value="overview">Resumen</TabsTrigger>
                  <TabsTrigger value="goals">Objetivos</TabsTrigger>
                  <TabsTrigger value="outcomes">Resultados</TabsTrigger>
                  <TabsTrigger value="timeline">Cronología</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="apple-card">
                      <CardHeader>
                        <CardTitle className="text-white text-lg">Información del Tratamiento</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-white/80">Tipo:</span>
                          <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                            {selectedTreatment.treatmentType}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/80">Estado:</span>
                          <Badge variant="outline" className={getStatusColor(selectedTreatment.status)}>
                            {selectedTreatment.status}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/80">Prioridad:</span>
                          <Badge variant="outline" className={getPriorityColor(selectedTreatment.priority)}>
                            {selectedTreatment.priority}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/80">Médico:</span>
                          <span className="text-white">{selectedTreatment.physician}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/80">Inicio:</span>
                          <span className="text-white">
                            {new Date(selectedTreatment.startDate).toLocaleDateString('es-ES')}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/80">Fin Esperado:</span>
                          <span className="text-white">
                            {new Date(selectedTreatment.expectedEndDate).toLocaleDateString('es-ES')}
                          </span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="apple-card">
                      <CardHeader>
                        <CardTitle className="text-white text-lg">Métricas de Progreso</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-white/80">Progreso General</span>
                            <span className="text-white font-bold">{selectedTreatment.progress}%</span>
                          </div>
                          <Progress value={selectedTreatment.progress} className="bg-white/10" />
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-white/80">Adherencia al Tratamiento</span>
                            <span className={`font-bold ${getAdherenceColor(selectedTreatment.adherence)}`}>
                              {selectedTreatment.adherence}%
                            </span>
                          </div>
                          <Progress value={selectedTreatment.adherence} className="bg-white/10" />
                        </div>

                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-white/80">Resultados Clínicos</span>
                            <span className="text-white font-bold">
                              {Math.round(calculateOverallOutcome(selectedTreatment))}%
                            </span>
                          </div>
                          <Progress value={calculateOverallOutcome(selectedTreatment)} className="bg-white/10" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="apple-card">
                    <CardHeader>
                      <CardTitle className="text-white text-lg">Medicamentos Actuales</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-2">
                        {selectedTreatment.medications.map((medication, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 rounded-lg bg-white/5">
                            <Heart className="h-4 w-4 text-blue-400" />
                            <span className="text-white text-sm">{medication}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="goals" className="space-y-4">
                  {selectedTreatment.goals.map((goal) => (
                    <Card key={goal.id} className="apple-card">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-white">{goal.description}</h4>
                          {goal.achieved ? (
                            <CheckCircle className="h-5 w-5 text-green-400" />
                          ) : (
                            <Clock className="h-5 w-5 text-yellow-400" />
                          )}
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-white/80">Objetivo: {goal.target}</span>
                            <span className="text-white/80">Actual: {goal.currentStatus}</span>
                          </div>
                          <Progress value={goal.progress} className="bg-white/10" />
                          <div className="flex justify-between text-xs text-white/60">
                            <span>Progreso: {goal.progress}%</span>
                            <span>Fecha límite: {new Date(goal.dueDate).toLocaleDateString('es-ES')}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="outcomes" className="space-y-4">
                  {selectedTreatment.outcomes.map((outcome) => (
                    <Card key={outcome.id} className="apple-card">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium text-white">{outcome.metric}</h4>
                            <p className="text-sm text-white/60">
                              Fecha: {new Date(outcome.date).toLocaleDateString('es-ES')}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-2">
                              <span className="text-white font-bold">
                                {outcome.value}{outcome.unit}
                              </span>
                              {getTrendIcon(outcome.trend)}
                            </div>
                            <p className="text-sm text-white/60">
                              Objetivo: {outcome.target}{outcome.unit}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="timeline">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                      <CheckCircle className="h-5 w-5 text-green-400" />
                      <div>
                        <p className="font-medium text-white">Tratamiento iniciado</p>
                        <p className="text-sm text-white/60">
                          {new Date(selectedTreatment.startDate).toLocaleDateString('es-ES')}
                        </p>
                      </div>
                    </div>
                    
                    {selectedTreatment.nextAppointment && (
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                        <Calendar className="h-5 w-5 text-blue-400" />
                        <div>
                          <p className="font-medium text-white">Próxima cita programada</p>
                          <p className="text-sm text-white/60">
                            {new Date(selectedTreatment.nextAppointment).toLocaleDateString('es-ES')}
                          </p>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                      <Target className="h-5 w-5 text-yellow-400" />
                      <div>
                        <p className="font-medium text-white">Finalización esperada</p>
                        <p className="text-sm text-white/60">
                          {new Date(selectedTreatment.expectedEndDate).toLocaleDateString('es-ES')}
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}