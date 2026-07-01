interface ReservationCodeBadgeProps {
  code: string;
}

export function ReservationCodeBadge({ code }: ReservationCodeBadgeProps) {
  return (
    <div className="inline-flex items-center gap-2 rounded-xl border border-indigo-400/30 bg-indigo-500/10 px-3 py-2">
      <span className="text-xs text-indigo-200/80">Código de reserva</span>
      <span className="font-mono text-sm font-semibold text-indigo-100">{code}</span>
    </div>
  );
}
