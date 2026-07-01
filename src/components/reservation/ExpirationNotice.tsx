import { useEffect, useState } from 'react';

interface ExpirationNoticeProps {
  expiresAt: string | null;
  reservationCode?: string | null;
}

function pad(n: number): string {
  return n.toString().padStart(2, '0');
}

export function ExpirationNotice({ expiresAt, reservationCode }: ExpirationNoticeProps) {
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    if (!expiresAt) return;

    const target = new Date(expiresAt).getTime();
    const update = () => {
      const diff = Math.max(0, target - Date.now());
      setRemaining(diff);
    };

    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [expiresAt]);

  const minutes = Math.floor(remaining / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);

  return (
    <div className="rounded-2xl border border-amber-300/20 bg-amber-500/10 p-4 flex flex-col gap-2">
      <div className="flex items-start gap-3">
        <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-amber-300/30 bg-amber-500/15 text-amber-200">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 8v4M12 16h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-amber-100">
            {expiresAt
              ? 'Tené en cuenta que las butacas quedan reservadas temporalmente.'
              : 'Las butacas seleccionadas pueden quedar reservadas temporalmente al confirmar.'}
          </p>
          {expiresAt && (
            <p className="text-xs text-amber-100/80">
              Tiempo restante para completar el pago:{' '}
              <span className="font-mono font-semibold text-amber-200">
                {pad(minutes)}:{pad(seconds)}
              </span>
            </p>
          )}
        </div>
      </div>
      {reservationCode && (
        <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2">
          <span className="text-xs text-slate-400">Código de reserva</span>
          <span className="font-mono text-sm font-semibold text-indigo-200">{reservationCode}</span>
        </div>
      )}
    </div>
  );
}
