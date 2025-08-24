/**
 * Servicio de APIs mejorado
 * Según especificación técnica - Sección 7 (Consumo de APIs del Backend)
 */

import configService from './configService';

interface ApiRequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
  retries?: number;
  requiresAuth?: boolean;
}

interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
}

interface PaginatedResponse<T> {
  data: T[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
}

class ApiService {
  private baseURL: string;
  private defaultTimeout: number = 10000;
  private maxRetries: number = 3;

  constructor() {
    this.baseURL = configService.getApiBaseUrl();
  }

  private getAuthToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  private setAuthToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  private removeAuthToken(): void {
    localStorage.removeItem('auth_token');
  }

  private async request<T>(
    endpoint: string, 
    config: ApiRequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const {
      method = 'GET',
      headers = {},
      body,
      timeout = this.defaultTimeout,
      retries = this.maxRetries,
      requiresAuth = true
    } = config;

    const url = `${this.baseURL}${endpoint}`;
    
    // Prepare headers
    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...headers
    };

    // Add authentication if required
    if (requiresAuth) {
      const token = this.getAuthToken();
      if (token) {
        requestHeaders['Authorization'] = `Bearer ${token}`;
      }
    }

    // Prepare request options
    const requestOptions: RequestInit = {
      method,
      headers: requestHeaders,
      signal: AbortSignal.timeout(timeout)
    };

    if (body && method !== 'GET') {
      requestOptions.body = JSON.stringify(body);
    }

    // Execute request with retries
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await fetch(url, requestOptions);
        
        // Handle different status codes
        if (response.status === 401) {
          this.removeAuthToken();
          throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
        }

        if (response.status === 403) {
          throw new Error('No tienes permisos para realizar esta acción.');
        }

        if (response.status === 404) {
          throw new Error('Recurso no encontrado.');
        }

