import { useCallback, useState } from 'react';
import { PlateaSeatMap } from '../components/seat-map/PlateaSeatMap';
import { PalcoASeatMap } from '../components/seat-map/PalcoASeatMap';
import { PalcoBSeatMap } from '../components/seat-map/PalcoBSeatMap';
import { PalcoCSeatMap } from '../components/seat-map/PalcoCSeatMap';
import { SelectionSummary } from '../components/seat-map/SelectionSummary';
import { toPlateaSelectedItems, toPalcoASelectedItems, toPalcoBSelectedItems, toPalcoCSelectedItems } from '../components/seat-map/selectedSeatAdapter';
import { SECTORS, SECTOR_ORDER, type SectorId } from '../components/seat-map/sectorTypes';
import type { PlateaSeat } from '../components/seat-map/types';
import type { PalcoASeat } from '../components/seat-map/palcoASeatGenerator';
import type { PalcoBSeat } from '../components/seat-map/palcoBSeatGenerator';
import type { PalcoCSeat } from '../components/seat-map/palcoCSeatGenerator';
import type { SelectedSeatItem } from '../components/seat-map/selectedSeatAdapter';

function InfoCard() {
  return (
    <aside
      id="info"
      className="glass rounded-2xl p-4 sm:p-5 flex flex-col gap-3"
    >
      <div className="flex items-center gap-2">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-indigo-300">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 8v5M12 17h.01M12 22a10 10 0 100-20 10 10 0 000 20z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <h3 className="text-sm font-semibold text-white">Información de la reserva</h3>
      </div>
      <ul className="flex flex-col gap-2 text-xs text-slate-300/90">
        <li className="flex items-start gap-2">
          <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400" />
          <span>Seleccioná hasta <strong className="text-white">8 butacas</strong> por reserva.</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400" />
          <span>Las butacas reservadas, vendidas o bloqueadas no se pueden seleccionar.</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400" />
          <span>La disponibilidad final se confirmará al continuar la reserva.</span>
        </li>
      </ul>
    </aside>
  );
}

