import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { useReservationStore } from '../../store/useReservationStore';

/**
 * Banner compacto que muestra el espectáculo y la función seleccionados,
 * arriba del mapa de butacas en /reserva/:performanceId.
 * No es grande: el mapa de butacas sigue siendo el foco principal.
 */
export function ShowContextBanner() {
  const reduceMotion = useReducedMotion();
  const selectedShow = useReservationStore((s) => s.selectedShow);
  const selectedPerformance = useReservationStore((s) => s.selectedPerformance);

  if (!selectedShow || !selectedPerformance) return null;

  const accent = selectedShow.accentColor || '#F8C14A';

  return (
    <motion.aside
      initial={reduceMotion ? false : { opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 overflow-hidden"
    >
      {/* Acento lateral */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1"
        style={{ backgroundColor: accent }}
        aria-hidden="true"
      />
      <div className="flex flex-1 flex-col gap-1 pl-2 min-w-0">
        <div className="flex items-center gap-2">
          <span
            className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
            style={{ backgroundColor: `${accent}22`, color: accent }}
          >
            Función
          </span>
          {selectedPerformance.isPremiere && (
            <span className="rounded-full border border-rose-400/30 bg-rose-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-rose-200">
              Estreno
            </span>
          )}
        </div>
        <h2 className="text-base sm:text-lg font-semibold text-white truncate">
          {selectedShow.title}
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 truncate">
          {selectedPerformance.label} · {selectedShow.venue}
        </p>
        <p className="text-[11px] text-slate-500">
          Estás reservando butacas para esta función
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-3 pl-2 sm:pl-0">
        <div className="hidden sm:flex flex-col text-right">
          <span className="text-[11px] text-slate-500">Duración</span>
          <span className="text-sm font-medium text-slate-200">{selectedShow.durationMinutes} min</span>
        </div>
        <Link
          to="/espectaculos"
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-slate-200 transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Cambiar espectáculo
        </Link>
      </div>
    </motion.aside>
  );
}