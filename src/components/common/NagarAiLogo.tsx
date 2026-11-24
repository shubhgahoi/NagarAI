import React from 'react';

interface NagarAiLogoProps {
  className?: string;
  size?: number | string;
}

export const NagarAiLogo: React.FC<NagarAiLogoProps> = ({ className = 'w-full h-full', size }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      className={className}
      style={size ? { width: size, height: size } : undefined}
    >
      <defs>
        <linearGradient id="nLogoBlue" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="50%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
        <linearGradient id="nLogoGreen" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        <filter id="nLogoGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#2563eb" floodOpacity="0.5" />
        </filter>
      </defs>

      {/* Dark modern badge background */}
      <rect width="100" height="100" rx="22" fill="#090d16" />
      <rect x="1" y="1" width="98" height="98" rx="21" fill="none" stroke="#1e293b" strokeWidth={1.5} />
      
      {/* Subtle outer tech aura */}
      <circle cx="50" cy="50" r="44" fill="none" stroke="#38bdf8" strokeWidth={1} opacity="0.12" strokeDasharray="8 6" />

      {/* Visible bold 'N' with 'i' at its tail */}
      <g filter="url(#nLogoGlow)">
        {/* Left vertical pillar of N */}
        <rect x="18" y="24" width="13" height="52" rx="4" fill="url(#nLogoBlue)" />

        {/* Diagonal stroke of N */}
        <path
          d="M20 25 L55 69 L55 76 L44 76 L18 42 Z"
          fill="url(#nLogoBlue)"
        />

        {/* Right upright of N flowing into the tail 'i' */}
        <path
          d="M45 24 L58 24 L58 56 C58 66 65 72 74 72 C78 72 82 70 85 67 L85 75 C81 78 76 79 71 79 C57 79 49 71 49 57 Z"
          fill="url(#nLogoBlue)"
        />

        {/* Glowing dot of the 'i' at the tail */}
        <circle cx="77" cy="38" r="7.5" fill="url(#nLogoGreen)" />
        <circle cx="77" cy="38" r="3" fill="#ffffff" opacity="0.85" />
      </g>
    </svg>
  );
};
