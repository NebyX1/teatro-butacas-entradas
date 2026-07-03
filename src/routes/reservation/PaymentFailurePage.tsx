import { useNavigate, useSearchParams } from 'react-router-dom';
import { ReservationFlowLayout } from '../../components/reservation/ReservationFlowLayout';
import { ReservationCodeBadge } from '../../components/reservation/ReservationCodeBadge';
import { useReservationStore } from '../../store/useReservationStore';

/**
 * Página de retorno de Mercado Pago (failure).
 * El pago fue rechazado. No emite tickets.
 */
export function PaymentFailurePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const store = useReservationStore();
  const reservationId = searchParams.get('reservationId') ?? store.reservationId;

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
      title="Pago rechazado"
      subtitle="La pasarela rechazó el pago. Podés volver a intentarlo."
      summaryState={summaryState}
    >
      <div className="glass rounded-2xl p-4 sm:p-6 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-rose-400/40 bg-rose-500/20 text-rose-200">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
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

        <p className="text-sm text-slate-300">
          Reserva <span className="font-mono text-indigo-200">{reservationId ?? '—'}</span>.
          Podés volver a intentar el pago desde la revisión de la reserva.
        </p>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          <button
            type="button"
            className="btn btn-ghost btn-sm text-slate-300 hover:bg-white/10 hover:text-white"
            onClick={() => {
              const perfId = store.currentPerformanceId;
              navigate(perfId ? `/reserva/${perfId}` : '/espectaculos');
            }}
          >
            Volver al inicio
          </button>
          <button
            type="button"
            className="btn btn-primary btn-md shadow-[0_8px_30px_rgba(79,70,229,0.45)]"
            onClick={() => navigate('/reserva/revision')}
          >
            Volver a revisión
          </button>
        </div>
      </div>
    </ReservationFlowLayout>
  );
}