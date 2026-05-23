import { Navigate, Route, Routes } from "react-router-dom";
import AuthPage from "./pages/Auth/AuthPage";
import HomePage from "./pages/Home/HomePage";
import AboutPage from "./pages/About/AboutPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
      <Route path="/about" element={<AboutPage />} />
    </Routes>
  );
}