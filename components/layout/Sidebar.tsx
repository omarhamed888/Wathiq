
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Scan, Link as LinkIcon, Newspaper, BookOpen, User, History } from 'lucide-react';
import { Logo } from '../Logo';
import { ThemeToggle } from '../ThemeToggle';

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/scanner', label: 'Scan Media', icon: Scan },
  { path: '/url-scan', label: 'URL Scan', icon: LinkIcon },
  { path: '/news-verification', label: 'News Verification', icon: Newspaper },
  { path: '/learning', label: 'Learning Hub', icon: BookOpen },
  { path: '/history', label: 'History', icon: History },
  { path: '/profile', label: 'Profile', icon: User },
];

const Sidebar: React.FC = () => {
  const baseClasses = "flex items-center px-4 py-3 text-slate-600 dark:text-slate-400 rounded-lg transition-colors duration-200";
  const activeClasses = "bg-slate-200 dark:bg-slate-800 text-black dark:text-white shadow-inner";
  const inactiveClasses = "hover:bg-slate-200 dark:hover:bg-slate-800";

  return (
    <aside className="h-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-r border-slate-200/80 dark:border-slate-800 p-4 flex flex-col">
      <div className="flex items-center gap-3 px-4 pb-6 mb-4 border-b border-slate-200 dark:border-slate-800">
          <Logo className="w-8 h-8" />
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-200">Wathiq</h1>
      </div>
      <nav className="flex-1 space-y-2">
        {navItems.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            className={({ isActive }) => `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
          >
            <Icon className="w-5 h-5 mr-3" />
            <span className="font-medium">{label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto space-y-2">
         <ThemeToggle />
         <div className="text-center text-xs text-slate-400 dark:text-slate-600 p-4">
            <p>&copy; {new Date().getFullYear()} Wathiq AI. All rights reserved.</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;