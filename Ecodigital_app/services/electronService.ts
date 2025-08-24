/**
 * Servicio para funcionalidades específicas de Electron
 * Todo preparado para empaquetado como aplicación de escritorio
 */

interface ElectronAPI {
  platform: string;
  versions: {
    node: string;
    chrome: string;
    electron: string;
  };
  app: {
    getVersion: () => string;
    getName: () => string;
    getPath: (name: string) => string;
    quit: () => void;
    relaunch: () => void;
  };
  window: {
    minimize: () => void;
    maximize: () => void;
    close: () => void;
    isMaximized: () => boolean;
    setAlwaysOnTop: (flag: boolean) => void;
  };
  files: {
    showOpenDialog: (options: any) => Promise<string[] | null>;
    showSaveDialog: (options: any) => Promise<string | null>;
    readFile: (path: string) => Promise<Buffer>;
    writeFile: (path: string, data: Buffer | string) => Promise<void>;
    openExternal: (url: string) => Promise<void>;
  };
  system: {
    getSystemInfo: () => Promise<any>;
    openDevTools: () => void;
    getMemoryUsage: () => Promise<any>;
  };
  notifications: {
    show: (options: any) => void;
  };
  updater: {
    checkForUpdates: () => Promise<any>;
    downloadUpdate: () => Promise<void>;
    installUpdate: () => void;
  };
  database: {
    backup: () => Promise<string>;
    restore: (path: string) => Promise<void>;
    optimize: () => Promise<void>;
  };
}

class ElectronService {
  private electronAPI: ElectronAPI | null = null;
  
  constructor() {
    // Check if running in Electron
    if (typeof window !== 'undefined' && (window as any).electronAPI) {
      this.electronAPI = (window as any).electronAPI;
    }
  }

  // ========== PLATFORM DETECTION ==========

  isElectron(): boolean {
    return this.electronAPI !== null;
  }

  getPlatform(): string {
    return this.electronAPI?.platform || 'web';
  }

  getVersions(): any {
    return this.electronAPI?.versions || {};
  }

  // ========== WINDOW MANAGEMENT ==========

  async minimizeWindow(): Promise<void> {
    if (this.electronAPI) {
      this.electronAPI.window.minimize();
    }
  }

  async maximizeWindow(): Promise<void> {
    if (this.electronAPI) {
      this.electronAPI.window.maximize();
    }
  }

  async closeWindow(): Promise<void> {
    if (this.electronAPI) {
      this.electronAPI.window.close();
    }
  }

  async isMaximized(): Promise<boolean> {
    if (this.electronAPI) {
      return this.electronAPI.window.isMaximized();
    }
    return false;
  }

  async setAlwaysOnTop(flag: boolean): Promise<void> {
    if (this.electronAPI) {
      this.electronAPI.window.setAlwaysOnTop(flag);
    }
  }

  // ========== FILE SYSTEM OPERATIONS ==========

  async openFileDialog(options: {
    title?: string;
    defaultPath?: string;
    filters?: Array<{ name: string; extensions: string[] }>;
    properties?: string[];
  } = {}): Promise<string[] | null> {
    if (!this.electronAPI) {
      // Fallback to web file input
      return this.webFileDialog();
    }

    try {
      return await this.electronAPI.files.showOpenDialog({
        title: options.title || 'Seleccionar Archivo',
        defaultPath: options.defaultPath,
        filters: options.filters || [
          { name: 'Todos los archivos', extensions: ['*'] },
          { name: 'Imágenes', extensions: ['jpg', 'jpeg', 'png', 'gif', 'bmp'] },
          { name: 'Videos', extensions: ['mp4', 'avi', 'mov', 'wmv'] },
          { name: 'Documentos', extensions: ['pdf', 'doc', 'docx', 'txt'] }
        ],
        properties: options.properties || ['openFile', 'multiSelections']
      });
    } catch (error) {
      console.error('Error opening file dialog:', error);
      return null;
    }
  }

