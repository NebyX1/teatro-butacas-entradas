import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import type { Show } from '../../data/shows';
import { CATEGORY_LABELS, getNextPerformance, getMinPriceFrom } from '../../data/shows';
import { formatCurrency } from '../../lib/reservationPricing';
import { ShowPoster } from './ShowPoster';

interface FeaturedShowCardProps {
  show: Show;
}

/**
 * Tarjeta grande inmersiva para la obra destacada en el home.
 */
export function FeaturedShowCard({ show }: FeaturedShowCardProps) {
  const reduceMotion = useReducedMotion();
  const next = getNextPerformance(show);
  const priceFrom = getMinPriceFrom(show);

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      className="relative grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-0 overflow-hidden rounded-3xl border border-white/10"
      style={{ boxShadow: `0 40px 80px -40px ${show.accentColor}44` }}
    >
      {/* Lado visual */}
      <div className="relative min-h-[280px] lg:min-h-[420px]">
        <ShowPoster show={show} variant="hero" withOverlay={false} alt={`Poster de ${show.title}`} className="absolute inset-0 h-full !aspect-auto rounded-none" eager />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(90deg, transparent 40%, rgba(5,7,22,0.6) 100%)' }}
          aria-hidden="true"
        />
        <div className="absolute top-5 left-5 flex flex-wrap gap-2">
          <span
            className="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide backdrop-blur-md"
            style={{
              backgroundColor: `${show.accentColor}22`,
              color: show.accentColor,
              border: `1px solid ${show.accentColor}55`,
            }}
          >
            Obra destacada
          </span>
          <span className="rounded-full border border-white/15 bg-black/30 px-3 py-1 text-xs font-medium text-slate-200 backdrop-blur-md">
            {CATEGORY_LABELS[show.category]}
          </span>
        </div>
      </div>

      {/* Lado contenido */}
      <div className="relative flex flex-col justify-center gap-5 p-6 sm:p-8 lg:p-10 bg-gradient-to-br from-[#0B102B]/95 to-[#050716]/95 backdrop-blur-xl">
        <div className="flex flex-col gap-3">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight text-white">
            {show.title}
          </h2>
          <p className="text-sm text-slate-400">{show.subtitle}</p>
        </div>

        <p className="text-sm sm:text-base text-slate-300/90 line-clamp-3">{show.shortDescription}</p>

        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-300">
          <span className="inline-flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="text-slate-500">
              <path d="M12 8v4l3 3M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {show.durationMinutes} min
          </span>
          <span className="inline-flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="text-slate-500">
              <path d="M12 2a10 10 0 100 20 10 10 0 000-20z" stroke="currentColor" strokeWidth="1.6" />
            </svg>
            {show.ageRating}
          </span>
          {next && (
            <span className="inline-flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="text-slate-500">
                <path d="M8 2v3M16 2v3M3 8h18M5 5h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {next.label}
            </span>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
          <Link
            to={`/espectaculos/${show.slug}`}
            className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-[#1F1300] transition-transform hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
            style={{ backgroundColor: show.accentColor, boxShadow: `0 10px 30px -10px ${show.accentColor}88` }}
          >
            Elegir función
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <div className="flex flex-col">
            <span className="text-xs text-slate-500">Desde</span>
            <span className="text-lg font-bold text-white">{formatCurrency(priceFrom)}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}