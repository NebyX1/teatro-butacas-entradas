import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ReservationFlowLayout } from '../../components/reservation/ReservationFlowLayout';
import { PriceBreakdown } from '../../components/reservation/PriceBreakdown';
import { SelectedSeatsList } from '../../components/reservation/SelectedSeatsList';
import { ReservationCodeBadge } from '../../components/reservation/ReservationCodeBadge';
import { useReservationStore } from '../../store/useReservationStore';
import { approveMockPayment, rejectMockPayment } from '../../lib/api';

export function DemoPaymentPage() {
  const navigate = useNavigate();
  const store = useReservationStore();
  const [searchParams] = useSearchParams();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // El reservationId puede venir del query string (URL de mock checkout)
  // o del store si el usuario navegó internamente.
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

  const handleApprove = async () => {
    if (!reservationId) {
      setError('No hay una reserva activa para aprobar.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const result = await approveMockPayment(reservationId);
      store.setTickets(result.tickets ?? []);
      store.setPaymentStatus('approved');
      store.setPaymentStatusFromBackend(result.reservation.status);
      store.setCurrentStep('success');
      navigate('/reserva/confirmada');
    } catch (err) {
      setError(
        err instanceof Error
          ? `No se pudo aprobar el pago: ${err.message}`
          : 'No se pudo aprobar el pago. Intentá de nuevo.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!reservationId) {
      setError('No hay una reserva activa para rechazar.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const result = await rejectMockPayment(reservationId);
      store.setPaymentStatus('rejected');
      store.setPaymentStatusFromBackend(result.reservation.status);
      store.setCurrentStep('payment-error');
      navigate('/reserva/error-pago');
    } catch (err) {
      setError(
        err instanceof Error
          ? `No se pudo registrar el rechazo: ${err.message}`
          : 'No se pudo registrar el rechazo. Intentá de nuevo.'
      );
    } finally {
      setSubmitting(false);
    }
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

        {error && (
          <div role="alert" className="rounded-xl border border-rose-400/30 bg-rose-500/10 px-3 py-2.5 text-sm text-rose-200">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            className="btn btn-success btn-md shadow-[0_8px_30px_rgba(34,197,94,0.35)] disabled:opacity-60"
            disabled={submitting}
            onClick={handleApprove}
          >
            {submitting ? 'Procesando…' : 'Simular pago aprobado'}
          </button>
          <button
            type="button"
            className="btn btn-error btn-md shadow-[0_8px_30px_rgba(244,63,94,0.35)] disabled:opacity-60"
            disabled={submitting}
            onClick={handleReject}
          >
            Simular pago rechazado
          </button>
        </div>
      </div>
    </ReservationFlowLayout>
  );
}
