import { useNavigate } from 'react-router-dom';
import { ReservationFlowLayout } from '../../components/reservation/ReservationFlowLayout';
import { SelectedSeatsList } from '../../components/reservation/SelectedSeatsList';
import { PriceBreakdown } from '../../components/reservation/PriceBreakdown';
import { ExpirationNotice } from '../../components/reservation/ExpirationNotice';
import { ReservationCodeBadge } from '../../components/reservation/ReservationCodeBadge';
import { useReservationStore } from '../../store/useReservationStore';

export function PrePaymentPage() {
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
      step="pre-payment"
      title="Prepará tu pago"
      subtitle="Tu reserva está pronta. Completá el pago para confirmar las butacas."
      summaryState={summaryState}
    >
      <div className="flex flex-col gap-5">
        <div className="glass rounded-2xl p-4 sm:p-6 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-500/15 text-emerald-200">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <div className="flex flex-col">
              <h2 className="text-base font-semibold text-white">Tu reserva está pronta para pagar</h2>
              <p className="text-xs text-slate-400">Las butacas quedan reservadas temporalmente.</p>
            </div>
          </div>

          {store.temporaryReservationCode && (
            <ReservationCodeBadge code={store.temporaryReservationCode} />
          )}

          <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5">
            <span className="text-xs text-slate-400 block">Email de confirmación</span>
            <span className="text-sm text-slate-100">{store.customerData.email}</span>
          </div>
        </div>

        <div className="glass rounded-2xl p-4 sm:p-6 flex flex-col gap-4">
          <h3 className="text-sm font-semibold text-white">Butacas reservadas</h3>
          <SelectedSeatsList seats={store.selectedSeats} showPrice />
        </div>

        <PriceBreakdown pricing={store.pricing} seatCount={store.selectedSeats.length} />

        <ExpirationNotice
          expiresAt={store.expiresAt}
          reservationCode={store.temporaryReservationCode}
        />

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          <button
            type="button"
            className="btn btn-ghost btn-sm text-slate-300 hover:bg-white/10 hover:text-white"
            onClick={() => {
              store.setCurrentStep('review');
              navigate('/reserva/revision');
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="mr-1">
              <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Volver a revisión
          </button>
          <button
            type="button"
            className="btn btn-primary btn-md shadow-[0_8px_30px_rgba(79,70,229,0.45)]"
            onClick={() => {
              store.setCurrentStep('demo-payment');
              navigate('/reserva/demo-pago');
            }}
          >
            Ir a pasarela de pago
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2v-8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </ReservationFlowLayout>
  );
}
