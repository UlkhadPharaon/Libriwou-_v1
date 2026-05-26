import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';
import { CompanionAvatar } from '../components/CompanionAvatar';
import { cn } from '../lib/utils';
import { useAuth } from './AuthContext';

interface TourContextType {
  startTour: () => void;
  setSteps: (steps: any[]) => void;
}

const TourContext = createContext<TourContextType | undefined>(undefined);

interface Slide {
  title: string;
  icon: () => React.JSX.Element;
  description: string;
  bullets: { label: string; desc: string }[];
}

// ==========================================
// PREMIUM FLAT DESIGN VECTOR SVG ICONS
// ==========================================

function CrownIcon() {
  return (
    <svg className="w-12 h-12 shrink-0 drop-shadow-[0_4px_12px_rgba(212,175,55,0.25)]" viewBox="0 0 100 100" fill="none">
      {/* Royal Indigo Shield Background */}
      <path d="M50 10 L85 20 V60 C85 75, 50 90, 50 90 C50 90, 15 75, 15 60 V20 Z" fill="#0D142C" stroke="#D4AF37" strokeWidth="2.5" />
      {/* Flat Gold Crown */}
      <path d="M30 63 L23 38 L38 48 L50 28 L62 48 L77 38 L70 63 Z" fill="url(#crownGold)" />
      {/* Crown base band */}
      <rect x="30" y="63" width="40" height="6" fill="#F3E5AB" rx="1.5" />
      {/* Little gems */}
      <circle cx="50" cy="24" r="3.5" fill="#E5C158" />
      <circle cx="21" cy="34" r="3" fill="#E5C158" />
      <circle cx="79" cy="34" r="3" fill="#E5C158" />
      <defs>
        <linearGradient id="crownGold" x1="25" y1="28" x2="75" y2="63">
          <stop stopColor="#E5C158" />
          <stop offset="0.5" stopColor="#D4AF37" />
          <stop offset="1" stopColor="#927722" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function AdvisorIcon() {
  return (
    <svg className="w-12 h-12 shrink-0 drop-shadow-[0_4px_12px_rgba(0,229,255,0.3)]" viewBox="0 0 100 100" fill="none">
      {/* Indigo Core Shield */}
      <circle cx="50" cy="50" r="40" fill="#0D142C" stroke="#00E5FF" strokeWidth="2.5" />
      {/* Glowing AI Orb */}
      <circle cx="50" cy="45" r="18" fill="url(#aiFlatGrad)" />
      {/* Planetary Orbit Ring */}
      <ellipse cx="50" cy="45" rx="24" ry="7" stroke="#D4AF37" strokeWidth="2" transform="rotate(-15 50 45)" />
      {/* Floating Cyan Energy Sparks */}
      <circle cx="26" cy="32" r="2" fill="#00E5FF" />
      <circle cx="74" cy="32" r="2" fill="#00E5FF" />
      <circle cx="50" cy="74" r="2.5" fill="#D4AF37" />
      <defs>
        <linearGradient id="aiFlatGrad" x1="32" y1="27" x2="68" y2="63">
          <stop stopColor="#E0F7FA" />
          <stop offset="0.4" stopColor="#00E5FF" />
          <stop offset="1" stopColor="#006064" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function ChestIcon() {
  return (
    <svg className="w-12 h-12 shrink-0 drop-shadow-[0_4px_12px_rgba(212,175,55,0.25)]" viewBox="0 0 100 100" fill="none">
      {/* Indigo Circular Base */}
      <circle cx="50" cy="50" r="40" fill="#0D142C" stroke="#D4AF37" strokeWidth="2.5" />
      {/* Wooden Chest body */}
      <rect x="25" y="44" width="50" height="30" fill="#5E3819" rx="4" stroke="#D4AF37" strokeWidth="1.5" />
      {/* Embossed Gold Lid */}
      <path d="M25 44 C25 28, 75 28, 75 44 Z" fill="url(#lidGold)" stroke="#D4AF37" strokeWidth="1.5" />
      {/* Heavy Gold Lock */}
      <rect x="46" y="41" width="8" height="12" fill="#F3E5AB" rx="1" />
      <circle cx="50" cy="45" r="1.5" fill="#0A0A0C" />
      {/* West African Tribal engravings */}
      <path d="M33 54 L39 63 L45 54" stroke="#D4AF37" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M55 54 L61 63 L67 54" stroke="#D4AF37" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <defs>
        <linearGradient id="lidGold" x1="25" y1="28" x2="75" y2="44">
          <stop stopColor="#E5C158" />
          <stop offset="0.5" stopColor="#D4AF37" />
          <stop offset="1" stopColor="#927722" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function CitadelIcon() {
  return (
    <svg className="w-12 h-12 shrink-0 drop-shadow-[0_4px_12px_rgba(212,175,55,0.25)]" viewBox="0 0 100 100" fill="none">
      {/* Fort circle */}
      <circle cx="50" cy="50" r="40" fill="#0D142C" stroke="#D4AF37" strokeWidth="2.5" />
      {/* Fortification Battlements */}
      <path d="M25 35 H34 V41 H44 V35 H54 V41 H64 V35 H75 V70 H25 Z" fill="#1A2548" />
      {/* Sovereign Shield */}
      <path d="M50 44 L68 50 V67 C68 75, 50 81, 50 81 C50 81, 32 75, 32 67 V50 Z" fill="url(#shieldGold)" stroke="#D4AF37" strokeWidth="1.5" />
      {/* Lock Keyhole */}
      <circle cx="50" cy="56" r="3" fill="#070B19" />
      <path d="M48 56 L52 56 L53 67 L47 67 Z" fill="#070B19" />
      <defs>
        <linearGradient id="shieldGold" x1="32" y1="50" x2="68" y2="81">
          <stop stopColor="#E5C158" />
          <stop offset="0.5" stopColor="#D4AF37" />
          <stop offset="1" stopColor="#927722" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function CauriBullet() {
  return (
    <svg className="w-4 h-4 shrink-0 mt-0.5 drop-shadow-[0_2px_4px_rgba(212,175,55,0.3)]" viewBox="0 0 100 100" fill="none">
      {/* Main shell body */}
      <path d="M50 15C32 15 25 35 25 50C25 65 32 85 50 85C68 85 75 65 75 50C75 35 68 15 50 15Z" 
        fill="url(#bulletGoldGrad)" stroke="#D4AF37" strokeWidth="2.5" />
      {/* Center slit */}
      <path d="M50 22V78" stroke="#050505" strokeWidth="4.5" strokeLinecap="round" />
      {/* Slit ridges / teeth */}
      <path d="M41 33H47 M41 45H47 M41 57H47 M41 68H47" stroke="#050505" strokeWidth="3" strokeLinecap="round" />
      <path d="M59 33H53 M59 45H53 M59 57H53 M59 68H53" stroke="#050505" strokeWidth="3" strokeLinecap="round" />
      <defs>
        <linearGradient id="bulletGoldGrad" x1="25" y1="15" x2="75" y2="85">
          <stop stopColor="#F3E5AB" />
          <stop offset="0.5" stopColor="#D4AF37" />
          <stop offset="1" stopColor="#927722" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function TourProvider({ children }: { children: React.ReactNode }) {
  const [run, setRun] = useState(false);
  const [steps, setLocalSteps] = useState<any[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const location = useLocation();

  // Stop tour when route changes
  useEffect(() => {
    setRun(false);
  }, [location.pathname]);

  const startTour = useCallback(() => {
    setCurrentSlide(0);
    setRun(true);
  }, []);

  const setSteps = useCallback((newSteps: any[]) => {
    setLocalSteps(newSteps);
  }, []);

  const { user } = useAuth();

  // Auto-start only ONCE on first login onboarding
  useEffect(() => {
    if (!user) return;
    
    const hasSeen = localStorage.getItem(`tour-seen-global`);
    if (!hasSeen) {
      const timer = setTimeout(() => {
        setCurrentSlide(0);
        setRun(true);
      }, 2500); // 2.5s delay after loading for a premium surprise effect
      return () => clearTimeout(timer);
    }
  }, [user]);

  const closeTour = () => {
    setRun(false);
    localStorage.setItem(`tour-seen-global`, 'true');
  };

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(prev => prev + 1);
    } else {
      closeTour();
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  const slides: Slide[] = [
    {
      title: "Le Trône du Dirigeant",
      icon: CrownIcon,
      description: "Bienvenue dans le cockpit de votre empire financier, Majesté ! Le tableau de bord centralise toutes vos performances de manière claire et instantanée.",
      bullets: [
        { label: "Bénéfice Net Réel", desc: "Votre argent restant après déduction automatique des charges et taxes burkinabè." },
        { label: "Vigilance Délais", desc: "Des alertes visuelles et des compte-jours pour vos prochaines déclarations fiscales." },
        { label: "Score de Santé Fiscale", desc: "Un indice de notation dynamique d'après la régularité de vos obligations." }
      ]
    },
    {
      title: "Le Conseiller Royal",
      icon: AdvisorIcon,
      description: "Libriwouô est votre cerveau fiscal et comptable souverain, disponible à chaque instant pour vous éclairer.",
      bullets: [
        { label: "Dialogue en Langue Naturelle", desc: "Posez toutes vos questions sur les lois fiscales burkinabè (TVA 18%, CME, IUTS)." },
        { label: "Saisie par Photo", desc: "Glissez ou photographiez un reçu, Libriwouô extrait les montants et rédige l'écriture comptable." },
        { label: "Réglement SYSCOHADA", desc: "Imputation comptable automatique des comptes et écritures de journal." }
      ]
    },
    {
      title: "Le Trésor de l'Empire",
      icon: ChestIcon,
      description: "Gardez un contrôle absolu sur chaque flux et ressource de votre coffre-fort fiscal.",
      bullets: [
        { label: "Dépenses & Achats", desc: "Enregistrez vos frais et conservez des copies numériques de vos reçus." },
        { label: "Facturation Express", desc: "Émettez des factures élégantes pour vos clients et suivez les encaissements." },
        { label: "Catalogue & Équipe", desc: "Gérez votre stock et éditez les bulletins de salaire conformes pour vos employés." }
      ]
    },
    {
      title: "La Citadelle Sécurisée",
      icon: CitadelIcon,
      description: "Vos données financières hautement confidentielles sont souveraines et restent sous votre unique garde.",
      bullets: [
        { label: "Souveraineté 100% Locale", desc: "Aucun cloud externe suspect. Vos données sont chiffrées en local (IndexedDB) sur votre appareil." },
        { label: "Paiements e-SaaS Locaux", desc: "Abonnements activés simplement en direct par Mobile Money (Orange Money, Wave, Moov)." },
        { label: "Exportations Préfet", desc: "Téléchargez des déclarations d'impôt au format Word (.docx) prêtes à déposer sur e-SINTAX." }
      ]
    }
  ];

  const slide = slides[currentSlide];

  return (
    <TourContext.Provider value={{ startTour, setSteps }}>
      {children}
      
      <AnimatePresence>
        {run && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            
            {/* Immersive Golden Glow background elements */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="bg-gradient-to-br from-luxury-800 to-luxury-900 border border-gold-500/30 rounded-[2.5rem] w-full max-w-4xl shadow-[0_25px_60px_rgba(212,175,55,0.2)] overflow-hidden relative"
            >
              {/* Close Button */}
              <button 
                onClick={closeTour}
                className="absolute top-6 right-6 p-2 rounded-full bg-black/30 border border-white/5 text-zinc-400 hover:text-gold-400 transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-12 h-full min-h-[480px]">
                
                {/* Left Side: Mascot Avatar and Royal Frame */}
                <div className="md:col-span-5 bg-black/30 border-r border-gold-500/10 p-8 flex flex-col items-center justify-center text-center relative">
                  <div className="absolute inset-0 bg-radial-gradient from-gold-500/5 to-transparent pointer-events-none" />
                  
                  {/* Giant animated companion statuette */}
                  <CompanionAvatar 
                    className="w-44 h-44 md:w-48 md:h-48 drop-shadow-[0_12px_24px_rgba(0,229,255,0.2)] mb-6" 
                    animated={true} 
                  />
                  
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h4 className="font-serif text-2xl font-bold text-gold-300 tracking-wide mb-1 uppercase">Libriwouô</h4>
                    <p className="text-[10px] uppercase tracking-[0.25em] text-zinc-500 font-bold font-sans">Votre Conseiller Royal</p>
                  </motion.div>
                </div>

                {/* Right Side: Presentation Content */}
                <div className="md:col-span-7 p-8 flex flex-col justify-between h-full min-h-[480px]">
                  
                  {/* Slide Content Area */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentSlide}
                      initial={{ opacity: 0, x: 15 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -15 }}
                      transition={{ duration: 0.25 }}
                      className="flex-1 flex flex-col justify-center"
                    >
                      {/* Step counter */}
                      <span className="text-[10px] font-bold text-gold-500 tracking-[0.3em] uppercase mb-2 font-mono block">
                        Conseil {currentSlide + 1} sur {slides.length}
                      </span>
                      
                      <div className="flex items-center gap-4 mb-4">
                        <slide.icon />
                        <h2 className="text-2xl md:text-3xl font-serif text-text-title font-bold leading-tight">
                          {slide.title}
                        </h2>
                      </div>
                      
                      <p className="text-sm text-zinc-400 leading-relaxed mb-6 font-medium">
                        {slide.description}
                      </p>

                      {/* Bullet points */}
                      <ul className="space-y-3.5">
                        {slide.bullets.map((bullet, idx) => (
                          <li key={idx} className="flex items-start gap-3 group">
                            <CauriBullet />
                            <div>
                              <strong className="text-gold-200 text-xs font-bold font-serif group-hover:text-gold-300 transition-colors">
                                {bullet.label}
                              </strong>
                              <span className="text-zinc-500 text-xs font-medium block mt-0.5 leading-relaxed">
                                {bullet.desc}
                              </span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  </AnimatePresence>

                  {/* Navigation footer */}
                  <div className="flex items-center justify-between pt-6 border-t border-white/5 mt-6">
                    
                    {/* Previous Button */}
                    <button
                      onClick={prevSlide}
                      disabled={currentSlide === 0}
                      className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-gold-400 transition-colors disabled:opacity-0 disabled:pointer-events-none"
                    >
                      <ChevronLeft className="w-4 h-4" /> Précédent
                    </button>

                    {/* Pagination Dots */}
                    <div className="flex items-center gap-2">
                      {slides.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentSlide(idx)}
                          className={cn(
                            "w-2.5 h-2.5 rounded-full border border-gold-500/30 transition-all duration-300",
                            currentSlide === idx 
                              ? "bg-gold-500 shadow-[0_0_8px_rgba(212,175,55,0.6)] w-6" 
                              : "bg-transparent hover:bg-gold-500/25"
                          )}
                        />
                      ))}
                    </div>

                    {/* Next/Finish Button */}
                    <button
                      onClick={nextSlide}
                      className="flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-gold-500 to-gold-400 text-zinc-900 hover:shadow-[0_0_20px_rgba(212,175,55,0.45)] transition-all text-[10px] font-bold uppercase tracking-widest rounded-xl"
                    >
                      {currentSlide === slides.length - 1 ? "Commencer" : "Suivant"} <ChevronRight className="w-4 h-4" />
                    </button>

                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </TourContext.Provider>
  );
}

export function useTour() {
  const context = useContext(TourContext);
  if (context === undefined) {
    throw new Error('useTour must be used within a TourProvider');
  }
  return context;
}
