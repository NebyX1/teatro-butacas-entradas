import type { SectorId } from '../components/seat-map/sectorTypes';
import { SECTORS } from '../components/seat-map/sectorTypes';
import type { PlateaSeat } from '../components/seat-map/types';
import type { PalcoASeat } from '../components/seat-map/palcoASeatGenerator';
import type { PalcoBSeat } from '../components/seat-map/palcoBSeatGenerator';
import type { PalcoCSeat } from '../components/seat-map/palcoCSeatGenerator';
import type { ReservationSeat } from '../store/useReservationStore';

export interface SeatPriceConfig {
  platea: number;
  palco_a: number;
  palco_b: number;
  palco_c: number;
}

export const DEFAULT_SEAT_PRICES: SeatPriceConfig = {
  platea: 850,
  palco_a: 1200,
  palco_b: 1200,
  palco_c: 1200,
};

export function priceForSector(sectorId: SectorId, config = DEFAULT_SEAT_PRICES): number {
  return config[sectorId];
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-UY', {
    style: 'currency',
    currency: 'UYU',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function toReservationSeatPlatea(seat: PlateaSeat): ReservationSeat {
  const sideText = seat.side === 'izquierda' ? 'Platea izquierda' : 'Platea derecha';
  return {
    id: seat.id,
    sector: 'platea',
    sectorLabel: SECTORS.platea.label,
    row: seat.row,
    side: seat.side,
    number: seat.seatNumber,
    status: seat.status,
    price: DEFAULT_SEAT_PRICES.platea,
    displayLabel: `${sideText}, Fila ${seat.row}, Butaca ${seat.seatNumber}`,
  };
}

export function toReservationSeatPalcoA(seat: PalcoASeat): ReservationSeat {
  return {
    id: seat.id,
    sector: 'palco_a',
    sectorLabel: SECTORS.palco_a.label,
    number: seat.seatNumber,
    status: seat.status,
    price: DEFAULT_SEAT_PRICES.palco_a,
    displayLabel: `Palco A, Butaca ${seat.seatNumber}`,
  };
}

export function toReservationSeatPalcoB(seat: PalcoBSeat): ReservationSeat {
  const detail =
    seat.face === 'authorities'
      ? `Palco B, Butaca de autoridad ${seat.seatNumber}`
      : `Palco B, Butaca ${seat.seatNumber}`;
  return {
    id: seat.id,
    sector: 'palco_b',
    sectorLabel: SECTORS.palco_b.label,
    number: seat.seatNumber,
    status: seat.status,
    price: DEFAULT_SEAT_PRICES.palco_b,
    displayLabel: detail,
  };
}

export function toReservationSeatPalcoC(seat: PalcoCSeat): ReservationSeat {
  return {
    id: seat.id,
    sector: 'palco_c',
    sectorLabel: SECTORS.palco_c.label,
    number: seat.seatNumber,
    status: seat.status,
    price: DEFAULT_SEAT_PRICES.palco_c,
    displayLabel: `Palco C, Butaca ${seat.seatNumber}`,
  };
}

export function calculateBreakdown(
  seats: ReservationSeat[],
  seatPrices = DEFAULT_SEAT_PRICES
): { subtotal: number; serviceFee: number; total: number } {
  const subtotal = seats.reduce((sum, seat) => sum + (seatPrices[seat.sector] ?? 0), 0);
  const serviceFee = Math.round(subtotal * 0.05);
  const total = subtotal + serviceFee;
  return { subtotal, serviceFee, total };
}
