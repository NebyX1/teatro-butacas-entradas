import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import type { Show } from '../../data/shows';
import { CATEGORY_LABELS, getNextPerformance, getMinPriceFrom } from '../../data/shows';
import { formatCurrency } from '../../lib/reservationPricing';
import { ShowPoster } from './ShowPoster';

interface ShowCardProps {
  show: Show;
  index?: number;
}

function AvailabilityChip({ show }: { show: Show }) {
  const next = getNextPerformance(show);
  if (!next) {
    return <span className="text-[11px] text-slate-400">Próximamente</span>;
  }
  if (next.availabilityStatus === 'sold_out') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-400/30 bg-rose-500/10 px-2.5 py-0.5 text-[11px] font-medium text-rose-200">
        Agotado
      </span>
    );
  }
  if (next.availabilityStatus === 'soon') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-medium text-amber-200">
        Pronto en cartel
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-200">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
      Entradas disponibles
    </span>
  );
}

export function ShowCard({ show, index = 0 }: ShowCardProps) {
  const reduceMotion = useReducedMotion();
  const next = getNextPerformance(show);
  const priceFrom = getMinPriceFrom(show);
  const isPremiere = show.status === 'premiere';

  return (
    <motion.article
      layout
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduceMotion ? undefined : { opacity: 0, y: -12 }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.06, 0.4), ease: [0.22, 1, 0.36, 1] }}
      whileHover={reduceMotion ? undefined : { y: -6 }}
      className="group relative flex flex-col rounded-2xl border border-white/8 bg-white/[0.03] overflow-hidden"
      style={{ boxShadow: '0 20px 50px -30px rgba(0,0,0,0.7)' }}
    >
      <Link
        to={`/espectaculos/${show.slug}`}
        className="relative block overflow-hidden rounded-t-2xl"
        aria-label={`Ver ${show.title}`}
      >
        <motion.div
          whileHover={reduceMotion ? undefined : { scale: 1.04 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <ShowPoster show={show} variant="card" withOverlay={false} alt={`Poster de ${show.title}`} />
        </motion.div>
        {/* Overlay de legibilidad */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(180deg, transparent 30%, rgba(5,7,22,0.92) 100%)' }}
          aria-hidden="true"
        />
        {/* Chips superiores */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          <span
            className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide backdrop-blur-md"
            style={{
              backgroundColor: `${show.accentColor}22`,
              color: show.accentColor,
              border: `1px solid ${show.accentColor}44`,
            }}
          >
            {CATEGORY_LABELS[show.category]}
          </span>
          {isPremiere && (
            <span className="rounded-full border border-rose-400/40 bg-rose-500/20 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-rose-200 backdrop-blur-md">
              Estreno
            </span>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
        <div className="flex flex-col gap-1.5">
          <Link to={`/espectaculos/${show.slug}`} className="group/link">
            <h3 className="text-lg font-semibold leading-tight text-white transition-colors group-hover/link:text-accent">
              {show.title}
            </h3>
          </Link>
          <p className="text-xs text-slate-400">{show.subtitle}</p>
        </div>

        <p className="text-sm text-slate-300/80 line-clamp-2">{show.shortDescription}</p>

        <div className="mt-auto flex flex-col gap-3 pt-2">
          <div className="flex items-center justify-between gap-2">
            <AvailabilityChip show={show} />
            <span className="text-xs text-slate-400">
              Desde <span className="font-semibold text-slate-100">{formatCurrency(priceFrom)}</span>
            </span>
          </div>

          {next && (
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0 text-slate-500">
                <path d="M8 2v3M16 2v3M3 8h18M5 5h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="truncate">{next.label}</span>
            </div>
          )}

          <Link
            to={`/espectaculos/${show.slug}`}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white transition-all hover:border-white/20 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
          >
            Ver funciones
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Glow accent en hover */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ boxShadow: `inset 0 0 0 1px ${show.accentColor}33, 0 0 40px -10px ${show.accentColor}44` }}
        aria-hidden="true"
      />
    </motion.article>
  );
}