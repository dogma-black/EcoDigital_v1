import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Calendar } from './ui/calendar';
import { CalendarIcon, Download, Eye, Mail, FileText, Filter, Search } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { format } from 'date-fns@3.0.0';
import { es } from 'date-fns@3.0.0/locale';
import { useAuth, useActivityTracker } from './AuthContext';

interface MedicalSystemEvent {
  id: string;
  timestamp: string;
  eventType: 'Acceso_Expediente' | 'Modificacion_Paciente' | 'Cita_Creada' | 'Documento_Subido' | 'Login_Usuario' | 'IA_Consulta' | 'Backup_Sistema' | 'Error_Sistema' | 'Exportacion_Datos';
  description: string;
  userId: string;
  userName: string;
  userRole: string;
  patientId?: string;
  patientName?: string;
  ipAddress: string;
  userAgent: string;
  status: 'Éxito' | 'Advertencia' | 'Error' | 'Información';
  severity: 'Alta' | 'Media' | 'Baja';
  module: string;
  sessionId?: string;
  dataAccessed?: string[];
  privacyLevel: 'Público' | 'Confidencial' | 'Restringido' | 'Crítico';
}

export function SystemLogs() {
  const { currentUser, hasPermission } = useAuth();
  const { trackActivity } = useActivityTracker();
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>([]);
  const [outputFormat, setOutputFormat] = useState('pdf');
  const [showPreview, setShowPreview] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [privacyFilter, setPrivacyFilter] = useState('all');

  const eventTypes = [
    { id: 'access', label: 'Acceso a Expedientes', count: 156, icon: '👁️' },
    { id: 'modifications', label: 'Modificaciones de Datos', count: 89, icon: '✏️' },
    { id: 'appointments', label: 'Gestión de Citas', count: 124, icon: '📅' },
    { id: 'documents', label: 'Gestión de Documentos', count: 67, icon: '📄' },
    { id: 'ai_queries', label: 'Consultas de IA', count: 234, icon: '🤖' },
    { id: 'system_events', label: 'Eventos del Sistema', count: 45, icon: '⚙️' },
    { id: 'user_management', label: 'Gestión de Usuarios', count: 23, icon: '👤' },
    { id: 'exports', label: 'Exportación de Datos', count: 34, icon: '📤' },
  ];

  const mockEvents: MedicalSystemEvent[] = [
    {
      id: 'LOG-001',
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
      eventType: 'Acceso_Expediente',
      description: 'Acceso a expediente médico para revisión de historial clínico',
      userId: 'dr-joel-sanchez',
      userName: 'Dr. Joel Sánchez García',
      userRole: 'admin-principal',
      patientId: 'PAT-001',
      patientName: 'María Elena González R.',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      status: 'Éxito',
      severity: 'Media',
      module: 'PatientManagement',
      sessionId: 'sess_abc123def456',
      dataAccessed: ['Historia Clínica', 'Estudios de Imagen', 'Reportes Quirúrgicos'],
      privacyLevel: 'Confidencial'
    },
    {
      id: 'LOG-002',
      timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 minutes ago
      eventType: 'IA_Consulta',
      description: 'Análisis de IA para diagnóstico diferencial de hernia discal',
      userId: 'dr-joel-sanchez',
      userName: 'Dr. Joel Sánchez García',
      userRole: 'admin-principal',
      patientId: 'PAT-001',
      patientName: 'María Elena González R.',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      status: 'Éxito',
      severity: 'Alta',
      module: 'AIAssistant',
      sessionId: 'sess_abc123def456',
      dataAccessed: ['Imagen RM Lumbar', 'Síntomas Clínicos'],
      privacyLevel: 'Crítico'
    },
    {
      id: 'LOG-003',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
      eventType: 'Cita_Creada',
      description: 'Nueva cita programada para seguimiento post-operatorio',
      userId: 'admin-clinico',
      userName: 'Dra. Ana Laura Aguilar',
      userRole: 'admin-secundario',
      patientId: 'PAT-002',
      patientName: 'Carlos Mendoza López',
      ipAddress: '192.168.1.105',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      status: 'Éxito',
      severity: 'Baja',
      module: 'AppointmentSchedule',
      sessionId: 'sess_xyz789uvw012',
      dataAccessed: ['Calendario Médico', 'Información de Contacto'],
      privacyLevel: 'Confidencial'
    },
    {
      id: 'LOG-004',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      eventType: 'Login_Usuario',
      description: 'Inicio de sesión exitoso en el sistema',
      userId: 'visitante-demo',
      userName: 'Visitante Demo',
      userRole: 'invitado',
      ipAddress: '192.168.1.110',
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)',
      status: 'Éxito',
      severity: 'Baja',
      module: 'Authentication',
      sessionId: 'sess_demo456demo789',
      dataAccessed: ['Dashboard Principal'],
      privacyLevel: 'Público'
    },
    {
      id: 'LOG-005',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
      eventType: 'Documento_Subido',
      description: 'Carga de resonancia magnética lumbar en formato DICOM',
      userId: 'admin-clinico',
      userName: 'Dra. Ana Laura Aguilar',
      userRole: 'admin-secundario',
      patientId: 'PAT-001',
      patientName: 'María Elena González R.',
      ipAddress: '192.168.1.105',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      status: 'Éxito',
      severity: 'Media',
      module: 'DocumentManagement',
      sessionId: 'sess_xyz789uvw012',
      dataAccessed: ['Archivo DICOM', 'Metadatos de Imagen'],
      privacyLevel: 'Crítico'
    },
    {
      id: 'LOG-006',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
      eventType: 'Error_Sistema',
      description: 'Error en conexión con servicio de IA local - Timeout de conexión',
      userId: 'SYSTEM',
      userName: 'Sistema Automático',
      userRole: 'sistema',
      ipAddress: 'localhost',
      userAgent: 'Internal System Process',
      status: 'Error',
      severity: 'Alta',
      module: 'LocalAIService',
      dataAccessed: ['Logs de Error'],
      privacyLevel: 'Restringido'
    },
    {
      id: 'LOG-007',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
      eventType: 'Exportacion_Datos',
      description: 'Exportación de reporte de compliance para auditoría externa',
      userId: 'dr-joel-sanchez',
      userName: 'Dr. Joel Sánchez García',
      userRole: 'admin-principal',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      status: 'Éxito',
      severity: 'Alta',
      module: 'ComplianceReports',
      sessionId: 'sess_abc123def456',
      dataAccessed: ['Datos de Compliance', 'Información Estadística Anónima'],
      privacyLevel: 'Restringido'
    },
    {
      id: 'LOG-008',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
      eventType: 'Modificacion_Paciente',
      description: 'Actualización de información de contacto del paciente',
      userId: 'admin-clinico',
      userName: 'Dra. Ana Laura Aguilar',
      userRole: 'admin-secundario',
      patientId: 'PAT-003',
      patientName: 'Ana Patricia Herrera J.',
      ipAddress: '192.168.1.105',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      status: 'Éxito',
      severity: 'Media',
      module: 'PatientManagement',
      sessionId: 'sess_xyz789uvw012',
      dataAccessed: ['Información Personal', 'Datos de Contacto'],
      privacyLevel: 'Confidencial'
    }
  ];

  const handleEventTypeChange = (eventType: string, checked: boolean) => {
    if (checked) {
      setSelectedEventTypes([...selectedEventTypes, eventType]);
    } else {
      setSelectedEventTypes(selectedEventTypes.filter(type => type !== eventType));
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      'Éxito': 'default',
      'Advertencia': 'outline',
      'Error': 'destructive',
      'Información': 'secondary'
    } as const;
    
    return <Badge variant={variants[status as keyof typeof variants]}>{status}</Badge>;
  };

  const getSeverityBadge = (severity: string) => {
    const colors = {
      'Alta': 'bg-red-500/20 text-red-400 border-red-500/30',
      'Media': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      'Baja': 'bg-green-500/20 text-green-400 border-green-500/30'
    };
    
    return (
      <Badge variant="outline" className={colors[severity as keyof typeof colors]}>
        {severity}
      </Badge>
    );
  };

  const getPrivacyBadge = (level: string) => {
    const colors = {
      'Público': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'Confidencial': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      'Restringido': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      'Crítico': 'bg-red-500/20 text-red-400 border-red-500/30'
    };
    
    return (
      <Badge variant="outline" className={colors[level as keyof typeof colors]}>
        {level}
      </Badge>
    );
  };

  const getEventTypeBadge = (eventType: string) => {
    const colors = {
      'Acceso_Expediente': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'Modificacion_Paciente': 'bg-green-500/20 text-green-400 border-green-500/30',
      'Cita_Creada': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      'Documento_Subido': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      'Login_Usuario': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
      'IA_Consulta': 'bg-pink-500/20 text-pink-400 border-pink-500/30',
      'Backup_Sistema': 'bg-gray-500/20 text-gray-400 border-gray-500/30',
      'Error_Sistema': 'bg-red-500/20 text-red-400 border-red-500/30',
      'Exportacion_Datos': 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30'
    };
    
    return (
      <Badge variant="outline" className={colors[eventType as keyof typeof colors]}>
        {eventType.replace('_', ' ')}
      </Badge>
    );
  };

  const filteredEvents = mockEvents.filter(event => {
    const matchesSearch = searchTerm === '' || 
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.module.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesEventType = selectedEventTypes.length === 0 || selectedEventTypes.some(selected => {
      const eventTypeMap = {
        'access': 'Acceso_Expediente',
        'modifications': 'Modificacion_Paciente',
        'appointments': 'Cita_Creada',
        'documents': 'Documento_Subido',
        'ai_queries': 'IA_Consulta',
        'system_events': ['Backup_Sistema', 'Error_Sistema'],
        'user_management': 'Login_Usuario',
        'exports': 'Exportacion_Datos'
      };
      
      const mappedType = eventTypeMap[selected as keyof typeof eventTypeMap];
      return Array.isArray(mappedType) ? 
        mappedType.includes(event.eventType) : 
        mappedType === event.eventType;
    });

    const matchesSeverity = severityFilter === 'all' || event.severity === severityFilter;
    const matchesPrivacy = privacyFilter === 'all' || event.privacyLevel === privacyFilter;

    return matchesSearch && matchesEventType && matchesSeverity && matchesPrivacy;
  });

  const handleExport = async () => {
    await trackActivity('SYSTEM_LOGS_EXPORTED', {
      format: outputFormat,
      events_count: filteredEvents.length,
      date_range: startDate && endDate ? { start: startDate.toISOString(), end: endDate.toISOString() } : null,
      filters_applied: {
        event_types: selectedEventTypes,
        severity: severityFilter,
        privacy: privacyFilter,
        search_term: searchTerm
      }
    });
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Logs del Sistema Médico</h1>
          <p className="text-white/60 mt-1">
            Auditoría completa y trazabilidad de eventos del sistema
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="apple-button-secondary">
            <Mail className="h-4 w-4 mr-2" />
            Alertas por Email
          </Button>
          <Button className="apple-button-primary">
            <Download className="h-4 w-4 mr-2" />
            Exportar Logs
          </Button>
        </div>
      </div>

      <Card className="apple-card">
        <CardHeader>
          <CardTitle className="text-white">Utilidad de Exportación de Registros del Sistema</CardTitle>
          <CardDescription>
            Generar pistas de auditoría completas y registros de eventos médicos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Search Bar */}
          <div className="space-y-4">
            <Label className="text-white">Búsqueda General</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-white/40" />
              <Input
                placeholder="Buscar por descripción, usuario, paciente o módulo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-white/40"
              />
            </div>
          </div>

          {/* Date Range Selector */}
          <div className="space-y-4">
            <Label className="text-white">Rango de Fechas</Label>
            <div className="flex gap-4">
              <div className="space-y-2">
                <Label className="text-xs text-white/60">Fecha de Inicio</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal apple-button-secondary">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, 'PPP', { locale: es }) : 'Seleccionar fecha de inicio'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 apple-card border border-white/20">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-white/60">Fecha de Fin</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal apple-button-secondary">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, 'PPP', { locale: es }) : 'Seleccionar fecha de fin'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 apple-card border border-white/20">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          {/* Filters Row */}
          <div className="grid gap-4 md:grid-cols-3">
            {/* Severity Filter */}
            <div className="space-y-2">
              <Label className="text-white">Severidad</Label>
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="bg-white/5 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="apple-card border border-white/20">
                  <SelectItem value="all">Todas las Severidades</SelectItem>
                  <SelectItem value="Alta">Alta</SelectItem>
                  <SelectItem value="Media">Media</SelectItem>
                  <SelectItem value="Baja">Baja</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Privacy Filter */}
            <div className="space-y-2">
              <Label className="text-white">Nivel de Privacidad</Label>
              <Select value={privacyFilter} onValueChange={setPrivacyFilter}>
                <SelectTrigger className="bg-white/5 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="apple-card border border-white/20">
                  <SelectItem value="all">Todos los Niveles</SelectItem>
                  <SelectItem value="Público">Público</SelectItem>
                  <SelectItem value="Confidencial">Confidencial</SelectItem>
                  <SelectItem value="Restringido">Restringido</SelectItem>
                  <SelectItem value="Crítico">Crítico</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Output Format */}
            <div className="space-y-2">
              <Label className="text-white">Formato de Salida</Label>
              <Select value={outputFormat} onValueChange={setOutputFormat}>
                <SelectTrigger className="bg-white/5 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="apple-card border border-white/20">
                  <SelectItem value="pdf">Informe PDF</SelectItem>
                  <SelectItem value="excel">Hoja de Cálculo Excel</SelectItem>
                  <SelectItem value="json">Datos JSON</SelectItem>
                  <SelectItem value="audit-xml">XML de Auditoría HIPAA</SelectItem>
                  <SelectItem value="csv">CSV para Análisis</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Event Filters */}
          <div className="space-y-4">
            <Label className="text-white">Filtros de Tipo de Evento</Label>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              {eventTypes.map((eventType) => (
                <div key={eventType.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={eventType.id}
                    checked={selectedEventTypes.includes(eventType.id)}
                    onCheckedChange={(checked) => 
                      handleEventTypeChange(eventType.id, checked as boolean)
                    }
                    className="border-white/30 data-[state=checked]:bg-blue-500"
                  />
                  <Label htmlFor={eventType.id} className="text-sm text-white/80">
                    {eventType.icon} {eventType.label} ({eventType.count})
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              className="apple-button-secondary flex items-center gap-2"
              onClick={() => setShowPreview(!showPreview)}
            >
              <Eye className="h-4 w-4" />
              {showPreview ? 'Ocultar Vista Previa' : 'Vista Previa de Registros'}
            </Button>
            <Button 
              className="apple-button-primary flex items-center gap-2"
              onClick={handleExport}
            >
              <Download className="h-4 w-4" />
              Descargar Exportación
            </Button>
            <Button variant="outline" className="apple-button-secondary flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Enviar por Email al Supervisor
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Preview Table */}
      {showPreview && (
        <Card className="apple-card">
          <CardHeader>
            <CardTitle className="text-white">Vista Previa de Registros</CardTitle>
            <CardDescription>
              Mostrando {filteredEvents.length} eventos que coinciden con sus filtros
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-white/80">Marca de Tiempo</TableHead>
                    <TableHead className="text-white/80">Tipo de Evento</TableHead>
                    <TableHead className="text-white/80">Usuario</TableHead>
                    <TableHead className="text-white/80">Paciente</TableHead>
                    <TableHead className="text-white/80">Descripción</TableHead>
                    <TableHead className="text-white/80">Módulo</TableHead>
                    <TableHead className="text-white/80">Estado</TableHead>
                    <TableHead className="text-white/80">Severidad</TableHead>
                    <TableHead className="text-white/80">Privacidad</TableHead>
                    <TableHead className="text-white/80">IP</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEvents.map((event) => (
                    <TableRow key={event.id} className="text-white/90 hover:bg-white/5">
                      <TableCell className="font-mono text-xs">
                        {formatTimestamp(event.timestamp)}
                      </TableCell>
                      <TableCell>{getEventTypeBadge(event.eventType)}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">{event.userName}</p>
                          <p className="text-xs text-white/60">{event.userRole}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {event.patientName ? (
                          <div>
                            <p className="font-medium text-sm">{event.patientName}</p>
                            <p className="text-xs text-white/60 font-mono">{event.patientId}</p>
                          </div>
                        ) : (
                          <span className="text-white/40">—</span>
                        )}
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <p className="text-sm truncate" title={event.description}>
                          {event.description}
                        </p>
                        {event.dataAccessed && event.dataAccessed.length > 0 && (
                          <p className="text-xs text-white/60 mt-1">
                            Datos: {event.dataAccessed.slice(0, 2).join(', ')}
                            {event.dataAccessed.length > 2 && ` +${event.dataAccessed.length - 2} más`}
                          </p>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                          {event.module}
                        </Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(event.status)}</TableCell>
                      <TableCell>{getSeverityBadge(event.severity)}</TableCell>
                      <TableCell>{getPrivacyBadge(event.privacyLevel)}</TableCell>
                      <TableCell className="font-mono text-xs text-white/60">
                        {event.ipAddress}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Export Summary */}
      <Card className="apple-card">
        <CardHeader>
          <CardTitle className="text-white">Resumen de Exportación</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-5">
            <div>
              <Label className="text-sm font-medium text-white">Total de Eventos</Label>
              <p className="text-2xl font-bold text-white">{filteredEvents.length}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-white">Eventos Críticos</Label>
              <p className="text-2xl font-bold text-red-400">
                {filteredEvents.filter(e => e.severity === 'Alta' || e.privacyLevel === 'Crítico').length}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-white">Accesos a Expedientes</Label>
              <p className="text-2xl font-bold text-blue-400">
                {filteredEvents.filter(e => e.eventType === 'Acceso_Expediente').length}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-white">Formato</Label>
              <p className="text-sm text-white/60 uppercase">{outputFormat}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-white">Tamaño Estimado</Label>
              <p className="text-sm text-white/60">~{Math.ceil(filteredEvents.length * 1.2)} KB</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}