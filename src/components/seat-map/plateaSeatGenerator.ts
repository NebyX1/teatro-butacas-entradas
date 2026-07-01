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

const SIDE_WORD: Record<PlateaSide, 'left' | 'right'> = {
  izquierda: 'left',
  derecha: 'right',
};

function buildLabel(side: PlateaSide, row: number, seatNumber: number): string {
  const sideText = side === 'izquierda' ? 'Platea izquierda' : 'Platea derecha';
  return `${sideText} · Fila ${row} · Butaca ${seatNumber}`;
}

/**
 * Numeración real de la platea (confirmada contra el mapa oficial):
 *  - La platea usa UNA sola numeración global continua de 1 a 258.
 *  - Se cuenta fila por fila, empezando en la fila más cercana al
 *    escenario (fila 1) y avanzando hacia el fondo (fila 13).
 *  - Dentro de cada fila se cuenta visualmente de izquierda a derecha:
 *    primero todas las butacas de Platea Izquierda (de afuera hacia el
 *    pasillo) y, sin reiniciar el contador, se continúa con Platea
 *    Derecha (del pasillo hacia afuera).
 *  - Ejemplo fila 1 (8 butacas por lado): Izquierda 1..8, Derecha 9..16.
 *    La fila 2 continúa en 17, no reinicia en 1 ni en 12.
 *  - Platea Derecha NUNCA reinicia en 1 ni arranca fijo en 12: siempre
 *    continúa la secuencia que dejó Platea Izquierda en esa misma fila.
 */

/**
 * Genera las 258 butacas de la platea con coordenadas calculadas.
 * El algoritmo:
 *  - Para cada fila (1..13) mira PLATEA_ROW_COUNTS para saber cuántas
 *    butacas hay por lado (izquierda y derecha tienen el mismo largo).
 *  - Mantiene un contador global (`globalCounter`) que arranca en 1 y
 *    nunca se reinicia: se le asignan primero las butacas de Platea
 *    Izquierda (de afuera hacia el pasillo) y luego, sin cortar la
 *    secuencia, las de Platea Derecha (del pasillo hacia afuera).
 *  - Las coordenadas (x/y) se calculan igual que antes: cada lado arranca
 *    pegado al pasillo (borde interior) y crece hacia afuera. Solo cambia
 *    qué número se le asigna a cada posición, no la geometría.
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

  let globalCounter = 1;

  for (let i = 0; i < PLATEA_ROW_COUNTS.length; i++) {
    const row = i + 1;
    const count = PLATEA_ROW_COUNTS[i];
    const y = g.startY + i * g.rowGap;
    const fanOffset = i * g.fanOffsetPerRow;

    const rowLeftStart = globalCounter;
    const rowRightStart = rowLeftStart + count;

    for (const side of ['izquierda', 'derecha'] as const) {
      for (let s = 0; s < count; s++) {
        // s = posición dentro de la fila arrancando en 0 desde el pasillo
        // (borde interior) hacia afuera.
        // Derecha: el pasillo (s=0) recibe el número más bajo del bloque y
        // crece hacia afuera (visualmente izquierda a derecha ascendente).
        // Izquierda: se invierte a propósito. El pasillo (s=0, el extremo
        // derecho visual del bloque izquierdo) recibe el número más BAJO
        // del bloque, y la butaca más alejada del pasillo (s=count-1, el
        // extremo izquierdo visual) recibe el número más ALTO. Así, leído
        // de izquierda a derecha, Platea Izquierda se ve en orden
        // descendente (ej. 8,7,6,...,1) y no ascendente.
        const seatNumber = side === 'izquierda' ? rowLeftStart + s : rowRightStart + s;

        const id = `platea-row-${row}-${SIDE_WORD[side]}-seat-${seatNumber}`;

        let x: number;
        if (side === 'izquierda') {
          // Borde interior del pasillo
          const innerEdge = g.centerX - g.centerGap / 2;
          // s=0 pegado al pasillo; s crece hacia la izquierda
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

    globalCounter = rowRightStart + count;
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
  }
}
