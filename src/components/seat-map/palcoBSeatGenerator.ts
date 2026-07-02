import type { SeatStatus, SeatStatusMap } from './sectorTypes';
import {
  PALCO_SEAT_WIDTH,
  PALCO_SEAT_HEIGHT,
  PALCO_SEAT_RADIUS,
} from './palcoShared';

export type PalcoBFaceId =
  | 'upperLeft'
  | 'upperRight'
  | 'lowerLeftDiagonal'
  | 'lowerRightDiagonal'
  | 'authorities';

export interface PalcoBFaceDescriptor {
  id: PalcoBFaceId;
  label: string;
  numbers: number[];
}

export const PALCO_B_FACES: Record<PalcoBFaceId, PalcoBFaceDescriptor> = {
  upperLeft: {
    id: 'upperLeft',
    label: 'Superior izquierda',
    numbers: [24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12],
  },
  upperRight: {
    id: 'upperRight',
    label: 'Superior derecha',
    numbers: [35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47],
  },
  lowerLeftDiagonal: {
    id: 'lowerLeftDiagonal',
    label: 'Diagonal inferior izquierda',
    numbers: [11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1],
  },
  lowerRightDiagonal: {
    id: 'lowerRightDiagonal',
    label: 'Diagonal inferior derecha',
    numbers: [24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34],
  },
  authorities: {
    id: 'authorities',
    label: 'Butacas de las autoridades',
    numbers: [1, 2, 3],
  },
};

export const PALCO_B_FACE_ORDER: PalcoBFaceId[] = [
  'upperLeft',
  'upperRight',
  'lowerLeftDiagonal',
  'lowerRightDiagonal',
  'authorities',
];

export const PALCO_B_FACE_COUNTS: Record<PalcoBFaceId, number> = {
  upperLeft: 13,
  upperRight: 13,
  lowerLeftDiagonal: 11,
  lowerRightDiagonal: 11,
  authorities: 3,
};

export const PALCO_B_TOTAL_SEATS = Object.values(PALCO_B_FACE_COUNTS).reduce(
  (a, b) => a + b,
  0
);

export type PalcoBPriceCategory = 'palco_b';

export interface PalcoBSeat {
  id: string;
  section: 'PALCO_B';
  face: PalcoBFaceId;
  faceLabel: string;
  seatNumber: number;
  label: string;
  x: number;
  y: number;
  rotation: number;
  status: SeatStatus;
  priceCategory: PalcoBPriceCategory;
}

export type PalcoBSeatStatusMap = SeatStatusMap;

export interface Point {
  x: number;
  y: number;
}

const DEBUG_GEOMETRY = false;

// Re-exports con el nombre histórico para no romper imports antiguos.
// El valor canónico vive en ./palcoShared y se reutiliza entre los tres palcos.
export const PALCO_B_SEAT_WIDTH = PALCO_SEAT_WIDTH;
export const PALCO_B_SEAT_HEIGHT = PALCO_SEAT_HEIGHT;
export const PALCO_B_SEAT_RADIUS = PALCO_SEAT_RADIUS;

export interface PalcoBSegmentDef {
  face: PalcoBFaceId;
  faceLabel: string;
  numbers: number[];
  start: Point;
  end: Point;
  rotation: number;
}

export const PALCO_B_SEGMENTS: Record<string, PalcoBSegmentDef> = {
  upperLeft: {
    face: 'upperLeft',
    faceLabel: 'Superior izquierda',
    numbers: [24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12],
    start: { x: 260, y: 120 },
    end: { x: 260, y: 600 },
    rotation: 0,
  },
  lowerLeftDiagonal: {
    face: 'lowerLeftDiagonal',
    faceLabel: 'Diagonal inferior izquierda',
    numbers: [11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1],
    start: { x: 255, y: 675 },
    end: { x: 620, y: 965 },
    rotation: 38,
  },
  authorities: {
    face: 'authorities',
    faceLabel: 'Butacas de las autoridades',
    numbers: [1, 2, 3],
    start: { x: 820, y: 1075 },
    end: { x: 1000, y: 1075 },
    rotation: 0,
  },
  lowerRightDiagonal: {
    face: 'lowerRightDiagonal',
    faceLabel: 'Diagonal inferior derecha',
    numbers: [24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34],
    start: { x: 1200, y: 965 },
    end: { x: 1565, y: 675 },
    rotation: -38,
  },
  upperRight: {
    face: 'upperRight',
    faceLabel: 'Superior derecha',
    numbers: [35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47],
    start: { x: 1560, y: 600 },
    end: { x: 1560, y: 120 },
    rotation: 0,
  },
};

