import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReservationFlowLayout } from '../../components/reservation/ReservationFlowLayout';
import { SelectedSeatsList } from '../../components/reservation/SelectedSeatsList';
import { ReservationCodeBadge } from '../../components/reservation/ReservationCodeBadge';
import { PriceBreakdown } from '../../components/reservation/PriceBreakdown';
import { useReservationStore } from '../../store/useReservationStore';
import { downloadTicketsPdf } from '../../lib/api';

export function ReservationSuccessPage() {
  const navigate = useNavigate();
  const store = useReservationStore();
  const tickets = store.tickets;
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

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

  const handleDownloadPdf = async () => {
    if (!store.reservationId || !store.temporaryReservationCode) {
      setDownloadError('No hay una reserva activa para descargar.');
      return;
    }
    setDownloading(true);
    setDownloadError(null);
    try {
      await downloadTicketsPdf(store.reservationId, store.temporaryReservationCode);
    } catch (err) {
      setDownloadError(
        err instanceof Error
          ? err.message
          : 'No se pudo descargar el PDF. Intentá de nuevo.'
      );
    } finally {
      setDownloading(false);
    }
  };

  return (
    <ReservationFlowLayout
      step="success"
      title="¡Reserva confirmada!"
      subtitle="Tu pago fue simulado exitosamente. En producción recibirías las entradas por email."
      summaryState={summaryState}
    >
      <div className="flex flex-col gap-5">
        <div className="glass rounded-2xl p-4 sm:p-6 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-emerald-400/40 bg-emerald-500/20 text-emerald-200">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <div className="flex flex-col">
              <h2 className="text-lg font-semibold text-white">Reserva confirmada</h2>
              <p className="text-xs text-slate-400">Gracias, {store.customerData.firstName} {store.customerData.lastName}</p>
            </div>
          </div>

          {store.temporaryReservationCode && (
            <ReservationCodeBadge code={store.temporaryReservationCode} />
          )}

          {store.selectedShow && store.selectedPerformance && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5">
                <span className="text-xs text-slate-400 block">Obra</span>
                <span className="text-sm text-slate-100">{store.selectedShow.title}</span>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5">
                <span className="text-xs text-slate-400 block">Función</span>
                <span className="text-sm text-slate-100">{store.selectedPerformance.label}</span>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5">
                <span className="text-xs text-slate-400 block">Sala</span>
                <span className="text-sm text-slate-100">{store.selectedShow.venue}</span>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5">
                <span className="text-xs text-slate-400 block">Duración</span>
                <span className="text-sm text-slate-100">{store.selectedShow.durationMinutes} min</span>
              </div>
            </div>
          )}

          <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5">
            <span className="text-xs text-slate-400 block">Email de envío de entradas</span>
            <span className="text-sm text-slate-100">{store.customerData.email}</span>
          </div>
        </div>

        <div className="glass rounded-2xl p-4 sm:p-6 flex flex-col gap-4">
          <h3 className="text-sm font-semibold text-white">Butacas confirmadas</h3>
          <SelectedSeatsList seats={store.selectedSeats} showPrice />
        </div>

        <PriceBreakdown pricing={store.pricing} seatCount={store.selectedSeats.length} />

        {tickets.length > 0 && (
          <div className="glass rounded-2xl p-4 sm:p-6 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-emerald-300">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <h3 className="text-sm font-semibold text-white">Tus tickets</h3>
            </div>
            <p className="text-sm text-slate-300">
              Tus boletos fueron emitidos correctamente.
            </p>
            <ul className="flex flex-col gap-2">
              {tickets.map((ticket) => (
                <li
                  key={ticket.id}
                  className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 flex flex-col gap-1"
                >
                  <span className="text-xs text-slate-400">Ticket</span>
                  <span className="text-sm font-mono font-semibold text-emerald-200">
                    {ticket.ticketCode}
                  </span>
                  <span className="text-xs text-slate-400">
                    {ticket.seat.displayLabel}
                  </span>
                </li>
              ))}
            </ul>

            {downloadError && (
              <div role="alert" className="rounded-xl border border-rose-400/30 bg-rose-500/10 px-3 py-2.5 text-sm text-rose-200">
                {downloadError}
              </div>
            )}

            <button
              type="button"
              className="btn btn-primary btn-md shadow-[0_8px_30px_rgba(79,70,229,0.45)] disabled:opacity-60"
              disabled={downloading}
              onClick={handleDownloadPdf}
            >
              {downloading ? 'Generando PDF…' : 'Descargar boletos en PDF'}
              {!downloading && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 3v12m0 0l-4-4m4 4l4-4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
          </div>
        )}

        <div className="rounded-2xl border border-indigo-400/20 bg-indigo-500/10 p-4">
          <p className="text-sm text-indigo-100">
            Cuando la integración con el backend y la pasarela de pagos esté
            activa, recibirás tus entradas digitales por email y podrás
            descargarlas desde este mismo código de reserva.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary btn-md shadow-[0_8px_30px_rgba(79,70,229,0.45)]"
          onClick={() => {
            store.resetReservationFlow();
            store.clearSelectedPerformance();
            navigate('/espectaculos');
          }}
        >
          Nueva reserva
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </ReservationFlowLayout>
  );
}
