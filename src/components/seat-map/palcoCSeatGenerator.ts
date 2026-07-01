import type { SeatStatus, SeatStatusMap } from './sectorTypes';

export type PalcoCFaceId =
  | 'leftVertical'
  | 'leftDiagonal'
  | 'bottomLeft'
  | 'bottomRight'
  | 'rightDiagonal'
  | 'rightVertical';

export interface PalcoCFaceDescriptor {
  id: PalcoCFaceId;
  label: string;
  numbers: number[];
}

export const PALCO_C_FACES: Record<PalcoCFaceId, PalcoCFaceDescriptor> = {
  leftVertical: {
    id: 'leftVertical',
    label: 'Superior izquierda',
    numbers: [25, 24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13],
  },
  leftDiagonal: {
    id: 'leftDiagonal',
    label: 'Diagonal inferior izquierda',
    numbers: [12, 11, 10, 9, 8, 7, 6],
  },
  bottomLeft: {
    id: 'bottomLeft',
    label: 'Inferior izquierda',
    numbers: [5, 4, 3, 2, 1],
  },
  bottomRight: {
    id: 'bottomRight',
    label: 'Inferior derecha',
    numbers: [26, 27, 28, 29, 30],
  },
  rightDiagonal: {
    id: 'rightDiagonal',
    label: 'Diagonal inferior derecha',
    numbers: [31, 32, 33, 34, 35, 36, 37],
  },
  rightVertical: {
    id: 'rightVertical',
    label: 'Superior derecha',
    numbers: [38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50],
  },
};

export const PALCO_C_FACE_ORDER: PalcoCFaceId[] = [
  'leftVertical',
  'leftDiagonal',
  'bottomLeft',
  'bottomRight',
  'rightDiagonal',
  'rightVertical',
];

export const PALCO_C_FACE_COUNTS: Record<PalcoCFaceId, number> = {
  leftVertical: 13,
  leftDiagonal: 7,
  bottomLeft: 5,
  bottomRight: 5,
  rightDiagonal: 7,
  rightVertical: 13,
};

export const PALCO_C_VISUAL_FACE_COUNT = 5;
export const PALCO_C_TOTAL_SEATS = Object.values(PALCO_C_FACE_COUNTS).reduce(
  (a, b) => a + b,
  0
);

export type PalcoCPriceCategory = 'palco_c';

export interface PalcoCSeat {
  id: string;
  section: 'PALCO_C';
  face: PalcoCFaceId;
  faceLabel: string;
  seatNumber: number;
  label: string;
  x: number;
  y: number;
  rotation: number;
  status: SeatStatus;
  priceCategory: PalcoCPriceCategory;
}

export type PalcoCSeatStatusMap = SeatStatusMap;

export interface Point {
  x: number;
  y: number;
}

const DEBUG_GEOMETRY = false;

export const PALCO_C_SEAT_WIDTH = 38;
export const PALCO_C_SEAT_HEIGHT = 26;
export const PALCO_C_SEAT_RADIUS = 8;

export interface PalcoCSegmentDef {
  face: PalcoCFaceId;
  faceLabel: string;
  numbers: number[];
  start: Point;
  end: Point;
  rotation: number;
}

export const PALCO_C_SEGMENTS: Record<PalcoCFaceId, PalcoCSegmentDef> = {
  leftVertical: {
    face: 'leftVertical',
    faceLabel: 'Superior izquierda',
    numbers: [25, 24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13],
    start: { x: 220, y: 120 },
    end: { x: 220, y: 620 },
    rotation: 0,
  },
  leftDiagonal: {
    face: 'leftDiagonal',
    faceLabel: 'Diagonal inferior izquierda',
    numbers: [12, 11, 10, 9, 8, 7, 6],
    start: { x: 250, y: 705 },
    end: { x: 650, y: 1030 },
    rotation: 39,
  },
  bottomLeft: {
    face: 'bottomLeft',
    faceLabel: 'Inferior izquierda',
    numbers: [5, 4, 3, 2, 1],
    start: { x: 760, y: 1150 },
    end: { x: 930, y: 1150 },
    rotation: 0,
  },
  bottomRight: {
    face: 'bottomRight',
    faceLabel: 'Inferior derecha',
    numbers: [26, 27, 28, 29, 30],
    start: { x: 1070, y: 1150 },
    end: { x: 1240, y: 1150 },
    rotation: 0,
  },
  rightDiagonal: {
    face: 'rightDiagonal',
    faceLabel: 'Diagonal inferior derecha',
    numbers: [31, 32, 33, 34, 35, 36, 37],
    start: { x: 1350, y: 1030 },
    end: { x: 1750, y: 705 },
    rotation: -39,
  },
  rightVertical: {
    face: 'rightVertical',
    faceLabel: 'Superior derecha',
    numbers: [38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50],
    start: { x: 1780, y: 620 },
    end: { x: 1780, y: 120 },
    rotation: 0,
  },
};

export interface PalcoCGeometry {
  viewBox: { width: number; height: number };
  labels: {
    leftVertical: Point;
    rightVertical: Point;
    leftDiagonal: Point;
    rightDiagonal: Point;
    bottom: Point;
  };
  titles: {
    title: Point;
    subtitle: Point;
  };
  gateLeft: Point;
  gateRight: Point;
  seatWidth: number;
  seatHeight: number;
  seatRadius: number;
}

