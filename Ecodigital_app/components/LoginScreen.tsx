import React, { useState } from 'react';
import Frame1272628233 from '../imports/Frame1272628233';
import { useAuth } from './AuthContext';
import { LoginCredentials } from '../types/database';
import { ConnectionStatus } from './login/ConnectionStatus';
import { DemoUsersList } from './login/DemoUsersList';
import { LoginForm } from './login/LoginForm';
import { 
  DEMO_USERS, 
  SYSTEM_INFO, 
  FORM_DEFAULTS, 
  CONNECTION_STATUS 
} from './login/constants';
import { 
  validateLoginForm, 
  hasValidationErrors,
  clearPasswordOnError,
  formatErrorMessage,
  shouldShowDemoUsers,
  getConnectionStatus,
  logLoginAttempt
} from './login/helpers';
import { LoginFormState, DemoUser } from './login/types';

export default function LoginScreen() {
  const { login } = useAuth();
  
  const [formState, setFormState] = useState<LoginFormState>({
    credentials: {
      email: '', // Cambio de nombre a email
      password: FORM_DEFAULTS.PASSWORD,
      remember_me: FORM_DEFAULTS.REMEMBER_ME
    },
    showPassword: false,
    isLoading: false,
    error: null,
    showDemoUsers: false,
    validationErrors: {}
  });

  const connectionInfo = {
    status: CONNECTION_STATUS.CONNECTED as const,
    database: SYSTEM_INFO.DATABASE_NAME,
    region: SYSTEM_INFO.DEFAULT_REGION,
    performance: {
      response_time_ms: 45,
      active_connections: 1
    }
  };

  const handleCredentialsChange = (field: keyof LoginCredentials, value: string | boolean) => {
    setFormState(prev => ({
      ...prev,
      credentials: { ...prev.credentials, [field]: value },
      validationErrors: { ...prev.validationErrors, [field]: undefined },
      error: prev.error ? null : prev.error
    }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateLoginForm(formState.credentials);
    
    if (hasValidationErrors(validationErrors)) {
      setFormState(prev => ({ ...prev, validationErrors }));
      return;
    }
    
    setFormState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      console.log('🔐 Iniciando proceso de autenticación...');
      console.log('👤 Usuario:', formState.credentials.email);
      
      const result = await login(formState.credentials);
      
      if (!result.success) {
        const errorMessage = formatErrorMessage(result.error);
        
        setFormState(prev => ({
          ...prev,
          error: errorMessage,
          credentials: clearPasswordOnError(prev.credentials)
        }));
        
        logLoginAttempt(formState.credentials.email, false, result.error);
        console.log('❌ Autenticación fallida:', result.error);
      } else {
        logLoginAttempt(formState.credentials.email, true);
        console.log('✅ Autenticación exitosa');
      }
    } catch (error) {
      console.error('❌ Error durante el login:', error);
      const errorMessage = formatErrorMessage(String(error));
      
      setFormState(prev => ({
        ...prev,
        error: errorMessage,
        credentials: clearPasswordOnError(prev.credentials)
      }));
      
      logLoginAttempt(formState.credentials.email, false, String(error));
    } finally {
      setFormState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleDemoUserSelect = (demoUser: DemoUser) => {
    setFormState(prev => ({
      ...prev,
      credentials: {
        email: demoUser.email,
        password: demoUser.password,
        remember_me: false
      },
      error: null,
      validationErrors: {}
    }));
    
    console.log('📋 Credenciales demo cargadas:', demoUser.email);
  };

  const handleTogglePassword = () => {
    setFormState(prev => ({ ...prev, showPassword: !prev.showPassword }));
  };

  const handleToggleDemoUsers = () => {
    setFormState(prev => ({ ...prev, showDemoUsers: !prev.showDemoUsers }));
  };

  const handleClearError = () => {
    setFormState(prev => ({ ...prev, error: null }));
  };

  return (
    <div className="min-h-screen bg-[#181818] relative overflow-hidden flex items-center justify-center p-4">
      {/* Aurora Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 aurora-orb-1 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 right-1/4 w-80 h-80 aurora-orb-2 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/2 w-72 h-72 aurora-orb-3 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo and Branding */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 apple-card flex items-center justify-center rounded-2xl mx-auto mb-6">
            <Frame1272628233 className="w-12 h-12" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">{SYSTEM_INFO.APP_NAME}</h1>
          <p className="text-white/60 text-lg">{SYSTEM_INFO.DOCTOR_NAME}</p>
          <p className="text-white/40 text-sm mt-2">{SYSTEM_INFO.SUBTITLE}</p>
        </div>

        {/* Connection Status */}
        <ConnectionStatus connectionInfo={connectionInfo} />

        {/* Demo Users (only in development) */}
        {shouldShowDemoUsers() && (
          <DemoUsersList
            demoUsers={DEMO_USERS}
            isVisible={formState.showDemoUsers}
            onToggleVisibility={handleToggleDemoUsers}
            onSelectUser={handleDemoUserSelect}
          />
        )}

        {/* Login Form */}
        <LoginForm
          credentials={formState.credentials}
          validationErrors={formState.validationErrors}
          isLoading={formState.isLoading}
          showPassword={formState.showPassword}
          error={formState.error}
          onCredentialsChange={handleCredentialsChange}
          onTogglePassword={handleTogglePassword}
          onSubmit={handleLogin}
          onClearError={handleClearError}
        />

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-white/40 text-xs">
            © 2024 Ecosistema Digital Inteligente para Cirugía Especial
          </p>
          <p className="text-white/30 text-xs mt-1">
            Versión 1.0.0 • Powered by Google Cloud Platform
          </p>
        </div>
      </div>
    </div>
  );
}