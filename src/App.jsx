import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';

// Public Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DoctorListPage from './pages/DoctorListPage';
import DoctorDetailPage from './pages/DoctorDetailPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';

// Protected Pages
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import ProfilePage from './pages/ProfilePage';
import DoctorAppointmentList from './pages/DoctorAppointmentList';
import AdminPortal from './pages/AdminPortal';

import "../src/App.css";
import "../src/index.css";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ToastContainer } from 'react-toastify';

function Layout({ children }) {
  const location = useLocation();

  // Define routes where Navbar should be hidden
  const hideNavbarRoutes = ["/doctor-appointmentList", "/admin-portal"];

  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col w-full">
      {!shouldHideNavbar && <Navbar />}
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <GoogleOAuthProvider clientId="319738992490-g2dvi6ttail437h7irp5n2ugndb9fc8p.apps.googleusercontent.com">
        <ToastContainer />
        <Router>
          <Layout>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/doctors" element={<DoctorListPage />} />
              <Route path="/doctors/:id" element={<DoctorDetailPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/patient-profile" element={<ProfilePage />} />
              <Route path="/doctor-appointmentList" element={<DoctorAppointmentList />} />
              <Route path="/admin-portal" element={<AdminPortal />} />

              {/* Catch all - redirect to home */}
              <Route path="*" element={<HomePage />} />
            </Routes>
          </Layout>
        </Router>
      </GoogleOAuthProvider>
    </AuthProvider>
  );
}

export default App;
