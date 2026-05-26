import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { collection, query, where, onSnapshot, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { useTour } from '../contexts/TourContext';
import { calculateTaxes, TaxCalculation, TaxRegime } from '../lib/tax-rules';
import { ExtractedTransaction } from '../services/nim';
import { fetchDailyIntelligence, IntelligenceNews } from '../services/intelligence';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from 'recharts';
import { Calendar, Sparkles, TrendingUp, TrendingDown, Clock, ArrowUpRight, Wallet, User, Bell, Download, Briefcase, Gavel, Newspaper, RefreshCcw, Loader2, ChevronRight, Activity, PieChart, ExternalLink, Bot, Plus, FileText, Scan, Zap, Target, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { CompanionAvatar } from '../components/CompanionAvatar';
import {
  PremiumScanIcon,
  PremiumPlusIcon,
  PremiumBotIcon,
  PremiumCalendarIcon,
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
  PremiumSimulatorIcon,
  PremiumSettingsIcon,
  PremiumVaultIcon,
  PremiumSparklesIcon
} from '../components/PremiumIcons';

export function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { setSteps } = useTour();
  const [transactions, setTransactions] = useState<ExtractedTransaction[]>([]);
  
  useEffect(() => {
    setSteps([
      {
        target: '.neo-logo-container',
        content: 'Bienvenue sur Libriwouô ! Libriwouô est votre assistant comptable. Commençons par une visite rapide du tableau de bord.',
        title: 'Tableau de bord',
        skipBeacon: true,
      },
      {
        target: '[data-tour="tour-profit"]',
        content: 'Ici s\'affiche votre résultat net estimé, après déduction des charges et taxes applicables.',
        title: 'Cœur Financier',
      },
      {
        target: '[data-tour="tour-deadlines"]',
        content: 'Gardez un œil sur vos prochaines échéances fiscales et objectifs ici pour ne rien manquer.',
        title: 'Vigilance & Échéances',
      }
    ]);
  }, [setSteps]);
  const [company, setCompany] = useState<any>(null);
  const [taxData, setTaxData] = useState<TaxCalculation | null>(null);
  const [nextDeadline, setNextDeadline] = useState<any>(null);
  
  const [intelligence, setIntelligence] = useState<IntelligenceNews[]>([]);
  const [intelPage, setIntelPage] = useState(0);
  const [loadingIntel, setLoadingIntel] = useState(false);
  
  const [periodMode, setPeriodMode] = useState<'mensuel' | 'trimestriel' | 'annuel'>('mensuel');

  useEffect(() => {
    if (!user) return;

    const unsubscribeCompany = onSnapshot(doc(db, 'companies', user.uid), (docSnap) => {
      if (docSnap.exists()) {
        const compData = docSnap.data();
        setCompany(compData);
        
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();
        
        if (compData.taxRegime === 'RSI' || compData.taxRegime === 'RNI') {
          const nextTva = new Date(year, month, 20);
          if (today.getDate() > 20) nextTva.setMonth(month + 1);
          setNextDeadline({ title: 'Déclaration TVA (G50)', date: nextTva, priority: 'HIGH' });
        } else if (compData.taxRegime === 'CME') {
          const nextCme = new Date(year, month, 10);
          if (today.getDate() > 10) nextCme.setMonth(month + 1);
          setNextDeadline({ title: 'Paiement CME', date: nextCme, priority: 'MEDIUM' });
        }
      }
    });

    const q = query(collection(db, 'transactions'), where('userId', '==', user.uid));
    const unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
      const txs = snapshot.docs.map(doc => doc.data() as ExtractedTransaction);
      setTransactions(txs);
    });

    return () => {
      unsubscribeCompany();
      unsubscribeSnapshot();
    };
  }, [user]);

  useEffect(() => {
    if (company && transactions) {
      const revenue = transactions.filter(t => t.type === 'INCOME').reduce((acc, t) => acc + (Number(t.amountExclTax) || 0), 0);
      const expenses = transactions.filter(t => t.type === 'EXPENSE').reduce((acc, t) => acc + (Number(t.amountExclTax) || 0), 0);
      const grossPayroll = transactions.filter(t => t.type === 'PAYROLL').reduce((acc, t) => acc + (Number((t as any).payrollDetails?.grossSalary) || 0), 0);
      
      const taxes = calculateTaxes(revenue, expenses, company.taxRegime as TaxRegime, company.sector?.toLowerCase().includes('service') ?? true, 12, grossPayroll);
      setTaxData(taxes);
    }
  }, [company, transactions]);

  useEffect(() => {
    if (company && company.sector) {
      const today = new Date().toISOString().split('T')[0];
      const intelRef = collection(db, 'intelligence_feed');
      const q = query(intelRef, where("date", "==", today));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const allNews = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as IntelligenceNews))
          .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
        const relevantNews = allNews.filter(news => 
          news.targetSectors.includes('GLOBAL') || 
          news.targetSectors.includes(company.sector)
        );
        
        if (relevantNews.length > 0) {
          setIntelligence(relevantNews);
          // Optional: reset page to 0 if data changes significantly
        } else {
          refreshIntelligence();
        }
      });

      return () => unsubscribe();
    }
  }, [company?.sector]);

  const refreshIntelligence = async (force: boolean = false) => {
    if (!company) return;
    setLoadingIntel(true);
    try {
      await fetchDailyIntelligence(company.sector, force);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingIntel(false);
    }
  };

  const handleNextIntelPage = () => {
    if (intelligence.length > (intelPage + 1) * 5) {
      setIntelPage(p => p + 1);
    } else {
      setIntelPage(0);
    }
  };

  const interactiveChartData = useMemo(() => {
    const dataMap = new Map<string, { name: string, Revenus: number, Dépenses: number, Bénéfice: number }>();
    const currentYear = new Date().getFullYear();

    if (periodMode === 'mensuel') {
      const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
      months.forEach((m, i) => dataMap.set(String(i), { name: m, Revenus: 0, Dépenses: 0, Bénéfice: 0 }));
    } else if (periodMode === 'trimestriel') {
      ['T1', 'T2', 'T3', 'T4'].forEach(q => dataMap.set(q, { name: q, Revenus: 0, Dépenses: 0, Bénéfice: 0 }));
    }

    transactions.forEach(t => {
      const d = new Date(t.date);
      if (isNaN(d.getTime())) return;
      
      const year = d.getFullYear();
      const month = d.getMonth();
      const amount = Number(t.amountExclTax) || 0;

      let key = '';
      if (periodMode === 'mensuel') {
        if (year !== currentYear) return;
        key = String(month);
      } else if (periodMode === 'trimestriel') {
        if (year !== currentYear) return;
        const q = Math.floor(month / 3) + 1;
        key = `T${q}`;
      } else if (periodMode === 'annuel') {
        key = String(year);
        if (!dataMap.has(key)) {
          dataMap.set(key, { name: key, Revenus: 0, Dépenses: 0, Bénéfice: 0 });
        }
      }

      if (dataMap.has(key)) {
        const item = dataMap.get(key)!;
        if (t.type === 'INCOME') item.Revenus += amount;
        else if (t.type === 'EXPENSE' || t.type === 'PAYROLL') item.Dépenses += amount;
      }
    });

    const result = Array.from(dataMap.values());
    result.forEach(item => item.Bénéfice = item.Revenus - item.Dépenses);
    if (periodMode === 'annuel') result.sort((a, b) => parseInt(a.name) - parseInt(b.name));
    return result;
  }, [transactions, periodMode]);

  const revenue = transactions.filter(t => t.type === 'INCOME').reduce((acc, t) => acc + (Number(t.amountExclTax) || 0), 0);
  const expenses = transactions.filter(t => t.type === 'EXPENSE' || t.type === 'PAYROLL').reduce((acc, t) => acc + (Number(t.amountExclTax) || 0), 0);
  const totalTax = (taxData?.cmeAmount || 0) + (taxData?.isAmount || 0) + (taxData?.tvaAmount || 0);

  const getHealthScore = () => {
    if (revenue === 0 && expenses === 0) return { score: 100, status: 'EXCELLENT', color: 'text-money-400', bg: 'bg-money-500/10' };
    const margin = revenue === 0 ? -1 : (revenue - expenses) / revenue;
    
    let score = 50;
    if (margin > 0.3) score = 90 + Math.min(10, (margin - 0.3) * 50);
    else if (margin > 0) score = 60 + (margin / 0.3) * 30;
    else if (margin === 0) score = 50;
    else score = Math.max(0, 50 + margin * 100);

    score = Math.floor(score);
    if (score >= 80) return { score, status: 'TRÈS BON', color: 'text-money-400', bg: 'bg-money-500/10' };
    if (score >= 50) return { score, status: 'CORRECT', color: 'text-gold-500', bg: 'bg-gold-500/10' };
    return { score, status: 'DANGER', color: 'text-red-400', bg: 'bg-red-500/10' };
  };

  const topSpending = useMemo(() => {
    const spendByCategory = transactions
      .filter(t => t.type === 'EXPENSE' || t.type === 'PAYROLL')
      .reduce((acc: any, t) => {
          acc[t.category] = (acc[t.category] || 0) + Number(t.amountExclTax);
          return acc;
      }, {});
    const maxVal = Math.max(...Object.values(spendByCategory) as number[], 1);
    
    return Object.entries(spendByCategory)
      .sort((a: any, b: any) => b[1] - a[1])
      .slice(0, 3)
      .map(([name, value]) => ({ name, value: value as number, percent: ((value as number) / maxVal) * 100 }));
  }, [transactions]);

  const health = getHealthScore();
  const formatXOF = (val: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(val);

  const quickActions = [
    { title: 'Scanner Facture', icon: PremiumScanIcon, path: '/scan', color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { title: 'Nouvelle Facture', icon: PremiumPlusIcon, path: '/invoices', color: 'text-gold-400', bg: 'bg-gold-500/10' },
    { title: 'Consulter Libriwouô', icon: PremiumBotIcon, path: '/hub', color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { title: 'Régler Échéance', icon: PremiumCalendarIcon, path: '/calendar', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bonjour Majesté. L'aube se lève sur votre empire, faisons fructifier vos richesses aujourd'hui.";
    if (hour < 18) return "Bonjour Majesté. L'après-midi bat son plein, surveillons ensemble la croissance de vos affaires.";
    return "Bonsoir Majesté. La journée a été fructueuse, voici le bilan en temps réel de votre souveraineté financière.";
  };

  const greeting = getGreeting();

  return (
    <div className="p-4 md:p-8 max-w-[1500px] mx-auto space-y-8">
      
      {/* Immersive Welcome Header Card */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: "spring", bounce: 0.15 }}
        className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-luxury-800 to-luxury-900 border border-gold-500/20 p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.35)] flex flex-col xl:flex-row gap-6 items-center"
      >
        {/* Glow ambient background spheres */}
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-gold-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />

        {/* Mascot companion avatar */}
        <div className="relative shrink-0 group cursor-pointer">
          <div className="absolute -inset-1.5 rounded-[1.8rem] bg-gradient-to-r from-gold-500 to-cyan-400 opacity-20 group-hover:opacity-40 transition-opacity blur duration-700" />
          <CompanionAvatar className="w-24 h-24 md:w-28 md:h-28 text-blue-500 drop-shadow-2xl" animated={true} />
        </div>

        {/* Dynamic royal dialog balloon */}
        <div className="flex-1 text-center xl:text-left z-10">
          <div className="relative inline-block px-3 py-1 rounded-full bg-gold-500/10 text-gold-500 border border-gold-500/20 text-[9px] font-bold uppercase tracking-[0.2em] mb-3">
             Libriwouô • Votre Conseiller Royal
          </div>
          <h1 className="text-3xl md:text-4xl font-serif text-text-title font-bold tracking-tight mb-2 uppercase">
            {company?.companyName || 'Votre Espace Privé'}
          </h1>
          <p className="text-sm text-zinc-400 font-medium leading-relaxed font-sans max-w-2xl">
            "{greeting}"
          </p>
        </div>

        {/* Actions bar on the right side of card */}
        <div className="grid grid-cols-2 sm:flex xl:grid xl:grid-cols-2 xl:flex-none gap-3 w-full xl:w-auto shrink-0 z-10">
           {quickActions.map(action => (
             <Link 
               key={action.title}
               to={action.path}
               className="flex-1 sm:flex-none flex items-center justify-center px-5 py-3.5 rounded-2xl bg-luxury-900/60 border border-border-subtle text-zinc-300 hover:text-gold-300 hover:border-gold-500/30 transition-all font-bold text-[10px] uppercase tracking-widest shadow-lg font-sans"
             >
               {action.title}
             </Link>
           ))}
        </div>
      </motion.div>

      {/* 1. ROW OF METRICS: Minimalist, Symmetric luxury cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        
        {/* Card 1: Chiffre d'Affaires */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="p-4 md:p-6 rounded-2xl md:rounded-[2rem] bg-luxury-800/40 border border-border-subtle hover:border-gold-500/20 transition-all flex flex-col justify-between"
        >
          <div>
            <div className="text-zinc-500 mb-2 md:mb-4 text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] md:tracking-[0.25em] font-serif">
              Chiffre d'Affaires
            </div>
            <div className="text-lg md:text-2.5xl font-extrabold text-text-title tracking-tight font-mono">
              {formatXOF(revenue)}
            </div>
          </div>
          <div className="mt-2 md:mt-4 text-[8px] md:text-[10px] text-zinc-500 font-medium hidden md:block">L'argent encaissé (ventes cumulées)</div>
        </motion.div>

        {/* Card 2: Dépenses */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="p-4 md:p-6 rounded-2xl md:rounded-[2rem] bg-luxury-800/40 border border-border-subtle hover:border-red-500/20 transition-all flex flex-col justify-between"
        >
          <div>
            <div className="text-zinc-500 mb-2 md:mb-4 text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] md:tracking-[0.25em] font-serif">
              Charges & Achats
            </div>
            <div className="text-lg md:text-2.5xl font-extrabold text-text-title tracking-tight font-mono">
              {formatXOF(expenses)}
            </div>
          </div>
          <div className="mt-2 md:mt-4 text-[8px] md:text-[10px] text-zinc-500 font-medium hidden md:block">Total de vos dépenses opérationnelles</div>
        </motion.div>

        {/* Card 3: Bénéfice Net Réel */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="p-4 md:p-6 rounded-2xl md:rounded-[2rem] bg-luxury-800/40 border border-border-subtle hover:border-gold-500/20 transition-all flex flex-col justify-between"
          data-tour="tour-profit"
        >
          <div>
            <div className="text-zinc-500 mb-2 md:mb-4 text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] md:tracking-[0.25em] font-serif">
              Bénéfice Net Réel
            </div>
            <div className="text-lg md:text-2.5xl font-extrabold text-money-400 tracking-tight font-mono">
              {formatXOF(taxData?.netIncome || 0)}
            </div>
          </div>
          <div className="mt-2 md:mt-4 text-[8px] md:text-[10px] text-zinc-500 font-medium hidden md:block">
            Marge de {Math.max(0, Math.min(100, (taxData?.netIncome || 0) / (revenue || 1) * 100)).toFixed(1)}%
          </div>
        </motion.div>

        {/* Card 4: Indice de Santé Fiscale */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="p-4 md:p-6 rounded-2xl md:rounded-[2rem] bg-luxury-800/40 border border-border-subtle hover:border-money-500/20 transition-all flex flex-col justify-between"
        >
          <div>
            <div className="flex justify-between items-baseline mb-2 md:mb-4">
              <span className="text-zinc-500 text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] md:tracking-[0.25em] font-serif">Santé Fiscale</span>
              <span className="text-[7px] md:text-[9px] font-bold text-money-400 font-mono tracking-wider hidden md:inline">{company?.taxRegime || 'RÉGIME'}</span>
            </div>
            <div className="text-lg md:text-2.5xl font-extrabold text-text-title tracking-tight font-mono flex items-baseline gap-1">
              {health.score} <span className="text-[8px] md:text-xs text-zinc-500 font-bold">/ 100</span>
            </div>
          </div>
          <div className="mt-2 md:mt-4 text-[8px] md:text-[10px] text-zinc-500 font-medium hidden md:block">Vigilance : {health.status}</div>
        </motion.div>
      </div>

      {/* 2. SPLIT LAYOUT: Graph on the left, Deadlines & Growth on the right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Section: 2/3 of space (lg:col-span-8) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Growth & Cashflow Chart */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="p-4 md:p-8 rounded-2xl md:rounded-[2.5rem] bg-luxury-800/40 border border-border-subtle shadow-xl flex flex-col h-[400px] md:h-[500px]"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 md:mb-10 gap-4">
              <div>
                <h3 className="text-lg md:text-xl font-serif text-text-title">
                  L'évolution de mon activité
                </h3>
                <p className="text-[10px] md:text-xs text-zinc-500 mt-1">Flux monétaires au fil du temps.</p>
              </div>
              <div className="flex bg-luxury-900 p-1 rounded-xl md:rounded-2xl border border-border-subtle shadow-inner">
                {['mensuel', 'trimestriel', 'annuel'].map((mode) => (
                  <button 
                    key={mode}
                    onClick={() => setPeriodMode(mode as any)} 
                    className={cn("px-3 md:px-6 py-1.5 md:py-2.5 text-[8px] md:text-[10px] font-bold uppercase tracking-widest rounded-lg md:rounded-xl transition-all", periodMode === mode ? 'bg-gold-500 text-zinc-900 shadow-lg' : 'text-zinc-500 hover:text-text-title')}
                  >
                    {mode.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex-1 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={interactiveChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,175,55,0.03)" vertical={false} />
                  <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="name" 
                    stroke="#3f3f46" 
                    fontSize={9} 
                    tickLine={false} 
                    axisLine={false} 
                    dy={10} 
                    tick={{ fill: '#71717a', fontWeight: 'bold' }}
                  />
                  <YAxis hide domain={['auto', 'auto']} />
                  <Tooltip 
                    cursor={{ stroke: 'rgba(212,175,55,0.2)', strokeWidth: 1.5, strokeDasharray: '6 6' }}
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-luxury-900 border border-gold-500/20 p-3 rounded-xl shadow-2xl backdrop-blur-xl">
                            <p className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest mb-2 border-b border-white/5 pb-1">{label}</p>
                            <div className="space-y-2">
                              {payload.map((entry: any, index: number) => (
                                <div key={index} className="flex items-center justify-between gap-4">
                                  <div className="flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: entry.color }} />
                                    <span className="text-[10px] text-zinc-400 font-medium">{entry.name}</span>
                                  </div>
                                  <span className="text-[10px] font-bold text-text-title font-mono">{formatXOF(entry.value)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area type="monotone" dataKey="Revenus" stroke="#D4AF37" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" activeDot={{ r: 6, strokeWidth: 0, fill: '#D4AF37' }} />
                  <Area type="monotone" dataKey="Bénéfice" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorProfit)" activeDot={{ r: 4, strokeWidth: 0, fill: '#10b981' }} />
                  <ReferenceLine y={0} stroke="#3f3f46" strokeWidth={1} strokeDasharray="3 3" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Expense Category Breakdown */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] bg-luxury-800/40 border border-border-subtle shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-serif text-text-title">Où part mon argent ?</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                {topSpending.map((cat, idx) => (
                  <div key={cat.name} className="group p-4 rounded-xl bg-luxury-900/40 border border-white/5">
                     <div className="flex justify-between items-center mb-2">
                        <span className="text-[9px] md:text-[11px] font-bold text-zinc-400 uppercase tracking-wider group-hover:text-gold-500 transition-colors truncate max-w-[100px] md:max-w-[120px]">{cat.name || 'Général'}</span>
                        <span className="text-[10px] md:text-xs font-bold text-text-title font-mono">{formatXOF(cat.value)}</span>
                     </div>
                     <div className="h-1.5 md:h-2 w-full bg-luxury-900 rounded-full overflow-hidden shadow-inner border border-white/5">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${cat.percent}%` }}
                          transition={{ duration: 1.5, delay: idx * 0.2 }}
                          className={cn("h-full rounded-full", idx === 0 ? "bg-red-400" : idx === 1 ? "bg-orange-400" : "bg-gold-500")} 
                        />
                     </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5">
              <button onClick={() => navigate('/journal')} className="w-full flex items-center justify-between text-[10px] font-bold text-zinc-500 hover:text-text-title transition-colors uppercase tracking-widest group">
                 Voir l'historique
                 <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Right Section: 1/3 of space (lg:col-span-4) */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Deadlines & Priorities Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] bg-luxury-800/40 border border-border-subtle shadow-xl flex flex-col"
          >
            <div className="flex justify-between items-center mb-6">
               <h3 className="font-bold text-text-title text-[10px] uppercase tracking-[0.2em] font-serif">
                 Échéances
               </h3>
               <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            </div>

            <div className="space-y-3">
              {nextDeadline && (
                 <div className="p-4 rounded-2xl bg-luxury-900/60 border border-border-subtle relative overflow-hidden shadow-inner group cursor-pointer hover:border-gold-500/30 transition-all">
                    <div className="flex items-start gap-4 mb-3">
                       <div>
                          <p className="text-xs font-bold text-text-title mb-1 uppercase tracking-wide font-serif text-gold-300">{nextDeadline.title}</p>
                          <p className="text-[9px] text-zinc-500 font-mono">Date : {new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'long' }).format(nextDeadline.date)}</p>
                       </div>
                    </div>
                    <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                       <motion.div initial={{ width: 0 }} animate={{ width: '65%' }} className={cn("h-full", nextDeadline.priority === 'HIGH' ? 'bg-red-500' : 'bg-gold-500')} />
                    </div>
                 </div>
              )}
            </div>
            
            <button onClick={() => navigate('/calendar')} className="mt-6 w-full py-3 rounded-xl bg-luxury-900/60 border border-border-subtle text-[9px] font-bold text-zinc-500 hover:text-text-title transition-all uppercase tracking-widest font-sans">
               CALENDRIER
            </button>
          </motion.div>

          {/* Tax Optimizations Shortcuts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] bg-gradient-to-br from-luxury-800 to-luxury-900 border border-gold-500/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative overflow-hidden flex flex-col justify-between group"
          >
             <div>
               <div className="text-zinc-500 mb-2 md:mb-4 text-[8px] md:text-[10px] font-bold uppercase tracking-[0.25em] font-serif">Optimisation</div>
               <h4 className="text-lg md:text-xl font-serif text-text-title font-bold tracking-tight mb-2 uppercase">Réduction Fiscale</h4>
             </div>
             
             <Link to="/simulator" className="flex items-center justify-between text-gold-500 transition-all font-bold text-[10px] tracking-wide mt-4">
               <span>LANCER</span>
               <div className="w-6 h-6 rounded-full bg-gold-500/10 flex items-center justify-center group-hover:translate-x-1 group-hover:bg-gold-500/20 transition-all">
                 <ArrowRight className="w-3.5 h-3.5" />
               </div>
             </Link>
          </motion.div>
        </div>
      </div>

      {/* Intelligence Feed Section */}
      <section className="mt-16 pb-12">
         <div className="flex flex-col md:flex-row items-baseline justify-between mb-10 gap-4">
           <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 text-gold-500 border border-gold-500/20 text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
                 Actualités pour mon métier
              </div>
              <h2 className="text-3xl font-serif text-text-title">
                 L'actualité pour moi
              </h2>
           </div>
           <button 
             onClick={() => refreshIntelligence(true)}
             disabled={loadingIntel}
             className="px-6 py-4 rounded-2xl bg-luxury-800/80 text-gold-500 border border-border-subtle hover:bg-gold-500/10 transition-all font-bold text-[10px] uppercase tracking-widest shadow-xl disabled:opacity-50"
           >
             {loadingIntel ? "Chargement..." : "Chercher de nouveaux conseils"}
           </button>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loadingIntel && intelligence.length === 0 ? (
               <div className="col-span-full py-24 flex flex-col items-center justify-center text-zinc-500">
                  <div className="relative mb-8">
                    <div className="absolute inset-0 bg-gold-500/20 blur-3xl rounded-full" />
                    <Loader2 className="w-12 h-12 animate-spin text-gold-500 relative z-10" />
                  </div>
                  <p className="text-sm font-medium">Libriwouô analyse ce qui se passe dans votre métier...</p>
               </div>
            ) : intelligence.length > 0 ? (
               intelligence.slice(intelPage * 5, (intelPage + 1) * 5).map((news) => (
                 <div key={news.id} className="p-8 rounded-[2.5rem] bg-luxury-800/60 border border-border-subtle hover:border-gold-500/30 hover:shadow-2xl transition-all duration-500 flex flex-col h-full group relative overflow-hidden">
                    <div className="absolute -top-12 -right-12 w-32 h-32 bg-gold-500/5 blur-3xl rounded-full group-hover:bg-gold-500/10 transition-all" />
                    
                    <div className="flex items-center justify-between mb-8">
                      <div className={cn(
                        "px-4 py-1.5 rounded-xl text-[10px] font-bold border uppercase tracking-widest",
                        news.category === 'OPPORTUNITY' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                        news.category === 'FISCAL' ? "bg-red-500/10 text-red-500 border-red-500/20" :
                        "bg-gold-500/10 text-gold-400 border-gold-500/20"
                      )}>
                         {news.category === 'OPPORTUNITY' ? 'OPPORTUNITÉ' : 
                          news.category === 'FISCAL' ? 'FISCALITÉ' : 
                          news.category === 'MARKET' ? 'MARCHÉ' : 'TECH'}
                      </div>
                      <span className="text-[10px] text-zinc-500 font-bold font-mono tracking-tighter">{new Date(news.date).toLocaleDateString('fr-FR')}</span>
                    </div>
                    
                    <h3 className="text-xl font-serif text-text-title mb-4 leading-snug group-hover:text-gold-500 transition-colors">
                      {news.title}
                    </h3>
                    <p className="text-sm text-zinc-400 flex-1 mb-8 leading-relaxed line-clamp-3">
                      {news.excerpt}
                    </p>
                    
                    <div className="mt-auto flex flex-col gap-3">
                      {news.url && (
                         <a 
                           href={news.url} 
                           target="_blank" 
                           rel="noreferrer" 
                           className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl bg-luxury-900 text-xs font-bold text-zinc-300 border border-border-subtle hover:text-text-title hover:bg-gold-500/10 hover:border-gold-500/20 transition-all"
                         >
                           LIRE L'ARTICLE <ExternalLink className="w-3.5 h-3.5" />
                         </a>
                      )}
                      <button
                         onClick={() => navigate(`/hub?q=Je veux en savoir plus sur cette actualité : ${encodeURIComponent(news.title)}`)}
                         className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl bg-gold-500 text-zinc-900 text-[10px] font-bold uppercase tracking-widest hover:bg-gold-400 transition-all shadow-lg shadow-gold-500/10"
                      >
                         Demander à Libriwouô d'expliquer
                      </button>
                    </div>
                 </div>
               ))
            ) : (
               <div className="col-span-full py-24 flex flex-col items-center justify-center text-zinc-500 border border-dashed border-border-subtle rounded-[2.5rem] bg-luxury-900/10">
                  <p className="text-sm font-medium mb-6">Il n'y a pas de nouvelle information marquante pour votre métier aujourd'hui.</p>
                  <button 
                   onClick={() => refreshIntelligence(true)} 
                   className="px-8 py-3 rounded-2xl bg-gold-500 text-zinc-900 font-bold text-[10px] uppercase tracking-widest hover:bg-gold-400 transition-all"
                  >
                    Chercher à nouveau
                  </button>
               </div>
            )}
         </div>
      </section>
    </div>
  );
}
