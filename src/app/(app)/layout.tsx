'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const [particles, setParticles] = useState<
    {
      x: string;
      y: string;
      scale: number;
      opacity: number;
      duration: number;
      drift: string;
    }[]
  >([]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const generated = Array.from({ length: 20 }).map(() => ({
      x: Math.random() * 100 + '%',
      y: Math.random() * 100 + '%',
      scale: Math.random() * 0.5 + 0.5,
      opacity: Math.random() * 0.3 + 0.1,
      duration: Math.random() * 20 + 20,
      drift: (Math.random() - 0.5) * 10 + '%',
    }));

    setParticles(generated);
  }, []);

  return (
    <div className="flex min-h-screen bg-background text-foreground selection:bg-primary/30 relative overflow-hidden">
      {/* Global 3D Decorations */}
      <div className="fixed inset-0 pointer-events-none z-0">

        {/* Dynamic Glow following mouse */}
        <motion.div
          animate={{ x: mousePos.x - 200, y: mousePos.y - 200 }}
          transition={{ type: 'spring', damping: 30, stiffness: 100 }}
          className="w-100 h-100 bg-primary/5 blur-[120px] rounded-full absolute opacity-50"
        />

        {/* Static 3D Grid */}
        <div className="absolute inset-0 bg-3d-grid opacity-[0.03] translate-z-0"></div>

        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {particles.map((particle, i) => (
            <motion.div
              key={i}
              initial={{
                x: particle.x,
                y: particle.y,
                scale: particle.scale,
                opacity: particle.opacity,
              }}
              animate={{
                y: [null, '-20%', '120%'],
                x: [null, particle.drift],
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                ease: 'linear',
              }}
              className="particle w-1.5 h-1.5"
            />
          ))}
        </div>
      </div>

      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className="flex-1 flex flex-col min-w-0 relative z-10 md:pl-64">
        <Navbar onMenuClick={() => setIsSidebarOpen(true)} />

        <main className="flex-1 mt-16 p-0 overflow-x-hidden relative">
          <AnimatePresence mode="wait">
            <motion.div
              key="content-scaler"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="w-full h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-background/60 backdrop-blur-sm z-20 md:hidden"
          />
        )}
      </AnimatePresence>

    </div>
  );
}
