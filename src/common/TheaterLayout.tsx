import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';

function TheaterLogo({ className = '' }: { className?: string }) {
  return (
    <svg
      width="34"
      height="34"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={`text-accent drop-shadow-[0_0_14px_rgba(248,193,74,0.4)] ${className}`}
    >
      <path d="M3 8h26" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M5 8v13c0 1.6 1.3 3 3 3h16c1.7 0 3-1.4 3-3V8" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" fill="none" />
      <path d="M3 8l3 3M29 8l-3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M11 14c0 2.2 1.8 4 4 4s4-1.8 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <circle cx="11" cy="24" r="1.4" fill="currentColor" />
      <circle cx="16" cy="24" r="1.4" fill="currentColor" />
      <circle cx="21" cy="24" r="1.4" fill="currentColor" />
    </svg>
  );
}

const NAV_LINKS = [
  { to: '/', label: 'Inicio', end: true },
  { to: '/espectaculos', label: 'Espectáculos', end: false },
  { to: '/espectaculos?filter=current', label: 'Cartelera', end: false, isQuery: true },
  { to: '/espectaculos?filter=premiere', label: 'Estrenos', end: false, isQuery: true },
  { to: '/espectaculos/funcion-a-la-luz-de-la-sala', label: 'Visita', end: false, isQuery: true },
];

function DesktopNavItem({
  to,
  label,
  end,
  isQuery,
}: {
  to: string;
  label: string;
  end?: boolean;
  isQuery?: boolean;
}) {
  if (isQuery) {
    return (
      <Link
        to={to}
        className="group relative px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:text-white"
      >
        {label}
        <span className="absolute bottom-0 left-3 right-3 h-px bg-accent scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
      </Link>
    );
  }
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        [
          'group relative px-3 py-2 text-sm font-medium transition-colors',
          isActive ? 'text-white' : 'text-slate-300 hover:text-white',
        ].join(' ')
      }
    >
      {({ isActive }) => (
        <>
          {label}
          <span
            className={`absolute bottom-0 left-3 right-3 h-px bg-accent transition-transform duration-300 ${
              isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
            }`}
          />
        </>
      )}
    </NavLink>
  );
}

function MobileNavItem({
  to,
  label,
  end,
  isQuery,
  onNavigate,
}: {
  to: string;
  label: string;
  end?: boolean;
  isQuery?: boolean;
  onNavigate?: () => void;
}) {
  if (isQuery) {
    return (
      <Link
        to={to}
        onClick={onNavigate}
        className="rounded-lg px-4 py-3 text-base font-medium text-slate-200 transition-colors hover:bg-white/8 hover:text-white"
      >
        {label}
      </Link>
    );
  }
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onNavigate}
      className={({ isActive }) =>
        [
          'rounded-lg px-4 py-3 text-base font-medium transition-colors',
          isActive ? 'bg-white/10 text-white' : 'text-slate-200 hover:bg-white/8 hover:text-white',
        ].join(' ')
      }
    >
      {label}
    </NavLink>
  );
}

