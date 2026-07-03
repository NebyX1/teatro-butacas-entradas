import { useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import type { Show, Performance } from '../../data/shows';
import { formatCurrency } from '../../lib/reservationPricing';
import { useReservationStore } from '../../store/useReservationStore';

interface PerformanceSelectorProps {
  show: Show;
}

function StatusBadge({ performance }: { performance: Performance }) {
  switch (performance.availabilityStatus) {
    case 'sold_out':
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-400/30 bg-rose-500/10 px-2.5 py-0.5 text-[11px] font-medium text-rose-200">
          Agotado
        </span>
      );
    case 'soon':
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-medium text-amber-200">
          Pronto a la venta
        </span>
      );
    case 'cancelled':
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-400/30 bg-slate-500/10 px-2.5 py-0.5 text-[11px] font-medium text-slate-300">
          Cancelada
        </span>
      );
    default:
      if (performance.availableSeats <= 15) {
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-medium text-amber-200">
            Últimas butacas
          </span>
        );
      }
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-200">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          Disponible
        </span>
      );
  }
}

export function PerformanceSelector({ show }: PerformanceSelectorProps) {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const setSelectedShow = useReservationStore((s) => s.setSelectedShow);
  const setSelectedPerformance = useReservationStore((s) => s.setSelectedPerformance);

  const handleSelect = (performance: Performance) => {
    if (performance.availabilityStatus === 'sold_out' || performance.availabilityStatus === 'cancelled') return;
    setSelectedShow(show);
    setSelectedPerformance(performance);
    navigate(`/reserva/${performance.id}`);
  };

  if (show.performances.length === 0) {
    return (
      <div className="glass rounded-2xl p-6 text-center text-slate-400">
        No hay funciones programadas para este espectáculo.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {show.performances.map((performance, index) => {
        const disabled = performance.availabilityStatus === 'sold_out' || performance.availabilityStatus === 'cancelled';
        return (
          <motion.button
            key={performance.id}
            type="button"
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: Math.min(index * 0.07, 0.4) }}
            whileHover={reduceMotion || disabled ? undefined : { y: -4 }}
            whileTap={disabled ? undefined : { scale: 0.98 }}
            onClick={() => handleSelect(performance)}
            disabled={disabled}
            className="group relative flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-left transition-colors hover:border-white/20 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
            style={{ boxShadow: disabled ? 'none' : `0 0 0 0 ${show.accentColor}33` }}
            aria-label={`Elegir función ${performance.label}`}
          >
            {performance.isPremiere && (
              <span
                className="absolute -top-2 left-4 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#1F1300]"
                style={{ backgroundColor: show.accentColor }}
              >
                Estreno
              </span>
            )}
            <div className="flex items-start justify-between gap-2">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-white">{performance.label}</span>
                <span className="text-xs text-slate-400">{show.venue}</span>
              </div>
              <StatusBadge performance={performance} />
            </div>

            <div className="flex items-end justify-between gap-2 pt-2 border-t border-white/8">
              <div className="flex flex-col">
                <span className="text-[11px] text-slate-500">Desde</span>
                <span className="text-lg font-bold text-white">{formatCurrency(performance.priceFrom)}</span>
              </div>
              {!disabled && (
                <span
                  className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-[#1F1300] transition-transform group-hover:scale-105"
                  style={{ backgroundColor: show.accentColor }}
                >
                  Elegir
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              )}
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}