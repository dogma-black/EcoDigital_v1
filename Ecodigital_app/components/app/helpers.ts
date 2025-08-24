import { navigationItems } from './constants';

export const getRoleDisplayName = (role: string): string => {
  switch (role) {
    case 'admin-principal': return 'Admin Principal';
    case 'admin-secundario': return 'Admin Secundario';
    case 'asistente': return 'Asistente';
    case 'invitado': return 'Invitado';
    default: return role;
  }
};

export const getRoleColor = (role: string): string => {
  switch (role) {
    case 'admin-principal': return 'text-red-400';
    case 'admin-secundario': return 'text-yellow-400';
    case 'asistente': return 'text-blue-400';
    case 'invitado': return 'text-gray-400';
    default: return 'text-white/60';
  }
};

export const getActivePageTitle = (activePanel: string): string => {
  const item = navigationItems.find(item => item.id === activePanel);
  return item?.label || 'Panel Principal';
};

export const groupNavigationByCategory = (allowedItems: typeof navigationItems) => {
  return {
    main: allowedItems.filter(item => item.category === 'main'),
    compliance: allowedItems.filter(item => item.category === 'compliance'),
    ai: allowedItems.filter(item => item.category === 'ai'),
  };
};