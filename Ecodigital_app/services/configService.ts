// Configuration service for browser-safe environment variable handling
// Handles the difference between Node.js and browser environments

interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  ssl: boolean;
}

interface AppConfig {
  database: DatabaseConfig;
  environment: 'development' | 'production' | 'test';
  showDemoUsers: boolean;
  apiBaseUrl: string;
  version: string;
  features: {
    twoFactorAuth: boolean;
    realTimeUpdates: boolean;
    offlineMode: boolean;
  };
}

class ConfigService {
  private config: AppConfig;

  constructor() {
    this.config = this.initializeConfig();
  }

  private initializeConfig(): AppConfig {
    // Detect environment safely in browser
    const environment = this.detectEnvironment();
    
    return {
      database: {
        host: this.getEnvVar('REACT_APP_CLOUD_SQL_HOST', 'localhost'),
        port: parseInt(this.getEnvVar('REACT_APP_CLOUD_SQL_PORT', '5432')),
        database: this.getEnvVar('REACT_APP_CLOUD_SQL_DATABASE', 'cirugia_especial_db'),
        username: this.getEnvVar('REACT_APP_CLOUD_SQL_USERNAME', 'app_user'),
        password: this.getEnvVar('REACT_APP_CLOUD_SQL_PASSWORD', ''),
        ssl: environment === 'production'
      },
      environment,
      showDemoUsers: environment === 'development' || this.getEnvVar('REACT_APP_SHOW_DEMO', 'false') === 'true',
      apiBaseUrl: this.getEnvVar('REACT_APP_API_BASE_URL', 'http://localhost:8080/api'),
      version: this.getEnvVar('REACT_APP_VERSION', '1.0.0'),
      features: {
        twoFactorAuth: this.getEnvVar('REACT_APP_ENABLE_2FA', 'true') === 'true',
        realTimeUpdates: this.getEnvVar('REACT_APP_ENABLE_REALTIME', 'true') === 'true',
        offlineMode: this.getEnvVar('REACT_APP_ENABLE_OFFLINE', 'false') === 'true'
      }
    };
  }

  private detectEnvironment(): 'development' | 'production' | 'test' {
    // Check multiple ways to determine environment in browser
    
    // 1. Check if React is in development mode
    if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV) {
      return process.env.NODE_ENV as 'development' | 'production' | 'test';
    }
    
    // 2. Check for development indicators
    if (
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1' ||
      window.location.hostname.includes('dev') ||
      window.location.port !== ''
    ) {
      return 'development';
    }
    
    // 3. Check URL patterns for production
    if (
      window.location.hostname.includes('cirugiaespecial') ||
      window.location.protocol === 'https:'
    ) {
      return 'production';
    }
    
    // 4. Default fallback
    return 'development';
  }

  private getEnvVar(key: string, defaultValue: string): string {
    // Try multiple ways to get environment variables in browser
    
    // 1. Check process.env if available (Webpack/Create React App)
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
      return process.env[key];
    }
    
    // 2. Check window environment variables (injected by build process)
    if (typeof window !== 'undefined' && (window as any).env && (window as any).env[key]) {
      return (window as any).env[key];
    }
    
    // 3. Check for injected config
    if (typeof window !== 'undefined' && (window as any).__APP_CONFIG__ && (window as any).__APP_CONFIG__[key]) {
      return (window as any).__APP_CONFIG__[key];
    }
    
    // 4. Return default value
    return defaultValue;
  }

  // Public getters for configuration values
  public getDatabaseConfig(): DatabaseConfig {
    return this.config.database;
  }

  public getEnvironment(): 'development' | 'production' | 'test' {
    return this.config.environment;
  }

  public shouldShowDemoUsers(): boolean {
    return this.config.showDemoUsers;
  }

  public getApiBaseUrl(): string {
    return this.config.apiBaseUrl;
  }

  public getVersion(): string {
    return this.config.version;
  }

  public isProduction(): boolean {
    return this.config.environment === 'production';
  }

  public isDevelopment(): boolean {
    return this.config.environment === 'development';
  }

  public isFeatureEnabled(feature: keyof AppConfig['features']): boolean {
    return this.config.features[feature];
  }

  public getFullConfig(): AppConfig {
    return { ...this.config };
  }

  // Debug information
  public getDebugInfo(): {
    environment: string;
    hostname: string;
    protocol: string;
    port: string;
    userAgent: string;
    timestamp: string;
  } {
    return {
      environment: this.config.environment,
      hostname: window.location.hostname,
      protocol: window.location.protocol,
      port: window.location.port,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString()
    };
  }

  // Update configuration at runtime (for testing)
  public updateConfig(updates: Partial<AppConfig>): void {
    this.config = { ...this.config, ...updates };
  }

  // Validate configuration
  public validateConfig(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.config.database.host) {
      errors.push('Database host is required');
    }

    if (!this.config.database.database) {
      errors.push('Database name is required');
    }

    if (!this.config.database.username) {
      errors.push('Database username is required');
    }

    if (this.config.database.port < 1 || this.config.database.port > 65535) {
      errors.push('Database port must be between 1 and 65535');
    }

    if (!this.config.apiBaseUrl) {
      errors.push('API base URL is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// Create singleton instance
const configService = new ConfigService();

// Export singleton and class for testing
export default configService;
export { ConfigService };

// Export specific getters for convenience
export const {
  getDatabaseConfig,
  getEnvironment,
  shouldShowDemoUsers,
  getApiBaseUrl,
  getVersion,
  isProduction,
  isDevelopment,
  isFeatureEnabled,
  getDebugInfo
} = configService;

// Log configuration on initialization (development only)
if (configService.isDevelopment()) {
  console.log('🔧 Configuration Service Initialized');
  console.log('📊 Environment:', configService.getEnvironment());
  console.log('🔍 Debug Info:', configService.getDebugInfo());
  
  const validation = configService.validateConfig();
  if (!validation.isValid) {
    console.warn('⚠️ Configuration Validation Errors:', validation.errors);
  } else {
    console.log('✅ Configuration is valid');
  }
}