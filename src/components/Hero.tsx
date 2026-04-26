import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const headlines = [
  'Analyze Audio Authenticity',
  'Detect Deepfake Voices Instantly',
  'Verify Audio, Build Trust',
];

const Hero: React.FC = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % headlines.length);
    }, 7000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative text-center max-w-4xl mx-auto pt-4 pb-10 sm:pb-14">
      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full dark:bg-white/5 bg-white/10 backdrop-blur-md border border-cyan-400/30 mb-6 shadow-[0_0_20px_rgba(56,189,248,0.08)]"
      >
        <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
        <span className="text-xs sm:text-sm font-medium text-gray-800 dark:bg-gradient-to-r dark:from-cyan-200 dark:to-purple-200 dark:bg-clip-text dark:text-transparent">
          AI-Powered Audio Intelligence
        </span>
      </motion.div>

      {/* Rotating heading */}
      <div className="relative h-[120px] sm:h-[140px] md:h-[160px] flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.h1
            key={index}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="absolute text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight px-4"
          >
            <span className="text-gray-800 dark:bg-gradient-to-br dark:from-white dark:via-cyan-100 dark:to-purple-300 dark:bg-clip-text dark:text-transparent">
              {headlines[index]}
            </span>
          </motion.h1>
        </AnimatePresence>
      </div>

      {/* Subtext */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mt-4 text-base sm:text-lg text-gray-800 dark:text-white/60 max-w-2xl mx-auto px-4"
      >
        Advanced AI analyzes audio patterns to detect synthetic and manipulated voices.
      </motion.p>
    </div>
  );
};

export default Hero;
