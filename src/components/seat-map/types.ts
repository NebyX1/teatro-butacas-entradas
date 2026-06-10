export type PlateaSide = 'izquierda' | 'derecha';

export type PlateaSeatStatus =
  | 'available'
  | 'selected'
  | 'reserved'
  | 'sold'
  | 'blocked';

export type PlateaPriceCategory = 'platea';

export interface PlateaSeat {
  id: string;
  section: 'PLATEA';
  side: PlateaSide;
  row: number;
  seatNumber: number;
  label: string;
  x: number;
  y: number;
  rotation: number;
  status: PlateaSeatStatus;
  priceCategory: PlateaPriceCategory;
}

export type PlateaSeatStatusMap = Record<string, PlateaSeatStatus>;

export interface PlateaSeatMapProps {
  seatStatuses?: PlateaSeatStatusMap;
  maxSelectableSeats?: number;
  onSelectionChange?: (seats: PlateaSeat[]) => void;
  onWarning?: (message: string | null) => void;
}
