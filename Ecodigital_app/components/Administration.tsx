import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  Users, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  UserPlus,
  UserCheck,
  UserX,
  Key,
  Clock,
  Mail,
  Phone,
  Stethoscope,
  Download,
  MoreHorizontal,
  Lock,
  Unlock,
  AlertTriangle,
  Shield
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { useAuth, useActivityTracker } from './AuthContext';
import { MedicalUser, NewUserForm } from './administration/types';
import { ROLES } from './administration/constants';
import { getRoleColor, getStatusColor, getRoleDisplayName, formatLastLogin, getDefaultPermissions } from './administration/helpers';
import { PermissionsEditor } from './administration/PermissionsEditor';
import { UserForm } from './administration/UserForm';
import { UserDetail } from './administration/UserDetail';

export function Administration() {
  const { currentUser, hasPermission } = useAuth();
  const { trackActivity } = useActivityTracker();

  const [users, setUsers] = useState<MedicalUser[]>([
    {
      id: 'usr-001',
      name: 'Dr. Joel Sánchez García',
      email: 'dr.sanchez@cirugiaespecial.com',
      phone: '+52 55 1234 5678',
      role: 'admin-principal',
      department: 'Neurocirugía',
      specialization: 'Cirugía de Columna Vertebral',
      licenseNumber: 'CED-12345678',
      status: 'Activo',
      lastLogin: '2024-12-15T08:30:00Z',
      createdDate: '2024-01-01T00:00:00Z',
      permissions: getDefaultPermissions('admin-principal'),
      twoFactorEnabled: true,
      lastPasswordChange: '2024-11-01T00:00:00Z',
      failedLoginAttempts: 0
    },
    {
      id: 'usr-002',
      name: 'Dra. Ana Laura Aguilar',
      email: 'ana.aguilar@cirugiaespecial.com',
      phone: '+52 55 2345 6789',
      role: 'admin-secundario',
      department: 'Administración Clínica',
      specialization: 'Gestión Médica',
      licenseNumber: 'CED-87654321',
      status: 'Activo',
      lastLogin: '2024-12-15T09:15:00Z',
      createdDate: '2024-02-01T00:00:00Z',
      permissions: getDefaultPermissions('admin-secundario'),
      twoFactorEnabled: true,
      lastPasswordChange: '2024-10-15T00:00:00Z',
      failedLoginAttempts: 0
    },
    {
      id: 'usr-003',
      name: 'Visitante Demo',
      email: 'visitante@demo.com',
      phone: '+52 55 0000 0000',
      role: 'invitado',
      department: 'Demo',
      status: 'Activo',
      lastLogin: '2024-12-15T10:00:00Z',
      createdDate: '2024-12-01T00:00:00Z',
      permissions: getDefaultPermissions('invitado'),
      twoFactorEnabled: false,
      lastPasswordChange: '2024-12-01T00:00:00Z',
      failedLoginAttempts: 0
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<MedicalUser | null>(null);
  const [showUserDetail, setShowUserDetail] = useState(false);
  const [showNewUserDialog, setShowNewUserDialog] = useState(false);
  const [showPermissionsDialog, setShowPermissionsDialog] = useState(false);

  const [newUserForm, setNewUserForm] = useState<NewUserForm>({
    name: '',
    email: '',
    phone: '',
    role: 'asistente',
    department: '',
    specialization: '',
    licenseNumber: ''
  });

  const filteredUsers = users.filter(user => {
    const matchesSearch = searchTerm === '' || 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleCreateUser = async () => {
    if (!newUserForm.name.trim() || !newUserForm.email.trim()) return;

    const defaultPermissions = getDefaultPermissions(newUserForm.role);
    
    const newUser: MedicalUser = {
      id: `usr-${String(users.length + 1).padStart(3, '0')}`,
      name: newUserForm.name,
      email: newUserForm.email,
      phone: newUserForm.phone,
      role: newUserForm.role,
      department: newUserForm.department,
      specialization: newUserForm.specialization,
      licenseNumber: newUserForm.licenseNumber,
      status: 'Activo',
      lastLogin: '',
      createdDate: new Date().toISOString(),
      permissions: defaultPermissions,
      twoFactorEnabled: false,
      lastPasswordChange: new Date().toISOString(),
      failedLoginAttempts: 0
    };

    setUsers([...users, newUser]);
    setNewUserForm({
      name: '',
      email: '',
      phone: '',
      role: 'asistente',
      department: '',
      specialization: '',
      licenseNumber: ''
    });
    setShowNewUserDialog(false);

    await trackActivity('USER_CREATED', {
      user_id: newUser.id,
      user_name: newUser.name,
      user_role: newUser.role
    });
  };

  const handleUpdateUserStatus = async (userId: string, newStatus: MedicalUser['status']) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, status: newStatus } : user
    ));

    await trackActivity('USER_STATUS_UPDATED', {
      user_id: userId,
      new_status: newStatus
    });
  };

  const handleUpdatePermissions = async (userId: string, newPermissions: MedicalUser['permissions']) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, permissions: newPermissions } : user
    ));
    setShowPermissionsDialog(false);

    await trackActivity('USER_PERMISSIONS_UPDATED', {
      user_id: userId,
      permissions_changed: Object.keys(newPermissions)
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Administración de Usuarios</h1>
          <p className="text-white/60 mt-1">
            Gestión de colaboradores, roles y permisos del sistema médico
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="apple-button-secondary">
            <Download className="h-4 w-4 mr-2" />
            Exportar Usuarios
          </Button>
          <Button 
            className="apple-button-primary"
            onClick={() => setShowNewUserDialog(true)}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Nuevo Usuario
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="apple-card">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-white/40" />
              <Input
                placeholder="Buscar por nombre, email o departamento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/5 border-white/20 text-white"
              />
            </div>
            
            <div className="flex gap-3">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-48 bg-white/5 border-white/20 text-white">
                  <SelectValue placeholder="Filtrar por rol" />
                </SelectTrigger>
                <SelectContent className="apple-card border border-white/20">
                  <SelectItem value="all">Todos los roles</SelectItem>
                  <SelectItem value="admin-principal">Admin Principal</SelectItem>
                  <SelectItem value="admin-secundario">Admin Secundario</SelectItem>
                  <SelectItem value="asistente">Asistente</SelectItem>
                  <SelectItem value="invitado">Invitado</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32 bg-white/5 border-white/20 text-white">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent className="apple-card border border-white/20">
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="Activo">Activo</SelectItem>
                  <SelectItem value="Inactivo">Inactivo</SelectItem>
                  <SelectItem value="Suspendido">Suspendido</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="apple-card">
        <CardHeader>
          <CardTitle className="text-white">Usuarios del Sistema</CardTitle>
          <CardDescription>
            {filteredUsers.length} usuarios registrados • {users.filter(u => u.status === 'Activo').length} activos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-white/80">Usuario</TableHead>
                <TableHead className="text-white/80">Rol</TableHead>
                <TableHead className="text-white/80">Departamento</TableHead>
                <TableHead className="text-white/80">Estado</TableHead>
                <TableHead className="text-white/80">Último Acceso</TableHead>
                <TableHead className="text-white/80">Seguridad</TableHead>
                <TableHead className="text-white/80">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id} className="hover:bg-white/5 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-white">{user.name}</p>
                        <div className="flex items-center gap-1 text-xs text-white/60">
                          <Mail className="h-3 w-3" />
                          {user.email}
                        </div>
                        {user.licenseNumber && (
                          <div className="flex items-center gap-1 text-xs text-white/60">
                            <Stethoscope className="h-3 w-3" />
                            {user.licenseNumber}
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getRoleColor(user.role)}>
                      {getRoleDisplayName(user.role)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-white/90">{user.department}</p>
                      {user.specialization && (
                        <p className="text-xs text-white/60">{user.specialization}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(user.status)}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-white/80">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatLastLogin(user.lastLogin)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {user.twoFactorEnabled ? (
                        <div className="flex items-center gap-1">
                          <Lock className="h-3 w-3 text-green-400" />
                          <span className="text-xs text-green-400">2FA</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <Unlock className="h-3 w-3 text-yellow-400" />
                          <span className="text-xs text-yellow-400">Sin 2FA</span>
                        </div>
                      )}
                      {user.failedLoginAttempts > 0 && (
                        <div className="flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3 text-red-400" />
                          <span className="text-xs text-red-400">{user.failedLoginAttempts}</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedUser(user);
                          setShowUserDetail(true);
                        }}
                        className="h-8 w-8 p-0"
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedUser(user);
                          setShowPermissionsDialog(true);
                        }}
                        className="h-8 w-8 p-0"
                      >
                        <Key className="h-3 w-3" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="apple-card border border-white/20">
                          <DropdownMenuItem className="text-white hover:bg-white/10">
                            <Edit className="h-4 w-4 mr-2" />
                            Editar Usuario
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-white hover:bg-white/10"
                            onClick={() => handleUpdateUserStatus(user.id, user.status === 'Activo' ? 'Suspendido' : 'Activo')}
                          >
                            {user.status === 'Activo' ? (
                              <>
                                <UserX className="h-4 w-4 mr-2" />
                                Suspender
                              </>
                            ) : (
                              <>
                                <UserCheck className="h-4 w-4 mr-2" />
                                Activar
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-400 hover:bg-red-500/10">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Eliminar Usuario
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="apple-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm">Total Usuarios</p>
                <p className="text-2xl font-bold text-white">{users.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="apple-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm">Usuarios Activos</p>
                <p className="text-2xl font-bold text-green-400">
                  {users.filter(u => u.status === 'Activo').length}
                </p>
              </div>
              <UserCheck className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="apple-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm">Con 2FA</p>
                <p className="text-2xl font-bold text-purple-400">
                  {users.filter(u => u.twoFactorEnabled).length}
                </p>
              </div>
              <Lock className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="apple-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm">Administradores</p>
                <p className="text-2xl font-bold text-red-400">
                  {users.filter(u => u.role.includes('admin')).length}
                </p>
              </div>
              <Shield className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* New User Dialog */}
      <Dialog open={showNewUserDialog} onOpenChange={setShowNewUserDialog}>
        <DialogContent className="apple-card border border-white/20 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white">Crear Nuevo Usuario</DialogTitle>
            <DialogDescription>
              Agregar un nuevo colaborador al sistema médico
            </DialogDescription>
          </DialogHeader>
          
          <UserForm
            form={newUserForm}
            onChange={setNewUserForm}
            onSubmit={handleCreateUser}
            onCancel={() => setShowNewUserDialog(false)}
            isValid={!!newUserForm.name.trim() && !!newUserForm.email.trim()}
          />
        </DialogContent>
      </Dialog>

      {/* User Detail Dialog */}
      <Dialog open={showUserDetail} onOpenChange={setShowUserDetail}>
        <DialogContent className="apple-card border border-white/20 max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-white">Detalles del Usuario</DialogTitle>
            <DialogDescription>
              Información completa del colaborador
            </DialogDescription>
          </DialogHeader>

          {selectedUser && <UserDetail user={selectedUser} />}
        </DialogContent>
      </Dialog>

      {/* Permissions Dialog */}
      <Dialog open={showPermissionsDialog} onOpenChange={setShowPermissionsDialog}>
        <DialogContent className="apple-card border border-white/20 max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white">Gestión de Permisos</DialogTitle>
            <DialogDescription>
              Configurar permisos de acceso para {selectedUser?.name}
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <PermissionsEditor
              user={selectedUser}
              onSave={(permissions) => handleUpdatePermissions(selectedUser.id, permissions)}
              onCancel={() => setShowPermissionsDialog(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}