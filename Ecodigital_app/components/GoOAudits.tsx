import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Search, Eye, Download, ExternalLink } from 'lucide-react';

interface GoOToken {
  id: string;
  sourcePlant: string;
  source: string;
  mwh: number;
  tokenDate: string;
  status: 'Activo' | 'Retirado' | 'En Comercio' | 'Marcado';
  linkedPPA: string | null;
  producerName: string;
  country: string;
  blockchainTx: string;
}

export function GoOAudits() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');

  const mockTokens: GoOToken[] = [
    {
      id: 'GC-NL-2025-000534',
      sourcePlant: 'Parque Eólico Zeeland Alpha',
      source: 'Eólica',
      mwh: 150.5,
      tokenDate: '2025-01-15',
      status: 'Activo',
      linkedPPA: 'PPA-2024-0892',
      producerName: 'GreenWind NL',
      country: 'Países Bajos',
      blockchainTx: '0.0.123456'
    },
    {
      id: 'GC-DK-2025-000456',
      sourcePlant: 'Parque Solar Copenhague',
      source: 'Solar',
      mwh: 89.2,
      tokenDate: '2025-01-14',
      status: 'Retirado',
      linkedPPA: 'PPA-2024-0745',
      producerName: 'SolarTech DK',
      country: 'Dinamarca',
      blockchainTx: '0.0.123457'
    },
    {
      id: 'GC-DE-2025-000789',
      sourcePlant: 'Planta de Biogás Múnich',
      source: 'Biogás',
      mwh: 245.8,
      tokenDate: '2025-01-13',
      status: 'Marcado',
      linkedPPA: null,
      producerName: 'BioEnergy Bavaria',
      country: 'Alemania',
      blockchainTx: '0.0.123458'
    },
    {
      id: 'GC-ES-2025-000321',
      sourcePlant: 'Granja Solar Sevilla',
      source: 'Solar',
      mwh: 312.1,
      tokenDate: '2025-01-12',
      status: 'En Comercio',
      linkedPPA: 'PPA-2024-0923',
      producerName: 'Iberian Solar',
      country: 'España',
      blockchainTx: '0.0.123459'
    },
  ];

  const filteredTokens = mockTokens.filter(token => {
    const matchesSearch = token.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         token.sourcePlant.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         token.producerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || token.status === statusFilter;
    const matchesSource = sourceFilter === 'all' || token.source === sourceFilter;
    
    return matchesSearch && matchesStatus && matchesSource;
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      'Activo': 'default',
      'Retirado': 'secondary',
      'En Comercio': 'outline',
      'Marcado': 'destructive'
    } as const;
    
    return <Badge variant={variants[status as keyof typeof variants]}>{status}</Badge>;
  };

  const TokenLifecycleModal = ({ token }: { token: GoOToken }) => (
    <DialogContent className="max-w-3xl">
      <DialogHeader>
        <DialogTitle>Ciclo de Vida del Token: {token.id}</DialogTitle>
        <DialogDescription>
          Pista de auditoría completa y verificación de cumplimiento
        </DialogDescription>
      </DialogHeader>
      
      <div className="space-y-6">
        {/* Metadata */}
        <Card>
          <CardHeader>
            <CardTitle>Metadatos del Token (Conforme a EECS)</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium">Instalación de Producción</label>
              <p className="text-sm text-muted-foreground">{token.sourcePlant}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Fuente de Energía</label>
              <p className="text-sm text-muted-foreground">{token.source}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Volumen</label>
              <p className="text-sm text-muted-foreground">{token.mwh} MWh</p>
            </div>
            <div>
              <label className="text-sm font-medium">Fecha de Producción</label>
              <p className="text-sm text-muted-foreground">{token.tokenDate}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Productor</label>
              <p className="text-sm text-muted-foreground">{token.producerName}</p>
            </div>
            <div>
              <label className="text-sm font-medium">País</label>
              <p className="text-sm text-muted-foreground">{token.country}</p>
            </div>
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Cronología del Ciclo de Vida</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                <div>
                  <p className="font-medium">Fecha de Producción</p>
                  <p className="text-sm text-muted-foreground">{token.tokenDate} - Energía generada y verificada</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="font-medium">Tokenizado</p>
                  <p className="text-sm text-muted-foreground">{token.tokenDate} - Certificado GoO emitido</p>
                </div>
              </div>
              {token.linkedPPA && (
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 bg-yellow-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">Transferido</p>
                    <p className="text-sm text-muted-foreground">Asignado al PPA {token.linkedPPA}</p>
                  </div>
                </div>
              )}
              {token.status === 'Retirado' && (
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 bg-gray-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">Retirado</p>
                    <p className="text-sm text-muted-foreground">Certificado reclamado para reducción de emisiones</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Descargar PDF GoO
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4" />
            Ver en Blockchain: {token.blockchainTx}
          </Button>
        </div>
      </div>
    </DialogContent>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Auditoría del Ciclo de Vida GoO</CardTitle>
          <CardDescription>
            Buscar y auditar Garantías de Origen tokenizadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search and Filters */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por ID Token, Nombre del Productor o Planta..."
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
                <SelectItem value="Retirado">Retirado</SelectItem>
                <SelectItem value="En Comercio">En Comercio</SelectItem>
                <SelectItem value="Marcado">Marcado</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Fuente" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las Fuentes</SelectItem>
                <SelectItem value="Solar">Solar</SelectItem>
                <SelectItem value="Eólica">Eólica</SelectItem>
                <SelectItem value="Biogás">Biogás</SelectItem>
                <SelectItem value="Hidráulica">Hidráulica</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Data Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Token</TableHead>
                <TableHead>Planta Fuente</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>MWh</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>PPA Vinculado</TableHead>
                <TableHead>Acción</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTokens.map((token) => (
                <TableRow key={token.id}>
                  <TableCell className="font-mono text-sm">{token.id}</TableCell>
                  <TableCell>{token.sourcePlant}</TableCell>
                  <TableCell>{token.source}</TableCell>
                  <TableCell>{token.mwh}</TableCell>
                  <TableCell>{token.tokenDate}</TableCell>
                  <TableCell>{getStatusBadge(token.status)}</TableCell>
                  <TableCell>
                    {token.linkedPPA ? (
                      <span className="font-mono text-sm">{token.linkedPPA}</span>
                    ) : (
                      <span className="text-muted-foreground">Ninguno</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          Ver Ciclo de Vida
                        </Button>
                      </DialogTrigger>
                      <TokenLifecycleModal token={token} />
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}