import { PALCO_A_GEOMETRY } from './palcoASeatGenerator';

const RIBBON_WIDTH = 80;

const RIBBON_PATHS = [
  { d: 'M 180 90 L 180 550', label: 'Columna izquierda' },
  { d: 'M 180 540 L 590 780', label: 'Diagonal izquierda' },
  { d: 'M 570 780 L 1084 780', label: 'Inferior' },
  { d: 'M 1064 780 L 1520 540', label: 'Diagonal derecha' },
  { d: 'M 1520 90 L 1520 550', label: 'Columna derecha' },
];

const OUTLINE_PATH =
  'M 180 90 L 180 550 L 590 780 L 1084 780 L 1520 540 L 1520 90';

/**
 * Geometría estructural del Palco A.
 *
 * El fondo del canvas y los gradientes los provee el componente
 * compartido `PalcoCanvas`, que se dibuja una sola vez en el viewBox
 * compartido y por fuera del grupo trasladado del palco. Acá solo
 * queda la geometría local del Palco A (halo, cintas, contorno y
 * títulos) en sus coordenadas originales.
 */
export function PalcoAStage() {
  const titles = PALCO_A_GEOMETRY.titles;

  return (
    <g aria-label="Estructura del Palco A">
      <path
        d={OUTLINE_PATH}
        fill="none"
        stroke="rgba(255,255,255,0.05)"
        strokeWidth={108}
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
          strokeLinejoin="round"
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
          strokeLinejoin="round"
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
        x={titles.title.x}
        y={titles.title.y}
        textAnchor="middle"
        fontSize={56}
        fontWeight={700}
        letterSpacing={16}
        fill="rgba(219, 226, 255, 0.80)"
        style={{ userSelect: 'none' }}
      >
        PALCO A
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
        51 BUTACAS · 5 CARAS
      </text>
    </g>
  );
}
