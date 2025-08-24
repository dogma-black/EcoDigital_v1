import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { DataTable, DataTableColumn, DataTableAction } from './ui/data-table';
import { FilterPanel, FilterOption } from './ui/filter-panel';
import { useModal } from './ui/specialized-modal';
import { Checkbox } from './ui/checkbox';
import { Textarea } from './ui/textarea';
import { 
  Home, 
  Users, 
  FileText, 
  BarChart3, 
  Grid3X3,
  Search,
  Filter,
  Download,
  Plus,
  MoreHorizontal,
  Trash2,
  Eye,
  Edit,
  Archive,
  Bell,
  Calendar,
  Brain,
  Send,
  Upload,
  Image,
  Video,
  HardDrive,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Bot,
  User as UserIcon,
  Settings,
  Activity,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useAuth, useActivityTracker } from './AuthContext';
import localAIService from '../services/localAIService';
import { apiService } from '../services/apiService';
import { useApiCall } from '../hooks/useApiCall';
import { formatDate, formatPhoneNumber, truncateText } from '../utils/formatters';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';

/**
 * Dashboard mejorado según especificación técnica
 * Implementa: DataTable avanzada, filtros, modales especializados, gestión de APIs
 */

interface Patient {
  id: string;
  name: string;
  lastName: string;
  email: string;
  phone: string;
  lastVisit: string;
  diagnosis: string;
  status: 'Active' | 'Inactive';
  doctor: string;
  birthDate: string;
  address: string;
  insuranceId?: string;
}

