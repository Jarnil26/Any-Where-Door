import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { usePeerSession } from './hooks/usePeerSession';
import { Home } from './pages/Home';
import { Host } from './pages/Host';
import { Client } from './pages/Client';

function App() {
  const {
    mode,
    hostId,
    connected,
    error,
    videoRef,
    startHost,
    joinHost,
    stopSession,
    sendInput,
    setError
  } = usePeerSession();

  const [localConnectId, setLocalConnectId] = useState('');

  const handleJoin = (id) => {
    setLocalConnectId(id);
    joinHost(id);
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-accent/30 selection:text-white">
      <div className="grain-overlay" />
      
      <AnimatePresence mode="wait">
        {!mode && (
          <motion.div
            key="home"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Home 
              hostId={hostId} 
              onStartHost={startHost} 
              onJoinHost={handleJoin} 
              error={error} 
            />
          </motion.div>
        )}

        {mode === 'host' && (
          <motion.div
            key="host"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.4, type: 'spring' }}
          >
            <Host 
              hostId={hostId} 
              onStopSharing={stopSession} 
              connected={connected} 
            />
          </motion.div>
        )}

        {mode === 'client' && (
          <motion.div
            key="client"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Client 
              videoRef={videoRef}
              connected={connected}
              onDisconnect={stopSession}
              sendInput={sendInput}
              connectId={localConnectId}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Professional Notification Toast */}
      <AnimatePresence>
        {error && !mode && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] bg-red-600/10 border border-red-600/20 backdrop-blur-xl px-4 py-2 rounded-xl flex items-center gap-3 text-red-500 text-xs font-bold shadow-2xl cursor-pointer"
            onClick={() => setError('')}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-red-600 shadow-pro-glow animate-pulse" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
