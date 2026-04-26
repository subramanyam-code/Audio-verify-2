import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, AudioWaveform } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';

const Navbar: React.FC = () => {
  const { theme, setTheme } = useTheme()

  const handleClick = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <motion.nav
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/20 border-b border-white/5"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-cyan-400/40 blur-lg rounded-full" />
              <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                <AudioWaveform className="w-5 h-5 text-black dark:text-white" />
            </div>
          </div>
          <span className="text-lg sm:text-xl font-semibold tracking-tight text-black dark:bg-gradient-to-r dark:from-cyan-200 dark:via-cyan-100 dark:to-purple-200 dark:bg-clip-text dark:text-transparent">
            EchoGuard AI
          </span>
        </div>

        <div>
          <button
            aria-label="Toggle theme"
            aria-pressed={theme === 'light'}
            onClick={handleClick}
            className={`relative group p-2 rounded-full border transition transform duration-300 ${theme === 'dark' ? 'border-white/10 bg-white/5 hover:bg-white/10' : 'border-slate-200 bg-white/80 shadow-sm'}`}
          >
            <div className="absolute inset-0 rounded-full blur-md opacity-0 group-hover:opacity-100 transition" />
            {theme === 'dark' ? (
              <Sun className="relative w-4 h-4 text-cyan-200 transform transition-transform duration-300 group-hover:rotate-90" />
            ) : (
              <Moon className="relative w-4 h-4 text-gray-700 transform transition-transform duration-300 rotate-0" />
            )}
          </button>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
