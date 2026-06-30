import { PALCO_A_GEOMETRY } from './palcoASeatGenerator';
import { seatMapTheme } from './seatMapTheme';

export function PalcoAFaceLabels() {
  const { labels } = PALCO_A_GEOMETRY;

  return (
    <g aria-label="Etiquetas de caras del Palco A">
      <text
        x={labels.upperLeft.x}
        y={labels.upperLeft.y}
        textAnchor="middle"
        fontSize={11}
        fontWeight={700}
        letterSpacing={3}
        fill={seatMapTheme.sideLabel}
        opacity={0.62}
        style={{ userSelect: 'none' }}
      >
        SUPERIOR
        <tspan x={labels.upperLeft.x} dy={13}>
          IZQUIERDA
        </tspan>
      </text>

      <text
        x={labels.upperRight.x}
        y={labels.upperRight.y}
        textAnchor="middle"
        fontSize={11}
        fontWeight={700}
        letterSpacing={3}
        fill={seatMapTheme.sideLabel}
        opacity={0.62}
        style={{ userSelect: 'none' }}
      >
        SUPERIOR
        <tspan x={labels.upperRight.x} dy={13}>
          DERECHA
        </tspan>
      </text>

      <text
        x={labels.lowerLeftDiagonal.x}
        y={labels.lowerLeftDiagonal.y}
        textAnchor="middle"
        fontSize={10}
        fontWeight={700}
        letterSpacing={2}
        fill={seatMapTheme.sideLabel}
        opacity={0.58}
        style={{ userSelect: 'none' }}
      >
        DIAGONAL IZQ.
      </text>

      <text
        x={labels.lowerRightDiagonal.x}
        y={labels.lowerRightDiagonal.y}
        textAnchor="middle"
        fontSize={10}
        fontWeight={700}
        letterSpacing={2}
        fill={seatMapTheme.sideLabel}
        opacity={0.58}
        style={{ userSelect: 'none' }}
      >
        DIAGONAL DER.
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
