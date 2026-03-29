import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Share2, Copy, Zap, Globe, Shield, 
  Check, Monitor, ArrowRight, ShieldCheck, 
  Cpu, Lock, Activity
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';

export const Home = ({ hostId, onStartHost, onJoinHost, error }) => {
  const [connectId, setConnectId] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(hostId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden bg-background dashboard-grid">
      <div className="grain-overlay" />
      
      {/* Dynamic Background Element */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Header / Logo */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center gap-2 mb-16 z-20"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 glass-pro rounded-xl flex items-center justify-center shadow-pro-glow border-accent/20">
            <Monitor className="text-accent" size={20} />
          </div>
          <span className="text-2xl font-bold tracking-tight text-foreground">AnyWhere</span>
        </div>
        <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-muted-foreground opacity-60">Professional Remote Bridge</p>
      </motion.header>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid lg:grid-cols-2 gap-6 w-full max-w-5xl z-20"
      >
        {/* Share Section */}
        <motion.div variants={itemVariants}>
          <Card className="p-8 h-full flex flex-col">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center">
                <Share2 size={24} className="text-accent" />
              </div>
              <div className="text-left">
                <h2 className="text-xl font-bold">Host Session</h2>
                <p className="text-xs text-muted-foreground">Securely share your workspace</p>
              </div>
            </div>

            <div className="bg-muted/30 border border-white/5 rounded-2xl p-6 mb-8 text-left group">
               <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-2">Internal Access ID</span>
               <div className="flex items-center justify-between">
                  <span className="text-3xl font-mono font-bold tracking-widest text-foreground">
                    {hostId || '••••••'}
                  </span>
                  <button 
                    onClick={handleCopy}
                    disabled={!hostId}
                    className="p-3 hover:bg-white/5 rounded-xl transition-colors text-muted-foreground hover:text-accent disabled:opacity-20"
                  >
                    {copied ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
                  </button>
               </div>
            </div>

            <div className="mt-auto space-y-4">
              <Button 
                onClick={onStartHost}
                className="w-full"
                size="lg"
              >
                Launch Broadcaster <ArrowRight className="ml-2" size={18} />
              </Button>

              <div className="grid grid-cols-3 gap-2 pt-4">
                <div className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                  <Lock size={14} className="text-muted-foreground" />
                  <span className="text-[9px] font-bold uppercase text-muted-foreground">Encrypted</span>
                </div>
                <div className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                  <Activity size={14} className="text-muted-foreground" />
                  <span className="text-[9px] font-bold uppercase text-muted-foreground">Low Latency</span>
                </div>
                <div className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                  <ShieldCheck size={14} className="text-muted-foreground" />
                  <span className="text-[9px] font-bold uppercase text-muted-foreground">Verified</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Join Section */}
        <motion.div variants={itemVariants}>
          <Card className="p-8 h-full flex flex-col">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center">
                <Zap size={24} className="text-accent" />
              </div>
              <div className="text-left">
                <h2 className="text-xl font-bold">Remote Connect</h2>
                <p className="text-xs text-muted-foreground">Access a partner environment</p>
              </div>
            </div>

            <div className="space-y-6 mb-8">
              <Input 
                label="Partner Access Token"
                placeholder="Ex. 000 000"
                value={connectId}
                onChange={(e) => setConnectId(e.target.value.toUpperCase())}
                className="text-center font-mono tracking-[0.2em] text-xl"
                maxLength={7}
                error={error}
              />
            </div>

            <div className="mt-auto space-y-6">
              <Button 
                onClick={() => onJoinHost(connectId.replace(/\s/g, ''))}
                disabled={connectId.length < 6}
                variant="outline"
                className="w-full border-white/5 bg-white/[0.02]"
                size="lg"
              >
                Establish Connection <Monitor className="ml-2" size={18} />
              </Button>

              <div className="p-5 bg-accent/5 rounded-2xl border border-accent/10 text-left">
                <span className="text-[10px] font-bold uppercase tracking-widest text-accent/60 block mb-3">Protocol Status</span>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-bold">
                    <span className="text-muted-foreground uppercase">Bridge Type</span>
                    <span className="text-foreground">P2P / WEBRTC</span>
                  </div>
                  <div className="h-px bg-white/5" />
                  <div className="flex items-center justify-between text-[10px] font-bold">
                    <span className="text-muted-foreground uppercase">Acceleration</span>
                    <span className="text-foreground">HARDWARE / AV1</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>

      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        className="mt-20 text-[9px] font-bold uppercase tracking-[0.5em] text-muted-foreground"
      >
        Enterprise Edition • Build 2026.4.1 • Peer Bridge Protocol v4.0
      </motion.footer>
    </div>
  );
};
