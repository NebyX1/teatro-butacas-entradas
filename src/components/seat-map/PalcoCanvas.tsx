import { memo } from 'react';
import { seatMapTheme } from './seatMapTheme';
import {
  PALCO_CANVAS_WIDTH,
  PALCO_CANVAS_HEIGHT,
  PALCO_INNER_PADDING,
} from './palcoShared';

/**
 * Artboard/canvas compartido para los tres palcos.
 *
 * Renderiza el fondo oscuro y los gradientes que dan contexto visual a
 * las butacas. Se dibuja SIEMPRE en el viewBox compartido
 * (PALCO_VIEWBOX = 2000×1500) y NUNCA dentro del grupo trasladado del
 * palco. Esto garantiza que el "panel oscuro" interior tenga exactamente
 * el mismo tamaño en Palco A, Palco B y Palco C, sin importar la
 * geometría local de cada sector.
 *
 * El rectángulo exterior cubre el viewBox completo, dejando un
 * `PALCO_INNER_PADDING` visible como "margen del canvas". Cada palco se
 * centra dentro del rectángulo interior (ver `palcoCenterOffset`).
 */
function PalcoCanvasComponent() {
  return (
    <g aria-hidden="true" data-palco-canvas>
      <defs>
        <linearGradient id="palco-canvas-bg-gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={seatMapTheme.background.from} />
          <stop offset="50%" stopColor={seatMapTheme.background.via} />
          <stop offset="100%" stopColor={seatMapTheme.background.to} />
        </linearGradient>
        <radialGradient id="palco-canvas-bg-spot" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="rgba(124, 152, 255, 0.16)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <radialGradient id="palco-canvas-center-glow" cx="50%" cy="45%" r="40%">
          <stop offset="0%" stopColor="rgba(99, 102, 241, 0.08)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>

      {/* Fondo completo del viewBox compartido */}
      <rect
        x={0}
        y={0}
        width={PALCO_CANVAS_WIDTH}
        height={PALCO_CANVAS_HEIGHT}
        fill="url(#palco-canvas-bg-gradient)"
        rx={24}
      />
      <rect
        x={0}
        y={0}
        width={PALCO_CANVAS_WIDTH}
        height={PALCO_CANVAS_HEIGHT}
        fill="url(#palco-canvas-bg-spot)"
        rx={24}
      />
      <rect
        x={0}
        y={0}
        width={PALCO_CANVAS_WIDTH}
        height={PALCO_CANVAS_HEIGHT}
        fill="url(#palco-canvas-center-glow)"
        rx={24}
      />

      {/* Marco interior sutil que delimita el área útil donde se va a
          dibujar el palco. Este rectángulo es el mismo en los tres
          palcos, de modo que el "marco visual" del canvas se siente
          consistente al cambiar de sector. */}
      <rect
        x={PALCO_INNER_PADDING / 2}
        y={PALCO_INNER_PADDING / 2}
        width={PALCO_CANVAS_WIDTH - PALCO_INNER_PADDING}
        height={PALCO_CANVAS_HEIGHT - PALCO_INNER_PADDING}
        fill="none"
        stroke="rgba(255, 255, 255, 0.08)"
        strokeWidth={2}
        strokeDasharray="6 10"
        rx={20}
      />
    </g>
  );
}

export const PalcoCanvas = memo(PalcoCanvasComponent);
