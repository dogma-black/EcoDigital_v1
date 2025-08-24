/**
 * Custom Hook para manejo de llamadas a API
 * Según especificación técnica - Sección 7 (Consumo de APIs del Backend)
 */

import { useState, useCallback } from 'react';

export interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  success: boolean;
}

export interface ApiCallOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
  showSuccessMessage?: boolean;
  showErrorMessage?: boolean;
}

export function useApiCall<T = any>() {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
    success: false
  });

  const execute = useCallback(async (
    apiCall: () => Promise<T>,
    options: ApiCallOptions = {}
  ) => {
    setState(prev => ({
      ...prev,
      loading: true,
      error: null,
      success: false
    }));

    try {
      const data = await apiCall();
      
      setState({
        data,
        loading: false,
        error: null,
        success: true
      });

      if (options.onSuccess) {
        options.onSuccess(data);
      }

      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
        success: false
      }));

      if (options.onError) {
        options.onError(errorMessage);
      }

      throw error;
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
      success: false
    });
  }, []);

  return {
    ...state,
    execute,
    reset
  };
}

// Hook especializado para llamadas con paginación
export function usePaginatedApiCall<T = any>() {
  const [state, setState] = useState<ApiState<T[]> & {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    pageSize: number;
  }>({
    data: [],
    loading: false,
    error: null,
    success: false,
    currentPage: 1,
    totalPages: 0,
    totalItems: 0,
    pageSize: 10
  });

  const execute = useCallback(async (
    apiCall: (page: number, pageSize: number) => Promise<{
      data: T[];
      totalPages: number;
      totalItems: number;
      currentPage: number;
    }>,
    page: number = 1,
    pageSize: number = 10,
    options: ApiCallOptions = {}
  ) => {
    setState(prev => ({
      ...prev,
      loading: true,
      error: null
    }));

    try {
      const response = await apiCall(page, pageSize);
      
      setState({
        data: response.data,
        loading: false,
        error: null,
        success: true,
        currentPage: response.currentPage,
        totalPages: response.totalPages,
        totalItems: response.totalItems,
        pageSize
      });

      if (options.onSuccess) {
        options.onSuccess(response);
      }

      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
        success: false
      }));

      if (options.onError) {
        options.onError(errorMessage);
      }

      throw error;
    }
  }, []);

  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= state.totalPages) {
      setState(prev => ({ ...prev, currentPage: page }));
    }
  }, [state.totalPages]);

  const reset = useCallback(() => {
    setState({
      data: [],
      loading: false,
      error: null,
      success: false,
      currentPage: 1,
      totalPages: 0,
      totalItems: 0,
      pageSize: 10
    });
  }, []);

  return {
    ...state,
    execute,
    goToPage,
    reset
  };
}