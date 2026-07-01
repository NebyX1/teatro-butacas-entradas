import { useState, useCallback } from 'react';
import type { CustomerData, DocumentType } from '../../store/useReservationStore';
import {
  documentTypeLabel,
  formatDocumentNumber,
  formatPhone,
  validateCustomerData,
} from '../../lib/reservationValidation';

interface BuyerDataFormProps {
  value: CustomerData;
  onChange: (data: Partial<CustomerData>) => void;
  onSubmit: () => void;
  onBack: () => void;
  errors: ReturnType<typeof validateCustomerData>;
  setErrors: (errors: ReturnType<typeof validateCustomerData>) => void;
}

export function BuyerDataForm({
  value,
  onChange,
  onSubmit,
  onBack,
  errors,
  setErrors,
}: BuyerDataFormProps) {
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleBlur = useCallback(
    (field: string) => {
      setTouched((prev) => ({ ...prev, [field]: true }));
      setErrors(validateCustomerData(value));
    },
    [setErrors, value]
  );

  const handleChange = useCallback(
    (field: keyof CustomerData, raw: string) => {
      let next = raw;
      if (field === 'documentNumber') next = formatDocumentNumber(raw);
      if (field === 'phone') next = formatPhone(raw);
      onChange({ [field]: next } as Partial<CustomerData>);
      setErrors(validateCustomerData({ ...value, [field]: next }));
    },
    [onChange, setErrors, value]
  );

  const fieldError = (field: string) =>
    touched[field] ? errors.find((e) => e.field === field)?.message : undefined;

  const inputClass = (field: string) =>
    [
      'w-full rounded-xl border bg-white/[0.04] px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 transition',
      fieldError(field)
        ? 'border-rose-400/50 focus:ring-rose-400/40'
        : 'border-white/10 focus:ring-indigo-400/40',
    ].join(' ');

  return (
    <form
      className="flex flex-col gap-5"
      onSubmit={(e) => {
        e.preventDefault();
        setTouched({
          firstName: true,
          lastName: true,
          documentNumber: true,
          email: true,
          phone: true,
        });
        const validation = validateCustomerData(value);
        setErrors(validation);
        if (validation.length === 0) onSubmit();
      }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-slate-300">Nombre *</span>
          <input
            type="text"
            value={value.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
            onBlur={() => handleBlur('firstName')}
            className={inputClass('firstName')}
            placeholder="Ej. María"
          />
          {fieldError('firstName') && (
            <span className="text-xs text-rose-300">{fieldError('firstName')}</span>
          )}
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-slate-300">Apellido *</span>
          <input
            type="text"
            value={value.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
            onBlur={() => handleBlur('lastName')}
            className={inputClass('lastName')}
            placeholder="Ej. González"
          />
          {fieldError('lastName') && (
            <span className="text-xs text-rose-300">{fieldError('lastName')}</span>
          )}
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-slate-300">Tipo de documento *</span>
          <select
            value={value.documentType}
            onChange={(e) =>
              onChange({ documentType: e.target.value as DocumentType })
            }
            className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-400/40 transition"
          >
            <option value="ci">{documentTypeLabel('ci')}</option>
            <option value="pasaporte">{documentTypeLabel('pasaporte')}</option>
            <option value="otro">{documentTypeLabel('otro')}</option>
          </select>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-slate-300">Documento *</span>
          <input
            type="text"
            value={value.documentNumber}
            onChange={(e) => handleChange('documentNumber', e.target.value)}
            onBlur={() => handleBlur('documentNumber')}
            className={inputClass('documentNumber')}
            placeholder="Ej. 12345678"
          />
          {fieldError('documentNumber') && (
            <span className="text-xs text-rose-300">{fieldError('documentNumber')}</span>
          )}
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-slate-300">Email *</span>
          <input
            type="email"
            value={value.email}
            onChange={(e) => handleChange('email', e.target.value)}
            onBlur={() => handleBlur('email')}
            className={inputClass('email')}
            placeholder="maria@ejemplo.com"
          />
          {fieldError('email') && (
            <span className="text-xs text-rose-300">{fieldError('email')}</span>
          )}
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-slate-300">Teléfono *</span>
          <input
            type="tel"
            value={value.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            onBlur={() => handleBlur('phone')}
            className={inputClass('phone')}
            placeholder="Ej. 099 123 456"
          />
          {fieldError('phone') && (
            <span className="text-xs text-rose-300">{fieldError('phone')}</span>
          )}
        </label>
      </div>

      <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
        <button
          type="button"
          className="btn btn-ghost btn-sm text-slate-300 hover:bg-white/10 hover:text-white"
          onClick={onBack}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="mr-1">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Volver a selección
        </button>
        <button
          type="submit"
          className="btn btn-primary btn-md shadow-[0_8px_30px_rgba(79,70,229,0.45)]"
        >
          Continuar
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </form>
  );
}
