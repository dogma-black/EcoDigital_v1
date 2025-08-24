/**
 * Componente DataTable avanzado
 * Según especificación técnica - Sección 4.4.a (Tabla de Datos)
 */

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { Input } from './input';
import { Checkbox } from './checkbox';
import { Badge } from './badge';
import { Skeleton } from './skeleton';
import { 
  Search, 
  Filter, 
  Download, 
  Plus, 
  MoreHorizontal, 
  ChevronLeft, 
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './dropdown-menu';

export interface DataTableColumn<T = any> {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  render?: (value: any, row: T, index: number) => React.ReactNode;
  className?: string;
}

export interface DataTableAction<T = any> {
  label: string;
  icon?: React.ReactNode;
  onClick: (row: T) => void;
  disabled?: (row: T) => boolean;
  variant?: 'default' | 'destructive';
}

export interface DataTableProps<T = any> {
  data: T[];
  columns: DataTableColumn<T>[];
  loading?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  filterable?: boolean;
  selectable?: boolean;
  sortable?: boolean;
  paginated?: boolean;
  pageSize?: number;
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
  actions?: DataTableAction<T>[];
  onRowClick?: (row: T) => void;
  onSelectionChange?: (selectedRows: T[]) => void;
  onFilterClick?: () => void;
  onExport?: (selectedRows: T[]) => void;
  onAdd?: () => void;
  title?: string;
  description?: string;
  className?: string;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  searchable = true,
  searchPlaceholder = "Buscar...",
  filterable = false,
  selectable = false,
  sortable = true,
  paginated = true,
  pageSize = 10,
  emptyMessage = "No se encontraron registros",
  emptyIcon,
  actions = [],
  onRowClick,
  onSelectionChange,
  onFilterClick,
  onExport,
  onAdd,
  title,
  description,
  className = ""
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState<T[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Filtrado y búsqueda
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    
    return data.filter(row =>
      Object.values(row).some(value =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchTerm]);

  // Ordenamiento
  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredData, sortConfig]);

  // Paginación
  const paginatedData = useMemo(() => {
    if (!paginated) return sortedData;
    
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize, paginated]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  // Handlers
  const handleSort = (key: string) => {
    if (!sortable) return;
    
    setSortConfig(current => {
      if (current?.key === key) {
        return current.direction === 'asc' 
          ? { key, direction: 'desc' }
          : null;
      }
      return { key, direction: 'asc' };
    });
  };

  const handleSelectAll = (checked: boolean) => {
    const newSelection = checked ? paginatedData : [];
    setSelectedRows(newSelection);
    onSelectionChange?.(newSelection);
  };

  const handleSelectRow = (row: T, checked: boolean) => {
    const newSelection = checked
      ? [...selectedRows, row]
      : selectedRows.filter(selected => selected !== row);
    
    setSelectedRows(newSelection);
    onSelectionChange?.(newSelection);
  };

  const getSortIcon = (columnKey: string) => {
    if (sortConfig?.key === columnKey) {
      return sortConfig.direction === 'asc' ? (
        <ArrowUp className="w-4 h-4 ml-1" />
      ) : (
        <ArrowDown className="w-4 h-4 ml-1" />
      );
    }
    return <ArrowUpDown className="w-4 h-4 ml-1 opacity-50" />;
  };

  if (loading) {
    return (
      <Card className={`apple-card ${className}`}>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-48" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-9 w-9" />
              <Skeleton className="h-9 w-9" />
              <Skeleton className="h-9 w-20" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`apple-card ${className}`}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            {title && <CardTitle className="text-white">{title}</CardTitle>}
            {description && (
              <p className="text-white/60 mt-1">{description}</p>
            )}
          </div>
          
          <div className="flex gap-2">
            {selectable && selectedRows.length > 0 && onExport && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onExport(selectedRows)}
                className="apple-button-secondary"
              >
                <Download className="h-4 w-4" />
              </Button>
            )}
            
            {filterable && (
              <Button
                variant="outline"
                size="sm"
                onClick={onFilterClick}
                className="apple-button-secondary"
              >
                <Filter className="h-4 w-4" />
              </Button>
            )}
            
            {onAdd && (
              <Button
                size="sm"
                onClick={onAdd}
                className="apple-button-primary"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nuevo
              </Button>
            )}
          </div>
        </div>

        {searchable && (
          <div className="flex-1 relative max-w-sm">
            <Search className="absolute left-3 top-3 h-4 w-4 text-white/40" />
            <Input
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/5 border-white/20 text-white"
            />
          </div>
        )}
      </CardHeader>

      <CardContent>
        {paginatedData.length === 0 ? (
          <div className="text-center py-12">
            {emptyIcon && <div className="mb-4">{emptyIcon}</div>}
            <p className="text-white/60">{emptyMessage}</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    {selectable && (
                      <th className="text-left p-3 w-12">
                        <Checkbox
                          checked={
                            paginatedData.length > 0 &&
                            selectedRows.length === paginatedData.length
                          }
                          onCheckedChange={handleSelectAll}
                          className="border-white/30 data-[state=checked]:bg-blue-500"
                        />
                      </th>
                    )}
                    
                    {columns.map((column) => (
                      <th
                        key={column.key}
                        className={`text-left p-3 text-white/80 font-medium ${
                          column.sortable !== false && sortable
                            ? 'cursor-pointer hover:text-white'
                            : ''
                        } ${column.className || ''}`}
                        style={{ width: column.width }}
                        onClick={() => 
                          column.sortable !== false && sortable 
                            ? handleSort(column.key) 
                            : undefined
                        }
                      >
                        <div className="flex items-center">
                          {column.label}
                          {column.sortable !== false && sortable && getSortIcon(column.key)}
                        </div>
                      </th>
                    ))}
                    
                    {actions.length > 0 && (
                      <th className="text-left p-3 w-12"></th>
                    )}
                  </tr>
                </thead>
                
                <tbody>
                  {paginatedData.map((row, index) => (
                    <tr
                      key={index}
                      className={`hover:bg-white/5 transition-colors border-b border-white/5 ${
                        onRowClick ? 'cursor-pointer' : ''
                      }`}
                      onClick={() => onRowClick?.(row)}
                    >
                      {selectable && (
                        <td className="p-3">
                          <Checkbox
                            checked={selectedRows.some(selected => selected === row)}
                            onCheckedChange={(checked) => handleSelectRow(row, checked as boolean)}
                            className="border-white/30 data-[state=checked]:bg-blue-500"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </td>
                      )}
                      
                      {columns.map((column) => (
                        <td key={column.key} className={`p-3 text-white/90 ${column.className || ''}`}>
                          {column.render 
                            ? column.render(row[column.key], row, index)
                            : row[column.key]
                          }
                        </td>
                      ))}
                      
                      {actions.length > 0 && (
                        <td className="p-3">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-white/60 hover:text-white"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="apple-card border border-white/20">
                              {actions.map((action, actionIndex) => (
                                <DropdownMenuItem
                                  key={actionIndex}
                                  className={`text-white hover:bg-white/10 ${
                                    action.variant === 'destructive' ? 'text-red-400' : ''
                                  }`}
                                  disabled={action.disabled?.(row)}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    action.onClick(row);
                                  }}
                                >
                                  {action.icon && <span className="mr-2">{action.icon}</span>}
                                  {action.label}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {paginated && totalPages > 1 && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                <div className="text-sm text-white/60">
                  Mostrando {((currentPage - 1) * pageSize) + 1} a{' '}
                  {Math.min(currentPage * pageSize, sortedData.length)} de {sortedData.length} registros
                  {selectedRows.length > 0 && ` • ${selectedRows.length} seleccionados`}
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="apple-button-secondary"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  
                  <div className="flex items-center gap-1">
                    {[...Array(Math.min(5, totalPages))].map((_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <Button
                          key={pageNum}
                          variant={pageNum === currentPage ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(pageNum)}
                          className={
                            pageNum === currentPage 
                              ? "apple-button-primary w-8" 
                              : "apple-button-secondary w-8"
                          }
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="apple-button-secondary"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}