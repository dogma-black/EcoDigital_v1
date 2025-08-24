import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Database, Cloud, Wifi, AlertTriangle } from 'lucide-react';
import { ConnectionStatusProps } from './types';
import { CONNECTION_STATUS, STATUS_MESSAGES, STATUS_COLORS } from './constants';

export function ConnectionStatus({ connectionInfo }: ConnectionStatusProps) {
  const getStatusIcon = () => {
    switch (connectionInfo.status) {
      case CONNECTION_STATUS.CONNECTED:
        return <Database className="h-4 w-4 text-green-400" />;
      case CONNECTION_STATUS.CONNECTING:
        return <Cloud className="h-4 w-4 text-yellow-400 animate-pulse" />;
      case CONNECTION_STATUS.ERROR:
        return <AlertTriangle className="h-4 w-4 text-red-400" />;
      default:
        return <Wifi className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (): string => {
    return STATUS_COLORS[connectionInfo.status] || STATUS_COLORS[CONNECTION_STATUS.ERROR];
  };

  const getStatusMessage = (): string => {
    return STATUS_MESSAGES[connectionInfo.status] || STATUS_MESSAGES[CONNECTION_STATUS.ERROR];
  };

  return (
    <Card className="apple-card mb-6">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${getStatusColor()} animate-pulse`}></div>
            <div>
              <p className="text-white text-sm font-medium">
                {getStatusMessage()}
              </p>
              <p className="text-white/60 text-xs">
                {connectionInfo.database} • {connectionInfo.region}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            {connectionInfo.performance && (
              <div className="text-right">
                <p className="text-xs text-white/60">
                  {connectionInfo.performance.response_time_ms}ms
                </p>
                <p className="text-xs text-white/40">
                  {connectionInfo.performance.active_connections} conn
                </p>
              </div>
            )}
          </div>
        </div>
        
        {connectionInfo.status === CONNECTION_STATUS.ERROR && (
          <div className="mt-3 p-2 rounded-lg bg-red-500/10 border border-red-500/20">
            <p className="text-red-400 text-xs">
              No se pudo conectar a la base de datos. Verifique su conexión e intente nuevamente.
            </p>
          </div>
        )}
        
        {connectionInfo.status === CONNECTION_STATUS.CONNECTED && (
          <div className="mt-3 p-2 rounded-lg bg-green-500/10 border border-green-500/20">
            <p className="text-green-400 text-xs">
              ✅ Sistema listo para autenticación segura
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}