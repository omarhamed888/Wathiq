import React, { createContext, useState, useEffect, useContext } from 'react';

// --- TRANSLATION DATA ---
const translations = {
  en: {
    sidebar: {
      home: "Home",
      scanMedia: "Scan Media",
      urlScan: "URL Scan",
      passwordChecker: "Password Checker",
      newsVerification: "News Verification",
      learningHub: "Learning Hub",
      history: "History",
      profile: "Profile"
    },
    themeToggle: {
      lightMode: "Light Mode",
      darkMode: "Dark Mode"
    },
    languageToggle: {
      toggle: "العربية"
    },
    home: {
      title: "Stay Safe in the Digital World",
      subtitle: "Detect deepfakes, verify news, and protect yourself from digital deception with Wathiq's advanced AI technology.",
      scanButton: "Scan Media Now",
      learningButton: "Start Learning",
      stats: {
        avgTrustScore: "Avg. Trust Score",
        totalScans: "Total Scans",
        level: "Level",
        points: "Points"
      },
      recentActivity: "Recent Activity",
      securityTip: {
        title: "Daily Security Tip",
        subtitle: "Learn something new to stay protected",
        cardTitle: "Check URLs Before Clicking",
        cardContent: "Always hover over links to see the actual destination. Phishing attacks often use URLs that look similar to legitimate sites but have subtle differences.",
        learnMoreButton: "Learn More Security Tips"
      }
    }
  },
  ar: {
    sidebar: {
      home: "الرئيسية",
      scanMedia: "فحص الوسائط",
      urlScan: "فحص الروابط",
      passwordChecker: "فاحص كلمة المرور",
      newsVerification: "التحقق من الأخبار",
      learningHub: "مركز التعلم",
      history: "السجل",
      profile: "الملف الشخصي"
    },
    themeToggle: {
      lightMode: "الوضع الفاتح",
      darkMode: "الوضع الداكن"
    },
    languageToggle: {
      toggle: "English"
    },
    home: {
      title: "ابق آمنًا في العالم الرقمي",
      subtitle: "اكتشف التزييف العميق، تحقق من الأخبار، واحمِ نفسك من الخداع الرقمي باستخدام تقنية وثيق المتقدمة.",
      scanButton: "افحص الوسائط الآن",
      learningButton: "ابدأ التعلم",
      stats: {
        avgTrustScore: "متوسط درجة الثقة",
        totalScans: "إجمالي الفحوصات",
        level: "المستوى",
        points: "النقاط"
      },
      recentActivity: "النشاط الأخير",
      securityTip: {
        title: "نصيحة أمنية يومية",
        subtitle: "تعلم شيئًا جديدًا لتبقى محميًا",
        cardTitle: "تحقق من الروابط قبل النقر",
        cardContent: "مرر دائمًا فوق الروابط لرؤية الوجهة الفعلية. غالبًا ما تستخدم هجمات التصيد الاحتيالي روابط تبدو مشابهة للمواقع الشرعية ولكن بها اختلافات دقيقة.",
        learnMoreButton: "تعلم المزيد من النصائح الأمنية"
      }
    }
  }
};


// --- THEME ---
type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const storedTheme = window.localStorage.getItem('wathiq_theme');
      if (storedTheme === 'light' || storedTheme === 'dark') {
        return storedTheme;
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch (error) {
      return 'light';
    }
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    try {
      window.localStorage.setItem('wathiq_theme', theme);
    } catch (error) {
      console.error('Failed to save theme to localStorage:', error);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// --- LANGUAGE ---
type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    try {
      const storedLang = window.localStorage.getItem('wathiq_language');
      return (storedLang === 'en' || storedLang === 'ar') ? storedLang : 'en';
    } catch {
      return 'en';
    }
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.lang = language;
    root.dir = language === 'ar' ? 'rtl' : 'ltr';
    try {
      window.localStorage.setItem('wathiq_language', language);
    } catch (error) {
      console.error('Failed to save language to localStorage:', error);
    }
  }, [language]);

  const t = (key: string): string => {
    const keys = key.split('.');
    let result: any = translations[language];
    for (const k of keys) {
      result = result?.[k];
      if (result === undefined) {
        // Fallback to English if translation is missing
        let fallbackResult: any = translations.en;
        for (const fk of keys) {
          fallbackResult = fallbackResult?.[fk];
        }
        return fallbackResult || key;
      }
    }
    return result || key;
  };
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const useTranslation = () => {
  const { t } = useLanguage();
  return { t };
};