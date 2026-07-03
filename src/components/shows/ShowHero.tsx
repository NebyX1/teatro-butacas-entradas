import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { useState } from 'react';
import type { Show } from '../../data/shows';
import { CATEGORY_LABELS, getNextPerformance, getMinPriceFrom } from '../../data/shows';
import { formatCurrency } from '../../lib/reservationPricing';
import { ShowPoster } from './ShowPoster';

interface ShowHeroProps {
  show: Show;
}

/**
 * Hero cinematográfico del home con la obra destacada integrada.
 * Usa hero-theater-interior.jpg como fondo completo con overlays teatrales.
 */
export function ShowHero({ show }: ShowHeroProps) {
  const reduceMotion = useReducedMotion();
  const next = getNextPerformance(show);
  const priceFrom = getMinPriceFrom(show);
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [heroError, setHeroError] = useState(false);

  return (
    <section className="relative min-h-[82vh] flex items-center overflow-hidden">
      {/* Fondo: imagen hero-theater-interior + overlays teatrales */}
      <div className="absolute inset-0" aria-hidden="true">
        {/* Gradiente base (fallback siempre presente) */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(160deg, #050716 0%, #0B102B 40%, #17113A 70%, #050716 100%)' }}
        />
        {/* Imagen de fondo full-bleed */}
        {!heroError && (
          <motion.img
            src="/show-assets/hero-theater-interior.jpg"
            alt=""
            loading="eager"
            fetchPriority="high"
            decoding="async"
            onLoad={() => setHeroLoaded(true)}
            onError={() => setHeroError(true)}
            initial={reduceMotion ? false : { scale: 1.04 }}
            animate={reduceMotion ? undefined : { scale: 1 }}
            transition={{ duration: 8, ease: 'easeOut' }}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
              heroLoaded ? 'opacity-70' : 'opacity-0'
            }`}
            aria-hidden="true"
          />
        )}
        {/* Overlay oscuro de izquierda a derecha para legibilidad del texto */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(90deg, rgba(5,7,18,0.96) 0%, rgba(5,7,18,0.76) 40%, rgba(5,7,18,0.35) 100%)' }}
        />
        {/* Fade inferior para transición al contenido */}
        <div
          className="absolute inset-x-0 bottom-0 h-40"
          style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(5,7,18,0.9) 100%)' }}
        />
        {/* Spotlight radial con accent color */}
        <div
          className="absolute inset-0 opacity-30"
          style={{ background: `radial-gradient(ellipse 70% 50% at 50% 0%, ${show.accentColor}33 0%, transparent 60%)` }}
        />
        {/* Textura de telón sutil */}
        <div
          className="absolute inset-0 opacity-[0.04] mix-blend-overlay"
          style={{
            backgroundImage:
              'repeating-linear-gradient(90deg, transparent 0px, transparent 3px, rgba(255,255,255,0.3) 3px, rgba(255,255,255,0.3) 6px)',
          }}
        />
      </div>

      {/* Spotlight superior */}
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 50% 100% at 50% 0%, ${show.accentColor}18 0%, transparent 70%)`,
        }}
        animate={reduceMotion ? undefined : { opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-10 lg:gap-16 items-center">
          {/* Columna texto */}
          <div className="flex flex-col gap-6">
            <motion.span
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-slate-300 backdrop-blur-md"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              Reserva interactiva de butacas
            </motion.span>

            <motion.h1
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.05]"
            >
              Teatro Lavalleja
            </motion.h1>

            <motion.p
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="text-lg sm:text-xl text-slate-300/90 max-w-xl"
            >
              Elegí tu próxima función, seleccioná tu butaca en sala y recibí
              tus entradas digitales con QR.
            </motion.p>

            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-3 pt-2"
            >
              <Link
                to="/espectaculos"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3.5 text-sm font-semibold text-[#1F1300] transition-transform hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
                style={{ boxShadow: '0 12px 40px -12px rgba(248,193,74,0.6)' }}
              >
                Ver cartelera
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <Link
                to="/espectaculos?filter=premiere"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
              >
                Próximos estrenos
              </Link>
            </motion.div>

            {/* Badges de características */}
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-wrap gap-2 pt-2"
            >
              {['Reserva interactiva', 'Tickets digitales', 'Butacas numeradas'].map((badge) => (
                <span
                  key={badge}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300 backdrop-blur-md"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="text-accent">
                    <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {badge}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Columna: card del show destacado */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <Link
              to={`/espectaculos/${show.slug}`}
              className="group block rounded-3xl border border-white/10 overflow-hidden backdrop-blur-xl transition-transform hover:scale-[1.01]"
              style={{ backgroundColor: 'rgba(11,16,43,0.6)', boxShadow: `0 30px 70px -30px ${show.accentColor}55` }}
              aria-label={`Ver ${show.title}`}
            >
              <div className="relative">
                <ShowPoster show={show} variant="hero" withOverlay={false} alt={`Poster de ${show.title}`} eager />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 40%, rgba(5,7,22,0.95) 100%)' }} aria-hidden="true" />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span
                    className="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide backdrop-blur-md"
                    style={{ backgroundColor: `${show.accentColor}22`, color: show.accentColor, border: `1px solid ${show.accentColor}55` }}
                  >
                    {CATEGORY_LABELS[show.category]}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-3 p-5 sm:p-6">
                <h2 className="text-xl sm:text-2xl font-bold text-white group-hover:text-accent transition-colors">
                  {show.title}
                </h2>
                <p className="text-sm text-slate-400 line-clamp-2">{show.shortDescription}</p>
                <div className="flex items-center justify-between gap-3 pt-1">
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-500">Desde</span>
                    <span className="text-base font-bold text-white">{formatCurrency(priceFrom)}</span>
                  </div>
                  {next && (
                    <span className="text-xs text-slate-400 text-right max-w-[60%]">{next.label}</span>
                  )}
                </div>
                <span
                  className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-[#1F1300] transition-transform group-hover:scale-[1.02]"
                  style={{ backgroundColor: show.accentColor }}
                >
                  Elegir función
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}