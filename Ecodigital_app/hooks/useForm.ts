/**
 * Custom Hook para manejo de formularios
 * Según especificación técnica - Sección 8 (Manejo de Formularios)
 */

import { useState, useCallback } from 'react';
import { validateField as validateFieldUtil, ValidationRule, ValidationResult } from '../utils/validation';

export interface FormField<T = any> {
  value: T;
  error: string | null;
  touched: boolean;
  rules?: ValidationRule[];
}

export interface FormState {
  [key: string]: FormField;
}

export interface UseFormOptions {
  initialValues?: Record<string, any>;
  validationSchema?: Record<string, ValidationRule[]>;
  onSubmit?: (values: Record<string, any>) => void | Promise<void>;
}

export function useForm(options: UseFormOptions = {}) {
  const [fields, setFields] = useState<FormState>(() => {
    const initialFields: FormState = {};
    
    if (options.initialValues) {
      Object.keys(options.initialValues).forEach(key => {
        initialFields[key] = {
          value: options.initialValues![key] ?? '',
          error: null,
          touched: false,
          rules: options.validationSchema?.[key]
        };
      });
    }
    
    return initialFields;
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const setFieldValue = useCallback((name: string, value: any) => {
    setFields(prev => ({
      ...prev,
      [name]: {
        ...prev[name],
        value,
        error: null,
        touched: true
      }
    }));
  }, []);

  const setFieldError = useCallback((name: string, error: string | null) => {
    setFields(prev => ({
      ...prev,
      [name]: {
        ...prev[name],
        error
      }
    }));
  }, []);

  const validateField = useCallback((name: string): boolean => {
    const field = fields[name];
    if (!field || !field.rules) return true;

    const validation = validateFieldUtil(field.value, field.rules);
    
    setFields(prev => ({
      ...prev,
      [name]: {
        ...prev[name],
        error: validation.isValid ? null : validation.errors[0]
      }
    }));

    return validation.isValid;
  }, [fields]);

  const validateAllFields = useCallback((): boolean => {
    let isValid = true;
    const newFields = { ...fields };

    Object.keys(fields).forEach(name => {
      const field = fields[name];
      if (field.rules) {
        const validation = validateFieldUtil(field.value, field.rules);
        if (!validation.isValid) {
          isValid = false;
          newFields[name] = {
            ...field,
            error: validation.errors[0],
            touched: true
          };
        }
      }
    });

    setFields(newFields);
    return isValid;
  }, [fields]);

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    const isValid = validateAllFields();
    
    if (!isValid || !options.onSubmit) {
      return;
    }

    setIsSubmitting(true);

    try {
      const values: Record<string, any> = {};
      Object.keys(fields).forEach(key => {
        values[key] = fields[key].value;
      });

      await options.onSubmit(values);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [fields, options.onSubmit, validateAllFields]);

  const reset = useCallback(() => {
    const resetFields: FormState = {};
    
    if (options.initialValues) {
      Object.keys(options.initialValues).forEach(key => {
        resetFields[key] = {
          value: options.initialValues![key] ?? '',
          error: null,
          touched: false,
          rules: options.validationSchema?.[key]
        };
      });
    }
    
    setFields(resetFields);
    setIsSubmitting(false);
  }, [options.initialValues, options.validationSchema]);

  const getFieldProps = useCallback((name: string) => ({
    value: fields[name]?.value ?? '',
    onChange: (value: any) => setFieldValue(name, value),
    onBlur: () => validateField(name),
    error: fields[name]?.error,
    touched: fields[name]?.touched
  }), [fields, setFieldValue, validateField]);

  const isValid = Object.values(fields).every(field => !field.error);
  const isDirty = Object.values(fields).some(field => field.touched);

  return {
    fields,
    setFieldValue,
    setFieldError,
    validateField,
    validateAllFields,
    handleSubmit,
    reset,
    getFieldProps,
    isSubmitting,
    isValid,
    isDirty
  };
}