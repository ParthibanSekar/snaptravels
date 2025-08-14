interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function Logo({ className = "", size = 'md' }: LogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Background circle with gradient */}
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22D3EE" />
            <stop offset="50%" stopColor="#60A5FA" />
            <stop offset="100%" stopColor="#A78BFA" />
          </linearGradient>
          <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34D399" />
            <stop offset="100%" stopColor="#22D3EE" />
          </linearGradient>
          
          {/* Glow filter */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Main circle background */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="url(#logoGradient)"
          filter="url(#glow)"
          opacity="0.95"
        />
        
        {/* Inner circle for depth */}
        <circle
          cx="50"
          cy="50"
          r="38"
          fill="none"
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="1.5"
        />
        
        {/* Airplane symbol - main focus */}
        <g transform="translate(50,50)">
          {/* Airplane body */}
          <path
            d="M-2,-12 L2,-12 L4,-2 L2,8 L-2,8 L-4,-2 Z"
            fill="#FFFFFF"
            opacity="1"
          />
          
          {/* Wings */}
          <path
            d="M-12,-4 L-4,-2 L-4,2 L-12,4 Z"
            fill="#F1F5F9"
            opacity="0.95"
          />
          <path
            d="M4,-2 L12,-4 L12,4 L4,2 Z"
            fill="#F1F5F9"
            opacity="0.95"
          />
          
          {/* Tail */}
          <path
            d="M-2,8 L2,8 L1,12 L-1,12 Z"
            fill="#E2E8F0"
            opacity="0.9"
          />
          
          {/* Propeller/front detail */}
          <circle
            cx="0"
            cy="-12"
            r="1.5"
            fill="url(#accentGradient)"
          />
        </g>
        
        {/* Flight path trails */}
        <path
          d="M15,35 Q30,25 45,35 T75,35"
          stroke="rgba(255,255,255,0.8)"
          strokeWidth="2"
          fill="none"
          strokeDasharray="3,2"
        />
        <path
          d="M20,65 Q35,55 50,65 T80,65"
          stroke="rgba(255,255,255,0.6)"
          strokeWidth="1.5"
          fill="none"
          strokeDasharray="2,3"
        />
        
        {/* Location pin accent */}
        <g transform="translate(75,25)">
          <path
            d="M0,-6 C-3,-6 -6,-3 -6,0 C-6,3 0,8 0,8 S6,3 6,0 C6,-3 3,-6 0,-6 Z"
            fill="url(#accentGradient)"
            opacity="0.8"
          />
          <circle
            cx="0"
            cy="-1"
            r="2"
            fill="white"
          />
        </g>
        
        {/* Floating particles for dynamism */}
        <circle cx="25" cy="20" r="1" fill="#FFFFFF" opacity="0.9">
          <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite"/>
        </circle>
        <circle cx="80" cy="80" r="1.5" fill="#F1F5F9" opacity="0.8">
          <animate attributeName="opacity" values="0.4;0.9;0.4" dur="3s" repeatCount="indefinite"/>
        </circle>
        <circle cx="15" cy="75" r="0.8" fill="#FFFFFF" opacity="0.7">
          <animate attributeName="opacity" values="0.6;1;0.6" dur="2.5s" repeatCount="indefinite"/>
        </circle>
      </svg>
    </div>
  );
}