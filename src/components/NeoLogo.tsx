import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export function NeoLogo({ className, size = 'md', showText = true }: LogoProps) {
  const sizes = {
    sm: 'w-36 md:w-full max-w-[200px] h-auto',
    md: 'w-44 md:w-56 h-auto',
    lg: 'w-60 md:w-72 h-auto',
    xl: 'w-80 md:w-96 h-auto',
  };

  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-24 h-24',
    xl: 'w-36 h-36',
  };

  if (!showText) {
    return (
      <div className={cn("relative shrink-0 flex items-center justify-center select-none", iconSizes[size], className)}>
        {/* Soft background glow */}
        <motion.div 
          animate={{ 
            scale: [1, 1.15, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ 
            duration: 5, 
            repeat: Infinity,
            ease: "easeInOut" 
          }}
          className="absolute inset-0 bg-gold-500/20 blur-xl rounded-full"
        />

        {/* Masterful Cowry Shell / Growth Symbol Icon */}
        <svg viewBox="0 0 100 100" fill="none" className="w-full h-full drop-shadow-[0_0_12px_rgba(212,175,55,0.25)]">
          {/* External golden ring */}
          <circle cx="50" cy="50" r="45" stroke="#D4AF37" strokeWidth="2.5" strokeOpacity="0.4" strokeDasharray="4 3" />
          <circle cx="50" cy="50" r="41" stroke="#D4AF37" strokeWidth="1.5" strokeOpacity="0.15" />
          
          {/* Dark luxury background disc */}
          <circle cx="50" cy="50" r="38" fill="#0A0A0A" stroke="#D4AF37" strokeWidth="1.5" strokeOpacity="0.5" />
          
          {/* Golden stylized Cowry shell (Cauri) */}
          <g transform="translate(10, 10) scale(0.8)">
            <path d="M50 15C32 15 25 35 25 50C25 65 32 85 50 85C68 85 75 65 75 50C75 35 68 15 50 15Z" 
              fill="url(#goldLogoGrad)" stroke="#D4AF37" strokeWidth="2" />
            
            {/* Center slit */}
            <path d="M50 22V78" stroke="#050505" strokeWidth="4" strokeLinecap="round" />
            
            {/* Slit ridges (teeth) */}
            <path d="M42 32H48 M42 42H48 M42 52H48 M42 62H48 M42 70H48" stroke="#050505" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M58 32H52 M58 42H52 M58 52H52 M58 62H52 M58 70H52" stroke="#050505" strokeWidth="2.5" strokeLinecap="round" />
            
            {/* Internal ridge lines */}
            <path d="M30 50C30 38 38 22 50 22C62 22 70 38 70 50" stroke="#F8F0CE" strokeWidth="1" strokeOpacity="0.3" fill="none" />
          </g>

          {/* Golden Growth Arrow emerging from bottom right */}
          <path d="M72 72L52 52 M72 72H60 M72 72V60" stroke="#D4AF37" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          
          <defs>
            <linearGradient id="goldLogoGrad" x1="25" y1="15" x2="75" y2="85" gradientUnits="userSpaceOnUse">
              <stop stopColor="#E5C158" />
              <stop offset="0.5" stopColor="#D4AF37" />
              <stop offset="1" stopColor="#927722" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
  }

  return (
    <div className={cn("relative flex items-center select-none w-auto md:w-full justify-center", className)}>
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative group flex items-center transition-all duration-300 w-auto md:w-full justify-center"
      >
        {/* Subtle premium ambient golden glow behind the logo */}
        <div className="absolute inset-0 bg-gold-500/5 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-full" />
        
        {/* Render the brand new high-resolution logo.png */}
        <motion.img 
          src="/logo.png" 
          alt="Libriwouô Logo"
          className={cn("w-auto object-contain transition-all duration-300 drop-shadow-[0_4px_12px_rgba(212,175,55,0.2)]", sizes[size])}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        />
      </motion.div>
    </div>
  );
}
