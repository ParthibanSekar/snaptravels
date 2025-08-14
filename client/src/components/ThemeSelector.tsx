import { useTheme } from '@/contexts/ThemeContext';
import { Palette, Sparkles, Moon, Zap, Waves, Sunset } from 'lucide-react';

const themes = [
  {
    id: 'classic' as const,
    name: 'Booking Classic',
    description: 'Clean professional design',
    icon: Palette,
    preview: 'bg-blue-600'
  },
  {
    id: 'modern' as const,
    name: 'Futuristic Immersive',
    description: 'Next-gen immersive experience',
    icon: Sparkles,
    preview: 'bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500'
  },
  {
    id: 'night' as const,
    name: 'Night Mode',
    description: 'Dark elegant interface',
    icon: Moon,
    preview: 'bg-gray-900'
  },
  {
    id: 'future' as const,
    name: 'Future Style',
    description: 'Neon cyberpunk aesthetic',
    icon: Zap,
    preview: 'bg-gradient-to-r from-green-400 to-blue-500'
  },
  {
    id: 'ocean' as const,
    name: 'Ocean Breeze',
    description: 'Calming blue tones',
    icon: Waves,
    preview: 'bg-gradient-to-r from-blue-400 to-teal-500'
  },
  {
    id: 'sunset' as const,
    name: 'Sunset Glow',
    description: 'Warm orange gradients',
    icon: Sunset,
    preview: 'bg-gradient-to-r from-orange-400 to-pink-500'
  }
];

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-3">
      <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-3">Choose Theme</h4>
      <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
        {themes.map((themeOption) => {
          const Icon = themeOption.icon;
          const isActive = theme === themeOption.id;
          
          return (
            <button
              key={themeOption.id}
              onClick={() => setTheme(themeOption.id)}
              className={`
                flex items-center gap-3 p-3 rounded-lg text-left transition-all duration-200
                ${isActive 
                  ? 'bg-blue-50 border-2 border-blue-500 text-blue-900' 
                  : 'bg-white hover:bg-gray-50 border border-gray-200 text-gray-700'
                }
              `}
            >
              <div className={`w-8 h-8 rounded-lg ${themeOption.preview} flex items-center justify-center`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm">{themeOption.name}</div>
                <div className="text-xs text-gray-500 truncate">{themeOption.description}</div>
              </div>
              {isActive && (
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}