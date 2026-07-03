import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { TheaterLayout } from '../common/TheaterLayout';
import { HomePage } from '../pages/HomePage';
import { ShowsPage } from '../pages/ShowsPage';
import { ShowDetailPage } from '../pages/ShowDetailPage';
import { ImageCreditsPage } from '../pages/ImageCreditsPage';
import { SeatReservationPage } from '../pages/SeatReservationPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { BuyerDataPage } from '../routes/reservation/BuyerDataPage';
import { ReviewReservationPage } from '../routes/reservation/ReviewReservationPage';
import { PrePaymentPage } from '../routes/reservation/PrePaymentPage';
import { DemoPaymentPage } from '../routes/reservation/DemoPaymentPage';
import { ReservationSuccessPage } from '../routes/reservation/ReservationSuccessPage';
import { PaymentErrorPage } from '../routes/reservation/PaymentErrorPage';
import { PaymentSuccessPage } from '../routes/reservation/PaymentSuccessPage';
import { PaymentPendingPage } from '../routes/reservation/PaymentPendingPage';
import { PaymentFailurePage } from '../routes/reservation/PaymentFailurePage';
import { ReservationGuard } from '../routes/reservation/ReservationGuard';

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<TheaterLayout />}>
          <Route index element={<HomePage />} />
          <Route path="espectaculos" element={<ShowsPage />} />
          <Route path="espectaculos/:showSlug" element={<ShowDetailPage />} />
          <Route path="espectaculos/:showSlug/funciones" element={<ShowDetailPage />} />
          <Route path="creditos-imagenes" element={<ImageCreditsPage />} />

          <Route path="reserva/:performanceId" element={<SeatReservationPage />} />
          <Route path="reserva" element={<SeatReservationPage />} />
          <Route path="platea" element={<Navigate to="/espectaculos" replace />} />
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
          <Route
            path="reserva/pago/success"
            element={
              <ReservationGuard requiredStep="pre-payment">
                <PaymentSuccessPage />
              </ReservationGuard>
            }
          />
          <Route
            path="reserva/pago/pending"
            element={
              <ReservationGuard requiredStep="pre-payment">
                <PaymentPendingPage />
              </ReservationGuard>
            }
          />
          <Route
            path="reserva/pago/failure"
            element={
              <ReservationGuard requiredStep="pre-payment">
                <PaymentFailurePage />
              </ReservationGuard>
            }
          />

          <Route path="catalog" element={<Navigate to="/espectaculos" replace />} />
          <Route path="login" element={<Navigate to="/" replace />} />
          <Route path="verify-2fa" element={<Navigate to="/" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
