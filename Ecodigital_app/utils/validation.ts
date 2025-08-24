/**
 * Funciones de validación de formularios
 * Según especificación técnica - Sección 8 (Manejo de Formularios)
 */

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  email?: boolean;
  phone?: boolean;
  custom?: (value: any) => boolean;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validateField = (value: any, rules: ValidationRule[]): ValidationResult => {
  const errors: string[] = [];

  for (const rule of rules) {
    // Required validation
    if (rule.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      errors.push(rule.message || 'Este campo es requerido');
      continue;
    }

    // Skip other validations if field is empty and not required
    if (!value && !rule.required) continue;

    // MinLength validation
    if (rule.minLength && value.length < rule.minLength) {
      errors.push(rule.message || `Mínimo ${rule.minLength} caracteres`);
    }

    // MaxLength validation
    if (rule.maxLength && value.length > rule.maxLength) {
      errors.push(rule.message || `Máximo ${rule.maxLength} caracteres`);
    }

    // Pattern validation
    if (rule.pattern && !rule.pattern.test(value)) {
      errors.push(rule.message || 'Formato inválido');
    }

    // Email validation
    if (rule.email && !isValidEmail(value)) {
      errors.push(rule.message || 'Formato de email inválido');
    }

    // Phone validation
    if (rule.phone && !isValidPhone(value)) {
      errors.push(rule.message || 'Formato de teléfono inválido');
    }

    // Custom validation
    if (rule.custom && !rule.custom(value)) {
      errors.push(rule.message || 'Valor inválido');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const isValidEmail = (email: string): boolean => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
};

export const isValidPhone = (phone: string): boolean => {
  // Mexican phone format: +52 55 1234 5678
  const phonePattern = /^(\+52\s?)?[0-9]{2}\s?[0-9]{4}\s?[0-9]{4}$/;
  return phonePattern.test(phone.replace(/\s/g, ''));
};

export const isValidCURP = (curp: string): boolean => {
  const curpPattern = /^[A-Z]{1}[AEIOU]{1}[A-Z]{2}[0-9]{2}(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])[HM]{1}(AS|BC|BS|CC|CH|CL|CM|CS|DF|DG|GR|GT|HG|JC|MC|MN|MS|NT|NL|OC|PL|QT|QR|SP|SL|SR|TC|TL|TS|VZ|YN|ZS|NE)[B-DF-HJ-NP-TV-Z]{3}[0-9A-Z]{1}$/;
  return curpPattern.test(curp);
};

// Validation schemas for common forms
export const patientValidationSchema = {
  name: [
    { required: true, message: "Campo 'Nombre' requerido" },
    { minLength: 2, message: "Nombre debe tener al menos 2 caracteres" },
    { maxLength: 50, message: "Nombre no puede exceder 50 caracteres" }
  ],
  lastName: [
    { required: true, message: "Campo 'Apellido' requerido" },
    { minLength: 2, message: "Apellido debe tener al menos 2 caracteres" },
    { maxLength: 50, message: "Apellido no puede exceder 50 caracteres" }
  ],
  email: [
    { required: true, message: "Campo 'Email' requerido" },
    { email: true, message: "Formato de email inválido" }
  ],
  phone: [
    { required: true, message: "Campo 'Teléfono' requerido" },
    { phone: true, message: "Formato de teléfono inválido" }
  ],
  birthDate: [
    { required: true, message: "Campo 'Fecha de nacimiento' requerido" }
  ]
};

export const appointmentValidationSchema = {
  patientId: [
    { required: true, message: "Debe seleccionar un paciente" }
  ],
  date: [
    { required: true, message: "Campo 'Fecha' requerido" }
  ],
  time: [
    { required: true, message: "Campo 'Hora' requerido" }
  ],
  type: [
    { required: true, message: "Debe seleccionar el tipo de cita" }
  ]
};