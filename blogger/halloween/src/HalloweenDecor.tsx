import React from 'react';

// Floating Cute Ghost Component
export const CuteGhost: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg
    viewBox="0 0 120 140"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`w-14 h-16 md:w-20 md:h-24 ${className}`}
  >
    <defs>
      <filter id="ghostGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#8EE53F" floodOpacity="0.4" />
      </filter>
    </defs>
    <g filter="url(#ghostGlow)">
      {/* Ghost Body */}
      <path
        d="M20 70 C20 30, 40 10, 60 10 C80 10, 100 30, 100 70 C100 110, 105 130, 90 125 C75 120, 70 130, 60 125 C50 120, 45 130, 30 125 C15 120, 20 110, 20 70 Z"
        fill="#FFFFFF"
      />
      {/* Arms */}
      <path
        d="M20 60 C10 60, 5 70, 12 76 C18 80, 22 72, 22 65 Z"
        fill="#FFFFFF"
      />
      <path
        d="M100 60 C110 60, 115 70, 108 76 C102 80, 98 72, 98 65 Z"
        fill="#FFFFFF"
      />
      {/* Big Cute Eyes */}
      <ellipse cx="48" cy="46" rx="5" ry="7" fill="#0B0E14" />
      <ellipse cx="72" cy="46" rx="5" ry="7" fill="#0B0E14" />
      {/* Eye highlights */}
      <circle cx="50" cy="44" r="2" fill="#FFFFFF" />
      <circle cx="74" cy="44" r="2" fill="#FFFFFF" />
      {/* Cute Open Mouth */}
      <ellipse cx="60" cy="58" rx="4.5" ry="6.5" fill="#0B0E14" />
      {/* Pink Cheeks */}
      <ellipse cx="40" cy="52" rx="4" ry="2.5" fill="#FF7A00" opacity="0.5" />
      <ellipse cx="80" cy="52" rx="4" ry="2.5" fill="#FF7A00" opacity="0.5" />
    </g>
  </svg>
);

// Flying Bat Component
export const FlyingBat: React.FC<{ className?: string; flipped?: boolean }> = ({
  className = "",
  flipped = false,
}) => (
  <svg
    viewBox="0 0 100 60"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    className={`w-10 h-7 md:w-14 md:h-10 text-black/90 drop-shadow-[0_2px_8px_rgba(142,229,63,0.3)] ${
      flipped ? "-scale-x-100" : ""
    } ${className}`}
  >
    <path d="M50 25 C45 15, 30 5, 10 12 C18 24, 25 22, 20 38 C32 30, 42 35, 45 42 C48 38, 52 38, 55 42 C58 35, 68 30, 80 38 C75 22, 82 24, 90 12 C70 5, 55 15, 50 25 Z" />
    {/* Cute glowing eyes */}
    <circle cx="47" cy="27" r="1.5" fill="#8EE53F" />
    <circle cx="53" cy="27" r="1.5" fill="#8EE53F" />
  </svg>
);

