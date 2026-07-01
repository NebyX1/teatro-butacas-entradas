import type { SectorId } from './sectorTypes';
import { SECTORS } from './sectorTypes';
import type { SelectedSeatItem } from './selectedSeatAdapter';

interface SelectionSummaryHorizontalProps {
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
      : item.sectorId === 'palco_b'
        ? 'border-fuchsia-300/40 bg-fuchsia-300/15 text-fuchsia-200'
        : item.sectorId === 'palco_c'
          ? 'border-sky-300/40 bg-sky-300/15 text-sky-200'
          : 'border-amber-300/40 bg-amber-300/15 text-amber-200';
  return (
    <li className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] pl-2 pr-1 py-1">
      <span
        className={`inline-flex h-7 w-7 items-center justify-center rounded-md border text-xs font-semibold ${sectorTone}`}
        aria-hidden="true"
      >
        {item.seatNumber}
      </span>
      <div className="min-w-0 max-w-[14ch] sm:max-w-[18ch]">
        <div className="truncate text-xs font-medium text-slate-100">
          {item.shortLabel}
        </div>
      </div>
      <button
        type="button"
        onClick={() => onRemove(item.id)}
        aria-label={`Quitar butaca ${item.seatNumber}`}
        className="btn btn-ghost btn-xs btn-square text-slate-300 hover:bg-white/10 hover:text-white"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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
 * Barra horizontal de selección. Replica la lógica del SelectionSummary
 * vertical pero en formato ancho: a la izquierda muestra el sector y el
 * contador, en el centro los chips de butacas (o estado vacío compacto),
 * y a la derecha el precio estimado junto con las acciones de limpiar y
 * continuar. En tablet/mobile las tres secciones se apilan verticalmente
 * pero la barra sigue siendo horizontal respecto al mapa de butacas.
 */
export function SelectionSummaryHorizontal({
  sectorId,
  selected,
  maxSelectableSeats,
  onClear,
  onContinue,
  onRemove,
  warning,
  onDismissWarning,
}: SelectionSummaryHorizontalProps) {
  const hasSelection = selected.length > 0;
  const sorted = [...selected].sort((a, b) =>
    a.sortKey.localeCompare(b.sortKey)
  );

  return (
    <div className="glass-strong rounded-2xl shadow-2xl ring-soft p-4 sm:p-5 flex flex-col gap-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch lg:gap-5">
        {/* Left section: sector + counter + short instruction */}
        <div className="flex flex-col gap-2 lg:w-64 xl:w-72 shrink-0">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-200">
              Sector
            </span>
            <span className="text-sm font-semibold text-white">
              {SECTORS[sectorId].label}
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-semibold text-white leading-none">
              {selected.length}
              {maxSelectableSeats !== undefined && (
                <span className="text-base font-medium text-slate-400">
                  {' '}/ {maxSelectableSeats}
                </span>
              )}
            </h3>
            <span className="text-sm text-slate-300">
              butaca{selected.length === 1 ? '' : 's'} seleccionada
              {selected.length === 1 ? '' : 's'}
            </span>
          </div>
          <p className="text-xs text-slate-400">
            {hasSelection
              ? 'Lista para reservar. Revisá tu selección antes de continuar.'
              : `Tocá una butaca disponible del ${SECTORS[sectorId].label} para comenzar.`}
          </p>
        </div>

        {/* Center section: selected seats chips or empty state */}
        <div className="flex-1 min-w-0 flex flex-col gap-2">
          {warning && (
            <div
              role="alert"
              className="flex items-start gap-3 rounded-xl border border-amber-300/30 bg-amber-300/10 px-3 py-2 text-sm text-amber-100"
            >
              <svg
                width="16"
                height="16"
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
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
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

          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-2.5 min-h-[64px]">
            {!hasSelection ? (
              <div className="flex items-center gap-2 text-xs text-slate-400 px-1">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M3 9l2-4h14l2 4M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9M5 9h14M9 13h6"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span>
                  Tu selección está vacía. Las butacas que elijas aparecerán
                  acá.
                </span>
              </div>
            ) : (
              <ul className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1">
                {sorted.map((item) => (
                  <SeatChip key={item.id} item={item} onRemove={onRemove} />
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Right section: price + actions */}
        <div className="flex flex-col gap-2 lg:w-64 xl:w-72 shrink-0 lg:border-l lg:border-white/10 lg:pl-5">
          <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5">
            <span className="text-xs text-slate-400">Precio estimado</span>
            <span className="text-sm font-semibold text-white">A confirmar</span>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
            <button
              type="button"
              className="btn btn-ghost btn-sm text-slate-300 hover:bg-white/10 hover:text-white lg:w-full"
              onClick={onClear}
              disabled={!hasSelection}
            >
              Limpiar selección
            </button>
            <button
              type="button"
              className="btn btn-primary btn-md shadow-[0_8px_30px_rgba(79,70,229,0.45)] disabled:shadow-none sm:flex-1 lg:flex-none lg:w-full"
              onClick={onContinue}
              disabled={!hasSelection}
            >
              Continuar reserva
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
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
      </div>
    </div>
  );
}
