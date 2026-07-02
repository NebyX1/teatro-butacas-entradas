import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SectorId } from '../components/seat-map/sectorTypes';
import type {
  ApiReservationSummary,
  ApiTicket,
  CheckoutResponse,
} from '../lib/api';

export type DocumentType = 'ci' | 'pasaporte' | 'otro';

export type DeliveryOption = 'digital' | 'email';

export interface ReservationSeat {
  id: string;
  sector: SectorId;
  sectorLabel: string;
  row?: number;
  side?: 'izquierda' | 'derecha';
  number: number;
  status: string;
  price: number;
  displayLabel: string;
}

export interface CustomerData {
  firstName: string;
  lastName: string;
  documentType: DocumentType;
  documentNumber: string;
  email: string;
  phone: string;
}

export interface Pricing {
  seatPrices: Record<SectorId, number>;
  subtotal: number;
  serviceFee: number;
  total: number;
}

export type CheckoutStep =
  | 'selection'
  | 'buyer-data'
  | 'review'
  | 'pre-payment'
  | 'demo-payment'
  | 'success'
  | 'payment-error';

export interface BackendTicket {
  id: string;
  reservationId: string;
  ticketCode: string;
  seat: ReservationSeat;
  createdAt: string;
}

export interface ReservationState {
  selectedSector: SectorId;
  selectedSeats: ReservationSeat[];
  maxSeats: number;
  customerData: CustomerData;
  reservationId: string | null;
  temporaryReservationCode: string | null;
  createdAt: string | null;
  expiresAt: string | null;
  expirationMinutes: number;
  pricing: Pricing;
  deliveryOption: DeliveryOption;
  termsAccepted: boolean;
  currentStep: CheckoutStep;
  paymentStatus: 'none' | 'approved' | 'rejected';
  // --- Campos de integración con el backend ---
  backendStatus: string | null;
  backendTotal: number | null;
  backendSubtotal: number | null;
  backendServiceFee: number | null;
  checkoutUrl: string | null;
  paymentProvider: string | null;
  tickets: BackendTicket[];
}

export interface ReservationActions {
  setSelectedSector: (sector: SectorId) => void;
  setSelectedSeats: (seats: ReservationSeat[]) => void;
  addSeat: (seat: ReservationSeat) => void;
  removeSeat: (seatId: string) => void;
  clearSelection: () => void;
  setCustomerData: (data: Partial<CustomerData>) => void;
  setDeliveryOption: (option: DeliveryOption) => void;
  setTermsAccepted: (accepted: boolean) => void;
  setCurrentStep: (step: CheckoutStep) => void;
  setPaymentStatus: (status: 'none' | 'approved' | 'rejected') => void;
  calculateTotals: () => void;
  createTemporaryReservation: () => void;
  resetReservation: () => void;
  hydrateFromExistingSelection: (
    sector: SectorId,
    seats: ReservationSeat[]
  ) => void;
  // --- Acciones de integración con el backend ---
  setReservationFromBackend: (data: ApiReservationSummary) => void;
  setCreateReservationResponse: (data: {
    reservationId: string;
    reservationCode: string;
    expiresAt: string;
    total: number;
    subtotal: number;
    serviceFee: number;
  }) => void;
  setCheckoutUrl: (data: CheckoutResponse) => void;
  setTickets: (tickets: ApiTicket[]) => void;
  setPaymentStatusFromBackend: (status: string) => void;
  resetReservationFlow: () => void;
}

const DEFAULT_PRICES: Record<SectorId, number> = {
  platea: 850,
  palco_a: 1200,
  palco_b: 1200,
  palco_c: 1200,
};

const EXPIRATION_MINUTES = 15;

const initialCustomerData: CustomerData = {
  firstName: '',
  lastName: '',
  documentType: 'ci',
  documentNumber: '',
  email: '',
  phone: '',
};

const initialPricing: Pricing = {
  seatPrices: { ...DEFAULT_PRICES },
  subtotal: 0,
  serviceFee: 0,
  total: 0,
};

const initialState: ReservationState = {
  selectedSector: 'platea',
  selectedSeats: [],
  maxSeats: 8,
  customerData: { ...initialCustomerData },
  reservationId: null,
  temporaryReservationCode: null,
  createdAt: null,
  expiresAt: null,
  expirationMinutes: EXPIRATION_MINUTES,
  pricing: { ...initialPricing },
  deliveryOption: 'digital',
  termsAccepted: false,
  currentStep: 'selection',
  paymentStatus: 'none',
  backendStatus: null,
  backendTotal: null,
  backendSubtotal: null,
  backendServiceFee: null,
  checkoutUrl: null,
  paymentProvider: null,
  tickets: [],
};

function generateReservationCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'TL-';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

function addMinutes(date: Date, minutes: number): string {
  return new Date(date.getTime() + minutes * 60000).toISOString();
}

