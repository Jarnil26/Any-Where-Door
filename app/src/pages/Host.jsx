import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Power, Shield, Radio, Activity, Copy, Check, ChevronRight, XCircle, Signal, Lock, Cpu } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/StatusBadge';

export const Host = ({ hostId, onStopSharing, connected }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(hostId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 text-foreground relative overflow-hidden dashboard-grid">
      <div className="grain-overlay" />
      
      {/* Background Subtle Accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 blur-[140px] rounded-full pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl relative z-10"
      >
        <Card className="p-12 flex flex-col items-center text-center">
          <motion.div 
            animate={{ 
              opacity: [0.5, 1, 0.5]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="mb-10 relative"
          >
            <div className="w-20 h-20 glass-pro rounded-[2.5rem] flex items-center justify-center shadow-pro-glow border-accent/20">
              <Signal size={36} className="text-accent" />
            </div>
            <div className="absolute -top-1 -right-1 group cursor-help">
               <StatusBadge active label="BROADCASTING" className="scale-75 origin-top-right shadow-pro-glow" />
            </div>
          </motion.div>

          <div className="space-y-1 mb-10 text-center">
            <h1 className="text-2xl font-bold tracking-tight">Active Broadcast Session</h1>
            <p className="text-xs text-muted-foreground max-w-[280px] mx-auto leading-relaxed">
              Your workstation is securely bridged to the AnyWhere network. Provide the token below to initiate P2P control.
            </p>
          </div>

          <div className="w-full bg-muted/20 border border-white/5 rounded-3xl p-8 mb-10 text-left relative overflow-hidden group">
             <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
             <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground/60 mb-4 block">Session Authentication TOKEN</span>
             <div className="flex items-center justify-between gap-4">
                <span className="text-5xl font-mono font-bold tracking-[0.25em] text-foreground">
                  {hostId || '••••••'}
                </span>
                <button 
                  onClick={handleCopy}
                  className="p-3 hover:bg-white/5 rounded-xl transition-all text-muted-foreground hover:text-accent"
                >
                  {copied ? <Check size={24} className="text-green-500" /> : <Copy size={24} />}
                </button>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full mb-10">
             <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 text-left space-y-2">
                <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                   <Lock size={12} /> Encryption
                </div>
                <div className="text-sm font-bold text-foreground uppercase tracking-tight">AES-GCM 256</div>
             </div>
             <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 text-left space-y-2">
                <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                   <Cpu size={12} /> Optimization
                </div>
                <div className="text-sm font-bold text-foreground uppercase tracking-tight">E2E WEBRTC</div>
             </div>
          </div>

          <Button 
            onClick={onStopSharing}
            variant="danger"
            size="lg"
            className="w-full h-14 rounded-2xl font-bold tracking-widest"
          >
            <Power size={18} className="mr-2" /> TERMINATE SESSION
          </Button>

          <AnimatePresence mode="wait">
            <motion.div 
              key={connected ? 'connected' : 'waiting'}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`mt-10 flex items-center justify-center gap-3 text-[10px] font-bold tracking-widest uppercase ${connected ? 'text-accent' : 'text-muted-foreground'}`}
            >
              <div className={`w-1.5 h-1.5 rounded-full ${connected ? 'bg-accent animate-pulse shadow-pro-glow' : 'bg-muted-foreground/30'}`} />
              {connected ? 'Remote Peer Connected & Controlling' : 'Awaiting Peer Authorization...'}
            </motion.div>
          </AnimatePresence>
        </Card>
      </motion.div>
      
      <footer className="absolute bottom-6 text-[9px] font-bold uppercase tracking-[0.4em] text-muted-foreground opacity-30">
         AnyWhere Security Laboratory • Direct Node v4.0.2
      </footer>
    </div>
  );
};
