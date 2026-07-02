import { useNavigate, useSearchParams } from 'react-router-dom';
import { ReservationFlowLayout } from '../../components/reservation/ReservationFlowLayout';
import { ReservationCodeBadge } from '../../components/reservation/ReservationCodeBadge';
import { useReservationStore } from '../../store/useReservationStore';

/**
 * Página de retorno de Mercado Pago (pending).
 * El pago quedó pendiente. No emite tickets.
 */
export function PaymentPendingPage() {
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
  };

  return (
    <ReservationFlowLayout
      step="pre-payment"
      title="Pago pendiente"
      subtitle="Tu pago quedó pendiente de confirmación por la pasarela."
      summaryState={summaryState}
    >
      <div className="glass rounded-2xl p-4 sm:p-6 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-amber-400/30 bg-amber-500/15 text-amber-200">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
          <div className="flex flex-col">
            <h2 className="text-base font-semibold text-white">El pago está pendiente</h2>
            <p className="text-xs text-slate-400">Te avisaremos cuando se acredite.</p>
          </div>
        </div>

        {store.temporaryReservationCode && (
          <ReservationCodeBadge code={store.temporaryReservationCode} />
        )}

        <p className="text-sm text-slate-300">
          Reserva <span className="font-mono text-indigo-200">{reservationId ?? '—'}</span>.
          Cuando la pasarela confirme el pago, se emitirán tus tickets
          automáticamente.
        </p>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          <button
            type="button"
            className="btn btn-ghost btn-sm text-slate-300 hover:bg-white/10 hover:text-white"
            onClick={() => navigate('/reserva')}
          >
            Volver al inicio
          </button>
          <button
            type="button"
            className="btn btn-primary btn-md"
            onClick={() => navigate('/reserva/pre-pago')}
          >
            Volver a la reserva
          </button>
        </div>
      </div>
    </ReservationFlowLayout>
  );
}