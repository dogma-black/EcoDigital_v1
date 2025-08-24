// Servicio que simula Cloud SQL con la estructura exacta del documento de BD
// Listo para conectar con la base de datos real de Google Cloud Platform

import configService from './configService';
import { 
  Paciente, 
  HistorialClinico, 
  Usuario, 
  Rol, 
  LogAuditoria, 
  Cita, 
  Procedimiento, 
  ProcedimientoCita, 
  Documento,
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
  QueryResult,
  LoginCredentials,
  LoginResponse,
  SesionUsuario,
  FiltrosPacientes,
  FiltrosCitas,
  FiltrosDocumentos,
  FiltrosAuditoria,
  TipoOperacion,
  PermisosRol
} from '../types/database';

// Configuración de la conexión usando el servicio de configuración
const DB_CONFIG = configService.getDatabaseConfig();

class CloudSQLService {
  private isConnected: boolean = false;
  private sessionToken: string | null = null;
  private currentUser: Usuario | null = null;

  // Simulación de datos - En producción esto serían consultas reales a Cloud SQL
  private pacientes: Paciente[] = [
    {
      id_paciente: 1,
      nombre: 'María Elena',
      apellido: 'González Rodríguez',
      fecha_nac: '1978-03-15',
      datos_contacto: {
        telefono: '+52 55 1234 5678',
        email: 'maria.gonzalez@email.com',
        direccion: 'Av. Reforma 123, Col. Centro, CDMX',
        telefono_emergencia: '+52 55 8765 4321',
        contacto_emergencia: 'Carlos González (Esposo)'
      },
      activo: true,
      created_at: '2024-01-15T10:30:00Z',
      updated_at: '2024-12-15T10:30:00Z'
    },
    {
      id_paciente: 2,
      nombre: 'Carlos Alberto',
      apellido: 'Mendoza López',
      fecha_nac: '1965-08-22',
      datos_contacto: {
        telefono: '+52 55 2345 6789',
        email: 'carlos.mendoza@email.com',
        direccion: 'Calle Insurgentes 456, Col. Roma Norte, CDMX',
        telefono_emergencia: '+52 55 9876 5432',
        contacto_emergencia: 'Ana Mendoza (Hija)'
      },
      activo: true,
      created_at: '2024-02-20T14:20:00Z',
      updated_at: '2024-12-10T14:20:00Z'
    },
    {
      id_paciente: 3,
      nombre: 'Ana Patricia',
      apellido: 'Herrera Jiménez',
      fecha_nac: '1985-11-08',
      datos_contacto: {
        telefono: '+52 55 3456 7890',
        email: 'ana.herrera@email.com',
        direccion: 'Av. Universidad 789, Col. Del Valle, CDMX',
        telefono_emergencia: '+52 55 0987 6543',
        contacto_emergencia: 'Miguel Herrera (Hermano)'
      },
      activo: true,
      created_at: '2024-03-10T09:00:00Z',
      updated_at: '2024-11-28T09:00:00Z'
    }
  ];

  private usuarios: Usuario[] = [
    {
      id_usuario: 1,
      nombre: 'dr.sanchez',
      hash_password: '$2b$10$hash_password_admin_principal', // En producción: hash real
      id_role: 1,
      activo: true,
      nombre_completo: 'Dr. Joel Sánchez García',
      email: 'dr.sanchez@cirugiaespecial.com',
      telefono: '+52 55 1234 5678',
      departamento: 'Neurocirugía',
      especialidad: 'Cirugía de Columna Vertebral',
      cedula_profesional: 'CED-12345678',
      two_factor_enabled: true,
      ultimo_acceso: '2024-12-15T08:30:00Z',
      intentos_fallidos: 0,
      fecha_cambio_password: '2024-11-01T00:00:00Z',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-12-15T08:30:00Z'
    },
    {
      id_usuario: 2,
      nombre: 'ana.aguilar',
      hash_password: '$2b$10$hash_password_admin_secundario',
      id_role: 2,
      activo: true,
      nombre_completo: 'Dra. Ana Laura Aguilar',
      email: 'ana.aguilar@cirugiaespecial.com',
      telefono: '+52 55 2345 6789',
      departamento: 'Administración Clínica',
      especialidad: 'Gestión Médica',
      cedula_profesional: 'CED-87654321',
      two_factor_enabled: true,
      ultimo_acceso: '2024-12-15T09:15:00Z',
      intentos_fallidos: 0,
      fecha_cambio_password: '2024-10-15T00:00:00Z',
      created_at: '2024-02-01T00:00:00Z',
      updated_at: '2024-12-15T09:15:00Z'
    },
    {
      id_usuario: 3,
      nombre: 'visitante.demo',
      hash_password: '$2b$10$hash_password_invitado',
      id_role: 3,
      activo: true,
      nombre_completo: 'Visitante Demo',
      email: 'visitante@demo.com',
      telefono: '+52 55 0000 0000',
      departamento: 'Demo',
      two_factor_enabled: false,
      ultimo_acceso: '2024-12-15T10:00:00Z',
      intentos_fallidos: 0,
      fecha_cambio_password: '2024-12-01T00:00:00Z',
      created_at: '2024-12-01T00:00:00Z',
      updated_at: '2024-12-15T10:00:00Z'
    }
  ];

