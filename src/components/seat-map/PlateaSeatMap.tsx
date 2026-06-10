import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  TransformWrapper,
  TransformComponent,
  type ReactZoomPanPinchRef,
} from 'react-zoom-pan-pinch';
import {
  generatePlateaSeats,
  PLATEA_VIEWBOX,
  validatePlateaSeats,
} from './plateaSeatGenerator';
import {
  PLATEA_ROWS,
  PLATEA_SEATS_PER_SIDE,
  PLATEA_TOTAL_SEATS,
} from './plateaSeatData';
import type {
  PlateaSeat,
  PlateaSeatMapProps,
  PlateaSeatStatusMap,
} from './types';
import { PlateaSeatNode } from './PlateaSeat';
import { PlateaStage } from './PlateaStage';
import { PlateaRowLabels, PlateaSideLabels } from './PlateaRowLabels';
import { PlateaLegend } from './PlateaLegend';

const MOCK_SEAT_STATUSES: PlateaSeatStatusMap = (() => {
  const m: PlateaSeatStatusMap = {};
  const soldIds = [
    'PLATEA-IZQ-F01-B03',
    'PLATEA-IZQ-F02-B05',
    'PLATEA-IZQ-F05-B07',
    'PLATEA-DER-F01-B04',
    'PLATEA-DER-F03-B02',
    'PLATEA-DER-F06-B08',
    'PLATEA-DER-F09-B06',
    'PLATEA-DER-F12-B03',
  ];
  for (const id of soldIds) m[id] = 'sold';

  const reservedIds = [
    'PLATEA-IZQ-F04-B02',
    'PLATEA-IZQ-F08-B10',
    'PLATEA-DER-F02-B06',
    'PLATEA-DER-F11-B04',
  ];
  for (const id of reservedIds) m[id] = 'reserved';

  const blockedIds = ['PLATEA-IZQ-F13-B01', 'PLATEA-DER-F13-B01'];
  for (const id of blockedIds) m[id] = 'blocked';

  return m;
})();

interface StatBadgeProps {
  label: string;
  value: number | string;
  tone: 'default' | 'success' | 'warning' | 'error' | 'info' | 'neutral';
}

