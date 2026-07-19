'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FCFBF9] text-stone-900 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4 font-heading text-red-600 tracking-tight">
          Something went wrong!
        </h2>
        <p className="text-stone-500 mb-8 max-w-md mx-auto">
          We apologize for the inconvenience. Our team has been notified of the issue.
        </p>
        <button
          onClick={() => reset()}
          className="inline-flex items-center justify-center rounded-xl bg-stone-900 hover:bg-stone-850 px-8 py-3 text-sm font-semibold text-white shadow-sm transition-all cursor-pointer"
        >
          Try Again
        </button>
      </motion.div>
    </div>
  );
}