  private roles: Rol[] = [
    {
      id_role: 1,
      nombre_rol: 'Admin Principal',
      permisos: {
        dashboard: { leer: true, escribir: true, eliminar: true },
        pacientes: { leer: true, escribir: true, eliminar: true },
        citas: { leer: true, escribir: true, eliminar: true },
        documentos: { leer: true, escribir: true, eliminar: true },
        reportes: { leer: true, escribir: true, eliminar: true },
        administracion: { leer: true, escribir: true, eliminar: true },
        'ia-asistente': { leer: true, escribir: true, eliminar: true },
        compliance: { leer: true, escribir: true, eliminar: true },
        auditorias: { leer: true, escribir: true, eliminar: true },
        'system-logs': { leer: true, escribir: true, eliminar: true }
      },
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    {
      id_role: 2,
      nombre_rol: 'Admin Secundario',
      permisos: {
        dashboard: { leer: true, escribir: true, eliminar: false },
        pacientes: { leer: true, escribir: true, eliminar: false },
        citas: { leer: true, escribir: true, eliminar: true },
        documentos: { leer: true, escribir: true, eliminar: false },
        reportes: { leer: true, escribir: true, eliminar: false },
        administracion: { leer: true, escribir: false, eliminar: false },
        'ia-asistente': { leer: true, escribir: true, eliminar: false },
        compliance: { leer: true, escribir: true, eliminar: false },
        auditorias: { leer: true, escribir: false, eliminar: false },
        'system-logs': { leer: true, escribir: false, eliminar: false }
      },
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    {
      id_role: 3,
      nombre_rol: 'Invitado (Solo Lectura)',
      permisos: {
        dashboard: { leer: true, escribir: false, eliminar: false },
        pacientes: { leer: true, escribir: false, eliminar: false },
        citas: { leer: true, escribir: false, eliminar: false },
        documentos: { leer: true, escribir: false, eliminar: false },
        reportes: { leer: true, escribir: false, eliminar: false },
        administracion: { leer: false, escribir: false, eliminar: false },
        'ia-asistente': { leer: true, escribir: false, eliminar: false },
        compliance: { leer: false, escribir: false, eliminar: false },
        auditorias: { leer: false, escribir: false, eliminar: false },
        'system-logs': { leer: false, escribir: false, eliminar: false }
      },
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    }
  ];

  private historialClinico: HistorialClinico[] = [
    {
      id_historial: 1,
      id_paciente: 1,
      fecha_consulta: '2024-12-15',
      diagnostico: 'Hernia discal L4-L5 con compresión radicular',
      notas_medico: `CONSULTA INICIAL:
Paciente femenina de 46 años que acude por dolor lumbar irradiado a miembro inferior izquierdo de 6 meses de evolución. 

EXPLORACIÓN FÍSICA:
- Dolor EVA 8/10
- Signo de Lasègue positivo a 45° en MI izquierdo
- Hipoestesia en dermatoma L5
- Fuerza muscular 4/5 en dorsiflexión del pie izquierdo

ESTUDIOS DE IMAGEN:
- RM lumbar: Hernia discal central L4-L5 con componente extruido, compresión moderada del saco dural y contacto con raíz nerviosa L5 izquierda

PLAN:
1. Manejo conservador inicial con AINES y gabapentina
2. Fisioterapia especializada
3. Evaluación en 4 semanas
4. Si no hay mejoría, considerar procedimiento quirúrgico`,
      activo: true,
      created_at: '2024-12-15T10:30:00Z',
      updated_at: '2024-12-15T10:30:00Z'
    },
    {
      id_historial: 2,
      id_paciente: 2,
      fecha_consulta: '2024-12-10',
      diagnostico: 'Síndrome facetario cervical C5-C6 post-traumático',
      notas_medico: `SEGUIMIENTO POST-TRAUMA:
Paciente masculino de 59 años en seguimiento posterior a accidente automovilístico hace 8 semanas.

SÍNTOMAS ACTUALES:
- Dolor cervical mecánico
- Cefalea occipital intermitente
- Rigidez matutina
- Dolor EVA 4/10

EXPLORACIÓN:
- Rango de movimiento cervical limitado 20%
- Puntos gatillo en músculos suboccipitales
- Maniobras de compresión cervical positivas

ESTUDIOS:
- TAC cervical: Discopatía degenerativa C5-C6, osteofitos marginales anteriores

EVOLUCIÓN:
Buena respuesta al tratamiento conservador. Continuar con fisioterapia y analgesia según necesidad.`,
      activo: true,
      created_at: '2024-12-10T14:20:00Z',
      updated_at: '2024-12-10T14:20:00Z'
    }
  ];

  private logsAuditoria: LogAuditoria[] = [];

  // ===============================
  // MÉTODOS DE CONEXIÓN Y AUTENTICACIÓN
  // ===============================

  async conectar(): Promise<boolean> {
    try {
      // En producción: conexión real a Cloud SQL
      const environment = configService.getEnvironment();
      console.log(`🔌 Conectando a Cloud SQL (${environment})...`, DB_CONFIG.host);
      
      // Simulación de conexión exitosa
      await new Promise(resolve => setTimeout(resolve, 500));
      
      this.isConnected = true;
      console.log('✅ Conectado a Cloud SQL exitosamente');
      
      // Log de configuración en desarrollo
      if (configService.isDevelopment()) {
        console.log('🔧 DB Config:', {
          host: DB_CONFIG.host,
          port: DB_CONFIG.port,
          database: DB_CONFIG.database,
          username: DB_CONFIG.username,
          ssl: DB_CONFIG.ssl
        });
      }
      
      return true;
    } catch (error) {
      console.error('❌ Error conectando a Cloud SQL:', error);
      return false;
    }
  }

  async desconectar(): Promise<void> {
    this.isConnected = false;
    this.sessionToken = null;
    this.currentUser = null;
    console.log('🔌 Desconectado de Cloud SQL');
  }

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      await this.logAuditoria('usuarios', 0, 'login_exitoso', null, credentials);

      // Buscar usuario por nombre (username)
      const usuario = this.usuarios.find(u => u.nombre === credentials.nombre && u.activo);
      
      if (!usuario) {
        await this.logAuditoria('usuarios', 0, 'login_fallido', null, { ...credentials, error: 'Usuario no encontrado' });
        return { success: false, error: 'Credenciales inválidas' };
      }

      // En producción: verificar hash de password con bcrypt
      // const isValidPassword = await bcrypt.compare(credentials.password, usuario.hash_password);
      const isValidPassword = credentials.password === 'admin123'; // Simulación

      if (!isValidPassword) {
        // Incrementar intentos fallidos
        usuario.intentos_fallidos = (usuario.intentos_fallidos || 0) + 1;
        
        await this.logAuditoria('usuarios', usuario.id_usuario, 'login_fallido', null, { 
          username: credentials.nombre, 
          intentos_fallidos: usuario.intentos_fallidos 
        });
        
        return { success: false, error: 'Credenciales inválidas' };
      }

      // Resetear intentos fallidos en login exitoso
      usuario.intentos_fallidos = 0;
      usuario.ultimo_acceso = new Date().toISOString();

      // Obtener rol y permisos
      const rol = this.roles.find(r => r.id_role === usuario.id_role);
      
      if (!rol) {
        return { success: false, error: 'Rol de usuario no válido' };
      }

      // Generar token de sesión (en producción: JWT real)
      const token = `token_${usuario.id_usuario}_${Date.now()}`;
      this.sessionToken = token;
      this.currentUser = { ...usuario, rol };

      await this.logAuditoria('usuarios', usuario.id_usuario, 'login_exitoso', null, { 
        username: credentials.nombre,
        ultimo_acceso: usuario.ultimo_acceso
      });

      return {
        success: true,
        token,
        usuario: { ...usuario, rol },
        permisos: rol.permisos
      };
    } catch (error) {
      console.error('Error en login:', error);
      return { success: false, error: 'Error interno del servidor' };
    }
  }

