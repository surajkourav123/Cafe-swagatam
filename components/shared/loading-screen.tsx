'use client';

import { motion } from 'framer-motion';

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#FCFBF9]">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1.0] }}
        className="flex flex-col items-center"
      >
        <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-stone-900 font-bold tracking-tight mb-4">
          Swagatam Cafe
        </h1>
        <div className="flex space-x-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0.3, y: 0 }}
              animate={{ opacity: 1, y: -6 }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                repeatType: 'reverse',
                delay: i * 0.15,
              }}
              className="w-2 h-2 rounded-full bg-amber-600"
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
