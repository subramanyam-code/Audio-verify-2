import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface CircularMeterProps {
  value: number; // 0-100 (authenticity score)
  label: string;
  verdict: 'authentic' | 'suspicious' | 'fake';
}

const CircularMeter: React.FC<CircularMeterProps> = ({ value, label, verdict }) => {
  const size = 180;
  const stroke = 12;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let raf: number;
    const start = performance.now();
    const duration = 1600;
    const animate = (now: number) => {
      const elapsed = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - elapsed, 3);
      setDisplayValue(value * eased);
      if (elapsed < 1) raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  const colors = {
    authentic: { from: '#34d399', to: '#22d3ee', glow: 'rgba(52, 211, 153, 0.5)' },
    suspicious: { from: '#fbbf24', to: '#f97316', glow: 'rgba(251, 191, 36, 0.5)' },
    fake: { from: '#f43f5e', to: '#a855f7', glow: 'rgba(244, 63, 94, 0.5)' },
  }[verdict];

  const dashOffset = circumference - (displayValue / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Outer glow */}
      <div
        className="absolute inset-0 rounded-full blur-2xl opacity-60"
        style={{ background: `radial-gradient(circle, ${colors.glow}, transparent 70%)` }}
      />

      <svg width={size} height={size} className="relative -rotate-90">
        <defs>
          <linearGradient id={`grad-${verdict}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colors.from} />
            <stop offset="100%" stopColor={colors.to} />
          </linearGradient>
        </defs>

        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={stroke}
          fill="none"
        />

        {/* Progress */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={`url(#grad-${verdict})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{ filter: `drop-shadow(0 0 8px ${colors.glow})` }}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-4xl font-bold tabular-nums text-gray-800 dark:bg-gradient-to-br dark:from-white dark:to-white/70 dark:bg-clip-text dark:text-transparent"
        >
          {displayValue.toFixed(1)}%
        </motion.div>
        <div className="text-[10px] uppercase tracking-[0.2em] text-gray-800 dark:text-white/50 mt-1">{label}</div>
      </div>
    </div>
  );
};

export default CircularMeter;
