import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ChevronDown, ChevronRight, User, Key } from 'lucide-react';
import { DemoUsersListProps } from './types';

export function DemoUsersList({ 
  demoUsers, 
  isVisible, 
  onToggleVisibility, 
  onSelectUser 
}: DemoUsersListProps) {
  return (
    <Card className="apple-card mb-6">
      <CardHeader 
        className="pb-2 cursor-pointer"
        onClick={onToggleVisibility}
      >
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <Key className="h-5 w-5 text-blue-400" />
              Usuarios Demo
            </CardTitle>
            <CardDescription>
              Credenciales de prueba para diferentes roles
            </CardDescription>
          </div>
          {isVisible ? (
            <ChevronDown className="h-5 w-5 text-white/60" />
          ) : (
            <ChevronRight className="h-5 w-5 text-white/60" />
          )}
        </div>
      </CardHeader>
      
      {isVisible && (
        <CardContent className="pt-0">
          <div className="space-y-3">
            {demoUsers.map((user, index) => (
              <div
                key={index}
                className="apple-card apple-card-hover p-4 cursor-pointer"
                onClick={() => onSelectUser(user)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-white">{user.nombre}</p>
                      <p className="text-sm text-white/60">{user.descripcion}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <Badge variant="outline" className={user.color}>
                      {user.rol}
                    </Badge>
                    <p className="text-xs text-white/40 mt-1">
                      Password: {user.password}
                    </p>
                  </div>
                </div>
                
                <div className="mt-3 pt-3 border-t border-white/10">
                  <Button
                    size="sm"
                    className="apple-button-primary w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectUser(user);
                    }}
                  >
                    Usar estas credenciales
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <p className="text-blue-400 text-xs">
              💡 <strong>Tip:</strong> Haga clic en cualquier usuario para cargar automáticamente sus credenciales
            </p>
          </div>
        </CardContent>
      )}
    </Card>
  );
}