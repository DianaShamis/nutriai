import { Navigate, Route, Routes } from "react-router-dom";
import AuthPage from "./pages/Auth/AuthPage";
import HomePage from "./pages/Home/HomePage";
import AboutPage from "./pages/About/AboutPage";
import ProfileStep1Page from "./pages/Profile/ProfileStep1Page";
import ProfileStep2Page from "./pages/Profile/ProfileStep2Page";
import MyPlanPage from "./pages/MyPlan/MyPlanPage";
import { getToken } from "./api/client";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  if (!getToken()) return <Navigate to="/auth" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route
        path="/profile/step1"
        element={
          <ProtectedRoute>
            <ProfileStep1Page />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile/step2"
        element={
          <ProtectedRoute>
            <ProfileStep2Page />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-plan"
        element={
          <ProtectedRoute>
            <MyPlanPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}