import React from 'react';
import { motion } from 'framer-motion';

const BackgroundFX: React.FC = () => {
  // Generate ambient particles
  const particles = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 20 + 15,
    delay: Math.random() * 5,
  }));

  // Floating rings
  const rings = [
    { size: 600, x: '10%', y: '20%', duration: 40, delay: 0 },
    { size: 800, x: '70%', y: '60%', duration: 55, delay: 2 },
    { size: 500, x: '40%', y: '80%', duration: 45, delay: 4 },
    { size: 700, x: '85%', y: '15%', duration: 60, delay: 1 },
  ];

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-[#070512]" />
      <div
        className="absolute inset-0 opacity-90"
        style={{
          background:
            'radial-gradient(ellipse at 20% 10%, rgba(76, 29, 149, 0.55), transparent 55%), radial-gradient(ellipse at 85% 90%, rgba(37, 99, 235, 0.45), transparent 60%), radial-gradient(ellipse at 50% 50%, rgba(15, 23, 42, 0.9), transparent 70%)',
        }}
      />

      {/* Animated gradient sweep */}
      <motion.div
        className="absolute inset-0 opacity-40"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        style={{
          background:
            'linear-gradient(135deg, rgba(99, 102, 241, 0.18) 0%, rgba(56, 189, 248, 0.12) 25%, rgba(168, 85, 247, 0.18) 50%, rgba(59, 130, 246, 0.12) 75%, rgba(139, 92, 246, 0.18) 100%)',
          backgroundSize: '400% 400%',
        }}
      />

      {/* Floating glowing rings */}
      {rings.map((ring, i) => (
        <motion.div
          key={`ring-${i}`}
          className="absolute rounded-full border border-cyan-400/10"
          style={{
            width: ring.size,
            height: ring.size,
            left: ring.x,
            top: ring.y,
            boxShadow:
              '0 0 80px rgba(56, 189, 248, 0.15), inset 0 0 80px rgba(139, 92, 246, 0.1)',
          }}
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -30, 20, 0],
            scale: [1, 1.05, 0.98, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: ring.duration,
            repeat: Infinity,
            delay: ring.delay,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Inner concentric ring at center */}
      <div className="absolute inset-0 flex items-center justify-center">
        {[1, 2, 3, 4].map((i) => (
          <motion.div
            key={`crc-${i}`}
            className="absolute rounded-full border border-blue-400/10"
            style={{
              width: 300 * i,
              height: 300 * i,
            }}
            animate={{
              scale: [1, 1.08, 1],
              opacity: [0.15, 0.35, 0.15],
            }}
            transition={{
              duration: 6 + i,
              repeat: Infinity,
              delay: i * 0.5,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Glow blobs */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full blur-[120px]"
        style={{
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.5), transparent 70%)',
          top: '10%',
          left: '5%',
        }}
        animate={{ x: [0, 100, 0], y: [0, 80, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full blur-[140px]"
        style={{
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.4), transparent 70%)',
          bottom: '5%',
          right: '5%',
        }}
        animate={{ x: [0, -80, 0], y: [0, -60, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Ambient particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-cyan-200/40"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            boxShadow: '0 0 8px rgba(165, 243, 252, 0.8)',
          }}
          animate={{
            y: [0, -50, 0],
            opacity: [0.2, 0.8, 0.2],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />
    </div>
  );
};

export default BackgroundFX;