  async logout(): Promise<void> {
    if (this.currentUser) {
      await this.logAuditoria('usuarios', this.currentUser.id_usuario, 'logout', null, {
        session_duration: Date.now() - new Date(this.currentUser.ultimo_acceso || 0).getTime()
      });
    }
    
    this.sessionToken = null;
    this.currentUser = null;
  }

  async verificarSesion(token: string): Promise<Usuario | null> {
    if (token === this.sessionToken && this.currentUser) {
      return this.currentUser;
    }
    return null;
  }

  // ===============================
  // MÉTODOS CRUD - PACIENTES
  // ===============================

  async obtenerPacientes(filtros?: FiltrosPacientes): Promise<QueryResult<Paciente>> {
    try {
      let pacientesFiltrados = [...this.pacientes];

      if (filtros) {
        if (filtros.nombre) {
          pacientesFiltrados = pacientesFiltrados.filter(p => 
            p.nombre.toLowerCase().includes(filtros.nombre!.toLowerCase())
          );
        }
        if (filtros.apellido) {
          pacientesFiltrados = pacientesFiltrados.filter(p => 
            p.apellido.toLowerCase().includes(filtros.apellido!.toLowerCase())
          );
        }
        if (filtros.activo !== undefined) {
          pacientesFiltrados = pacientesFiltrados.filter(p => p.activo === filtros.activo);
        }
      }

      return {
        rows: pacientesFiltrados,
        rowCount: pacientesFiltrados.length,
        command: 'SELECT',
        success: true
      };
    } catch (error) {
      return {
        rows: [],
        rowCount: 0,
        command: 'SELECT',
        success: false,
        error: String(error)
      };
    }
  }

