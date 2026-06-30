import { seatMapTheme } from './seatMapTheme';

const ITEMS = [
  {
    key: 'available',
    label: 'Disponible',
    fill: seatMapTheme.status.available,
    stroke: seatMapTheme.status.availableStroke,
  },
  {
    key: 'selected',
    label: 'Seleccionada',
    fill: seatMapTheme.status.selected,
    stroke: seatMapTheme.status.selectedStroke,
  },
  {
    key: 'authority',
    label: 'Butaca de autoridad',
    fill: seatMapTheme.authorityFill,
    stroke: seatMapTheme.authorityStroke,
  },
  {
    key: 'unavailable',
    label: 'No disponible',
    fill: seatMapTheme.status.sold,
    stroke: seatMapTheme.status.soldStroke,
  },
  {
    key: 'blocked',
    label: 'Bloqueada',
    fill: seatMapTheme.status.blocked,
    stroke: seatMapTheme.status.blockedStroke,
  },
] as const;

export function PalcoBLegend() {
  return (
    <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
      {ITEMS.map((it) => (
        <li key={it.key} className="flex items-center gap-2 text-xs text-slate-300">
          <span
            className="inline-block h-3.5 w-3.5 rounded-[4px] border"
            style={{ backgroundColor: it.fill, borderColor: it.stroke }}
            aria-hidden="true"
          />
          {it.label}
        </li>
      ))}
    </ul>
  );
}
