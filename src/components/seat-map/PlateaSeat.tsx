import { memo } from 'react';
import type { PlateaSeat } from './types';
import { seatMapTheme } from './seatMapTheme';

interface PlateaSeatNodeProps {
  seat: PlateaSeat;
  onToggle: (seat: PlateaSeat) => void;
}

const SEAT_W = 30;
const SEAT_H = 26;

function fillFor(status: PlateaSeat['status']): string {
  if (status === 'selected') return seatMapTheme.status.selected;
  if (status === 'sold' || status === 'reserved') return seatMapTheme.status.sold;
  if (status === 'blocked') return seatMapTheme.status.blocked;
  return seatMapTheme.status.available;
}

function strokeFor(status: PlateaSeat['status']): string {
  if (status === 'selected') return seatMapTheme.status.selectedStroke;
  if (status === 'sold' || status === 'reserved') return seatMapTheme.status.soldStroke;
  if (status === 'blocked') return seatMapTheme.status.blockedStroke;
  return seatMapTheme.status.availableStroke;
}

function textColorFor(status: PlateaSeat['status']): string {
  if (status === 'selected') return '#3A1F00';
  if (status === 'sold' || status === 'reserved') return '#1E293B';
  if (status === 'blocked') return '#3F0A1A';
  return '#053A22';
}

function PlateaSeatComponent({ seat, onToggle }: PlateaSeatNodeProps) {
  const isInteractive = seat.status === 'available' || seat.status === 'selected';
  const isSelected = seat.status === 'selected';
  const isDisabled = !isInteractive;

  const fill = fillFor(seat.status);
  const stroke = strokeFor(seat.status);
  const textFill = textColorFor(seat.status);
  const opacity = isDisabled ? 0.7 : 1;

  // Forma de butaca: respaldo arriba (rect redondeado fino) + asiento (rect redondeado más grueso)
  const backY = 0;
  const backH = 6;
  const seatY = 7;
  const seatH = SEAT_H - 7;

  return (
    <g
      transform={`translate(${seat.x}, ${seat.y})`}
      style={{
        cursor: isInteractive ? 'pointer' : 'not-allowed',
      }}
      className="platea-seat-group"
      role="button"
      tabIndex={isInteractive ? 0 : -1}
      aria-label={seat.label}
      aria-pressed={isSelected}
      aria-disabled={isDisabled}
      onClick={() => isInteractive && onToggle(seat)}
      onKeyDown={(e) => {
        if (!isInteractive) return;
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onToggle(seat);
        }
      }}
    >
      <title>{seat.label}</title>

      <g
        opacity={opacity}
        style={{
          transition: 'opacity 160ms ease',
        }}
      >
        {/* Respaldo */}
        <rect
          x={2}
          y={backY}
          width={SEAT_W - 4}
          height={backH}
          rx={3}
          ry={3}
          fill={fill}
          stroke={stroke}
          strokeWidth={0.8}
          opacity={0.85}
        />
        {/* Asiento */}
        <rect
          className="platea-seat-rect"
          x={0}
          y={seatY}
          width={SEAT_W}
          height={seatH}
          rx={5}
          ry={5}
          fill={fill}
          stroke={stroke}
          strokeWidth={1}
        />
      </g>

      {/* Número */}
      <text
        x={SEAT_W / 2}
        y={seatY + seatH / 2 + 4}
        textAnchor="middle"
        fontSize={10}
        fontWeight={700}
        fill={textFill}
        pointerEvents="none"
        style={{ userSelect: 'none' }}
      >
        {seat.seatNumber}
      </text>

      {/* Indicador de selección: punto arriba a la derecha */}
      {isSelected && (
        <g pointerEvents="none">
          <circle
            cx={SEAT_W - 2}
            cy={2}
            r={4}
            fill={seatMapTheme.status.selected}
            stroke="#FFFFFF"
            strokeWidth={1.4}
          />
          <path
            d={`M ${SEAT_W - 4} 2 L ${SEAT_W - 2.5} 3.4 L ${SEAT_W - 1} 0.8`}
            stroke="#3A1F00"
            strokeWidth={1.2}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </g>
      )}

      {/* Símbolo "no disponible" para sold/reserved/blocked */}
      {isDisabled && (
        <g pointerEvents="none" opacity={0.55}>
          <line
            x1={6}
            y1={seatY + 4}
            x2={SEAT_W - 6}
            y2={seatY + seatH - 4}
            stroke="#0F172A"
            strokeWidth={1}
            strokeLinecap="round"
          />
        </g>
      )}
    </g>
  );
}

export const PlateaSeatNode = memo(PlateaSeatComponent);
