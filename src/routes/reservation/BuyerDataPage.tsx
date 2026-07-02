import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReservationFlowLayout } from '../../components/reservation/ReservationFlowLayout';
import { BuyerDataForm } from '../../components/reservation/BuyerDataForm';
import { useReservationStore } from '../../store/useReservationStore';
import { validateCustomerData } from '../../lib/reservationValidation';
import { updateReservationCustomer } from '../../lib/api';

export function BuyerDataPage() {
  const navigate = useNavigate();
  const store = useReservationStore();
  const [errors, setErrors] = useState(validateCustomerData(store.customerData));
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const summaryState = {
    selectedSector: store.selectedSector,
    selectedSeats: store.selectedSeats,
    pricing: store.pricing,
    customerData: store.customerData,
    deliveryOption: store.deliveryOption,
    temporaryReservationCode: store.temporaryReservationCode,
    expiresAt: store.expiresAt,
  };

  const handleSubmit = async () => {
    if (!store.reservationId) {
      setSubmitError('No hay una reserva activa. Volvé a la selección de butacas.');
      return;
    }
    setSubmitting(true);
    setSubmitError(null);
    try {
      await updateReservationCustomer(store.reservationId, {
        firstName: store.customerData.firstName,
        lastName: store.customerData.lastName,
        documentType: store.customerData.documentType,
        documentNumber: store.customerData.documentNumber,
        email: store.customerData.email,
        phone: store.customerData.phone,
      });
      store.setCurrentStep('review');
      navigate('/reserva/revision');
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? `No se pudieron guardar los datos: ${err.message}`
          : 'No se pudieron guardar los datos. Intentá de nuevo.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ReservationFlowLayout
      step="buyer-data"
      title="Datos del comprador"
      subtitle="Completá tus datos de contacto para continuar con la reserva."
      summaryState={summaryState}
    >
      <div className="glass rounded-2xl p-4 sm:p-6 flex flex-col gap-5">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-indigo-300">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <h2 className="text-base font-semibold text-white">Información de contacto</h2>
        </div>

        {submitError && (
          <div role="alert" className="rounded-xl border border-rose-400/30 bg-rose-500/10 px-3 py-2.5 text-sm text-rose-200">
            {submitError}
          </div>
        )}

        <BuyerDataForm
          value={store.customerData}
          onChange={store.setCustomerData}
          onSubmit={handleSubmit}
          onBack={() => {
            store.setCurrentStep('selection');
            navigate('/reserva');
          }}
          errors={errors}
          setErrors={setErrors}
        />
        {submitting && (
          <p className="text-xs text-slate-400">Guardando datos en el servidor…</p>
        )}
      </div>
    </ReservationFlowLayout>
  );
}
