import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Dashboard from '../pages/Dashboard/dashboard';
import LoginPage from '../pages/Auth/Login';
import KaryawanPage from '../pages/Karyawan';
import ReportsPage from '../pages/Reports';
// import CalendarPage from '../pages/Calendar';
import NotFound from '../pages/NotFound';
import { useAuth } from '../contexts/AuthContext';
import RegisterPage from '../pages/Auth/Register';
import TimeOff from '../pages/TimeOff';
import TrackDrivers from '../pages/Trackers';

function RequireAuth({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route path="/register" element={<RegisterPage />} />

      <Route
        path="/"
        element={
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        }
      />

      <Route
        path="/reports"
        element={<RequireAuth><ReportsPage /></RequireAuth>}
      />

      <Route
        path="/karyawan"
        element={<RequireAuth><KaryawanPage /></RequireAuth>}
      />

      <Route
        path="/request-time-off"
        element={<RequireAuth><TimeOff/></RequireAuth>}
      />

      <Route
        path="/track-drivers"
        element={<RequireAuth><TrackDrivers/></RequireAuth>}
      />

      <Route
        path="/laporan"
        element={<RequireAuth><ReportsPage /></RequireAuth>}
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}