import { Link, useParams, Navigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import {
  getShowBySlug,
  SHOWS,
  CATEGORY_LABELS,
  STATUS_LABELS,
  getMinPriceFrom,
  getNextPerformance,
} from '../data/shows';
import { formatCurrency } from '../lib/reservationPricing';
import { ShowPoster } from '../components/shows/ShowPoster';
import { PerformanceSelector } from '../components/shows/PerformanceSelector';
import { ShowCard } from '../components/shows/ShowCard';

export function ShowDetailPage() {
  const reduceMotion = useReducedMotion();
  const { showSlug } = useParams<{ showSlug: string }>();
  const show = showSlug ? getShowBySlug(showSlug) : undefined;

  if (!show) {
    return <Navigate to="/espectaculos" replace />;
  }

  const priceFrom = getMinPriceFrom(show);
  const next = getNextPerformance(show);
  const related = SHOWS.filter(
    (s) => s.id !== show.id && (s.category === show.category || s.status === show.status)
  ).slice(0, 3);

  return (
    <div className="flex flex-col gap-10 py-6 sm:py-10">
      {/* Hero del show */}
      <section className="relative overflow-hidden rounded-3xl border border-white/10">
        <div className="relative aspect-[16/9] sm:aspect-[21/9] lg:aspect-[3/1]">
          <ShowPoster show={show} variant="hero" withOverlay={false} alt={`Poster de ${show.title}`} className="absolute inset-0 h-full !aspect-auto rounded-none" eager />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 30%, rgba(5,7,22,0.95) 100%)' }} aria-hidden="true" />
          <div className="absolute inset-0" style={{ background: `linear-gradient(90deg, rgba(5,7,22,0.7) 0%, transparent 60%)` }} aria-hidden="true" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 lg:p-10">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-4 max-w-3xl"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span
                className="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide"
                style={{ backgroundColor: `${show.accentColor}22`, color: show.accentColor, border: `1px solid ${show.accentColor}55` }}
              >
                {CATEGORY_LABELS[show.category]}
              </span>
              <span className="rounded-full border border-white/15 bg-black/30 px-3 py-1 text-xs font-medium text-slate-200 backdrop-blur-md">
                {STATUS_LABELS[show.status]}
              </span>
              {show.status === 'premiere' && (
                <span className="rounded-full border border-rose-400/40 bg-rose-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-rose-200 backdrop-blur-md">
                  Estreno
                </span>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
              {show.title}
            </h1>
            <p className="text-base sm:text-lg text-slate-300/90">{show.subtitle}</p>
          </motion.div>
        </div>
      </section>

      {/* Cuerpo: info + sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-8 lg:gap-10">
        {/* Columna principal */}
        <div className="flex flex-col gap-8">
          {/* Descripción */}
          <section className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-white">Sobre la obra</h2>
            <p className="text-sm sm:text-base text-slate-300/90 leading-relaxed">
              {show.longDescription}
            </p>
          </section>

          {/* Ficha técnica */}
          <section className="glass rounded-2xl p-5 sm:p-6 flex flex-col gap-4">
            <h2 className="text-base font-semibold text-white">Ficha técnica</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-slate-500">Dirección</span>
                <span className="text-sm text-slate-100">{show.director}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-slate-500">Duración</span>
                <span className="text-sm text-slate-100">{show.durationMinutes} minutos</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-slate-500">Calificación</span>
                <span className="text-sm text-slate-100">{show.ageRating}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-slate-500">Género</span>
                <span className="text-sm text-slate-100">{show.genre}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-slate-500">Sala</span>
                <span className="text-sm text-slate-100">{show.venue}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-slate-500">Desde</span>
                <span className="text-sm font-semibold text-white">{formatCurrency(priceFrom)}</span>
              </div>
            </div>
            {show.cast.length > 0 && (
              <div className="flex flex-col gap-2 pt-2 border-t border-white/8">
                <span className="text-xs text-slate-500">Elenco</span>
                <div className="flex flex-wrap gap-2">
                  {show.cast.map((member) => (
                    <span key={member} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200">
                      {member}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {show.tags.length > 0 && (
              <div className="flex flex-col gap-2 pt-2 border-t border-white/8">
                <span className="text-xs text-slate-500">Etiquetas</span>
                <div className="flex flex-wrap gap-2">
                  {show.tags.map((tag) => (
                    <span key={tag} className="text-xs text-slate-400">#{tag}</span>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Selector de funciones */}
          <section className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-semibold text-white">Elegí una función</h2>
              <p className="text-sm text-slate-400">
                Seleccioná fecha y horario para continuar con la reserva de butacas.
              </p>
            </div>
            <PerformanceSelector show={show} />
          </section>
        </div>

        {/* Sidebar */}
        <aside className="flex flex-col gap-5 lg:sticky lg:top-20 lg:self-start">
          <div className="glass rounded-2xl p-5 flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-white">Resumen</h3>
            <div className="flex flex-col gap-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Categoría</span>
                <span className="text-slate-100">{CATEGORY_LABELS[show.category]}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Duración</span>
                <span className="text-slate-100">{show.durationMinutes} min</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Calificación</span>
                <span className="text-slate-100">{show.ageRating}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Precio desde</span>
                <span className="font-semibold text-white">{formatCurrency(priceFrom)}</span>
              </div>
              {next && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Próxima función</span>
                  <span className="text-xs text-slate-200 text-right max-w-[60%]">{next.label}</span>
                </div>
              )}
            </div>
            <Link
              to="/espectaculos"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Volver a espectáculos
            </Link>
          </div>
        </aside>
      </div>

      {/* Obras relacionadas */}
      {related.length > 0 && (
        <section className="flex flex-col gap-5">
          <h2 className="text-xl font-semibold text-white">También te puede interesar</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {related.map((s, index) => (
              <ShowCard key={s.id} show={s} index={index} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}