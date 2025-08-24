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
  FileText, 
  Upload, 
  Download, 
  Eye, 
  Search, 
  Filter, 
  FolderOpen,
  Image,
  Video,
  FileImage,
  Calendar,
  User,
  Shield,
  Archive,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Clock,
  Brain,
  Stethoscope,
  FileX
} from 'lucide-react';
import { useAuth } from './AuthContext';
import apiService from '../services/apiService';

interface Document {
  id: string;
  nombre_archivo: string;
  tipo_archivo: string;
  categoria: 'Radiología' | 'Laboratorio' | 'Cirugía' | 'Consulta' | 'Administrativo' | 'Imagenes Médicas' | 'Videos' | 'Reportes';
  descripcion: string;
  fecha_subida: string;
  tamano_bytes: number;
  subido_por: string;
  paciente_id?: string;
  paciente_nombre?: string;
  es_confidencial: boolean;
  estado: 'activo' | 'archivado';
  url_almacenamiento: string;
  analisis_ia?: {
    completado: boolean;
    fecha_analisis: string;
    hallazgos: string[];
    confianza: number;
    resumen: string;
    recomendaciones_medicas: string[];
    tipo_analisis: 'imagen-medica' | 'documento-texto' | 'video-procedimiento';
  };
}

const DOCUMENT_CATEGORIES = [
  { value: 'Radiología', label: 'Radiología', icon: FileImage, color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  { value: 'Laboratorio', label: 'Laboratorio', icon: FileText, color: 'bg-green-500/20 text-green-400 border-green-500/30' },
  { value: 'Cirugía', label: 'Cirugía', icon: Stethoscope, color: 'bg-red-500/20 text-red-400 border-red-500/30' },
  { value: 'Consulta', label: 'Consulta', icon: User, color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  { value: 'Administrativo', label: 'Administrativo', icon: FolderOpen, color: 'bg-gray-500/20 text-gray-400 border-gray-500/30' },
  { value: 'Imagenes Médicas', label: 'Imágenes Médicas', icon: Image, color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' },
  { value: 'Videos', label: 'Videos', icon: Video, color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  { value: 'Reportes', label: 'Reportes', icon: FileText, color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' }
];

export function DocumentManagement() {
  const { currentUser, hasPermission } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // Mock data para demostración
  const mockDocuments: Document[] = [
    {
      id: 'doc-001',
      nombre_archivo: 'radiografia_columna_cervical_20240115.dcm',
      tipo_archivo: 'application/dicom',
      categoria: 'Radiología',
      descripcion: 'Radiografía de columna cervical - Control postoperatorio',
      fecha_subida: '2024-01-15T10:30:00Z',
      tamano_bytes: 2048576,
      subido_por: 'Dr. Joel Sánchez García',
      paciente_id: 'pac-001',
      paciente_nombre: 'María González',
      es_confidencial: true,
      estado: 'activo',
      url_almacenamiento: 'gs://medical-docs/radiology/doc-001.dcm',
      analisis_ia: {
        completado: true,
        fecha_analisis: '2024-01-15T10:35:00Z',
        hallazgos: [
          'Alineación vertebral normal en C1-C7',
          'Sin evidencia de fracturas agudas',
          'Espacios discales preservados',
          'Proceso de fusión en C4-C5 progresando adecuadamente'
        ],
        confianza: 94,
        resumen: 'Radiografía cervical post-fusión C4-C5 muestra evolución favorable sin complicaciones',
        recomendaciones_medicas: [
          'Continuar con fisioterapia',
          'Control radiográfico en 3 meses',
          'Evitar movimientos bruscos de cuello'
        ],
        tipo_analisis: 'imagen-medica'
      }
    },
    {
      id: 'doc-002',
      nombre_archivo: 'laboratorio_hemograma_20240118.pdf',
      tipo_archivo: 'application/pdf',
      categoria: 'Laboratorio',
      descripcion: 'Hemograma completo preoperatorio - Paciente programado para cirugía',
      fecha_subida: '2024-01-18T08:45:00Z',
      tamano_bytes: 156789,
      subido_por: 'Ana Laura Aguilar',
      paciente_id: 'pac-002',
      paciente_nombre: 'Carlos Rodríguez',
      es_confidencial: false,
      estado: 'activo',
      url_almacenamiento: 'gs://medical-docs/lab/doc-002.pdf',
      analisis_ia: {
        completado: true,
        fecha_analisis: '2024-01-18T08:50:00Z',
        hallazgos: [
          'Valores hematológicos dentro de rangos normales',
          'Hemoglobina: 14.2 g/dl (normal)',
          'Leucocitos: 6,800/μL (normal)',
          'Plaquetas: 245,000/μL (normal)'
        ],
        confianza: 98,
        resumen: 'Hemograma preoperatorio sin alteraciones significativas, paciente apto para cirugía',
        recomendaciones_medicas: [
          'Paciente apto para procedimiento quirúrgico',
          'No requiere intervenciones adicionales',
          'Continuar con preparación preoperatoria estándar'
        ],
        tipo_analisis: 'documento-texto'
      }
    },
    {
      id: 'doc-003',
      nombre_archivo: 'video_cirugia_fusion_lumbar_20240120.mp4',
      tipo_archivo: 'video/mp4',
      categoria: 'Videos',
      descripción: 'Video quirúrgico - Fusión lumbar L4-L5 - Técnica mínimamente invasiva',
      fecha_subida: '2024-01-20T14:20:00Z',
      tamano_bytes: 524288000,
      subido_por: 'Dr. Joel Sánchez García',
      paciente_id: 'pac-003',
      paciente_nombre: 'Ana María López',
      es_confidencial: true,
      estado: 'activo',
      url_almacenamiento: 'gs://medical-docs/videos/doc-003.mp4',
      analisis_ia: {
        completado: false,
        fecha_analisis: '',
        hallazgos: [],
        confianza: 0,
        resumen: 'Análisis de IA en progreso...',
        recomendaciones_medicas: [],
        tipo_analisis: 'video-procedimiento'
      }
    },
    {
      id: 'doc-004',
      nombre_archivo: 'resonancia_magnetica_lumbar_20240112.dcm',
      tipo_archivo: 'application/dicom',
      categoria: 'Imagenes Médicas',
      descripcion: 'RM lumbar - Evaluación de hernia discal L4-L5',
      fecha_subida: '2024-01-12T16:15:00Z',
      tamano_bytes: 15728640,
      subido_por: 'Dr. Joel Sánchez García',
      paciente_id: 'pac-004',
      paciente_nombre: 'Roberto Mendoza',
      es_confidencial: true,
      estado: 'archivado',
      url_almacenamiento: 'gs://medical-docs/mri/doc-004.dcm',
      analisis_ia: {
        completado: true,
        fecha_analisis: '2024-01-12T16:25:00Z',
        hallazgos: [
          'Hernia discal posterolateral L4-L5 con compresión radicular',
          'Disminución del espacio discal L4-L5',
          'Edema en raíz nerviosa L5',
          'Cambios degenerativos tempranos'
        ],
        confianza: 92,
        resumen: 'RM lumbar confirma hernia discal L4-L5 con compromiso neurológico que requiere tratamiento quirúrgico',
        recomendaciones_medicas: [
          'Cirugía de descompresión recomendada',
          'Evaluación neuroquirúrgica urgente',
          'Manejo del dolor con analgésicos',
          'Fisioterapia post-quirúrgica'
        ],
        tipo_analisis: 'imagen-medica'
      }
    }
  ];

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      // En producción: const response = await apiService.getDocuments();
      
      // Simulación de carga
      await new Promise(resolve => setTimeout(resolve, 1000));
      setDocuments(mockDocuments);
    } catch (error) {
      console.error('Error loading documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.nombre_archivo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.paciente_nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || doc.categoria === selectedCategory;
    
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'active' && doc.estado === 'activo') ||
                      (activeTab === 'archived' && doc.estado === 'archivado') ||
                      (activeTab === 'confidential' && doc.es_confidencial) ||
                      (activeTab === 'ai-analyzed' && doc.analisis_ia?.completado);
    
    return matchesSearch && matchesCategory && matchesTab;
  });

  const getCategoryIcon = (categoria: string) => {
    const category = DOCUMENT_CATEGORIES.find(cat => cat.value === categoria);
    return category ? category.icon : FileText;
  };

  const getCategoryColor = (categoria: string) => {
    const category = DOCUMENT_CATEGORIES.find(cat => cat.value === categoria);
    return category ? category.color : 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulación de subida
      for (let i = 0; i <= 100; i += 10) {
        setUploadProgress(i);
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Aquí iría la lógica real de subida
      console.log('Files uploaded:', files);
      
      await loadDocuments();
      setShowUpload(false);
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleArchiveDocument = async (documentId: string) => {
    if (!hasPermission('documents', 'archive')) {
      alert('No tienes permisos para archivar documentos');
      return;
    }

    try {
      // Soft delete - cambiar estado a archivado
      setDocuments(prev => 
        prev.map(doc => 
          doc.id === documentId 
            ? { ...doc, estado: 'archivado' as const }
            : doc
        )
      );

      console.log(`Documento ${documentId} archivado (eliminación suave)`);
    } catch (error) {
      console.error('Error archiving document:', error);
    }
  };

  const handleDeleteDocument = async (documentId: string) => {
    if (!hasPermission('documents', 'delete')) {
      alert('No tienes permisos para eliminar documentos definitivamente');
      return;
    }

    // Solo usuarios con rol soporte-absoluto pueden eliminar definitivamente
    if (currentUser?.role !== 'soporte-absoluto') {
      alert('Solo el soporte técnico puede eliminar documentos definitivamente');
      return;
    }

    const confirmed = window.confirm('¿Está seguro de que desea eliminar este documento DEFINITIVAMENTE? Esta acción no se puede deshacer.');
    
    if (!confirmed) return;

    try {
      setDocuments(prev => prev.filter(doc => doc.id !== documentId));
      console.log(`Documento ${documentId} eliminado definitivamente`);
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white text-2xl font-bold">Gestión de Documentos</h1>
          <p className="text-white/60">Sistema completo de documentos médicos con análisis IA</p>
        </div>
        {hasPermission('documents', 'write') && (
          <Button 
            className="apple-button-primary"
            onClick={() => setShowUpload(true)}
          >
            <Upload className="w-4 h-4 mr-2" />
            Subir Documentos
          </Button>
        )}
      </div>

      {/* Filters and Search */}
      <Card className="apple-card">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <Label className="text-white mb-2 block">Buscar documentos</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-white/40" />
                <Input
                  placeholder="Buscar por nombre, paciente o descripción..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/5 border-white/20 text-white"
                />
              </div>
            </div>
            <div className="w-full lg:w-64">
              <Label className="text-white mb-2 block">Categoría</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="bg-white/5 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  {DOCUMENT_CATEGORIES.map(category => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5 bg-white/5">
          <TabsTrigger value="all" className="text-white data-[state=active]:bg-white/10">
            Todos ({documents.length})
          </TabsTrigger>
          <TabsTrigger value="active" className="text-white data-[state=active]:bg-white/10">
            Activos ({documents.filter(d => d.estado === 'activo').length})
          </TabsTrigger>
          <TabsTrigger value="archived" className="text-white data-[state=active]:bg-white/10">
            Archivados ({documents.filter(d => d.estado === 'archivado').length})
          </TabsTrigger>
          <TabsTrigger value="confidential" className="text-white data-[state=active]:bg-white/10">
            Confidenciales ({documents.filter(d => d.es_confidencial).length})
          </TabsTrigger>
          <TabsTrigger value="ai-analyzed" className="text-white data-[state=active]:bg-white/10">
            Con IA ({documents.filter(d => d.analisis_ia?.completado).length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
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
          ) : filteredDocuments.length === 0 ? (
            <Card className="apple-card">
              <CardContent className="p-12 text-center">
                <FileX className="w-12 h-12 text-white/40 mx-auto mb-4" />
                <h3 className="text-white text-lg mb-2">No hay documentos</h3>
                <p className="text-white/60">No se encontraron documentos que coincidan con los filtros aplicados.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredDocuments.map(doc => {
                const IconComponent = getCategoryIcon(doc.categoria);
                return (
                  <Card key={doc.id} className="apple-card apple-card-hover">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 apple-card flex items-center justify-center">
                            <IconComponent className="w-6 h-6 text-blue-400" />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-white font-medium">{doc.nombre_archivo}</h3>
                              {doc.es_confidencial && (
                                <Shield className="w-4 h-4 text-yellow-400" />
                              )}
                              {doc.estado === 'archivado' && (
                                <Archive className="w-4 h-4 text-gray-400" />
                              )}
                            </div>
                            
                            <p className="text-white/60 text-sm mb-2">{doc.descripcion}</p>
                            
                            <div className="flex items-center gap-4 text-xs text-white/40">
                              <span>{doc.paciente_nombre}</span>
                              <span>{formatFileSize(doc.tamano_bytes)}</span>
                              <span>{new Date(doc.fecha_subida).toLocaleDateString()}</span>
                              <span>Por: {doc.subido_por}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Badge className={getCategoryColor(doc.categoria)}>
                            {doc.categoria}
                          </Badge>
                          
                          {doc.analisis_ia && (
                            <Badge className={doc.analisis_ia.completado 
                              ? 'bg-green-500/20 text-green-400 border-green-500/30'
                              : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                            }>
                              <Brain className="w-3 h-3 mr-1" />
                              {doc.analisis_ia.completado 
                                ? `IA: ${doc.analisis_ia.confianza}%`
                                : 'Analizando...'
                              }
                            </Badge>
                          )}
                          
                          <div className="flex items-center gap-1 ml-2">
                            {hasPermission('documents', 'read') && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-white/60 hover:text-white"
                                onClick={() => setSelectedDocument(doc)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            )}
                            
                            {hasPermission('documents', 'read') && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-white/60 hover:text-white"
                              >
                                <Download className="w-4 h-4" />
                              </Button>
                            )}
                            
                            {hasPermission('documents', 'archive') && doc.estado === 'activo' && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-yellow-400 hover:text-yellow-300"
                                onClick={() => handleArchiveDocument(doc.id)}
                              >
                                <Archive className="w-4 h-4" />
                              </Button>
                            )}
                            
                            {hasPermission('documents', 'delete') && currentUser?.role === 'soporte-absoluto' && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-red-400 hover:text-red-300"
                                onClick={() => handleDeleteDocument(doc.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* AI Analysis Summary */}
                      {doc.analisis_ia?.completado && (
                        <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Brain className="w-4 h-4 text-blue-400" />
                            <span className="text-blue-400 text-sm font-medium">Análisis IA</span>
                            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                              Confianza: {doc.analisis_ia.confianza}%
                            </Badge>
                          </div>
                          <p className="text-white/80 text-sm mb-2">{doc.analisis_ia.resumen}</p>
                          <div className="text-xs text-white/60">
                            Hallazgos: {doc.analisis_ia.hallazgos.slice(0, 2).join(', ')}
                            {doc.analisis_ia.hallazgos.length > 2 && '...'}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Upload Dialog */}
      {showUpload && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="apple-card w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-white">Subir Documentos</CardTitle>
              <CardDescription>
                Seleccione archivos médicos para subir al sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isUploading ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <Upload className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                    <p className="text-white">Subiendo archivos...</p>
                  </div>
                  <Progress value={uploadProgress} className="w-full" />
                  <p className="text-sm text-white/60 text-center">{uploadProgress}% completado</p>
                </div>
              ) : (
                <>
                  <div>
                    <Label className="text-white mb-2 block">Archivos</Label>
                    <Input
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.dcm,.mp4,.mov"
                      onChange={handleUpload}
                      className="bg-white/5 border-white/20 text-white"
                    />
                    <p className="text-xs text-white/60 mt-1">
                      Formatos soportados: PDF, DOC, DOCX, JPG, PNG, DICOM, MP4, MOV
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      className="flex-1 apple-button-secondary"
                      onClick={() => setShowUpload(false)}
                    >
                      Cancelar
                    </Button>
                    <Button className="flex-1 apple-button-primary">
                      Subir
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Document Detail Modal */}
      {selectedDocument && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="apple-card w-full max-w-4xl max-h-[80vh] overflow-auto">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white">{selectedDocument.nombre_archivo}</CardTitle>
                  <CardDescription>{selectedDocument.descripcion}</CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white/60 hover:text-white"
                  onClick={() => setSelectedDocument(null)}
                >
                  ✕
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Document Info */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-white/5 rounded-lg">
                <div>
                  <Label className="text-white/60">Paciente</Label>
                  <p className="text-white">{selectedDocument.paciente_nombre}</p>
                </div>
                <div>
                  <Label className="text-white/60">Categoría</Label>
                  <p className="text-white">{selectedDocument.categoria}</p>
                </div>
                <div>
                  <Label className="text-white/60">Tamaño</Label>
                  <p className="text-white">{formatFileSize(selectedDocument.tamano_bytes)}</p>
                </div>
                <div>
                  <Label className="text-white/60">Fecha</Label>
                  <p className="text-white">{new Date(selectedDocument.fecha_subida).toLocaleString()}</p>
                </div>
              </div>

              {/* AI Analysis Detail */}
              {selectedDocument.analisis_ia?.completado && (
                <div className="space-y-4">
                  <h3 className="text-white text-lg font-medium">Análisis de Inteligencia Artificial</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-white/60">Confianza del Análisis</Label>
                      <div className="flex items-center gap-2">
                        <Progress value={selectedDocument.analisis_ia.confianza} className="flex-1" />
                        <span className="text-white text-sm">{selectedDocument.analisis_ia.confianza}%</span>
                      </div>
                    </div>
                    <div>
                      <Label className="text-white/60">Tipo de Análisis</Label>
                      <p className="text-white">{selectedDocument.analisis_ia.tipo_analisis}</p>
                    </div>
                  </div>

                  <div>
                    <Label className="text-white/60">Resumen del Análisis</Label>
                    <p className="text-white bg-white/5 p-3 rounded-lg">{selectedDocument.analisis_ia.resumen}</p>
                  </div>

                  <div>
                    <Label className="text-white/60">Hallazgos Principales</Label>
                    <ul className="space-y-1 mt-2">
                      {selectedDocument.analisis_ia.hallazgos.map((hallazgo, index) => (
                        <li key={index} className="text-white/80 text-sm flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                          {hallazgo}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <Label className="text-white/60">Recomendaciones Médicas</Label>
                    <ul className="space-y-1 mt-2">
                      {selectedDocument.analisis_ia.recomendaciones_medicas.map((recomendacion, index) => (
                        <li key={index} className="text-white/80 text-sm flex items-start gap-2">
                          <Stethoscope className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                          {recomendacion}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {!selectedDocument.analisis_ia?.completado && selectedDocument.analisis_ia && (
                <Alert className="border-yellow-500/30 bg-yellow-500/10">
                  <Clock className="h-4 w-4 text-yellow-400" />
                  <AlertDescription className="text-yellow-400">
                    El análisis de IA está en progreso. Los resultados estarán disponibles en breve.
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex gap-2">
                <Button className="flex-1 apple-button-primary">
                  <Download className="w-4 h-4 mr-2" />
                  Descargar
                </Button>
                <Button className="flex-1 apple-button-secondary">
                  <Eye className="w-4 h-4 mr-2" />
                  Vista Previa
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}