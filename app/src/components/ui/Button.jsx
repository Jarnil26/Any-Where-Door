import React from 'react';
import { motion } from 'framer-motion';

const variants = {
  primary: "bg-accent text-accent-foreground shadow-sm hover:bg-accent-hover active:bg-accent/90",
  secondary: "bg-muted text-foreground hover:bg-muted/80 border border-white/5",
  outline: "bg-transparent border border-white/10 text-foreground hover:bg-white/5",
  danger: "bg-red-600/10 border border-red-600/20 text-red-500 hover:bg-red-600 hover:text-white",
  glass: "glass-pro text-white hover:bg-white/10",
  ghost: "bg-transparent text-muted-foreground hover:text-foreground hover:bg-white/5"
};

const sizes = {
  sm: "px-3 py-1.5 text-xs rounded-lg font-medium",
  md: "px-5 py-2.5 text-sm rounded-xl font-semibold tracking-tight",
  lg: "px-8 py-4 text-base rounded-2xl font-bold tracking-tight"
};

export const Button = ({ children, variant = 'primary', size = 'md', className = '', ...props }) => {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      className={`inline-flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent disabled:pointer-events-none disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};