interface ChatMessage {
  id: number;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface MediaFile {
  id: string;
  name: string;
  type: 'image' | 'video';
  url: string;
  thumbnail: string;
  patientId: string;
  uploadDate: string;
  category: 'cloud' | 'photos' | 'videos';
}

interface DashboardProps {
  onNavigate?: (panel: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const { currentUser, hasPermission } = useAuth();
  const { trackActivity } = useActivityTracker();
  const { FormModal, ConfirmationModal, InfoModal, showFormModal, showConfirmationModal, showInfoModal } = useModal();

  // API calls hooks
  const patientsApi = useApiCall<Patient[]>();
  const deleteApi = useApiCall<void>();

  // Patient management state
  const [patients, setPatients] = useState<Patient[]>([
    {
      id: 'PAT-001',
      name: 'María Elena',
      lastName: 'González Rodríguez',
      email: 'maria.gonzalez@email.com',
      phone: '+52 55 1234 5678',
      lastVisit: '2024-12-15',
      diagnosis: 'Hernia discal L4-L5',
      status: 'Active',
      doctor: 'Dr. Joel Sánchez García',
      birthDate: '1975-03-20',
      address: 'Av. Reforma 123, CDMX',
      insuranceId: 'INS-001-2024'
    },
    {
      id: 'PAT-002',
      name: 'Carlos Alberto',
      lastName: 'Mendoza López',
      email: 'carlos.mendoza@email.com',
      phone: '+52 55 2345 6789',
      lastVisit: '2024-12-10',
      diagnosis: 'Síndrome facetario cervical C5-C6',
      status: 'Active',
      doctor: 'Dr. Joel Sánchez García',
      birthDate: '1982-07-15',
      address: 'Calle Insurgentes 456, CDMX'
    },
    {
      id: 'PAT-003',
      name: 'Ana Patricia',
      lastName: 'Herrera Jiménez',
      email: 'ana.herrera@email.com',
      phone: '+52 55 3456 7890',
      lastVisit: '2024-11-28',
      diagnosis: 'Post-operatorio fusión lumbar L3-L4-L5',
      status: 'Inactive',
      doctor: 'Dr. Joel Sánchez García',
      birthDate: '1968-11-03',
      address: 'Av. Universidad 789, CDMX'
    },
    {
      id: 'PAT-004',
      name: 'Roberto',
      lastName: 'Martínez Silva',
      email: 'roberto.martinez@email.com',
      phone: '+52 55 4567 8901',
      lastVisit: '2024-12-08',
      diagnosis: 'Estenosis canal lumbar',
      status: 'Active',
      doctor: 'Dr. Joel Sánchez García',
      birthDate: '1955-09-12',
      address: 'Colonia Roma Norte, CDMX'
    }
  ]);

  // Filter state
  const [filterValues, setFilterValues] = useState({
    search: '',
    status: '',
    doctor: '',
    diagnosis: '',
    lastVisitFrom: '',
    lastVisitTo: ''
  });

  // AI Assistant state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      type: 'ai',
      content: `¡Hola ${currentUser?.name || 'Doctor'}! Soy su asistente virtual especializado en cirugía de columna. ¿En qué puedo ayudarle hoy?`,
      timestamp: new Date(Date.now() - 5000)
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Notes state
  const [notes, setNotes] = useState('');

  // Media viewer state
  const [mediaFiles] = useState<MediaFile[]>([
    {
      id: 'MED-001',
      name: 'RM Lumbar - María González',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400',
      thumbnail: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=200',
      patientId: 'PAT-001',
      uploadDate: '2024-12-15',
      category: 'photos'
    },
    {
      id: 'MED-002',
      name: 'TAC Cervical - Carlos Mendoza',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400',
      thumbnail: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=200',
      patientId: 'PAT-002',
      uploadDate: '2024-12-10',
      category: 'photos'
    },
    {
      id: 'MED-003',
      name: 'Procedimiento Quirúrgico - Ana Herrera',
      type: 'video',
      url: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=400',
      thumbnail: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=200',
      patientId: 'PAT-003',
      uploadDate: '2024-11-28',
      category: 'videos'
    }
  ]);

  const [mediaFilter, setMediaFilter] = useState<'all' | 'cloud' | 'photos' | 'videos'>('all');
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  // Filter patients based on filter values
  const filteredPatients = patients.filter(patient => {
    const matchesSearch = !filterValues.search || 
      patient.name.toLowerCase().includes(filterValues.search.toLowerCase()) ||
      patient.lastName.toLowerCase().includes(filterValues.search.toLowerCase()) ||
      patient.diagnosis.toLowerCase().includes(filterValues.search.toLowerCase()) ||
      patient.email.toLowerCase().includes(filterValues.search.toLowerCase()) ||
      patient.id.toLowerCase().includes(filterValues.search.toLowerCase());
    
    const matchesStatus = !filterValues.status || patient.status === filterValues.status;
    const matchesDoctor = !filterValues.doctor || patient.doctor.includes(filterValues.doctor);
    const matchesDiagnosis = !filterValues.diagnosis || 
      patient.diagnosis.toLowerCase().includes(filterValues.diagnosis.toLowerCase());
    
    let matchesDateRange = true;
    if (filterValues.lastVisitFrom || filterValues.lastVisitTo) {
      const visitDate = new Date(patient.lastVisit);
      if (filterValues.lastVisitFrom) {
        matchesDateRange = matchesDateRange && visitDate >= new Date(filterValues.lastVisitFrom);
      }
      if (filterValues.lastVisitTo) {
        matchesDateRange = matchesDateRange && visitDate <= new Date(filterValues.lastVisitTo);
      }
    }
    
    return matchesSearch && matchesStatus && matchesDoctor && matchesDiagnosis && matchesDateRange;
  });

  // DataTable columns configuration
  const patientColumns: DataTableColumn<Patient>[] = [
    {
      key: 'id',
      label: 'ID/Nombre del Paciente',
      sortable: true,
      render: (value, row) => (
        <button
          onClick={() => onNavigate?.('patients')}
          className="text-left hover:text-blue-400 transition-colors"
        >
          <div className="font-bold text-white">{row.name} {row.lastName}</div>
          <div className="text-xs text-white/60 font-mono">{row.id}</div>
        </button>
      )
    },
    {
      key: 'lastVisit',
      label: 'Última Consulta',
      sortable: true,
      render: (value, row) => (
        <div>
          <div className="text-white/90">{formatDate(value)}</div>
          <div className="text-xs text-white/60">{row.doctor}</div>
        </div>
      )
    },
    {
      key: 'diagnosis',
      label: 'Diagnóstico Principal',
      sortable: true,
      render: (value) => (
        <div className="max-w-xs">
          <span title={value}>{truncateText(value, 50)}</span>
        </div>
      )
    },
    {
      key: 'email',
      label: 'Contacto',
      render: (value, row) => (
        <div>
          <div className="text-sm text-white/90">{value}</div>
          <div className="text-xs text-white/60">{formatPhoneNumber(row.phone)}</div>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Estado',
      sortable: true,
      render: (value) => (
        <Badge 
          variant="outline" 
          className={
            value === 'Active'
              ? 'bg-green-500/20 text-green-400 border-green-500/30'
              : 'bg-red-500/20 text-red-400 border-red-500/30'
          }
        >
          {value === 'Active' ? 'Activo' : 'Inactivo'}
        </Badge>
      )
    }
  ];

  // DataTable actions configuration
  const patientActions: DataTableAction<Patient>[] = [
    {
      label: 'Ver Detalles',
      icon: <Eye className="h-4 w-4" />,
      onClick: (patient) => {
        showInfoModal({
          title: `${patient.name} ${patient.lastName}`,
          message: `Información del paciente ${patient.id}`,
          details: [
            `Email: ${patient.email}`,
            `Teléfono: ${formatPhoneNumber(patient.phone)}`,
            `Última visita: ${formatDate(patient.lastVisit)}`,
            `Diagnóstico: ${patient.diagnosis}`,
            `Estado: ${patient.status}`
          ]
        });
      }
    },
    {
      label: 'Editar Registro',
      icon: <Edit className="h-4 w-4" />,
      onClick: (patient) => {
        showFormModal({
          title: 'Editar Paciente',
          description: `Modificar información de ${patient.name} ${patient.lastName}`,
          children: (
            <div className="space-y-4">
              <p className="text-white/70">Funcionalidad de edición en desarrollo...</p>
            </div>
          ),
          onSubmit: () => {
            showInfoModal({
              title: 'Cambios Guardados',
              message: 'La información del paciente ha sido actualizada correctamente.',
              type: 'success'
            });
          }
        });
      }
    },
    {
      label: 'Ver Historial Clínico',
      icon: <FileText className="h-4 w-4" />,
      onClick: (patient) => onNavigate?.('patients')
    },
    {
      label: 'Archivar',
      icon: <Archive className="h-4 w-4" />,
      onClick: (patient) => {
        showConfirmationModal({
          title: 'Archivar Paciente',
          description: `¿Estás seguro de que deseas archivar a ${patient.name} ${patient.lastName}?`,
          details: [
            'El paciente será marcado como inactivo',
            'No se eliminará ninguna información',
            'Se puede reactivar en cualquier momento'
          ],
          variant: 'warning',
          confirmLabel: 'Archivar',
          onConfirm: () => handleArchivePatient(patient.id)
        });
      }
    }
  ];

  // Filter options configuration
  const filterOptions: FilterOption[] = [
    {
      key: 'search',
      label: 'Búsqueda General',
      type: 'text',
      placeholder: 'Buscar por nombre, email, diagnóstico...'
    },
    {
      key: 'status',
      label: 'Estado',
      type: 'select',
      options: [
        { label: 'Todos', value: '' },
        { label: 'Activo', value: 'Active' },
        { label: 'Inactivo', value: 'Inactive' }
      ]
    },
    {
      key: 'doctor',
      label: 'Médico Tratante',
      type: 'select',
      options: [
        { label: 'Todos', value: '' },
        { label: 'Dr. Joel Sánchez García', value: 'Joel Sánchez' }
      ]
    },
    {
      key: 'diagnosis',
      label: 'Diagnóstico',
      type: 'text',
      placeholder: 'Filtrar por diagnóstico...'
    },
    {
      key: 'lastVisitFrom',
      label: 'Última visita desde',
      type: 'date'
    },
    {
      key: 'lastVisitTo',
      label: 'Última visita hasta',
      type: 'date'
    }
  ];

  // Handlers
  const handleArchivePatient = async (patientId: string) => {
    try {
      await trackActivity('PATIENT_ARCHIVED', { patient_id: patientId });
      
      setPatients(patients.map(patient => 
        patient.id === patientId 
          ? { ...patient, status: 'Inactive' as const }
          : patient
      ));

      showInfoModal({
        title: 'Paciente Archivado',
        message: 'El paciente ha sido archivado correctamente.',
        type: 'success'
      });
    } catch (error) {
      console.error('Error archiving patient:', error);
      showInfoModal({
        title: 'Error',
        message: 'No se pudo archivar el paciente. Por favor, intenta nuevamente.',
        type: 'error'
      });
    }
  };

  const handleBulkArchive = async (selectedPatients: Patient[]) => {
    const patientIds = selectedPatients.map(p => p.id);
    
    showConfirmationModal({
      title: 'Archivar Pacientes',
      description: `¿Estás seguro de que deseas archivar ${selectedPatients.length} paciente(s)?`,
      details: [
        `Se archivarán ${selectedPatients.length} pacientes`,
        'Los pacientes serán marcados como inactivos',
        'No se eliminará ninguna información'
      ],
      variant: 'warning',
      confirmLabel: 'Archivar Todos',
      onConfirm: async () => {
        try {
          await trackActivity('PATIENTS_BULK_ARCHIVED', {
            patient_count: patientIds.length,
            patient_ids: patientIds
          });

          setPatients(patients.map(patient => 
            patientIds.includes(patient.id)
              ? { ...patient, status: 'Inactive' as const }
              : patient
          ));

          showInfoModal({
            title: 'Pacientes Archivados',
            message: `${selectedPatients.length} pacientes han sido archivados correctamente.`,
            type: 'success'
          });
        } catch (error) {
          console.error('Error archiving patients:', error);
          showInfoModal({
            title: 'Error',
            message: 'No se pudieron archivar los pacientes. Por favor, intenta nuevamente.',
            type: 'error'
          });
        }
      }
    });
  };

  const handleExportPatients = async (selectedPatients: Patient[]) => {
    const dataToExport = selectedPatients.length > 0 ? selectedPatients : filteredPatients;

    await trackActivity('PATIENTS_EXPORTED', {
      export_count: dataToExport.length,
      export_type: 'csv'
    });

    // Create CSV content
    const csvContent = [
      ['ID', 'Nombre', 'Apellido', 'Email', 'Teléfono', 'Última Consulta', 'Diagnóstico', 'Estado'].join(','),
      ...dataToExport.map(p => [
        p.id, p.name, p.lastName, p.email, formatPhoneNumber(p.phone), formatDate(p.lastVisit), `"${p.diagnosis}"`, p.status
      ].join(','))
    ].join('\n');

    // Download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pacientes_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showInfoModal({
      title: 'Exportación Completada',
      message: `Se han exportado ${dataToExport.length} registros de pacientes.`,
      type: 'success'
    });
  };

