import type { SectorId } from './sectorTypes';
import { SECTORS } from './sectorTypes';
import type { SelectedSeatItem } from './selectedSeatAdapter';

interface SelectionSummaryProps {
  sectorId: SectorId;
  selected: SelectedSeatItem[];
  maxSelectableSeats?: number;
  onClear: () => void;
  onContinue: () => void;
  onRemove: (seatId: string) => void;
  warning: string | null;
  onDismissWarning: () => void;
}

function SeatChip({
  item,
  onRemove,
}: {
  item: SelectedSeatItem;
  onRemove: (id: string) => void;
}) {
  const sectorTone =
    item.sectorId === 'palco_a'
      ? 'border-indigo-300/40 bg-indigo-300/15 text-indigo-200'
      : 'border-amber-300/40 bg-amber-300/15 text-amber-200';
  return (
    <li className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5">
      <span
        className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-semibold ${sectorTone}`}
        aria-hidden="true"
      >
        {item.seatNumber}
      </span>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium text-slate-100">
          {item.shortLabel}
        </div>
        <div className="text-xs text-slate-400">{item.detail}</div>
      </div>
      <button
        type="button"
        onClick={() => onRemove(item.id)}
        aria-label={`Quitar butaca ${item.seatNumber}`}
        className="btn btn-ghost btn-xs btn-square text-slate-300 hover:bg-white/10 hover:text-white"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M6 6l12 12M18 6L6 18"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </li>
  );
}

/**
 * Panel lateral de selección. Sector-agnóstico: muestra el nombre del
 * sector actual, los chips con la info relevante (Platea: Fila + Butaca,
 * Palco A: Cara + Butaca) y los mismos botones "Limpiar selección" /
 * "Continuar reserva" que la versión anterior.
 */
export function SelectionSummary({
  sectorId,
  selected,
  maxSelectableSeats,
  onClear,
  onContinue,
  onRemove,
  warning,
  onDismissWarning,
}: SelectionSummaryProps) {
  const hasSelection = selected.length > 0;
  const sorted = [...selected].sort((a, b) =>
    a.sortKey.localeCompare(b.sortKey)
  );

  return (
    <div className="glass-strong rounded-3xl p-5 shadow-2xl ring-soft flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-200">
              Sector
            </span>
            <span className="text-sm font-semibold text-white">
              {SECTORS[sectorId].label}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-white">Tu selección</h3>
          <p className="text-xs text-slate-400">
            {hasSelection
              ? `${selected.length} butaca${selected.length === 1 ? '' : 's'} lista${selected.length === 1 ? '' : 's'} para reservar.`
              : `Elegí butacas disponibles del ${SECTORS[sectorId].label} para comenzar.`}
          </p>
        </div>
        {maxSelectableSeats !== undefined && (
          <span className="shrink-0 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-slate-200">
            {selected.length} / {maxSelectableSeats}
          </span>
        )}
      </div>

      {warning && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-amber-300/30 bg-amber-300/10 px-3 py-2.5 text-sm text-amber-100"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
            className="mt-0.5 shrink-0"
          >
            <path
              d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="flex-1">{warning}</span>
          <button
            type="button"
            onClick={onDismissWarning}
            aria-label="Cerrar aviso"
            className="text-amber-100/70 hover:text-amber-100"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      )}

      <div className="min-h-[180px]">
        {!hasSelection ? (
          <div className="flex h-full min-h-[180px] flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-4 py-8 text-center">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M3 9l2-4h14l2 4M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9M5 9h14M9 13h6"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <p className="text-sm font-medium text-slate-200">
              Todavía no seleccionaste butacas
            </p>
            <p className="max-w-[26ch] text-xs text-slate-400">
              Tocá una butaca disponible en el mapa para agregarla a tu reserva.
            </p>
          </div>
        ) : (
          <ul className="flex max-h-72 flex-col gap-2 overflow-y-auto pr-1">
            {sorted.map((item) => (
              <SeatChip key={item.id} item={item} onRemove={onRemove} />
            ))}
          </ul>
        )}
      </div>

      <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm">
        <span className="text-slate-400">Precio estimado</span>
        <span className="font-semibold text-white">A confirmar</span>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          className="btn btn-ghost btn-sm text-slate-300 hover:bg-white/10 hover:text-white"
          onClick={onClear}
          disabled={!hasSelection}
        >
          Limpiar selección
        </button>
        <button
          type="button"
          className="btn btn-primary btn-md sm:btn-lg flex-1 sm:flex-none shadow-[0_8px_30px_rgba(79,70,229,0.45)] disabled:shadow-none"
          onClick={onContinue}
          disabled={!hasSelection}
        >
          Continuar reserva
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M5 12h14M13 5l7 7-7 7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
