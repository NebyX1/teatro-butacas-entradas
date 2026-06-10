import { PLATEA_VIEWBOX } from './plateaSeatGenerator';
import { seatMapTheme } from './seatMapTheme';

export function PlateaStage() {
  const { width, height } = PLATEA_VIEWBOX;
  const stageX = 160;
  const stageY = 50;
  const stageW = width - stageX * 2;
  const stageH = 100;

  return (
    <g aria-label="Escenario">
      <defs>
        <linearGradient id="platea-stage-gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={seatMapTheme.stage.from} />
          <stop offset="100%" stopColor={seatMapTheme.stage.to} />
        </linearGradient>
        <radialGradient id="platea-stage-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={seatMapTheme.stage.glow} />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <linearGradient id="platea-bg-gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={seatMapTheme.background.from} />
          <stop offset="50%" stopColor={seatMapTheme.background.via} />
          <stop offset="100%" stopColor={seatMapTheme.background.to} />
        </linearGradient>
        <radialGradient id="platea-bg-spot" cx="50%" cy="0%" r="60%">
          <stop offset="0%" stopColor="rgba(124, 152, 255, 0.22)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>

      <rect
        x={0}
        y={0}
        width={width}
        height={height}
        fill="url(#platea-bg-gradient)"
        rx={24}
      />
      <rect
        x={0}
        y={0}
        width={width}
        height={height}
        fill="url(#platea-bg-spot)"
        rx={24}
      />

      {/* Glow detrás del escenario */}
      <ellipse
        cx={width / 2}
        cy={stageY + stageH / 2}
        rx={stageW * 0.55}
        ry={stageH * 0.9}
        fill="url(#platea-stage-glow)"
      />

      {/* Escenario */}
      <rect
        x={stageX}
        y={stageY}
        width={stageW}
        height={stageH}
        rx={20}
        fill="url(#platea-stage-gradient)"
        stroke={seatMapTheme.stage.stroke}
        strokeWidth={1.5}
        style={{ filter: 'drop-shadow(0 6px 20px rgba(0,0,0,0.45))' }}
      />
      <text
        x={width / 2}
        y={stageY + stageH / 2 + 8}
        textAnchor="middle"
        fontSize={26}
        fontWeight={700}
        letterSpacing={10}
        fill={seatMapTheme.stage.stroke}
        style={{ userSelect: 'none' }}
      >
        ESCENARIO
      </text>
    </g>
  );
}
