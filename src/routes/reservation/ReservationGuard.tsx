import { Navigate, useLocation } from 'react-router-dom';
import { useReservationStore } from '../../store/useReservationStore';
import { isCustomerDataValid } from '../../lib/reservationValidation';

interface ReservationGuardProps {
  children: React.ReactNode;
  requiredStep: 'selection' | 'buyer-data' | 'review' | 'pre-payment' | 'demo-payment' | 'success';
}

export function ReservationGuard({ children, requiredStep }: ReservationGuardProps) {
  const store = useReservationStore();
  const location = useLocation();

  const hasSeats = store.selectedSeats.length > 0;
  const hasCustomer = isCustomerDataValid(store.customerData);
  const hasTerms = store.termsAccepted;
  const hasReservation = !!store.temporaryReservationCode;
  const paymentApproved = store.paymentStatus === 'approved';

  // Redirecciones simples de frontend para mantener el flujo coherente.
  if (requiredStep !== 'selection' && !hasSeats) {
    return <Navigate to="/reserva" replace state={{ from: location.pathname }} />;
  }

  if ((requiredStep === 'review' || requiredStep === 'pre-payment') && !hasCustomer) {
    return <Navigate to="/reserva/datos" replace state={{ from: location.pathname }} />;
  }

  if (requiredStep === 'pre-payment' && (!hasTerms || !hasReservation)) {
    return <Navigate to="/reserva/revision" replace state={{ from: location.pathname }} />;
  }

  if (requiredStep === 'demo-payment' && !hasReservation) {
    return <Navigate to="/reserva/revision" replace state={{ from: location.pathname }} />;
  }

  if (requiredStep === 'success' && !paymentApproved) {
    return <Navigate to="/reserva" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}
