import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Progress } from './ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Search, FileText, Euro, Calendar, CheckCircle } from 'lucide-react';

interface PPA {
  id: string;
  buyer: string;
  producer: string;
  volumeMwh: number;
  startDate: string;
  endDate: string;
  status: 'Activo' | 'Pendiente' | 'Completado' | 'Suspendido';
  deliveriesCompleted: number;
  totalDeliveries: number;
  escrowAmount: number;
  linkedTokens: string[];
}

export function PPAOversight() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const mockPPAs: PPA[] = [
    {
      id: 'PPA-2024-0892',
      buyer: 'ACME Manufacturing Corp',
      producer: 'GreenWind NL',
      volumeMwh: 2400,
      startDate: '2024-01-01',
      endDate: '2025-12-31',
      status: 'Activo',
      deliveriesCompleted: 4,
      totalDeliveries: 6,
      escrowAmount: 120000,
      linkedTokens: ['GC-NL-2025-000534', 'GC-NL-2025-000535']
    },
    {
      id: 'PPA-2024-0745',
      buyer: 'TechCorp Solutions',
      producer: 'SolarTech DK',
      volumeMwh: 1800,
      startDate: '2024-06-01',
      endDate: '2026-05-31',
      status: 'Activo',
      deliveriesCompleted: 6,
      totalDeliveries: 8,
      escrowAmount: 95000,
      linkedTokens: ['GC-DK-2025-000456']
    },
    {
      id: 'PPA-2024-0923',
      buyer: 'Retail Chain Europe',
      producer: 'Iberian Solar',
      volumeMwh: 3600,
      startDate: '2024-03-01',
      endDate: '2027-02-28',
      status: 'Pendiente',
      deliveriesCompleted: 0,
      totalDeliveries: 12,
      escrowAmount: 180000,
      linkedTokens: []
    },
    {
      id: 'PPA-2023-0654',
      buyer: 'Industrial Holdings Ltd',
      producer: 'Nordic Wind Power',
      volumeMwh: 1200,
      startDate: '2023-01-01',
      endDate: '2024-12-31',
      status: 'Completado',
      deliveriesCompleted: 12,
      totalDeliveries: 12,
      escrowAmount: 0,
      linkedTokens: ['GC-NO-2024-001234', 'GC-NO-2024-001235']
    },
  ];

  const filteredPPAs = mockPPAs.filter(ppa => {
    const matchesSearch = ppa.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ppa.buyer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ppa.producer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ppa.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      'Activo': 'default',
      'Pendiente': 'outline',
      'Completado': 'secondary',
      'Suspendido': 'destructive'
    } as const;
    
    return <Badge variant={variants[status as keyof typeof variants]}>{status}</Badge>;
  };

  const PPADetailModal = ({ ppa }: { ppa: PPA }) => {
    const progressPercentage = (ppa.deliveriesCompleted / ppa.totalDeliveries) * 100;
    
    return (
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Vista Previa de Contrato PPA Basado en EFET</DialogTitle>
          <DialogDescription>
            ID del Contrato: {ppa.id}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Contract Overview */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Información del Comprador</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium">Nombre de la Empresa</label>
                  <p className="text-sm text-muted-foreground">{ppa.buyer}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Volumen del Contrato</label>
                  <p className="text-sm text-muted-foreground">{ppa.volumeMwh.toLocaleString()} MWh</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Período del Contrato</label>
                  <p className="text-sm text-muted-foreground">{ppa.startDate} a {ppa.endDate}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Información del Productor</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium">Nombre de la Empresa</label>
                  <p className="text-sm text-muted-foreground">{ppa.producer}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Estado de Entrega</label>
                  <p className="text-sm text-muted-foreground">{ppa.deliveriesCompleted}/{ppa.totalDeliveries} entregas completadas</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Fondos de Garantía</label>
                  <p className="text-sm text-muted-foreground">€{ppa.escrowAmount.toLocaleString()} Pre-financiados</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Delivery Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Seguimiento de Hitos de Entrega</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    Progreso: {ppa.deliveriesCompleted}/{ppa.totalDeliveries} Entregas Completadas
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {progressPercentage.toFixed(1)}%
                  </span>
                </div>
                <Progress value={progressPercentage} className="w-full" />
                <div className="grid gap-2 md:grid-cols-3">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Contrato Firmado</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Garantía Financiada</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className={`h-4 w-4 rounded-full ${
                      ppa.status === 'Completado' ? 'bg-green-500' : 'bg-gray-300'
                    }`}></div>
                    <span>Todas las Entregas</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Linked Tokens */}
          <Card>
            <CardHeader>
              <CardTitle>Tokens GoO Vinculados</CardTitle>
              <CardDescription>
                Certificados de energía asignados a este PPA
              </CardDescription>
            </CardHeader>
            <CardContent>
              {ppa.linkedTokens.length > 0 ? (
                <div className="space-y-2">
                  {ppa.linkedTokens.map((tokenId) => (
                    <div key={tokenId} className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="font-mono text-sm">{tokenId}</span>
                      <Badge variant="outline">Asignado</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No hay tokens asignados aún</p>
              )}
              <Button variant="outline" className="w-full mt-3">
                Ver Tokens GoO Vinculados →
              </Button>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Supervisión de Contratos PPA</CardTitle>
          <CardDescription>
            Monitorear Contratos de Compra de Energía y cumplimiento de entregas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search and Filters */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por ID PPA, Comprador o Productor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los Estados</SelectItem>
                <SelectItem value="Activo">Activo</SelectItem>
                <SelectItem value="Pendiente">Pendiente</SelectItem>
                <SelectItem value="Completado">Completado</SelectItem>
                <SelectItem value="Suspendido">Suspendido</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Data Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID PPA</TableHead>
                <TableHead>Comprador</TableHead>
                <TableHead>Productor</TableHead>
                <TableHead>Volumen (MWh)</TableHead>
                <TableHead>Período</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Progreso</TableHead>
                <TableHead>Acción</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPPAs.map((ppa) => {
                const progressPercentage = (ppa.deliveriesCompleted / ppa.totalDeliveries) * 100;
                
                return (
                  <TableRow key={ppa.id}>
                    <TableCell className="font-mono text-sm">{ppa.id}</TableCell>
                    <TableCell>{ppa.buyer}</TableCell>
                    <TableCell>{ppa.producer}</TableCell>
                    <TableCell>{ppa.volumeMwh.toLocaleString()}</TableCell>
                    <TableCell className="text-sm">
                      {ppa.startDate} a {ppa.endDate}
                    </TableCell>
                    <TableCell>{getStatusBadge(ppa.status)}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span>{ppa.deliveriesCompleted}/{ppa.totalDeliveries}</span>
                          <span>{progressPercentage.toFixed(0)}%</span>
                        </div>
                        <Progress value={progressPercentage} className="h-1" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            Vista Previa Contrato
                          </Button>
                        </DialogTrigger>
                        <PPADetailModal ppa={ppa} />
                      </Dialog>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}