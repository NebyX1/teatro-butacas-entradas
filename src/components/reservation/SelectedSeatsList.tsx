import type { ReservationSeat } from '../../store/useReservationStore';
import { formatCurrency } from '../../lib/reservationPricing';

interface SelectedSeatsListProps {
  seats: ReservationSeat[];
  showPrice?: boolean;
  emptyMessage?: string;
}

export function SelectedSeatsList({
  seats,
  showPrice = false,
  emptyMessage = 'No hay butacas seleccionadas.',
}: SelectedSeatsListProps) {
  if (seats.length === 0) {
    return (
      <p className="text-sm text-slate-400">{emptyMessage}</p>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {seats.map((seat) => (
        <li
          key={seat.id}
          className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5"
        >
          <div className="flex items-center gap-3 min-w-0">
            <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-sm font-semibold text-slate-200">
              {seat.number}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-100">
                {seat.sectorLabel}
              </p>
              <p className="truncate text-xs text-slate-400">{seat.displayLabel}</p>
            </div>
          </div>
          {showPrice && (
            <span className="shrink-0 text-sm font-medium text-slate-200">
              {formatCurrency(seat.price)}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}
