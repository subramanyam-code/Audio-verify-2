import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Ripple {
  id: number;
  x: number;
  y: number;
}

const CursorFX: React.FC = () => {
  const [mouse, setMouse] = useState({ x: -200, y: -200 });
  const [ripples, setRipples] = useState<Ripple[]>([]);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setMouse({ x: e.clientX, y: e.clientY });
    };
    const handleClick = (e: MouseEvent) => {
      const id = Date.now() + Math.random();
      setRipples((prev) => [...prev, { id, x: e.clientX, y: e.clientY }]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, 900);
    };
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('click', handleClick);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <>
      {/* Cursor glow */}
      <div
        className="fixed pointer-events-none z-[60] rounded-full"
        style={{
          left: mouse.x - 150,
          top: mouse.y - 150,
          width: 300,
          height: 300,
          background:
            'radial-gradient(circle, rgba(99, 179, 237, 0.18), transparent 60%)',
          filter: 'blur(20px)',
          transition: 'transform 0.1s ease-out',
        }}
      />

      {/* Click ripples */}
      <AnimatePresence>
        {ripples.map((r) => (
          <motion.div
            key={r.id}
            className="fixed pointer-events-none z-[60] rounded-full border-2 border-cyan-300/70"
            style={{
              left: r.x,
              top: r.y,
              boxShadow: '0 0 30px rgba(56, 189, 248, 0.7)',
            }}
            initial={{ width: 0, height: 0, x: 0, y: 0, opacity: 1 }}
            animate={{
              width: 200,
              height: 200,
              x: -100,
              y: -100,
              opacity: 0,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.85, ease: 'easeOut' }}
          />
        ))}
      </AnimatePresence>
    </>
  );
};

export default CursorFX;
