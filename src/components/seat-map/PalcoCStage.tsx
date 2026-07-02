import { PALCO_C_GEOMETRY } from './palcoCSeatGenerator';

const RIBBON_WIDTH = 78;

const RIBBON_PATHS = [
  { d: 'M 220 105 L 220 640', label: 'Columna izquierda' },
  { d: 'M 250 705 L 650 1030', label: 'Diagonal izquierda' },
  { d: 'M 735 1150 L 955 1150', label: 'Inferior izquierda' },
  { d: 'M 1045 1150 L 1265 1150', label: 'Inferior derecha' },
  { d: 'M 1350 1030 L 1750 705', label: 'Diagonal derecha' },
  { d: 'M 1780 640 L 1780 105', label: 'Columna derecha' },
];

const OUTLINE_PATH =
  'M 220 105 L 220 640 L 250 705 L 650 1030 M 735 1150 L 955 1150 M 1045 1150 L 1265 1150 M 1350 1030 L 1750 705 L 1780 640 L 1780 105';

/**
 * Geometría estructural del Palco C.
 *
 * El fondo del canvas y los gradientes los provee el componente
 * compartido `PalcoCanvas`, que se dibuja una sola vez en el viewBox
 * compartido y por fuera del grupo trasladado del palco. Acá solo
 * queda la geometría local del Palco C (halo, cintas, contorno,
 * puertas y títulos) en sus coordenadas originales.
 */
export function PalcoCStage() {
  const titles = PALCO_C_GEOMETRY.titles;
  const gates = {
    left: PALCO_C_GEOMETRY.gateLeft,
    right: PALCO_C_GEOMETRY.gateRight,
  };

  return (
    <g aria-label="Estructura del Palco C">
      <path
        d={OUTLINE_PATH}
        fill="none"
        stroke="rgba(255,255,255,0.05)"
        strokeWidth={116}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {RIBBON_PATHS.map((rp) => (
        <path
          key={`ribbon-${rp.label}`}
          d={rp.d}
          fill="none"
          stroke="rgba(79, 70, 229, 0.30)"
          strokeWidth={RIBBON_WIDTH}
          strokeLinecap="round"
        />
      ))}

      {RIBBON_PATHS.map((rp) => (
        <path
          key={`border-${rp.label}`}
          d={rp.d}
          fill="none"
          stroke="rgba(129, 140, 248, 0.45)"
          strokeWidth={2}
          strokeLinecap="round"
        />
      ))}

      <path
        d={OUTLINE_PATH}
        fill="none"
        stroke="rgba(219, 226, 255, 0.14)"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="7 12"
      />

      <text
        x={gates.left.x}
        y={gates.left.y}
        textAnchor="middle"
        fontSize={14}
        fontWeight={700}
        letterSpacing={6}
        fill="rgba(148, 163, 184, 0.70)"
        style={{ userSelect: 'none' }}
      >
        PUERTA IZQ.
      </text>
      <text
        x={gates.right.x}
        y={gates.right.y}
        textAnchor="middle"
        fontSize={14}
        fontWeight={700}
        letterSpacing={6}
        fill="rgba(148, 163, 184, 0.70)"
        style={{ userSelect: 'none' }}
      >
        PUERTA DER.
      </text>

      <text
        x={titles.title.x}
        y={titles.title.y}
        textAnchor="middle"
        fontSize={56}
        fontWeight={700}
        letterSpacing={16}
        fill="rgba(219, 226, 255, 0.80)"
        style={{ userSelect: 'none' }}
      >
        PALCO C
      </text>
      <text
        x={titles.subtitle.x}
        y={titles.subtitle.y}
        textAnchor="middle"
        fontSize={13}
        fontWeight={600}
        letterSpacing={6}
        fill="rgba(148, 163, 184, 0.75)"
        style={{ userSelect: 'none' }}
      >
        50 BUTACAS
      </text>
    </g>
  );
}
