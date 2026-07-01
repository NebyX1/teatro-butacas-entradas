import type { SeatStatus, SeatStatusMap } from './sectorTypes';

export type PalcoAFaceId =
  | 'upperLeft'
  | 'upperRight'
  | 'lowerLeftDiagonal'
  | 'lowerRightDiagonal'
  | 'bottom';

export interface PalcoAFaceDescriptor {
  id: PalcoAFaceId;
  label: string;
  numbers: number[];
}

export const PALCO_A_FACES: Record<PalcoAFaceId, PalcoAFaceDescriptor> = {
  upperLeft: {
    id: 'upperLeft',
    label: 'Superior izquierda',
    numbers: [26, 25, 24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14],
  },
  upperRight: {
    id: 'upperRight',
    label: 'Superior derecha',
    numbers: [39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51],
  },
  lowerLeftDiagonal: {
    id: 'lowerLeftDiagonal',
    label: 'Diagonal inferior izquierda',
    numbers: [13, 12, 11, 10, 9, 8, 7],
  },
  lowerRightDiagonal: {
    id: 'lowerRightDiagonal',
    label: 'Diagonal inferior derecha',
    numbers: [32, 33, 34, 35, 36, 37, 38],
  },
  bottom: {
    id: 'bottom',
    label: 'Inferior',
    numbers: [6, 5, 4, 3, 2, 1, 27, 28, 29, 30, 31],
  },
};

export const PALCO_A_FACE_ORDER: PalcoAFaceId[] = [
  'upperLeft',
  'upperRight',
  'lowerLeftDiagonal',
  'lowerRightDiagonal',
  'bottom',
];

export const PALCO_A_FACE_COUNTS: Record<PalcoAFaceId, number> = {
  upperLeft: 13,
  upperRight: 13,
  lowerLeftDiagonal: 7,
  lowerRightDiagonal: 7,
  bottom: 11,
};

export const PALCO_A_TOTAL_SEATS = Object.values(PALCO_A_FACE_COUNTS).reduce(
  (a, b) => a + b,
  0
);

export type PalcoAPriceCategory = 'palco_a';

export interface PalcoASeat {
  id: string;
  section: 'PALCO_A';
  face: PalcoAFaceId;
  faceLabel: string;
  seatNumber: number;
  label: string;
  x: number;
  y: number;
  rotation: number;
  status: SeatStatus;
  priceCategory: PalcoAPriceCategory;
}

export type PalcoASeatStatusMap = SeatStatusMap;

export interface Point {
  x: number;
  y: number;
}

const DEBUG_GEOMETRY = false;

export const SEAT_WIDTH = 38;
export const SEAT_HEIGHT = 26;
export const SEAT_RADIUS = 8;

export interface PalcoASegmentDef {
  face: PalcoAFaceId;
  faceLabel: string;
  numbers: number[];
  start: Point;
  end: Point;
  rotation: number;
}

/*
 * Nuevo concepto geométrico: palco ancho, espacioso y simétrico.
 * viewBox 1700x900. Columnas verticales altas en los extremos, diagonales
 * suaves (≈30°) descendentes hacia el centro, y cara inferior horizontal
 * perfectamente centrada, con un hueco visible entre los grupos izq/der.
 */
