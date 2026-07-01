import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlateaSeatMap } from '../components/seat-map/PlateaSeatMap';
import {
  PalcoSeatMapContainer,
  type PalcoId,
} from '../components/seat-map/PalcoSeatMapContainer';
import { SectorTabs } from '../components/seat-map/SectorTabs';
import { SelectionSummaryHorizontal } from '../components/seat-map/SelectionSummaryHorizontal';
import { toPlateaSelectedItems } from '../components/seat-map/selectedSeatAdapter';
import { SECTORS, type SectorId } from '../components/seat-map/sectorTypes';
import type { PlateaSeat } from '../components/seat-map/types';
import type { SelectedSeatItem } from '../components/seat-map/selectedSeatAdapter';
import { useReservationStore } from '../store/useReservationStore';
import { toReservationSeatPlatea } from '../lib/reservationPricing';

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
  const navigate = useNavigate();
  // Selectores estables: solo sacamos del store las acciones (referencias
  // estables) y el sector inicial. No suscribimos el componente a cambios
  // del store para evitar re-renders en cascada. La selección se mantiene
  // en estado local del componente y se sincroniza al store SOLO en los
  // event handlers (continue/clear/remove), nunca en un useEffect.
  const setSelectedSector = useReservationStore((s) => s.setSelectedSector);
  const clearStoreSelection = useReservationStore((s) => s.clearSelection);
  const hydrateSelection = useReservationStore((s) => s.hydrateFromExistingSelection);
  const setCurrentStep = useReservationStore((s) => s.setCurrentStep);
  const initialSector = useReservationStore((s) => s.selectedSector);

  const [activeSectorId, setActiveSectorId] = useState<SectorId>(initialSector);
  const [sectorClearedMsg, setSectorClearedMsg] = useState<string | null>(null);

  // Platea: selección propia. Los palcos son manejados por el contenedor.
  const [plateaSelection, setPlateaSelection] = useState<PlateaSeat[]>([]);
  const [plateaWarning, setPlateaWarning] = useState<string | null>(null);

  // Selección de palcos (provista por el contenedor).
  const [palcoSelection, setPalcoSelection] = useState<SelectedSeatItem[]>([]);
  const [palcoWarning, setPalcoWarning] = useState<string | null>(null);

  const isPlatea = activeSectorId === 'platea';
  const activePalcoId: PalcoId = activeSectorId as PalcoId;
  const currentSelection = isPlatea ? plateaSelection : palcoSelection;
  const currentWarning = isPlatea ? plateaWarning : palcoWarning;
  const summarySectorId: SectorId = activeSectorId;
  const selectedItems: SelectedSeatItem[] = isPlatea
    ? toPlateaSelectedItems(plateaSelection)
    : palcoSelection;

  const handleSectorChange = useCallback(
    (next: SectorId) => {
      if (next === activeSectorId) return;
      if (currentSelection.length > 0) {
        setSectorClearedMsg('Cambiaste de sector: la selección anterior se descartó.');
      }
      setPlateaSelection([]);
      setPlateaWarning(null);
      setPalcoSelection([]);
      setPalcoWarning(null);
      setActiveSectorId(next);
      setSelectedSector(next);
    },
    [activeSectorId, currentSelection.length, setSelectedSector]
  );

  const handleContinue = () => {
    if (currentSelection.length === 0) {
      if (isPlatea) setPlateaWarning('Seleccioná al menos una butaca para continuar.');
      else setPalcoWarning('Seleccioná al menos una butaca para continuar.');
      return;
    }
    // Sincronizar al store SOLO al continuar, no en cada render.
    if (isPlatea) {
      hydrateSelection('platea', plateaSelection.map(toReservationSeatPlatea));
    } else {
      hydrateSelection(
        activePalcoId,
        palcoSelection.map((item) => ({
          id: item.id,
          sector: activePalcoId,
          sectorLabel: SECTORS[activePalcoId].label,
          number: item.seatNumber,
          status: 'available',
          price: 0,
          displayLabel: `${SECTORS[activePalcoId].label}, ${item.detail}`,
        }))
      );
    }
    setCurrentStep('buyer-data');
    navigate('/reserva/datos');
  };

  const handleClear = () => {
    if (isPlatea) {
      setPlateaSelection([]);
      setPlateaWarning(null);
    } else {
      setPalcoSelection([]);
      setPalcoWarning(null);
    }
    clearStoreSelection();
  };

  const handleRemove = (seatId: string) => {
    if (isPlatea) {
      setPlateaSelection((prev) => prev.filter((s) => s.id !== seatId));
    } else {
      setPalcoSelection((prev) => prev.filter((s) => s.id !== seatId));
    }
  };

  const handlePalcoSelectionChange = useCallback(
    (_id: PalcoId, items: SelectedSeatItem[]) => {
      setPalcoSelection((prev) => {
        if (
          prev.length === items.length &&
          prev.every((item, index) => item.id === items[index]?.id)
        ) {
          return prev;
        }
        return items;
      });
    },
    []
  );

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

      {/* Layout vertical:
          1) Barra de selección horizontal
          2) Selector segmentado de sector, visualmente pegado a la tarjeta del mapa
          3) Tarjeta "Elegí tus lugares" + InfoCard */}
      <div className="flex flex-col gap-5 sm:gap-6">
        <SelectionSummaryHorizontal
          sectorId={summarySectorId}
          selected={selectedItems}
          maxSelectableSeats={8}
          onClear={handleClear}
          onContinue={handleContinue}
          onRemove={handleRemove}
          warning={currentWarning}
          onDismissWarning={() => {
            if (isPlatea) setPlateaWarning(null);
            else setPalcoWarning(null);
          }}
        />

        <div className="flex flex-col gap-3 sm:gap-4">
          <SectorTabs active={activeSectorId} onChange={handleSectorChange} />

          <div className="flex flex-col gap-5">
            {isPlatea ? (
              <PlateaSeatMap
                maxSelectableSeats={8}
                onSelectionChange={setPlateaSelection}
                onWarning={setPlateaWarning}
              />
            ) : (
              <PalcoSeatMapContainer
                key={activePalcoId}
                activePalcoId={activePalcoId}
                maxSelectableSeats={8}
                onSelectionChange={handlePalcoSelectionChange}
              />
            )}
            <InfoCard />
          </div>
        </div>
      </div>
    </div>
  );
}
