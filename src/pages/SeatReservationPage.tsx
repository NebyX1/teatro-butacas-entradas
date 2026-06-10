import { useState } from 'react';
import { PlateaSeatMap } from '../components/seat-map/PlateaSeatMap';
import { PlateaSelectionSummary } from '../components/seat-map/PlateaSelectionSummary';
import type { PlateaSeat } from '../components/seat-map/types';

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
  const [confirmedIds, setConfirmedIds] = useState<string[] | null>(null);
  const [liveSelection, setLiveSelection] = useState<PlateaSeat[]>([]);
  const [warning, setWarning] = useState<string | null>(null);

  const handleContinue = (seats: PlateaSeat[]) => {
    setConfirmedIds(seats.map((s) => s.id));
  };

  return (
    <div className="flex flex-col gap-6 sm:gap-8">
      <section className="flex flex-col gap-2">
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-indigo-200">
          Platea del Teatro Lavalleja
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-white">
          Reserva de butacas
        </h1>
        <p className="text-sm sm:text-base text-slate-300/80 max-w-2xl">
          Seleccioná una o más butacas disponibles para continuar. Tocá una
          butaca en el mapa para agregarla a tu reserva.
        </p>
      </section>

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
            {confirmedIds.length === 1 ? '' : 's'}. Esta es una versión de
            demostración: la integración con pagos y backend se conecta más
            adelante.
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_360px] gap-5 sm:gap-6">
        <div className="flex flex-col gap-5">
          <PlateaSeatMap
            maxSelectableSeats={8}
            onSelectionChange={setLiveSelection}
            onWarning={setWarning}
          />
          <InfoCard />
        </div>

        <div className="xl:sticky xl:top-20 xl:self-start">
          <PlateaSelectionSummary
            selected={liveSelection}
            maxSelectableSeats={8}
            onClear={() => {
              setLiveSelection([]);
              setWarning(null);
            }}
            onContinue={() => handleContinue(liveSelection)}
            onRemove={(id) =>
              setLiveSelection((prev) => prev.filter((s) => s.id !== id))
            }
            warning={warning}
            onDismissWarning={() => setWarning(null)}
          />
        </div>
      </div>
    </div>
  );
}