function StatBadge({ label, value, tone }: StatBadgeProps) {
  const tones: Record<StatBadgeProps['tone'], string> = {
    default: 'border-white/10 bg-white/5 text-slate-200',
    success: 'border-emerald-300/30 bg-emerald-300/10 text-emerald-200',
    warning: 'border-amber-300/30 bg-amber-300/10 text-amber-100',
    error: 'border-rose-300/30 bg-rose-300/10 text-rose-200',
    info: 'border-sky-300/30 bg-sky-300/10 text-sky-200',
    neutral: 'border-slate-300/20 bg-slate-300/10 text-slate-200',
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium ${tones[tone]}`}
    >
      <span className="font-semibold tracking-tight text-white">{value}</span>
      <span className="opacity-80">{label}</span>
    </span>
  );
}

interface ZoomControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  onCenter: () => void;
}

function ZoomControls({ onZoomIn, onZoomOut, onReset, onCenter }: ZoomControlsProps) {
  const baseBtn =
    'group inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-slate-950/70 text-slate-200 backdrop-blur-md transition hover:bg-slate-900 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-400/60 active:scale-[0.97]';

  return (
    <div className="pointer-events-auto flex flex-col gap-2 rounded-2xl border border-white/10 bg-slate-950/70 p-1.5 shadow-2xl backdrop-blur-xl">
      <button type="button" className={baseBtn} onClick={onZoomIn} aria-label="Acercar">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
      <button type="button" className={baseBtn} onClick={onZoomOut} aria-label="Alejar">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
      <div className="mx-1 h-px bg-white/10" />
      <button type="button" className={baseBtn} onClick={onCenter} aria-label="Centrar mapa">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 3v3M12 18v3M3 12h3M18 12h3M12 8a4 4 0 100 8 4 4 0 000-8z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button type="button" className={baseBtn} onClick={onReset} aria-label="Reiniciar zoom">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}

export function PlateaSeatMap({
  seatStatuses,
  maxSelectableSeats,
  onSelectionChange,
  onWarning,
}: PlateaSeatMapProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const transformRef = useRef<ReactZoomPanPinchRef | null>(null);

  const mergedStatuses: PlateaSeatStatusMap = useMemo(
    () => ({ ...MOCK_SEAT_STATUSES, ...(seatStatuses ?? {}) }),
    [seatStatuses]
  );

  const seats: PlateaSeat[] = useMemo(() => {
    const generated = generatePlateaSeats(mergedStatuses);
    validatePlateaSeats(generated);
    return generated;
  }, [mergedStatuses]);

  const selectedSeats = useMemo(
    () =>
      selectedIds
        .map((id) => seats.find((s) => s.id === id))
        .filter(Boolean) as PlateaSeat[],
    [selectedIds, seats]
  );

  useEffect(() => {
    onSelectionChange?.(selectedSeats);
  }, [selectedSeats, onSelectionChange]);

  const handleToggle = useCallback(
    (seat: PlateaSeat) => {
      onWarning?.(null);
      setSelectedIds((prev) => {
        const isSelected = prev.includes(seat.id);
        if (isSelected) return prev.filter((id) => id !== seat.id);
        if (maxSelectableSeats !== undefined && prev.length >= maxSelectableSeats) {
          const msg = `Solo podés seleccionar hasta ${maxSelectableSeats} butacas por reserva.`;
          onWarning?.(msg);
          return prev;
        }
        return [...prev, seat.id];
      });
    },
    [maxSelectableSeats, onWarning]
  );

  const availableCount = seats.filter((s) => s.status === 'available').length;
  const soldCount = seats.filter((s) => s.status === 'sold').length;
  const reservedCount = seats.filter((s) => s.status === 'reserved').length;
  const blockedCount = seats.filter((s) => s.status === 'blocked').length;

  return (
    <div className="flex flex-col gap-5">
      <div className="glass-strong rounded-3xl shadow-2xl ring-soft overflow-hidden">
        <div className="p-5 sm:p-7 flex flex-col gap-5">
          <header className="flex flex-col gap-3">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex flex-col gap-1.5">
                <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-white">
                  Elegí tus lugares
                </h2>
                <p className="text-sm text-slate-300/80 max-w-prose">
                  Tocá una butaca disponible para seleccionarla. Acercá el mapa con
                  zoom y movélo con el dedo o el mouse.
                </p>
              </div>
            </div>

            <PlateaLegend />

            <div className="flex flex-wrap items-center gap-2">
              <StatBadge label="filas" value={PLATEA_ROWS} tone="default" />
              <StatBadge
                label="por lado"
                value={PLATEA_SEATS_PER_SIDE}
                tone="default"
              />
              <StatBadge
                label="totales"
                value={PLATEA_TOTAL_SEATS}
                tone="default"
              />
              <StatBadge
                label="disponibles"
                value={availableCount}
                tone="success"
              />
              {soldCount > 0 && (
                <StatBadge label="vendidas" value={soldCount} tone="neutral" />
              )}
              {reservedCount > 0 && (
                <StatBadge
                  label="reservadas"
                  value={reservedCount}
                  tone="warning"
                />
              )}
              {blockedCount > 0 && (
                <StatBadge
                  label="bloqueadas"
                  value={blockedCount}
                  tone="error"
                />
              )}
            </div>
          </header>

          <div className="relative rounded-2xl border border-white/10 bg-[#050616]/80 overflow-hidden">
            <div className="absolute inset-0 pointer-events-none opacity-[0.07] [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:18px_18px]" />

            <TransformWrapper
              ref={transformRef}
              initialScale={1}
              minScale={0.6}
              maxScale={3.5}
              wheel={{ disabled: true }}
              doubleClick={{ disabled: true }}
              pinch={{ step: 5 }}
              centerOnInit
            >
              {({ zoomIn, zoomOut, resetTransform, centerView }) => (
                <>
                  <div className="absolute right-3 top-3 z-10">
                    <ZoomControls
                      onZoomIn={() => zoomIn()}
                      onZoomOut={() => zoomOut()}
                      onReset={() => resetTransform()}
                      onCenter={() => centerView(1)}
                    />
                  </div>

                  <TransformComponent
                    wrapperStyle={{ width: '100%', height: '560px' }}
                    contentStyle={{
                      width: `${PLATEA_VIEWBOX.width}px`,
                      height: `${PLATEA_VIEWBOX.height}px`,
                    }}
                  >
                    <svg
                      viewBox={`0 0 ${PLATEA_VIEWBOX.width} ${PLATEA_VIEWBOX.height}`}
                      width={PLATEA_VIEWBOX.width}
                      height={PLATEA_VIEWBOX.height}
                      xmlns="http://www.w3.org/2000/svg"
                      role="img"
                      aria-label="Mapa interactivo de la platea del Teatro Lavalleja"
                      style={{ display: 'block' }}
                    >
                      <PlateaStage />
                      <PlateaSideLabels />
                      <PlateaRowLabels />

                      {seats.map((seat) => (
                        <PlateaSeatNode
                          key={seat.id}
                          seat={{
                            ...seat,
                            status:
                              seat.status === 'available' && selectedIds.includes(seat.id)
                                ? 'selected'
                                : seat.status,
                          }}
                          onToggle={handleToggle}
                        />
                      ))}
                    </svg>
                  </TransformComponent>
                </>
              )}
            </TransformWrapper>
          </div>

          <p className="text-[11px] text-slate-400">
            Tip: en celular podés pellizcar con dos dedos para hacer zoom y arrastrar
            para mover el mapa.
          </p>
        </div>
      </div>
    </div>
  );
}