export const PALCO_C_GEOMETRY: PalcoCGeometry = {
  viewBox: { width: 2000, height: 1500 },
  labels: {
    leftVertical: { x: 105, y: 370 },
    rightVertical: { x: 1895, y: 370 },
    leftDiagonal: { x: 450, y: 900 },
    rightDiagonal: { x: 1550, y: 900 },
    bottom: { x: 1000, y: 1215 },
  },
  titles: {
    title: { x: 1000, y: 430 },
    subtitle: { x: 1000, y: 480 },
  },
  gateLeft: { x: 230, y: 1450 },
  gateRight: { x: 1770, y: 1450 },
  seatWidth: PALCO_C_SEAT_WIDTH,
  seatHeight: PALCO_C_SEAT_HEIGHT,
  seatRadius: PALCO_C_SEAT_RADIUS,
};

export const PALCO_C_VIEWBOX = PALCO_C_GEOMETRY.viewBox;

function placeSeatsOnSegment(
  seg: PalcoCSegmentDef
): Omit<PalcoCSeat, 'status' | 'priceCategory'>[] {
  const { numbers, start, end, face, faceLabel, rotation } = seg;
  const n = numbers.length;
  const dx = end.x - start.x;
  const dy = end.y - start.y;

  return numbers.map((seatNumber, index) => {
    const t = n === 1 ? 0 : index / (n - 1);
    const x = start.x + dx * t;
    const y = start.y + dy * t;

    return {
      id: buildId(face, seatNumber),
      section: 'PALCO_C' as const,
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

const FACE_PREFIX: Record<PalcoCFaceId, string> = {
  leftVertical: 'LEFT-VERTICAL',
  leftDiagonal: 'LEFT-DIAGONAL',
  bottomLeft: 'BOTTOM-LEFT',
  bottomRight: 'BOTTOM-RIGHT',
  rightDiagonal: 'RIGHT-DIAGONAL',
  rightVertical: 'RIGHT-VERTICAL',
};

function pad2(n: number): string {
  return n.toString().padStart(2, '0');
}

function buildId(face: PalcoCFaceId, seatNumber: number): string {
  return `PALCO-C-${FACE_PREFIX[face]}-B${pad2(seatNumber)}`;
}

function buildLabel(faceLabel: string, seatNumber: number): string {
  return `Palco C · ${faceLabel} · Butaca ${seatNumber}`;
}

export function generatePalcoCSeats(
  statuses: PalcoCSeatStatusMap = {}
): PalcoCSeat[] {
  const seats: PalcoCSeat[] = [];
  const allRaw: Omit<PalcoCSeat, 'status' | 'priceCategory'>[] = [];

  for (const face of PALCO_C_FACE_ORDER) {
    const placed = placeSeatsOnSegment(PALCO_C_SEGMENTS[face]);
    allRaw.push(...placed);
  }

  for (const raw of allRaw) {
    seats.push({
      ...raw,
      status: statuses[raw.id] ?? 'available',
      priceCategory: 'palco_c',
    });
  }

  if (DEBUG_GEOMETRY) {
    for (const s of seats) {
      console.log(`[DEBUG] ${s.id}: (${s.x.toFixed(1)}, ${s.y.toFixed(1)}) rot=${s.rotation}`);
    }
  }

  return seats;
}

export function validatePalcoCSeats(seats: PalcoCSeat[]): void {
  const errors: string[] = [];

  if (seats.length !== PALCO_C_TOTAL_SEATS) {
    errors.push(
      `Total Palco C: ${seats.length} butacas, se esperaban ${PALCO_C_TOTAL_SEATS}.`
    );
  }

  const byFace: Record<PalcoCFaceId, number> = {
    leftVertical: 0,
    leftDiagonal: 0,
    bottomLeft: 0,
    bottomRight: 0,
    rightDiagonal: 0,
    rightVertical: 0,
  };
  for (const s of seats) byFace[s.face] += 1;

  for (const face of PALCO_C_FACE_ORDER) {
    if (byFace[face] !== PALCO_C_FACE_COUNTS[face]) {
      errors.push(
        `Cara ${face}: ${byFace[face]} butacas, se esperaban ${PALCO_C_FACE_COUNTS[face]}.`
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
  const maxAllowedX = PALCO_C_VIEWBOX.width - margin;
  const maxAllowedY = PALCO_C_VIEWBOX.height - margin;
  if (minX < margin || maxX > maxAllowedX || minY < margin || maxY > maxAllowedY) {
    console.warn(
      `[PalcoCSeatMap] Bounds fuera de rango: X=${minX.toFixed(0)}..${maxX.toFixed(0)} Y=${minY.toFixed(0)}..${maxY.toFixed(0)} (esperado minX>${margin} maxX<${maxAllowedX} minY>${margin} maxY<${maxAllowedY})`
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
        `[PalcoCSeatMap] Possible seat overlap:\n  - ${overlaps.join('\n  - ')}`
      );
    }
  }

  if (errors.length > 0) {
    const msg = `[PalcoCSeatMap] Validación fallida:\n  - ${errors.join('\n  - ')}`;
    if (import.meta.env.PROD) {
      console.error(msg);
    } else {
      console.error(msg);
      throw new Error(msg);
    }
  }
}