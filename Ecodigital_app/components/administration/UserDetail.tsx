import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Clock, Mail, Phone, Stethoscope, AlertTriangle, Lock, Unlock } from 'lucide-react';
import { MedicalUser } from './types';
import { getRoleColor, getStatusColor, getRoleDisplayName, formatLastLogin } from './helpers';

interface UserDetailProps {
  user: MedicalUser;
}

export function UserDetail({ user }: UserDetailProps) {
  return (
    <Tabs defaultValue="profile" className="w-full">
      <TabsList className="grid w-full grid-cols-3 bg-white/5">
        <TabsTrigger value="profile" className="data-[state=active]:bg-blue-500">Perfil</TabsTrigger>
        <TabsTrigger value="activity" className="data-[state=active]:bg-blue-500">Actividad</TabsTrigger>
        <TabsTrigger value="security" className="data-[state=active]:bg-blue-500">Seguridad</TabsTrigger>
      </TabsList>

      <TabsContent value="profile" className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="apple-card">
            <CardHeader>
              <CardTitle className="text-white">Información Personal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-white/80">Nombre Completo</Label>
                <p className="text-white">{user.name}</p>
              </div>
              <div>
                <Label className="text-white/80">Email</Label>
                <p className="text-white">{user.email}</p>
              </div>
              <div>
                <Label className="text-white/80">Teléfono</Label>
                <p className="text-white">{user.phone}</p>
              </div>
              <div>
                <Label className="text-white/80">Número de Cédula</Label>
                <p className="text-white">{user.licenseNumber || 'No especificado'}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="apple-card">
            <CardHeader>
              <CardTitle className="text-white">Información Profesional</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-white/80">Rol del Sistema</Label>
                <div className="mt-1">
                  <Badge variant="outline" className={getRoleColor(user.role)}>
                    {getRoleDisplayName(user.role)}
                  </Badge>
                </div>
              </div>
              <div>
                <Label className="text-white/80">Departamento</Label>
                <p className="text-white">{user.department}</p>
              </div>
              <div>
                <Label className="text-white/80">Especialización</Label>
                <p className="text-white">{user.specialization || 'No especificada'}</p>
              </div>
              <div>
                <Label className="text-white/80">Estado</Label>
                <div className="mt-1">
                  <Badge variant="outline" className={getStatusColor(user.status)}>
                    {user.status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="activity" className="space-y-6">
        <Card className="apple-card">
          <CardHeader>
            <CardTitle className="text-white">Actividad Reciente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-white text-sm">Último acceso</span>
                </div>
                <span className="text-white/60 text-sm">{formatLastLogin(user.lastLogin)}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-white text-sm">Cuenta creada</span>
                </div>
                <span className="text-white/60 text-sm">
                  {new Date(user.createdDate).toLocaleDateString('es-ES')}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span className="text-white text-sm">Cambio de contraseña</span>
                </div>
                <span className="text-white/60 text-sm">
                  {new Date(user.lastPasswordChange).toLocaleDateString('es-ES')}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="security" className="space-y-6">
        <Card className="apple-card">
          <CardHeader>
            <CardTitle className="text-white">Configuración de Seguridad</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                <div className="flex items-center gap-3">
                  {user.twoFactorEnabled ? (
                    <Lock className="h-4 w-4 text-green-400" />
                  ) : (
                    <Unlock className="h-4 w-4 text-yellow-400" />
                  )}
                  <span className="text-white text-sm">Autenticación de dos factores</span>
                </div>
                <Badge variant="outline" className={
                  user.twoFactorEnabled 
                    ? 'bg-green-500/20 text-green-400 border-green-500/30'
                    : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                }>
                  {user.twoFactorEnabled ? 'Activado' : 'Desactivado'}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-4 w-4 text-blue-400" />
                  <span className="text-white text-sm">Intentos de acceso fallidos</span>
                </div>
                <span className="text-white font-medium">{user.failedLoginAttempts}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-purple-400" />
                  <span className="text-white text-sm">Última actualización de contraseña</span>
                </div>
                <span className="text-white/60 text-sm">
                  {new Date(user.lastPasswordChange).toLocaleDateString('es-ES')}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}