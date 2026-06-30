/**
 * Tipos compartidos para soportar múltiples sectores en la app
 * (Platea, Palco A, etc.) sin romper la implementación previa.
 *
 * La idea es: cada sector expone su propio SeatMap component, su propio
 * SelectionSummary y su propio "modelo de butaca". El "Sector" es un
 * discriminador de tipo y sirve para enrutar entre componentes y mantener
 * selecciones separadas si hace falta.
 */

export type SectorId = 'platea' | 'palco_a';

export interface SectorDescriptor {
  id: SectorId;
  label: string;
  shortLabel: string;
  totalSeats: number;
}

export const SECTORS: Record<SectorId, SectorDescriptor> = {
  platea: {
    id: 'platea',
    label: 'Platea',
    shortLabel: 'Platea',
    totalSeats: 258,
  },
  palco_a: {
    id: 'palco_a',
    label: 'Palco A',
    shortLabel: 'Palco A',
    totalSeats: 51,
  },
};

export const SECTOR_ORDER: SectorId[] = ['platea', 'palco_a'];

/**
 * Estado de butaca compartido entre sectores.
 * Coincide con PlateaSeatStatus para mantener consistencia visual.
 */
export type SeatStatus =
  | 'available'
  | 'selected'
  | 'reserved'
  | 'sold'
  | 'blocked';

export type SeatStatusMap = Record<string, SeatStatus>;