        if (response.status >= 500) {
          throw new Error('Error del servidor. Por favor, intenta más tarde.');
        }

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `Error HTTP ${response.status}`);
        }

        const data = await response.json();
        return {
          data: data.data || data,
          success: true,
          message: data.message
        };

      } catch (error) {
        // If it's the last attempt, throw the error
        if (attempt === retries) {
          if (error instanceof Error) {
            throw error;
          }
          throw new Error('Error de conexión');
        }

        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }

    throw new Error('Error de conexión después de múltiples intentos');
  }

  // Authentication methods
  async login(credentials: { email: string; password: string }): Promise<{
    user: any;
    token: string;
    permissions: any[];
  }> {
    const response = await this.request<{
      user: any;
      token: string;
      permissions: any[];
    }>('/auth/login', {
      method: 'POST',
      body: credentials,
      requiresAuth: false
    });

    if (response.success && response.data.token) {
      this.setAuthToken(response.data.token);
    }

    return response.data;
  }

  async logout(): Promise<void> {
    try {
      await this.request('/auth/logout', {
        method: 'POST'
      });
    } finally {
      this.removeAuthToken();
    }
  }

  async refreshToken(): Promise<string> {
    const response = await this.request<{ token: string }>('/auth/refresh', {
      method: 'POST'
    });

    if (response.success && response.data.token) {
      this.setAuthToken(response.data.token);
      return response.data.token;
    }

    throw new Error('No se pudo renovar el token');
  }

  // Patient management methods
  async getPatients(params?: {
    page?: number;
    pageSize?: number;
    search?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<PaginatedResponse<any>> {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          queryParams.append(key, String(value));
        }
      });
    }

    const endpoint = `/patients${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await this.request<PaginatedResponse<any>>(endpoint);
    
    return response.data;
  }

  async getPatient(id: string): Promise<any> {
    const response = await this.request<any>(`/patients/${id}`);
    return response.data;
  }

  async createPatient(patientData: any): Promise<any> {
    const response = await this.request<any>('/patients', {
      method: 'POST',
      body: patientData
    });
    return response.data;
  }

  async updatePatient(id: string, patientData: any): Promise<any> {
    const response = await this.request<any>(`/patients/${id}`, {
      method: 'PUT',
      body: patientData
    });
    return response.data;
  }

  async deletePatient(id: string): Promise<void> {
    await this.request(`/patients/${id}`, {
      method: 'DELETE'
    });
  }

  async archivePatients(ids: string[]): Promise<void> {
    await this.request('/patients/archive', {
      method: 'POST',
      body: { ids }
    });
  }

  // Appointment management methods
  async getAppointments(params?: {
    page?: number;
    pageSize?: number;
    date?: string;
    patientId?: string;
    status?: string;
  }): Promise<PaginatedResponse<any>> {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          queryParams.append(key, String(value));
        }
      });
    }

    const endpoint = `/appointments${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await this.request<PaginatedResponse<any>>(endpoint);
    
    return response.data;
  }

  async createAppointment(appointmentData: any): Promise<any> {
    const response = await this.request<any>('/appointments', {
      method: 'POST',
      body: appointmentData
    });
    return response.data;
  }

  async updateAppointment(id: string, appointmentData: any): Promise<any> {
    const response = await this.request<any>(`/appointments/${id}`, {
      method: 'PUT',
      body: appointmentData
    });
    return response.data;
  }

  async cancelAppointment(id: string, reason?: string): Promise<void> {
    await this.request(`/appointments/${id}/cancel`, {
      method: 'POST',
      body: { reason }
    });
  }

  // Document management methods
  async getDocuments(params?: {
    page?: number;
    pageSize?: number;
    patientId?: string;
    type?: string;
    category?: string;
  }): Promise<PaginatedResponse<any>> {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          queryParams.append(key, String(value));
        }
      });
    }

    const endpoint = `/documents${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await this.request<PaginatedResponse<any>>(endpoint);
    
    return response.data;
  }

  async uploadDocument(file: File, metadata: {
    patientId?: string;
    type: string;
    category: string;
    description?: string;
  }): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('metadata', JSON.stringify(metadata));

    // For FormData, we need to handle it differently since JSON.stringify won't work
    const url = `${this.baseURL}/documents/upload`;
    const token = this.getAuthToken();
    
    const requestHeaders: Record<string, string> = {};
    if (token) {
      requestHeaders['Authorization'] = `Bearer ${token}`;
    }
    // Don't set Content-Type for FormData - browser will set it with boundary

    const response = await fetch(url, {
      method: 'POST',
      headers: requestHeaders,
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error HTTP ${response.status}`);
    }

    return {
      data: data.data || data,
      success: true,
      message: data.message
    }.data;
  }

  async deleteDocument(id: string): Promise<void> {
    await this.request(`/documents/${id}`, {
      method: 'DELETE'
    });
  }

  // Reports and analytics methods
  async getReports(type: string, params?: any): Promise<any> {
    const response = await this.request<any>(`/reports/${type}`, {
      method: 'POST',
      body: params
    });
    return response.data;
  }

  async getSystemLogs(params?: {
    page?: number;
    pageSize?: number;
    startDate?: string;
    endDate?: string;
    level?: string;
    userId?: string;
  }): Promise<PaginatedResponse<any>> {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          queryParams.append(key, String(value));
        }
      });
    }

    const endpoint = `/logs${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await this.request<PaginatedResponse<any>>(endpoint);
    
    return response.data;
  }

  // AI Assistant methods
  async sendAIQuery(query: string, context?: string): Promise<{
    response: string;
    confidence: number;
    processingTime: number;
  }> {
    const response = await this.request<{
      response: string;
      confidence: number;
      processingTime: number;
    }>('/ai/query', {
      method: 'POST',
      body: { query, context }
    });
    
    return response.data;
  }

  // Authentication status check
  isAuthenticated(): boolean {
    const token = this.getAuthToken();
    return !!token;
  }

  // Health check
  async healthCheck(): Promise<{
    status: string;
    timestamp: string;
    services: Record<string, string>;
  }> {
    const response = await this.request<{
      status: string;
      timestamp: string;
      services: Record<string, string>;
    }>('/health', {
      requiresAuth: false
    });
    
    return response.data;
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;

// Export types for use in components
export type { ApiResponse, PaginatedResponse };