export function SeatReservationPage() {
  const [sectorId, setSectorId] = useState<SectorId>('platea');
  const [confirmedIds, setConfirmedIds] = useState<string[] | null>(null);
  const [sectorClearedMsg, setSectorClearedMsg] = useState<string | null>(null);

  // Selecciones separadas por sector
  const [plateaSelection, setPlateaSelection] = useState<PlateaSeat[]>([]);
  const [palcoASelection, setPalcoASelection] = useState<PalcoASeat[]>([]);
  const [palcoBSelection, setPalcoBSelection] = useState<PalcoBSeat[]>([]);
  const [palcoCSelection, setPalcoCSelection] = useState<PalcoCSeat[]>([]);
  const [plateaWarning, setPlateaWarning] = useState<string | null>(null);
  const [palcoAWarning, setPalcoAWarning] = useState<string | null>(null);
  const [palcoBWarning, setPalcoBWarning] = useState<string | null>(null);
  const [palcoCWarning, setPalcoCWarning] = useState<string | null>(null);

  const currentWarning =
    sectorId === 'platea'
      ? plateaWarning
      : sectorId === 'palco_a'
        ? palcoAWarning
        : sectorId === 'palco_b'
          ? palcoBWarning
          : palcoCWarning;
  const currentSelection =
    sectorId === 'platea'
      ? plateaSelection
      : sectorId === 'palco_a'
        ? palcoASelection
        : sectorId === 'palco_b'
          ? palcoBSelection
          : palcoCSelection;

  // Convertir la selección actual a SelectedSeatItem[] para el panel agnóstico
  const selectedItems: SelectedSeatItem[] =
    sectorId === 'platea'
      ? toPlateaSelectedItems(plateaSelection)
      : sectorId === 'palco_a'
        ? toPalcoASelectedItems(palcoASelection)
        : sectorId === 'palco_b'
          ? toPalcoBSelectedItems(palcoBSelection)
          : toPalcoCSelectedItems(palcoCSelection);

  const handleSectorChange = useCallback((newSector: SectorId) => {
    if (newSector === sectorId) return;
    // Si hay selección en el sector actual, mostrar aviso
    if (currentSelection.length > 0) {
      setSectorClearedMsg('Cambiamos de sector y limpiamos la selección anterior.');
    }
    // Limpiar selección del sector actual al cambiar
    if (sectorId === 'platea') {
      setPlateaSelection([]);
      setPlateaWarning(null);
    } else if (sectorId === 'palco_a') {
      setPalcoASelection([]);
      setPalcoAWarning(null);
    } else if (sectorId === 'palco_b') {
      setPalcoBSelection([]);
      setPalcoBWarning(null);
    } else {
      setPalcoCSelection([]);
      setPalcoCWarning(null);
    }
    setSectorId(newSector);
  }, [sectorId, currentSelection.length]);

  const handleContinue = () => {
    setConfirmedIds(currentSelection.map((s) => s.id));
  };

  const handleClear = () => {
    if (sectorId === 'platea') {
      setPlateaSelection([]);
      setPlateaWarning(null);
    } else if (sectorId === 'palco_a') {
      setPalcoASelection([]);
      setPalcoAWarning(null);
    } else if (sectorId === 'palco_b') {
      setPalcoBSelection([]);
      setPalcoBWarning(null);
    } else {
      setPalcoCSelection([]);
      setPalcoCWarning(null);
    }
  };

  const handleRemove = (seatId: string) => {
    if (sectorId === 'platea') {
      setPlateaSelection((prev) => prev.filter((s) => s.id !== seatId));
    } else if (sectorId === 'palco_a') {
      setPalcoASelection((prev) => prev.filter((s) => s.id !== seatId));
    } else if (sectorId === 'palco_b') {
      setPalcoBSelection((prev) => prev.filter((s) => s.id !== seatId));
    } else {
      setPalcoCSelection((prev) => prev.filter((s) => s.id !== seatId));
    }
  };

  const dismissSectorCleared = () => setSectorClearedMsg(null);

  return (
    <div className="flex flex-col gap-6 sm:gap-8">
      <section className="flex flex-col gap-2">
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-indigo-200">
          Teatro Lavalleja · Reservas
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-white">
          Reserva de butacas
        </h1>
        <p className="text-sm sm:text-base text-slate-300/80 max-w-2xl">
          Elegí el sector y seleccioná butacas disponibles para continuar.
          Tocá una butaca en el mapa para agregarla a tu reserva.
        </p>
      </section>

      {/* Selector de sector */}
      <div className="glass-strong rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
        <div className="flex flex-col gap-1">
          <label
            htmlFor="sector-select"
            className="text-sm font-semibold text-white"
          >
            Sector
          </label>
          <p className="text-xs text-slate-400">
            Elegí el sector que querés reservar
          </p>
        </div>
        <select
          id="sector-select"
          value={sectorId}
          onChange={(e) => handleSectorChange(e.target.value as SectorId)}
          className="select select-bordered w-full max-w-xs bg-slate-900/80 border-white/15 text-white focus:border-indigo-400 focus:outline-none"
          aria-label="Seleccionar sector"
        >
          {SECTOR_ORDER.map((id) => (
            <option key={id} value={id}>
              {SECTORS[id].label} · {SECTORS[id].totalSeats} butacas
            </option>
          ))}
        </select>
      </div>

      {confirmedIds && (
        <div
          role="status"
          className="glass rounded-2xl px-4 py-3 text-sm text-emerald-100 flex items-center gap-3"
        >
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-emerald-300/30 bg-emerald-300/10">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="flex-1">
            Reservaste {confirmedIds.length} butaca
            {confirmedIds.length === 1 ? '' : 's'} en {SECTORS[sectorId].label}. Esta es una versión de
            demostración: la integración con pagos y backend se conecta más
            adelante.
          </span>
        </div>
      )}

      {sectorClearedMsg && (
        <div
          role="alert"
          className="glass rounded-2xl px-4 py-3 text-sm text-amber-100 flex items-center gap-3"
        >
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-amber-300/30 bg-amber-300/10">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="flex-1">{sectorClearedMsg}</span>
          <button
            type="button"
            onClick={dismissSectorCleared}
            aria-label="Cerrar aviso"
            className="text-amber-100/70 hover:text-amber-100"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_360px] gap-5 sm:gap-6">
        <div className="flex flex-col gap-5">
          {sectorId === 'platea' ? (
            <PlateaSeatMap
              maxSelectableSeats={8}
              onSelectionChange={setPlateaSelection}
              onWarning={setPlateaWarning}
            />
          ) : sectorId === 'palco_a' ? (
            <PalcoASeatMap
              maxSelectableSeats={8}
              onSelectionChange={setPalcoASelection}
              onWarning={setPalcoAWarning}
            />
          ) : sectorId === 'palco_b' ? (
            <PalcoBSeatMap
              maxSelectableSeats={8}
              onSelectionChange={setPalcoBSelection}
              onWarning={setPalcoBWarning}
            />
          ) : (
            <PalcoCSeatMap
              maxSelectableSeats={8}
              onSelectionChange={setPalcoCSelection}
              onWarning={setPalcoCWarning}
            />
          )}
          <InfoCard />
        </div>

        <div className="xl:sticky xl:top-20 xl:self-start">
          <SelectionSummary
            sectorId={sectorId}
            selected={selectedItems}
            maxSelectableSeats={8}
            onClear={handleClear}
            onContinue={handleContinue}
            onRemove={handleRemove}
            warning={currentWarning}
            onDismissWarning={() => {
              if (sectorId === 'platea') setPlateaWarning(null);
              else if (sectorId === 'palco_a') setPalcoAWarning(null);
              else if (sectorId === 'palco_b') setPalcoBWarning(null);
              else setPalcoCWarning(null);
            }}
          />
        </div>
      </div>
    </div>
  );
}
