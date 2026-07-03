import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ReservationFlowLayout } from '../../components/reservation/ReservationFlowLayout';
import { ReservationCodeBadge } from '../../components/reservation/ReservationCodeBadge';
import { useReservationStore } from '../../store/useReservationStore';
import { getReservation } from '../../lib/api';

/**
 * Página de retorno de Mercado Pago (success).
 *
 * IMPORTANTE: no emite tickets acá. Solo consulta el backend para ver si
 * el pago fue verificado y los tickets fueron emitidos. Si todavía está
 * pendiente, muestra estado de espera.
 */
export function PaymentSuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const store = useReservationStore();
  const reservationId = searchParams.get('reservationId') ?? store.reservationId;
  const [status, setStatus] = useState<'verifying' | 'paid' | 'pending' | 'error'>(
    reservationId ? 'verifying' : 'error'
  );
  const [message, setMessage] = useState(
    reservationId
      ? 'Estamos verificando el pago…'
      : 'No se encontró la reserva. Volvé a la selección de butacas.'
  );
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    if (!reservationId) return;
    fetchedRef.current = true;
    let cancelled = false;
    (async () => {
      try {
        const reservation = await getReservation(reservationId);
        if (cancelled) return;
        store.setReservationFromBackend(reservation);
        if (reservation.status === 'paid' || reservation.status === 'ticket_issued') {
          store.setPaymentStatus('approved');
          store.setCurrentStep('success');
          setStatus('paid');
          setMessage('Pago verificado. Redirigiendo a tu confirmación…');
          setTimeout(() => navigate('/reserva/confirmada'), 1200);
        } else if (reservation.status === 'payment_pending') {
          setStatus('pending');
          setMessage('El pago todavía está pendiente. Te avisaremos cuando se acredite.');
        } else if (reservation.status === 'payment_failed') {
          setStatus('error');
          setMessage('El pago fue rechazado por la pasarela.');
          setTimeout(() => navigate('/reserva/error-pago'), 1500);
        } else {
          setStatus('pending');
          setMessage(`Estado actual de la reserva: ${reservation.status}.`);
        }
      } catch (err) {
        if (cancelled) return;
        setStatus('error');
        setMessage(
          err instanceof Error
            ? `No se pudo verificar el pago: ${err.message}`
            : 'No se pudo verificar el pago. Intentá más tarde.'
        );
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [reservationId, navigate, store]);

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
      step="pre-payment"
      title="Verificando pago"
      subtitle="Estamos confirmando tu pago con la pasarela."
      summaryState={summaryState}
    >
      <div className="glass rounded-2xl p-4 sm:p-6 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-indigo-400/30 bg-indigo-500/15 text-indigo-200">
            {status === 'verifying' && (
              <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 2a10 10 0 100 20 10 10 0 000-20z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="40 60" />
              </svg>
            )}
            {status === 'paid' && (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
            {status === 'pending' && (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            )}
            {status === 'error' && (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            )}
          </span>
          <div className="flex flex-col">
            <h2 className="text-base font-semibold text-white">{message}</h2>
            <p className="text-xs text-slate-400">No emitimos tickets hasta verificar el pago.</p>
          </div>
        </div>

        {store.temporaryReservationCode && (
          <ReservationCodeBadge code={store.temporaryReservationCode} />
        )}

        {status === 'error' && (
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
        )}
      </div>
    </ReservationFlowLayout>
  );
}