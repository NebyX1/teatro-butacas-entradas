import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReservationFlowLayout } from '../../components/reservation/ReservationFlowLayout';
import { SelectedSeatsList } from '../../components/reservation/SelectedSeatsList';
import { PriceBreakdown } from '../../components/reservation/PriceBreakdown';
import { ExpirationNotice } from '../../components/reservation/ExpirationNotice';
import { useReservationStore } from '../../store/useReservationStore';
import { isCustomerDataValid } from '../../lib/reservationValidation';

export function ReviewReservationPage() {
  const navigate = useNavigate();
  const store = useReservationStore();
  const [localTerms, setLocalTerms] = useState(store.termsAccepted);

  const summaryState = {
    selectedSector: store.selectedSector,
    selectedSeats: store.selectedSeats,
    pricing: store.pricing,
    customerData: store.customerData,
    deliveryOption: store.deliveryOption,
    temporaryReservationCode: store.temporaryReservationCode,
    expiresAt: store.expiresAt,
  };

  const canConfirm =
    store.selectedSeats.length > 0 && isCustomerDataValid(store.customerData) && localTerms;

  return (
    <ReservationFlowLayout
      step="review"
      title="Revisá tu reserva"
      subtitle="Verificá los datos, el precio estimado y confirmá para continuar al pago."
      summaryState={summaryState}
    >
      <div className="flex flex-col gap-5">
        <section className="glass rounded-2xl p-4 sm:p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-indigo-300">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <h2 className="text-base font-semibold text-white">Butacas seleccionadas</h2>
          </div>
          <SelectedSeatsList seats={store.selectedSeats} showPrice />
        </section>

        <section className="glass rounded-2xl p-4 sm:p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-indigo-300">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <h2 className="text-base font-semibold text-white">Datos del comprador</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5">
              <span className="text-xs text-slate-400 block">Nombre completo</span>
              <span className="text-slate-100">{store.customerData.firstName} {store.customerData.lastName}</span>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5">
              <span className="text-xs text-slate-400 block">Documento</span>
              <span className="text-slate-100">{store.customerData.documentNumber}</span>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5">
              <span className="text-xs text-slate-400 block">Email</span>
              <span className="text-slate-100">{store.customerData.email}</span>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5">
              <span className="text-xs text-slate-400 block">Teléfono</span>
              <span className="text-slate-100">{store.customerData.phone}</span>
            </div>
          </div>
        </section>

        <section className="glass rounded-2xl p-4 sm:p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-indigo-300">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <h2 className="text-base font-semibold text-white">Precio estimado</h2>
          </div>
          <PriceBreakdown pricing={store.pricing} seatCount={store.selectedSeats.length} />
        </section>

        <section className="glass rounded-2xl p-4 sm:p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-indigo-300">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <h2 className="text-base font-semibold text-white">Entrada digital</h2>
          </div>
          <p className="text-sm text-slate-300">
            Recibirás las entradas en el email indicado una vez que el pago sea
            confirmado por la pasarela.
          </p>
        </section>

        <ExpirationNotice expiresAt={store.expiresAt} />

        <label className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3 cursor-pointer">
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4 accent-indigo-500"
            checked={localTerms}
            onChange={(e) => {
              setLocalTerms(e.target.checked);
              store.setTermsAccepted(e.target.checked);
            }}
          />
          <span className="text-sm text-slate-300">
            Acepto los términos y condiciones de compra y la política de
            reservas del Teatro Lavalleja.
          </span>
        </label>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              className="btn btn-ghost btn-sm text-slate-300 hover:bg-white/10 hover:text-white"
              onClick={() => {
                store.setCurrentStep('selection');
                navigate('/reserva');
              }}
            >
              Editar butacas
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-sm text-slate-300 hover:bg-white/10 hover:text-white"
              onClick={() => {
                store.setCurrentStep('buyer-data');
                navigate('/reserva/datos');
              }}
            >
              Editar datos
            </button>
          </div>
          <button
            type="button"
            className="btn btn-primary btn-md shadow-[0_8px_30px_rgba(79,70,229,0.45)] disabled:shadow-none"
            disabled={!canConfirm}
            onClick={() => {
              store.createTemporaryReservation();
              store.setCurrentStep('pre-payment');
              navigate('/reserva/pre-pago');
            }}
          >
            Confirmar reserva
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </ReservationFlowLayout>
  );
}
