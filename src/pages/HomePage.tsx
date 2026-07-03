import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import {
  getFeaturedShow,
  getCurrentShows,
  getPremieres,
  getUpcomingAgenda,
} from '../data/shows';
import { ShowHero } from '../components/shows/ShowHero';
import { FeaturedShowCard } from '../components/shows/FeaturedShowCard';
import { ShowCard } from '../components/shows/ShowCard';
import { ShowAgendaStrip } from '../components/shows/ShowAgendaStrip';

function SectionHeader({
  eyebrow,
  title,
  action,
}: {
  eyebrow: string;
  title: string;
  action?: { label: string; to: string };
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
      <div className="flex flex-col gap-1">
        <span className="text-xs uppercase tracking-[0.2em] text-accent/80">{eyebrow}</span>
        <h2 className="text-2xl sm:text-3xl font-bold text-white">{title}</h2>
      </div>
      {action && (
        <Link
          to={action.to}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-300 hover:text-white transition-colors"
        >
          {action.label}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      )}
    </div>
  );
}

export function HomePage() {
  const reduceMotion = useReducedMotion();
  const featured = getFeaturedShow();
  const currentShows = getCurrentShows().filter((s) => s.id !== featured.id);
  const premieres = getPremieres();
  const agenda = getUpcomingAgenda(6);

  return (
    <div className="flex flex-col">
      {/* Hero full-bleed: sin padding del layout */}
      <ShowHero show={featured} />

      {/* Contenido con padding */}
      <div className="flex flex-col gap-16 sm:gap-20 py-16 sm:py-20">
        {/* Obra destacada (card grande) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col gap-6">
          <SectionHeader eyebrow="Obra destacada" title="No te lo podés perder" />
          <FeaturedShowCard show={featured} />
        </section>

        {/* En cartelera */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col gap-6">
          <SectionHeader
            eyebrow="En cartelera"
            title="Funciones en curso"
            action={{ label: 'Ver todos', to: '/espectaculos' }}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {currentShows.map((show, index) => (
              <ShowCard key={show.id} show={show} index={index} />
            ))}
          </div>
        </section>

        {/* Próximos estrenos */}
        {premieres.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col gap-6">
            <SectionHeader
              eyebrow="Próximos estrenos"
              title="Pronto en el escenario"
              action={{ label: 'Ver estrenos', to: '/espectaculos?filter=premiere' }}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {premieres.map((show, index) => (
                <ShowCard key={show.id} show={show} index={index} />
              ))}
            </div>
          </section>
        )}

        {/* Agenda breve */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col gap-6">
          <SectionHeader eyebrow="Agenda" title="Próximas funciones" />
          <ShowAgendaStrip items={agenda} />
        </section>

        {/* Experiencia Teatro Lavalleja */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0B102B] to-[#17113A] p-8 sm:p-12"
          >
            <div
              className="absolute inset-0 opacity-30"
              style={{ background: 'radial-gradient(ellipse 60% 50% at 80% 20%, rgba(248,193,74,0.15) 0%, transparent 70%)' }}
              aria-hidden="true"
            />
            <div className="relative z-10 flex flex-col gap-8">
              <div className="flex flex-col gap-3 max-w-2xl">
                <span className="text-xs uppercase tracking-[0.2em] text-accent/80">Experiencia</span>
                <h2 className="text-2xl sm:text-3xl font-bold text-white">
                  Teatro Lavalleja, una sala pensada para tu butaca
                </h2>
                <p className="text-sm sm:text-base text-slate-300/90">
                  Reservá tu lugar en la sala de forma interactiva, elegí platea o
                  palcos, recibí tus entradas digitales con código QR y validalas al
                  ingresar. Todo desde la web, sin filas.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { title: 'Reserva interactiva', desc: 'Elegí butacas en el mapa de la sala.', icon: 'M4 6h16M4 12h16M4 18h7' },
                  { title: 'Platea y palcos', desc: 'Cuatro sectores con vista al escenario.', icon: 'M3 8h26M5 8v13M27 8v13' },
                  { title: 'Tickets digitales PDF', desc: 'Descargá tus entradas al instante.', icon: 'M9 5h7a2 2 0 012 2v12a2 2 0 01-2 2H9a2 2 0 01-2-2V7a2 2 0 012-2z' },
                  { title: 'Validación QR', desc: 'Presentá el código al ingresar.', icon: 'M12 2v4M12 18v4M2 12h4M18 12h4' },
                ].map((item) => (
                  <div key={item.title} className="flex flex-col gap-2 rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-accent">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d={item.icon} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                    <p className="text-xs text-slate-400">{item.desc}</p>
                  </div>
                ))}
              </div>
              <div className="pt-2">
                <Link
                  to="/espectaculos"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-[#1F1300] transition-transform hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
                >
                  Ver espectáculos
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </div>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
}