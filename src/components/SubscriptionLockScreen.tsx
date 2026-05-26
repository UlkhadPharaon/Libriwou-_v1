import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, RefreshCw, KeyRound, Smartphone, CheckCircle2, ChevronRight, Lock } from 'lucide-react';
import { NeoLogo } from './NeoLogo';

export function SubscriptionLockScreen() {
  const { user, subscriptionExpiry, checkSubscription, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'payment'>('info');
  const [selectedProvider, setSelectedProvider] = useState<'orange' | 'wave' | 'moov' | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleRefresh = async () => {
    setLoading(true);
    await checkSubscription();
    // Also trigger profile check
    await refreshProfile();
    setTimeout(() => setLoading(false), 800);
  };

  const handleSimulatePayment = async () => {
    if (!selectedProvider || !phoneNumber) return;
    setLoading(true);
    
    // In a real app, this triggers an Orange Money / Wave / Moov Push API call (USSD/OTP).
    // Here we make a call to the mock backend api/license to simulate activation!
    try {
      // If we use the email directly, it will activate it. If they want to test expired, they type expired.
      // We pass the email to our local login simulation to refresh, but for this demo we'll directly hit a mock activation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate success: set state
      setPaymentSuccess(true);
      
      // Call auth refresh with clean email (removing expired if they had it)
      if ((window as any).FirebaseMockAuth) {
         // Clear mock expiration
      }
      
      // Force active license in auth local cache for instant unlock
      const cached = localStorage.getItem("neocompta_subscription_metadata");
      if (cached) {
        const data = JSON.parse(cached);
        const nextYear = new Date();
        nextYear.setFullYear(nextYear.getFullYear() + 1);
        data.active = true;
        data.expiry = nextYear.toISOString();
        localStorage.setItem("neocompta_subscription_metadata", JSON.stringify(data));
      }
      
      await checkSubscription();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-luxury-900 flex flex-col items-center justify-center p-6 font-sans overflow-y-auto selection:bg-gold-500/30">
      
      {/* Subtle top golden light glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-gold-500/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-lg bg-luxury-800/80 backdrop-blur-2xl border border-border-subtle p-8 rounded-3xl glow-gold shadow-2xl relative overflow-hidden"
      >
        
        {/* Header Logo */}
        <div className="flex flex-col items-center mb-8">
          <NeoLogo size="md" />
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: [0.8, 1.05, 1] }}
            transition={{ repeat: Infinity, repeatDelay: 5, duration: 1 }}
            className="flex items-center gap-2 mt-4 px-3 py-1 bg-red-500/10 border border-red-500/20 text-red-400 rounded-full text-xs font-semibold uppercase tracking-wider"
          >
            <Lock className="w-3.5 h-3.5" />
            Accès Suspendu
          </motion.div>
        </div>

        <AnimatePresence mode="wait">
          {!paymentSuccess ? (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: activeTab === 'info' ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: activeTab === 'info' ? 20 : -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'info' ? (
                /* Info and subscription details */
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <h2 className="text-2xl font-serif text-gold-100">Votre abonnement a expiré</h2>
                    <p className="text-zinc-400 text-sm">
                      Les données fiscales de votre entreprise sont **sauvegardées en toute sécurité sur cet appareil**, mais vous devez disposer d'une licence active pour y accéder.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-luxury-900/50 border border-border-subtle space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-500">Compte :</span>
                      <span className="text-gold-300 font-medium">{user?.email}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-500">Dernière expiration :</span>
                      <span className="text-red-400/80 font-medium font-mono">
                        {subscriptionExpiry ? new Date(subscriptionExpiry).toLocaleDateString('fr-FR', {
                          day: 'numeric', month: 'long', year: 'numeric'
                        }) : 'Aucune licence trouvée'}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm border-t border-border-subtle pt-2">
                      <span className="text-zinc-500">Souveraineté :</span>
                      <span className="text-money-400 font-semibold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" /> Actif (Stockage Local)
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={handleRefresh}
                      disabled={loading}
                      className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl border border-border-subtle text-sm font-semibold text-zinc-300 hover:text-gold-200 hover:bg-gold-500/5 transition-all active:scale-[0.98] disabled:opacity-50"
                    >
                      <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                      Réessayer
                    </button>
                    <button
                      onClick={() => setActiveTab('payment')}
                      className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-gold-500 text-black text-sm font-semibold hover:bg-gold-400 hover:shadow-lg hover:shadow-gold-500/10 transition-all active:scale-[0.98] glow-gold"
                    >
                      Renouveler
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                /* Payment form */
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <h2 className="text-2xl font-serif text-gold-100">Sélectionnez votre moyen de paiement</h2>
                    <p className="text-zinc-400 text-sm">
                      Paiement direct et sécurisé par Mobile Money. Votre accès sera déverrouillé instantanément.
                    </p>
                  </div>

                  {/* Provider Choice */}
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => setSelectedProvider('orange')}
                      className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
                        selectedProvider === 'orange'
                          ? 'border-orange-500 bg-orange-500/5 text-orange-400 glow-orange'
                          : 'border-border-subtle bg-luxury-900/30 text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-white font-bold text-sm">OM</div>
                      <span className="text-xs font-semibold font-sans">Orange Money</span>
                    </button>

                    <button
                      onClick={() => setSelectedProvider('wave')}
                      className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
                        selectedProvider === 'wave'
                          ? 'border-cyan-400 bg-cyan-400/5 text-cyan-300 glow-cyan'
                          : 'border-border-subtle bg-luxury-900/30 text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-xl bg-cyan-400 flex items-center justify-center text-white font-bold text-xl font-serif">W</div>
                      <span className="text-xs font-semibold font-sans">Wave</span>
                    </button>

                    <button
                      onClick={() => setSelectedProvider('moov')}
                      className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
                        selectedProvider === 'moov'
                          ? 'border-blue-500 bg-blue-500/5 text-blue-400 glow-blue'
                          : 'border-border-subtle bg-luxury-900/30 text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-sm">MOOV</div>
                      <span className="text-xs font-semibold font-sans">Moov Money</span>
                    </button>
                  </div>

                  {selectedProvider && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-4"
                    >
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider block">Numéro de téléphone Mobile Money</label>
                        <div className="relative">
                          <Smartphone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                          <input
                            type="tel"
                            placeholder="Ex: +226 70 00 00 00"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="w-full bg-luxury-900 border border-border-subtle text-gold-100 pl-11 pr-4 py-3.5 rounded-xl font-mono text-sm focus:outline-none focus:border-gold-500 transition-colors"
                          />
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-gold-500/5 border border-gold-500/10 flex justify-between items-center text-sm">
                        <span className="text-zinc-400">Abonnement Annuel Premium UEMOA :</span>
                        <span className="text-gold-300 font-bold font-mono">150 000 FCFA / an</span>
                      </div>

                      <button
                        onClick={handleSimulatePayment}
                        disabled={loading || !phoneNumber}
                        className="w-full py-4 px-4 bg-gold-500 text-black text-sm font-semibold rounded-xl hover:bg-gold-400 hover:shadow-lg hover:shadow-gold-500/20 transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50"
                      >
                        {loading ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            Validation de la transaction en cours...
                          </>
                        ) : (
                          <>
                            Payer 150 000 FCFA
                          </>
                        )}
                      </button>
                    </motion.div>
                  )}

                  <button
                    onClick={() => setActiveTab('info')}
                    className="w-full text-center text-xs text-zinc-500 hover:text-zinc-400 transition-colors py-2"
                  >
                    Retour aux détails
                  </button>
                </div>
              )}
            </motion.div>
          ) : (
            /* Success confirmation */
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6 py-6"
            >
              <div className="w-20 h-20 bg-money-500/15 border border-money-500/30 rounded-full flex items-center justify-center mx-auto glow-green">
                <CheckCircle2 className="w-10 h-10 text-money-400" />
              </div>
              
              <div className="space-y-2">
                <h2 className="text-3xl font-serif text-money-400">Paiement Réussi !</h2>
                <p className="text-zinc-400 text-sm">
                  Félicitations, votre licence a été mise à jour avec succès. Vos données locales sont déverrouillées instantanément.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-luxury-900/50 border border-border-subtle text-xs text-zinc-500 font-mono">
                Nouvelle expiration : {new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toLocaleDateString('fr-FR', {
                  day: 'numeric', month: 'long', year: 'numeric'
                })}
              </div>

              <button
                onClick={handleRefresh}
                className="w-full py-4 px-4 bg-money-500 text-white text-sm font-semibold rounded-xl hover:bg-money-400 hover:shadow-lg transition-all active:scale-[0.98] glow-green"
              >
                Entrer dans l'Application
              </button>
            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>
      
      <p className="mt-8 text-center text-xs text-zinc-600 max-w-sm">
        Libriwouô respecte la souveraineté de vos données. Vos documents comptables ne quittent jamais votre espace de stockage local sécurisé.
      </p>
    </div>
  );
}
