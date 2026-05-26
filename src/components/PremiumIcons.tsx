import React from 'react';

interface IconProps {
  className?: string;
}

// 1. Vue d'ensemble (Dashboard)
export function PremiumDashboardIcon({ className = "w-5 h-5" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Top Left Card (Gold Gradient) */}
      <rect x="3" y="3" width="8" height="8" rx="2" fill="url(#db-gold-grad)" />
      {/* Top Right Card (Cyan Gradient) */}
      <rect x="13" y="3" width="8" height="6" rx="2" fill="url(#db-cyan-grad)" />
      {/* Middle Right Mini Action (Terracotta) */}
      <rect x="13" y="11" width="8" height="3" rx="1.5" fill="#E07A5F" />
      {/* Bottom Full Row Card (Midnight blue with gold border) */}
      <rect x="3" y="16" width="18" height="5" rx="2" fill="#0D142C" stroke="#AA7C11" strokeWidth="1" />
      <line x1="6" y1="18.5" x2="14" y2="18.5" stroke="#F3E5AB" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="17.5" cy="18.5" r="1.2" fill="#00E5FF" />
      <defs>
        <linearGradient id="db-gold-grad" x1="3" y1="3" x2="11" y2="11" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F3E5AB" />
          <stop offset="100%" stopColor="#AA7C11" />
        </linearGradient>
        <linearGradient id="db-cyan-grad" x1="13" y1="3" x2="21" y2="9" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#00E5FF" />
          <stop offset="100%" stopColor="#00B4D8" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// 2. Assistant Libriwouô (IA - Hub)
export function PremiumHubIcon({ className = "w-5 h-5" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Glow aura */}
      <circle cx="12" cy="13" r="6" fill="#00E5FF" fillOpacity="0.25" />
      {/* Main AI Orb */}
      <circle cx="12" cy="13" r="5.2" fill="url(#hub-cyan-grad)" />
      {/* Golden Crown above the orb */}
      <path d="M7 8L9.5 11L12 7L14.5 11L17 8L16 13H8L7 8Z" fill="url(#hub-gold-grad)" />
      {/* Orbital Ring */}
      <ellipse cx="12" cy="13" rx="9.5" ry="3.5" stroke="#F3E5AB" strokeWidth="1.2" transform="rotate(-15 12 13)" strokeDasharray="3 2" />
      {/* Sparkles */}
      <circle cx="6" cy="6" r="0.8" fill="#00E5FF" />
      <circle cx="18" cy="18" r="1" fill="#F3E5AB" />
      <defs>
        <linearGradient id="hub-gold-grad" x1="7" y1="7" x2="17" y2="13" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFE066" />
          <stop offset="100%" stopColor="#AA7C11" />
        </linearGradient>
        <linearGradient id="hub-cyan-grad" x1="7" y1="8" x2="17" y2="18" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#00E5FF" />
          <stop offset="100%" stopColor="#007799" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// 3. Mes Dépenses (Expenses)
export function PremiumExpensesIcon({ className = "w-5 h-5" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Chest Base (Terracotta) */}
      <path d="M4 11H20V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V11Z" fill="#E07A5F" />
      {/* Chest Lid (Gold Gradient) */}
      <path d="M4 11C4 7.68629 6.68629 5 10 5H14C17.3137 5 20 7.68629 20 11H4Z" fill="url(#exp-gold-grad)" />
      {/* Wood bands */}
      <rect x="7" y="5" width="2" height="15" fill="#5C2E25" fillOpacity="0.4" />
      <rect x="15" y="5" width="2" height="15" fill="#5C2E25" fillOpacity="0.4" />
      {/* Golden Clasp */}
      <rect x="10.5" y="9.5" width="3" height="3" rx="0.5" fill="#AA7C11" stroke="#F3E5AB" strokeWidth="0.8" />
      {/* Outward Flow arrow */}
      <path d="M16 13.5L19 16.5M19 16.5H16.5M19 16.5V14" stroke="#00E5FF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <defs>
        <linearGradient id="exp-gold-grad" x1="4" y1="5" x2="20" y2="11" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F3E5AB" />
          <stop offset="100%" stopColor="#AA7C11" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// 4. Mes Ventes & Factures (Invoices)
export function PremiumInvoicesIcon({ className = "w-5 h-5" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Invoice Sheet */}
      <path d="M5 3C5 2.44772 5.44772 2 6 2H14L19 7V21C19 21.5523 18.5523 22 18 22H6C5.44772 22 5 21.5523 5 21V3Z" fill="#FDFBF7" stroke="#AA7C11" strokeWidth="1" />
      {/* Folded Corner */}
      <path d="M14 2V6C14 6.55228 14.4477 7 15 7H19L14 2Z" fill="#AA7C11" />
      {/* Document details (lines) */}
      <line x1="8" y1="7" x2="12" y2="7" stroke="#E07A5F" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="8" y1="11" x2="16" y2="11" stroke="#00B4D8" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="8" y1="14" x2="14" y2="14" stroke="#00B4D8" strokeWidth="1.5" strokeLinecap="round" />
      {/* Royal Seal stamp */}
      <circle cx="14" cy="18" r="2.5" fill="#AA7C11" />
      <path d="M13 18.5L14 17L15 18.5H13Z" fill="#FDFBF7" />
    </svg>
  );
}

// 5. Mon Stock (Catalogue - Inventory)
export function PremiumInventoryIcon({ className = "w-5 h-5" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Lid/Rim (Gold) */}
      <path d="M7 5H17V7H7V5Z" fill="url(#inv-gold)" />
      {/* Neck */}
      <path d="M9 7H15V9H9V7Z" fill="#AA7C11" />
      {/* Urn Body (Terracotta) */}
      <path d="M15 9H9C6 9 5 12 5 15C5 19 8 20 12 20C16 20 19 19 19 15C19 12 18 9 15 9Z" fill="#E07A5F" />
      {/* Base */}
      <path d="M9 20H15V21.5C15 21.7761 14.7761 22 14.5 22H9.5C9.22386 22 9 21.7761 9 21.5V20Z" fill="url(#inv-gold)" />
      {/* Tribal triangular patterns on body */}
      <path d="M8 14L10 12L12 14L14 12L16 14" stroke="#FDFBF7" strokeWidth="1" strokeLinecap="round" />
      <circle cx="12" cy="16.5" r="1.5" fill="#00E5FF" />
      <defs>
        <linearGradient id="inv-gold" x1="7" y1="5" x2="17" y2="7" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F3E5AB" />
          <stop offset="100%" stopColor="#AA7C11" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// 6. Mon Équipe (Payroll)
export function PremiumPayrollIcon({ className = "w-5 h-5" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Left Character (Cyan) */}
      <circle cx="6.5" cy="11.5" r="3" fill="#00B4D8" />
      <path d="M2.5 18C2.5 15.5 4.5 15 6.5 15C8.5 15 10.5 15.5 10.5 18V20H2.5V18Z" fill="#00B4D8" opacity="0.8" />
      
      {/* Right Character (Terracotta) */}
      <circle cx="17.5" cy="11.5" r="3" fill="#E07A5F" />
      <path d="M13.5 18C13.5 15.5 15.5 15 17.5 15C19.5 15 21.5 15.5 21.5 18V20H13.5V18Z" fill="#E07A5F" opacity="0.8" />

      {/* Center King/Leader Character (Gold crowned) */}
      <circle cx="12" cy="9.5" r="3.5" fill="url(#pay-gold)" />
      <path d="M7 16.5C7 13.5 9 13 12 13C15 13 17 13.5 17 16.5V20H7V16.5Z" fill="url(#pay-gold)" />
      {/* Mini golden crown */}
      <path d="M10.5 5L12 3.5L13.5 5L13 6H11L10.5 5Z" fill="#FDFBF7" />
      
      <defs>
        <linearGradient id="pay-gold" x1="8.5" y1="5.5" x2="15.5" y2="19.5" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F3E5AB" />
          <stop offset="100%" stopColor="#AA7C11" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// 7. Mon Argent (Cashflow)
export function PremiumCashflowIcon({ className = "w-5 h-5" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Trending Up line */}
      <path d="M3 18L9 12L13 15L21 6" stroke="#00E5FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 6H21V11" stroke="#00E5FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      
      {/* Detailed Golden Cauri shell below the trend */}
      <path d="M8 15C8 12.5 9 11.5 11 11.5C13 11.5 14 12.5 14 15C14 17.5 13 18.5 11 18.5C9 18.5 8 17.5 8 15Z" fill="url(#cash-gold)" stroke="#AA7C11" strokeWidth="0.8" />
      {/* Inner slots of Cauri */}
      <path d="M10.2 13.5C10.5 13 11.5 13 11.8 13.5M10.2 15C10.5 14.5 11.5 14.5 11.8 15M10.2 16.5C10.5 16 11.5 16 11.8 16.5" stroke="#5C2E25" strokeWidth="0.8" strokeLinecap="round" />

      {/* Floating sparkles */}
      <circle cx="17" cy="13" r="1.2" fill="#00E5FF" />
      <circle cx="19" cy="15" r="0.8" fill="#F3E5AB" />
      
      <defs>
        <linearGradient id="cash-gold" x1="8" y1="11.5" x2="14" y2="18.5" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F3E5AB" />
          <stop offset="100%" stopColor="#AA7C11" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// 8. Ma Banque (Bank)
export function PremiumBankIcon({ className = "w-5 h-5" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Roof (Pediment) */}
      <path d="M12 3L3 8H21L12 3Z" fill="#E07A5F" />
      {/* Pediment decoration */}
      <circle cx="12" cy="6" r="1" fill="#FDFBF7" />
      
      {/* Architrave */}
      <rect x="4" y="8" width="16" height="2" fill="url(#bank-gold)" />
      
      {/* Columns */}
      <rect x="5.5" y="10" width="2" height="8" fill="#FDFBF7" />
      <rect x="9.5" y="10" width="2" height="8" fill="#FDFBF7" />
      <rect x="13.5" y="10" width="2" height="8" fill="#FDFBF7" />
      <rect x="17.5" y="10" width="2" height="8" fill="#FDFBF7" />
      
      {/* Column bases / tops */}
      <rect x="5" y="10" width="3" height="1" fill="url(#bank-gold)" />
      <rect x="9" y="10" width="3" height="1" fill="url(#bank-gold)" />
      <rect x="13" y="10" width="3" height="1" fill="url(#bank-gold)" />
      <rect x="17" y="10" width="3" height="1" fill="url(#bank-gold)" />
      
      {/* Base Foundation */}
      <rect x="3" y="18" width="18" height="3" rx="1" fill="url(#bank-gold)" />
      
      {/* Glowing Treasury Shield */}
      <path d="M11 12H13V15.5C13 16 12 16.5 12 16.5C12 16.5 11 16 11 15.5V12Z" fill="#00E5FF" />
      
      <defs>
        <linearGradient id="bank-gold" x1="3" y1="3" x2="21" y2="21" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F3E5AB" />
          <stop offset="100%" stopColor="#AA7C11" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// 9. Mes Impôts (Declarations)
export function PremiumDeclarationsIcon({ className = "w-5 h-5" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Paper Sheet */}
      <path d="M4 4C4 2.89543 4.89543 2 6 2H18C19.1046 2 20 2.89543 20 4V20C20 21.1046 19.1046 22 18 22H6C4.89543 22 4 21.1046 4 20V4Z" fill="#FDFBF7" stroke="#AA7C11" strokeWidth="1" />
      
      {/* Gold Seal Banner hanging */}
      <path d="M14 2V8L16 6L18 8V2H14Z" fill="#E07A5F" />
      
      {/* Header text */}
      <line x1="7" y1="6" x2="12" y2="6" stroke="#AA7C11" strokeWidth="2" strokeLinecap="round" />
      
      {/* Grid check lines */}
      <rect x="7" y="10" width="3" height="3" rx="0.5" fill="#00B4D8" />
      <line x1="12" y1="11.5" x2="17" y2="11.5" stroke="#0D142C" strokeWidth="1.5" strokeLinecap="round" />
      
      <rect x="7" y="15" width="3" height="3" rx="0.5" fill="#00B4D8" />
      <line x1="12" y1="16.5" x2="17" y2="16.5" stroke="#0D142C" strokeWidth="1.5" strokeLinecap="round" />
      
      {/* Stamp */}
      <circle cx="15.5" cy="18.5" r="2.5" fill="url(#dec-gold)" />
      
      <defs>
        <linearGradient id="dec-gold" x1="13" y1="16" x2="18" y2="21" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F3E5AB" />
          <stop offset="100%" stopColor="#AA7C11" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// 10. Mes Rapports Simples (FinancialStatements)
export function PremiumFinancialStatementsIcon({ className = "w-5 h-5" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Binder Spine */}
      <path d="M4 4C4 2.89543 4.89543 2 6 2H8V22H6C4.89543 22 4 21.1046 4 20V4Z" fill="url(#stat-gold)" />
      {/* Spine rings */}
      <circle cx="6" cy="6" r="0.8" fill="#FDFBF7" />
      <circle cx="6" cy="12" r="0.8" fill="#FDFBF7" />
      <circle cx="6" cy="18" r="0.8" fill="#FDFBF7" />
      
      {/* Binder Cover */}
      <path d="M8 2H18C19.1046 2 20 2.89543 20 4V20C20 21.1046 19.1046 22 18 22H8V2Z" fill="#0D142C" stroke="#AA7C11" strokeWidth="1" />
      
      {/* Embossed Pie Chart on the cover */}
      <circle cx="14" cy="12" r="3.5" stroke="#E07A5F" strokeWidth="1.5" />
      <path d="M14 12V8.5C16 8.5 17.5 10 17.5 12H14Z" fill="#00E5FF" />
      
      <defs>
        <linearGradient id="stat-gold" x1="4" y1="2" x2="8" y2="22" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F3E5AB" />
          <stop offset="100%" stopColor="#AA7C11" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// 11. Mon Bilan de l'Année (Bilan)
export function PremiumBilanIcon({ className = "w-5 h-5" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Center pillar */}
      <rect x="11.5" y="4" width="1" height="15" fill="url(#bil-gold)" />
      <path d="M9 19H15V21H9V19Z" fill="#AA7C11" />
      <circle cx="12" cy="4" r="1.5" fill="#FDFBF7" />
      
      {/* Horizontal beam */}
      <path d="M4 7.5H20V8.5H4V7.5Z" fill="url(#bil-gold)" />
      
      {/* Left Hanging pan */}
      <line x1="5" y1="8" x2="3" y2="14" stroke="#AA7C11" strokeWidth="1" />
      <line x1="5" y1="8" x2="7" y2="14" stroke="#AA7C11" strokeWidth="1" />
      <path d="M2.5 14H7.5L5 15.5L2.5 14Z" fill="#00E5FF" />
      
      {/* Right Hanging pan */}
      <line x1="19" y1="8" x2="17" y2="14" stroke="#AA7C11" strokeWidth="1" />
      <line x1="19" y1="8" x2="21" y2="14" stroke="#AA7C11" strokeWidth="1" />
      <path d="M16.5 14H21.5L19 15.5L16.5 14Z" fill="#E07A5F" />
      
      <defs>
        <linearGradient id="bil-gold" x1="4" y1="4" x2="20" y2="21" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F3E5AB" />
          <stop offset="100%" stopColor="#AA7C11" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// 12. Mes Documents (Documents)
export function PremiumDocumentsIcon({ className = "w-5 h-5" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Back Document (Terracotta accent) */}
      <rect x="6" y="2" width="13" height="16" rx="1.5" fill="#E07A5F" opacity="0.6" stroke="#AA7C11" strokeWidth="0.8" />
      
      {/* Front Document */}
      <rect x="4" y="6" width="13" height="16" rx="1.5" fill="#FDFBF7" stroke="#AA7C11" strokeWidth="1" />
      
      {/* Lines inside front doc */}
      <line x1="7" y1="10" x2="14" y2="10" stroke="#0D142C" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="7" y1="13" x2="12" y2="13" stroke="#00B4D8" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="7" y1="16" x2="13" y2="16" stroke="#0D142C" strokeWidth="1.5" strokeLinecap="round" />
      
      {/* Gold Seal on front doc */}
      <circle cx="13.5" cy="18.5" r="1.5" fill="url(#doc-gold)" />
      
      <defs>
        <linearGradient id="doc-gold" x1="12" y1="17" x2="15" y2="20" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F3E5AB" />
          <stop offset="100%" stopColor="#AA7C11" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// 13. Mon Historique (Journal)
export function PremiumJournalIcon({ className = "w-5 h-5" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Open Book Pages */}
      <path d="M12 20C12 20 9.5 18 5 18H2V4H5C9.5 4 12 6 12 6C12 6 14.5 4 19 4H22V18H19C14.5 18 12 20 12 20Z" fill="#FDFBF7" stroke="#AA7C11" strokeWidth="1" />
      
      {/* Book Cover edges */}
      <path d="M2 18.5H5C9.5 18.5 12 20.5 12 20.5" stroke="#E07A5F" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M22 18.5H19C14.5 18.5 12 20.5 12 20.5" stroke="#E07A5F" strokeWidth="2.5" strokeLinecap="round" />
      
      {/* Text lines left page */}
      <line x1="4" y1="7" x2="9" y2="7" stroke="#0D142C" strokeWidth="1.2" />
      <line x1="4" y1="10" x2="8" y2="10" stroke="#0D142C" strokeWidth="1.2" />
      <line x1="4" y1="13" x2="9" y2="13" stroke="#00B4D8" strokeWidth="1.2" />
      
      {/* Text lines right page */}
      <line x1="15" y1="7" x2="20" y2="7" stroke="#0D142C" strokeWidth="1.2" />
      <line x1="16" y1="10" x2="20" y2="10" stroke="#0D142C" strokeWidth="1.2" />
      <line x1="15" y1="13" x2="19" y2="13" stroke="#00B4D8" strokeWidth="1.2" />
      
      {/* Golden Book Spine marker */}
      <line x1="12" y1="4" x2="12" y2="20" stroke="#AA7C11" strokeWidth="1.5" />
    </svg>
  );
}

// 14. Mon Calendrier (Calendar)
export function PremiumCalendarIcon({ className = "w-5 h-5" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Calendar Card */}
      <rect x="3" y="4" width="18" height="16" rx="2.5" fill="#FDFBF7" stroke="#AA7C11" strokeWidth="1" />
      
      {/* Header Band */}
      <path d="M3.5 4.5H20.5V9.5H3.5V4.5Z" fill="url(#cal-gold)" />
      
      {/* Rings/Holes on top */}
      <rect x="6" y="2" width="2" height="4" rx="0.5" fill="#E07A5F" />
      <rect x="16" y="2" width="2" height="4" rx="0.5" fill="#E07A5F" />
      
      {/* Calendar dates grid */}
      <circle cx="7" cy="13" r="1.1" fill="#0D142C" />
      <circle cx="12" cy="13" r="1.1" fill="#0D142C" />
      <circle cx="17" cy="13" r="1.4" fill="#00E5FF" /> {/* Cyan active date */}
      
      <circle cx="7" cy="17" r="1.4" fill="#E07A5F" /> {/* Terracotta busy date */}
      <circle cx="12" cy="17" r="1.1" fill="#0D142C" />
      <circle cx="17" cy="17" r="1.1" fill="#0D142C" />
      
      <defs>
        <linearGradient id="cal-gold" x1="3" y1="4" x2="21" y2="9.5" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F3E5AB" />
          <stop offset="100%" stopColor="#AA7C11" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// 15. Le Simulateur (Simulator)
export function PremiumSimulatorIcon({ className = "w-5 h-5" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Calculator Body */}
      <rect x="4" y="3" width="16" height="18" rx="2" fill="#0D142C" stroke="#AA7C11" strokeWidth="1.2" />
      
      {/* Screen area with glowing cyan result */}
      <rect x="6" y="5" width="12" height="4" rx="1" fill="#1E293B" stroke="#00E5FF" strokeWidth="0.8" />
      {/* Screen text indicator */}
      <line x1="8" y1="7" x2="14" y2="7" stroke="#00E5FF" strokeWidth="1.5" strokeLinecap="round" />
      
      {/* Keyboard Grid Buttons */}
      <rect x="6" y="11" width="3" height="2" rx="0.5" fill="#E07A5F" />
      <rect x="10.5" y="11" width="3" height="2" rx="0.5" fill="#AA7C11" />
      <rect x="15" y="11" width="3" height="2" rx="0.5" fill="#AA7C11" />
      
      <rect x="6" y="14" width="3" height="2" rx="0.5" fill="#AA7C11" />
      <rect x="10.5" y="14" width="3" height="2" rx="0.5" fill="#AA7C11" />
      <rect x="15" y="14" width="3" height="2" rx="0.5" fill="#00E5FF" /> {/* Equals key */}
      
      <rect x="6" y="17" width="7.5" height="2" rx="0.5" fill="url(#sim-gold)" /> {/* Space key */}
      <rect x="15" y="17" width="3" height="2" rx="0.5" fill="#00E5FF" />
      
      <defs>
        <linearGradient id="sim-gold" x1="6" y1="17" x2="13.5" y2="19" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F3E5AB" />
          <stop offset="100%" stopColor="#AA7C11" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// 16. Mes Réglages (Settings)
export function PremiumSettingsIcon({ className = "w-5 h-5" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Big Gold Gear */}
      <circle cx="10" cy="14" r="5" fill="url(#set-gold)" />
      <circle cx="10" cy="14" r="1.8" fill="#070B19" /> {/* Center hole */}
      {/* Teeth around big gear */}
      <path d="M10 8V9M10 19V20M4 14H5M15 14H16M6 10L6.8 10.8M13.2 17.2L14 18M6 18L6.8 17.2M13.2 10.8L14 10" stroke="#AA7C11" strokeWidth="2.2" strokeLinecap="round" />
      
      {/* Small Cyan Gear interlocking */}
      <circle cx="17" cy="8" r="3.2" fill="url(#set-cyan)" />
      <circle cx="17" cy="8" r="1.2" fill="#070B19" />
      {/* Teeth small gear */}
      <path d="M17 4V4.8M17 11.2V12M13.2 8H14M20 8H20.8M14.5 5.5L15 6M19 10L19.5 10.5M14.5 10.5L15 10M19 6L19.5 5.5" stroke="#00B4D8" strokeWidth="1.8" strokeLinecap="round" />
      
      <defs>
        <linearGradient id="set-gold" x1="5" y1="9" x2="15" y2="19" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F3E5AB" />
          <stop offset="100%" stopColor="#AA7C11" />
        </linearGradient>
        <linearGradient id="set-cyan" x1="13.8" y1="4.8" x2="20.2" y2="11.2" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#00E5FF" />
          <stop offset="100%" stopColor="#005577" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// 17. Mon Coffre-Fort (Vault)
export function PremiumVaultIcon({ className = "w-5 h-5" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Vault Frame */}
      <rect x="3" y="3" width="18" height="18" rx="3" fill="#0D142C" stroke="#AA7C11" strokeWidth="1.2" />
      
      {/* Door Circle */}
      <circle cx="12" cy="12" r="6.5" fill="#1E293B" stroke="#00B4D8" strokeWidth="1" />
      
      {/* Dial center wheel (Gold combo lock) */}
      <circle cx="12" cy="12" r="3" fill="url(#vlt-gold)" />
      
      {/* Dial notches / indicators */}
      <line x1="12" y1="6" x2="12" y2="7.5" stroke="#00E5FF" strokeWidth="1.2" />
      <line x1="6" y1="12" x2="7.5" y2="12" stroke="#00B4D8" strokeWidth="1.2" />
      <line x1="12" y1="16.5" x2="12" y2="18" stroke="#00B4D8" strokeWidth="1.2" />
      <line x1="16.5" y1="12" x2="18" y2="12" stroke="#00B4D8" strokeWidth="1.2" />
      
      <circle cx="12" cy="12" r="0.8" fill="#FDFBF7" />
      
      {/* Vault Handle */}
      <path d="M12 12L15 15" stroke="#FDFBF7" strokeWidth="1.5" strokeLinecap="round" />
      
      <defs>
        <linearGradient id="vlt-gold" x1="9" y1="9" x2="15" y2="15" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F3E5AB" />
          <stop offset="100%" stopColor="#AA7C11" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// Extra: Sparkles for quick enhancements
export function PremiumSparklesIcon({ className = "w-5 h-5" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 3L10.5 7.5L15 9L10.5 10.5L9 15L7.5 10.5L3 9L7.5 7.5L9 3Z" fill="url(#sp-gold)" />
      <path d="M18 13L19 16L22 17L19 18L18 21L17 18L14 17L17 16L18 13Z" fill="#00E5FF" />
      <defs>
        <linearGradient id="sp-gold" x1="3" y1="3" x2="15" y2="15" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F3E5AB" />
          <stop offset="100%" stopColor="#AA7C11" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// 18. Scanner Facture
export function PremiumScanIcon({ className = "w-5 h-5" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Target scanning brackets (Gold) */}
      <path d="M4 8V5C4 4.44772 4.44772 4 5 4H8" stroke="url(#sc-gold)" strokeWidth="2" strokeLinecap="round" />
      <path d="M16 4H19C19.5523 4 20 4.44772 20 5V8" stroke="url(#sc-gold)" strokeWidth="2" strokeLinecap="round" />
      <path d="M20 16V19C20 19.5523 19.5523 20 19 20H16" stroke="url(#sc-gold)" strokeWidth="2" strokeLinecap="round" />
      <path d="M4 16V19C4 19.5523 4.44772 20 5 20H8" stroke="url(#sc-gold)" strokeWidth="2" strokeLinecap="round" />
      
      {/* Scanning document in the center */}
      <rect x="7" y="7" width="10" height="10" rx="1" fill="#FDFBF7" stroke="#AA7C11" strokeWidth="0.8" />
      
      {/* Glowing Cyan Laser Line in middle */}
      <line x1="6" y1="12" x2="18" y2="12" stroke="#00E5FF" strokeWidth="2" strokeLinecap="round" />
      
      <defs>
        <linearGradient id="sc-gold" x1="4" y1="4" x2="20" y2="20" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F3E5AB" />
          <stop offset="100%" stopColor="#AA7C11" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// 19. Plus Icon
export function PremiumPlusIcon({ className = "w-5 h-5" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Circle base with gold gradient */}
      <circle cx="12" cy="12" r="9.5" fill="url(#pl-gold-grad)" stroke="#AA7C11" strokeWidth="1" />
      {/* Flat inner shield */}
      <circle cx="12" cy="12" r="7" fill="#0D142C" />
      {/* Flat plus lines in electric cyan */}
      <line x1="12" y1="8" x2="12" y2="16" stroke="#00E5FF" strokeWidth="2" strokeLinecap="round" />
      <line x1="8" y1="12" x2="16" y2="12" stroke="#00E5FF" strokeWidth="2" strokeLinecap="round" />
      <defs>
        <linearGradient id="pl-gold-grad" x1="3.5" y1="3.5" x2="20.5" y2="20.5" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F3E5AB" />
          <stop offset="100%" stopColor="#AA7C11" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// 20. Bot Assistant Head
export function PremiumBotIcon({ className = "w-5 h-5" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Glow aura behind */}
      <circle cx="12" cy="12" r="7.5" fill="#00E5FF" fillOpacity="0.2" />
      {/* Royal crown helmet */}
      <path d="M7 13.5C7 10 9 9 12 9C15 9 17 10 17 13.5V17C17 18.5 15.5 19.5 12 19.5C8.5 19.5 7 18.5 7 17V13.5Z" fill="#0D142C" stroke="#00E5FF" strokeWidth="1" />
      {/* Royal Crown on head */}
      <path d="M8 9L9.5 11L12 7.5L14.5 11L16 9L15 11.5H9L8 9Z" fill="url(#bot-gold)" />
      {/* Glowing visor / eyes */}
      <rect x="9.5" y="13.5" width="5" height="1.8" rx="0.9" fill="#00E5FF" />
      {/* Glowing antenna node */}
      <line x1="12" y1="7.5" x2="12" y2="5" stroke="#FDFBF7" strokeWidth="1.5" />
      <circle cx="12" cy="4.5" r="1.2" fill="#00E5FF" />
      
      <defs>
        <linearGradient id="bot-gold" x1="8" y1="7.5" x2="16" y2="11.5" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F3E5AB" />
          <stop offset="100%" stopColor="#AA7C11" />
        </linearGradient>
      </defs>
    </svg>
  );
}