  async obtenerPacientePorId(id: number): Promise<Paciente | null> {
    return this.pacientes.find(p => p.id_paciente === id) || null;
  }

  async crearPaciente(datos: CreatePaciente): Promise<Paciente> {
    const nuevoPaciente: Paciente = {
      id_paciente: Math.max(...this.pacientes.map(p => p.id_paciente)) + 1,
      ...datos,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    this.pacientes.push(nuevoPaciente);

    await this.logAuditoria('pacientes', nuevoPaciente.id_paciente, 'crear', null, nuevoPaciente);

    return nuevoPaciente;
  }

  async actualizarPaciente(datos: UpdatePaciente): Promise<Paciente | null> {
    const index = this.pacientes.findIndex(p => p.id_paciente === datos.id_paciente);
    
    if (index === -1) {
      return null;
    }

    const pacienteAnterior = { ...this.pacientes[index] };
    const pacienteActualizado = {
      ...this.pacientes[index],
      ...datos,
      updated_at: new Date().toISOString()
    };

    this.pacientes[index] = pacienteActualizado;

    await this.logAuditoria('pacientes', datos.id_paciente, 'actualizar', pacienteAnterior, pacienteActualizado);

    return pacienteActualizado;
  }

  async eliminarPaciente(id: number): Promise<boolean> {
    const paciente = this.pacientes.find(p => p.id_paciente === id);
    
    if (!paciente) {
      return false;
    }

    // Soft delete
    paciente.activo = false;
    paciente.updated_at = new Date().toISOString();

    await this.logAuditoria('pacientes', id, 'eliminar', paciente, { ...paciente, activo: false });

    return true;
  }

  // ===============================
  // MÉTODOS CRUD - HISTORIAL CLÍNICO
  // ===============================

  async obtenerHistorialPorPaciente(idPaciente: number): Promise<HistorialClinico[]> {
    return this.historialClinico.filter(h => h.id_paciente === idPaciente && h.activo);
  }

  async crearHistorialClinico(datos: CreateHistorialClinico): Promise<HistorialClinico> {
    const nuevoHistorial: HistorialClinico = {
      id_historial: Math.max(...this.historialClinico.map(h => h.id_historial), 0) + 1,
      ...datos,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    this.historialClinico.push(nuevoHistorial);

    await this.logAuditoria('historial_clinico', nuevoHistorial.id_historial, 'crear', null, nuevoHistorial);

    return nuevoHistorial;
  }

  async actualizarHistorialClinico(datos: UpdateHistorialClinico): Promise<HistorialClinico | null> {
    const index = this.historialClinico.findIndex(h => h.id_historial === datos.id_historial);
    
    if (index === -1) {
      return null;
    }

    const historialAnterior = { ...this.historialClinico[index] };
    const historialActualizado = {
      ...this.historialClinico[index],
      ...datos,
      updated_at: new Date().toISOString()
    };

    this.historialClinico[index] = historialActualizado;

    await this.logAuditoria('historial_clinico', datos.id_historial, 'actualizar', historialAnterior, historialActualizado);

    return historialActualizado;
  }

  // ===============================
  // MÉTODOS CRUD - USUARIOS
  // ===============================

  async obtenerUsuarios(): Promise<Usuario[]> {
    return this.usuarios.map(u => ({ ...u, rol: this.roles.find(r => r.id_role === u.id_role) }));
  }

  async crearUsuario(datos: CreateUsuario): Promise<Usuario> {
    // En producción: hash del password con bcrypt
    const hashPassword = `$2b$10$hash_${datos.password}_${Date.now()}`;

    const nuevoUsuario: Usuario = {
      id_usuario: Math.max(...this.usuarios.map(u => u.id_usuario)) + 1,
      nombre: datos.nombre,
      hash_password: hashPassword,
      id_role: datos.id_role,
      activo: datos.activo ?? true,
      nombre_completo: datos.nombre_completo,
      email: datos.email,
      telefono: datos.telefono,
      departamento: datos.departamento,
      especialidad: datos.especialidad,
      cedula_profesional: datos.cedula_profesional,
      two_factor_enabled: false,
      intentos_fallidos: 0,
      fecha_cambio_password: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    this.usuarios.push(nuevoUsuario);

    await this.logAuditoria('usuarios', nuevoUsuario.id_usuario, 'crear', null, {
      ...nuevoUsuario,
      hash_password: '[HIDDEN]' // No logear el hash del password
    });

    return { ...nuevoUsuario, rol: this.roles.find(r => r.id_role === nuevoUsuario.id_role) };
  }

  async actualizarUsuario(datos: UpdateUsuario): Promise<Usuario | null> {
    const index = this.usuarios.findIndex(u => u.id_usuario === datos.id_usuario);
    
    if (index === -1) {
      return null;
    }

    const usuarioAnterior = { ...this.usuarios[index] };
    const datosActualizacion: any = { ...datos };
    
    // Si se proporciona nueva password, hashearla
    if (datos.password) {
      datosActualizacion.hash_password = `$2b$10$hash_${datos.password}_${Date.now()}`;
      datosActualizacion.fecha_cambio_password = new Date().toISOString();
      delete datosActualizacion.password;
    }

    const usuarioActualizado = {
      ...this.usuarios[index],
      ...datosActualizacion,
      updated_at: new Date().toISOString()
    };

    this.usuarios[index] = usuarioActualizado;

    await this.logAuditoria('usuarios', datos.id_usuario, 'actualizar', 
      { ...usuarioAnterior, hash_password: '[HIDDEN]' }, 
      { ...usuarioActualizado, hash_password: '[HIDDEN]' }
    );

    return { ...usuarioActualizado, rol: this.roles.find(r => r.id_role === usuarioActualizado.id_role) };
  }

  // ===============================
  // LOGS DE AUDITORÍA
  // ===============================

  private async logAuditoria(
    tabla: string, 
    idRegistro: number, 
    operacion: TipoOperacion, 
    datosAnteriores: any, 
    datosNuevos: any
  ): Promise<void> {
    const nuevoLog: LogAuditoria = {
      id_log: this.logsAuditoria.length + 1,
      tabla_afectada: tabla,
      id_registro_afectado: idRegistro,
      tipo_operacion: operacion,
      datos_anteriores: datosAnteriores,
      datos_nuevos: datosNuevos,
      fecha_hora: new Date().toISOString(),
      id_usuario_autor: this.currentUser?.id_usuario || 0
    };

    this.logsAuditoria.push(nuevoLog);
  }

  async obtenerLogsAuditoria(filtros?: FiltrosAuditoria): Promise<QueryResult<LogAuditoria>> {
    try {
      let logsFiltrados = [...this.logsAuditoria];

      if (filtros) {
        if (filtros.tabla_afectada) {
          logsFiltrados = logsFiltrados.filter(l => l.tabla_afectada === filtros.tabla_afectada);
        }
        if (filtros.tipo_operacion) {
          logsFiltrados = logsFiltrados.filter(l => l.tipo_operacion === filtros.tipo_operacion);
        }
        if (filtros.id_usuario_autor) {
          logsFiltrados = logsFiltrados.filter(l => l.id_usuario_autor === filtros.id_usuario_autor);
        }
        if (filtros.fecha_desde) {
          logsFiltrados = logsFiltrados.filter(l => l.fecha_hora >= filtros.fecha_desde!);
        }
        if (filtros.fecha_hasta) {
          logsFiltrados = logsFiltrados.filter(l => l.fecha_hora <= filtros.fecha_hasta!);
        }
      }

      // Ordenar por fecha descendente (más recientes primero)
      logsFiltrados.sort((a, b) => new Date(b.fecha_hora).getTime() - new Date(a.fecha_hora).getTime());

      return {
        rows: logsFiltrados,
        rowCount: logsFiltrados.length,
        command: 'SELECT',
        success: true
      };
    } catch (error) {
      return {
        rows: [],
        rowCount: 0,
        command: 'SELECT',
        success: false,
        error: String(error)
      };
    }
  }

  // ===============================
  // MÉTODOS DE SALUD Y MONITOREO
  // ===============================

  async healthCheck(): Promise<{ status: string; database: string; timestamp: string }> {
    return {
      status: this.isConnected ? 'healthy' : 'disconnected',
      database: DB_CONFIG.database,
      timestamp: new Date().toISOString()
    };
  }

  async obtenerEstadisticas(): Promise<{
    total_pacientes: number;
    pacientes_activos: number;
    total_historiales: number;
    total_usuarios: number;
    usuarios_activos: number;
    total_logs: number;
  }> {
    return {
      total_pacientes: this.pacientes.length,
      pacientes_activos: this.pacientes.filter(p => p.activo).length,
      total_historiales: this.historialClinico.length,
      total_usuarios: this.usuarios.length,
      usuarios_activos: this.usuarios.filter(u => u.activo).length,
      total_logs: this.logsAuditoria.length
    };
  }

  // ===============================
  // GESTIÓN DE ROLES Y PERMISOS
  // ===============================

  async obtenerRoles(): Promise<Rol[]> {
    return this.roles;
  }

  verificarPermiso(usuario: Usuario, modulo: string, accion: 'leer' | 'escribir' | 'eliminar'): boolean {
    const rol = this.roles.find(r => r.id_role === usuario.id_role);
    if (!rol) return false;

    const permisoModulo = rol.permisos[modulo as keyof PermisosRol];
    if (!permisoModulo) return false;

    return permisoModulo[accion];
  }
}

// Instancia singleton del servicio
const cloudSQLService = new CloudSQLService();

export default cloudSQLService;

// Funciones helper para uso en componentes
export async function inicializarBaseDatos(): Promise<boolean> {
  return await cloudSQLService.conectar();
}

export async function cerrarBaseDatos(): Promise<void> {
  return await cloudSQLService.desconectar();
}

export { cloudSQLService };