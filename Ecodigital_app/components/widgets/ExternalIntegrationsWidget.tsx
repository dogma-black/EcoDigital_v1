/**
 * Widget de integraciones externas completo
 * Gmail, Google Drive, Office 365, Teams - todo funcional
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Mail, 
  Drive, 
  FileText, 
  Users, 
  Download, 
  ExternalLink, 
  RefreshCw,
  Plus,
  Settings,
  Link,
  Unlink
} from 'lucide-react';
import integrationService, { 
  GoogleDriveFile, 
  GmailMessage, 
  OfficeDocument, 
  TeamsMessage 
} from '../../services/integrationService';
import { useAuth } from '../AuthContext';

interface ExternalIntegrationsWidgetProps {
  className?: string;
}

export function ExternalIntegrationsWidget({ className = '' }: ExternalIntegrationsWidgetProps) {
  const { trackActivity } = useAuth();
  
  // Connection states
  const [isGoogleConnected, setIsGoogleConnected] = useState(false);
  const [isMicrosoftConnected, setIsMicrosoftConnected] = useState(false);
  
  // Data states
  const [gmailMessages, setGmailMessages] = useState<GmailMessage[]>([]);
  const [driveFiles, setDriveFiles] = useState<GoogleDriveFile[]>([]);
  const [officeDocuments, setOfficeDocuments] = useState<OfficeDocument[]>([]);
  const [teamsMessages, setTeamsMessages] = useState<TeamsMessage[]>([]);
  
  // Loading states
  const [loadingStates, setLoadingStates] = useState({
    gmail: false,
    drive: false,
    office: false,
    teams: false,
    connecting: false
  });

  useEffect(() => {
    integrationService.initializeTokens();
    setIsGoogleConnected(integrationService.isGoogleAuthenticated());
    setIsMicrosoftConnected(integrationService.isMicrosoftAuthenticated());
    
    if (integrationService.isGoogleAuthenticated()) {
      loadGoogleData();
    }
    if (integrationService.isMicrosoftAuthenticated()) {
      loadMicrosoftData();
    }
  }, []);

  // ========== CONNECTION HANDLERS ==========

  const handleGoogleConnect = async () => {
    setLoadingStates(prev => ({ ...prev, connecting: true }));
    
    try {
      const result = await integrationService.authenticateGoogle();
      if (result.success) {
        setIsGoogleConnected(true);
        await loadGoogleData();
        await trackActivity('GOOGLE_CONNECTED', { timestamp: new Date().toISOString() });
      }
    } catch (error) {
      console.error('Error connecting to Google:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, connecting: false }));
    }
  };

  const handleMicrosoftConnect = async () => {
    setLoadingStates(prev => ({ ...prev, connecting: true }));
    
    try {
      const result = await integrationService.authenticateMicrosoft();
      if (result.success) {
        setIsMicrosoftConnected(true);
        await loadMicrosoftData();
        await trackActivity('MICROSOFT_CONNECTED', { timestamp: new Date().toISOString() });
      }
    } catch (error) {
      console.error('Error connecting to Microsoft:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, connecting: false }));
    }
  };

  const handleGoogleDisconnect = async () => {
    await integrationService.disconnectGoogle();
    setIsGoogleConnected(false);
    setGmailMessages([]);
    setDriveFiles([]);
    await trackActivity('GOOGLE_DISCONNECTED', { timestamp: new Date().toISOString() });
  };

  const handleMicrosoftDisconnect = async () => {
    await integrationService.disconnectMicrosoft();
    setIsMicrosoftConnected(false);
    setOfficeDocuments([]);
    setTeamsMessages([]);
    await trackActivity('MICROSOFT_DISCONNECTED', { timestamp: new Date().toISOString() });
  };

  // ========== DATA LOADING ==========

  const loadGoogleData = async () => {
    await Promise.all([loadGmailMessages(), loadDriveFiles()]);
  };

  const loadMicrosoftData = async () => {
    await Promise.all([loadOfficeDocuments(), loadTeamsMessages()]);
  };

  const loadGmailMessages = async () => {
    setLoadingStates(prev => ({ ...prev, gmail: true }));
    try {
      const messages = await integrationService.getGmailMessages(5);
      setGmailMessages(messages);
    } catch (error) {
      console.error('Error loading Gmail messages:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, gmail: false }));
    }
  };

  const loadDriveFiles = async () => {
    setLoadingStates(prev => ({ ...prev, drive: true }));
    try {
      const result = await integrationService.getDriveFiles(undefined, 10);
      setDriveFiles(result.files);
    } catch (error) {
      console.error('Error loading Drive files:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, drive: false }));
    }
  };

  const loadOfficeDocuments = async () => {
    setLoadingStates(prev => ({ ...prev, office: true }));
    try {
      const documents = await integrationService.getOfficeDocuments(10);
      setOfficeDocuments(documents);
    } catch (error) {
      console.error('Error loading Office documents:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, office: false }));
    }
  };

  const loadTeamsMessages = async () => {
    setLoadingStates(prev => ({ ...prev, teams: true }));
    try {
      const messages = await integrationService.getTeamsMessages(undefined, 5);
      setTeamsMessages(messages);
    } catch (error) {
      console.error('Error loading Teams messages:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, teams: false }));
    }
  };

  // ========== ACTION HANDLERS ==========

  const handleDownloadFile = async (fileId: string, fileName: string) => {
    try {
      const blob = await integrationService.downloadDriveFile(fileId);
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        await trackActivity('FILE_DOWNLOADED', { file_id: fileId, file_name: fileName });
      }
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const handleOpenDocument = async (documentId: string, documentName: string) => {
    try {
      const url = await integrationService.openOfficeDocument(documentId);
      if (url) {
        window.open(url, '_blank');
        await trackActivity('DOCUMENT_OPENED', { document_id: documentId, document_name: documentName });
      }
    } catch (error) {
      console.error('Error opening document:', error);
    }
  };

  // ========== UTILITY FUNCTIONS ==========

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatFileSize = (bytes: string) => {
    const size = parseInt(bytes);
    if (size === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(size) / Math.log(k));
    return Math.round(size / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getSubjectFromHeaders = (headers: Array<{ name: string; value: string }>) => {
    return headers.find(h => h.name === 'Subject')?.value || 'Sin asunto';
  };

  const getFromFromHeaders = (headers: Array<{ name: string; value: string }>) => {
    return headers.find(h => h.name === 'From')?.value || 'Desconocido';
  };

  return (
    <Card className={`apple-card ${className}`}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-white flex items-center gap-2">
            <Link className="w-5 h-5 text-blue-400" />
            Integraciones Externas
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (isGoogleConnected) loadGoogleData();
                if (isMicrosoftConnected) loadMicrosoftData();
              }}
              className="apple-button-secondary"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="connections" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5 bg-white/5">
            <TabsTrigger value="connections">Conexiones</TabsTrigger>
            <TabsTrigger value="gmail">Gmail</TabsTrigger>
            <TabsTrigger value="drive">Drive</TabsTrigger>
            <TabsTrigger value="office">Office</TabsTrigger>
            <TabsTrigger value="teams">Teams</TabsTrigger>
          </TabsList>

          {/* ========== CONNECTIONS TAB ========== */}
          <TabsContent value="connections" className="space-y-4">
            {/* Google Services */}
            <div className="space-y-3">
              <h4 className="text-white font-medium flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                Google Workspace
              </h4>
              
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge className={isGoogleConnected ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                    {isGoogleConnected ? 'Conectado' : 'Desconectado'}
                  </Badge>
                  <span className="text-white/80">Gmail • Drive • Calendar</span>
                </div>
                
                {isGoogleConnected ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleGoogleDisconnect}
                    className="apple-button-secondary"
                  >
                    <Unlink className="w-4 h-4 mr-2" />
                    Desconectar
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    onClick={handleGoogleConnect}
                    disabled={loadingStates.connecting}
                    className="apple-button-primary"
                  >
                    <Link className="w-4 h-4 mr-2" />
                    Conectar
                  </Button>
                )}
              </div>
            </div>

            {/* Microsoft Services */}
            <div className="space-y-3">
              <h4 className="text-white font-medium flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                Microsoft 365
              </h4>
              
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge className={isMicrosoftConnected ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                    {isMicrosoftConnected ? 'Conectado' : 'Desconectado'}
                  </Badge>
                  <span className="text-white/80">Office • Teams • OneDrive</span>
                </div>
                
                {isMicrosoftConnected ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleMicrosoftDisconnect}
                    className="apple-button-secondary"
                  >
                    <Unlink className="w-4 h-4 mr-2" />
                    Desconectar
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    onClick={handleMicrosoftConnect}
                    disabled={loadingStates.connecting}
                    className="apple-button-primary"
                  >
                    <Link className="w-4 h-4 mr-2" />
                    Conectar
                  </Button>
                )}
              </div>
            </div>
          </TabsContent>

          {/* ========== GMAIL TAB ========== */}
          <TabsContent value="gmail" className="space-y-4">
            {!isGoogleConnected ? (
              <div className="text-center py-8">
                <Mail className="w-12 h-12 text-white/20 mx-auto mb-4" />
                <p className="text-white/60 mb-4">Conecta con Google para ver tus mensajes</p>
                <Button onClick={handleGoogleConnect} className="apple-button-primary">
                  Conectar Gmail
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-white font-medium">Mensajes Recientes</h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={loadGmailMessages}
                    disabled={loadingStates.gmail}
                    className="apple-button-secondary"
                  >
                    <RefreshCw className={`w-4 h-4 ${loadingStates.gmail ? 'animate-spin' : ''}`} />
                  </Button>
                </div>

                {gmailMessages.map((message) => (
                  <div key={message.id} className="p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="text-white font-medium text-sm">
                        {getSubjectFromHeaders(message.payload.headers)}
                      </h5>
                      <span className="text-white/40 text-xs">
                        {formatDate(new Date(parseInt(message.internalDate)).toISOString())}
                      </span>
                    </div>
                    <p className="text-white/60 text-xs mb-2">
                      De: {getFromFromHeaders(message.payload.headers)}
                    </p>
                    <p className="text-white/80 text-sm">{message.snippet}</p>
                    <div className="flex gap-1 mt-2">
                      {message.labelIds.map((label) => (
                        <Badge key={label} variant="outline" className="text-xs">
                          {label}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* ========== DRIVE TAB ========== */}
          <TabsContent value="drive" className="space-y-4">
            {!isGoogleConnected ? (
              <div className="text-center py-8">
                <Drive className="w-12 h-12 text-white/20 mx-auto mb-4" />
                <p className="text-white/60 mb-4">Conecta con Google para ver tus archivos</p>
                <Button onClick={handleGoogleConnect} className="apple-button-primary">
                  Conectar Drive
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-white font-medium">Archivos Recientes</h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={loadDriveFiles}
                    disabled={loadingStates.drive}
                    className="apple-button-secondary"
                  >
                    <RefreshCw className={`w-4 h-4 ${loadingStates.drive ? 'animate-spin' : ''}`} />
                  </Button>
                </div>

                {driveFiles.map((file) => (
                  <div key={file.id} className="p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h5 className="text-white font-medium text-sm">{file.name}</h5>
                        <p className="text-white/60 text-xs">
                          {file.owners[0]?.displayName} • {formatFileSize(file.size)} • {formatDate(file.modifiedTime)}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(file.webViewLink, '_blank')}
                          className="text-white/60 hover:text-white"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                        {file.webContentLink && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownloadFile(file.id, file.name)}
                            className="text-white/60 hover:text-white"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* ========== OFFICE TAB ========== */}
          <TabsContent value="office" className="space-y-4">
            {!isMicrosoftConnected ? (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-white/20 mx-auto mb-4" />
                <p className="text-white/60 mb-4">Conecta con Microsoft para ver tus documentos</p>
                <Button onClick={handleMicrosoftConnect} className="apple-button-primary">
                  Conectar Office
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-white font-medium">Documentos Recientes</h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={loadOfficeDocuments}
                    disabled={loadingStates.office}
                    className="apple-button-secondary"
                  >
                    <RefreshCw className={`w-4 h-4 ${loadingStates.office ? 'animate-spin' : ''}`} />
                  </Button>
                </div>

                {officeDocuments.map((doc) => (
                  <div key={doc.id} className="p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className="bg-blue-500/20 text-blue-400 text-xs">
                            {doc.type}
                          </Badge>
                          <h5 className="text-white font-medium text-sm">{doc.name}</h5>
                        </div>
                        <p className="text-white/60 text-xs">
                          {doc.createdBy.user.displayName} • {formatFileSize(doc.size.toString())} • {formatDate(doc.lastModifiedDateTime)}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenDocument(doc.id, doc.name)}
                        className="text-white/60 hover:text-white"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* ========== TEAMS TAB ========== */}
          <TabsContent value="teams" className="space-y-4">
            {!isMicrosoftConnected ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-white/20 mx-auto mb-4" />
                <p className="text-white/60 mb-4">Conecta con Microsoft para ver tus mensajes de Teams</p>
                <Button onClick={handleMicrosoftConnect} className="apple-button-primary">
                  Conectar Teams
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-white font-medium">Mensajes Recientes</h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={loadTeamsMessages}
                    disabled={loadingStates.teams}
                    className="apple-button-secondary"
                  >
                    <RefreshCw className={`w-4 h-4 ${loadingStates.teams ? 'animate-spin' : ''}`} />
                  </Button>
                </div>

                {teamsMessages.map((message) => (
                  <div key={message.id} className="p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="text-white font-medium text-sm">
                        {message.from.user.displayName}
                      </h5>
                      <span className="text-white/40 text-xs">
                        {formatDate(message.createdDateTime)}
                      </span>
                    </div>
                    <p className="text-white/80 text-sm">{message.body.content}</p>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}