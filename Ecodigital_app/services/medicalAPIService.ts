// Servicio API especializado para operaciones médicas
// Interfaz entre los componentes React y Cloud SQL Service

import cloudSQLService from './cloudSQLService';
import {
  Paciente,
  HistorialClinico,
  Usuario,
  Cita,
  Documento,
  LogAuditoria,
  CreatePaciente,
  UpdatePaciente,
  CreateHistorialClinico,
  UpdateHistorialClinico,
  CreateUsuario,
  UpdateUsuario,
  CreateCita,
  UpdateCita,
  CreateDocumento,
  UpdateDocumento,
  FiltrosPacientes,
  FiltrosCitas,
  FiltrosDocumentos,
  FiltrosAuditoria,
  LoginCredentials,
  LoginResponse,
  EstadoCita,
  TipoCita,
  CategoriaDocumento,
  ReporteMetrica,
  DatosPacientesPorMes,
  DistribucionDiagnosticos
} from '../types/database';

class MedicalAPIService {
  
  // ===============================
  // AUTENTICACIÓN Y SESIONES
  // ===============================

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await cloudSQLService.login(credentials);
      
      if (response.success && response.token) {
        // Almacenar token en localStorage para persistencia
        localStorage.setItem('medical_system_token', response.token);
        localStorage.setItem('medical_system_user', JSON.stringify(response.usuario));
      }
      
