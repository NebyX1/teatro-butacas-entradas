import { SECTORS, SECTOR_ORDER, type SectorId } from './sectorTypes';

const SECTOR_TONE: Record<
  SectorId,
  { active: string; idle: string; dot: string }
> = {
  platea: {
    active:
      'border-emerald-300/60 bg-emerald-300/15 text-emerald-100 shadow-[0_0_0_1px_rgba(110,231,183,0.18)]',
    idle: 'border-white/10 bg-white/[0.04] text-slate-300 hover:bg-white/[0.08] hover:text-white',
    dot: 'bg-emerald-300',
  },
  palco_a: {
    active:
      'border-indigo-300/60 bg-indigo-300/15 text-indigo-100 shadow-[0_0_0_1px_rgba(165,180,252,0.18)]',
    idle: 'border-white/10 bg-white/[0.04] text-slate-300 hover:bg-white/[0.08] hover:text-white',
    dot: 'bg-indigo-300',
  },
  palco_b: {
    active:
      'border-fuchsia-300/60 bg-fuchsia-300/15 text-fuchsia-100 shadow-[0_0_0_1px_rgba(240,171,252,0.18)]',
    idle: 'border-white/10 bg-white/[0.04] text-slate-300 hover:bg-white/[0.08] hover:text-white',
    dot: 'bg-fuchsia-300',
  },
  palco_c: {
    active:
      'border-sky-300/60 bg-sky-300/15 text-sky-100 shadow-[0_0_0_1px_rgba(125,211,252,0.18)]',
    idle: 'border-white/10 bg-white/[0.04] text-slate-300 hover:bg-white/[0.08] hover:text-white',
    dot: 'bg-sky-300',
  },
};

interface SectorTabsProps {
  active: SectorId;
  onChange: (id: SectorId) => void;
}

export function SectorTabs({ active, onChange }: SectorTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Seleccionar sector"
      className="glass rounded-2xl p-2 flex flex-wrap items-center gap-2"
    >
      <span className="px-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
        Sector
      </span>
      {SECTOR_ORDER.map((id) => {
        const isActive = id === active;
        const tone = SECTOR_TONE[id];
        return (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(id)}
            className={`inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-sm font-medium transition ${
              isActive ? tone.active : tone.idle
            }`}
          >
            <span
              className={`inline-block h-1.5 w-1.5 rounded-full ${tone.dot} ${
                isActive ? 'shadow-[0_0_8px_currentColor]' : 'opacity-70'
              }`}
              aria-hidden="true"
            />
            {SECTORS[id].label}
            <span
              className={`text-[11px] ${
                isActive ? 'text-white/80' : 'text-slate-400'
              }`}
            >
              · {SECTORS[id].totalSeats} butacas
            </span>
          </button>
        );
      })}
    </div>
  );
}
