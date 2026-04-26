import React from 'react';
import { motion } from 'framer-motion';
import { Settings, AudioWaveform } from 'lucide-react';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';

const Navbar: React.FC = () => {
  const [brightness, setBrightness] = React.useState<number>(() => {
    try {
      const stored = localStorage.getItem('app:brightness')
      if (stored) return parseFloat(stored)
    } catch (e) {}

    try {
      const css = getComputedStyle(document.documentElement).getPropertyValue('--app-brightness')
      if (css) return parseFloat(css)
    } catch (e) {}

    return 1
  })

  React.useEffect(() => {
    try {
      document.documentElement.style.setProperty('--app-brightness', String(brightness))
      localStorage.setItem('app:brightness', String(brightness))
    } catch (e) {}
  }, [brightness])

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
              <AudioWaveform className="w-5 h-5 text-white" />
            </div>
          </div>
          <span className="text-lg sm:text-xl font-semibold tracking-tight bg-gradient-to-r from-white via-cyan-100 to-purple-200 bg-clip-text text-transparent">
            EchoGuard AI
          </span>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <button
              aria-label="Settings"
              className="relative group p-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition"
            >
              <div className="absolute inset-0 rounded-full bg-cyan-400/20 blur-md opacity-0 group-hover:opacity-100 transition" />
              <Settings className="relative w-4 h-4 text-cyan-200 group-hover:rotate-90 transition-transform duration-500" />
            </button>
          </SheetTrigger>

          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>Settings</SheetTitle>
              <SheetDescription>Adjust application preferences</SheetDescription>
            </SheetHeader>

            <div className="px-6 py-4">
              <label className="text-sm text-muted-foreground">Brightness</label>
              <div className="mt-2 flex items-center gap-3">
                <input
                  type="range"
                  min={0.5}
                  max={1.5}
                  step={0.01}
                  value={brightness}
                  onChange={(e) => setBrightness(parseFloat(e.target.value))}
                  className="w-full"
                />
                <span className="w-12 text-right text-sm">{Math.round(brightness * 100)}%</span>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </motion.nav>
  );
};

export default Navbar;