export const useReservationStore = create<ReservationState & ReservationActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      setSelectedSector: (sector) => {
        set({ selectedSector: sector });
        get().calculateTotals();
      },

      setSelectedSeats: (seats) => {
        set({ selectedSeats: seats });
        get().calculateTotals();
      },

      addSeat: (seat) => {
        const current = get().selectedSeats;
        if (current.some((s) => s.id === seat.id)) return;
        const next = [...current, seat];
        set({ selectedSeats: next });
        get().calculateTotals();
      },

      removeSeat: (seatId) => {
        const next = get().selectedSeats.filter((s) => s.id !== seatId);
        set({ selectedSeats: next });
        get().calculateTotals();
      },

      clearSelection: () => {
        set({ selectedSeats: [] });
        get().calculateTotals();
      },

      setCustomerData: (data) => {
        set((state) => ({
          customerData: { ...state.customerData, ...data },
        }));
      },

      setDeliveryOption: (option) => set({ deliveryOption: option }),

      setTermsAccepted: (accepted) => set({ termsAccepted: accepted }),

      setCurrentStep: (step) => set({ currentStep: step }),

      setPaymentStatus: (status) => set({ paymentStatus: status }),

      calculateTotals: () => {
        const state = get();
        const subtotal = state.selectedSeats.reduce(
          (sum, seat) => sum + (state.pricing.seatPrices[seat.sector] ?? 0),
          0
        );
        const serviceFee = Math.round(subtotal * 0.05);
        const total = subtotal + serviceFee;

        if (
          state.pricing.subtotal === subtotal &&
          state.pricing.serviceFee === serviceFee &&
          state.pricing.total === total
        ) {
          return;
        }

        set((state) => ({
          pricing: { ...state.pricing, subtotal, serviceFee, total },
        }));
      },

      createTemporaryReservation: () => {
        const now = new Date();
        const code = generateReservationCode();
        set({
          reservationId: code,
          temporaryReservationCode: code,
          createdAt: now.toISOString(),
          expiresAt: addMinutes(now, EXPIRATION_MINUTES),
        });
      },

      resetReservation: () => {
        set({
          ...initialState,
          pricing: { ...initialPricing },
        });
      },

      hydrateFromExistingSelection: (sector, seats) => {
        const state = get();

        // Idempotencia: si el sector y las butacas son equivalentes a las
        // actuales, no tocamos el estado. Esto evita bucles infinitos cuando
        // un componente sincroniza una selección local con Zustand en un
        // useEffect.
        const sameSector = state.selectedSector === sector;
        const sameLength = state.selectedSeats.length === seats.length;
        const sameSeats =
          sameLength &&
          seats.every((incoming) => {
            const existing = state.selectedSeats.find((s) => s.id === incoming.id);
            if (!existing) return false;
            return (
              existing.sector === incoming.sector &&
              existing.number === incoming.number &&
              existing.displayLabel === incoming.displayLabel &&
              existing.price === incoming.price
            );
          });

        if (sameSector && sameSeats) return;

        set({
          selectedSector: sector,
          selectedSeats: seats,
          currentStep: 'selection',
          paymentStatus: 'none',
          termsAccepted: false,
          reservationId: null,
          temporaryReservationCode: null,
          createdAt: null,
          expiresAt: null,
        });
        get().calculateTotals();
      },

      // --- Implementación de acciones de integración con el backend ---

      setReservationFromBackend: (data) => {
        set({
          reservationId: data.reservationId,
          temporaryReservationCode: data.reservationCode,
          backendStatus: data.status,
          backendTotal: data.total,
          backendSubtotal: data.subtotal,
          backendServiceFee: data.serviceFee,
          expiresAt: data.expiresAt ?? null,
          checkoutUrl: data.checkoutUrl ?? null,
          paymentProvider: data.paymentProvider ?? null,
          tickets: (data.tickets ?? []).map((t) => ({
            id: t.id,
            reservationId: t.reservationId,
            ticketCode: t.ticketCode,
            seat: t.seat as ReservationSeat,
            createdAt: t.createdAt,
          })),
        });
      },

      setCreateReservationResponse: (data) => {
        set({
          reservationId: data.reservationId,
          temporaryReservationCode: data.reservationCode,
          expiresAt: data.expiresAt,
          backendStatus: 'held',
          backendTotal: data.total,
          backendSubtotal: data.subtotal,
          backendServiceFee: data.serviceFee,
        });
      },

      setCheckoutUrl: (data) => {
        set({
          checkoutUrl: data.checkoutUrl,
          paymentProvider: data.provider,
          backendStatus: 'payment_pending',
        });
      },

      setTickets: (tickets) => {
        set({
          tickets: tickets.map((t) => ({
            id: t.id,
            reservationId: t.reservationId,
            ticketCode: t.ticketCode,
            seat: t.seat as ReservationSeat,
            createdAt: t.createdAt,
          })),
        });
      },

      setPaymentStatusFromBackend: (status) => {
        set({ backendStatus: status });
      },

      resetReservationFlow: () => {
        set({
          ...initialState,
          pricing: { ...initialPricing },
        });
      },
    }),
    {
      name: 'teatro-reservation-draft',
      partialize: (state) => ({
        selectedSector: state.selectedSector,
        selectedSeats: state.selectedSeats,
        maxSeats: state.maxSeats,
        customerData: state.customerData,
        reservationId: state.reservationId,
        temporaryReservationCode: state.temporaryReservationCode,
        createdAt: state.createdAt,
        expiresAt: state.expiresAt,
        expirationMinutes: state.expirationMinutes,
        pricing: state.pricing,
        deliveryOption: state.deliveryOption,
        termsAccepted: state.termsAccepted,
        backendStatus: state.backendStatus,
        backendTotal: state.backendTotal,
        backendSubtotal: state.backendSubtotal,
        backendServiceFee: state.backendServiceFee,
        checkoutUrl: state.checkoutUrl,
        paymentProvider: state.paymentProvider,
        tickets: state.tickets,
      }),
    }
  )
);