  // Handle AI chat
  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      type: 'user',
      content: chatInput,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsProcessing(true);

    try {
      await trackActivity('AI_CHAT_INTERACTION', {
        message_length: chatInput.length,
        context: 'dashboard_assistant'
      });

      const response = await localAIService.procesarConsulta(
        chatInput,
        'Dashboard médico - Gestión de pacientes'
      );

      const aiMessage: ChatMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: response.contenido,
        timestamp: new Date()
      };

      setChatMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error in AI chat:', error);
      const errorMessage: ChatMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: 'Lo siento, no pude procesar su solicitud en este momento. Por favor, intente nuevamente.',
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredMediaFiles = mediaFilter === 'all' 
    ? mediaFiles 
    : mediaFiles.filter(file => file.category === mediaFilter);

  const currentMedia = filteredMediaFiles[currentMediaIndex];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard de Administración</h1>
          <p className="text-white/60 mt-1">
            Núcleo Administrativo Central - Dr. Joel Sánchez García
          </p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="apple-button-secondary"
            onClick={() => onNavigate?.('ai-assistant')}
          >
            <Brain className="h-4 w-4 mr-2" />
            Asistente IA Completo
          </Button>
          <Button 
            className="apple-button-primary"
            onClick={() => onNavigate?.('patients')}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Paciente
          </Button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column - Base de Datos con DataTable Avanzada */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Módulo Base de Datos Avanzado */}
          <DataTable
            title="Base de Datos de Pacientes"
            description="Registro completo de pacientes - Cirugía Especial 2024"
            data={filteredPatients}
            columns={patientColumns}
            loading={patientsApi.loading}
            searchable={false} // Usando filtro avanzado en su lugar
            filterable={true}
            selectable={true}
            sortable={true}
            paginated={true}
            pageSize={10}
            emptyMessage="No se encontraron pacientes con los filtros aplicados"
            emptyIcon={<Users className="h-12 w-12 text-white/20 mx-auto mb-4" />}
            actions={patientActions}
            onRowClick={(patient) => onNavigate?.('patients')}
            onSelectionChange={(selectedPatients) => {
              console.log('Selected patients:', selectedPatients);
            }}
            onFilterClick={() => {
              // El FilterPanel se maneja a través del componente
            }}
            onExport={handleExportPatients}
            onAdd={() => onNavigate?.('patients')}
            className="mb-6"
          />

