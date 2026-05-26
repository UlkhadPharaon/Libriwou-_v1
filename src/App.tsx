/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { TourProvider } from './contexts/TourContext';
import { DashboardLayout } from './layouts/DashboardLayout';
import { SplashScreen } from './components/SplashScreen';
import { AnimatePresence, motion } from 'motion/react';
import { SubscriptionLockScreen } from './components/SubscriptionLockScreen';
import { lazy, Suspense } from 'react';

// Lazy load pages
const LandingPage = lazy(() => import('./pages/LandingPage').then(m => ({ default: m.LandingPage })));
const OnboardingPage = lazy(() => import('./pages/OnboardingPage').then(m => ({ default: m.OnboardingPage })));
const DashboardPage = lazy(() => import('./pages/DashboardPage').then(m => ({ default: m.DashboardPage })));
const HubPage = lazy(() => import('./pages/HubPage').then(m => ({ default: m.HubPage })));
const DocumentsPage = lazy(() => import('./pages/DocumentsPage').then(m => ({ default: m.DocumentsPage })));
const CalendarPage = lazy(() => import('./pages/CalendarPage').then(m => ({ default: m.CalendarPage })));
const BankPage = lazy(() => import('./pages/BankPage').then(m => ({ default: m.BankPage })));
const SimulatorPage = lazy(() => import('./pages/SimulatorPage').then(m => ({ default: m.SimulatorPage })));
const SettingsPage = lazy(() => import('./pages/SettingsPage').then(m => ({ default: m.SettingsPage })));
const InvoicePage = lazy(() => import('./pages/InvoicePage').then(m => ({ default: m.InvoicePage })));
const VaultPage = lazy(() => import('./pages/VaultPage').then(m => ({ default: m.VaultPage })));
const JournalPage = lazy(() => import('./pages/JournalPage').then(m => ({ default: m.JournalPage })));
const ExpensesPage = lazy(() => import('./pages/ExpensesPage').then(m => ({ default: m.ExpensesPage })));
const InventoryPage = lazy(() => import('./pages/InventoryPage').then(m => ({ default: m.InventoryPage })));
const PayrollPage = lazy(() => import('./pages/PayrollPage').then(m => ({ default: m.PayrollPage })));
const PayrollSlipPage = lazy(() => import('./pages/PayrollSlipPage').then(m => ({ default: m.PayrollSlipPage })));
const CashflowPage = lazy(() => import('./pages/CashflowPage').then(m => ({ default: m.CashflowPage })));
const AdminHubPage = lazy(() => import('./pages/AdminHubPage').then(m => ({ default: m.AdminHubPage })));
const ScanPage = lazy(() => import('./pages/ScanPage').then(m => ({ default: m.ScanPage })));
const DeclarationsPage = lazy(() => import('./pages/DeclarationsPage').then(m => ({ default: m.DeclarationsPage })));
const FinancialStatementsPage = lazy(() => import('./pages/FinancialStatementsPage').then(m => ({ default: m.FinancialStatementsPage })));
const BilanPage = lazy(() => import('./pages/BilanPage').then(m => ({ default: m.BilanPage })));

function ProtectedRoute({ children, requireProfile = true }: { children: React.ReactNode, requireProfile?: boolean }) {
  const { user, loading, hasProfile, isSubscribed } = useAuth();

  if (loading) {
    return <SplashScreen />;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (!isSubscribed) {
    return <SubscriptionLockScreen />;
  }

  if (requireProfile && hasProfile === false) {
    return <Navigate to="/onboarding" replace />;
  }

  if (!requireProfile && hasProfile === true) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<SplashScreen />}>
        <Routes location={location} key={location.pathname.split('/')[1] || 'root'}>
          <Route 
            path="/" 
            element={
              <PageWrapper>
                <LandingPage />
              </PageWrapper>
            } 
          />
          <Route 
            path="/onboarding" 
            element={
              <ProtectedRoute requireProfile={false}>
                <PageWrapper>
                  <OnboardingPage />
                </PageWrapper>
              </ProtectedRoute>
            } 
          />
          <Route 
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<PageWrapper><DashboardPage /></PageWrapper>} />
            <Route path="expenses" element={<PageWrapper><ExpensesPage /></PageWrapper>} />
            <Route path="inventory" element={<PageWrapper><InventoryPage /></PageWrapper>} />
            <Route path="payroll" element={<PageWrapper><PayrollPage /></PageWrapper>} />
            <Route path="payroll-slip" element={<PageWrapper><PayrollSlipPage /></PageWrapper>} />
            <Route path="hub" element={<PageWrapper><HubPage /></PageWrapper>} />
            <Route path="documents" element={<PageWrapper><DocumentsPage /></PageWrapper>} />
            <Route path="calendar" element={<PageWrapper><CalendarPage /></PageWrapper>} />
            <Route path="bank" element={<PageWrapper><BankPage /></PageWrapper>} />
            <Route path="simulator" element={<PageWrapper><SimulatorPage /></PageWrapper>} />
            <Route path="settings" element={<PageWrapper><SettingsPage /></PageWrapper>} />
            <Route path="scan" element={<PageWrapper><ScanPage /></PageWrapper>} />
            <Route path="invoices" element={<PageWrapper><InvoicePage /></PageWrapper>} />
            <Route path="cashflow" element={<PageWrapper><CashflowPage /></PageWrapper>} />
            <Route path="vault" element={<PageWrapper><VaultPage /></PageWrapper>} />
            <Route path="journal" element={<PageWrapper><JournalPage /></PageWrapper>} />
            <Route path="declarations" element={<PageWrapper><DeclarationsPage /></PageWrapper>} />
            <Route path="financial-statements" element={<PageWrapper><FinancialStatementsPage /></PageWrapper>} />
            <Route path="bilan" element={<PageWrapper><BilanPage /></PageWrapper>} />
            <Route path="admin-hub" element={<PageWrapper><AdminHubPage /></PageWrapper>} />
            {/* Fallback for when at / but logged in */}
            <Route path="" element={<Navigate to="dashboard" replace />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
}

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="h-full"
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ErrorReporterProvider>
        <AuthProvider>
          <Router>
            <TourProvider>
              <AnimatedRoutes />
            </TourProvider>
          </Router>
        </AuthProvider>
      </ErrorReporterProvider>
    </ThemeProvider>
  );
}
