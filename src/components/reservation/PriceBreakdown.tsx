import type { ReservationState } from '../../store/useReservationStore';
import { formatCurrency } from '../../lib/reservationPricing';

interface PriceBreakdownProps {
  pricing: ReservationState['pricing'];
  seatCount: number;
}

export function PriceBreakdown({ pricing, seatCount }: PriceBreakdownProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-400">Butacas ({seatCount})</span>
        <span className="font-medium text-slate-200">{formatCurrency(pricing.subtotal)}</span>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-400">Cargo por servicio (5%)</span>
        <span className="font-medium text-slate-200">{formatCurrency(pricing.serviceFee)}</span>
      </div>
      <div className="h-px bg-white/10" />
      <div className="flex items-center justify-between text-base font-semibold">
        <span className="text-white">Total estimado</span>
        <span className="text-white">{formatCurrency(pricing.total)}</span>
      </div>
    </div>
  );
}
