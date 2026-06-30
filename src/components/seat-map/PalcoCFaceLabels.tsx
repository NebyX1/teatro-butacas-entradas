import { PALCO_C_GEOMETRY } from './palcoCSeatGenerator';
import { seatMapTheme } from './seatMapTheme';

export function PalcoCFaceLabels() {
  const { labels } = PALCO_C_GEOMETRY;

  return (
    <g aria-label="Etiquetas de caras del Palco C">
      <text
        x={labels.leftVertical.x}
        y={labels.leftVertical.y}
        textAnchor="middle"
        fontSize={11}
        fontWeight={700}
        letterSpacing={3}
        fill={seatMapTheme.sideLabel}
        opacity={0.62}
        style={{ userSelect: 'none' }}
      >
        SUPERIOR
        <tspan x={labels.leftVertical.x} dy={13}>
          IZQUIERDA
        </tspan>
      </text>

      <text
        x={labels.rightVertical.x}
        y={labels.rightVertical.y}
        textAnchor="middle"
        fontSize={11}
        fontWeight={700}
        letterSpacing={3}
        fill={seatMapTheme.sideLabel}
        opacity={0.62}
        style={{ userSelect: 'none' }}
      >
        SUPERIOR
        <tspan x={labels.rightVertical.x} dy={13}>
          DERECHA
        </tspan>
      </text>

      <text
        x={labels.leftDiagonal.x}
        y={labels.leftDiagonal.y}
        textAnchor="middle"
        fontSize={10}
        fontWeight={700}
        letterSpacing={2}
        fill={seatMapTheme.sideLabel}
        opacity={0.58}
        style={{ userSelect: 'none' }}
      >
        DIAGONAL INF.
      </text>

      <text
        x={labels.rightDiagonal.x}
        y={labels.rightDiagonal.y}
        textAnchor="middle"
        fontSize={10}
        fontWeight={700}
        letterSpacing={2}
        fill={seatMapTheme.sideLabel}
        opacity={0.58}
        style={{ userSelect: 'none' }}
      >
        DIAGONAL INF.
      </text>

      <text
        x={labels.bottom.x}
        y={labels.bottom.y}
        textAnchor="middle"
        fontSize={10}
        fontWeight={700}
        letterSpacing={4}
        fill={seatMapTheme.sideLabel}
        opacity={0.62}
        style={{ userSelect: 'none' }}
      >
        INFERIOR
      </text>
    </g>
  );
}