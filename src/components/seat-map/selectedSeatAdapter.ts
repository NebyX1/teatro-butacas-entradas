import { SECTORS, type SectorId } from './sectorTypes';
import type { PlateaSeat } from './types';
import type { PalcoASeat } from './palcoASeatGenerator';
import type { PalcoBSeat } from './palcoBSeatGenerator';
import type { PalcoCSeat } from './palcoCSeatGenerator';

/**
 * Modelo de butaca agnóstico de sector que consume el SelectionSummary.
 * Cualquier SeatMap de cualquier sector debe poder entregar un array de
 * SelectedSeatItem para renderizarse en el panel lateral.
 */
export interface SelectedSeatItem {
  id: string;
  sectorId: SectorId;
  shortLabel: string;
  detail: string;
  /** Número visible de la butaca (usado en el chip). */
  seatNumber: number;
  /** Texto extra opcional (ej. "Fila 3", "Cara X") para ordenar/mostrar. */
  sortKey: string;
}

export function toPlateaSelectedItems(seats: PlateaSeat[]): SelectedSeatItem[] {
  return seats.map((s) => {
    const sideText = s.side === 'izquierda' ? 'Platea izquierda' : 'Platea derecha';
    return {
      id: s.id,
      sectorId: 'platea',
      shortLabel: sideText,
      detail: `Fila ${s.row} · Butaca ${s.seatNumber}`,
      seatNumber: s.seatNumber,
      sortKey: `${String(s.row).padStart(2, '0')}-${s.side === 'izquierda' ? '0' : '1'}-${String(s.seatNumber).padStart(3, '0')}`,
    };
  });
}

export function toPalcoASelectedItems(seats: PalcoASeat[]): SelectedSeatItem[] {
  return seats.map((s) => ({
    id: s.id,
    sectorId: 'palco_a',
    shortLabel: `Palco A · ${s.faceLabel}`,
    detail: `Butaca ${s.seatNumber}`,
    seatNumber: s.seatNumber,
    sortKey: `${s.face}-${String(s.seatNumber).padStart(3, '0')}`,
  }));
}

export function toPalcoBSelectedItems(seats: PalcoBSeat[]): SelectedSeatItem[] {
  return seats.map((s) => ({
    id: s.id,
    sectorId: 'palco_b',
    shortLabel: `Palco B · ${s.faceLabel}`,
    detail:
      s.face === 'authorities'
        ? `Butaca de autoridad ${s.seatNumber}`
        : `Butaca ${s.seatNumber}`,
    seatNumber: s.seatNumber,
    sortKey: `${s.face}-${String(s.seatNumber).padStart(3, '0')}`,
  }));
}

export function toPalcoCSelectedItems(seats: PalcoCSeat[]): SelectedSeatItem[] {
  return seats.map((s) => ({
    id: s.id,
    sectorId: 'palco_c',
    shortLabel: `Palco C · ${s.faceLabel}`,
    detail: `Butaca ${s.seatNumber}`,
    seatNumber: s.seatNumber,
    sortKey: `${s.face}-${String(s.seatNumber).padStart(3, '0')}`,
  }));
}

export function sectorLabel(id: SectorId): string {
  return SECTORS[id].label;
}
