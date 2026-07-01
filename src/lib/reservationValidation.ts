import type { CustomerData, DocumentType } from '../store/useReservationStore';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface ValidationError {
  field: string;
  message: string;
}

export function validateCustomerData(data: CustomerData): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!data.firstName.trim()) {
    errors.push({ field: 'firstName', message: 'El nombre es obligatorio.' });
  }

  if (!data.lastName.trim()) {
    errors.push({ field: 'lastName', message: 'El apellido es obligatorio.' });
  }

  if (!data.documentNumber.trim()) {
    errors.push({ field: 'documentNumber', message: 'El documento es obligatorio.' });
  }

  if (!data.email.trim()) {
    errors.push({ field: 'email', message: 'El email es obligatorio.' });
  } else if (!EMAIL_REGEX.test(data.email)) {
    errors.push({ field: 'email', message: 'El formato del email no es válido.' });
  }

  if (!data.phone.trim()) {
    errors.push({ field: 'phone', message: 'El teléfono es obligatorio.' });
  }

  return errors;
}

export function isCustomerDataValid(data: CustomerData): boolean {
  return validateCustomerData(data).length === 0;
}

export function documentTypeLabel(type: DocumentType): string {
  switch (type) {
    case 'ci':
      return 'Cédula de identidad';
    case 'pasaporte':
      return 'Pasaporte';
    case 'otro':
      return 'Otro';
    default:
      return type;
  }
}

export function formatPhone(value: string): string {
  return value.replace(/[^\d+\-()\s]/g, '').slice(0, 25);
}

export function formatDocumentNumber(value: string): string {
  return value.replace(/[^\dA-Za-z]/g, '').slice(0, 20);
}
