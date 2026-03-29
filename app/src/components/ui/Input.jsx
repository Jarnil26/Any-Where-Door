import React from 'react';

export const Input = ({ label, error, className = '', ...props }) => {
  return (
    <div className="flex flex-col gap-1.5 w-full text-left">
      {label && (
        <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider px-1">
          {label}
        </label>
      )}
      <div className="relative group">
        <input 
          className={`flex h-11 w-full rounded-xl border border-white/10 bg-muted/30 px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent disabled:cursor-not-allowed disabled:opacity-50 transition-all ${error ? 'border-red-500/50 focus-visible:ring-red-500/50' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-[10px] font-medium text-red-500 px-1">{error}</p>}
    </div>
  );
};
