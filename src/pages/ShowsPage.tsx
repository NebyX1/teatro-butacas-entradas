import { useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { SHOWS, CATEGORY_LABELS } from '../data/shows';
import { ShowGrid } from '../components/shows/ShowGrid';
import { ShowFilters, type FilterTab } from '../components/shows/ShowFilters';

export function ShowsPage() {
  const reduceMotion = useReducedMotion();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialFilter = (searchParams.get('filter') as FilterTab) || 'todos';
  const [active, setActive] = useState<FilterTab>(
    ['todos', 'current', 'premiere', 'musica', 'teatro', 'familia', 'danza'].includes(initialFilter)
      ? initialFilter
      : 'todos'
  );
  const [search, setSearch] = useState('');

  // Sincroniza el filtro con la URL para deep-linking.
  useEffect(() => {
    const next = new URLSearchParams(searchParams);
    if (active === 'todos') {
      next.delete('filter');
    } else {
      next.set('filter', active);
    }
    setSearchParams(next, { replace: true });
  }, [active]); // eslint-disable-line react-hooks/exhaustive-deps

  const counts = useMemo(() => {
    const c: Partial<Record<FilterTab, number>> = { todos: SHOWS.length };
    c.current = SHOWS.filter((s) => s.status === 'current' || s.status === 'featured').length;
    c.premiere = SHOWS.filter((s) => s.status === 'premiere').length;
    c.musica = SHOWS.filter((s) => s.category === 'musica').length;
    c.teatro = SHOWS.filter((s) => s.category === 'teatro').length;
    c.familia = SHOWS.filter((s) => s.category === 'familia').length;
    c.danza = SHOWS.filter((s) => s.category === 'danza').length;
    return c;
  }, []);

  const filteredShows = useMemo(() => {
    let list = SHOWS;
    switch (active) {
      case 'current':
        list = list.filter((s) => s.status === 'current' || s.status === 'featured');
        break;
      case 'premiere':
        list = list.filter((s) => s.status === 'premiere');
        break;
      case 'musica':
        list = list.filter((s) => s.category === 'musica');
        break;
      case 'teatro':
        list = list.filter((s) => s.category === 'teatro');
        break;
      case 'familia':
        list = list.filter((s) => s.category === 'familia');
        break;
      case 'danza':
        list = list.filter((s) => s.category === 'danza');
        break;
      default:
        break;
    }
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.subtitle.toLowerCase().includes(q) ||
          s.shortDescription.toLowerCase().includes(q) ||
          s.genre.toLowerCase().includes(q) ||
          s.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return list;
  }, [active, search]);

  return (
    <div className="flex flex-col gap-8 py-6 sm:py-10">
      <motion.section
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-3"
      >
        <span className="text-xs uppercase tracking-[0.2em] text-accent/80">Programación</span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
          Espectáculos
        </h1>
        <p className="text-sm sm:text-base text-slate-300/80 max-w-2xl">
          Descubrí la programación del Teatro Lavalleja. Filtrá por categoría,
          buscá por nombre y elegí la función que querés ver.
        </p>
      </motion.section>

      <ShowFilters
        active={active}
        onChange={setActive}
        search={search}
        onSearchChange={setSearch}
        counts={counts}
      />

      {filteredShows.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center flex flex-col items-center gap-4">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-400">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold text-white">No encontramos espectáculos</h2>
            <p className="text-sm text-slate-400">
              Probá con otro filtro o cambiá la búsqueda.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setActive('todos');
              setSearch('');
            }}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white hover:bg-white/10 transition-colors"
          >
            Limpiar filtros
          </button>
        </div>
      ) : (
        <ShowGrid shows={filteredShows} />
      )}

      <div className="text-xs text-slate-500 pt-4">
        {filteredShows.length} {filteredShows.length === 1 ? 'espectáculo' : 'espectáculos'}
        {active !== 'todos' && ` · ${CATEGORY_LABELS[active as keyof typeof CATEGORY_LABELS] ?? active}`}
      </div>
    </div>
  );
}