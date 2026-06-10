import { PLATEA_ROWS } from './plateaSeatData';
import { PLATEA_GEOMETRY } from './plateaSeatGenerator';
import { seatMapTheme } from './seatMapTheme';

export function PlateaRowLabels() {
  const g = PLATEA_GEOMETRY;
  return (
    <g aria-label="Etiquetas de fila">
      {Array.from({ length: PLATEA_ROWS }).map((_, i) => {
        const row = i + 1;
        const y = g.startY + i * g.rowGap + g.seatHeight / 2 + 4;
        return (
          <g key={row}>
            <circle
              cx={g.centerX}
              cy={y - 4}
              r={11}
              fill="rgba(255,255,255,0.06)"
              stroke="rgba(255,255,255,0.10)"
            />
            <text
              x={g.centerX}
              y={y}
              textAnchor="middle"
              fontSize={11}
              fontWeight={600}
              fill={seatMapTheme.rowLabel}
              style={{ userSelect: 'none' }}
            >
              {row}
            </text>
          </g>
        );
      })}
    </g>
  );
}

export function PlateaSideLabels() {
  const g = PLATEA_GEOMETRY;
  return (
    <g aria-label="Etiquetas de bloque">
      <text
        x={g.centerX - 240}
        y={g.startY - 18}
        textAnchor="middle"
        fontSize={12}
        fontWeight={700}
        letterSpacing={4}
        fill={seatMapTheme.sideLabel}
        opacity={0.7}
        style={{ userSelect: 'none' }}
      >
        PLATEA IZQUIERDA
      </text>
      <text
        x={g.centerX + 240}
        y={g.startY - 18}
        textAnchor="middle"
        fontSize={12}
        fontWeight={700}
        letterSpacing={4}
        fill={seatMapTheme.sideLabel}
        opacity={0.7}
        style={{ userSelect: 'none' }}
      >
        PLATEA DERECHA
      </text>
    </g>
  );
}
