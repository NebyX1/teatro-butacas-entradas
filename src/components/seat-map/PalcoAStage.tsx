import { PALCO_A_GEOMETRY } from './palcoASeatGenerator';
import { seatMapTheme } from './seatMapTheme';

const RIBBON_WIDTH = 76;

const RIBBON_PATHS = [
  { d: 'M 250 105 L 250 575', label: 'Columna izquierda' },
  { d: 'M 315 605 L 445 820', label: 'Diagonal izquierda' },
  { d: 'M 495 865 L 730 865', label: 'Inferior izquierda' },
  { d: 'M 770 865 L 1005 865', label: 'Inferior derecha' },
  { d: 'M 1055 820 L 1185 605', label: 'Diagonal derecha' },
  { d: 'M 1250 575 L 1250 105', label: 'Columna derecha' },
];

const OUTLINE_PATH =
  'M 250 105 L 250 575 L 315 605 L 445 820 L 495 865 L 730 865 M 770 865 L 1005 865 L 1055 820 L 1185 605 L 1250 575 L 1250 105';

export function PalcoAStage() {
  const { width, height } = PALCO_A_GEOMETRY.viewBox;
  const titles = PALCO_A_GEOMETRY.titles;

  return (
    <g aria-label="Estructura del Palco A">
      <defs>
        <linearGradient id="palco-a-bg-gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={seatMapTheme.background.from} />
          <stop offset="50%" stopColor={seatMapTheme.background.via} />
          <stop offset="100%" stopColor={seatMapTheme.background.to} />
        </linearGradient>
        <radialGradient id="palco-a-bg-spot" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="rgba(124, 152, 255, 0.18)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <radialGradient id="palco-a-center-glow" cx="50%" cy="45%" r="35%">
          <stop offset="0%" stopColor="rgba(99, 102, 241, 0.08)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>

      <rect
        x={0}
        y={0}
        width={width}
        height={height}
        fill="url(#palco-a-bg-gradient)"
        rx={24}
      />
      <rect
        x={0}
        y={0}
        width={width}
        height={height}
        fill="url(#palco-a-bg-spot)"
        rx={24}
      />
      <rect
        x={0}
        y={0}
        width={width}
        height={height}
        fill="url(#palco-a-center-glow)"
        rx={24}
      />

      <path
        d="M 250 105 L 250 575 L 315 605 L 445 820 L 495 865 L 730 865 M 770 865 L 1005 865 L 1055 820 L 1185 605 L 1250 575 L 1250 105"
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
