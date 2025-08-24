import React from 'react';
import { useAuth } from './AuthContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';

export function UserSelector() {
  const { currentUser, users, login } = useAuth();

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin-principal':
        return 'destructive';
      case 'admin-secundario':
        return 'secondary';
      case 'invitado':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin-principal':
        return 'Admin Principal';
      case 'admin-secundario':
        return 'Admin Secundario';
      case 'invitado':
        return 'Invitado';
      default:
        return role;
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-sidebar-foreground">Usuario actual:</span>
        <Badge variant={getRoleBadgeVariant(currentUser?.role || '')} className="text-xs">
          {getRoleLabel(currentUser?.role || '')}
        </Badge>
      </div>
      <Select
        value={currentUser?.id || ''}
        onValueChange={login}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Seleccionar usuario" />
        </SelectTrigger>
        <SelectContent>
          {users.map((user) => (
            <SelectItem key={user.id} value={user.id}>
              <div className="flex items-center justify-between w-full">
                <span>{user.name}</span>
                <Badge variant={getRoleBadgeVariant(user.role)} className="ml-2 text-xs">
                  {getRoleLabel(user.role)}
                </Badge>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}