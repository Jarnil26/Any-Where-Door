import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Maximize, MousePointer2, Keyboard, 
  Wifi, Shield, Activity, Monitor, Power, Zap,
  Menu, ChevronDown, Pointer, Settings, Play, Pause,
  Command, Terminal, HardDrive
} from 'lucide-react';
import { Button } from '../components/ui/Button';

export const Client = ({ videoRef, connected, onDisconnect, sendInput, connectId }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showToolbar, setShowToolbar] = useState(true);
  const [inputEnabled, setInputEnabled] = useState(true);
  const [lastEvent, setLastEvent] = useState(null);
  const containerRef = useRef(null);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleMouseEvent = (type, e) => {
    if (!connected || !inputEnabled || !videoRef.current) return;
    const rect = videoRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    sendInput({ type, x, y, button: e.button });
    setLastEvent({ type, x: x.toFixed(2), y: y.toFixed(2) });
  };

  useEffect(() => {
    const down = (e) => {
      if (inputEnabled) sendInput({ type: 'keydown', key: e.key });
    };
    const up = (e) => {
      if (inputEnabled) sendInput({ type: 'keyup', key: e.key });
    };

    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, [inputEnabled, sendInput]);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 bg-background flex flex-col items-center justify-center overflow-hidden"
    >
      <div className="grain-overlay" />

      {/* Main Stream Area */}
      <div className="relative w-full h-full flex items-center justify-center group cursor-none">
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          className="w-full h-full object-contain select-none pointer-events-auto shadow-2xl"
          onMouseMove={handleMouseEvent}
          onMouseDown={handleMouseEvent}
          onMouseUp={handleMouseEvent}
          onContextMenu={(e) => e.preventDefault()}
        />

        {/* Remote Feedback Cursor */}
        {lastEvent && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            style={{ left: `${lastEvent.x * 100}%`, top: `${lastEvent.y * 100}%` }}
            className="absolute z-50 pointer-events-none"
          >
             <Pointer size={12} className="text-accent" />
          </motion.div>
        )}

        {/* Professional Handshake Overlay */}
        <AnimatePresence>
          {!connected && (
            <motion.div 
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/95 z-[60] flex flex-col items-center justify-center backdrop-blur-sm"
            >
               <div className="relative mb-10">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="w-16 h-16 border-2 border-white/5 border-t-accent rounded-full"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Zap size={20} className="text-accent animate-pulse" />
                  </div>
               </div>
               <div className="text-center space-y-2">
                  <h4 className="text-sm font-bold uppercase tracking-[0.4em] text-foreground">Establishing Bridge</h4>
                  <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Awaiting P2P Signal Acknowledgement...</p>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Slim Top Navigation Bar */}
      <motion.nav 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute top-0 inset-x-0 h-14 px-6 flex items-center justify-between z-50 glass-pro border-b border-white/5"
      >
        <div className="flex items-center gap-6">
           <div className="flex items-center gap-3 pr-6 border-r border-white/10">
              <div className="w-7 h-7 bg-accent rounded-lg flex items-center justify-center shadow-pro-glow">
                 <Monitor size={14} className="text-white" />
              </div>
              <span className="text-xs font-bold tracking-tight text-foreground">AnyWhere</span>
           </div>
           
           <div className="flex items-center gap-4">
              <div className="flex flex-col">
                 <span className="text-[8px] font-bold uppercase text-muted-foreground tracking-widest">Remote Node</span>
                 <span className="text-[10px] font-mono font-bold text-accent uppercase">{connectId || 'Connecting...'}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-accent/10 px-2 py-0.5 rounded-md border border-accent/20">
                 <div className="w-1 h-1 rounded-full bg-accent animate-pulse" />
                 <span className="text-[9px] font-bold text-accent uppercase tracking-wider">Session Active</span>
              </div>
           </div>
        </div>

        <div className="flex items-center gap-4">
           <div className="hidden lg:flex items-center gap-5 px-5 text-muted-foreground">
              <div className="flex items-center gap-2 pr-4 border-r border-white/5">
                <Wifi size={13} className="text-green-500" />
                <span className="text-[9px] font-bold uppercase tracking-widest">12ms Latency</span>
              </div>
              <div className="flex items-center gap-2 pr-4 border-r border-white/5">
                <Activity size={13} className="text-blue-500" />
                <span className="text-[9px] font-bold uppercase tracking-widest">60.0 FPS</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield size={13} className="text-emerald-500" />
                <span className="text-[9px] font-bold uppercase tracking-widest">E2E Secure</span>
              </div>
           </div>
           
           <div className="flex items-center gap-2">
              <Button onClick={toggleFullscreen} variant="ghost" size="sm" className="!p-2">
                <Maximize size={16} />
              </Button>
              <Button onClick={onDisconnect} variant="danger" size="sm" className="h-8 gap-2 px-3">
                <Power size={14} />
                <span className="text-[10px] uppercase font-bold tracking-wider">Terminate</span>
              </Button>
           </div>
        </div>
      </motion.nav>

      {/* Floating HUD Controller */}
      <motion.div 
        drag
        dragConstraints={{ left: -400, right: 400, top: -400, bottom: 400 }}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50"
      >
        <div className="glass-pro rounded-2xl p-1.5 flex items-center gap-1 shadow-2xl border border-white/10">
           <div className="flex items-center gap-1 pr-1 border-r border-white/5">
              <Button 
                variant={inputEnabled ? 'primary' : 'secondary'} 
                size="sm" 
                onClick={() => setInputEnabled(!inputEnabled)}
                className="w-10 h-10 rounded-xl"
              >
                {inputEnabled ? <MousePointer2 size={20} /> : <X size={20} />}
              </Button>
           </div>

           <div className="flex items-center gap-1 px-1 border-r border-white/5">
              <button className="w-10 h-10 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-xl transition-all">
                 <Keyboard size={18} />
              </button>
              <button className="w-10 h-10 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-xl transition-all">
                 <Settings size={18} />
              </button>
              <button className="w-10 h-10 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-xl transition-all">
                 <Command size={18} />
              </button>
           </div>

           <div className="flex items-center gap-1 px-1">
              <button className="w-10 h-10 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-xl transition-all">
                 <Monitor size={18} />
              </button>
              <button className="w-10 h-10 bg-accent/20 text-accent hover:bg-accent/30 rounded-xl transition-all">
                 <Menu size={18} />
              </button>
           </div>
        </div>
      </motion.div>
    </div>
  );
};
