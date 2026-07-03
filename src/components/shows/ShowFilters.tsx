import { motion, useReducedMotion } from 'motion/react';

export type FilterTab = 'todos' | 'current' | 'premiere' | 'musica' | 'teatro' | 'familia' | 'danza';

interface ShowFiltersProps {
  active: FilterTab;
  onChange: (tab: FilterTab) => void;
  search: string;
  onSearchChange: (value: string) => void;
  counts?: Partial<Record<FilterTab, number>>;
}

const TABS: { id: FilterTab; label: string }[] = [
  { id: 'todos', label: 'Todos' },
  { id: 'current', label: 'En cartelera' },
  { id: 'premiere', label: 'Estrenos' },
  { id: 'musica', label: 'Música' },
  { id: 'teatro', label: 'Teatro' },
  { id: 'familia', label: 'Familia' },
  { id: 'danza', label: 'Danza' },
];

export function ShowFilters({ active, onChange, search, onSearchChange, counts }: ShowFiltersProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 sm:overflow-visible scrollbar-none">
          {TABS.map((tab) => {
            const isActive = active === tab.id;
            const count = counts?.[tab.id];
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onChange(tab.id)}
                className={[
                  'relative inline-flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'text-white'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5',
                ].join(' ')}
                aria-pressed={isActive}
              >
                {isActive && (
                  <motion.span
                    layoutId="filter-pill"
                    className="absolute inset-0 rounded-full border border-indigo-400/40 bg-indigo-500/20"
                    transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
                {typeof count === 'number' && (
                  <span className="relative z-10 text-xs text-slate-500">{count}</span>
                )}
              </button>
            );
          })}
        </div>

        <div className="relative sm:w-64 shrink-0">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
          >
            <path d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <input
            type="search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar espectáculo…"
            className="w-full rounded-full border border-white/10 bg-white/5 py-2 pl-9 pr-4 text-sm text-white placeholder:text-slate-500 focus:border-indigo-400/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            aria-label="Buscar espectáculo"
          />
        </div>
      </div>
    </div>
  );
}