
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu } from 'lucide-react';
import { Logo } from '../Logo';
import { useLanguage } from '../../contexts/ThemeContext';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { language } = useLanguage();
  const isRtl = language === 'ar';

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 font-sans">
      {/* Desktop Sidebar */}
      <div className={`hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 ${isRtl ? 'right-0' : 'left-0'}`}>
        <Sidebar />
      </div>

      {/* Mobile Header */}
      <header className="md:hidden sticky top-0 z-40 flex items-center justify-between h-16 px-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
            <Logo className="w-8 h-8"/>
            <h1 className="text-xl font-bold text-slate-800 dark:text-slate-200">Wathiq</h1>
        </div>
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"
          aria-label="Open sidebar"
        >
          <Menu className="w-6 h-6" />
        </button>
      </header>
      
      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            {/* FIX: The framer-motion props (`initial`, `animate`, `exit`, etc.) were causing type errors. Spreading them from within an object (`{...{...}}`) is a workaround for potential type inference issues with the `motion` component. */}
            <motion.div
              {...{
                initial: { opacity: 0 },
                animate: { opacity: 1 },
                exit: { opacity: 0 },
                transition: { duration: 0.3 },
              }}
              className="fixed inset-0 bg-black/60 z-50 md:hidden"
              onClick={() => setSidebarOpen(false)}
              aria-hidden="true"
            />
            {/* FIX: The framer-motion props (`initial`, `animate`, `exit`, etc.) were causing type errors. Spreading them from within an object (`{...{...}}`) is a workaround for potential type inference issues with the `motion` component. */}
            <motion.div
              {...{
                initial: { x: isRtl ? '100%' : '-100%' },
                animate: { x: '0%' },
                exit: { x: isRtl ? '100%' : '-100%' },
                transition: { type: 'spring', stiffness: 300, damping: 30 },
              }}
              className={`fixed top-0 bottom-0 w-64 z-50 ${isRtl ? 'right-0' : 'left-0'}`}
            >
              <Sidebar />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className={`flex-1 ${isRtl ? 'md:mr-64' : 'md:ml-64'}`}>
        <div className="overflow-y-auto">
            {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
