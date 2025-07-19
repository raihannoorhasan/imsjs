import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`
        relative inline-flex items-center justify-center w-12 h-12 rounded-xl
        bg-white dark:bg-gray-800 
        border border-gray-200 dark:border-gray-700
        shadow-sm hover:shadow-md
        transition-all duration-300 ease-in-out
        hover:scale-105 active:scale-95
        group
        ${className}
      `}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {/* Background gradient that changes with theme */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-700 dark:to-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Icon container with smooth rotation */}
      <div className="relative z-10 transform transition-transform duration-500 ease-in-out">
        {isDark ? (
          <Sun className="w-5 h-5 text-yellow-500 group-hover:text-yellow-400 transition-colors duration-300" />
        ) : (
          <Moon className="w-5 h-5 text-indigo-600 group-hover:text-indigo-500 transition-colors duration-300" />
        )}
      </div>
      
      {/* Subtle glow effect */}
      <div className={`
        absolute inset-0 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300
        ${isDark 
          ? 'bg-gradient-to-r from-yellow-400 to-orange-400' 
          : 'bg-gradient-to-r from-blue-400 to-indigo-400'
        }
      `} />
    </button>
  );
}

export function ThemeToggleDropdown({ className = '' }) {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = React.useState(false);

  const themes = [
    { id: 'light', label: 'Light', icon: Sun },
    { id: 'dark', label: 'Dark', icon: Moon },
    { id: 'system', label: 'System', icon: Monitor }
  ];

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        {theme === 'dark' ? (
          <Moon className="w-4 h-4" />
        ) : theme === 'light' ? (
          <Sun className="w-4 h-4" />
        ) : (
          <Monitor className="w-4 h-4" />
        )}
        <span className="text-sm font-medium">Theme</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
          {themes.map((themeOption) => {
            const Icon = themeOption.icon;
            return (
              <button
                key={themeOption.id}
                onClick={() => {
                  setTheme(themeOption.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center space-x-2 px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                  theme === themeOption.id ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : ''
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{themeOption.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}