export interface PalcoBGeometry {
  viewBox: { width: number; height: number };
  labels: {
    upperLeft: Point;
    upperRight: Point;
    lowerLeftDiagonal: Point;
    lowerRightDiagonal: Point;
    authorities: Point;
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

export const PALCO_B_GEOMETRY: PalcoBGeometry = {
  viewBox: { width: 1820, height: 1460 },
  labels: {
    upperLeft: { x: 130, y: 360 },
    upperRight: { x: 1690, y: 360 },
    lowerLeftDiagonal: { x: 435, y: 845 },
    lowerRightDiagonal: { x: 1385, y: 845 },
    authorities: { x: 910, y: 1140 },
  },
  titles: {
    title: { x: 910, y: 410 },
    subtitle: { x: 910, y: 460 },
  },
  gateLeft: { x: 220, y: 1420 },
  gateRight: { x: 1600, y: 1420 },
  seatWidth: PALCO_B_SEAT_WIDTH,
  seatHeight: PALCO_B_SEAT_HEIGHT,
  seatRadius: PALCO_B_SEAT_RADIUS,
};

export const PALCO_B_VIEWBOX = PALCO_B_GEOMETRY.viewBox;

function placeSeatsOnSegment(
  seg: PalcoBSegmentDef
): Omit<PalcoBSeat, 'status' | 'priceCategory'>[] {
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
      section: 'PALCO_B' as const,
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

const FACE_PREFIX: Record<PalcoBFaceId, string> = {
  upperLeft: 'UPPER-LEFT',
  upperRight: 'UPPER-RIGHT',
  lowerLeftDiagonal: 'LOWER-LEFT-DIAGONAL',
  lowerRightDiagonal: 'LOWER-RIGHT-DIAGONAL',
  authorities: 'AUTHORITIES',
};

function pad2(n: number): string {
  return n.toString().padStart(2, '0');
}

function buildId(face: PalcoBFaceId, seatNumber: number): string {
  return `PALCO-B-${FACE_PREFIX[face]}-B${pad2(seatNumber)}`;
}

function buildLabel(faceLabel: string, seatNumber: number): string {
  return `Palco B · ${faceLabel} · Butaca ${seatNumber}`;
}

export function generatePalcoBSeats(
  statuses: PalcoBSeatStatusMap = {}
): PalcoBSeat[] {
  const seats: PalcoBSeat[] = [];
  const allRaw: Omit<PalcoBSeat, 'status' | 'priceCategory'>[] = [];

  for (const key of Object.keys(PALCO_B_SEGMENTS)) {
    const seg = PALCO_B_SEGMENTS[key];
    const placed = placeSeatsOnSegment(seg);
    allRaw.push(...placed);
  }

  for (const raw of allRaw) {
    seats.push({
      ...raw,
      status: statuses[raw.id] ?? 'available',
      priceCategory: 'palco_b',
    });
  }

  if (DEBUG_GEOMETRY) {
    for (const s of seats) {
      console.log(`[DEBUG] ${s.id}: (${s.x.toFixed(1)}, ${s.y.toFixed(1)}) rot=${s.rotation}`);
    }
  }

  return seats;
}

export function validatePalcoBSeats(seats: PalcoBSeat[]): void {
  const errors: string[] = [];

  if (seats.length !== PALCO_B_TOTAL_SEATS) {
    errors.push(
      `Total Palco B: ${seats.length} butacas, se esperaban ${PALCO_B_TOTAL_SEATS}.`
    );
  }

  const byFace: Record<PalcoBFaceId, number> = {
    upperLeft: 0,
    upperRight: 0,
    lowerLeftDiagonal: 0,
    lowerRightDiagonal: 0,
    authorities: 0,
  };
  for (const s of seats) byFace[s.face] += 1;

  for (const face of PALCO_B_FACE_ORDER) {
    if (byFace[face] !== PALCO_B_FACE_COUNTS[face]) {
      errors.push(
        `Cara ${face}: ${byFace[face]} butacas, se esperaban ${PALCO_B_FACE_COUNTS[face]}.`
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
  const maxAllowedX = PALCO_B_VIEWBOX.width - margin;
  const maxAllowedY = PALCO_B_VIEWBOX.height - margin;
  if (minX < margin || maxX > maxAllowedX || minY < margin || maxY > maxAllowedY) {
    console.warn(
      `[PalcoBSeatMap] Bounds fuera de rango: X=${minX.toFixed(0)}..${maxX.toFixed(0)} Y=${minY.toFixed(0)}..${maxY.toFixed(0)} (esperado minX>${margin} maxX<${maxAllowedX} minY>${margin} maxY<${maxAllowedY})`
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
        `[PalcoBSeatMap] Possible seat overlap:\n  - ${overlaps.join('\n  - ')}`
      );
    }
  }

  if (errors.length > 0) {
    const msg = `[PalcoBSeatMap] Validación fallida:\n  - ${errors.join('\n  - ')}`;
    if (import.meta.env.PROD) {
      console.error(msg);
    } else {
      console.error(msg);
      throw new Error(msg);
    }
  }
}