export const PALCO_A_SEGMENTS: Record<string, PalcoASegmentDef> = {
  upperLeft: {
    face: 'upperLeft',
    faceLabel: 'Superior izquierda',
    numbers: [26, 25, 24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14],
    start: { x: 180, y: 100 },
    end: { x: 180, y: 540 },
    rotation: 0,
  },
  lowerLeftDiagonal: {
    face: 'lowerLeftDiagonal',
    faceLabel: 'Diagonal inferior izquierda',
    numbers: [13, 12, 11, 10, 9, 8, 7],
    start: { x: 180, y: 540 },
    end: { x: 590, y: 780 },
    rotation: 30,
  },
  bottomLeftGroup: {
    face: 'bottom',
    faceLabel: 'Inferior',
    numbers: [6, 5, 4, 3, 2, 1],
    start: { x: 590, y: 780 },
    end: { x: 820, y: 780 },
    rotation: 0,
  },
  bottomRightGroup: {
    face: 'bottom',
    faceLabel: 'Inferior',
    numbers: [27, 28, 29, 30, 31],
    start: { x: 880, y: 780 },
    end: { x: 1064, y: 780 },
    rotation: 0,
  },
  lowerRightDiagonal: {
    face: 'lowerRightDiagonal',
    faceLabel: 'Diagonal inferior derecha',
    numbers: [32, 33, 34, 35, 36, 37, 38],
    start: { x: 1064, y: 780 },
    end: { x: 1520, y: 540 },
    rotation: -30,
  },
  upperRight: {
    face: 'upperRight',
    faceLabel: 'Superior derecha',
    numbers: [39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51],
    start: { x: 1520, y: 100 },
    end: { x: 1520, y: 540 },
    rotation: 0,
  },
};

export interface PalcoAGeometry {
  viewBox: { width: number; height: number };
  labels: {
    upperLeft: Point;
    upperRight: Point;
    lowerLeftDiagonal: Point;
    lowerRightDiagonal: Point;
    bottom: Point;
  };
  titles: {
    title: Point;
    subtitle: Point;
  };
  seatWidth: number;
  seatHeight: number;
  seatRadius: number;
}

export const PALCO_A_GEOMETRY: PalcoAGeometry = {
  viewBox: { width: 1700, height: 900 },
  labels: {
    upperLeft: { x: 90, y: 320 },
    upperRight: { x: 1610, y: 320 },
    lowerLeftDiagonal: { x: 330, y: 700 },
    lowerRightDiagonal: { x: 1370, y: 700 },
    bottom: { x: 850, y: 830 },
  },
  titles: {
    title: { x: 850, y: 350 },
    subtitle: { x: 850, y: 402 },
  },
  seatWidth: SEAT_WIDTH,
  seatHeight: SEAT_HEIGHT,
  seatRadius: SEAT_RADIUS,
};

export const PALCO_A_VIEWBOX = PALCO_A_GEOMETRY.viewBox;

function placeSeatsOnSegment(
  seg: PalcoASegmentDef
): Omit<PalcoASeat, 'status' | 'priceCategory'>[] {
  const { numbers, start, end, face, faceLabel, rotation } = seg;
  const n = numbers.length;
  const dx = end.x - start.x;
  const dy = end.y - start.y;

  return numbers.map((seatNumber, index) => {
    const t = (index + 0.5) / n;
    const x = start.x + dx * t;
    const y = start.y + dy * t;

    return {
      id: buildId(face, seatNumber),
      section: 'PALCO_A' as const,
      face,
      faceLabel,
      seatNumber,
      label: buildLabel(faceLabel, seatNumber),
      x,
      y,
      rotation,
    };
  });
}

const FACE_PREFIX: Record<PalcoAFaceId, string> = {
  upperLeft: 'UPPER-LEFT',
  upperRight: 'UPPER-RIGHT',
  lowerLeftDiagonal: 'LOWER-LEFT-DIAGONAL',
  lowerRightDiagonal: 'LOWER-RIGHT-DIAGONAL',
  bottom: 'BOTTOM',
};

function pad2(n: number): string {
  return n.toString().padStart(2, '0');
}

function buildId(face: PalcoAFaceId, seatNumber: number): string {
  return `PALCO-A-${FACE_PREFIX[face]}-B${pad2(seatNumber)}`;
}

function buildLabel(faceLabel: string, seatNumber: number): string {
  return `Palco A · ${faceLabel} · Butaca ${seatNumber}`;
}

