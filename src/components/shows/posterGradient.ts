/**
 * Utilidades visuales para espectáculos.
 *
 * Como no hay assets de imágenes reales, los posters se generan con
 * gradientes CSS basados en el `accentColor` de cada show. Cada show
 * tiene un `image` identificador que mapea a un gradiente cinematográfico.
 * TODO: reemplazar con imágenes reales cuando existan assets del teatro.
 */
import type { Show } from '../../data/shows';

interface GradientStop {
  color: string;
  position: number;
}

interface GradientDef {
  stops: GradientStop[];
  angle: number;
}

const GRADIENTS: Record<string, GradientDef> = {
  'gradient-bernarda': {
    angle: 145,
    stops: [
      { color: '#1a1208', position: 0 },
      { color: '#3d2e0a', position: 40 },
      { color: '#7a5e16', position: 75 },
      { color: '#C9A227', position: 100 },
    ],
  },
  'gradient-ensayo': {
    angle: 160,
    stops: [
      { color: '#0a0a1f', position: 0 },
      { color: '#1a1a4d', position: 45 },
      { color: '#3b2f8f', position: 80 },
      { color: '#4F46E5', position: 100 },
    ],
  },
  'gradient-camara': {
    angle: 135,
    stops: [
      { color: '#04141a', position: 0 },
      { color: '#0a3d3a', position: 45 },
      { color: '#1a6b5e', position: 80 },
      { color: '#62E6C5', position: 100 },
    ],
  },
  'gradient-hamlet': {
    angle: 150,
    stops: [
      { color: '#0a0e2a', position: 0 },
      { color: '#1a2050', position: 40 },
      { color: '#4a5a9f', position: 75 },
      { color: '#A7B2FF', position: 100 },
    ],
  },
  'gradient-candombe': {
    angle: 140,
    stops: [
      { color: '#1a0410', position: 0 },
      { color: '#4d0a2a', position: 45 },
      { color: '#8f1a4f', position: 80 },
      { color: '#F472B6', position: 100 },
    ],
  },
  'gradient-sombras': {
    angle: 145,
    stops: [
      { color: '#04101a', position: 0 },
      { color: '#0a2a4d', position: 45 },
      { color: '#1a5a8f', position: 80 },
      { color: '#38BDF8', position: 100 },
    ],
  },
  'gradient-danza': {
    angle: 155,
    stops: [
      { color: '#0a041a', position: 0 },
      { color: '#2a0a4d', position: 45 },
      { color: '#5a1a8f', position: 80 },
      { color: '#8B5CF6', position: 100 },
    ],
  },
  'gradient-lirica': {
    angle: 150,
    stops: [
      { color: '#1a1404', position: 0 },
      { color: '#4d3a0a', position: 45 },
      { color: '#8f6f1a', position: 80 },
      { color: '#F4B740', position: 100 },
    ],
  },
};

function getGradientDef(image: string): GradientDef {
  return GRADIENTS[image] ?? GRADIENTS['gradient-ensayo'];
}

export function posterGradient(image: string): string {
  const def = getGradientDef(image);
  const stops = def.stops.map((s) => `${s.color} ${s.position}%`).join(', ');
  return `linear-gradient(${def.angle}deg, ${stops})`;
}

export function posterGradientWithAccent(show: Show): string {
  const base = posterGradient(show.image);
  const accent = show.accentColor;
  return `${base}, radial-gradient(ellipse 60% 80% at 70% 20%, ${accent}33 0%, transparent 60%)`;
}

export function heroGradient(show: Show): string {
  const def = getGradientDef(show.heroImage);
  const stops = def.stops.map((s) => `${s.color} ${s.position}%`).join(', ');
  return `linear-gradient(${def.angle}deg, ${stops})`;
}

/**
 * Overlay sutil para legibilidad de texto sobre gradientes.
 */
export function posterOverlay(): string {
  return 'linear-gradient(180deg, transparent 40%, rgba(5,7,22,0.85) 100%)';
}