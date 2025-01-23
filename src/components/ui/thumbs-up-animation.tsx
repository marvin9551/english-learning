'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ThumbsUp } from 'lucide-react';

interface ThumbsUpAnimationProps {
  isVisible: boolean;
}

export function ThumbsUpAnimation({ isVisible }: ThumbsUpAnimationProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1.5 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.5 }}
        >
          <ThumbsUp className="text-green-500" size={48} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}