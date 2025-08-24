import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Calendar } from './ui/calendar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Plus, 
  Search, 
  Filter, 
  User, 
  Phone, 
  Mail, 
  MapPin,
  Edit, 
  Trash2, 
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  Bell,
  Video,
  Users,
  Stethoscope,
  FileText,
  Save,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { format } from 'date-fns@3.0.0';
import { es } from 'date-fns@3.0.0/locale';
import { useAuth, useActivityTracker } from './AuthContext';

interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  date: string;
  time: string;
  endTime: string;
  type: 'Consulta' | 'Cirugía' | 'Seguimiento' | 'Evaluación' | 'Emergencia';
  status: 'Programada' | 'Confirmada' | 'En progreso' | 'Completada' | 'Cancelada' | 'No asistió';
  doctor: string;
  location: string;
  duration: number; // minutes
  notes?: string;
  reminder: boolean;
  isVirtual: boolean;
  createdDate: string;
  priority: 'Alta' | 'Media' | 'Baja';
}

const timeSlots = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30'
];

export function AppointmentSchedule() {
  const { currentUser, hasPermission } = useAuth();
  const { trackActivity } = useActivityTracker();

  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: 'APT-001',
      patientId: 'PAT-001',
      patientName: 'María Elena González R.',
      patientPhone: '+52 55 1234 5678',
      patientEmail: 'maria.gonzalez@email.com',
      date: '2025-01-15',
      time: '10:00',
      endTime: '10:30',
      type: 'Seguimiento',
      status: 'Confirmada',
      doctor: 'Dr. Joel Sánchez García',
      location: 'Consultorio 1',
      duration: 30,
      notes: 'Control post-operatorio hernia discal L4-L5',
      reminder: true,
      isVirtual: false,
      createdDate: '2024-12-20',
      priority: 'Media'
    },
    {
      id: 'APT-002',
      patientId: 'PAT-002',
      patientName: 'Carlos Alberto Mendoza L.',
      patientPhone: '+52 55 2345 6789',
      patientEmail: 'carlos.mendoza@email.com',
      date: '2025-01-15',
      time: '11:00',
      endTime: '11:45',
      type: 'Consulta',
      status: 'Programada',
      doctor: 'Dr. Joel Sánchez García',
      location: 'Consultorio 1',
      duration: 45,
      notes: 'Primera consulta síndrome facetario cervical',
      reminder: true,
      isVirtual: false,
      createdDate: '2024-12-18',
      priority: 'Alta'
    },
    {
      id: 'APT-003',
      patientId: 'PAT-003',
      patientName: 'Ana Patricia Herrera J.',
      patientPhone: '+52 55 3456 7890',
      patientEmail: 'ana.herrera@email.com',
      date: '2025-01-16',
      time: '14:00',
      endTime: '15:00',
      type: 'Cirugía',
      status: 'Confirmada',
      doctor: 'Dr. Joel Sánchez García',
      location: 'Quirófano 2',
      duration: 60,
      notes: 'Discectomía cervical programada C5-C6',
      reminder: true,
      isVirtual: false,
      createdDate: '2024-12-10',
      priority: 'Alta'
    },
    {
      id: 'APT-004',
      patientId: 'PAT-004',
      patientName: 'Roberto Martínez S.',
      patientPhone: '+52 55 4567 8901',
      patientEmail: 'roberto.martinez@email.com',
      date: '2025-01-17',
      time: '09:30',
      endTime: '10:00',
      type: 'Evaluación',
      status: 'Programada',
      doctor: 'Dr. Joel Sánchez García',
      location: 'Consultorio 1',
      duration: 30,
      notes: 'Evaluación pre-operatoria estenosis lumbar',
      reminder: false,
      isVirtual: true,
      createdDate: '2024-12-22',
      priority: 'Media'
    }
  ]);

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('day');
  const [showNewAppointmentDialog, setShowNewAppointmentDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showAppointmentDetail, setShowAppointmentDetail] = useState(false);

  const [newAppointmentForm, setNewAppointmentForm] = useState({
    patientName: '',
    patientPhone: '',
    patientEmail: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: '09:00',
    type: 'Consulta' as const,
    duration: 30,
    location: 'Consultorio 1',
    notes: '',
    isVirtual: false,
    reminder: true,
    priority: 'Media' as const
  });

  // Get appointments for selected date
  const getAppointmentsForDate = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    return appointments.filter(apt => apt.date === dateString);
  };

  // Get appointments for current week
  const getAppointmentsForWeek = () => {
    const startOfWeek = new Date(selectedDate);
    startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());
    
    const weekAppointments = [];
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startOfWeek);
      currentDate.setDate(startOfWeek.getDate() + i);
      const dateString = format(currentDate, 'yyyy-MM-dd');
      const dayAppointments = appointments.filter(apt => apt.date === dateString);
      weekAppointments.push({
        date: currentDate,
        appointments: dayAppointments
      });
    }
    return weekAppointments;
  };

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = searchTerm === '' || 
      appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.patientPhone.includes(searchTerm) ||
      appointment.notes?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleCreateAppointment = async () => {
    if (!newAppointmentForm.patientName.trim()) return;

    const endTime = new Date(`1970-01-01T${newAppointmentForm.time}:00`);
    endTime.setMinutes(endTime.getMinutes() + newAppointmentForm.duration);
    const endTimeString = endTime.toTimeString().slice(0, 5);

    const newAppointment: Appointment = {
      id: `APT-${String(appointments.length + 1).padStart(3, '0')}`,
      patientId: `PAT-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      patientName: newAppointmentForm.patientName,
      patientPhone: newAppointmentForm.patientPhone,
      patientEmail: newAppointmentForm.patientEmail,
      date: newAppointmentForm.date,
      time: newAppointmentForm.time,
      endTime: endTimeString,
      type: newAppointmentForm.type,
      status: 'Programada',
      doctor: currentUser?.name || 'Dr. Joel Sánchez García',
      location: newAppointmentForm.location,
      duration: newAppointmentForm.duration,
      notes: newAppointmentForm.notes,
      reminder: newAppointmentForm.reminder,
      isVirtual: newAppointmentForm.isVirtual,
      createdDate: new Date().toISOString().split('T')[0],
      priority: newAppointmentForm.priority
    };

    setAppointments([...appointments, newAppointment]);
    setNewAppointmentForm({
      patientName: '',
      patientPhone: '',
      patientEmail: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      time: '09:00',
      type: 'Consulta',
      duration: 30,
      location: 'Consultorio 1',
      notes: '',
      isVirtual: false,
      reminder: true,
      priority: 'Media'
    });
    setShowNewAppointmentDialog(false);

    await trackActivity('APPOINTMENT_CREATED', {
      appointment_id: newAppointment.id,
      patient_name: newAppointment.patientName,
      appointment_date: newAppointment.date,
      appointment_type: newAppointment.type
    });
  };

  const handleUpdateAppointmentStatus = async (appointmentId: string, newStatus: Appointment['status']) => {
    setAppointments(appointments.map(apt => 
      apt.id === appointmentId ? { ...apt, status: newStatus } : apt
    ));

    await trackActivity('APPOINTMENT_STATUS_UPDATED', {
      appointment_id: appointmentId,
      old_status: appointments.find(apt => apt.id === appointmentId)?.status,
      new_status: newStatus
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Programada': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Confirmada': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'En progreso': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Completada': return 'bg-green-600/20 text-green-300 border-green-600/30';
      case 'Cancelada': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'No asistió': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Consulta': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Cirugía': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'Seguimiento': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Evaluación': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'Emergencia': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
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

  const renderDayView = () => {
    const dayAppointments = getAppointmentsForDate(selectedDate);
    const sortedAppointments = dayAppointments.sort((a, b) => a.time.localeCompare(b.time));

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold text-white">
            {format(selectedDate, 'EEEE, dd MMMM yyyy', { locale: es })}
          </h3>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() - 1)))}
              className="apple-button-secondary"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedDate(new Date())}
              className="apple-button-secondary"
            >
              Hoy
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() + 1)))}
              className="apple-button-secondary"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {sortedAppointments.length > 0 ? (
          <div className="grid gap-4">
            {sortedAppointments.map((appointment) => (
              <Card key={appointment.id} className="apple-card apple-card-hover cursor-pointer"
                    onClick={() => {
                      setSelectedAppointment(appointment);
                      setShowAppointmentDetail(true);
                    }}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-blue-400" />
                          <span className="font-medium text-white">
                            {appointment.time} - {appointment.endTime}
                          </span>
                        </div>
                        <Badge variant="outline" className={getTypeColor(appointment.type)}>
                          {appointment.type}
                        </Badge>
                        <Badge variant="outline" className={getPriorityColor(appointment.priority)}>
                          {appointment.priority}
                        </Badge>
                      </div>
                      
                      <h4 className="font-semibold text-white text-lg">{appointment.patientName}</h4>
                      
                      <div className="flex items-center gap-4 mt-2 text-sm text-white/80">
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {appointment.patientPhone}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {appointment.location}
                        </div>
                        {appointment.isVirtual && (
                          <div className="flex items-center gap-1">
                            <Video className="h-3 w-3" />
                            Virtual
                          </div>
                        )}
                        {appointment.reminder && (
                          <div className="flex items-center gap-1">
                            <Bell className="h-3 w-3" />
                            Recordatorio
                          </div>
                        )}
                      </div>
                      
                      {appointment.notes && (
                        <p className="text-white/70 text-sm mt-2 line-clamp-2">{appointment.notes}</p>
                      )}
                    </div>
                    
                    <div className="ml-4">
                      <Badge variant="outline" className={getStatusColor(appointment.status)}>
                        {appointment.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <CalendarIcon className="h-12 w-12 text-white/20 mx-auto mb-4" />
            <p className="text-white/60">No hay citas programadas para este día</p>
            <Button 
              className="apple-button-primary mt-4"
              onClick={() => {
                setNewAppointmentForm({
                  ...newAppointmentForm,
                  date: format(selectedDate, 'yyyy-MM-dd')
                });
                setShowNewAppointmentDialog(true);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Programar Cita
            </Button>
          </div>
        )}
      </div>
    );
  };

  const renderWeekView = () => {
    const weekAppointments = getAppointmentsForWeek();

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold text-white">
            Semana del {format(weekAppointments[0].date, 'dd MMM', { locale: es })} al {format(weekAppointments[6].date, 'dd MMM yyyy', { locale: es })}
          </h3>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() - 7)))}
              className="apple-button-secondary"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedDate(new Date())}
              className="apple-button-secondary"
            >
              Hoy
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() + 7)))}
              className="apple-button-secondary"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
          {weekAppointments.map((day, index) => (
            <Card key={index} className="apple-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-white text-center">
                  {format(day.date, 'EEE dd', { locale: es })}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2">
                <div className="space-y-1">
                  {day.appointments.slice(0, 3).map((appointment) => (
                    <div
                      key={appointment.id}
                      className="p-2 rounded bg-white/5 cursor-pointer hover:bg-white/10 transition-colors"
                      onClick={() => {
                        setSelectedAppointment(appointment);
                        setShowAppointmentDetail(true);
                      }}
                    >
                      <p className="text-xs font-medium text-white truncate">
                        {appointment.time} {appointment.patientName}
                      </p>
                      <Badge variant="outline" className={`${getStatusColor(appointment.status)} text-xs h-4`}>
                        {appointment.status}
                      </Badge>
                    </div>
                  ))}
                  {day.appointments.length > 3 && (
                    <p className="text-xs text-white/60 text-center">
                      +{day.appointments.length - 3} más
                    </p>
                  )}
                  {day.appointments.length === 0 && (
                    <p className="text-xs text-white/40 text-center py-4">Sin citas</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Agenda de Citas</h1>
          <p className="text-white/60 mt-1">
            Sistema de programación y gestión de citas médicas
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="apple-button-secondary">
            <FileText className="h-4 w-4 mr-2" />
            Reportes
          </Button>
          <Button 
            className="apple-button-primary"
            onClick={() => setShowNewAppointmentDialog(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nueva Cita
          </Button>
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar Sidebar */}
        <Card className="apple-card">
          <CardHeader>
            <CardTitle className="text-white">Calendario</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md"
            />
            
            <div className="mt-4 space-y-2">
              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'day' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('day')}
                  className={viewMode === 'day' ? 'apple-button-primary' : 'apple-button-secondary'}
                >
                  Día
                </Button>
                <Button
                  variant={viewMode === 'week' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('week')}
                  className={viewMode === 'week' ? 'apple-button-primary' : 'apple-button-secondary'}
                >
                  Semana
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main View */}
        <div className="lg:col-span-3">
          <Card className="apple-card">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-white">
                    {viewMode === 'day' ? 'Vista Diaria' : 'Vista Semanal'}
                  </CardTitle>
                  <CardDescription>
                    {filteredAppointments.length} citas en el sistema
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-white/40" />
                    <Input
                      placeholder="Buscar citas..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64 bg-white/5 border-white/20 text-white"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40 bg-white/5 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="apple-card border border-white/20">
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="Programada">Programada</SelectItem>
                      <SelectItem value="Confirmada">Confirmada</SelectItem>
                      <SelectItem value="En progreso">En progreso</SelectItem>
                      <SelectItem value="Completada">Completada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {viewMode === 'day' ? renderDayView() : renderWeekView()}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="apple-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm">Citas Hoy</p>
                <p className="text-2xl font-bold text-white">
                  {getAppointmentsForDate(new Date()).length}
                </p>
              </div>
              <CalendarIcon className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="apple-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm">Confirmadas</p>
                <p className="text-2xl font-bold text-green-400">
                  {appointments.filter(apt => apt.status === 'Confirmada').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="apple-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm">Pendientes</p>
                <p className="text-2xl font-bold text-yellow-400">
                  {appointments.filter(apt => apt.status === 'Programada').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="apple-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm">Canceladas</p>
                <p className="text-2xl font-bold text-red-400">
                  {appointments.filter(apt => apt.status === 'Cancelada').length}
                </p>
              </div>
              <XCircle className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* New Appointment Dialog */}
      <Dialog open={showNewAppointmentDialog} onOpenChange={setShowNewAppointmentDialog}>
        <DialogContent className="apple-card border border-white/20 max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white">Nueva Cita Médica</DialogTitle>
            <DialogDescription>
              Programar nueva cita en la agenda del consultorio
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Patient Information */}
            <div className="space-y-4">
              <h4 className="font-medium text-white">Información del Paciente</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">Nombre Completo *</Label>
                  <Input
                    value={newAppointmentForm.patientName}
                    onChange={(e) => setNewAppointmentForm({...newAppointmentForm, patientName: e.target.value})}
                    className="bg-white/5 border-white/20 text-white"
                    placeholder="Nombre del paciente"
                  />
                </div>
                <div>
                  <Label className="text-white">Teléfono</Label>
                  <Input
                    value={newAppointmentForm.patientPhone}
                    onChange={(e) => setNewAppointmentForm({...newAppointmentForm, patientPhone: e.target.value})}
                    className="bg-white/5 border-white/20 text-white"
                    placeholder="+52 55 1234 5678"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label className="text-white">Email</Label>
                  <Input
                    type="email"
                    value={newAppointmentForm.patientEmail}
                    onChange={(e) => setNewAppointmentForm({...newAppointmentForm, patientEmail: e.target.value})}
                    className="bg-white/5 border-white/20 text-white"
                    placeholder="paciente@email.com"
                  />
                </div>
              </div>
            </div>

            {/* Appointment Details */}
            <div className="space-y-4">
              <h4 className="font-medium text-white">Detalles de la Cita</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-white">Fecha *</Label>
                  <Input
                    type="date"
                    value={newAppointmentForm.date}
                    onChange={(e) => setNewAppointmentForm({...newAppointmentForm, date: e.target.value})}
                    className="bg-white/5 border-white/20 text-white"
                  />
                </div>
                <div>
                  <Label className="text-white">Hora *</Label>
                  <Select value={newAppointmentForm.time} onValueChange={(value) => setNewAppointmentForm({...newAppointmentForm, time: value})}>
                    <SelectTrigger className="bg-white/5 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="apple-card border border-white/20 max-h-60">
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>{time}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-white">Duración (min)</Label>
                  <Select value={newAppointmentForm.duration.toString()} onValueChange={(value) => setNewAppointmentForm({...newAppointmentForm, duration: parseInt(value)})}>
                    <SelectTrigger className="bg-white/5 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="apple-card border border-white/20">
                      <SelectItem value="15">15 min</SelectItem>
                      <SelectItem value="30">30 min</SelectItem>
                      <SelectItem value="45">45 min</SelectItem>
                      <SelectItem value="60">1 hora</SelectItem>
                      <SelectItem value="90">1.5 horas</SelectItem>
                      <SelectItem value="120">2 horas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-white">Tipo de Cita *</Label>
                  <Select value={newAppointmentForm.type} onValueChange={(value: any) => setNewAppointmentForm({...newAppointmentForm, type: value})}>
                    <SelectTrigger className="bg-white/5 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="apple-card border border-white/20">
                      <SelectItem value="Consulta">Consulta</SelectItem>
                      <SelectItem value="Seguimiento">Seguimiento</SelectItem>
                      <SelectItem value="Evaluación">Evaluación</SelectItem>
                      <SelectItem value="Cirugía">Cirugía</SelectItem>
                      <SelectItem value="Emergencia">Emergencia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-white">Prioridad</Label>
                  <Select value={newAppointmentForm.priority} onValueChange={(value: any) => setNewAppointmentForm({...newAppointmentForm, priority: value})}>
                    <SelectTrigger className="bg-white/5 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="apple-card border border-white/20">
                      <SelectItem value="Baja">Baja</SelectItem>
                      <SelectItem value="Media">Media</SelectItem>
                      <SelectItem value="Alta">Alta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-white">Ubicación</Label>
                  <Select value={newAppointmentForm.location} onValueChange={(value) => setNewAppointmentForm({...newAppointmentForm, location: value})}>
                    <SelectTrigger className="bg-white/5 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="apple-card border border-white/20">
                      <SelectItem value="Consultorio 1">Consultorio 1</SelectItem>
                      <SelectItem value="Consultorio 2">Consultorio 2</SelectItem>
                      <SelectItem value="Quirófano 1">Quirófano 1</SelectItem>
                      <SelectItem value="Quirófano 2">Quirófano 2</SelectItem>
                      <SelectItem value="Sala de Procedimientos">Sala de Procedimientos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Additional Options */}
            <div className="space-y-4">
              <h4 className="font-medium text-white">Opciones Adicionales</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isVirtual"
                    checked={newAppointmentForm.isVirtual}
                    onChange={(e) => setNewAppointmentForm({...newAppointmentForm, isVirtual: e.target.checked})}
                    className="rounded border-white/20 bg-white/5"
                  />
                  <Label htmlFor="isVirtual" className="text-white text-sm">
                    Cita virtual (videollamada)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="reminder"
                    checked={newAppointmentForm.reminder}
                    onChange={(e) => setNewAppointmentForm({...newAppointmentForm, reminder: e.target.checked})}
                    className="rounded border-white/20 bg-white/5"
                  />
                  <Label htmlFor="reminder" className="text-white text-sm">
                    Enviar recordatorio automático
                  </Label>
                </div>
              </div>

              <div>
                <Label className="text-white">Notas y Observaciones</Label>
                <Textarea
                  value={newAppointmentForm.notes}
                  onChange={(e) => setNewAppointmentForm({...newAppointmentForm, notes: e.target.value})}
                  className="bg-white/5 border-white/20 text-white"
                  placeholder="Motivo de la cita, preparación necesaria, etc."
                  rows={3}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button 
              variant="outline" 
              onClick={() => setShowNewAppointmentDialog(false)}
              className="apple-button-secondary"
            >
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button 
              onClick={handleCreateAppointment}
              className="apple-button-primary"
              disabled={!newAppointmentForm.patientName.trim()}
            >
              <Save className="h-4 w-4 mr-2" />
              Programar Cita
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Appointment Detail Dialog */}
      <Dialog open={showAppointmentDetail} onOpenChange={setShowAppointmentDetail}>
        <DialogContent className="apple-card border border-white/20 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Detalles de la Cita
            </DialogTitle>
            <DialogDescription>
              {selectedAppointment?.id} • {selectedAppointment?.date}
            </DialogDescription>
          </DialogHeader>

          {selectedAppointment && (
            <div className="space-y-6 py-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-white">{selectedAppointment.patientName}</h3>
                  <div className="flex items-center gap-3 mt-2">
                    <Badge variant="outline" className={getTypeColor(selectedAppointment.type)}>
                      {selectedAppointment.type}
                    </Badge>
                    <Badge variant="outline" className={getStatusColor(selectedAppointment.status)}>
                      {selectedAppointment.status}
                    </Badge>
                    <Badge variant="outline" className={getPriorityColor(selectedAppointment.priority)}>
                      Prioridad {selectedAppointment.priority}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="apple-button-secondary">
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button variant="outline" size="sm" className="apple-button-secondary">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-white mb-3">Información de la Cita</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-blue-400" />
                      <span className="text-white/80">
                        {format(new Date(selectedAppointment.date), 'EEEE, dd MMMM yyyy', { locale: es })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-400" />
                      <span className="text-white/80">
                        {selectedAppointment.time} - {selectedAppointment.endTime} ({selectedAppointment.duration} min)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-blue-400" />
                      <span className="text-white/80">{selectedAppointment.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Stethoscope className="h-4 w-4 text-blue-400" />
                      <span className="text-white/80">{selectedAppointment.doctor}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-white mb-3">Información del Paciente</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-green-400" />
                      <span className="text-white/80">{selectedAppointment.patientPhone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-green-400" />
                      <span className="text-white/80">{selectedAppointment.patientEmail}</span>
                    </div>
                    {selectedAppointment.isVirtual && (
                      <div className="flex items-center gap-2">
                        <Video className="h-4 w-4 text-purple-400" />
                        <span className="text-white/80">Cita virtual programada</span>
                      </div>
                    )}
                    {selectedAppointment.reminder && (
                      <div className="flex items-center gap-2">
                        <Bell className="h-4 w-4 text-yellow-400" />
                        <span className="text-white/80">Recordatorio activado</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {selectedAppointment.notes && (
                <div>
                  <h4 className="font-medium text-white mb-2">Notas</h4>
                  <p className="text-white/80 text-sm bg-white/5 p-3 rounded-lg">
                    {selectedAppointment.notes}
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                {selectedAppointment.status === 'Programada' && (
                  <Button 
                    className="apple-button-primary"
                    onClick={() => handleUpdateAppointmentStatus(selectedAppointment.id, 'Confirmada')}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Confirmar Cita
                  </Button>
                )}
                {selectedAppointment.status === 'Confirmada' && (
                  <Button 
                    className="apple-button-primary"
                    onClick={() => handleUpdateAppointmentStatus(selectedAppointment.id, 'En progreso')}
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    Iniciar Consulta
                  </Button>
                )}
                <Button 
                  variant="outline"
                  className="apple-button-secondary"
                  onClick={() => handleUpdateAppointmentStatus(selectedAppointment.id, 'Cancelada')}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}