import { useState, useEffect, useRef } from 'react';
import { Peer } from 'peerjs';
import { nanoid } from 'nanoid';

export function usePeerSession() {
  const [mode, setMode] = useState(null); // 'host' | 'client' | null
  const [hostId, setHostId] = useState('');
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState('');
  const [isReady, setIsReady] = useState(false);
  
  const videoRef = useRef(null);
  const peerRef = useRef(null);
  const connRef = useRef(null);
  const streamRef = useRef(null);

  const startHost = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { cursor: 'always' },
        audio: false,
      });
      streamRef.current = stream;
      
      const id = nanoid(6).toUpperCase();
      const peer = new Peer(id);
      
      peer.on('open', (id) => {
        setHostId(id);
        setMode('host');
        setIsReady(true);
      });
      
      peer.on('error', (err) => {
        console.error('Peer Error:', err);
        setError('System Error: Connection failed.');
      });
      
      peer.on('call', (call) => {
        call.answer(stream);
        setConnected(true);
      });
      
      peer.on('connection', (conn) => {
        connRef.current = conn;
        setConnected(true);
        conn.on('data', (data) => {
          if (window.electronAPI) {
            window.electronAPI.simulateInput(data);
          }
        });
        conn.on('close', () => setConnected(false));
      });
      
      peerRef.current = peer;
    } catch (err) {
      console.error('Screen Share Error:', err);
      setError('Access Denied: Permissions required.');
    }
  };

  const joinHost = (connectId) => {
    if (!connectId) return;
    const peer = new Peer();
    
    peer.on('open', () => {
      setMode('client');
      const conn = peer.connect(connectId);
      connRef.current = conn;
      
      conn.on('open', () => setConnected(true));
      conn.on('close', () => {
        setConnected(false);
        setMode(null);
      });
      
      const call = peer.call(connectId, null);
      call.on('stream', (remoteStream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = remoteStream;
        }
        setConnected(true);
      });
    });
    
    peer.on('error', (err) => {
      console.error('Join Error:', err);
      setError('Identification Error: Invalid Partner Token.');
      setMode(null);
    });
    
    peerRef.current = peer;
  };

  const stopSession = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (peerRef.current) {
      peerRef.current.destroy();
    }
    setMode(null);
    setConnected(false);
    setHostId('');
    setError('');
  };

  const sendInput = (data) => {
    if (connRef.current && connRef.current.open) {
      connRef.current.send(data);
    }
  };

  return {
    mode,
    hostId,
    connected,
    error,
    isReady,
    videoRef,
    startHost,
    joinHost,
    stopSession,
    sendInput,
    setError
  };
}