export function generatePalcoASeats(
  statuses: PalcoASeatStatusMap = {}
): PalcoASeat[] {
  const seats: PalcoASeat[] = [];
  const allRaw: Omit<PalcoASeat, 'status' | 'priceCategory'>[] = [];

  for (const key of Object.keys(PALCO_A_SEGMENTS)) {
    const seg = PALCO_A_SEGMENTS[key];
    const placed = placeSeatsOnSegment(seg);
    allRaw.push(...placed);
  }

  for (const raw of allRaw) {
    seats.push({
      ...raw,
      status: statuses[raw.id] ?? 'available',
      priceCategory: 'palco_a',
    });
  }

  if (DEBUG_GEOMETRY) {
    for (const s of seats) {
      console.log(`[DEBUG] ${s.id}: (${s.x.toFixed(1)}, ${s.y.toFixed(1)}) rot=${s.rotation}`);
    }
  }

  return seats;
}

export function validatePalcoASeats(seats: PalcoASeat[]): void {
  const errors: string[] = [];

  if (seats.length !== PALCO_A_TOTAL_SEATS) {
    errors.push(
      `Total Palco A: ${seats.length} butacas, se esperaban ${PALCO_A_TOTAL_SEATS}.`
    );
  }

  const byFace: Record<PalcoAFaceId, number> = {
    upperLeft: 0,
    upperRight: 0,
    lowerLeftDiagonal: 0,
    lowerRightDiagonal: 0,
    bottom: 0,
  };
  for (const s of seats) byFace[s.face] += 1;

  for (const face of PALCO_A_FACE_ORDER) {
    if (byFace[face] !== PALCO_A_FACE_COUNTS[face]) {
      errors.push(
        `Cara ${face}: ${byFace[face]} butacas, se esperaban ${PALCO_A_FACE_COUNTS[face]}.`
      );
    }
  }

  const seen = new Set<string>();
  let minX = Infinity, maxX = -Infinity;
  let minY = Infinity, maxY = -Infinity;
  for (const s of seats) {
    if (seen.has(s.id)) errors.push(`ID duplicado: ${s.id}`);
    seen.add(s.id);
    if (s.x < minX) minX = s.x;
    if (s.x > maxX) maxX = s.x;
    if (s.y < minY) minY = s.y;
    if (s.y > maxY) maxY = s.y;
  }

  const margin = 60;
  const maxAllowedX = PALCO_A_VIEWBOX.width - margin;
  const maxAllowedY = PALCO_A_VIEWBOX.height - margin;
  if (minX < margin || maxX > maxAllowedX || minY < margin || maxY > maxAllowedY) {
    console.warn(
      `[PalcoASeatMap] Bounds fuera de rango: X=${minX.toFixed(0)}..${maxX.toFixed(0)} Y=${minY.toFixed(0)}..${maxY.toFixed(0)} (esperado minX>${margin} maxX<${maxAllowedX} minY>${margin} maxY<${maxAllowedY})`
    );
  }

  if (DEBUG_GEOMETRY && !import.meta.env.PROD) {
    const overlaps: string[] = [];
    for (let i = 0; i < seats.length; i++) {
      for (let j = i + 1; j < seats.length; j++) {
        const a = seats[i];
        const b = seats[j];
        const distance = Math.hypot(a.x - b.x, a.y - b.y);
        if (distance < 34) {
          overlaps.push(
            `${a.id} ↔ ${b.id} (dist=${distance.toFixed(1)})`
          );
        }
      }
    }
    if (overlaps.length > 0) {
      console.warn(
        `[PalcoASeatMap] Possible seat overlap:\n  - ${overlaps.join('\n  - ')}`
      );
    }
  }

  if (errors.length > 0) {
    const msg = `[PalcoASeatMap] Validación fallida:\n  - ${errors.join('\n  - ')}`;
    if (import.meta.env.PROD) {
      console.error(msg);
    } else {
      console.error(msg);
      throw new Error(msg);
    }
  }
}
