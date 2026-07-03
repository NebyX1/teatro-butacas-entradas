import { useNavigate } from 'react-router-dom';
import { ReservationFlowLayout } from '../../components/reservation/ReservationFlowLayout';
import { SelectedSeatsList } from '../../components/reservation/SelectedSeatsList';
import { ReservationCodeBadge } from '../../components/reservation/ReservationCodeBadge';
import { PriceBreakdown } from '../../components/reservation/PriceBreakdown';
import { useReservationStore } from '../../store/useReservationStore';

export function PaymentErrorPage() {
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
    selectedShow: store.selectedShow,
    selectedPerformance: store.selectedPerformance,
  };

  return (
    <ReservationFlowLayout
      step="payment-error"
      title="Pago no aprobado"
      subtitle="La pasarela simuló un rechazo. Podés volver a intentar o revisar la reserva."
      summaryState={summaryState}
    >
      <div className="flex flex-col gap-5">
        <div className="glass rounded-2xl p-4 sm:p-6 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-rose-400/40 bg-rose-500/20 text-rose-200">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <div className="flex flex-col">
              <h2 className="text-lg font-semibold text-white">El pago fue rechazado</h2>
              <p className="text-xs text-slate-400">No se realizó ningún cargo real.</p>
            </div>
          </div>

          {store.temporaryReservationCode && (
            <ReservationCodeBadge code={store.temporaryReservationCode} />
          )}
        </div>

        <div className="glass rounded-2xl p-4 sm:p-6 flex flex-col gap-4">
          <h3 className="text-sm font-semibold text-white">Butacas de la reserva</h3>
          <SelectedSeatsList seats={store.selectedSeats} showPrice />
        </div>

        <PriceBreakdown pricing={store.pricing} seatCount={store.selectedSeats.length} />

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          <button
            type="button"
            className="btn btn-ghost btn-sm text-slate-300 hover:bg-white/10 hover:text-white"
            onClick={() => {
              store.setCurrentStep('review');
              navigate('/reserva/revision');
            }}
          >
            Volver a revisión
          </button>
          <button
            type="button"
            className="btn btn-primary btn-md shadow-[0_8px_30px_rgba(79,70,229,0.45)]"
            onClick={() => {
              store.setPaymentStatus('none');
              store.setCurrentStep('demo-payment');
              navigate('/reserva/pre-pago');
            }}
          >
            Reintentar pago
          </button>
        </div>
      </div>
    </ReservationFlowLayout>
  );
}
