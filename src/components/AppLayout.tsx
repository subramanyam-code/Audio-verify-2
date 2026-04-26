import React from 'react';
import BackgroundFX from './BackgroundFX';
import CursorFX from './CursorFX';
import Navbar from './Navbar';
import Hero from './Hero';
import UploadCard from './UploadCard';
import { ShieldCheck } from 'lucide-react';

const AppLayout: React.FC = () => {
  return (
    <div className="relative min-h-screen w-full text-black dark:text-white overflow-x-hidden font-sans">
      <BackgroundFX />
      <CursorFX />
      <Navbar />

      <main className="relative pt-24 sm:pt-28 pb-16 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <Hero />
          <UploadCard />
        </div>
      </main>

      <footer className="relative pb-8 px-4">
        <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-white/40 text-xs sm:text-sm">
          <ShieldCheck className="w-4 h-4" />
          <span>Your files are secure and processed privately</span>
        </div>
      </footer>
    </div>
  );
};

export default AppLayout;
