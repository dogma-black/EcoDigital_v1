import React from 'react';

export function AuroraEffects() {
  return (
    <div className="fixed inset-0 pointer-events-none">
      <div className="absolute top-0 left-1/4 w-96 h-96 aurora-orb-1 rounded-full blur-3xl"></div>
      <div className="absolute top-1/3 right-1/4 w-80 h-80 aurora-orb-2 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 left-1/2 w-72 h-72 aurora-orb-3 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-0 w-64 h-64 aurora-orb-4 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/3 w-88 h-88 aurora-orb-5 rounded-full blur-3xl"></div>
      <div className="absolute top-1/4 right-0 w-48 h-48 aurora-orb-1 rounded-full blur-2xl opacity-60"></div>
      <div className="absolute bottom-1/2 left-1/6 w-56 h-56 aurora-orb-2 rounded-full blur-2xl opacity-50"></div>
      <div className="absolute top-3/4 right-1/2 w-40 h-40 aurora-orb-3 rounded-full blur-2xl opacity-70"></div>
    </div>
  );
}