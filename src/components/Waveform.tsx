import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface WaveformProps {
  bars?: number;
  seed?: number;
}

const Waveform: React.FC<WaveformProps> = ({ bars = 64, seed = 1 }) => {
  // Deterministic pseudo-random heights for a believable waveform
  const heights = useMemo(() => {
    const arr: number[] = [];
    let s = seed * 9301 + 49297;
    for (let i = 0; i < bars; i++) {
      s = (s * 9301 + 49297) % 233280;
      const rnd = s / 233280;
      // Shape envelope: louder in middle, softer at edges
      const t = i / bars;
      const env = Math.sin(Math.PI * t) * 0.7 + 0.3;
      const h = (rnd * 0.7 + 0.3) * env;
      arr.push(h);
    }
    return arr;
  }, [bars, seed]);

  return (
    <div className="relative w-full h-24 sm:h-28 flex items-center justify-center gap-[3px] px-2">
      {/* Center axis line */}
      <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />

      {heights.map((h, i) => (
        <motion.div
          key={i}
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: 1, opacity: 1 }}
          transition={{
            duration: 0.4,
            delay: i * 0.012,
            ease: 'easeOut',
          }}
          className="relative flex-1 origin-center"
          style={{ maxWidth: 6 }}
        >
          <motion.div
            className="w-full rounded-full bg-gradient-to-t from-cyan-400 via-blue-400 to-purple-400"
            style={{
              height: `${h * 100}%`,
              boxShadow: '0 0 8px rgba(56, 189, 248, 0.6)',
              minHeight: 2,
            }}
            animate={{
              scaleY: [1, 0.85 + h * 0.3, 1],
            }}
            transition={{
              duration: 1.6 + (i % 5) * 0.2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.02,
            }}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default Waveform;
