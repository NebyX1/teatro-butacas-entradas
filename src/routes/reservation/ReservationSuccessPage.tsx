import { useNavigate } from 'react-router-dom';
import { ReservationFlowLayout } from '../../components/reservation/ReservationFlowLayout';
import { SelectedSeatsList } from '../../components/reservation/SelectedSeatsList';
import { ReservationCodeBadge } from '../../components/reservation/ReservationCodeBadge';
import { PriceBreakdown } from '../../components/reservation/PriceBreakdown';
import { useReservationStore } from '../../store/useReservationStore';

export function ReservationSuccessPage() {
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
            store.resetReservation();
            navigate('/reserva');
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
