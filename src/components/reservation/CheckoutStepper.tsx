import type { CheckoutStep } from '../../store/useReservationStore';

const STEPS: { id: CheckoutStep; label: string }[] = [
  { id: 'selection', label: 'Butacas' },
  { id: 'buyer-data', label: 'Tus datos' },
  { id: 'review', label: 'Revisión' },
  { id: 'pre-payment', label: 'Pago' },
];

interface CheckoutStepperProps {
  currentStep: CheckoutStep;
}

export function CheckoutStepper({ currentStep }: CheckoutStepperProps) {
  const activeIndex = STEPS.findIndex((s) => s.id === currentStep);

  return (
    <nav aria-label="Progreso de la reserva" className="w-full">
      <ol className="flex items-center justify-between gap-2">
        {STEPS.map((step, index) => {
          const isActive = index === activeIndex;
          const isCompleted = index < activeIndex;
          const isPending = index > activeIndex;

          return (
            <li key={step.id} className="flex flex-1 items-center">
              <div className="flex flex-col items-center gap-1.5 w-full">
                <span
                  className={[
                    'inline-flex h-8 w-8 items-center justify-center rounded-full border text-sm font-semibold transition',
                    isActive
                      ? 'border-indigo-400 bg-indigo-500/20 text-indigo-200'
                      : isCompleted
                        ? 'border-emerald-400/60 bg-emerald-500/15 text-emerald-200'
                        : 'border-white/10 bg-white/5 text-slate-400',
                  ].join(' ')}
                >
                  {isCompleted ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </span>
                <span
                  className={[
                    'text-[11px] sm:text-xs font-medium text-center',
                    isActive ? 'text-white' : isPending ? 'text-slate-500' : 'text-slate-300',
                  ].join(' ')}
                >
                  {step.label}
                </span>
              </div>
              {index < STEPS.length - 1 && (
                <span
                  className={[
                    'hidden sm:block h-px flex-1 min-w-[2rem] mx-2',
                    isCompleted ? 'bg-emerald-400/40' : 'bg-white/10',
                  ].join(' ')}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
