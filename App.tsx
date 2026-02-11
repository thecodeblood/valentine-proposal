
import React, { useState, useEffect, useRef } from 'react';
import { Heart, Stars, Sparkles, Send } from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import confetti from 'canvas-confetti';

// Helper for random numbers
const random = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [noCount, setNoCount] = useState(0);
  const [isAccepted, setIsAccepted] = useState(false);
  const [hearts, setHearts] = useState<{ id: number; left: number; size: number; duration: number; opacity: number }[]>([]);

  // Parallax motion values for the success screen
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for success screen parallax
  const springConfig = { damping: 25, stiffness: 150 };
  const rotateX = useSpring(useTransform(mouseY, [-300, 300], [5, -5]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-300, 300], [-5, 5]), springConfig);
  const translateX = useSpring(useTransform(mouseX, [-300, 300], [-15, 15]), springConfig);
  const translateY = useSpring(useTransform(mouseY, [-300, 300], [-15, 15]), springConfig);

  // Sound effects refs
  const romanticYesAudio = useRef<HTMLAudioElement | null>(null);
  const romanticNoAudio = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize romantic audio objects
    // Yes: Graceful Harp Glissando
    romanticYesAudio.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3');
    // No: Subtle Magical Twinkle
    romanticNoAudio.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
    
    // Configure audio volume for a soft experience
    if (romanticYesAudio.current) romanticYesAudio.current.volume = 0.4;
    if (romanticNoAudio.current) romanticNoAudio.current.volume = 0.3;

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  // Track mouse for success screen parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isAccepted) {
        mouseX.set(e.clientX - window.innerWidth / 2);
        mouseY.set(e.clientY - window.innerHeight / 2);
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isAccepted, mouseX, mouseY]);

  // Playful 'No' button messages
  const noMessages = [
    "No",
    "Sure?",
    "Really?",
    "Think!",
    "Last call!",
    "Stop it!",
    "Mistake!",
    "Think hard!",
    "Certain?",
    "Wait!",
    "Heartless?",
    "Cold...",
    "Revisit?",
    "Final?",
    "You're hurting me",
    "Please? :("
  ];

  const getNoButtonText = () => noMessages[Math.min(noCount, noMessages.length - 1)];

  const handleNoClick = () => {
    // Play romantic 'No' twinkle sound
    if (romanticNoAudio.current) {
      romanticNoAudio.current.currentTime = 0;
      romanticNoAudio.current.play().catch(() => {});
    }
    setNoCount(prev => prev + 1);
  };

  const handleYesClick = () => {
    // Play romantic 'Yes' harp sound
    if (romanticYesAudio.current) {
      romanticYesAudio.current.currentTime = 0;
      romanticYesAudio.current.play().catch(() => {});
    }
    setIsAccepted(true);
    
    // Celebration confetti
    const duration = 5 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 3,
        angle: random(60, 120),
        spread: 80,
        origin: { x: 0.5, y: 1 },
        colors: ['#FFB6C1', '#FFFFFF', '#FF69B4', '#FFF0F5', '#FFC0CB'],
        gravity: 0.8,
        scalar: 1.2
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };

  // Background floating hearts
  useEffect(() => {
    const interval = setInterval(() => {
      setHearts(prev => [
        ...prev.slice(-30),
        {
          id: Date.now() + Math.random(),
          left: random(0, 100),
          size: random(8, 25),
          duration: random(6, 12),
          opacity: random(2, 6) / 10
        }
      ]);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  // Growth scale for Yes button to force overlap - aggressive growth to consume space
  const yesScale = 1 + noCount * 0.75;

  // Stagger variants for success screen elements
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 1.2, ease: [0.23, 1, 0.32, 1] }
    }
  };

  return (
    <div className="min-h-screen w-full animate-gradient flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background Atmosphere */}
      <AnimatePresence initial={false}>
        {hearts.map(heart => (
          <div
            key={heart.id}
            className="floating-heart text-pink-400"
            style={{
              left: `${heart.left}%`,
              width: `${heart.size}px`,
              height: `${heart.size}px`,
              animationDuration: `${heart.duration}s`,
              opacity: heart.opacity
            }}
          >
            <Heart fill="currentColor" size={heart.size} />
          </div>
        ))}
      </AnimatePresence>

      <main className="max-w-md w-full text-center z-10">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center gap-6"
            >
              <div className="relative">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  className="w-24 h-24 bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg border border-pink-200"
                >
                  <Heart size={40} className="text-pink-500 fill-pink-500" />
                </motion.div>
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute -inset-2 border-2 border-dashed border-pink-300 rounded-full"
                />
              </div>
              <div className="space-y-2">
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-pink-600 font-bold tracking-widest uppercase text-xs"
                >
                  Capturing a moment...
                </motion.p>
                <p className="text-pink-400/60 italic text-sm">Preparing our romantic date</p>
              </div>
            </motion.div>
          ) : !isAccepted ? (
            <motion.div
              key="proposal"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex flex-col items-center gap-12"
            >
              <div className="relative">
                <motion.div
                  animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="w-32 h-32 md:w-40 md:h-40 bg-white/50 backdrop-blur-lg rounded-full flex items-center justify-center shadow-xl border-4 border-white/60"
                >
                  <Heart size={64} className="text-pink-500 fill-pink-500 drop-shadow-lg" />
                </motion.div>
                <div className="absolute -top-4 -right-4">
                  <Sparkles className="text-pink-400 animate-pulse" />
                </div>
              </div>

              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold text-pink-600 tracking-tight leading-tight drop-shadow-sm">
                  Will you be my <br />
                  <span className="font-cursive text-7xl text-pink-700 block mt-2">Valentine?</span>
                </h1>
                <p className="text-pink-400/80 font-medium uppercase tracking-[0.2em] text-[10px] md:text-xs">
                  A question from the depths of my heart
                </p>
              </div>

              <div className="flex flex-col items-center gap-6 w-full max-w-sm relative">
                <div className="relative flex items-center justify-center gap-8 w-full min-h-[180px]">
                  {/* No Button - Lower Z Index */}
                  <motion.button
                    layout
                    initial={{ opacity: 1, scale: 1 }}
                    onClick={handleNoClick}
                    className="z-10 w-24 h-24 md:w-28 md:h-28 flex items-center justify-center text-center bg-white/95 backdrop-blur-sm text-pink-400 border-2 border-pink-100 font-medium rounded-full shadow-md hover:bg-pink-50 hover:border-pink-300 focus:outline-none transition-all p-3 text-xs md:text-sm leading-tight overflow-hidden"
                  >
                    {getNoButtonText()}
                  </motion.button>

                  {/* Yes Button - Higher Z Index & Grows to Overlap */}
                  <motion.button
                    onClick={handleYesClick}
                    style={{ scale: yesScale }}
                    whileHover={{ scale: yesScale * 1.05 }}
                    whileTap={{ scale: yesScale * 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="z-20 w-28 h-28 md:w-32 md:h-32 flex flex-col items-center justify-center bg-pink-600 text-white font-bold rounded-full shadow-lg hover:bg-pink-700 focus:outline-none transition-colors relative overflow-hidden group"
                  >
                    <span className="relative z-10 text-xl md:text-2xl">Yes!</span>
                    <Heart size={16} className="relative z-10 fill-white mt-1 animate-pulse" />
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  </motion.button>
                </div>

                <div className="flex items-center gap-1 text-pink-200 mt-4 opacity-50">
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-300"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-300 mx-1"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-300"></span>
                </div>
                <p className="text-[10px] text-pink-400/60 uppercase tracking-widest italic font-semibold">
                  A beautiful story is beginning
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col items-center gap-10"
            >
              <motion.div variants={itemVariants} className="relative">
                <motion.div
                  style={{
                    rotateX,
                    rotateY,
                    x: translateX,
                    y: translateY,
                    transformStyle: "preserve-3d"
                  }}
                  className="w-48 h-48 md:w-64 md:h-64 rounded-[3rem] overflow-hidden shadow-2xl border-[12px] border-white bg-white group cursor-default"
                >
                  <img 
                    src="https://picsum.photos/seed/valentine-romance-dream/800/800" 
                    alt="Romance" 
                    className="w-full h-full object-cover transition-transform duration-2000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-pink-500/10 to-transparent pointer-events-none" />
                </motion.div>
                
                <motion.div
                  animate={{ y: [0, -15, 0], rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-12 -left-12 bg-white p-5 rounded-[2rem] shadow-2xl border border-pink-50 text-pink-500"
                >
                  <Sparkles size={36} />
                </motion.div>
                
                <motion.div
                  animate={{ y: [0, -12, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                  className="absolute -bottom-10 -right-10 bg-pink-500 text-white p-6 rounded-full shadow-2xl border-4 border-white"
                >
                  <Heart fill="white" size={36} />
                </motion.div>
              </motion.div>

              <div className="space-y-4">
                <motion.h2 
                  variants={itemVariants}
                  className="text-6xl md:text-8xl font-cursive text-pink-600 drop-shadow-md py-2"
                >
                  My Heart is Yours!
                </motion.h2>
                <motion.p 
                  variants={itemVariants}
                  className="text-pink-400 font-bold uppercase tracking-[0.5em] text-xs md:text-sm"
                >
                  I'm over the moon right now
                </motion.p>
                <motion.div 
                  variants={itemVariants}
                  className="flex items-center justify-center gap-4 text-pink-300 mt-2"
                >
                  <Stars size={18} className="animate-spin-slow opacity-60" />
                  <span className="italic font-medium text-xl">Let's make February 14th magical</span>
                  <Stars size={18} className="animate-spin-slow opacity-60" />
                </motion.div>
              </div>

              <motion.div variants={itemVariants} className="pt-6">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 25px 40px -5px rgb(244 114 182 / 0.5)" }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-3 bg-gradient-to-br from-pink-400 to-rose-500 text-white py-5 px-16 rounded-full shadow-2xl font-bold transition-all text-xl group"
                >
                  <Heart className="fill-white transition-transform group-hover:scale-125 group-hover:rotate-6" size={24} />
                  You Made My Day!
                </motion.button>
              </motion.div>
              
              <motion.p 
                variants={itemVariants}
                className="text-[11px] text-pink-300 uppercase tracking-widest mt-8 opacity-60 font-semibold"
              >
                Everything is more beautiful now
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Atmospheric Decorations */}
      <div className="absolute top-0 left-0 p-12 text-pink-200/20 pointer-events-none hidden md:block">
        <Stars size={64} />
      </div>
      <div className="absolute bottom-0 right-0 p-12 text-pink-200/20 pointer-events-none hidden md:block">
        <Send size={64} className="rotate-12" />
      </div>
      
      <div className="absolute top-1/4 right-16 text-pink-300/15 pointer-events-none animate-pulse">
        <Sparkles size={48} />
      </div>
      <div className="absolute bottom-1/4 left-16 text-pink-300/15 pointer-events-none animate-pulse" style={{ animationDelay: '1.5s' }}>
        <Sparkles size={32} />
      </div>
    </div>
  );
};

export default App;
