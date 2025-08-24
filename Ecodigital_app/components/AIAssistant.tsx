import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { Separator } from './ui/separator';
import { 
  Brain, 
  Send, 
  MessageSquare, 
  FileText, 
  Search,
  Calendar,
  Download,
  Upload,
  Zap,
  Cpu,
  Database,
  Settings,
  User,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Activity,
  TrendingUp,
  MessageCircle,
  Bot,
  Mic,
  Volume2
} from 'lucide-react';
import { useAuth } from './AuthContext';
import localAIService from '../services/localAIService';

interface ChatMessage {
  id: string;
  tipo: 'usuario' | 'ai';
  contenido: string;
  timestamp: string;
  categoria?: 'faq' | 'agendamiento' | 'busqueda' | 'borrador' | 'resumen' | 'general';
  metadatos?: {
    accion_sistema?: string;
    datos_backend?: any;
    referencias?: string[];
  };
}

interface GemmaModelStatus {
  descargado: boolean;
  version: string;
  tamano_mb: number;
  estado: 'descargando' | 'listo' | 'inicializando' | 'activo' | 'error';
  progreso_descarga: number;
  tiempo_inicializacion: number;
  uso_memoria_gb: number;
  velocidad_inferencia_ms: number;
}

interface AVIFunctionality {
  faqs: {
    habilitado: boolean;
    base_conocimiento: string[];
  };
  agendamiento: {
    habilitado: boolean;
    conectado_backend: boolean;
  };
  generacion_texto: {
    habilitado: boolean;
    tipos: ('correos' | 'plantillas' | 'recordatorios' | 'informes')[];
  };
  busqueda: {
    habilitado: boolean;
    lenguaje_natural: boolean;
  };
  reconocimiento_voz: {
    habilitado: boolean;
    idiomas: string[];
  };
  sintesis_voz: {
    habilitado: boolean;
    voces_disponibles: string[];
  };
}

