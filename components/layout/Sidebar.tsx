
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Scan, Link as LinkIcon, Newspaper, BookOpen, User, History, KeyRound } from 'lucide-react';
import { Logo } from '../Logo';
import { ThemeToggle, LanguageToggle } from '../ThemeToggle';
import { useTranslation } from '../../contexts/ThemeContext';

const navItems = [
  { path: '/', labelKey: 'sidebar.home', icon: Home },
  { path: '/scanner', labelKey: 'sidebar.scanMedia', icon: Scan },
  { path: '/url-scan', labelKey: 'sidebar.urlScan', icon: LinkIcon },
  { path: '/password-checker', labelKey: 'sidebar.passwordChecker', icon: KeyRound },
  { path: '/news-verification', labelKey: 'sidebar.newsVerification', icon: Newspaper },
  { path: '/learning', labelKey: 'sidebar.learningHub', icon: BookOpen },
  { path: '/history', labelKey: 'sidebar.history', icon: History },
  { path: '/profile', labelKey: 'sidebar.profile', icon: User },
];

const Sidebar: React.FC = () => {
  const { t } = useTranslation();
  const baseClasses = "flex items-center px-4 py-3 text-slate-600 dark:text-slate-400 rounded-lg transition-colors duration-200";
  const activeClasses = "bg-slate-200 dark:bg-slate-800 text-black dark:text-white shadow-inner";
  const inactiveClasses = "hover:bg-slate-200 dark:hover:bg-slate-800";

  return (
    <aside className="h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-4 flex flex-col">
      <div className="flex items-center gap-3 px-4 pb-6 mb-4 border-b border-slate-200 dark:border-slate-800">
          <Logo className="w-8 h-8" />
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-200">Wathiq</h1>
      </div>
      <nav className="flex-1 space-y-2">
        {navItems.map(({ path, labelKey, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            className={({ isActive }) => `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
          >
            <Icon className="w-5 h-5 me-3" />
            <span className="font-medium">{t(labelKey)}</span>
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto space-y-2">
         <ThemeToggle />
         <LanguageToggle />
         <div className="text-center text-xs text-slate-400 dark:text-slate-600 p-4">
            <p>&copy; {new Date().getFullYear()} Wathiq AI. All rights reserved.</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;