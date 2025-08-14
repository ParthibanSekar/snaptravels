interface AnimatedLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function AnimatedLogo({ className = "", size = 'xl' }: AnimatedLogoProps) {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20',
    xl: 'w-24 h-24'
  };

  return (
    <div className={`${sizeClasses[size]} ${className} relative`}>
      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          <linearGradient id="mainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22D3EE">
              <animate attributeName="stop-color" values="#22D3EE;#60A5FA;#A78BFA;#22D3EE" dur="4s" repeatCount="indefinite"/>
            </stop>
            <stop offset="50%" stopColor="#60A5FA">
              <animate attributeName="stop-color" values="#60A5FA;#A78BFA;#34D399;#60A5FA" dur="4s" repeatCount="indefinite"/>
            </stop>
            <stop offset="100%" stopColor="#A78BFA">
              <animate attributeName="stop-color" values="#A78BFA;#34D399;#22D3EE;#A78BFA" dur="4s" repeatCount="indefinite"/>
            </stop>
          </linearGradient>
          
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          
          <filter id="pulse" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Outer glow ring */}
        <circle
          cx="60"
          cy="60"
          r="55"
          fill="none"
          stroke="url(#mainGradient)"
          strokeWidth="1"
          opacity="0.3"
          filter="url(#glow)"
        >
          <animate attributeName="r" values="50;60;50" dur="3s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.1;0.4;0.1" dur="3s" repeatCount="indefinite"/>
        </circle>
        
        {/* Main circle background */}
        <circle
          cx="60"
          cy="60"
          r="45"
          fill="url(#mainGradient)"
          filter="url(#pulse)"
          opacity="0.95"
        >
          <animate attributeName="r" values="45;47;45" dur="2s" repeatCount="indefinite"/>
        </circle>
        
        {/* Inner design ring */}
        <circle
          cx="60"
          cy="60"
          r="38"
          fill="none"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="1"
          strokeDasharray="5,3"
        >
          <animateTransform
            attributeName="transform"
            attributeType="XML"
            type="rotate"
            from="0 60 60"
            to="360 60 60"
            dur="20s"
            repeatCount="indefinite"
          />
        </circle>
        
        {/* Central airplane design */}
        <g transform="translate(60,60)" filter="url(#pulse)">
          {/* Airplane body */}
          <path
            d="M-3,-15 L3,-15 L5,-3 L3,10 L-3,10 L-5,-3 Z"
            fill="#FFFFFF"
            opacity="1"
          >
            <animateTransform
              attributeName="transform"
              attributeType="XML"
              type="translate"
              values="0,0; 0,-2; 0,0"
              dur="3s"
              repeatCount="indefinite"
            />
          </path>
          
          {/* Wings with animation */}
          <path
            d="M-15,-5 L-5,-3 L-5,3 L-15,5 Z"
            fill="#F1F5F9"
            opacity="0.95"
          >
            <animateTransform
              attributeName="transform"
              attributeType="XML"
              type="translate"
              values="0,0; 1,0; 0,0"
              dur="2s"
              repeatCount="indefinite"
            />
          </path>
          <path
            d="M5,-3 L15,-5 L15,5 L5,3 Z"
            fill="#F1F5F9"
            opacity="0.95"
          >
            <animateTransform
              attributeName="transform"
              attributeType="XML"
              type="translate"
              values="0,0; -1,0; 0,0"
              dur="2s"
              repeatCount="indefinite"
            />
          </path>
          
          {/* Tail */}
          <path
            d="M-3,10 L3,10 L2,15 L-2,15 Z"
            fill="#E2E8F0"
            opacity="0.9"
          />
          
          {/* Front detail */}
          <circle
            cx="0"
            cy="-15"
            r="2"
            fill="#34D399"
          >
            <animate attributeName="fill" values="#34D399;#22D3EE;#60A5FA;#34D399" dur="3s" repeatCount="indefinite"/>
          </circle>
        </g>
        
        {/* Animated flight trails */}
        <path
          d="M15,45 Q35,35 55,45 T95,45"
          stroke="rgba(255,255,255,0.5)"
          strokeWidth="2"
          fill="none"
          strokeDasharray="4,3"
          opacity="0.6"
        >
          <animate attributeName="stroke-dashoffset" values="0;14" dur="2s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2s" repeatCount="indefinite"/>
        </path>
        
        <path
          d="M20,75 Q40,65 60,75 T100,75"
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="1.5"
          fill="none"
          strokeDasharray="3,4"
          opacity="0.5"
        >
          <animate attributeName="stroke-dashoffset" values="0;14" dur="3s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.2;0.7;0.2" dur="3s" repeatCount="indefinite"/>
        </path>
        
        {/* Location markers */}
        <g transform="translate(85,30)">
          <path
            d="M0,-8 C-4,-8 -8,-4 -8,0 C-8,4 0,10 0,10 S8,4 8,0 C8,-4 4,-8 0,-8 Z"
            fill="#10B981"
            opacity="0.8"
          >
            <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite"/>
            <animateTransform
              attributeName="transform"
              attributeType="XML"
              type="scale"
              values="0.8;1.1;0.8"
              dur="2s"
              repeatCount="indefinite"
            />
          </path>
          <circle cx="0" cy="-2" r="2.5" fill="white"/>
        </g>
        
        <g transform="translate(95,85)">
          <path
            d="M0,-6 C-3,-6 -6,-3 -6,0 C-6,3 0,8 0,8 S6,3 6,0 C6,-3 3,-6 0,-6 Z"
            fill="#06B6D4"
            opacity="0.7"
          >
            <animate attributeName="opacity" values="0.4;0.9;0.4" dur="3s" repeatCount="indefinite"/>
            <animateTransform
              attributeName="transform"
              attributeType="XML"
              type="scale"
              values="0.9;1.2;0.9"
              dur="3s"
              repeatCount="indefinite"
            />
          </path>
          <circle cx="0" cy="-1" r="2" fill="white"/>
        </g>
        
        {/* Floating particles */}
        <circle cx="25" cy="25" r="1.5" fill="rgba(255,255,255,0.7)">
          <animate attributeName="opacity" values="0.3;0.9;0.3" dur="2.5s" repeatCount="indefinite"/>
          <animateTransform
            attributeName="transform"
            attributeType="XML"
            type="translate"
            values="0,0; 3,-2; 0,0"
            dur="4s"
            repeatCount="indefinite"
          />
        </circle>
        
        <circle cx="95" cy="25" r="1" fill="rgba(255,255,255,0.6)">
          <animate attributeName="opacity" values="0.2;0.8;0.2" dur="3s" repeatCount="indefinite"/>
          <animateTransform
            attributeName="transform"
            attributeType="XML"
            type="translate"
            values="0,0; -2,3; 0,0"
            dur="5s"
            repeatCount="indefinite"
          />
        </circle>
        
        <circle cx="30" cy="95" r="1.2" fill="rgba(255,255,255,0.8)">
          <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite"/>
          <animateTransform
            attributeName="transform"
            attributeType="XML"
            type="translate"
            values="0,0; 4,1; 0,0"
            dur="3.5s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>
    </div>
  );
}