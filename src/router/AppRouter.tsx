import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { TheaterLayout } from '../common/TheaterLayout';
import { SeatReservationPage } from '../pages/SeatReservationPage';
import { NotFoundPage } from '../pages/NotFoundPage';

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<TheaterLayout />}>
          <Route index element={<SeatReservationPage />} />
          <Route path="platea" element={<SeatReservationPage />} />
          <Route path="catalog" element={<Navigate to="/" replace />} />
          <Route path="login" element={<Navigate to="/" replace />} />
          <Route path="verify-2fa" element={<Navigate to="/" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
