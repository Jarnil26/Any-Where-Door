import React, { useState, useEffect, useRef } from 'react';
import { Peer } from 'peerjs';
import { nanoid } from 'nanoid';
import { Monitor, Pointer, Power, Share2, Copy, AlertCircle, Cast } from 'lucide-react';

function App() {
  const [mode, setMode] = useState(null); // 'host' | 'client'
  const [hostId, setHostId] = useState('');
  const [connectId, setConnectId] = useState('');
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState('');
  const [isReady, setIsReady] = useState(false);

  const videoRef = useRef();
  const peerRef = useRef();
  const connRef = useRef(); // Data connection for input events
  const streamRef = useRef();

  // --- HOST LOGIC ---
  const startHost = async () => {
    try {
      // 1. Get Screen Stream
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { cursor: 'always' },
        audio: false,
      });
      streamRef.current = stream;

      // 2. Initialize Peer with a random ID
      const id = nanoid(6).toUpperCase();
      const peer = new Peer(id);
      
      peer.on('open', (id) => {
        setHostId(id);
        setMode('host');
        setIsReady(true);
      });

      peer.on('error', (err) => {
        setError('Peer error: ' + err.type);
        console.error(err);
      });

      // 3. Handle incoming calls (Media)
      peer.on('call', (call) => {
        console.log('Receiving call from client...');
        call.answer(stream);
        setConnected(true);
      });

      // 4. Handle incoming data connections (Input Events)
      peer.on('connection', (conn) => {
        console.log('Client connected for data');
        connRef.current = conn;
        setConnected(true);

        conn.on('data', (data) => {
          // Forward input event to Electron main process
          if (window.electronAPI) {
            window.electronAPI.simulateInput(data);
          } else {
            console.warn('Electron API not available. Cannot simulate input in browser.');
          }
        });
      });

      peerRef.current = peer;
    } catch (err) {
      console.error('Error starting host:', err);
      setError('Could not access screen sharing. Are you in a browser or Electron?');
    }
  };

  // --- CLIENT LOGIC ---
  const joinHost = () => {
    if (!connectId) return;
    
    const peer = new Peer(); // Client gets a random ID
    
    peer.on('open', (id) => {
      setMode('client');
      
      // 1. Connection for Data (Input Events)
      const conn = peer.connect(connectId);
      connRef.current = conn;
      
      conn.on('open', () => {
        console.log('Connected to host for data');
        setConnected(true);
      });

      // 2. Call for Media (Video Stream)
      const call = peer.call(connectId, null); // We don't send a stream, just receive
      call.on('stream', (remoteStream) => {
        console.log('Received remote stream');
        if (videoRef.current) videoRef.current.srcObject = remoteStream;
        setConnected(true);
      });

      call.on('error', (err) => {
        setError('Call error: ' + err.message);
      });
    });

    peer.on('error', (err) => {
      setError('Connection failed. Is the ID correct?');
      setMode(null);
    });

    peerRef.current = peer;
  };

  // --- CLIENT INPUT CAPTURE ---
  const handleMouseEvent = (type, e) => {
    if (mode !== 'client' || !connected || !connRef.current) return;
    const rect = videoRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    connRef.current.send({
      type, x, y, button: e.button
    });
  };

  const handleKeyboardEvent = (type, e) => {
    if (mode !== 'client' || !connected || !connRef.current) return;
    connRef.current.send({
      type, key: e.key, keyCode: e.keyCode
    });
  };

  useEffect(() => {
    if (mode === 'client') {
      window.addEventListener('keydown', (e) => handleKeyboardEvent('keydown', e));
      window.addEventListener('keyup', (e) => handleKeyboardEvent('keyup', e));
      return () => {
        window.removeEventListener('keydown', (e) => handleKeyboardEvent('keydown', e));
        window.removeEventListener('keyup', (e) => handleKeyboardEvent('keyup', e));
      };
    }
  }, [mode, connected]);

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 p-8 font-sans selection:bg-blue-500/30">
      <header className="max-w-6xl mx-auto flex justify-between items-center mb-12">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-500/20">
            <Monitor size={28} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">ANYWhere</h1>
            <p className="text-slate-400 text-sm">Vercel Serverless Stream</p>
          </div>
        </div>
        
        {connected && (
          <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full text-green-400 text-sm font-medium animate-pulse">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            Live Peer Connection
          </div>
        )}
      </header>

      <main className="max-w-6xl mx-auto">
        {!mode ? (
          <div className="grid md:grid-cols-2 gap-8 mt-20">
            <div 
              onClick={startHost}
              className="group p-8 bg-slate-800/40 border border-slate-700/50 hover:border-blue-500/50 rounded-3xl cursor-pointer transition-all hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/10 backdrop-blur-sm"
            >
              <div className="p-4 bg-slate-700/50 w-fit rounded-2xl mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Share2 size={32} />
              </div>
              <h2 className="text-2xl font-bold mb-3">Share this Screen</h2>
              <p className="text-slate-400 leading-relaxed mb-6">Generate a unique Peer ID. Anyone with this ID can view and control your desktop.</p>
              <button className="px-6 py-3 bg-slate-700/50 font-bold rounded-xl group-hover:bg-blue-600 transition-colors">Start Hosting</button>
            </div>

            <div className="p-8 bg-slate-800/40 border border-slate-700/50 rounded-3xl backdrop-blur-sm">
              <div className="p-4 bg-slate-700/50 w-fit rounded-2xl mb-6">
                <Pointer size={32} />
              </div>
              <h2 className="text-2xl font-bold mb-3">Control Remote System</h2>
              <p className="text-slate-400 leading-relaxed mb-6">Enter the Partner ID to initiate a secure direct peer-to-peer connection.</p>
              
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Enter 6-digit ID"
                  value={connectId}
                  onChange={(e) => setConnectId(e.target.value.toUpperCase())}
                  className="flex-1 bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-mono tracking-widest uppercase"
                />
                <button 
                  onClick={joinHost}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20 active:scale-95"
                >
                  Connect
                </button>
              </div>
              {error && <p className="mt-4 text-red-400 text-sm flex items-center gap-2 bg-red-400/10 p-3 rounded-lg"><AlertCircle size={16}/> {error}</p>}
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-5 duration-500">
            {mode === 'host' ? (
              <div className="max-w-2xl mx-auto bg-slate-800/40 border border-slate-700/50 rounded-3xl p-10 text-center shadow-2xl backdrop-blur-md">
                <Cast size={64} className="mx-auto mb-6 text-blue-500 opacity-50" />
                <h2 className="text-3xl font-bold mb-4">Sharing Active</h2>
                <p className="text-slate-400 mb-8 leading-relaxed">Your screen is ready for connection. Share this ID with someone you trust.</p>
                
                <div className="relative group max-w-sm mx-auto mb-10">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                  <div className="relative flex items-center justify-between bg-slate-900 border border-slate-700 rounded-xl px-6 py-5">
                    <span className="text-4xl font-mono font-black tracking-widest text-blue-400">{hostId || 'LOADING...'}</span>
                    <button 
                      onClick={() => {navigator.clipboard.writeText(hostId)}}
                      className="p-3 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-white"
                    >
                      <Copy size={24} />
                    </button>
                  </div>
                </div>

                <div className="flex justify-center gap-4">
                  <button 
                    onClick={() => window.location.reload()}
                    className="flex items-center gap-2 px-8 py-3 bg-red-600/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white font-bold rounded-xl transition-all"
                  >
                    <Power size={20} /> Stop Sharing
                  </button>
                </div>
              </div>
            ) : (
              <div className="relative rounded-2xl overflow-hidden bg-black border border-slate-700/50 shadow-2xl group ring-1 ring-slate-700/50">
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  className="w-full h-auto cursor-none select-none"
                  onMouseMove={(e) => handleMouseEvent('mousemove', e)}
                  onMouseDown={(e) => handleMouseEvent('mousedown', e)}
                  onMouseUp={(e) => handleMouseEvent('mouseup', e)}
                  onContextMenu={(e) => {e.preventDefault(); handleMouseEvent('mousedown', {button: 2})}}
                />
                {!connected && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/95 backdrop-blur-md z-10 transition-all">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-6 shadow-glow"></div>
                    <p className="text-xl font-medium tracking-wide text-blue-400">Negotiating Peer Connection...</p>
                  </div>
                )}
                {connected && (
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/80 backdrop-blur-md px-6 py-3 border border-slate-700 rounded-full flex gap-4 text-xs font-medium uppercase tracking-widest text-slate-400 z-20 pointer-events-none shadow-2xl shadow-black/50">
                    <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"/> Direct Data Channel</span>
                    <span className="opacity-25">|</span>
                    <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse"/> Remote Input Active</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      <style>{`
        body {
          background: radial-gradient(circle at top right, #1e293b, #0f172a);
          overflow-x: hidden;
        }
        .shadow-glow {
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
        }
      `}</style>
    </div>
  );
}

export default App;