export function AIAssistant() {
  const { currentUser, hasPermission } = useAuth();
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const [gemmaStatus, setGemmaStatus] = useState<GemmaModelStatus>({
    descargado: false,
    version: '3.0.0',
    tamano_mb: 3072, // ~3GB
    estado: 'listo',
    progreso_descarga: 0,
    tiempo_inicializacion: 0,
    uso_memoria_gb: 0,
    velocidad_inferencia_ms: 0
  });
  const [aviFunctionality, setAviFunctionality] = useState<AVIFunctionality>({
    faqs: {
      habilitado: true,
      base_conocimiento: ['Procedimientos Quirúrgicos', 'Cuidados Post-operatorios', 'Horarios de Atención', 'Servicios Médicos']
    },
    agendamiento: {
      habilitado: true,
      conectado_backend: true
    },
    generacion_texto: {
      habilitado: true,
      tipos: ['correos', 'plantillas', 'recordatorios', 'informes']
    },
    busqueda: {
      habilitado: true,
      lenguaje_natural: true
    },
    reconocimiento_voz: {
      habilitado: false, // Solo para App Móvil de Pacientes
      idiomas: ['es-MX', 'en-US']
    },
    sintesis_voz: {
      habilitado: false, // Solo para App Móvil de Pacientes
      voces_disponibles: ['es-MX-Standard-A', 'es-MX-Standard-B']
    }
  });
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  const initialMessages: ChatMessage[] = [
    {
      id: 'msg-001',
      tipo: 'ai',
      contenido: '¡Hola! Soy el Asistente Virtual Inteligente (AVI) del consultorio del Dr. Joel Sánchez García, especialista en cirugía ortopédica y de columna.\n\nEstoy potenciado por el modelo Gemma 3 ejecutándose localmente para garantizar la privacidad de tus datos. Puedo ayudarte con:\n\n🔍 **Responder Preguntas Frecuentes**\n📅 **Facilitar Agendamiento de Citas**\n📝 **Generar Borradores de Texto** (correos, plantillas, recordatorios)\n📊 **Resumir Información y Redactar Informes**\n🔎 **Buscar Información con Lenguaje Natural**\n\n¿En qué puedo asistirte hoy?',
      timestamp: new Date().toISOString(),
      categoria: 'general',
      metadatos: {
        referencias: ['Gemma 3 Local', 'Sistema AVI v1.0', 'Cirugía Especial - Dr. Joel Sánchez García']
      }
    }
  ];

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const loadInitialData = async () => {
    try {
      setChatMessages(initialMessages);
      
      // Inicializar modelo Gemma 3 si no está descargado
      if (!gemmaStatus.descargado) {
        await inicializarGemma3();
      }
      
      // Inicializar servicio de IA local
      await localAIService.initialize();
    } catch (error) {
      console.error('Error loading AVI data:', error);
    }
  };

  const inicializarGemma3 = async () => {
    try {
      setGemmaStatus(prev => ({ ...prev, estado: 'descargando', progreso_descarga: 0 }));
      
      // Simular descarga desde Google Cloud Storage bucket
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setGemmaStatus(prev => ({ ...prev, progreso_descarga: progress }));
      }
      
      setGemmaStatus(prev => ({ ...prev, estado: 'inicializando' }));
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setGemmaStatus(prev => ({
        ...prev,
        descargado: true,
        estado: 'activo',
        tiempo_inicializacion: 2.8,
        uso_memoria_gb: 2.4,
        velocidad_inferencia_ms: 150
      }));

      // Mensaje de confirmación
      const confirmMessage: ChatMessage = {
        id: `msg-${Date.now()}-system`,
        tipo: 'ai',
        contenido: '✅ **Modelo Gemma 3 inicializado correctamente**\n\n• Descargado desde Google Cloud Storage (3.07 GB)\n• Procesamiento 100% local\n• Tiempo de inicialización: 2.8s\n• Memoria utilizada: 2.4 GB\n• Velocidad de inferencia: ~150ms\n\n¡Listo para asistirte con total privacidad!',
        timestamp: new Date().toISOString(),
        categoria: 'general'
      };
      
      setChatMessages(prev => [...prev, confirmMessage]);
      
    } catch (error) {
      console.error('Error initializing Gemma 3:', error);
      setGemmaStatus(prev => ({ ...prev, estado: 'error' }));
    }
  };

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!currentMessage.trim() || isProcessing) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      tipo: 'usuario',
      contenido: currentMessage,
      timestamp: new Date().toISOString()
    };

    setChatMessages(prev => [...prev, userMessage]);
    const messageToProcess = currentMessage;
    setCurrentMessage('');
    setIsProcessing(true);

    try {
      // Procesar con Gemma 3 local
      const aiResponse = await procesarConGemma3(messageToProcess);
      
      const aiMessage: ChatMessage = {
        id: `msg-${Date.now()}-ai`,
        tipo: 'ai',
        contenido: aiResponse.contenido,
        timestamp: new Date().toISOString(),
        categoria: aiResponse.categoria,
        metadatos: aiResponse.metadatos
      };

      setChatMessages(prev => [...prev, aiMessage]);
      
      // Ejecutar acciones del sistema si es necesario
      if (aiResponse.metadatos?.accion_sistema) {
        await ejecutarAccionSistema(aiResponse.metadatos.accion_sistema, aiResponse.metadatos.datos_backend);
      }
      
    } catch (error) {
      console.error('Error processing AVI message:', error);
      
      const errorMessage: ChatMessage = {
        id: `msg-${Date.now()}-error`,
        tipo: 'ai',
        contenido: 'Lo siento, hubo un error al procesar tu consulta con el modelo Gemma 3. Por favor, intenta nuevamente.',
        timestamp: new Date().toISOString(),
        categoria: 'general'
      };

      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  const procesarConGemma3 = async (message: string): Promise<{
    contenido: string;
    categoria: ChatMessage['categoria'];
    metadatos?: ChatMessage['metadatos'];
  }> => {
    // Simular procesamiento local con Gemma 3
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const messageLower = message.toLowerCase();

    // Detectar intención y categorizar
    if (messageLower.includes('cita') || messageLower.includes('agendar') || messageLower.includes('consulta')) {
      return {
        contenido: '📅 **Agendamiento de Citas**\n\nPuedo ayudarte a agendar una cita con el Dr. Joel Sánchez García. Para esto necesito:\n\n• **Tipo de consulta**: Primera vez, seguimiento, o urgente\n• **Fecha preferida**: ¿Tienes alguna fecha en mente?\n• **Síntomas o motivo**: Breve descripción del motivo de consulta\n\n*Conectando con el sistema de citas para verificar disponibilidad...*\n\n¿Podrías proporcionarme estos datos para proceder con el agendamiento?',
        categoria: 'agendamiento',
        metadatos: {
          accion_sistema: 'consultar_horarios_disponibles',
          datos_backend: { especialidad: 'cirugia_ortopedica_columna' },
          referencias: ['Sistema de Citas Backend', 'Dr. Joel Sánchez García']
        }
      };
    }

    if (messageLower.includes('horario') || messageLower.includes('horarios') || messageLower.includes('atencion')) {
      return {
        contenido: '🕐 **Horarios de Atención**\n\n**Dr. Joel Sánchez García**\n*Especialista en Cirugía Ortopédica y de Columna*\n\n**Consulta Externa:**\n• Lunes a Viernes: 9:00 AM - 6:00 PM\n• Sábados: 9:00 AM - 2:00 PM\n\n**Cirugías Programadas:**\n• Martes y Jueves: 7:00 AM - 2:00 PM\n\n**Urgencias:**\n• 24/7 vía teléfono de emergencias\n\n*Los horarios pueden variar por días festivos o compromisos académicos del Dr. Sánchez.*\n\n¿Te gustaría agendar una cita en algún horario específico?',
        categoria: 'faq',
        metadatos: {
          referencias: ['Información de Horarios', 'Dr. Joel Sánchez García']
        }
      };
    }

    if (messageLower.includes('precio') || messageLower.includes('costo') || messageLower.includes('honorarios')) {
      return {
        contenido: '💰 **Información de Honorarios**\n\n**Consulta Externa:**\n• Primera consulta: Consultar directamente\n• Consulta de seguimiento: Consultar directamente\n\n**Procedimientos Quirúrgicos:**\n• Los costos varían según el procedimiento específico\n• Incluye valoración pre-operatoria completa\n• Se proporciona cotización detallada después de evaluación\n\n**Aceptamos:**\n• Pago de contado (descuentos disponibles)\n• Seguros de gastos médicos mayores\n• Planes de financiamiento\n\n*Para información específica de costos, te recomiendo contactar directamente al consultorio o agendar una consulta de valoración.*\n\n¿Te interesa agendar una consulta de valoración?',
        categoria: 'faq',
        metadatos: {
          referencias: ['Información de Honorarios', 'Políticas de Pago']
        }
      };
    }

    if (messageLower.includes('redacta') || messageLower.includes('escribe') || messageLower.includes('borrador') || messageLower.includes('correo')) {
      return {
        contenido: '📝 **Generación de Borradores de Texto**\n\nPuedo ayudarte a redactar diferentes tipos de documentos:\n\n**Correos Electrónicos:**\n• Recordatorios de citas\n• Comunicación con pacientes\n• Correspondencia médica\n\n**Plantillas:**\n• Consentimientos informados\n• Indicaciones post-operatorias\n• Reportes médicos\n\n**Recordatorios:**\n• Citas próximas\n• Medicamentos\n• Cuidados especiales\n\n**Informes:**\n• Resúmenes de consulta\n• Reportes quirúrgicos\n• Notas de evolución\n\n¿Qué tipo de documento necesitas que redacte? Por favor especifica el contenido o propósito.',
        categoria: 'borrador',
        metadatos: {
          referencias: ['Generación de Texto Gemma 3', 'Plantillas Médicas']
        }
      };
    }

    if (messageLower.includes('buscar') || messageLower.includes('encontrar') || messageLower.includes('archivo')) {
      return {
        contenido: '🔍 **Búsqueda de Información**\n\nPuedo ayudarte a buscar información utilizando lenguaje natural:\n\n**Archivos y Documentos:**\n• Historiales clínicos de pacientes\n• Estudios de imagen y laboratorio\n• Reportes quirúrgicos\n• Documentos administrativos\n\n**Información Médica:**\n• Protocolos de tratamiento\n• Guías clínicas\n• Referencias bibliográficas\n• Casos similares\n\n**Ejemplo de búsquedas:**\n• "Encuentra el último estudio de resonancia del paciente García"\n• "Busca casos de fusión lumbar de enero"\n• "Documentos relacionados con instrumentación cervical"\n\n¿Qué información específica necesitas buscar?',
        categoria: 'busqueda',
        metadatos: {
          accion_sistema: 'preparar_busqueda_backend',
          referencias: ['Sistema de Búsqueda', 'Base de Datos Médica']
        }
      };
    }

    if (messageLower.includes('resumen') || messageLower.includes('resume') || messageLower.includes('informe')) {
      return {
        contenido: '📊 **Resúmenes e Informes**\n\nPuedo generar resúmenes detallados de:\n\n**Información Clínica:**\n• Historiales de pacientes\n• Evolución post-operatoria\n• Resultados de estudios\n• Consultas múltiples\n\n**Reportes Administrativos:**\n• Actividad quirúrgica mensual\n• Estadísticas de consulta\n• Análisis de procedimientos\n• Métricas de satisfacción\n\n**Informes Personalizados:**\n• Para seguros médicos\n• Referencias a otros especialistas\n• Reportes académicos\n• Presentaciones de casos\n\n¿Qué información necesitas que resuma? Puedes proporcionarme los datos o indicarme dónde buscarlos.',
        categoria: 'resumen',
        metadatos: {
          referencias: ['Generación de Resúmenes Gemma 3', 'Análisis de Información']
        }
      };
    }

    // Respuesta general para otras consultas
    return {
      contenido: 'Como tu Asistente Virtual Inteligente especializado en cirugía ortopédica y de columna, estoy aquí para ayudarte con cualquier consulta relacionada con:\n\n🏥 **Servicios del Dr. Joel Sánchez García:**\n• Cirugía de columna vertebral\n• Traumatología y ortopedia\n• Tratamiento de hernias discales\n• Fusiones vertebrales\n• Cirugía mínimamente invasiva\n\n💬 **Cómo puedo asistirte:**\n• Responder preguntas sobre procedimientos\n• Agendar citas y consultas\n• Explicar cuidados pre y post-operatorios\n• Buscar información específica\n• Generar documentos y recordatorios\n\n*Procesado localmente con Gemma 3 para garantizar total privacidad.*\n\n¿Hay algo específico en lo que pueda ayudarte?',
      categoria: 'general',
      metadatos: {
        referencias: ['Gemma 3 Local', 'Especialidades Médicas', 'Dr. Joel Sánchez García']
      }
    };
  };

  const ejecutarAccionSistema = async (accion: string, datos?: any) => {
    // Simular comunicación con backend centralizado
    console.log(`Ejecutando acción del sistema: ${accion}`, datos);
    
    switch (accion) {
      case 'consultar_horarios_disponibles':
        // Simulación de consulta al backend
        await new Promise(resolve => setTimeout(resolve, 1000));
        break;
      case 'agendar_cita':
        // Simulación de creación de cita
        await new Promise(resolve => setTimeout(resolve, 1500));
        break;
      case 'preparar_busqueda_backend':
        // Simulación de preparación de búsqueda
        await new Promise(resolve => setTimeout(resolve, 800));
        break;
      default:
        console.log(`Acción no reconocida: ${accion}`);
    }
  };

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'activo':
      case 'listo':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'descargando':
      case 'inicializando':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'error':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusIcon = (estado: string) => {
    switch (estado) {
      case 'activo':
      case 'listo':
        return CheckCircle2;
      case 'descargando':
      case 'inicializando':
        return Clock;
      case 'error':
        return AlertTriangle;
      default:
        return Activity;
    }
  };

  const StatusIcon = getStatusIcon(gemmaStatus.estado);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white text-2xl font-bold flex items-center gap-3">
            <Bot className="w-8 h-8 text-blue-400" />
            Asistente Virtual Inteligente (AVI)
          </h1>
          <p className="text-white/60">Potenciado por Gemma 3 - Procesamiento 100% Local</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <StatusIcon className="w-4 h-4 text-green-400" />
            <span className="text-green-400 text-sm">Gemma 3 Activo</span>
          </div>
          <Badge className={getStatusColor(gemmaStatus.estado)}>
            <Cpu className="w-3 h-3 mr-1" />
            Local v{gemmaStatus.version}
          </Badge>
        </div>
      </div>

      {/* Model Status Card */}
      {gemmaStatus.estado === 'descargando' && (
        <Card className="apple-card">
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-medium">Descargando Modelo Gemma 3</h3>
                <span className="text-white/60 text-sm">{gemmaStatus.progreso_descarga}%</span>
              </div>
              <Progress value={gemmaStatus.progreso_descarga} className="h-2" />
              <p className="text-white/60 text-sm">
                Descargando desde Google Cloud Storage ({gemmaStatus.tamano_mb} MB)
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="apple-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Database className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-white/60 text-sm">Memoria Utilizada</p>
                <p className="text-white text-xl font-bold">{gemmaStatus.uso_memoria_gb} GB</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="apple-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-white/60 text-sm">Velocidad Inferencia</p>
                <p className="text-white text-xl font-bold">{gemmaStatus.velocidad_inferencia_ms}ms</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="apple-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-white/60 text-sm">Consultas Hoy</p>
                <p className="text-white text-xl font-bold">{chatMessages.length - 1}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="apple-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <p className="text-white/60 text-sm">Estado Sistema</p>
                <p className="text-white text-xl font-bold">100%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 bg-white/5">
          <TabsTrigger value="chat" className="text-white data-[state=active]:bg-white/10">
            <MessageSquare className="w-4 h-4 mr-2" />
            Chat Interno Básico
          </TabsTrigger>
          <TabsTrigger value="funcionalidades" className="text-white data-[state=active]:bg-white/10">
            <Brain className="w-4 h-4 mr-2" />
            Funcionalidades AVI
          </TabsTrigger>
          <TabsTrigger value="configuracion" className="text-white data-[state=active]:bg-white/10">
            <Settings className="w-4 h-4 mr-2" />
            Configuración
          </TabsTrigger>
        </TabsList>

        {/* Chat Tab */}
        <TabsContent value="chat">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chat Area */}
            <div className="lg:col-span-2">
              <Card className="apple-card">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white">Chat Interno Básico</CardTitle>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-green-400 text-sm">Gemma 3 Activo</span>
                    </div>
                  </div>
                  <CardDescription className="text-white/60">
                    Consultas rápidas, resúmenes de texto, redacción de informes y activación de automatizaciones
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Messages */}
                  <div className="h-96 overflow-y-auto space-y-4 p-4 bg-white/2 rounded-lg">
                    {chatMessages.map(message => (
                      <div
                        key={message.id}
                        className={`flex ${message.tipo === 'usuario' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[85%] p-3 rounded-lg ${
                          message.tipo === 'usuario'
                            ? 'bg-blue-500/20 text-blue-100 border border-blue-500/30'
                            : 'bg-white/5 text-white border border-white/10'
                        }`}>
                          {message.tipo === 'ai' && (
                            <div className="flex items-center gap-2 mb-2">
                              <Bot className="w-4 h-4 text-blue-400" />
                              <span className="text-blue-400 text-sm font-medium">AVI - Gemma 3</span>
                              {message.categoria && (
                                <Badge className="bg-white/10 text-white/70 text-xs">
                                  {message.categoria}
                                </Badge>
                              )}
                            </div>
                          )}
                          
                          <div className="whitespace-pre-wrap text-sm">{message.contenido}</div>
                          
                          {message.metadatos?.referencias && (
                            <div className="mt-2 pt-2 border-t border-white/10">
                              <div className="flex flex-wrap gap-1">
                                {message.metadatos.referencias.map((ref, index) => (
                                  <Badge key={index} className="bg-white/10 text-white/70 text-xs">
                                    {ref}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          <div className="mt-2 text-xs text-white/40">
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {isProcessing && (
                      <div className="flex justify-start">
                        <div className="bg-white/5 border border-white/10 p-3 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Bot className="w-4 h-4 text-blue-400 animate-pulse" />
                            <span className="text-white/60">Procesando con Gemma 3...</span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div ref={chatEndRef} />
                  </div>

                  {/* Input */}
                  <div className="flex gap-2">
                    <Input
                      placeholder="Escribe tu consulta aquí... (procesamiento 100% local)"
                      value={currentMessage}
                      onChange={(e) => setCurrentMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                      className="flex-1 bg-white/5 border-white/20 text-white"
                      disabled={isProcessing || gemmaStatus.estado !== 'activo'}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!currentMessage.trim() || isProcessing || gemmaStatus.estado !== 'activo'}
                      className="apple-button-primary"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="space-y-4">
              <Card className="apple-card">
                <CardHeader className="pb-4">
                  <CardTitle className="text-white text-lg">Acciones Rápidas AVI</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    variant="ghost"
                    className="w-full justify-start apple-card-hover"
                    onClick={() => setCurrentMessage('¿Cuáles son los horarios de atención del Dr. Sánchez?')}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Preguntas Frecuentes
                  </Button>
                  
                  <Button
                    variant="ghost"
                    className="w-full justify-start apple-card-hover"
                    onClick={() => setCurrentMessage('Quiero agendar una cita con el Dr. Sánchez')}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Agendar Cita
                  </Button>
                  
                  <Button
                    variant="ghost"
                    className="w-full justify-start apple-card-hover"
                    onClick={() => setCurrentMessage('Redacta un correo de recordatorio de cita para mañana')}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Generar Borrador
                  </Button>
                  
                  <Button
                    variant="ghost"
                    className="w-full justify-start apple-card-hover"
                    onClick={() => setCurrentMessage('Busca información sobre cuidados post-operatorios de fusión lumbar')}
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Buscar Información
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Funcionalidades Tab */}
        <TabsContent value="funcionalidades">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="apple-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  FAQs y Consultas
                </CardTitle>
                <CardDescription className="text-white/60">
                  Respuestas automatizadas basadas en conocimiento especializado
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-white/80">Estado</span>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    Habilitado
                  </Badge>
                </div>
                <div>
                  <span className="text-white/80 text-sm">Base de Conocimiento:</span>
                  <div className="mt-2 space-y-1">
                    {aviFunctionality.faqs.base_conocimiento.map((item, index) => (
                      <div key={index} className="text-white/60 text-sm">• {item}</div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="apple-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Agendamiento
                </CardTitle>
                <CardDescription className="text-white/60">
                  Conexión directa con sistema centralizado de citas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-white/80">Estado</span>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    Conectado
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/80">Backend</span>
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                    GCP Activo
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="apple-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Generación de Texto
                </CardTitle>
                <CardDescription className="text-white/60">
                  Creación automatizada de documentos médicos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-white/80">Estado</span>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    Habilitado
                  </Badge>
                </div>
                <div>
                  <span className="text-white/80 text-sm">Tipos Disponibles:</span>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {aviFunctionality.generacion_texto.tipos.map((tipo, index) => (
                      <Badge key={index} className="bg-white/10 text-white/70 text-xs">
                        {tipo}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="apple-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Búsqueda Inteligente
                </CardTitle>
                <CardDescription className="text-white/60">
                  Búsqueda con lenguaje natural en sistema completo
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-white/80">Estado</span>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    Habilitado
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/80">Lenguaje Natural</span>
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                    Activo
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Configuración Tab */}
        <TabsContent value="configuracion">
          <div className="space-y-6">
            <Card className="apple-card">
              <CardHeader>
                <CardTitle className="text-white">Estado del Modelo Gemma 3</CardTitle>
                <CardDescription className="text-white/60">
                  Información detallada del modelo de IA local
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white/80">Versión</Label>
                    <p className="text-white font-mono">{gemmaStatus.version}</p>
                  </div>
                  <div>
                    <Label className="text-white/80">Estado</Label>
                    <Badge className={getStatusColor(gemmaStatus.estado)}>
                      {gemmaStatus.estado}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-white/80">Tamaño del Modelo</Label>
                    <p className="text-white">{(gemmaStatus.tamano_mb / 1024).toFixed(2)} GB</p>
                  </div>
                  <div>
                    <Label className="text-white/80">Memoria Utilizada</Label>
                    <p className="text-white">{gemmaStatus.uso_memoria_gb} GB</p>
                  </div>
                  <div>
                    <Label className="text-white/80">Velocidad de Inferencia</Label>
                    <p className="text-white">{gemmaStatus.velocidad_inferencia_ms} ms</p>
                  </div>
                  <div>
                    <Label className="text-white/80">Tiempo de Inicialización</Label>
                    <p className="text-white">{gemmaStatus.tiempo_inicializacion} s</p>
                  </div>
                </div>

                <Separator className="bg-white/10" />

                <div className="space-y-3">
                  <Label className="text-white/80">Acciones del Modelo</Label>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="apple-button-secondary"
                      onClick={inicializarGemma3}
                      disabled={gemmaStatus.estado === 'descargando' || gemmaStatus.estado === 'inicializando'}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Reinicializar Modelo
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="apple-card">
              <CardHeader>
                <CardTitle className="text-white">Comunicación con Sistema Centralizado</CardTitle>
                <CardDescription className="text-white/60">
                  Configuración de conexión con backend en Google Cloud Platform
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert className="border-blue-500/30 bg-blue-500/10">
                  <CheckCircle2 className="w-4 h-4 text-blue-400" />
                  <AlertDescription className="text-blue-100">
                    Conexión segura establecida con backend centralizado para agendamiento de citas, 
                    consulta de información del sistema y registro en logs de auditoría.
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-white/80">Agendamiento de Citas</span>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      Conectado
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/80">Consulta de Datos</span>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      Conectado
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/80">Logs de Auditoría</span>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      Conectado
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/80">Automatizaciones</span>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      Conectado
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}