          {/* Filter Panel */}
          <div className="mb-4">
            <FilterPanel
              options={filterOptions}
              values={filterValues}
              onValuesChange={setFilterValues}
              onApply={(values) => {
                console.log('Applied filters:', values);
                trackActivity('PATIENTS_FILTERED', { filters: values });
              }}
              onClear={() => {
                setFilterValues({
                  search: '',
                  status: '',
                  doctor: '',
                  diagnosis: '',
                  lastVisitFrom: '',
                  lastVisitTo: ''
                });
              }}
              variant="dropdown"
              title="Filtros Avanzados"
              description="Refina la búsqueda de pacientes usando múltiples criterios"
              showActiveCount={true}
            />
          </div>
          
          {/* Módulo Visor de Archivos Visuales */}
          <Card className="apple-card">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-white">Visor de Archivos Visuales</CardTitle>
                  <CardDescription>
                    Archivos multimedia del consultorio
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className={`apple-button-secondary ${mediaFilter === 'all' ? 'bg-blue-500/20 border-blue-500/30' : ''}`}
                    onClick={() => setMediaFilter('all')}
                  >
                    Todos
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`apple-button-secondary ${mediaFilter === 'cloud' ? 'bg-purple-500/20 border-purple-500/30' : ''}`}
                    onClick={() => setMediaFilter('cloud')}
                  >
                    <HardDrive className="h-3 w-3 mr-1" />
                    Cloud
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`apple-button-secondary ${mediaFilter === 'photos' ? 'bg-green-500/20 border-green-500/30' : ''}`}
                    onClick={() => setMediaFilter('photos')}
                  >
                    <Image className="h-3 w-3 mr-1" />
                    Fotos
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`apple-button-secondary ${mediaFilter === 'videos' ? 'bg-orange-500/20 border-orange-500/30' : ''}`}
                    onClick={() => setMediaFilter('videos')}
                  >
                    <Video className="h-3 w-3 mr-1" />
                    Videos
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              {filteredMediaFiles.length > 0 ? (
                <div className="space-y-4">
                  {/* Main viewer */}
                  <div className="relative aspect-video bg-black/20 rounded-lg overflow-hidden">
                    <img
                      src={currentMedia.url}
                      alt={currentMedia.name}
                      className="w-full h-full object-cover"
                    />
                    {currentMedia.type === 'video' && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Button size="lg" className="apple-button-primary rounded-full w-16 h-16">
                          <Play className="h-6 w-6" />
                        </Button>
                      </div>
                    )}
                    
                    {/* Navigation arrows */}
                    {filteredMediaFiles.length > 1 && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                          onClick={() => setCurrentMediaIndex(
                            currentMediaIndex === 0 ? filteredMediaFiles.length - 1 : currentMediaIndex - 1
                          )}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                          onClick={() => setCurrentMediaIndex(
                            currentMediaIndex === filteredMediaFiles.length - 1 ? 0 : currentMediaIndex + 1
                          )}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    
                    {/* Info overlay */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <h4 className="text-white font-medium">{currentMedia.name}</h4>
                      <p className="text-white/80 text-sm">{formatDate(currentMedia.uploadDate)}</p>
                    </div>
                  </div>
                  
                  {/* Thumbnail carousel */}
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {filteredMediaFiles.map((file, index) => (
                      <button
                        key={file.id}
                        onClick={() => setCurrentMediaIndex(index)}
                        className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                          index === currentMediaIndex 
                            ? 'border-blue-500 scale-105' 
                            : 'border-white/20 hover:border-white/40'
                        }`}
                      >
                        <img
                          src={file.thumbnail}
                          alt={file.name}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Image className="h-12 w-12 text-white/20 mx-auto mb-4" />
                  <p className="text-white/60">No hay archivos visuales disponibles</p>
                  <Button className="apple-button-primary mt-4">
                    <Upload className="h-4 w-4 mr-2" />
                    Subir Archivo
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Right Column - Asistente Virtual y Notas */}
        <div className="space-y-6">
          
          {/* Módulo Asistente Virtual Mejorado */}
          <Card className="apple-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Bot className="w-5 h-5 text-blue-400" />
                    Asistente Virtual
                  </CardTitle>
                  <CardDescription>Chat interno básico con IA local</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-400 text-xs">Gemma 3 Activo</span>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Messages */}
              <div className="h-64 overflow-y-auto space-y-3 p-3 bg-white/2 rounded-lg">
                {chatMessages.map(message => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[85%] p-3 rounded-lg text-sm ${
                      message.type === 'user'
                        ? 'bg-blue-500/20 text-blue-100 border border-blue-500/30'
                        : 'bg-white/5 text-white border border-white/10'
                    }`}>
                      {message.type === 'ai' && (
                        <div className="flex items-center gap-2 mb-2">
                          <Bot className="w-3 h-3 text-blue-400" />
                          <span className="text-blue-400 text-xs font-medium">AVI</span>
                        </div>
                      )}
                      <div className="whitespace-pre-wrap">{message.content}</div>
                      <div className="mt-2 text-xs opacity-60">
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
                
                {isProcessing && (
                  <div className="flex justify-start">
                    <div className="bg-white/5 border border-white/10 p-3 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Bot className="w-3 h-3 text-blue-400 animate-pulse" />
                        <span className="text-white/60 text-sm">Procesando con Gemma 3...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="flex gap-2">
                <Input
                  placeholder="Consulta rápida al asistente virtual..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                  className="flex-1 bg-white/5 border-white/20 text-white"
                  disabled={isProcessing}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!chatInput.trim() || isProcessing}
                  className="apple-button-primary"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Módulo Notas Rápidas */}
          <Card className="apple-card">
            <CardHeader>
              <CardTitle className="text-white">Notas Rápidas</CardTitle>
              <CardDescription>Apuntes y recordatorios personales</CardDescription>
            </CardHeader>
            
            <CardContent>
              <Textarea
                placeholder="Escribe tus notas aquí..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-32 bg-white/5 border-white/20 text-white resize-none"
              />
              <div className="flex justify-end mt-3">
                <Button 
                  size="sm" 
                  className="apple-button-primary"
                  onClick={() => {
                    showInfoModal({
                      title: 'Notas Guardadas',
                      message: 'Tus notas han sido guardadas correctamente.',
                      type: 'success'
                    });
                  }}
                >
                  Guardar Notas
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modales */}
      <FormModal />
      <ConfirmationModal />
      <InfoModal />
    </div>
  );
}