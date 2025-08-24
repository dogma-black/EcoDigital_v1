import React, { useState } from 'react';
import { Sidebar, SidebarContent, SidebarHeader, SidebarProvider } from './components/ui/sidebar';
import { Dashboard } from './components/Dashboard';
import { PatientManagement } from './components/PatientManagement';
import { AppointmentSchedule } from './components/AppointmentSchedule';
import { DocumentManagement } from './components/DocumentManagement';
import { Reports } from './components/Reports';
import { Administration } from './components/Administration';
import { AIAssistant } from './components/AIAssistant';
import { ComplianceReports } from './components/ComplianceReports';
import { SystemLogs } from './components/SystemLogs';
import { MedicalAudits } from './components/MedicalAudits';
import { TreatmentOversight } from './components/TreatmentOversight';
import { AuthProvider, useAuth } from './components/AuthContext';
import LoginScreen from './components/LoginScreen';
import Frame1272628233 from './imports/Frame1272628233';
import { LoadingScreen } from './components/app/LoadingScreen';
import { AuroraEffects } from './components/app/AuroraEffects';
import { UserProfile } from './components/app/UserProfile';
import { SidebarNavigation } from './components/app/SidebarNavigation';
import { FilesSection } from './components/app/FilesSection';
import { AutomationSection } from './components/app/AutomationSection';
import { ActivePanel, navigationItems } from './components/app/constants';
import { groupNavigationByCategory } from './components/app/helpers';

function MainApp() {
  const [activePanel, setActivePanel] = useState<ActivePanel>('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFolder, setExpandedFolder] = useState<string | null>(null);
  const { currentUser, isAuthenticated, isLoading, hasPermission, logout } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  const allowedNavigationItems = navigationItems.filter(item => 
    hasPermission(item.requiredPermission.module, item.requiredPermission.action)
  );

  const groupedNavigation = groupNavigationByCategory(allowedNavigationItems);

  const handleLogout = async () => {
    await logout();
  };

  const handleFolderClick = (folderId: string) => {
    setExpandedFolder(expandedFolder === folderId ? null : folderId);
    console.log('Filter by folder:', folderId);
  };

  const renderActivePanel = () => {
    switch (activePanel) {
      case 'dashboard':
        return <Dashboard onNavigate={setActivePanel} />;
      case 'patients':
        return <PatientManagement />;
      case 'appointments':
        return <AppointmentSchedule />;
      case 'documents':
        return <DocumentManagement />;
      case 'reports':
        return <Reports />;
      case 'ai-assistant':
        return <AIAssistant />;
      case 'compliance-reports':
        return <ComplianceReports />;
      case 'system-logs':
        return <SystemLogs />;
      case 'medical-audits':
        return <MedicalAudits />;
      case 'treatment-oversight':
        return <TreatmentOversight />;
      case 'administration':
        return <Administration />;
      default:
        return <Dashboard onNavigate={setActivePanel} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#181818] relative overflow-hidden">
      <AuroraEffects />

      <SidebarProvider>
        <div className="flex h-screen w-full relative z-10">
          <Sidebar className="vibrancy-sidebar w-80 border-r-0">
            <SidebarHeader className="p-4 pb-3">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 apple-card flex items-center justify-center rounded-xl">
                  <Frame1272628233 className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white tracking-tight">CIRUGIA ESPECIAL</h2>
                  <p className="text-xs text-white/60 font-normal">Dr. Joel Sánchez García</p>
                </div>
              </div>
              
              <UserProfile currentUser={currentUser} onLogout={handleLogout} />
            </SidebarHeader>
            
            <SidebarContent className="px-3">
              <SidebarNavigation 
                groupedNavigation={groupedNavigation}
                activePanel={activePanel}
                onNavigate={setActivePanel}
              />
              
              <FilesSection
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                expandedFolder={expandedFolder}
                onFolderClick={handleFolderClick}
              />

              <AutomationSection onNavigate={setActivePanel} />
            </SidebarContent>
          </Sidebar>

          <main className="flex-1 overflow-auto">
            <div className="p-8">
              {renderActivePanel()}
            </div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}