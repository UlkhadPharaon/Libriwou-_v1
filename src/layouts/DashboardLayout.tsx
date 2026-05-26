import { useState, useEffect, useMemo } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Menu, X, Bell, LogOut, ShieldAlert } from 'lucide-react';
import { logout } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../lib/utils';
import { AnimatePresence, motion } from 'motion/react';
import { useTaxNotifications } from '../hooks/useTaxNotifications';
import { BugReporterButton } from '../components/BugReporter';
import { useTour } from '../contexts/TourContext';
import { HelpCircle } from 'lucide-react';

import { NeoLogo } from '../components/NeoLogo';
import {
  PremiumDashboardIcon,
  PremiumHubIcon,
  PremiumExpensesIcon,
  PremiumInvoicesIcon,
  PremiumInventoryIcon,
  PremiumPayrollIcon,
  PremiumCashflowIcon,
  PremiumBankIcon,
  PremiumDeclarationsIcon,
  PremiumFinancialStatementsIcon,
  PremiumBilanIcon,
  PremiumDocumentsIcon,
  PremiumJournalIcon,
  PremiumCalendarIcon,
  PremiumSimulatorIcon,
  PremiumSettingsIcon,
  PremiumVaultIcon,
  PremiumSparklesIcon
} from '../components/PremiumIcons';

