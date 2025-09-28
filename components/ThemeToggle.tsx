import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { Button } from './ui/Button';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={toggleTheme} 
      aria-label="Toggle theme"
      className="w-full h-auto flex items-center justify-start px-4 py-3"
    >
        {theme === 'light' ? 
            <Sun className="h-5 w-5 mr-3" /> : 
            <Moon className="h-5 w-5 mr-3" />
        }
      <span className="font-medium">{theme === 'light' ? 'Light Mode' : 'Dark Mode'}</span>
    </Button>
  );
};
