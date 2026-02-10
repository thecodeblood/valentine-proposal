
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProposalScreenProps {
  noCount: number;
  yesScale: number;
  onNoClick: () => void;
  onYesClick: () => void;
}

const Sparkle = ({ delay }: { delay: number }) => (
  <motion.div
    initial={{ scale: 0, opacity: 0 }}
    animate={{ 
      scale: [0, 1, 0.5, 1, 0], 
      opacity: [0, 1, 0.8, 1, 0],
      rotate: [0, 45, 90]
    }}
    transition={{
      duration: 1.5,
      repeat: Infinity,
      delay: delay,
      ease: "easeInOut"
    }}
    style={{
      position: 'absolute',
      width: '6px',
      height: '6px',
      backgroundColor: 'white',
      borderRadius: '50%',
      filter: 'blur(1px)',
      boxShadow: '0 0 8px 2px rgba(255, 255, 255, 0.8)',
      top: `${Math.random() * 80 + 10}%`,
      left: `${Math.random() * 80 + 10}%`,
    }}
  />
);

export const ProposalScreen: React.FC<ProposalScreenProps> = ({
  noCount,
  yesScale,
  onNoClick,
  onYesClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const getSubtext = () => {
    if (noCount === 0) return "CHOOSE YOUR DESTINY";
    if (noCount === 1) return "Wait, let's try that again...";
    if (noCount === 2) return "Are you really sure?";
    if (noCount === 3) return "It's getting a bit crowded in here...";
    if (noCount >= 4) return "The Yes button is taking over!";
    return "The choice is becoming clearer!";
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      className="z-10 flex flex-col items-center text-center max-w-sm w-full"
    >
      {/* Enhanced Animated Background Layers */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        {/* Base Gradient Shift with Pinks and Corals */}
        <motion.div
          animate={{
            background: [
              'radial-gradient(circle at 20% 20%, #fff1f2 0%, #fce7f3 100%)',
              'radial-gradient(circle at 50% 50%, #fff7ed 0%, #ffe4e6 100%)',
              'radial-gradient(circle at 80% 80%, #fce7f3 0%, #ffedd5 100%)',
              'radial-gradient(circle at 20% 20%, #fff1f2 0%, #fce7f3 100%)',
            ],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0 opacity-80"
        />

        {/* Aura Blob 1 - Soft Pink/Lavender */}
        <motion.div
          animate={{
            x: [0, 80, -40, 0],
            y: [0, 40, 80, 0],
            scale: [1, 1.3, 0.8, 1],
            backgroundColor: ['#fecdd3', '#fbcfe8', '#fecdd3'],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -top-32 -left-32 w-[30rem] h-[30rem] rounded-full blur-[110px] opacity-25"
        />

        {/* Aura Blob 2 - Warm Coral/Peach */}
        <motion.div
          animate={{
            x: [0, -100, 60, 0],
            y: [0, 120, -40, 0],
            scale: [1, 1.2, 1.4, 1],
            backgroundColor: ['#fed7aa', '#ffe4e6', '#fed7aa'],
          }}
          transition={{
            duration: 28,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -bottom-48 -right-48 w-[40rem] h-[40rem] rounded-full blur-[130px] opacity-35"
        />

        {/* Aura Blob 3 (Center Drift) - Soft Rose */}
        <motion.div
          animate={{
            opacity: [0.1, 0.2, 0.1],
            scale: [0.8, 1.1, 0.8],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[25rem] h-[25rem] bg-rose-200 rounded-full blur-[100px]"
        />
      </div>

      <div className="relative mb-12">
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="w-32 h-32 md:w-40 md:h-40 bg-rose-200/50 rounded-full flex items-center justify-center p-4"
        >
          <div className="w-full h-full bg-white rounded-full flex items-center justify-center shadow-xl shadow-rose-200/50">
            {noCount < 4 ? (
               <span className="text-4xl md:text-5xl">🧸</span>
            ) : (
               <span className="text-4xl md:text-5xl">🥹</span>
            )}
          </div>
        </motion.div>
        
        {/* Floating Heart Icon */}
        <motion.div 
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute -top-4 -right-4 bg-rose-500 p-2 rounded-full text-white shadow-lg"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </motion.div>
      </div>

      <h1 className="text-4xl md:text-5xl font-bold text-rose-600 mb-4 leading-tight drop-shadow-sm">
        Will you be my <br />
        <span className="font-cursive text-5xl md:text-6xl text-rose-500">Valentine?</span>
      </h1>

      <p className="text-rose-400 font-semibold tracking-widest text-xs mb-10 transition-all duration-300">
        {getSubtext()}
      </p>

      <div className="relative flex flex-row items-center justify-center gap-6 w-full min-h-[160px]">
        <AnimatePresence>
          {noCount < 4 && (
            <motion.button
              key="no-button"
              exit={{ opacity: 0, scale: 0.5 }}
              onClick={onNoClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="z-10 bg-white/80 backdrop-blur-md border-2 border-rose-100 text-rose-300 hover:text-rose-400 hover:border-rose-200 font-semibold py-3 px-8 rounded-full transition-all whitespace-nowrap shadow-sm"
            >
              No
            </motion.button>
          )}
        </AnimatePresence>

        <motion.button
          key={`yes-btn-${noCount}`} 
          onClick={onYesClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          initial={{ scale: Math.max(1, yesScale - 0.4) }}
          animate={{ scale: yesScale }}
          whileHover={{ scale: yesScale * 1.05 }}
          whileTap={{ scale: yesScale * 0.95 }}
          transition={{ 
            type: "spring", 
            stiffness: 500, 
            damping: 15,
            mass: 1 
          }}
          style={{ 
            zIndex: 20 
          }}
          className="relative bg-rose-500 hover:bg-rose-600 text-white font-bold py-5 px-10 rounded-full shadow-xl shadow-rose-300/40 transition-colors whitespace-nowrap origin-center overflow-visible"
        >
          <span className="relative z-10">Yes</span>
          
          <AnimatePresence>
            {isHovered && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 pointer-events-none"
              >
                {[...Array(5)].map((_, i) => (
                  <Sparkle key={i} delay={i * 0.3} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Persistent subtle glow when scale is large */}
          {yesScale > 2 && (
            <motion.div
              animate={{ opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 rounded-full bg-rose-400 blur-2xl -z-10"
            />
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};
