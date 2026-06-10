/**
 * Cantidad de butacas por fila para CADA LADO de la platea.
 * Fila 1 es la más cercana al escenario; fila 13 la más alejada.
 * Totales por lado: 8+9+11+11+11+11+11+11+11+11+10+8+6 = 129.
 * Totales platea completa: 258.
 */
export const PLATEA_ROW_COUNTS = [8, 9, 11, 11, 11, 11, 11, 11, 11, 11, 10, 8, 6] as const;

export const PLATEA_ROWS = PLATEA_ROW_COUNTS.length;

export const PLATEA_SIDES = ['izquierda', 'derecha'] as const;

export const PLATEA_SEATS_PER_SIDE = PLATEA_ROW_COUNTS.reduce((a, b) => a + b, 0);

export const PLATEA_TOTAL_SEATS = PLATEA_SEATS_PER_SIDE * 2;

export type PlateaRowCounts = typeof PLATEA_ROW_COUNTS;
