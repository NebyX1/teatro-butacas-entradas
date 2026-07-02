import { PALCO_B_GEOMETRY } from './palcoBSeatGenerator';

const RIBBON_WIDTH = 76;

const RIBBON_PATHS = [
  { d: 'M 260 105 L 260 620', label: 'Columna izquierda' },
  { d: 'M 255 675 L 620 965', label: 'Diagonal izquierda' },
  { d: 'M 800 1075 L 1020 1075', label: 'Autoridades' },
  { d: 'M 1200 965 L 1565 675', label: 'Diagonal derecha' },
  { d: 'M 1560 620 L 1560 105', label: 'Columna derecha' },
];

const OUTLINE_PATH =
  'M 260 105 L 260 620 L 255 675 L 620 965 M 800 1075 L 1020 1075 M 1200 965 L 1565 675 L 1560 620 L 1560 105';

/**
 * Geometría estructural del Palco B.
 *
 * El fondo del canvas y los gradientes los provee el componente
 * compartido `PalcoCanvas`, que se dibuja una sola vez en el viewBox
 * compartido y por fuera del grupo trasladado del palco. Acá solo
 * queda la geometría local del Palco B (halo, cintas, contorno,
 * puertas y títulos) en sus coordenadas originales.
 */
export function PalcoBStage() {
  const titles = PALCO_B_GEOMETRY.titles;
  const gates = {
    left: PALCO_B_GEOMETRY.gateLeft,
    right: PALCO_B_GEOMETRY.gateRight,
  };

  return (
    <g aria-label="Estructura del Palco B">
      <path
        d={OUTLINE_PATH}
        fill="none"
        stroke="rgba(255,255,255,0.05)"
        strokeWidth={112}
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
        PALCO B
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
        51 BUTACAS · AUTORIDADES
      </text>
    </g>
  );
}
