import React from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { UserPlus, X } from 'lucide-react';
import { NewUserForm } from './types';

interface UserFormProps {
  form: NewUserForm;
  onChange: (form: NewUserForm) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isValid: boolean;
}

export function UserForm({ form, onChange, onSubmit, onCancel, isValid }: UserFormProps) {
  const updateForm = (field: keyof NewUserForm, value: string) => {
    onChange({
      ...form,
      [field]: value
    });
  };

  return (
    <div className="space-y-6 py-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="text-white">Nombre Completo *</Label>
          <Input
            value={form.name}
            onChange={(e) => updateForm('name', e.target.value)}
            className="bg-white/5 border-white/20 text-white"
            placeholder="Dr. Juan Pérez"
          />
        </div>
        <div>
          <Label className="text-white">Email *</Label>
          <Input
            type="email"
            value={form.email}
            onChange={(e) => updateForm('email', e.target.value)}
            className="bg-white/5 border-white/20 text-white"
            placeholder="juan.perez@cirugiaespecial.com"
          />
        </div>
        <div>
          <Label className="text-white">Teléfono</Label>
          <Input
            value={form.phone}
            onChange={(e) => updateForm('phone', e.target.value)}
            className="bg-white/5 border-white/20 text-white"
            placeholder="+52 55 1234 5678"
          />
        </div>
        <div>
          <Label className="text-white">Rol del Sistema *</Label>
          <Select 
            value={form.role} 
            onValueChange={(value: any) => updateForm('role', value)}
          >
            <SelectTrigger className="bg-white/5 border-white/20 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="apple-card border border-white/20">
              <SelectItem value="admin-secundario">Admin Secundario</SelectItem>
              <SelectItem value="asistente">Asistente</SelectItem>
              <SelectItem value="invitado">Invitado</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-white">Departamento</Label>
          <Input
            value={form.department}
            onChange={(e) => updateForm('department', e.target.value)}
            className="bg-white/5 border-white/20 text-white"
            placeholder="Administración Clínica"
          />
        </div>
        <div>
          <Label className="text-white">Especialización</Label>
          <Input
            value={form.specialization}
            onChange={(e) => updateForm('specialization', e.target.value)}
            className="bg-white/5 border-white/20 text-white"
            placeholder="Enfermería Quirúrgica"
          />
        </div>
        <div className="md:col-span-2">
          <Label className="text-white">Número de Cédula</Label>
          <Input
            value={form.licenseNumber}
            onChange={(e) => updateForm('licenseNumber', e.target.value)}
            className="bg-white/5 border-white/20 text-white"
            placeholder="CED-12345678"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button 
          variant="outline" 
          onClick={onCancel}
          className="apple-button-secondary"
        >
          <X className="h-4 w-4 mr-2" />
          Cancelar
        </Button>
        <Button 
          onClick={onSubmit}
          className="apple-button-primary"
          disabled={!isValid}
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Crear Usuario
        </Button>
      </div>
    </div>
  );
}