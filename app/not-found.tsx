'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FCFBF9] text-stone-900 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h1 className="text-8xl md:text-9xl font-extrabold text-stone-950 mb-4 font-heading tracking-tight">
          404
        </h1>
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-stone-850">Page Not Found</h2>
        <p className="text-stone-500 mb-8 max-w-md mx-auto">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-xl bg-stone-900 hover:bg-stone-800 px-8 py-3 text-sm font-semibold text-white shadow-sm transition-all"
        >
          Back to Home
        </Link>
      </motion.div>
    </div>
  );
}
