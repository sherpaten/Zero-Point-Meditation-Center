import React, { useEffect, Suspense, lazy } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import Footer from './components/Footer.jsx'; // Eager render prevents the footer from shifting after initial paint.
import { preload } from 'react-dom';
import welcomeHeroImage from './assets/Boudha.jpg?url';

if (typeof window !== 'undefined' && window.location.pathname === '/') {
  preload(welcomeHeroImage, { as: 'image', fetchPriority: 'high' });
}

const Navbar = lazy(() => import('./components/Navbar.jsx'));
const FloatingAssistant = lazy(() => import('./components/FloatingAssistant.jsx'));

const Home = lazy(() => import('./pages/Home.jsx'));
const About = lazy(() => import('./pages/About.jsx'));
const Teachings = lazy(() => import('./pages/Teachings.jsx'));
const Events = lazy(() => import('./pages/Events.jsx'));
const EventRegistration = lazy(() => import('./pages/EventRegistration.jsx'));
const Merchandise = lazy(() => import('./pages/Merchandise.jsx'));
const MerchandisePolicy = lazy(() => import('./pages/MerchandisePolicy.jsx'));
const Contact = lazy(() => import('./pages/Contact.jsx'));
const Welcome = lazy(() => import('./pages/Welcome.jsx'));
const Services = lazy(() => import('./pages/Services.jsx'));

const Donation = lazy(() => import('./pages/Donation.jsx'));
const Membership = lazy(() => import('./pages/Membership.jsx'));
const MembershipRegistration = lazy(() => import('./pages/MembershipRegistration.jsx'));
const MembershipCheckin = lazy(() => import('./pages/MembershipCheckin.jsx'));
const MembershipAdmin = lazy(() => import('./pages/MembershipAdmin.jsx'));
const PaymentReceiptsAdmin = lazy(() => import('./pages/PaymentReceiptsAdmin.jsx'));
const DonationAdmin = lazy(() => import('./pages/DonationAdmin.jsx'));
const MerchandiseAdmin = lazy(() => import('./pages/MerchandiseAdmin.jsx'));
const MerchandisePayment = lazy(() => import('./pages/MerchandisePayment.jsx'));
const AdminLogin = lazy(() => import('./pages/AdminLogin.jsx'));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function SiteLayout() {
  const { pathname } = useLocation();
  const isWelcome = pathname === '/';
  const isAdminLogin = pathname === '/admin-login';

  return (
    <div
      className={
        isWelcome
          ? 'min-h-screen bg-black'
          : 'relative z-10 flex min-h-screen flex-col justify-between bg-buddhist-bg font-sans text-buddhist-charcoal selection:bg-buddhist-gold-light selection:text-buddhist-burgundy'
      }
    >
      {!isWelcome && !isAdminLogin && (
        <Suspense fallback={null}>
          <Navbar />
        </Suspense>
      )}

      <main className={isWelcome ? '' : 'grow'}>
        <Suspense
          fallback={
            <div
              className="min-h-[50vh] flex items-center justify-center text-buddhist-burgundy"
              role="status"
            >
              Loading page…
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/home" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/donate" element={<Donation />} />
            <Route path="/membership" element={<Membership />} />
            <Route path="/membership-registration" element={<MembershipRegistration />} />
            <Route path="/membership-checkin" element={<MembershipCheckin />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/membership-admin" element={<MembershipAdmin />} />
            <Route path="/payment-receipts-admin" element={<PaymentReceiptsAdmin paymentType="membership" />} />
            <Route path="/donation-admin" element={<DonationAdmin />} />
            <Route path="/merchandise-admin" element={<MerchandiseAdmin />} />
            <Route path="/merchandise-payment-receipts" element={<PaymentReceiptsAdmin paymentType="merchandise" />} />
            <Route path="/merchandise-payment" element={<MerchandisePayment />} />
            <Route path="/teachers" element={<Teachings />} />
            <Route path="/teachings" element={<Navigate to="/teachers" replace />} />
            <Route path="/events" element={<Events />} />
            <Route path="/event-registration" element={<EventRegistration />} />
            <Route path="/merchandise" element={<Merchandise />} />
            <Route path="/merchandise-policy" element={<MerchandisePolicy />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>

      {!isWelcome && !isAdminLogin && <Footer />}

      {!isWelcome && !isAdminLogin && (
        <Suspense fallback={null}>
          <FloatingAssistant />
        </Suspense>
      )}
    </div>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <Router>
        <ScrollToTop />
        <SiteLayout />
      </Router>
    </HelmetProvider>
  );
}
