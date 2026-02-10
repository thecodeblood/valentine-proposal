
import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FloatingHearts } from './components/FloatingHearts';
import { ProposalScreen } from './components/ProposalScreen';
import { SuccessScreen } from './components/SuccessScreen';

// Simple Audio Synthesis Utility
const playSound = (type: 'pop' | 'ding' | 'success') => {
  const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContextClass) return;
  
  const ctx = new AudioContextClass();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  const now = ctx.currentTime;

  if (type === 'pop') {
    // Subtle low-to-high pop for 'No'
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.1);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
    osc.start(now);
    osc.stop(now + 0.1);
  } else if (type === 'ding') {
    // Bright high 'Ding' for 'Yes'
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    osc.start(now);
    osc.stop(now + 0.3);
  } else if (type === 'success') {
    // Magical Arpeggio for Success
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine';
      o.frequency.setValueAtTime(freq, now + i * 0.1);
      g.gain.setValueAtTime(0, now + i * 0.1);
      g.gain.linearRampToValueAtTime(0.05, now + i * 0.1 + 0.05);
      g.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.4);
      o.connect(g);
      g.connect(ctx.destination);
      o.start(now + i * 0.1);
      o.stop(now + i * 0.1 + 0.5);
    });
  }
};

const App: React.FC = () => {
  const [accepted, setAccepted] = useState(false);
  const [noCount, setNoCount] = useState(0);
  const [yesScale, setYesScale] = useState(1);

  const handleNoClick = useCallback(() => {
    playSound('pop');
    setNoCount((prev) => prev + 1);
    setYesScale((prev) => prev + 0.4);
  }, []);

  const handleYesClick = useCallback(() => {
    playSound('ding');
    setAccepted(true);
    // Success sound is triggered within SuccessScreen on mount for timing
  }, []);

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-rose-50 to-pink-100 p-6 overflow-hidden">
      <FloatingHearts />
      
      <AnimatePresence mode="wait">
        {!accepted ? (
          <ProposalScreen
            key="proposal"
            noCount={noCount}
            yesScale={yesScale}
            onNoClick={handleNoClick}
            onYesClick={handleYesClick}
          />
        ) : (
          <SuccessScreen 
            key="success" 
            playSuccessSound={() => playSound('success')} 
          />
        )}
      </AnimatePresence>

      <footer className="absolute bottom-6 w-full text-center text-rose-300 text-xs tracking-widest uppercase opacity-60">
        Sent with love
      </footer>
    </div>
  );
};

export default App;
