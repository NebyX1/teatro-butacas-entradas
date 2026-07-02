/**
 * Cliente HTTP mínimo para hablar con el backend Flask.
 *
 * Usa fetch (no axios). Todas las funciones devuelven el JSON parseado o
 * lanzan un Error con el mensaje del backend cuando la respuesta no es 2xx.
 *
 * La URL base se toma de `import.meta.env.VITE_API_BASE_URL` y por defecto
 * apunta a http://localhost:5000 (backend Flask local).
 */

const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, '') ||
  'http://localhost:5000';

export interface ApiReservationSummary {
  reservationId: string;
  reservationCode: string;
  status: string;
  customer: CustomerPayload;
  selectedSeats: SelectedSeatPayload[];
  subtotal: number;
  serviceFee: number;
  total: number;
  paymentProvider?: string | null;
  checkoutUrl?: string | null;
  createdAt?: string | null;
  expiresAt?: string | null;
  paidAt?: string | null;
  tickets?: ApiTicket[];
}

export interface ApiTicket {
  id: string;
  reservationId: string;
  ticketCode: string;
  seat: SelectedSeatPayload;
  createdAt: string;
}

export interface CustomerPayload {
  firstName: string;
  lastName: string;
  documentType?: string;
  documentNumber: string;
  email: string;
  phone: string;
}

export interface SelectedSeatPayload {
  id: string;
  sector: string;
  sectorLabel?: string;
  number?: number;
  displayLabel: string;
  price?: number;
  row?: number;
  side?: string;
}

export interface CreateReservationResponse {
  reservationId: string;
  reservationCode: string;
  status: string;
  expiresAt: string;
  total: number;
  subtotal: number;
  serviceFee: number;
  selectedSeats: SelectedSeatPayload[];
}

export interface CheckoutResponse {
  reservationId: string;
  reservationCode: string;
  checkoutUrl: string;
  provider: string;
}

export interface MockPaymentResponse {
  status: string;
  reservation: ApiReservationSummary;
  tickets?: ApiTicket[];
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  let data: unknown = null;
  try {
    data = await res.json();
  } catch {
    // respuesta sin body
  }

  if (!res.ok) {
    const message =
      (data && typeof data === 'object' && 'error' in data
        ? String((data as Record<string, unknown>).error)
        : null) ||
      (data && typeof data === 'object' && 'errors' in data
        ? Array.isArray((data as Record<string, unknown>).errors)
          ? ((data as Record<string, unknown[]>).errors as string[]).join('; ')
          : String((data as Record<string, unknown>).errors)
        : null) ||
      `Error ${res.status}`;
    throw new Error(message);
  }

  return data as T;
}

/** POST /api/reservations */
export function createReservation(payload: {
  selectedSector: string;
  selectedSeats: SelectedSeatPayload[];
  customer?: Partial<CustomerPayload>;
}): Promise<CreateReservationResponse> {
  return request<CreateReservationResponse>('/api/reservations', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/** PATCH /api/reservations/:id/customer */
export function updateReservationCustomer(
  reservationId: string,
  customer: CustomerPayload
): Promise<ApiReservationSummary> {
  return request<ApiReservationSummary>(
    `/api/reservations/${encodeURIComponent(reservationId)}/customer`,
    {
      method: 'PATCH',
      body: JSON.stringify(customer),
    }
  );
}

/** GET /api/reservations/:id */
export function getReservation(reservationId: string): Promise<ApiReservationSummary> {
  return request<ApiReservationSummary>(
    `/api/reservations/${encodeURIComponent(reservationId)}`
  );
}

/** POST /api/reservations/:id/checkout */
export function createCheckout(reservationId: string): Promise<CheckoutResponse> {
  return request<CheckoutResponse>(
    `/api/reservations/${encodeURIComponent(reservationId)}/checkout`,
    { method: 'POST' }
  );
}

/** POST /api/payments/mock/approve */
export function approveMockPayment(reservationId: string): Promise<MockPaymentResponse> {
  return request<MockPaymentResponse>('/api/payments/mock/approve', {
    method: 'POST',
    body: JSON.stringify({ reservationId }),
  });
}

/** POST /api/payments/mock/reject */
export function rejectMockPayment(reservationId: string): Promise<MockPaymentResponse> {
  return request<MockPaymentResponse>('/api/payments/mock/reject', {
    method: 'POST',
    body: JSON.stringify({ reservationId }),
  });
}

/** GET /api/health */
export function checkHealth(): Promise<{ ok: boolean; service: string }> {
  return request<{ ok: boolean; service: string }>('/api/health');
}

/**
 * GET /api/reservations/:id/tickets.pdf
 *
 * Descarga el PDF de boletos generado por el backend. Solo funciona si
 * la reserva está pagada o con tickets emitidos. Devuelve un Blob listo
 * para descargar. Lanza un Error con el mensaje del backend si falla.
 */
export async function downloadTicketsPdf(
  reservationId: string,
  reservationCode: string
): Promise<void> {
  const res = await fetch(
    `${API_BASE_URL}/api/reservations/${encodeURIComponent(reservationId)}/tickets.pdf`,
    { method: 'GET' }
  );

  if (!res.ok) {
    let message = 'No se pudo descargar el PDF.';
    if (res.status === 403 || res.status === 409) {
      message = 'Los boletos todavía no están disponibles. El pago debe estar confirmado.';
    } else if (res.status === 404) {
      message = 'No encontramos esta reserva.';
    } else {
      try {
        const data = await res.json();
        if (data && typeof data === 'object' && 'error' in data) {
          message = String((data as Record<string, unknown>).error);
        }
      } catch {
        // sin body
      }
    }
    throw new Error(message);
  }

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `teatro-lavalleja-reserva-${reservationCode}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}