// Bubbling Witch Cauldron Component (matching creative)
export const WitchCauldron: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg
    viewBox="0 0 200 160"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`w-28 h-24 md:w-36 md:h-28 ${className}`}
  >
    <defs>
      <linearGradient id="cauldronBody" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4A1E6D" />
        <stop offset="50%" stopColor="#2E1145" />
        <stop offset="100%" stopColor="#1A0728" />
      </linearGradient>
      <linearGradient id="slimeGlow" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#74C043" />
        <stop offset="50%" stopColor="#A3FF00" />
        <stop offset="100%" stopColor="#8EE53F" />
      </linearGradient>
      <filter id="slimeFilter" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#8EE53F" floodOpacity="0.8" />
      </filter>
    </defs>

    {/* Rising Smoke Wisps */}
    <path
      d="M70 30 Q60 15 75 0"
      stroke="rgba(255,255,255,0.4)"
      strokeWidth="3"
      strokeLinecap="round"
      fill="none"
      className="animate-bubble-1"
    />
    <path
      d="M130 30 Q145 15 130 0"
      stroke="rgba(255,255,255,0.4)"
      strokeWidth="3"
      strokeLinecap="round"
      fill="none"
      className="animate-bubble-2"
    />

    {/* Stirring Bone/Ladle */}
    <path d="M125 50 L155 10" stroke="#7A4E2B" strokeWidth="6" strokeLinecap="round" />

    {/* Cauldron Legs */}
    <ellipse cx="60" cy="148" rx="8" ry="4" fill="#12051C" />
    <ellipse cx="140" cy="148" rx="8" ry="4" fill="#12051C" />

    {/* Cauldron Body */}
    <ellipse cx="100" cy="100" rx="70" ry="50" fill="url(#cauldronBody)" stroke="#1A0728" strokeWidth="2" />

    {/* Cauldron Rim */}
    <ellipse cx="100" cy="55" rx="60" ry="12" fill="#2E1145" stroke="#1A0728" strokeWidth="2" />

    {/* Toxic Bubbling Slime Surface */}
    <ellipse cx="100" cy="54" rx="55" ry="9" fill="url(#slimeGlow)" filter="url(#slimeFilter)" />

    {/* Bubbles */}
    <circle cx="85" cy="48" r="5" fill="#A3FF00" className="animate-bubble-1" />
    <circle cx="115" cy="50" r="4" fill="#FFFFFF" className="animate-bubble-2" />
    <circle cx="98" cy="45" r="3" fill="#A3FF00" className="animate-bubble-3" />

    {/* Slime Drips */}
    <path
      d="M60 56 Q63 68 67 60 Q75 75 80 58 Q95 80 102 57 Q115 72 120 58 Q135 70 140 56"
      fill="url(#slimeGlow)"
    />

    {/* Cute Mini Skull Submerged */}
    <g transform="translate(100, 42) scale(0.65)">
      <circle cx="0" cy="0" r="12" fill="#E8E8E8" />
      <rect x="-6" y="8" width="12" height="6" rx="2" fill="#E8E8E8" />
      <circle cx="-4" cy="-1" r="2.5" fill="#1A0728" />
      <circle cx="4" cy="-1" r="2.5" fill="#1A0728" />
      <line x1="-3" y1="11" x2="-3" y2="14" stroke="#1A0728" strokeWidth="1" />
      <line x1="0" y1="11" x2="0" y2="14" stroke="#1A0728" strokeWidth="1" />
      <line x1="3" y1="11" x2="3" y2="14" stroke="#1A0728" strokeWidth="1" />
    </g>
  </svg>
);

// Spiderweb for corners
export const SpiderWeb: React.FC<{ className?: string; flip?: boolean }> = ({
  className = "",
  flip = false,
}) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`w-16 h-16 md:w-24 md:h-24 opacity-35 pointer-events-none stroke-white/40 ${
      flip ? "-scale-x-100" : ""
    } ${className}`}
  >
    <path d="M0 0 L100 0 M0 0 L85 52 M0 0 L52 85 M0 0 L0 100" strokeWidth="1" />
    <path d="M0 25 Q18 20 25 0" strokeWidth="1" />
    <path d="M0 50 Q38 40 50 0" strokeWidth="1" />
    <path d="M0 75 Q60 60 75 0" strokeWidth="1" />
    <path d="M0 100 Q85 85 100 0" strokeWidth="1" />
  </svg>
);

// Witch Hat decoration on the logo or badges
export const WitchHat: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg
    viewBox="0 0 50 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`w-6 h-5 inline-block ${className}`}
  >
    {/* Brim */}
    <ellipse cx="25" cy="35" rx="22" ry="4" fill="#2E1145" />
    {/* Cone */}
    <path d="M25 5 Q23 15 10 33 L40 33 Q30 15 25 5 Z" fill="#3A1259" />
    {/* Ribbon */}
    <path d="M12 30 Q25 33 38 30 L39 33 Q25 36 11 33 Z" fill="#8EE53F" />
    {/* Buckle */}
    <rect x="23" y="29.5" width="4" height="4" rx="1" fill="#FF7A00" />
  </svg>
);
