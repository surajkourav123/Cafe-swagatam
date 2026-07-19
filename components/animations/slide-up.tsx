'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { ANIMATION } from '@/config/constants';
import { cn } from '@/lib/utils';

interface SlideUpProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  distance?: number;
  className?: string;
}

export function SlideUp({
  children,
  delay = 0,
  duration = ANIMATION.duration.normal,
  distance = 40,
  className,
}: SlideUpProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: distance }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration,
        delay,
        ease: ANIMATION.ease.smooth,
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
