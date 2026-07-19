'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import { ANIMATION } from '@/config/constants';

interface PageTransitionProps {
  children: ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{
          duration: ANIMATION.duration.fast,
          ease: ANIMATION.ease.smooth,
        }}
        className="w-full h-full flex flex-col flex-grow"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
