import React from 'react';
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel } from '../ui/sidebar';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Search, FolderOpen } from 'lucide-react';
import { fileFolders } from './constants';

interface FilesSectionProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  expandedFolder: string | null;
  onFolderClick: (folderId: string) => void;
}

export function FilesSection({ searchTerm, onSearchChange, expandedFolder, onFolderClick }: FilesSectionProps) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-white/50 text-xs font-medium uppercase tracking-wider px-2 pb-2 pt-3">
        Mis Archivos
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <div className="relative mb-3 px-2">
          <Search className="absolute left-5 top-3 h-3 w-3 text-white/40" />
          <Input
            placeholder="Buscar archivos..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8 h-8 text-xs bg-white/5 border-white/20 text-white placeholder:text-white/40"
          />
        </div>
        
        <div className="space-y-1">
          {fileFolders.map((folder) => {
            const IconComponent = expandedFolder === folder.id ? FolderOpen : folder.icon;
            return (
              <button
                key={folder.id}
                onClick={() => onFolderClick(folder.id)}
                className={`
                  w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all duration-200
                  ${expandedFolder === folder.id 
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                    : 'text-white/70 hover:text-white hover:bg-white/6'
                  }
                `}
              >
                <IconComponent className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm font-medium flex-1">{folder.name}</span>
                <Badge 
                  variant="outline" 
                  className={`text-xs h-5 ${
                    expandedFolder === folder.id
                      ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                      : 'bg-white/5 text-white/60 border-white/20'
                  }`}
                >
                  {folder.count}
                </Badge>
              </button>
            );
          })}
        </div>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}