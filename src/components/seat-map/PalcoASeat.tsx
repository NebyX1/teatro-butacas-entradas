import { memo } from 'react';
import { seatMapTheme } from './seatMapTheme';
import { SEAT_WIDTH, SEAT_HEIGHT, SEAT_RADIUS } from './palcoASeatGenerator';
import { PALCO_SEAT_FONT_SIZE } from './palcoShared';
import type { PalcoASeat } from './palcoASeatGenerator';
import type { SeatStatus } from './sectorTypes';

interface PalcoASeatNodeProps {
  seat: PalcoASeat;
  onToggle: (seat: PalcoASeat) => void;
}

function fillFor(status: SeatStatus): string {
  if (status === 'selected') return seatMapTheme.status.selected;
  if (status === 'sold' || status === 'reserved') return seatMapTheme.status.sold;
  if (status === 'blocked') return seatMapTheme.status.blocked;
  return seatMapTheme.status.available;
}

function strokeFor(status: SeatStatus): string {
  if (status === 'selected') return seatMapTheme.status.selectedStroke;
  if (status === 'sold' || status === 'reserved') return seatMapTheme.status.soldStroke;
  if (status === 'blocked') return seatMapTheme.status.blockedStroke;
  return seatMapTheme.status.availableStroke;
}

function textColorFor(status: SeatStatus): string {
  if (status === 'selected') return '#3A1F00';
  if (status === 'sold' || status === 'reserved') return '#1E293B';
  if (status === 'blocked') return '#3F0A1A';
  return '#053A22';
}

function PalcoASeatComponent({ seat, onToggle }: PalcoASeatNodeProps) {
  const isInteractive = seat.status === 'available' || seat.status === 'selected';
  const isSelected = seat.status === 'selected';
  const isDisabled = !isInteractive;

  const fill = fillFor(seat.status);
  const stroke = strokeFor(seat.status);
  const textFill = textColorFor(seat.status);
  const opacity = isDisabled ? 0.7 : 1;

  const backH = 7;
  const backY = -SEAT_HEIGHT / 2;
  const seatBodyY = backY + 8;
  const seatBodyH = SEAT_HEIGHT - 8;

  return (
    <g
      transform={`translate(${seat.x}, ${seat.y}) rotate(${seat.rotation})`}
      style={{ cursor: isInteractive ? 'pointer' : 'not-allowed' }}
      className="palco-a-seat-group"
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

      <g opacity={opacity} style={{ transition: 'opacity 160ms ease' }}>
        <rect
          x={-SEAT_WIDTH / 2 + 2}
          y={backY}
          width={SEAT_WIDTH - 4}
          height={backH}
          rx={3}
          ry={3}
          fill={fill}
          stroke={stroke}
          strokeWidth={0.8}
          opacity={0.85}
        />
        <rect
          className="palco-a-seat-rect"
          x={-SEAT_WIDTH / 2}
          y={seatBodyY}
          width={SEAT_WIDTH}
          height={seatBodyH}
          rx={SEAT_RADIUS}
          ry={SEAT_RADIUS}
          fill={fill}
          stroke={stroke}
          strokeWidth={1}
        />
      </g>

      <text
        x={0}
        y={seatBodyY + seatBodyH / 2}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={PALCO_SEAT_FONT_SIZE}
        fontWeight={700}
        fill={textFill}
        pointerEvents="none"
        style={{ userSelect: 'none' }}
      >
        {seat.seatNumber}
      </text>

      {isSelected && (
        <g pointerEvents="none">
          <circle
            cx={SEAT_WIDTH / 2 - 2}
            cy={-SEAT_HEIGHT / 2 + 2}
            r={4}
            fill={seatMapTheme.status.selected}
            stroke="#FFFFFF"
            strokeWidth={1.4}
          />
          <path
            d={`M ${SEAT_WIDTH / 2 - 4} ${-SEAT_HEIGHT / 2 + 2} L ${SEAT_WIDTH / 2 - 2.5} ${-SEAT_HEIGHT / 2 + 3.4} L ${SEAT_WIDTH / 2 - 1} ${-SEAT_HEIGHT / 2 + 0.8}`}
            stroke="#3A1F00"
            strokeWidth={1.2}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </g>
      )}

      {isDisabled && (
        <g pointerEvents="none" opacity={0.55}>
          <line
            x1={-SEAT_WIDTH / 2 + 6}
            y1={seatBodyY + 4}
            x2={SEAT_WIDTH / 2 - 6}
            y2={seatBodyY + seatBodyH - 4}
            stroke="#0F172A"
            strokeWidth={1}
            strokeLinecap="round"
          />
        </g>
      )}
    </g>
  );
}

export const PalcoASeatNode = memo(PalcoASeatComponent);
