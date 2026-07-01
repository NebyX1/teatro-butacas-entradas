import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { TheaterLayout } from '../common/TheaterLayout';
import { SeatReservationPage } from '../pages/SeatReservationPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { BuyerDataPage } from '../routes/reservation/BuyerDataPage';
import { ReviewReservationPage } from '../routes/reservation/ReviewReservationPage';
import { PrePaymentPage } from '../routes/reservation/PrePaymentPage';
import { DemoPaymentPage } from '../routes/reservation/DemoPaymentPage';
import { ReservationSuccessPage } from '../routes/reservation/ReservationSuccessPage';
import { PaymentErrorPage } from '../routes/reservation/PaymentErrorPage';
import { ReservationGuard } from '../routes/reservation/ReservationGuard';

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<TheaterLayout />}>
          <Route index element={<SeatReservationPage />} />
          <Route path="platea" element={<SeatReservationPage />} />

          <Route path="reserva" element={<SeatReservationPage />} />
          <Route
            path="reserva/datos"
            element={
              <ReservationGuard requiredStep="buyer-data">
                <BuyerDataPage />
              </ReservationGuard>
            }
          />
          <Route
            path="reserva/revision"
            element={
              <ReservationGuard requiredStep="review">
                <ReviewReservationPage />
              </ReservationGuard>
            }
          />
          <Route
            path="reserva/pre-pago"
            element={
              <ReservationGuard requiredStep="pre-payment">
                <PrePaymentPage />
              </ReservationGuard>
            }
          />
          <Route
            path="reserva/demo-pago"
            element={
              <ReservationGuard requiredStep="demo-payment">
                <DemoPaymentPage />
              </ReservationGuard>
            }
          />
          <Route
            path="reserva/confirmada"
            element={
              <ReservationGuard requiredStep="success">
                <ReservationSuccessPage />
              </ReservationGuard>
            }
          />
          <Route
            path="reserva/error-pago"
            element={
              <ReservationGuard requiredStep="demo-payment">
                <PaymentErrorPage />
              </ReservationGuard>
            }
          />

          <Route path="catalog" element={<Navigate to="/" replace />} />
          <Route path="login" element={<Navigate to="/" replace />} />
          <Route path="verify-2fa" element={<Navigate to="/" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
