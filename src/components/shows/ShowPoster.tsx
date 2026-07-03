import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import type { Show } from '../../data/shows';
import { posterGradientWithAccent, posterOverlay } from './posterGradient';

interface ShowPosterProps {
  show: Show;
  className?: string;
  /** Si true, aplica overlay más fuerte para legibilidad de texto encima. */
  withOverlay?: boolean;
  /** Texto alt descriptivo para accesibilidad. */
  alt?: string;
  /** Modo: 'card' (4:5) o 'hero' (16:9). */
  variant?: 'card' | 'hero';
  /** Si true, carga la imagen con prioridad (eager). Default: lazy. */
  eager?: boolean;
  /** Aspect ratio override (cuando se usa dentro de un contenedor absoluto). */
  aspectOverride?: string;
}

/**
 * Poster visual de un espectáculo.
 *
 * Usa imágenes locales de /show-assets/ con fallback a gradiente CSS
 * si la imagen falla al cargar. El gradiente se mantiene como fondo
 * para que nunca se vea un ícono de imagen rota.
 */
export function ShowPoster({
  show,
  className = '',
  withOverlay = true,
  alt,
  variant = 'card',
  eager = false,
  aspectOverride,
}: ShowPosterProps) {
  const reduceMotion = useReducedMotion();
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const aspect = aspectOverride ?? (variant === 'hero' ? 'aspect-[16/9]' : 'aspect-[4/5]');
  const showImage = !imgError && show.image;

  return (
    <div
      role="img"
      aria-label={alt ?? `Poster de ${show.title}`}
      className={`relative w-full ${aspect} overflow-hidden rounded-2xl ${className}`}
      style={{ background: posterGradientWithAccent(show) }}
    >
      {/* Imagen real (capa superior si carga OK) */}
      {showImage && (
        <img
          src={show.image}
          alt={alt ?? `Imagen de ${show.title}`}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={() => setImgLoaded(true)}
          onError={() => setImgError(true)}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
            imgLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          aria-hidden={alt ? undefined : true}
        />
      )}

      {/* Textura sutil de "telón" — solo visible si la imagen no cargó */}
      {!imgLoaded && (
        <div
          className="absolute inset-0 opacity-30 mix-blend-overlay"
          style={{
            backgroundImage:
              'repeating-linear-gradient(90deg, transparent 0px, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)',
          }}
          aria-hidden="true"
        />
      )}

      {/* Spotlight radial sutil */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 50% 60% at 50% 0%, ${show.accentColor}22 0%, transparent 70%)`,
        }}
        animate={reduceMotion ? undefined : { opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        aria-hidden="true"
      />

      {/* Overlay para legibilidad */}
      {withOverlay && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: posterOverlay() }}
          aria-hidden="true"
        />
      )}
    </div>
  );
}