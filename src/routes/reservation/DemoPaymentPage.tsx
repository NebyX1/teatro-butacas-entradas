import { useNavigate } from 'react-router-dom';
import { ReservationFlowLayout } from '../../components/reservation/ReservationFlowLayout';
import { PriceBreakdown } from '../../components/reservation/PriceBreakdown';
import { SelectedSeatsList } from '../../components/reservation/SelectedSeatsList';
import { ReservationCodeBadge } from '../../components/reservation/ReservationCodeBadge';
import { useReservationStore } from '../../store/useReservationStore';

export function DemoPaymentPage() {
  const navigate = useNavigate();
  const store = useReservationStore();

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
      step="demo-payment"
      title="Pasarela de pago"
      subtitle="Esta es una simulación de la pasarela de pago."
      summaryState={summaryState}
    >
      <div className="flex flex-col gap-5">
        <div className="glass rounded-2xl p-4 sm:p-6 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-indigo-400/30 bg-indigo-500/15 text-indigo-200">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2v-8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <div className="flex flex-col">
              <h2 className="text-base font-semibold text-white">Pasarela de pago en modo demostración</h2>
              <p className="text-xs text-slate-400">No se procesa ningún pago real.</p>
            </div>
          </div>

          {store.temporaryReservationCode && (
            <ReservationCodeBadge code={store.temporaryReservationCode} />
          )}

          <PriceBreakdown pricing={store.pricing} seatCount={store.selectedSeats.length} />
        </div>

        <div className="glass rounded-2xl p-4 sm:p-6 flex flex-col gap-4">
          <h3 className="text-sm font-semibold text-white">Butacas a pagar</h3>
          <SelectedSeatsList seats={store.selectedSeats} showPrice />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            className="btn btn-success btn-md shadow-[0_8px_30px_rgba(34,197,94,0.35)]"
            onClick={() => {
              store.setPaymentStatus('approved');
              store.setCurrentStep('success');
              navigate('/reserva/confirmada');
            }}
          >
            Simular pago aprobado
          </button>
          <button
            type="button"
            className="btn btn-error btn-md shadow-[0_8px_30px_rgba(244,63,94,0.35)]"
            onClick={() => {
              store.setPaymentStatus('rejected');
              store.setCurrentStep('payment-error');
              navigate('/reserva/error-pago');
            }}
          >
            Simular pago rechazado
          </button>
        </div>
      </div>
    </ReservationFlowLayout>
  );
}