export function TheaterLayout() {
  const location = useLocation();
  const reduceMotion = useReducedMotion();
  const isHome = location.pathname === '/';
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <div className="min-h-screen flex flex-col text-base-content">
      <header className="sticky top-0 z-50">
        <motion.div
          initial={reduceMotion ? false : { y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className={`transition-all duration-400 ${
            scrolled
              ? 'bg-[#070A1F]/90 backdrop-blur-2xl border-b border-white/10 shadow-[0_10px_40px_-16px_rgba(0,0,0,0.7)]'
              : 'bg-[#070A1F]/72 backdrop-blur-xl border-b border-white/[0.06]'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className={`flex items-center justify-between gap-4 transition-all duration-400 ${scrolled ? 'h-[60px]' : 'h-[76px]'}`}>
              {/* Logo */}
              <Link to="/" className="flex items-center gap-3 group shrink-0" aria-label="Teatro Lavalleja, inicio">
                <TheaterLogo />
                <div className="flex flex-col leading-tight">
                  <span className="text-base sm:text-lg font-semibold tracking-tight text-white">
                    Teatro Lavalleja
                  </span>
                  <span className="text-[10px] sm:text-[11px] text-slate-400/70 tracking-[0.08em] uppercase">
                    Box office digital
                  </span>
                </div>
              </Link>

              {/* Desktop nav */}
              <nav className="hidden lg:flex items-center gap-0.5" aria-label="Navegación principal">
                {NAV_LINKS.map((link) => (
                  <DesktopNavItem key={link.label} {...link} />
                ))}
              </nav>

              {/* Right cluster */}
              <div className="hidden lg:flex items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-500/[0.06] px-3 py-1.5 text-xs text-cyan-100">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                  </span>
                  Reservas abiertas
                </span>
                <Link
                  to="/espectaculos"
                  className="group inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold text-[#1F1300] transition-all hover:scale-[1.04] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
                  style={{
                    background: 'linear-gradient(135deg, #F8C14A 0%, #E6A82E 100%)',
                    boxShadow: '0 6px 24px -8px rgba(248,193,74,0.55)',
                  }}
                >
                  Ver cartelera
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
                    <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </div>

              {/* Mobile hamburger */}
              <button
                type="button"
                className="lg:hidden inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/5 p-2.5 text-white transition-colors hover:bg-white/10"
                onClick={() => setMobileOpen((v) => !v)}
                aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
                aria-expanded={mobileOpen}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  {mobileOpen ? (
                    <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  ) : (
                    <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Mobile drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div
                initial={reduceMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={reduceMotion ? undefined : { opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="lg:hidden fixed inset-0 top-[60px] bg-black/50 backdrop-blur-sm z-40"
                onClick={() => setMobileOpen(false)}
                aria-hidden="true"
              />
              <motion.nav
                initial={reduceMotion ? false : { opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, y: -16 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="lg:hidden absolute top-full left-0 right-0 bg-[#070A1F]/97 backdrop-blur-2xl border-b border-white/10 z-40"
                aria-label="Navegación móvil"
              >
                <div className="flex flex-col gap-1 px-4 py-5">
                  {NAV_LINKS.map((link) => (
                    <MobileNavItem key={link.label} {...link} onNavigate={() => setMobileOpen(false)} />
                  ))}
                  <div className="flex items-center gap-2 px-4 py-3">
                    <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-500/[0.06] px-3 py-1.5 text-xs text-cyan-100">
                      <span className="h-2 w-2 rounded-full bg-emerald-400" />
                      Reservas abiertas
                    </span>
                  </div>
                  <Link
                    to="/espectaculos"
                    onClick={() => setMobileOpen(false)}
                    className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-3.5 text-sm font-semibold text-[#1F1300] mt-2"
                    style={{
                      background: 'linear-gradient(135deg, #F8C14A 0%, #E6A82E 100%)',
                      boxShadow: '0 6px 24px -8px rgba(248,193,74,0.55)',
                    }}
                  >
                    Ver cartelera
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                </div>
              </motion.nav>
            </>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-1">
        {isHome ? (
          <Outlet />
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
            <Outlet />
          </div>
        )}
      </main>

      <footer className="border-t border-white/5 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <TheaterLogo />
                <span className="text-base font-semibold text-white">Teatro Lavalleja</span>
              </div>
              <p className="text-xs text-slate-400 max-w-xs">
                Sala teatral con programación cultural durante todo el año.
                Reserva interactiva de butacas y entradas digitales.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-xs uppercase tracking-wide text-slate-500">Navegación</h3>
              <Link to="/" className="text-sm text-slate-300 hover:text-white transition-colors">Inicio</Link>
              <Link to="/espectaculos" className="text-sm text-slate-300 hover:text-white transition-colors">Espectáculos</Link>
              <Link to="/creditos-imagenes" className="text-sm text-slate-300 hover:text-white transition-colors">Créditos de imágenes</Link>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-xs uppercase tracking-wide text-slate-500">Contacto</h3>
              {/* TODO: reemplazar con datos reales del teatro */}
              <span className="text-sm text-slate-400">Dirección: Calle Principal 123, Minas</span>
              <span className="text-sm text-slate-400">Teléfono: (+598) 000 000 000</span>
              <span className="text-sm text-slate-400">Email: contacto@teatrolavalleja.gub.uy</span>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-xs uppercase tracking-wide text-slate-500">Redes</h3>
              {/* TODO: reemplazar con redes sociales reales */}
              <span className="text-sm text-slate-400">Instagram</span>
              <span className="text-sm text-slate-400">Facebook</span>
              <span className="text-sm text-slate-400">YouTube</span>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] sm:text-xs text-slate-500">
            <span>© 2026 Intendencia Departamental de Lavalleja · Teatro Lavalleja</span>
            <span>Sistema de reservas</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
