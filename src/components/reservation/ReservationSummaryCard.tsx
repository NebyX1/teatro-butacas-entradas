import type { ReservationState } from '../../store/useReservationStore';
import { formatCurrency } from '../../lib/reservationPricing';
import { SelectedSeatsList } from './SelectedSeatsList';

interface ReservationSummaryCardProps {
  state: Pick<
    ReservationState,
    | 'selectedSector'
    | 'selectedSeats'
    | 'pricing'
    | 'customerData'
    | 'deliveryOption'
    | 'temporaryReservationCode'
    | 'expiresAt'
  >;
  variant?: 'compact' | 'full';
}

export function ReservationSummaryCard({
  state,
  variant = 'full',
}: ReservationSummaryCardProps) {
  const compact = variant === 'compact';
  const hasCustomer = state.customerData.firstName || state.customerData.lastName;

  return (
    <div className="glass rounded-2xl p-4 sm:p-5 flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-indigo-300">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <h3 className="text-sm font-semibold text-white">Resumen de la reserva</h3>
      </div>

      {!compact && (
        <div className="flex flex-col gap-1">
          <span className="text-xs text-slate-400">Sector</span>
          <span className="text-sm font-medium text-slate-100">{state.selectedSeats[0]?.sectorLabel ?? 'Sin seleccionar'}</span>
        </div>
      )}

      <SelectedSeatsList
        seats={state.selectedSeats}
        showPrice={!compact}
        emptyMessage="No hay butacas seleccionadas."
      />

      {!compact && hasCustomer && (
        <div className="flex flex-col gap-1 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5">
          <span className="text-xs text-slate-400">Comprador</span>
          <span className="text-sm font-medium text-slate-100">
            {state.customerData.firstName} {state.customerData.lastName}
          </span>
          <span className="text-xs text-slate-400 truncate">{state.customerData.email}</span>
        </div>
      )}

      {!compact && state.temporaryReservationCode && (
        <div className="flex flex-col gap-1 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5">
          <span className="text-xs text-slate-400">Código de reserva</span>
          <span className="text-sm font-mono font-semibold text-indigo-200">{state.temporaryReservationCode}</span>
        </div>
      )}

      <div className="flex flex-col gap-2 pt-2 border-t border-white/10">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400">Subtotal</span>
          <span className="font-medium text-slate-200">{formatCurrency(state.pricing.subtotal)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400">Servicio (5%)</span>
          <span className="font-medium text-slate-200">{formatCurrency(state.pricing.serviceFee)}</span>
        </div>
        <div className="flex items-center justify-between text-base font-semibold">
          <span className="text-white">Total estimado</span>
          <span className="text-white">{formatCurrency(state.pricing.total)}</span>
        </div>
      </div>
    </div>
  );
}
