import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Scan, Link as LinkIcon, Newspaper, BookOpen, User, History, ShieldCheck } from 'lucide-react';

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
  const baseClasses = "flex items-center px-4 py-3 text-slate-600 rounded-lg transition-colors duration-200";
  const activeClasses = "bg-slate-200 text-black shadow-inner";
  const inactiveClasses = "hover:bg-slate-200";

  return (
    <aside className="w-64 bg-white/80 backdrop-blur-sm border-r border-slate-200/80 p-4 flex flex-col">
      <div className="flex items-center gap-2 px-4 pb-6 mb-4 border-b border-slate-200">
          <div className="bg-slate-200 p-2 rounded-lg">
              <ShieldCheck className="w-6 h-6 text-black" />
          </div>
          <h1 className="text-xl font-bold text-slate-800">Wathiq</h1>
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
       <div className="mt-auto text-center text-xs text-slate-400 p-4">
        <p>&copy; {new Date().getFullYear()} Wathiq AI. All rights reserved.</p>
      </div>
    </aside>
  );
};

export default Sidebar;