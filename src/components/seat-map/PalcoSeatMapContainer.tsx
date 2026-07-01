import { useCallback, useEffect, useState } from 'react';
import { SECTORS } from './sectorTypes';
import { PalcoASeatMap } from './PalcoASeatMap';
import { PalcoBSeatMap } from './PalcoBSeatMap';
import { PalcoCSeatMap } from './PalcoCSeatMap';
import type { PalcoASeat } from './palcoASeatGenerator';
import type { PalcoBSeat } from './palcoBSeatGenerator';
import type { PalcoCSeat } from './palcoCSeatGenerator';
import {
  toPalcoASelectedItems,
  toPalcoBSelectedItems,
  toPalcoCSelectedItems,
  type SelectedSeatItem,
} from './selectedSeatAdapter';

const PALCO_TAB_ORDER = ['palco_a', 'palco_b', 'palco_c'] as const;
type PalcoId = (typeof PALCO_TAB_ORDER)[number];

const PALCO_TONE: Record<PalcoId, { active: string; idle: string; dot: string }> = {
  palco_a: {
    active:
      'border-indigo-300/60 bg-indigo-300/15 text-indigo-100 shadow-[0_0_0_1px_rgba(165,180,252,0.18)]',
    idle: 'border-white/10 bg-white/[0.04] text-slate-300 hover:bg-white/[0.08] hover:text-white',
    dot: 'bg-indigo-300',
  },
  palco_b: {
    active:
      'border-fuchsia-300/60 bg-fuchsia-300/15 text-fuchsia-100 shadow-[0_0_0_1px_rgba(240,171,252,0.18)]',
    idle: 'border-white/10 bg-white/[0.04] text-slate-300 hover:bg-white/[0.08] hover:text-white',
    dot: 'bg-fuchsia-300',
  },
  palco_c: {
    active:
      'border-sky-300/60 bg-sky-300/15 text-sky-100 shadow-[0_0_0_1px_rgba(125,211,252,0.18)]',
    idle: 'border-white/10 bg-white/[0.04] text-slate-300 hover:bg-white/[0.08] hover:text-white',
    dot: 'bg-sky-300',
  },
};

export interface PalcoSeatMapContainerProps {
  initialPalcoId?: PalcoId;
  maxSelectableSeats?: number;
  onSelectionChange?: (sectorId: PalcoId, items: SelectedSeatItem[]) => void;
}

function PalcoTabs({
  active,
  onChange,
}: {
  active: PalcoId;
  onChange: (id: PalcoId) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="Seleccionar palco"
      className="glass rounded-2xl p-2 flex flex-wrap items-center gap-2"
    >
      <span className="px-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
        Palco
      </span>
      {PALCO_TAB_ORDER.map((id) => {
        const isActive = id === active;
        const tone = PALCO_TONE[id];
        return (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(id)}
            className={`inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-sm font-medium transition ${
              isActive ? tone.active : tone.idle
            }`}
          >
            <span
              className={`inline-block h-1.5 w-1.5 rounded-full ${tone.dot} ${
                isActive ? 'shadow-[0_0_8px_currentColor]' : 'opacity-70'
              }`}
              aria-hidden="true"
            />
            {SECTORS[id].label}
            <span
              className={`text-[11px] ${
                isActive ? 'text-white/80' : 'text-slate-400'
              }`}
            >
              · {SECTORS[id].totalSeats} butacas
            </span>
          </button>
        );
      })}
    </div>
  );
}

/**
 * Contenedor que agrupa los tres mapas de palcos. Mantiene un sub-selector
 * interno (pestañas A/B/C) y aisla el estado de selección de cada palco
 * para que cambiar de pestaña descarte la selección anterior.
 */
export function PalcoSeatMapContainer({
  initialPalcoId = 'palco_a',
  maxSelectableSeats,
  onSelectionChange,
}: PalcoSeatMapContainerProps) {
  const [activePalco, setActivePalco] = useState<PalcoId>(initialPalcoId);

  const [palcoASelection, setPalcoASelection] = useState<PalcoASeat[]>([]);
  const [palcoBSelection, setPalcoBSelection] = useState<PalcoBSeat[]>([]);
  const [palcoCSelection, setPalcoCSelection] = useState<PalcoCSeat[]>([]);

  const handleTabChange = useCallback(
    (next: PalcoId) => {
      if (next === activePalco) return;
      if (activePalco === 'palco_a') {
        setPalcoASelection([]);
      } else if (activePalco === 'palco_b') {
        setPalcoBSelection([]);
      } else {
        setPalcoCSelection([]);
      }
      setActivePalco(next);
    },
    [activePalco]
  );

  useEffect(() => {
    const items =
      activePalco === 'palco_a'
        ? toPalcoASelectedItems(palcoASelection)
        : activePalco === 'palco_b'
          ? toPalcoBSelectedItems(palcoBSelection)
          : toPalcoCSelectedItems(palcoCSelection);
    onSelectionChange?.(activePalco, items);
  }, [activePalco, palcoASelection, palcoBSelection, palcoCSelection, onSelectionChange]);

  return (
    <div className="flex flex-col gap-5">
      <PalcoTabs active={activePalco} onChange={handleTabChange} />

      {activePalco === 'palco_a' ? (
        <PalcoASeatMap
          maxSelectableSeats={maxSelectableSeats}
          onSelectionChange={setPalcoASelection}
        />
      ) : activePalco === 'palco_b' ? (
        <PalcoBSeatMap
          maxSelectableSeats={maxSelectableSeats}
          onSelectionChange={setPalcoBSelection}
        />
      ) : (
        <PalcoCSeatMap
          maxSelectableSeats={maxSelectableSeats}
          onSelectionChange={setPalcoCSelection}
        />
      )}
    </div>
  );
}

export { PALCO_TAB_ORDER };
