import { useEffect, useState } from 'react';
import { PalcoASeatMap } from './PalcoASeatMap';
import { PalcoBSeatMap } from './PalcoBSeatMap';
import { PalcoCSeatMap } from './PalcoCSeatMap';
import type { PalcoASeat } from './palcoASeatGenerator';
import type { PalcoBSeat } from './palcoBSeatGenerator';
import type { PalcoCSeat } from './palcoCSeatGenerator';
import type { SectorId } from './sectorTypes';
import {
  toPalcoASelectedItems,
  toPalcoBSelectedItems,
  toPalcoCSelectedItems,
  type SelectedSeatItem,
} from './selectedSeatAdapter';

export type PalcoId = Extract<SectorId, 'palco_a' | 'palco_b' | 'palco_c'>;

export interface PalcoSeatMapContainerProps {
  activePalcoId: PalcoId;
  maxSelectableSeats?: number;
  onSelectionChange?: (sectorId: PalcoId, items: SelectedSeatItem[]) => void;
}

/**
 * Contenedor que renderiza el mapa del palco activo (A/B/C) y mantiene
 * la selección aislada por palco, de modo que cambiar de sector descarta
 * la selección anterior.
 *
 * El selector de sector vive arriba de la página (componente SectorTabs);
 * este contenedor ya no muestra pestañas internas.
 */
export function PalcoSeatMapContainer({
  activePalcoId,
  maxSelectableSeats,
  onSelectionChange,
}: PalcoSeatMapContainerProps) {
  const [palcoASelection, setPalcoASelection] = useState<PalcoASeat[]>([]);
  const [palcoBSelection, setPalcoBSelection] = useState<PalcoBSeat[]>([]);
  const [palcoCSelection, setPalcoCSelection] = useState<PalcoCSeat[]>([]);

  useEffect(() => {
    const items =
      activePalcoId === 'palco_a'
        ? toPalcoASelectedItems(palcoASelection)
        : activePalcoId === 'palco_b'
          ? toPalcoBSelectedItems(palcoBSelection)
          : toPalcoCSelectedItems(palcoCSelection);
    onSelectionChange?.(activePalcoId, items);
  }, [activePalcoId, palcoASelection, palcoBSelection, palcoCSelection, onSelectionChange]);

  if (activePalcoId === 'palco_a') {
    return (
      <PalcoASeatMap
        maxSelectableSeats={maxSelectableSeats}
        onSelectionChange={setPalcoASelection}
      />
    );
  }
  if (activePalcoId === 'palco_b') {
    return (
      <PalcoBSeatMap
        maxSelectableSeats={maxSelectableSeats}
        onSelectionChange={setPalcoBSelection}
      />
    );
  }
  return (
    <PalcoCSeatMap
      maxSelectableSeats={maxSelectableSeats}
      onSelectionChange={setPalcoCSelection}
    />
  );
}
