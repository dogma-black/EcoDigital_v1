import React from 'react';
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel } from '../ui/sidebar';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Brain, Bot, Clock, CheckCircle, Mail } from 'lucide-react';
import { ActivePanel } from './constants';

interface AutomationSectionProps {
  onNavigate: (panel: ActivePanel) => void;
}

export function AutomationSection({ onNavigate }: AutomationSectionProps) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-white/50 text-xs font-medium uppercase tracking-wider px-2 pb-2 pt-3">
        Automatizaciones
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <div className="px-2 space-y-3">
          <p className="text-xs text-white/60 leading-relaxed">
            Configure flujos de trabajo personalizados y automatice tareas repetitivas.
          </p>
          
          <div className="apple-card p-3 apple-card-hover">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Brain className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-white text-sm">Asistente Virtual</h4>
                <p className="text-xs text-white/60 mt-1">
                  IA local para redacción de correos, generación de reportes y consultas médicas.
                </p>
                <Button
                  size="sm"
                  className="apple-button-primary mt-2 h-6 text-xs"
                  onClick={() => onNavigate('ai-assistant')}
                >
                  <Bot className="h-3 w-3 mr-1" />
                  Abrir Chat
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-white/5">
              <Clock className="h-3 w-3 text-white/40" />
              <span className="text-xs text-white/60">Recordatorios automáticos</span>
              <Badge variant="outline" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs ml-auto">
                Próximamente
              </Badge>
            </div>
            <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-white/5">
              <CheckCircle className="h-3 w-3 text-white/40" />
              <span className="text-xs text-white/60">Seguimiento automático</span>
              <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs ml-auto">
                Beta
              </Badge>
            </div>
            <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-white/5">
              <Mail className="h-3 w-3 text-white/40" />
              <span className="text-xs text-white/60">Notificaciones inteligentes</span>
              <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30 text-xs ml-auto">
                Activo
              </Badge>
            </div>
          </div>
        </div>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}