  private async webFileDialog(): Promise<string[] | null> {
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.multiple = true;
      input.accept = 'image/*,video/*,.pdf,.doc,.docx,.txt';
      
      input.onchange = (e) => {
        const files = (e.target as HTMLInputElement).files;
        if (files && files.length > 0) {
          const fileNames = Array.from(files).map(file => file.name);
          resolve(fileNames);
        } else {
          resolve(null);
        }
      };
      
      input.click();
    });
  }

  async saveFileDialog(options: {
    title?: string;
    defaultPath?: string;
    filters?: Array<{ name: string; extensions: string[] }>;
  } = {}): Promise<string | null> {
    if (!this.electronAPI) {
      // For web, we'll use download approach
      return null;
    }

    try {
      return await this.electronAPI.files.showSaveDialog({
        title: options.title || 'Guardar Archivo',
        defaultPath: options.defaultPath,
        filters: options.filters || [
          { name: 'PDF', extensions: ['pdf'] },
          { name: 'Word', extensions: ['docx'] },
          { name: 'Texto', extensions: ['txt'] },
          { name: 'JSON', extensions: ['json'] }
        ]
      });
    } catch (error) {
      console.error('Error saving file dialog:', error);
      return null;
    }
  }

  async readFile(path: string): Promise<Buffer | null> {
    if (!this.electronAPI) return null;

    try {
      return await this.electronAPI.files.readFile(path);
    } catch (error) {
      console.error('Error reading file:', error);
      return null;
    }
  }

  async writeFile(path: string, data: Buffer | string): Promise<boolean> {
    if (!this.electronAPI) return false;

    try {
      await this.electronAPI.files.writeFile(path, data);
      return true;
    } catch (error) {
      console.error('Error writing file:', error);
      return false;
    }
  }

  async openExternal(url: string): Promise<void> {
    if (this.electronAPI) {
      await this.electronAPI.files.openExternal(url);
    } else {
      window.open(url, '_blank');
    }
  }

  // ========== SYSTEM INFORMATION ==========

  async getSystemInfo(): Promise<any> {
    if (!this.electronAPI) {
      return {
        platform: 'web',
        arch: 'unknown',
        memory: 'unknown',
        version: 'web'
      };
    }

    try {
      return await this.electronAPI.system.getSystemInfo();
    } catch (error) {
      console.error('Error getting system info:', error);
      return {};
    }
  }

  async getMemoryUsage(): Promise<any> {
    if (!this.electronAPI) return null;

    try {
      return await this.electronAPI.system.getMemoryUsage();
    } catch (error) {
      console.error('Error getting memory usage:', error);
      return null;
    }
  }

  openDevTools(): void {
    if (this.electronAPI) {
      this.electronAPI.system.openDevTools();
    }
  }

  // ========== NOTIFICATIONS ==========

  showNotification(options: {
    title: string;
    body: string;
    icon?: string;
    tag?: string;
  }): void {
    if (this.electronAPI) {
      this.electronAPI.notifications.show(options);
    } else if ('Notification' in window) {
      // Web notifications
      if (Notification.permission === 'granted') {
        new Notification(options.title, {
          body: options.body,
          icon: options.icon,
          tag: options.tag
        });
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            new Notification(options.title, {
              body: options.body,
              icon: options.icon,
              tag: options.tag
            });
          }
        });
      }
    }
  }

  // ========== AUTO UPDATER ==========

  async checkForUpdates(): Promise<any> {
    if (!this.electronAPI) return null;

    try {
      return await this.electronAPI.updater.checkForUpdates();
    } catch (error) {
      console.error('Error checking for updates:', error);
      return null;
    }
  }

  async downloadUpdate(): Promise<boolean> {
    if (!this.electronAPI) return false;

    try {
      await this.electronAPI.updater.downloadUpdate();
      return true;
    } catch (error) {
      console.error('Error downloading update:', error);
      return false;
    }
  }

  installUpdate(): void {
    if (this.electronAPI) {
      this.electronAPI.updater.installUpdate();
    }
  }

  // ========== DATABASE OPERATIONS ==========

  async backupDatabase(): Promise<string | null> {
    if (!this.electronAPI) return null;

    try {
      return await this.electronAPI.database.backup();
    } catch (error) {
      console.error('Error backing up database:', error);
      return null;
    }
  }

  async restoreDatabase(path: string): Promise<boolean> {
    if (!this.electronAPI) return false;

    try {
      await this.electronAPI.database.restore(path);
      return true;
    } catch (error) {
      console.error('Error restoring database:', error);
      return false;
    }
  }

  async optimizeDatabase(): Promise<boolean> {
    if (!this.electronAPI) return false;

    try {
      await this.electronAPI.database.optimize();
      return true;
    } catch (error) {
      console.error('Error optimizing database:', error);
      return false;
    }
  }

  // ========== APP LIFECYCLE ==========

  getAppVersion(): string {
    return this.electronAPI?.app.getVersion() || '1.0.0';
  }

  getAppName(): string {
    return this.electronAPI?.app.getName() || 'Cirugía Especial';
  }

  getAppPath(name: string): string | null {
    return this.electronAPI?.app.getPath(name) || null;
  }

  quitApp(): void {
    if (this.electronAPI) {
      this.electronAPI.app.quit();
    }
  }

  relaunchApp(): void {
    if (this.electronAPI) {
      this.electronAPI.app.relaunch();
    }
  }
}

// Export singleton instance
export const electronService = new ElectronService();
export default electronService;

// Export types
export type { ElectronAPI };