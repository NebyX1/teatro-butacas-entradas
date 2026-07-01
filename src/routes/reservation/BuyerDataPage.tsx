import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReservationFlowLayout } from '../../components/reservation/ReservationFlowLayout';
import { BuyerDataForm } from '../../components/reservation/BuyerDataForm';
import { useReservationStore } from '../../store/useReservationStore';
import { validateCustomerData } from '../../lib/reservationValidation';

export function BuyerDataPage() {
  const navigate = useNavigate();
  const store = useReservationStore();
  const [errors, setErrors] = useState(validateCustomerData(store.customerData));

  const summaryState = {
    selectedSector: store.selectedSector,
    selectedSeats: store.selectedSeats,
    pricing: store.pricing,
    customerData: store.customerData,
    deliveryOption: store.deliveryOption,
    temporaryReservationCode: store.temporaryReservationCode,
    expiresAt: store.expiresAt,
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

        <BuyerDataForm
          value={store.customerData}
          onChange={store.setCustomerData}
          onSubmit={() => {
            store.setCurrentStep('review');
            navigate('/reserva/revision');
          }}
          onBack={() => {
            store.setCurrentStep('selection');
            navigate('/reserva');
          }}
          errors={errors}
          setErrors={setErrors}
        />
      </div>
    </ReservationFlowLayout>
  );
}
