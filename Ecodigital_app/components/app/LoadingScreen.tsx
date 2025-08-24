import React from 'react';
import Frame1272628233 from '../../imports/Frame1272628233';

export function LoadingScreen() {
  return (
    <div className="min-h-screen bg-[#181818] flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 apple-card flex items-center justify-center rounded-2xl mx-auto mb-4">
          <Frame1272628233 className="w-10 h-10 animate-pulse" />
        </div>
        <h2 className="text-xl font-semibold text-white mb-2">Cargando Sistema Médico</h2>
        <p className="text-white/60">Verificando credenciales...</p>
      </div>
    </div>
  );
}