import {
  PLATEA_ROW_COUNTS,
  PLATEA_ROWS,
  PLATEA_SEATS_PER_SIDE,
  PLATEA_TOTAL_SEATS,
} from './plateaSeatData';
import type {
  PlateaSeat,
  PlateaSeatStatus,
  PlateaSeatStatusMap,
  PlateaSide,
} from './types';

export interface PlateaGeometry {
  centerX: number;
  centerGap: number;
  startY: number;
  rowGap: number;
  seatWidth: number;
  seatHeight: number;
  seatGap: number;
  fanOffsetPerRow: number;
}

export const PLATEA_GEOMETRY: PlateaGeometry = {
  centerX: 600,
  centerGap: 120,
  startY: 220,
  rowGap: 34,
  seatWidth: 30,
  seatHeight: 26,
  seatGap: 7,
  fanOffsetPerRow: 6,
};

export const PLATEA_VIEWBOX = {
  width: 1200,
  height: 720,
};

const SIDE_PREFIX: Record<PlateaSide, 'IZQ' | 'DER'> = {
  izquierda: 'IZQ',
  derecha: 'DER',
};

function pad2(n: number): string {
  return n.toString().padStart(2, '0');
}

function buildLabel(side: PlateaSide, row: number, seatNumber: number): string {
  const sideText = side === 'izquierda' ? 'Platea izquierda' : 'Platea derecha';
  return `${sideText} · Fila ${row} · Butaca ${seatNumber}`;
}

/**
 * Genera las 258 butacas de la platea con coordenadas calculadas.
 * El algoritmo:
 *  - Para cada fila (1..13) y cada lado, mira PLATEA_ROW_COUNTS.
 *  - En el lado izquierdo, butaca 1 arranca pegada al pasillo y crece hacia
 *    la izquierda. En el lado derecho, butaca 1 arranca pegada al pasillo y
 *    crece hacia la derecha. Esto es la regla de numeración desde el centro
 *    hacia afuera, centralizada acá para poder cambiarla si la Intendencia
 *    confirma otra numeración oficial.
 *  - Cada fila aplica un fanOffset (filas más lejanas se abren levemente)
 *    para que la platea se vea como un abanico y no como un rectángulo.
 *
 * Acepta `statuses` para aplicar estados (sold/reserved/blocked) por encima
 * de la disponibilidad base. Esto permite enchufar el backend más adelante
 * sin reescribir nada.
 */
export function generatePlateaSeats(
  statuses: PlateaSeatStatusMap = {}
): PlateaSeat[] {
  const seats: PlateaSeat[] = [];
  const g = PLATEA_GEOMETRY;

  for (let i = 0; i < PLATEA_ROW_COUNTS.length; i++) {
    const row = i + 1;
    const count = PLATEA_ROW_COUNTS[i];
    const y = g.startY + i * g.rowGap;
    const fanOffset = i * g.fanOffsetPerRow;

    for (const side of ['izquierda', 'derecha'] as const) {
      for (let s = 0; s < count; s++) {
        const seatNumber = s + 1;
        const id = `PLATEA-${SIDE_PREFIX[side]}-F${pad2(row)}-B${pad2(seatNumber)}`;

        let x: number;
        if (side === 'izquierda') {
          // Borde interior del pasillo
          const innerEdge = g.centerX - g.centerGap / 2;
          // Butaca 1 (s=0) pegada al pasillo; butaca N crece hacia la izquierda
          x = innerEdge - (s + 1) * g.seatWidth - s * g.seatGap - fanOffset;
        } else {
          const innerEdge = g.centerX + g.centerGap / 2;
          x = innerEdge + s * (g.seatWidth + g.seatGap) + fanOffset;
        }

        const status: PlateaSeatStatus = statuses[id] ?? 'available';

        seats.push({
          id,
          section: 'PLATEA',
          side,
          row,
          seatNumber,
          label: buildLabel(side, row, seatNumber),
          x,
          y,
          rotation: 0,
          status,
          priceCategory: 'platea',
        });
      }
    }
  }

  return seats;
}

/**
 * Valida la integridad del set de butacas generadas.
 * Pensado para correr en desarrollo: si hay inconsistencias, loguea y lanza.
 *
 * Totales esperados con PLATEA_ROW_COUNTS:
 *  - 13 filas por lado
 *  - 129 butacas por lado
 *  - 258 butacas totales
 */
export function validatePlateaSeats(seats: PlateaSeat[]): void {
  const errors: string[] = [];

  const leftSeats = seats.filter((s) => s.side === 'izquierda');
  const rightSeats = seats.filter((s) => s.side === 'derecha');

  if (leftSeats.length !== PLATEA_SEATS_PER_SIDE) {
    errors.push(
      `Platea izquierda: ${leftSeats.length} butacas, se esperaban ${PLATEA_SEATS_PER_SIDE}.`
    );
  }
  if (rightSeats.length !== PLATEA_SEATS_PER_SIDE) {
    errors.push(
      `Platea derecha: ${rightSeats.length} butacas, se esperaban ${PLATEA_SEATS_PER_SIDE}.`
    );
  }
  if (seats.length !== PLATEA_TOTAL_SEATS) {
    errors.push(`Total platea: ${seats.length}, se esperaban ${PLATEA_TOTAL_SEATS}.`);
  }

  const seen = new Set<string>();
  for (const s of seats) {
    if (seen.has(s.id)) errors.push(`ID duplicado: ${s.id}`);
    seen.add(s.id);
  }

  const rowsBySide: Record<PlateaSide, Map<number, number>> = {
    izquierda: new Map(),
    derecha: new Map(),
  };
  for (const s of seats) {
    const m = rowsBySide[s.side];
    m.set(s.row, (m.get(s.row) ?? 0) + 1);
  }

  for (const side of ['izquierda', 'derecha'] as const) {
    const m = rowsBySide[side];
    if (m.size !== PLATEA_ROWS) {
      errors.push(`Lado ${side}: ${m.size} filas, se esperaban ${PLATEA_ROWS}.`);
    }
    for (let r = 1; r <= PLATEA_ROWS; r++) {
      const expected = PLATEA_ROW_COUNTS[r - 1];
      const got = m.get(r) ?? 0;
      if (got !== expected) {
        errors.push(
          `Lado ${side} fila ${r}: ${got} butacas, se esperaban ${expected}.`
        );
      }
    }
  }

  if (errors.length > 0) {
    const msg = `[PlateaSeatMap] Validación fallida:\n  - ${errors.join('\n  - ')}`;
    if (import.meta.env.PROD) {
      // En producción solo logueamos para no romper la app.
      console.error(msg);
    } else {
      console.error(msg);
      throw new Error(msg);
    }
  } else {
    // Útil como smoke test en dev.
    console.info(
      `[PlateaSeatMap] OK · ${seats.length} butacas · ${leftSeats.length} izquierda · ${rightSeats.length} derecha · ${PLATEA_ROWS} filas`
    );
  }
}
