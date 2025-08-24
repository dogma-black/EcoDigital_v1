import React from 'react';
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '../ui/sidebar';
import { navigationItems } from './constants';
import { ActivePanel } from './constants';

interface SidebarNavigationProps {
  groupedNavigation: {
    main: typeof navigationItems;
    compliance: typeof navigationItems;
    ai: typeof navigationItems;
  };
  activePanel: ActivePanel;
  onNavigate: (panel: ActivePanel) => void;
}

export function SidebarNavigation({ groupedNavigation, activePanel, onNavigate }: SidebarNavigationProps) {
  return (
    <>
      {groupedNavigation.main.length > 0 && (
        <SidebarGroup>
          <SidebarGroupLabel className="text-white/50 text-xs font-medium uppercase tracking-wider px-2 pb-2 pt-3">
            Navegación Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {groupedNavigation.main.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => onNavigate(item.id)}
                    isActive={activePanel === item.id}
                    className={`
                      w-full h-10 px-3 rounded-lg font-medium transition-all duration-200 group
                      ${activePanel === item.id 
                        ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25' 
                        : 'text-white/70 hover:text-white hover:bg-white/6'
                      }
                    `}
                  >
                    <item.icon className={`h-4 w-4 ${
                      activePanel === item.id ? 'text-white' : 'text-white/60 group-hover:text-white/80'
                    }`} />
                    <span className="ml-2 text-sm">{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      )}

      {groupedNavigation.compliance.length > 0 && (
        <SidebarGroup>
          <SidebarGroupLabel className="text-white/50 text-xs font-medium uppercase tracking-wider px-2 pb-2 pt-3">
            Compliance & Auditorías
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {groupedNavigation.compliance.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => onNavigate(item.id)}
                    isActive={activePanel === item.id}
                    className={`
                      w-full h-10 px-3 rounded-lg font-medium transition-all duration-200 group
                      ${activePanel === item.id 
                        ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25' 
                        : 'text-white/70 hover:text-white hover:bg-white/6'
                      }
                    `}
                  >
                    <item.icon className={`h-4 w-4 ${
                      activePanel === item.id ? 'text-white' : 'text-white/60 group-hover:text-white/80'
                    }`} />
                    <span className="ml-2 text-sm">{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      )}

      {groupedNavigation.ai.length > 0 && (
        <SidebarGroup>
          <SidebarGroupLabel className="text-white/50 text-xs font-medium uppercase tracking-wider px-2 pb-2 pt-3">
            Inteligencia Artificial
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {groupedNavigation.ai.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => onNavigate(item.id)}
                    isActive={activePanel === item.id}
                    className={`
                      w-full h-10 px-3 rounded-lg font-medium transition-all duration-200 group
                      ${activePanel === item.id 
                        ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25' 
                        : 'text-white/70 hover:text-white hover:bg-white/6'
                      }
                    `}
                  >
                    <item.icon className={`h-4 w-4 ${
                      activePanel === item.id ? 'text-white' : 'text-white/60 group-hover:text-white/80'
                    }`} />
                    <span className="ml-2 text-sm">{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      )}
    </>
  );
}