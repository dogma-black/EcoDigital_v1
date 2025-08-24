import React, { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { 
  Settings, 
  Users, 
  Calendar, 
  Archive, 
  Activity, 
  Shield, 
  BrainCircuit, 
  CheckCircle, 
  Eye 
} from 'lucide-react';
import { MedicalUser } from './types';
import { PERMISSION_MODULES } from './constants';

interface PermissionsEditorProps {
  user: MedicalUser;
  onSave: (permissions: MedicalUser['permissions']) => void;
  onCancel: () => void;
}

const iconMap = {
  Settings,
  Users,
  Calendar,
  Archive,
  Activity,
  Shield,
  BrainCircuit,
  CheckCircle,
  Eye
};

export function PermissionsEditor({ user, onSave, onCancel }: PermissionsEditorProps) {
  const [permissions, setPermissions] = useState(user.permissions);

  const updatePermission = (module: string, action: 'leer' | 'escribir' | 'eliminar', value: boolean) => {
    setPermissions(prev => ({
      ...prev,
      [module]: {
        ...prev[module as keyof typeof prev],
        [action]: value
      }
    }));
  };

  const handleSave = () => {
    onSave(permissions);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        {PERMISSION_MODULES.map(module => {
          const IconComponent = iconMap[module.icon as keyof typeof iconMap];
          const modulePermissions = permissions[module.key as keyof typeof permissions];
          
          return (
            <Card key={module.key} className="apple-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <IconComponent className="h-5 w-5 text-blue-400" />
                    <span className="font-medium text-white">{module.name}</span>
                  </div>
                  <div className="flex gap-6">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={modulePermissions.leer}
                        onCheckedChange={(checked) => updatePermission(module.key, 'leer', checked)}
                      />
                      <Label className="text-white text-sm">Leer</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={modulePermissions.escribir}
                        onCheckedChange={(checked) => updatePermission(module.key, 'escribir', checked)}
                      />
                      <Label className="text-white text-sm">Escribir</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={modulePermissions.eliminar}
                        onCheckedChange={(checked) => updatePermission(module.key, 'eliminar', checked)}
                      />
                      <Label className="text-white text-sm">Eliminar</Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex justify-end gap-3">
        <Button 
          variant="outline" 
          onClick={onCancel}
          className="apple-button-secondary"
        >
          Cancelar
        </Button>
        <Button 
          onClick={handleSave}
          className="apple-button-primary"
        >
          Guardar Permisos
        </Button>
      </div>
    </div>
  );
}