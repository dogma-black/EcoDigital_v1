import React from 'react';
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { User, Settings, LogOut } from 'lucide-react';
import { getRoleDisplayName, getRoleColor } from './helpers';

interface UserProfileProps {
  currentUser: any;
  onLogout: () => void;
}

export function UserProfile({ currentUser, onLogout }: UserProfileProps) {
  return (
    <div className="apple-card p-4 apple-card-hover relative">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <span className="text-white font-semibold">
            {currentUser?.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2) || 'Dr'}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-white truncate">
            {currentUser?.name || 'Dr. Usuario'}
          </p>
          <p className={`text-sm font-normal truncate ${getRoleColor(currentUser?.role || '')}`}>
            {getRoleDisplayName(currentUser?.role || '')}
          </p>
          <p className="text-xs text-white/40 truncate">
            {currentUser?.departamento || 'Cirugía de Columna'}
          </p>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-white/10">
              <User className="h-4 w-4 text-white/60" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="apple-card border border-white/20 w-56">
            <DropdownMenuLabel className="text-white">
              {currentUser?.name}
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem className="text-white hover:bg-white/10">
              <User className="h-4 w-4 mr-2" />
              Mi Perfil
            </DropdownMenuItem>
            <DropdownMenuItem className="text-white hover:bg-white/10">
              <Settings className="h-4 w-4 mr-2" />
              Configuración
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem 
              onClick={onLogout}
              className="text-red-400 hover:bg-red-500/10 focus:bg-red-500/10"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar Sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className="absolute top-2 right-2 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
    </div>
  );
}