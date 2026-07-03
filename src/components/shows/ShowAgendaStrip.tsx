import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { useState } from 'react';
import type { AgendaItem } from '../../data/shows';
import { posterGradientWithAccent } from './posterGradient';

interface ShowAgendaStripProps {
  items: AgendaItem[];
}

/**
 * Lista compacta de próximas funciones para el home.
 */
export function ShowAgendaStrip({ items }: ShowAgendaStripProps) {
  const reduceMotion = useReducedMotion();

  if (items.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      {items.map((item, index) => {
        const { show, performance } = item;
        const soldOut = performance.availabilityStatus === 'sold_out';
        return (
          <motion.div
            key={performance.id}
            initial={reduceMotion ? false : { opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
            className="group flex items-center gap-4 rounded-2xl border border-white/8 bg-white/[0.03] p-4 transition-colors hover:border-white/15 hover:bg-white/[0.05]"
          >
            {/* Thumbnail 3:2 */}
            <AgendaThumbnail show={show} />
            <div className="flex flex-1 flex-col gap-0.5 min-w-0">
              <span className="text-sm font-semibold text-white truncate">{show.title}</span>
              <span className="text-xs text-slate-400 truncate">{performance.label}</span>
            </div>
            <div className="hidden sm:flex shrink-0">
              {soldOut ? (
                <span className="rounded-full border border-rose-400/30 bg-rose-500/10 px-2.5 py-0.5 text-[11px] font-medium text-rose-200">
                  Agotado
                </span>
              ) : performance.availabilityStatus === 'soon' ? (
                <span className="rounded-full border border-amber-400/30 bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-medium text-amber-200">
                  Pronto
                </span>
              ) : (
                <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-200">
                  Disponible
                </span>
              )}
            </div>
            <Link
              to={`/espectaculos/${show.slug}`}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
            >
              Ver
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}

function AgendaThumbnail({ show }: { show: import('../../data/shows').Show }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  return (
    <div
      className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg"
      style={{ background: posterGradientWithAccent(show) }}
    >
      {!error && (
        <img
          src={show.image}
          alt=""
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
            loaded ? 'opacity-90' : 'opacity-0'
          }`}
          aria-hidden="true"
        />
      )}
    </div>
  );
}