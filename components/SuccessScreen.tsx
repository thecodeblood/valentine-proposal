
import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';

interface SuccessScreenProps {
  playSuccessSound: () => void;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const CountdownTimer: React.FC = () => {
  const targetDate = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    let vDay = new Date(currentYear, 1, 14); // Feb 14 (month is 0-indexed)
    if (now > vDay) {
      vDay = new Date(currentYear + 1, 1, 14);
    }
    return vDay;
  }, []);

  const calculateTimeLeft = (): TimeLeft => {
    const difference = +targetDate - +new Date();
    let timeLeft: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <div className="relative">
        <span className="text-3xl md:text-4xl font-bold text-rose-600 tabular-nums drop-shadow-[0_0_8px_rgba(225,29,72,0.3)]">
          {value.toString().padStart(2, '0')}
        </span>
        <motion.div
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 blur-lg bg-rose-200 -z-10"
        />
      </div>
      <span className="text-[10px] uppercase tracking-widest text-rose-400 font-bold mt-1">
        {label}
      </span>
    </div>
  );

  return (
    <div className="flex gap-4 md:gap-6 mt-4 mb-8 p-6 bg-white/40 backdrop-blur-sm rounded-3xl border border-rose-100/50 shadow-inner shadow-white/50">
      <TimeUnit value={timeLeft.days} label="Days" />
      <TimeUnit value={timeLeft.hours} label="Hrs" />
      <TimeUnit value={timeLeft.minutes} label="Min" />
      <TimeUnit value={timeLeft.seconds} label="Sec" />
    </div>
  );
};

export const SuccessScreen: React.FC<SuccessScreenProps> = ({ playSuccessSound }) => {
  const [confetti, setConfetti] = useState<{ id: number; rotDir: number; xOffset: number; speed: number }[]>([]);

  useEffect(() => {
    setConfetti(
      Array.from({ length: 60 }).map((_, i) => ({
        id: i,
        rotDir: Math.random() > 0.5 ? 1 : -1,
        xOffset: (Math.random() - 0.5) * 60,
        speed: 3 + Math.random() * 4,
      }))
    );
    playSuccessSound();
  }, [playSuccessSound]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="z-10 flex flex-col items-center text-center max-w-sm w-full px-4"
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {confetti.map((c) => (
          <motion.div
            key={c.id}
            initial={{ 
              top: '-10%', 
              left: `${Math.random() * 100}%`,
              scale: Math.random() * 0.4 + 0.4,
              rotate: 0,
              rotateX: 0,
              rotateY: 0,
              opacity: 1
            }}
            animate={{ 
              top: '110%',
              x: [0, c.xOffset, -c.xOffset / 2, c.xOffset * 1.2, 0],
              rotate: 360 * c.rotDir * 2,
              rotateX: [0, 180, 360, 540, 720],
              rotateY: [0, 360, 720, 1080],
              opacity: [1, 1, 0.9, 0],
            }}
            transition={{
              duration: c.speed,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "linear",
              x: {
                duration: c.speed / 2,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
            className={`absolute w-3 h-3 rounded-sm shadow-sm ${
              ['bg-rose-400', 'bg-pink-300', 'bg-rose-200', 'bg-white', 'bg-rose-500', 'bg-rose-300'][c.id % 6]
            }`}
            style={{ perspective: '500px' }}
          />
        ))}
      </div>

      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", damping: 12, stiffness: 200 }}
        className="w-20 h-20 bg-rose-500 rounded-full flex items-center justify-center text-white mb-6 shadow-xl shadow-rose-200"
      >
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      </motion.div>

      <h1 className="text-4xl md:text-5xl font-bold text-rose-600 mb-2 leading-tight font-cursive">
        Yay! See you on the 14th!
      </h1>
      
      <CountdownTimer />

      <p className="text-rose-400 font-semibold text-xs mb-8 italic uppercase tracking-widest opacity-80">
        Our countdown has begun ❤️
      </p>

      <motion.div
        whileHover={{ scale: 1.05 }}
        className="relative w-full aspect-square max-w-[240px] rounded-3xl overflow-hidden shadow-2xl shadow-rose-300/50 mb-6"
      >
        <img 
          src="https://picsum.photos/seed/valentine-success/600/600" 
          alt="Romantic Moment" 
          className="w-full h-full object-cover grayscale-[10%] sepia-[10%] contrast-[110%]"
        />
        <div className="absolute inset-0 bg-rose-500/10 mix-blend-overlay" />
        
        <motion.div 
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute bottom-3 right-3 bg-rose-500 text-white p-2 rounded-full shadow-lg"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </motion.div>
      </motion.div>

      <motion.button
        onClick={() => window.location.reload()}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="bg-rose-500 text-white py-4 px-10 rounded-full font-bold shadow-lg shadow-rose-300 flex items-center gap-2"
      >
        <span>❤️ Can't Wait!</span>
      </motion.button>
    </motion.div>
  );
};
