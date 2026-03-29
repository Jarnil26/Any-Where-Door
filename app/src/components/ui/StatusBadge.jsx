import React from 'react';
import { motion } from 'framer-motion';

export const StatusBadge = ({ active, label, activeLabel, className = '' }) => {
  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/5 backdrop-blur-md shadow-sm ${className}`}>
      <motion.div 
        animate={{ 
          opacity: active ? [1, 0.4, 1] : 1
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-accent shadow-pro-glow' : 'bg-muted-foreground/30'}`} 
      />
      <span className={`text-[9px] font-bold uppercase tracking-widest ${active ? 'text-foreground' : 'text-muted-foreground'}`}>
        {active ? (activeLabel || label) : label}
      </span>
    </div>
  );
};