      return response;
    } catch (error) {
      console.error('Error en login:', error);
      return { success: false, error: 'Error de conexión' };
    }
  }

  async logout(): Promise<void> {
    try {
      await cloudSQLService.logout();
      localStorage.removeItem('medical_system_token');
      localStorage.removeItem('medical_system_user');
    } catch (error) {
      console.error('Error en logout:', error);
    }
  }

  async verificarSesion(): Promise<Usuario | null> {
    try {
      const token = localStorage.getItem('medical_system_token');
      if (!token) return null;

      return await cloudSQLService.verificarSesion(token);
    } catch (error) {
      console.error('Error verificando sesión:', error);
      return null;
    }
  }

  // ===============================
  // GESTIÓN DE PACIENTES
  // ===============================

  async obtenerPacientes(filtros?: FiltrosPacientes): Promise<Paciente[]> {
    try {
      const result = await cloudSQLService.obtenerPacientes(filtros);
      return result.success ? result.rows : [];
    } catch (error) {
      console.error('Error obteniendo pacientes:', error);
      return [];
    }
  }

  async obtenerPacientePorId(id: number): Promise<Paciente | null> {
    try {
      return await cloudSQLService.obtenerPacientePorId(id);
    } catch (error) {
      console.error('Error obteniendo paciente:', error);
      return null;
    }
  }

  async crearPaciente(datos: CreatePaciente): Promise<Paciente | null> {
    try {
      // Validaciones básicas
      if (!datos.nombre.trim() || !datos.apellido.trim()) {
        throw new Error('Nombre y apellido son obligatorios');
      }

      return await cloudSQLService.crearPaciente(datos);
    } catch (error) {
      console.error('Error creando paciente:', error);
      return null;
    }
  }

  async actualizarPaciente(datos: UpdatePaciente): Promise<Paciente | null> {
    try {
      return await cloudSQLService.actualizarPaciente(datos);
    } catch (error) {
      console.error('Error actualizando paciente:', error);
      return null;
    }
  }

  async eliminarPaciente(id: number): Promise<boolean> {
    try {
      return await cloudSQLService.eliminarPaciente(id);
    } catch (error) {
      console.error('Error eliminando paciente:', error);
      return false;
    }
  }

  async buscarPacientes(termino: string): Promise<Paciente[]> {
    try {
      const filtros: FiltrosPacientes = {};
      
      // Determinar si es búsqueda por nombre o apellido
      if (termino.includes(' ')) {
        const [nombre, apellido] = termino.split(' ');
        filtros.nombre = nombre;
        filtros.apellido = apellido;
      } else {
        filtros.nombre = termino;
      }

      const result = await cloudSQLService.obtenerPacientes(filtros);
      return result.success ? result.rows : [];
    } catch (error) {
      console.error('Error buscando pacientes:', error);
      return [];
    }
  }

  // ===============================
  // GESTIÓN DE HISTORIAL CLÍNICO
  // ===============================

  async obtenerHistorialPaciente(idPaciente: number): Promise<HistorialClinico[]> {
    try {
      return await cloudSQLService.obtenerHistorialPorPaciente(idPaciente);
    } catch (error) {
      console.error('Error obteniendo historial:', error);
      return [];
    }
  }

  async crearEntradaHistorial(datos: CreateHistorialClinico): Promise<HistorialClinico | null> {
    try {
      // Validaciones
      if (!datos.id_paciente || !datos.fecha_consulta) {
        throw new Error('ID de paciente y fecha de consulta son obligatorios');
      }

      return await cloudSQLService.crearHistorialClinico(datos);
    } catch (error) {
      console.error('Error creando entrada de historial:', error);
      return null;
    }
  }

  async actualizarEntradaHistorial(datos: UpdateHistorialClinico): Promise<HistorialClinico | null> {
    try {
      return await cloudSQLService.actualizarHistorialClinico(datos);
    } catch (error) {
      console.error('Error actualizando historial:', error);
      return null;
    }
  }

  // ===============================
  // GESTIÓN DE CITAS MÉDICAS
  // ===============================

  async obtenerCitas(filtros?: FiltrosCitas): Promise<Cita[]> {
    try {
      // Simulación de datos de citas basada en la estructura de BD
      const citasSimuladas: Cita[] = [
        {
          id_cita: 1,
          id_paciente: 1,
          fecha_hora: '2024-12-16T09:00:00Z',
          estado: 'Confirmada',
          tipo_cita: 'Consulta',
          motivo: 'Control post-operatorio hernia discal L4-L5',
          notas: 'Evaluar evolución del dolor y función neurológica',
          duracion_minutos: 30,
          recordatorio_enviado: true,
          activo: true,
          created_at: '2024-12-15T10:00:00Z',
          updated_at: '2024-12-15T10:00:00Z'
        },
        {
          id_cita: 2,
          id_paciente: 2,
          fecha_hora: '2024-12-16T10:30:00Z',
          estado: 'Programada',
          tipo_cita: 'Seguimiento',
          motivo: 'Evolución síndrome facetario cervical',
          notas: 'Reevaluación después de 6 semanas de fisioterapia',
          duracion_minutos: 20,
          recordatorio_enviado: false,
          activo: true,
          created_at: '2024-12-10T15:00:00Z',
          updated_at: '2024-12-10T15:00:00Z'
        },
        {
          id_cita: 3,
          id_paciente: 3,
          fecha_hora: '2024-12-17T14:00:00Z',
          estado: 'Programada',
          tipo_cita: 'Cirugía',
          motivo: 'Fusión lumbar L3-L4-L5 programada',
          notas: 'Procedimiento quirúrgico. Duración estimada: 3-4 horas',
          duracion_minutos: 240,
          recordatorio_enviado: false,
          activo: true,
          created_at: '2024-11-28T09:30:00Z',
          updated_at: '2024-11-28T09:30:00Z'
        }
      ];

      let citasFiltradas = [...citasSimuladas];

      if (filtros) {
        if (filtros.id_paciente) {
          citasFiltradas = citasFiltradas.filter(c => c.id_paciente === filtros.id_paciente);
        }
        if (filtros.estado) {
          citasFiltradas = citasFiltradas.filter(c => c.estado === filtros.estado);
        }
        if (filtros.tipo_cita) {
          citasFiltradas = citasFiltradas.filter(c => c.tipo_cita === filtros.tipo_cita);
        }
        if (filtros.fecha_desde) {
          citasFiltradas = citasFiltradas.filter(c => c.fecha_hora >= filtros.fecha_desde!);
        }
        if (filtros.fecha_hasta) {
          citasFiltradas = citasFiltradas.filter(c => c.fecha_hora <= filtros.fecha_hasta!);
        }
      }

      return citasFiltradas;
    } catch (error) {
      console.error('Error obteniendo citas:', error);
      return [];
    }
  }

  async obtenerCitasDelDia(fecha: string): Promise<Cita[]> {
    try {
      const filtros: FiltrosCitas = {
        fecha_desde: `${fecha}T00:00:00Z`,
        fecha_hasta: `${fecha}T23:59:59Z`
      };
      
      return await this.obtenerCitas(filtros);
    } catch (error) {
      console.error('Error obteniendo citas del día:', error);
      return [];
    }
  }

  async crearCita(datos: CreateCita): Promise<Cita | null> {
    try {
      // Validaciones
      if (!datos.id_paciente || !datos.fecha_hora) {
        throw new Error('ID de paciente y fecha/hora son obligatorios');
      }

      // En producción: lógica real de creación de citas
      console.log('Creando cita:', datos);
      return null; // Placeholder
    } catch (error) {
      console.error('Error creando cita:', error);
      return null;
    }
  }

  async actualizarCita(datos: UpdateCita): Promise<Cita | null> {
    try {
      // En producción: lógica real de actualización
      console.log('Actualizando cita:', datos);
      return null; // Placeholder
    } catch (error) {
      console.error('Error actualizando cita:', error);
      return null;
    }
  }

  async cambiarEstadoCita(idCita: number, nuevoEstado: EstadoCita): Promise<boolean> {
    try {
      return await this.actualizarCita({ id_cita: idCita, estado: nuevoEstado }) !== null;
    } catch (error) {
      console.error('Error cambiando estado de cita:', error);
      return false;
    }
  }

  // ===============================
  // GESTIÓN DE DOCUMENTOS
  // ===============================

  async obtenerDocumentos(filtros?: FiltrosDocumentos): Promise<Documento[]> {
    try {
      // Simulación de documentos médicos
      const documentosSimulados: Documento[] = [
        {
          id_documento: 1,
          id_historial: 1,
          id_paciente: 1,
          nombre_archivo: 'RM_Lumbar_Maria_Gonzalez.dcm',
          tipo_archivo: 'application/dicom',
          tamano_bytes: 25600000,
          url_almacenamiento: 'gs://cirugia-especial-storage/documentos/2024/12/RM_Lumbar_Maria_Gonzalez.dcm',
          descripcion: 'Resonancia magnética lumbar T1 y T2 sagital y axial',
          fecha_subida: '2024-12-15T10:30:00Z',
          subido_por: 1,
          categoria: 'Radiología',
          es_confidencial: true,
          activo: true,
          analisis_ia: {
            completado: true,
            fecha_analisis: '2024-12-15T10:35:00Z',
            hallazgos: [
              'Hernia discal central L4-L5 con componente extruido',
              'Compresión moderada del saco dural',
              'Contacto con raíz nerviosa L5 izquierda',
              'Cambios degenerativos en facetas articulares L4-L5'
            ],
            confianza: 94,
            resumen: 'Hernia discal L4-L5 significativa con compresión neural que requiere evaluación quirúrgica',
            recomendaciones_medicas: [
              'Evaluación neuroquirúrgica urgente',
              'Considerar discectomía lumbar',
              'Manejo del dolor neuropático',
              'Fisioterapia especializada post-tratamiento'
            ],
            tipo_analisis: 'imagen-medica'
          },
          created_at: '2024-12-15T10:30:00Z',
          updated_at: '2024-12-15T10:30:00Z'
        },
        {
          id_documento: 2,
          id_historial: 2,
          id_paciente: 2,
          nombre_archivo: 'TAC_Cervical_Carlos_Mendoza.pdf',
          tipo_archivo: 'application/pdf',
          tamano_bytes: 12800000,
          url_almacenamiento: 'gs://cirugia-especial-storage/documentos/2024/12/TAC_Cervical_Carlos_Mendoza.pdf',
          descripcion: 'TAC cervical con reconstrucción 3D',
          fecha_subida: '2024-12-10T14:20:00Z',
          subido_por: 2,
          categoria: 'Radiología',
          es_confidencial: true,
          activo: true,
          analisis_ia: {
            completado: true,
            fecha_analisis: '2024-12-10T14:25:00Z',
            hallazgos: [
              'Discopatía degenerativa C5-C6',
              'Osteofitos marginales anteriores',
              'Ligera disminución del espacio discal',
              'Sin evidencia de fractura o luxación'
            ],
            confianza: 87,
            resumen: 'Cambios degenerativos cervicales moderados compatibles con síndrome facetario',
            recomendaciones_medicas: [
              'Manejo conservador inicial',
              'Fisioterapia cervical especializada',
              'Considerar bloqueo facetario diagnóstico'
            ],
            tipo_analisis: 'imagen-medica'
          },
          created_at: '2024-12-10T14:20:00Z',
          updated_at: '2024-12-10T14:20:00Z'
        }
      ];

      let documentosFiltrados = [...documentosSimulados];

      if (filtros) {
        if (filtros.id_paciente) {
          documentosFiltrados = documentosFiltrados.filter(d => d.id_paciente === filtros.id_paciente);
        }
        if (filtros.categoria) {
          documentosFiltrados = documentosFiltrados.filter(d => d.categoria === filtros.categoria);
        }
        if (filtros.con_analisis_ia !== undefined) {
          documentosFiltrados = documentosFiltrados.filter(d => 
            filtros.con_analisis_ia ? d.analisis_ia?.completado : !d.analisis_ia?.completado
          );
        }
      }

      return documentosFiltrados;
    } catch (error) {
      console.error('Error obteniendo documentos:', error);
      return [];
    }
  }

  async subirDocumento(
    archivo: File, 
    idPaciente: number, 
    idHistorial?: number, 
    categoria?: CategoriaDocumento,
    descripcion?: string
  ): Promise<Documento | null> {
    try {
      // En producción: subir a Cloud Storage y crear registro en BD
      const nuevoDocumento: CreateDocumento = {
        id_historial: idHistorial,
        id_paciente: idPaciente,
        nombre_archivo: archivo.name,
        tipo_archivo: archivo.type,
        tamano_bytes: archivo.size,
        url_almacenamiento: `gs://cirugia-especial-storage/documentos/${new Date().getFullYear()}/${archivo.name}`,
        descripcion: descripcion || `Documento subido: ${archivo.name}`,
        fecha_subida: new Date().toISOString(),
        subido_por: 1, // En producción: ID del usuario actual
        categoria: categoria || 'Administrativo',
        es_confidencial: true,
        activo: true
      };

      console.log('Simulando subida de documento:', nuevoDocumento);
      
      // Retornar documento simulado con ID
      return {
        id_documento: Date.now(),
        ...nuevoDocumento
      };
    } catch (error) {
      console.error('Error subiendo documento:', error);
      return null;
    }
  }

  // ===============================
  // GESTIÓN DE USUARIOS Y ROLES
  // ===============================

  async obtenerUsuarios(): Promise<Usuario[]> {
    try {
      return await cloudSQLService.obtenerUsuarios();
    } catch (error) {
      console.error('Error obteniendo usuarios:', error);
      return [];
    }
  }

  async crearUsuario(datos: CreateUsuario): Promise<Usuario | null> {
    try {
      return await cloudSQLService.crearUsuario(datos);
    } catch (error) {
      console.error('Error creando usuario:', error);
      return null;
    }
  }

  async actualizarUsuario(datos: UpdateUsuario): Promise<Usuario | null> {
    try {
      return await cloudSQLService.actualizarUsuario(datos);
    } catch (error) {
      console.error('Error actualizando usuario:', error);
      return null;
    }
  }

  async obtenerRoles() {
    try {
      return await cloudSQLService.obtenerRoles();
    } catch (error) {
      console.error('Error obteniendo roles:', error);
      return [];
    }
  }

  // ===============================
  // LOGS DE AUDITORÍA
  // ===============================

  async obtenerLogsAuditoria(filtros?: FiltrosAuditoria): Promise<LogAuditoria[]> {
    try {
      const result = await cloudSQLService.obtenerLogsAuditoria(filtros);
      return result.success ? result.rows : [];
    } catch (error) {
      console.error('Error obteniendo logs de auditoría:', error);
      return [];
    }
  }

  // ===============================
  // REPORTES Y ANALÍTICAS
  // ===============================

  async obtenerMetricasDashboard(): Promise<{
    pacientes_totales: number;
    citas_hoy: number;
    cirugias_mes: number;
    documentos_pendientes: number;
  }> {
    try {
      const estadisticas = await cloudSQLService.obtenerEstadisticas();
      const citasHoy = await this.obtenerCitasDelDia(new Date().toISOString().split('T')[0]);
      
      return {
        pacientes_totales: estadisticas.pacientes_activos,
        citas_hoy: citasHoy.length,
        cirugias_mes: citasHoy.filter(c => c.tipo_cita === 'Cirugía').length,
        documentos_pendientes: 5 // Placeholder
      };
    } catch (error) {
      console.error('Error obteniendo métricas:', error);
      return {
        pacientes_totales: 0,
        citas_hoy: 0,
        cirugias_mes: 0,
        documentos_pendientes: 0
      };
    }
  }

  async obtenerDatosPacientesPorMes(): Promise<DatosPacientesPorMes[]> {
    // Datos simulados basados en el documento de reportes
    return [
      { mes: 'Ene', nuevos: 12, seguimiento: 25, cirugias: 8 },
      { mes: 'Feb', nuevos: 18, seguimiento: 30, cirugias: 12 },
      { mes: 'Mar', nuevos: 15, seguimiento: 28, cirugias: 10 },
      { mes: 'Abr', nuevos: 22, seguimiento: 35, cirugias: 15 },
      { mes: 'May', nuevos: 28, seguimiento: 42, cirugias: 18 },
      { mes: 'Jun', nuevos: 25, seguimiento: 38, cirugias: 16 },
      { mes: 'Jul', nuevos: 32, seguimiento: 45, cirugias: 20 },
      { mes: 'Ago', nuevos: 29, seguimiento: 41, cirugias: 19 },
      { mes: 'Sep', nuevos: 35, seguimiento: 48, cirugias: 22 },
      { mes: 'Oct', nuevos: 31, seguimiento: 44, cirugias: 21 },
      { mes: 'Nov', nuevos: 38, seguimiento: 52, cirugias: 25 },
      { mes: 'Dic', nuevos: 42, seguimiento: 58, cirugias: 28 }
    ];
  }

  async obtenerDistribucionDiagnosticos(): Promise<DistribucionDiagnosticos[]> {
    // Datos simulados basados en el documento de reportes
    return [
      { diagnostico: 'Hernia Discal', cantidad: 35, porcentaje: 35 },
      { diagnostico: 'Estenosis Espinal', cantidad: 28, porcentaje: 28 },
      { diagnostico: 'Escoliosis', cantidad: 18, porcentaje: 18 },
      { diagnostico: 'Fracturas Vertebrales', cantidad: 12, porcentaje: 12 },
      { diagnostico: 'Otros', cantidad: 7, porcentaje: 7 }
    ];
  }

  // ===============================
  // SALUD DEL SISTEMA
  // ===============================

  async verificarSaludSistema(): Promise<{
    database: string;
    status: string;
    timestamp: string;
    performance: {
      response_time_ms: number;
      active_connections: number;
    }
  }> {
    try {
      const start = Date.now();
      const health = await cloudSQLService.healthCheck();
      const responseTime = Date.now() - start;

      return {
        ...health,
        performance: {
          response_time_ms: responseTime,
          active_connections: 1 // Simulado
        }
      };
    } catch (error) {
      console.error('Error verificando salud del sistema:', error);
      return {
        database: 'cloud_sql_error',
        status: 'error',
        timestamp: new Date().toISOString(),
        performance: {
          response_time_ms: -1,
          active_connections: 0
        }
      };
    }
  }
}

// Instancia singleton del servicio
const medicalAPIService = new MedicalAPIService();

export default medicalAPIService;