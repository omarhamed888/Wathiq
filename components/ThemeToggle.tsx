import React from 'react';
import { Sun, Moon, Languages } from 'lucide-react';
import { useTheme, useLanguage, useTranslation } from '../contexts/ThemeContext';
import { Button } from './ui/Button';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={toggleTheme} 
      aria-label="Toggle theme"
      className="w-full h-auto flex items-center justify-start px-4 py-3"
    >
        {theme === 'light' ? 
            <Sun className="h-5 w-5 me-3" /> : 
            <Moon className="h-5 w-5 me-3" />
        }
      <span className="font-medium">{t(theme === 'light' ? 'themeToggle.lightMode' : 'themeToggle.darkMode')}</span>
    </Button>
  );
};

export const LanguageToggle = () => {
    const { language, setLanguage } = useLanguage();
    const { t } = useTranslation();

    const toggleLanguage = () => {
        setLanguage(language === 'en' ? 'ar' : 'en');
    };

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            aria-label="Toggle language"
            className="w-full h-auto flex items-center justify-start px-4 py-3"
        >
            <Languages className="h-5 w-5 me-3" />
            <span className="font-medium">{t('languageToggle.toggle')}</span>
        </Button>
    );
};