export function DashboardLayout() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { deadlines } = useTaxNotifications();
  const { startTour } = useTour();

  const navItems = [
    { path: '/dashboard', label: 'Vue d\'ensemble', icon: <PremiumDashboardIcon className="w-5 h-5" />, tourId: 'tour-dashboard' },
    { path: '/hub', label: 'Assistant Libriwouô (IA)', icon: <PremiumHubIcon className="w-5 h-5" />, tourId: 'tour-hub' },
    { path: '/expenses', label: 'Mes Dépenses', icon: <PremiumExpensesIcon className="w-5 h-5" />, tourId: 'tour-finances' },
    { path: '/invoices', label: 'Mes Ventes & Factures', icon: <PremiumInvoicesIcon className="w-5 h-5" />, tourId: 'tour-invoices' },
    { path: '/inventory', label: 'Mon Stock (Catalogue)', icon: <PremiumInventoryIcon className="w-5 h-5" />, tourId: 'tour-inventory' },
    { path: '/payroll', label: 'Mon Équipe', icon: <PremiumPayrollIcon className="w-5 h-5" />, tourId: 'tour-payroll' },
    { path: '/cashflow', label: 'Mon Argent', icon: <PremiumCashflowIcon className="w-5 h-5" />, tourId: 'tour-cashflow' },
    { path: '/bank', label: 'Ma Banque', icon: <PremiumBankIcon className="w-5 h-5" />, tourId: 'tour-bank' },
    { path: '/declarations', label: 'Mes Impôts (Déclarations)', icon: <PremiumDeclarationsIcon className="w-5 h-5" />, tourId: 'tour-declarations' },
    { path: '/financial-statements', label: 'Mes Rapports Simples', icon: <PremiumFinancialStatementsIcon className="w-5 h-5" />, tourId: 'tour-financial-statements' },
    { path: '/bilan', label: 'Mon Bilan de l\'Année', icon: <PremiumBilanIcon className="w-5 h-5" />, tourId: 'tour-bilan' },
    { path: '/documents', label: 'Mes Documents', icon: <PremiumDocumentsIcon className="w-5 h-5" />, tourId: 'tour-docs' },
    { path: '/journal', label: 'Mon Historique', icon: <PremiumJournalIcon className="w-5 h-5" />, tourId: 'tour-journal' },
    { path: '/calendar', label: 'Mon Calendrier', icon: <PremiumCalendarIcon className="w-5 h-5" />, tourId: 'tour-calendar' },
    { path: '/simulator', label: 'Le Simulateur', icon: <PremiumSimulatorIcon className="w-5 h-5" />, tourId: 'tour-simulator' },
    { path: '/settings', label: 'Mes Réglages', icon: <PremiumSettingsIcon className="w-5 h-5" />, tourId: 'tour-settings' },
    { path: '/vault', label: 'Mon Coffre-Fort', icon: <PremiumVaultIcon className="w-5 h-5" />, tourId: 'tour-vault' },
  ];

  const tourSteps = useMemo(() => [
    {
      target: '.neo-logo-container',
      content: 'Bienvenue sur Libriwouô ! Votre assistant Libriwouô est prêt à révolutionner votre gestion comptable.',
      title: 'Guide d\'Exploration',
      disableBeacon: true,
    },
    {
      target: '[data-tour="tour-balance"]',
      content: 'Visualisez instantanément votre Résultat Net. C\'est votre performance réelle après déduction de toutes les charges et taxes.',
      title: 'Cœur Financier',
    },
    {
      target: '[data-tour="tour-metrics-grid"]',
      content: 'Ici, surveillez vos revenus, vos dépenses et votre Santé Fiscale. Libriwouô calcule un score basé sur vos obligations.',
      title: 'Signaux Vitaux',
    },
    {
      target: '[data-tour="tour-deadlines"]',
      content: 'Ne manquez plus jamais un paiement. Vos échéances fiscales et notes personnelles sont centralisées ici.',
      title: 'Vigilance & Échéances',
    },
    {
      target: '[data-tour="tour-fiscal-details"]',
      content: 'Consultez la répartition précise de vos impôts (TVA, IS ou CME) pour une transparence totale.',
      title: 'Décomposition Fiscale',
    },
    {
      target: '[data-tour="tour-top-spending"]',
      content: 'Identifiez vos plus gros postes de dépenses en un clin d\'œil pour optimiser vos coûts.',
      title: 'Analyse des Charges',
    },
    {
      target: '[data-tour="tour-growth-chart"]',
      content: 'Analysez l\'évolution de votre trésorerie et de vos ventes. Repérez les saisonnalités pour mieux anticiper.',
      title: 'Trajectoire de Croissance',
    },
    {
      target: '[data-tour="tour-neo-echo"]',
      content: 'Une veille stratégique automatisée ! Libriwouô analyse le marché pour vous fournir des conseils personnalisés.',
      title: 'L\'Écho de Libriwouô',
    },
    {
      target: '[data-tour="tour-hub"]',
      content: 'Le cerveau de l\'App. Déposez vos factures, posez des questions fiscales, Libriwouô s\'occupe de tout.',
      title: 'Hub Intelligence Artificielle',
    },
    {
      target: '[data-tour="tour-finances"]',
      content: 'Gérez vos dépenses, scannez vos reçus et suivez vos fournisseurs avec une précision absolue.',
      title: 'Dépenses & Achats',
    },
    {
      target: '[data-tour="tour-invoices"]',
      content: 'Créez des factures élégantes et suivez les encaissements pour ne plus avoir d\'impayés.',
      title: 'Ventes & Revenus',
    },
    {
      target: '[data-tour="tour-inventory"]',
      content: 'Suivez vos stocks de marchandises et gérez vos catalogues d\'articles en temps réel.',
      title: 'Gestion de Stock',
    },
    {
      target: '[data-tour="tour-payroll"]',
      content: 'Gérez vos ressources humaines et générez des bulletins de paie conformes en quelques clics.',
      title: 'Social & Salaires',
    },
    {
      target: '[data-tour="tour-cashflow"]',
      content: 'Anticipez vos besoins de trésorerie avec une vision claire de votre cash-flow futur.',
      title: 'Trésorerie Prévisionnelle',
    },
    {
      target: '[data-tour="tour-bank"]',
      content: 'Connectez vos comptes bancaires et simplifiez votre rapprochement bancaire.',
      title: 'Banque & Flux',
    },
    {
      target: '[data-tour="tour-declarations"]',
      content: 'Générez et gérez vos déclarations fiscales mensuelles et annuelles selon la norme SYSCOHADA.',
      title: 'Déclarations Fiscales',
    },
    {
      target: '[data-tour="tour-docs"]',
      content: 'Accédez à tous vos documents fiscaux et formulaires de déclaration prévoyant vos taxes.',
      title: 'Conformité & Docs',
    },
    {
      target: '[data-tour="tour-calendar"]',
      content: 'Visualisez l\'ensemble de vos obligations sur une vue calendrier intuitive.',
      title: 'Calendrier des Échéances',
    },
    {
      target: '[data-tour="tour-simulator"]',
      content: 'Simulez l\'impact de vos décisions financières sur votre imposition future.',
      title: 'Simulation Fiscale',
    },
    {
      target: '[data-tour="tour-settings"]',
      content: 'Personnalisez votre expérience et configurez les détails de votre entreprise.',
      title: 'Paramétrage',
    },
    {
      target: '[data-tour="tour-vault"]',
      content: 'Votre coffre-fort sécurisé pour exporter vos données vers votre expert-comptable.',
      title: 'Coffre-fort Numérique',
    }
  ], []);

  const SidebarContent = () => {
    const { user } = useAuth();
    const isAdmin = user?.email === 'ulrichtapsoba2009@gmail.com';

    return (
      <>
        <div className="p-6 flex items-center justify-between neo-logo-container">
          <NeoLogo size="sm" />
          <button
            className="md:hidden p-2 text-gold-500/60 hover:text-gold-400"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4">
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <motion.div
                key={item.path}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.05, duration: 0.5, ease: "easeOut" }}
              >
                <Link
                  data-tour={item.tourId}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-300",
                    isActive
                      ? "bg-gold-500/10 text-gold-300 border border-border-subtle glow-gold"
                      : "text-zinc-400 hover:text-gold-100 hover:bg-bg-overlay"
                  )}
                >
                  <span className={cn("transition-colors", isActive ? "text-gold-400" : "text-zinc-500")}>
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              </motion.div>
            );
          })}

          {isAdmin && (
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: navItems.length * 0.05, duration: 0.5, ease: "easeOut" }}
            >
              <Link
                to="/admin-hub"
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 mt-6",
                  location.pathname === '/admin-hub'
                    ? "bg-red-500/10 text-red-300 border border-red-500/20"
                    : "text-red-400/60 hover:text-red-400 hover:bg-red-500/5"
                )}
              >
                <ShieldAlert className="w-4 h-4" />
                Administration
              </Link>
            </motion.div>
          )}
        </nav>

        <div className="p-4 border-t border-border-subtle flex flex-col gap-2">
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              startTour();
            }}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-gold-400 hover:bg-gold-500/10 transition-colors border border-gold-500/20"
          >
            <HelpCircle className="w-4 h-4" />
            Guide interactif
          </button>

          <button
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Déconnexion
          </button>
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-transparent text-gold-100 flex flex-col md:flex-row font-sans">
      {/* Mobile Header */}
      <header
        className="md:hidden flex items-center justify-between px-4 border-b border-border-subtle bg-luxury-900/80 backdrop-blur-xl sticky top-0 z-20 neo-logo-container"
        style={{ 
          paddingTop: 'env(safe-area-inset-top)',
          height: 'calc(env(safe-area-inset-top) + 64px)'
        }}
      >
        <NeoLogo size="sm" />
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-2 text-gold-500/60 hover:text-gold-400"
        >
          <Menu className="w-6 h-6" />
        </button>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 border-r border-border-subtle bg-luxury-900/50 backdrop-blur-xl flex-col sticky top-0 h-screen">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <div
        className={cn(
          "fixed inset-0 bg-black/80 backdrop-blur-sm z-30 md:hidden transition-opacity duration-300",
          isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsMobileMenuOpen(false)}
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 w-[280px] bg-luxury-800 border-r border-border-subtle flex flex-col z-40 md:hidden shadow-2xl transition-transform duration-300 ease-in-out",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        {deadlines.length > 0 && (
          <div className="mx-4 mt-4 p-4 rounded-xl bg-gold-500/10 border border-border-subtle text-gold-200 flex items-center gap-3">
            <Bell className="w-5 h-5" />
            <p className="text-sm font-sans">Attention : {deadlines.length} échéance(s) fiscale(s) approche(nt) !</p>
          </div>
        )}
        <Outlet />
        <BugReporterButton />
      </main>
    </div>
  );
}
