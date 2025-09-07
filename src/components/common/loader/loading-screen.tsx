'use client';

import { motion, AnimatePresence } from 'framer-motion';

export default function LoadingScreen({ loading }: { loading: boolean }) {
  return (
    <AnimatePresence mode="wait">
      {loading && (
        <motion.div
          key="loading-screen"
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/30 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="relative">
            <div className="size-20 rounded-full border-2 border-primary/20"></div>
            <div className="absolute inset-0 size-20 animate-spin rounded-full border-t-2 border-primary"></div>
          </div>
          <div className="-ml-7 mt-4">
            <picture>
              <img
                src="/FullBlack.svg"
                alt="logo"
                className="h-full w-64 dark:invert"
              />
            </picture>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
