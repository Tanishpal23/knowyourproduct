import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import LandingPage     from './pages/LandingPage';
import ScanPage        from './pages/ScanPage';
import SearchPage      from './pages/SearchPage';
import ProductPage     from './pages/ProductPage';
import ComparePage     from './pages/ComparePage';
import LoginPage       from './pages/LoginPage';
import SignupPage      from './pages/SignupPage';
import DashboardPage        from './pages/DashboardPage';
import HowItWorksPage       from './pages/HowItWorksPage';
import AboutPage            from './pages/AboutPage';
import ForgotPasswordPage   from './pages/ForgotPasswordPage';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]" role="status" aria-label="Loading">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  return user ? children : <Navigate to="/login" replace />;
};

function AppRoutes() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="nav-spacer" />
      <main className="flex-1">
        <Routes>
          <Route path="/"            element={<LandingPage />} />
          <Route path="/scan"        element={<ScanPage />} />
          <Route path="/search"      element={<SearchPage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/compare"     element={<ComparePage />} />
          <Route path="/login"           element={<LoginPage />} />
          <Route path="/signup"           element={<SignupPage />} />
          <Route path="/forgot-password"  element={<ForgotPasswordPage />} />
          <Route path="/how-it-works"     element={<HowItWorksPage />} />
          <Route path="/about"       element={<AboutPage />} />
          <Route path="/dashboard"   element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="*"            element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
