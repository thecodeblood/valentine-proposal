
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

export const FloatingHearts: React.FC = () => {
  const hearts = useMemo(() => {
    return Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: Math.random() * 5,
      duration: 10 + Math.random() * 15,
      size: 15 + Math.random() * 25,
      opacity: 0.1 + Math.random() * 0.2,
    }));
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          initial={{ y: '110vh', rotate: 0 }}
          animate={{
            y: '-10vh',
            rotate: 360,
          }}
          transition={{
            duration: heart.duration,
            repeat: Infinity,
            delay: heart.delay,
            ease: 'linear',
          }}
          style={{
            position: 'absolute',
            left: heart.left,
            width: heart.size,
            height: heart.size,
            opacity: heart.opacity,
          }}
        >
          <svg viewBox="0 0 32 32" fill="currentColor" className="text-rose-400">
            <path d="M16 28.5L14.1 26.75C7.4 20.73 3 16.74 3 11.85C3 7.82 6.13 4.69 10.11 4.69C12.35 4.69 14.51 5.73 15.93 7.37C17.35 5.73 19.51 4.69 21.75 4.69C25.73 4.69 28.86 7.82 28.86 11.85C28.86 16.74 24.46 20.73 17.76 26.75L16 28.5Z" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
};
