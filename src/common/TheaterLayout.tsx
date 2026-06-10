import { Link, Outlet } from 'react-router-dom';

function TheaterLogo() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="text-accent drop-shadow-[0_0_12px_rgba(248,193,74,0.35)]"
    >
      <path
        d="M3 8h26"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M5 8v13c0 1.6 1.3 3 3 3h16c1.7 0 3-1.4 3-3V8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M3 8l3 3M29 8l-3 3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M11 14c0 2.2 1.8 4 4 4s4-1.8 4-4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="11" cy="24" r="1.4" fill="currentColor" />
      <circle cx="16" cy="24" r="1.4" fill="currentColor" />
      <circle cx="21" cy="24" r="1.4" fill="currentColor" />
    </svg>
  );
}

export function TheaterLayout() {
  return (
    <div className="min-h-screen flex flex-col text-base-content">
      <header className="sticky top-0 z-30">
        <div className="glass border-b border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
            <Link to="/" className="flex items-center gap-3 group">
              <TheaterLogo />
              <div className="flex flex-col leading-tight">
                <span className="text-base sm:text-lg font-semibold tracking-tight text-white">
                  Teatro Lavalleja
                </span>
                <span className="text-[11px] sm:text-xs text-slate-300/80">
                  Reserva de butacas · Platea
                </span>
              </div>
            </Link>

            <div className="flex items-center gap-2 sm:gap-3">
              <span className="hidden sm:inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-200">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                Selección interactiva
              </span>

              <a
                href="#info"
                className="btn btn-sm btn-ghost text-slate-200 hover:bg-white/10"
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById('info')
                    ?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Información
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
          <Outlet />
        </div>
      </main>

      <footer className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center text-[11px] sm:text-xs text-slate-400">
          © 2026 Intendencia Departamental de Lavalleja · Teatro Lavalleja
        </div>
      </footer>
    </div>
  );
}
