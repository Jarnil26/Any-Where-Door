import React from 'react';
import { motion } from 'framer-motion';

export const Card = ({ children, className = '', glow = false, ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative rounded-3xl bg-[#18181b]/50 backdrop-blur-xl border border-white/5 shadow-2xl overflow-hidden ${glow ? 'shadow-pro-glow' : ''} ${className}`}
      {...props}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};
