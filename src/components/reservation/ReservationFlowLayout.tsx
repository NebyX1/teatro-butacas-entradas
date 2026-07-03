import type { ReactNode } from 'react';
import { CheckoutStepper } from './CheckoutStepper';
import type { CheckoutStep, ReservationState } from '../../store/useReservationStore';
import { ReservationSummaryCard } from './ReservationSummaryCard';

interface ReservationFlowLayoutProps {
  step: CheckoutStep;
  title: string;
  subtitle?: string;
  children: ReactNode;
  summaryState: Pick<
    ReservationState,
    | 'selectedSector'
    | 'selectedSeats'
    | 'pricing'
    | 'customerData'
    | 'deliveryOption'
    | 'temporaryReservationCode'
    | 'expiresAt'
    | 'selectedShow'
    | 'selectedPerformance'
  >;
}

export function ReservationFlowLayout({
  step,
  title,
  subtitle,
  children,
  summaryState,
}: ReservationFlowLayoutProps) {
  return (
    <div className="flex flex-col gap-6 sm:gap-8">
      <section className="flex flex-col gap-2">
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-indigo-200">
          Teatro Lavalleja · Reservas
        </span>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-white">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm sm:text-base text-slate-300/80 max-w-2xl">{subtitle}</p>
        )}
      </section>

      <div className="glass-strong rounded-3xl shadow-2xl ring-soft overflow-hidden">
        <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
          <CheckoutStepper currentStep={step} />

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
            <div className="flex flex-col gap-6">{children}</div>
            <aside className="flex flex-col gap-5">
              <ReservationSummaryCard state={summaryState} />
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
