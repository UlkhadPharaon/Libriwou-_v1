import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export function CompanionAvatar({ className = '', animated = false }: { className?: string, animated?: boolean }) {
  return (
    <div className={cn("relative overflow-hidden rounded-2xl bg-zinc-950/40 border border-gold-500/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex items-center justify-center shrink-0 select-none", className)}>
      {/* Background soft golden glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-gold-500/5 to-transparent pointer-events-none" />
      
      {/* Masterful interactive SVG wrapper */}
      <svg className="w-full h-full" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="aiOrbGrad" x1="20" y1="90" x2="60" y2="130" gradientUnits="userSpaceOnUse">
            <stop stopColor="#E0F7FA" />
            <stop offset="0.3" stopColor="#00E5FF" />
            <stop offset="1" stopColor="#006064" />
          </linearGradient>

          {/* Neon blue glow filter */}
          <filter id="aiOrbGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          
          {/* Circular mask centered on the mascot */}
          <clipPath id="mascotClip">
            <circle cx="100" cy="100" r="92" />
          </clipPath>
        </defs>

        {/* Circular Outer Golden Tribal Ring with spin animation */}
        <motion.circle 
          cx="100" 
          cy="100" 
          r="95" 
          stroke="#D4AF37" 
          strokeWidth="1" 
          strokeOpacity="0.4"
          strokeDasharray="6 8"
          animate={animated ? { rotate: 360 } : {}}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: 'center' }}
        />
        <circle cx="100" cy="100" r="91" stroke="#D4AF37" strokeWidth="1" strokeOpacity="0.15" />

        {/* Mascot Image Group with Clip Path */}
        <g clipPath="url(#mascotClip)">
          {/* Background solid cover to avoid see-through */}
          <rect x="0" y="0" width="200" height="200" fill="#0A0A0C" />
          
          {/* Render the cropped, high-resolution mascot image */}
          <motion.image 
            href="/mascot.jpg" 
            x="-40" 
            y="-15" 
            width="540" 
            height="304"
            preserveAspectRatio="xMinYMid slice"
            animate={animated ? { 
              y: [-17, -13, -17],
              scale: [1, 1.015, 1]
            } : {}}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: 'center' }}
          />
        </g>

        {/* Dynamic Glowing cyan AI Orb positioned EXACTLY on top of the mascot's hand orb */}
        <motion.g 
          transform="translate(54.5, 122)"
          animate={animated ? {
            y: [-2, 2, -2],
            scale: [0.95, 1.05, 0.95]
          } : {}}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Outer glowing aura */}
          <motion.circle
            cx="0"
            cy="0"
            r="16"
            fill="#00E5FF"
            opacity="0.25"
            filter="url(#aiOrbGlow)"
            animate={animated ? { scale: [0.8, 1.3, 0.8], opacity: [0.15, 0.4, 0.15] } : {}}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* Core sphere */}
          <circle cx="0" cy="0" r="10" fill="url(#aiOrbGrad)" filter="url(#aiOrbGlow)" />
          {/* Rotating mini gold ring */}
          <motion.ellipse 
            cx="0" 
            cy="0" 
            rx="13" 
            ry="4.5" 
            stroke="#D4AF37" 
            strokeWidth="1" 
            strokeOpacity="0.8" 
            transform="rotate(-20)" 
            animate={animated ? { rotate: [-20, 340] } : {}}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />
          {/* Centered glowing AI letters */}
          <text x="-4" y="2.5" fill="#0A0A0A" fontSize="7.5" fontWeight="900" fontFamily="sans-serif" letterSpacing="-0.5">AI</text>
        </motion.g>
      </svg>
    </div>
  );
}
