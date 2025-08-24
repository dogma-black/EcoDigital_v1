/**
 * Componente Filter Panel avanzado
 * Según especificación técnica - Sección 4.4.c (Componente de Filtros)
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Checkbox } from './checkbox';
import { Badge } from './badge';
import { Calendar } from './calendar';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from './sheet';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './dialog';
import { 
  Filter, 
  X, 
  Calendar as CalendarIcon, 
  Search,
  RotateCcw
} from 'lucide-react';
// Removed date-fns dependency - using native date formatting

export interface FilterOption {
  key: string;
  label: string;
  type: 'text' | 'select' | 'multiselect' | 'date' | 'daterange' | 'checkbox' | 'number';
  options?: { label: string; value: string }[];
  placeholder?: string;
  defaultValue?: any;
}

export interface FilterValue {
  [key: string]: any;
}

export interface FilterPanelProps {
  options: FilterOption[];
  values: FilterValue;
  onValuesChange: (values: FilterValue) => void;
  onApply: (values: FilterValue) => void;
  onClear: () => void;
  variant?: 'dropdown' | 'modal' | 'sidebar';
  trigger?: React.ReactNode;
  title?: string;
  description?: string;
  showActiveCount?: boolean;
}

export function FilterPanel({
  options,
  values,
  onValuesChange,
  onApply,
  onClear,
  variant = 'dropdown',
  trigger,
  title = 'Filtros',
  description = 'Refina los resultados usando los filtros disponibles',
  showActiveCount = true
}: FilterPanelProps) {
  const [tempValues, setTempValues] = useState<FilterValue>(values);
  const [isOpen, setIsOpen] = useState(false);

  const activeFiltersCount = Object.values(values).filter(value => {
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'string') return value.trim() !== '';
    if (typeof value === 'boolean') return value;
    return value != null && value !== '';
  }).length;

  const handleValueChange = (key: string, value: any) => {
    const newValues = { ...tempValues, [key]: value };
    setTempValues(newValues);
  };

  const handleApply = () => {
    onValuesChange(tempValues);
    onApply(tempValues);
    setIsOpen(false);
  };

  const handleClear = () => {
    const clearedValues: FilterValue = {};
    options.forEach(option => {
      clearedValues[option.key] = option.type === 'multiselect' ? [] : '';
    });
    setTempValues(clearedValues);
    onValuesChange(clearedValues);
    onClear();
  };

  const renderFilterField = (option: FilterOption) => {
    const value = tempValues[option.key] || option.defaultValue;

    switch (option.type) {
      case 'text':
        return (
          <div className="space-y-2">
            <Label className="text-white/80">{option.label}</Label>
            <Input
              placeholder={option.placeholder}
              value={value || ''}
              onChange={(e) => handleValueChange(option.key, e.target.value)}
              className="bg-white/5 border-white/20 text-white"
            />
          </div>
        );

      case 'number':
        return (
          <div className="space-y-2">
            <Label className="text-white/80">{option.label}</Label>
            <Input
              type="number"
              placeholder={option.placeholder}
              value={value || ''}
              onChange={(e) => handleValueChange(option.key, e.target.value)}
              className="bg-white/5 border-white/20 text-white"
            />
          </div>
        );

      case 'select':
        return (
          <div className="space-y-2">
            <Label className="text-white/80">{option.label}</Label>
            <Select
              value={value || ''}
              onValueChange={(newValue) => handleValueChange(option.key, newValue)}
            >
              <SelectTrigger className="bg-white/5 border-white/20 text-white">
                <SelectValue placeholder={option.placeholder} />
              </SelectTrigger>
              <SelectContent className="apple-card border border-white/20">
                {option.options?.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value} className="text-white hover:bg-white/10">
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );

      case 'multiselect':
        return (
          <div className="space-y-2">
            <Label className="text-white/80">{option.label}</Label>
            <div className="space-y-2">
              {option.options?.map((opt) => (
                <div key={opt.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${option.key}-${opt.value}`}
                    checked={(value || []).includes(opt.value)}
                    onCheckedChange={(checked) => {
                      const currentValues = value || [];
                      const newValues = checked
                        ? [...currentValues, opt.value]
                        : currentValues.filter((v: string) => v !== opt.value);
                      handleValueChange(option.key, newValues);
                    }}
                    className="border-white/30 data-[state=checked]:bg-blue-500"
                  />
                  <Label 
                    htmlFor={`${option.key}-${opt.value}`}
                    className="text-white/90 text-sm cursor-pointer"
                  >
                    {opt.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        );

      case 'date':
        return (
          <div className="space-y-2">
            <Label className="text-white/80">{option.label}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal bg-white/5 border-white/20 text-white hover:bg-white/10"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {value ? new Date(value).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : option.placeholder}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 apple-card border border-white/20" align="start">
                <Calendar
                  mode="single"
                  selected={value ? new Date(value) : undefined}
                  onSelect={(date) => handleValueChange(option.key, date?.toISOString())}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        );

      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={option.key}
              checked={!!value}
              onCheckedChange={(checked) => handleValueChange(option.key, checked)}
              className="border-white/30 data-[state=checked]:bg-blue-500"
            />
            <Label htmlFor={option.key} className="text-white/90 cursor-pointer">
              {option.label}
            </Label>
          </div>
        );

      default:
        return null;
    }
  };

  const filterContent = (
    <div className="space-y-6">
      <div className="space-y-4">
        {options.map((option) => (
          <div key={option.key}>
            {renderFilterField(option)}
          </div>
        ))}
      </div>

      {showActiveCount && activeFiltersCount > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-white/60">Filtros activos:</span>
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
            {activeFiltersCount}
          </Badge>
        </div>
      )}

      <div className="flex gap-2 pt-4 border-t border-white/10">
        <Button
          onClick={handleClear}
          variant="outline"
          className="flex-1 apple-button-secondary"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Limpiar
        </Button>
        <Button
          onClick={handleApply}
          className="flex-1 apple-button-primary"
        >
          Aplicar Filtros
        </Button>
      </div>
    </div>
  );

  const defaultTrigger = (
    <Button
      variant="outline"
      size="sm"
      className="apple-button-secondary relative"
    >
      <Filter className="h-4 w-4" />
      {showActiveCount && activeFiltersCount > 0 && (
        <Badge className="absolute -top-2 -right-2 w-5 h-5 p-0 text-xs bg-blue-500 text-white">
          {activeFiltersCount}
        </Badge>
      )}
    </Button>
  );

  switch (variant) {
    case 'modal':
      return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            {trigger || defaultTrigger}
          </DialogTrigger>
          <DialogContent className="apple-card border border-white/20 max-w-md">
            <DialogHeader>
              <DialogTitle className="text-white">{title}</DialogTitle>
              <DialogDescription className="text-white/60">
                {description}
              </DialogDescription>
            </DialogHeader>
            {filterContent}
          </DialogContent>
        </Dialog>
      );

    case 'sidebar':
      return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            {trigger || defaultTrigger}
          </SheetTrigger>
          <SheetContent className="vibrancy-sidebar border-l border-white/20">
            <SheetHeader>
              <SheetTitle className="text-white">{title}</SheetTitle>
              <SheetDescription className="text-white/60">
                {description}
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6">
              {filterContent}
            </div>
          </SheetContent>
        </Sheet>
      );

    default: // dropdown
      return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            {trigger || defaultTrigger}
          </PopoverTrigger>
          <PopoverContent className="w-80 apple-card border border-white/20" align="end">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-white">{title}</h4>
                <p className="text-sm text-white/60">{description}</p>
              </div>
              {filterContent}
            </div>
          </PopoverContent>
        </Popover>
      );
  }
}