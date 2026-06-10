/**
 * Paleta del SVG del mapa de butacas.
 * Centralizada para que el generador, los componentes y la leyenda
 * usen exactamente la misma paleta.
 */
export const seatMapTheme = {
  background: {
    from: '#0b1030',
    via: '#10164a',
    to: '#1a1240',
  },
  plateaSurface: '#0c1230',
  plateaSurfaceEdge: 'rgba(124, 152, 255, 0.18)',
  stage: {
    from: '#F1F5FF',
    to: '#A6BCFF',
    stroke: '#3B5BDB',
    glow: 'rgba(124, 152, 255, 0.35)',
  },
  rowLabel: '#cbd5ff',
  sideLabel: '#dbe2ff',
  textDark: '#0F172A',
  textLight: '#F8FAFC',
  status: {
    available: '#7BF1B8',
    availableStroke: '#1DBA7A',
    selected: '#F8C14A',
    selectedStroke: '#F59E0B',
    sold: '#64748B',
    soldStroke: '#94A3B8',
    reserved: '#64748B',
    reservedStroke: '#94A3B8',
    blocked: '#FB7185',
    blockedStroke: '#E11D48',
  },
} as const;

export type SeatMapTheme = typeof seatMapTheme;
