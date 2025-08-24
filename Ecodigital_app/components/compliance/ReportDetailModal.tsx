import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Alert, AlertDescription } from '../ui/alert';
import { 
  CheckCircle2,
  Clock,
  Download,
  FileText,
  Stethoscope
} from 'lucide-react';
import { ComplianceReport } from './types';
import { 
  getStatusIcon, 
  getStatusColor, 
  getRiskColor, 
  getPriorityColor,
  getComplianceTypeConfig 
} from './helpers';

interface ReportDetailModalProps {
  selectedReport: ComplianceReport;
  onClose: () => void;
}

export function ReportDetailModal({ selectedReport, onClose }: ReportDetailModalProps) {
  const StatusIcon = getStatusIcon(selectedReport.estado);
  const typeConfig = getComplianceTypeConfig(selectedReport.tipo);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="apple-card w-full max-w-6xl max-h-[90vh] overflow-auto">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white">{selectedReport.titulo}</CardTitle>
              <CardDescription>{selectedReport.descripcion}</CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-white/60 hover:text-white"
              onClick={onClose}
            >
              ✕
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Report Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-white/5 rounded-lg">
            <div>
              <Label className="text-white/60">Tipo</Label>
              <Badge className={typeConfig?.color || 'bg-gray-500/20 text-gray-400 border-gray-500/30'}>
                {selectedReport.tipo}
              </Badge>
            </div>
            <div>
              <Label className="text-white/60">Estado</Label>
              <div className="flex items-center gap-1 mt-1">
                <StatusIcon className="w-4 h-4 text-green-400" />
                <Badge className={getStatusColor(selectedReport.estado)}>
                  {selectedReport.estado}
                </Badge>
              </div>
            </div>
            <div>
              <Label className="text-white/60">Prioridad</Label>
              <Badge className={getPriorityColor(selectedReport.prioridad)}>
                {selectedReport.prioridad}
              </Badge>
            </div>
            <div>
              <Label className="text-white/60">Cumplimiento</Label>
              <div className="flex items-center gap-2 mt-1">
                <Progress value={selectedReport.porcentaje_cumplimiento} className="flex-1 h-2" />
                <span className="text-white text-sm">{selectedReport.porcentaje_cumplimiento}%</span>
              </div>
            </div>
          </div>

          {/* Responsibility and Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-white/5 rounded-lg">
            <div>
              <Label className="text-white/60">Responsable</Label>
              <p className="text-white">{selectedReport.responsable}</p>
              <p className="text-white/60 text-sm">{selectedReport.departamento}</p>
            </div>
            <div className="space-y-2">
              <div>
                <Label className="text-white/60">Creado</Label>
                <p className="text-white text-sm">{new Date(selectedReport.fecha_creacion).toLocaleString()}</p>
              </div>
              {selectedReport.fecha_vencimiento && (
                <div>
                  <Label className="text-white/60">Vencimiento</Label>
                  <p className="text-white text-sm">{new Date(selectedReport.fecha_vencimiento).toLocaleString()}</p>
                </div>
              )}
              <div>
                <Label className="text-white/60">Última Revisión</Label>
                <p className="text-white text-sm">{new Date(selectedReport.ultima_revision).toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Findings */}
          {selectedReport.hallazgos.length > 0 && (
            <div>
              <h3 className="text-white text-lg font-medium mb-3">Hallazgos Identificados</h3>
              <div className="space-y-3">
                {selectedReport.hallazgos.map(finding => (
                  <div key={finding.id} className="p-4 bg-white/5 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-white font-medium">{finding.categoria}</span>
                          <Badge className={getRiskColor(finding.nivel_riesgo)}>
                            {finding.nivel_riesgo}
                          </Badge>
                          <Badge className={
                            finding.estado === 'cerrado' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                            finding.estado === 'en-progreso' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                            'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                          }>
                            {finding.estado}
                          </Badge>
                        </div>
                        <p className="text-white/80 text-sm mb-2">{finding.descripcion}</p>
                        <div className="flex justify-between text-xs text-white/40">
                          <span>Identificado: {new Date(finding.fecha_identificacion).toLocaleDateString()}</span>
                          {finding.fecha_cierre && (
                            <span>Cerrado: {new Date(finding.fecha_cierre).toLocaleDateString()}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Corrective Actions */}
          {selectedReport.acciones_correctivas.length > 0 && (
            <div>
              <h3 className="text-white text-lg font-medium mb-3">Acciones Correctivas</h3>
              <div className="space-y-3">
                {selectedReport.acciones_correctivas.map(action => (
                  <div key={action.id} className="p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white text-sm font-medium">{action.responsable}</span>
                      <Badge className={
                        action.estado === 'completada' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                        action.estado === 'en-progreso' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                        'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                      }>
                        {action.estado}
                      </Badge>
                    </div>
                    <p className="text-white/80 text-sm mb-3">{action.descripcion}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-white/60 text-xs">
                        Vence: {new Date(action.fecha_limite).toLocaleDateString()}
                      </span>
                      <div className="flex items-center gap-2">
                        <Progress value={action.progreso} className="w-24 h-2" />
                        <span className="text-white/60 text-xs">{action.progreso}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Evidence */}
          {selectedReport.evidencias.length > 0 && (
            <div>
              <h3 className="text-white text-lg font-medium mb-3">Evidencias</h3>
              <div className="space-y-3">
                {selectedReport.evidencias.map(evidence => (
                  <div key={evidence.id} className="p-3 bg-white/5 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-blue-400" />
                      <div>
                        <p className="text-white text-sm font-medium">{evidence.nombre}</p>
                        <p className="text-white/60 text-xs">{evidence.descripcion}</p>
                        <p className="text-white/40 text-xs">
                          Subido: {new Date(evidence.fecha_subida).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-blue-400 hover:text-blue-300"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Button className="flex-1 apple-button-primary">
              <Download className="w-4 h-4 mr-2" />
              Descargar Reporte Completo
            </Button>
            <Button className="flex-1 apple-button-secondary">
              <FileText className="w-4 h-4 mr-2" />
              Generar Resumen Ejecutivo
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}