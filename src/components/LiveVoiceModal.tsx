import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Flame, 
  Radio, 
  RefreshCw, 
  Bot, 
  User as UserIcon,
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import { Country } from '../types';

interface LiveVoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCountry: Country;
  onOpenChatbot: () => void;
}

interface TranscriptTurn {
  id: string;
  sender: 'user' | 'model';
  text: string;
  timestamp: string;
}

export const LiveVoiceModal: React.FC<LiveVoiceModalProps> = ({
  isOpen,
  onClose,
  currentCountry,
  onOpenChatbot,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcripts, setTranscripts] = useState<TranscriptTurn[]>([
    {
      id: 'init_live',
      sender: 'model',
      text: `Hello! I am your Market Place Hub Live Voice Concierge powered by gemini-3.8-live. Tap the microphone and tell me what you need—whether it's property in Sandton, UAE freight corridors, or certified electricians.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);
  const [userSpokenText, setUserSpokenText] = useState('');
  const [muted, setMuted] = useState(false);
  const [audioWaves, setAudioWaves] = useState<number[]>([15, 30, 60, 45, 80, 50, 25, 70, 90, 40, 20]);

  const recognitionRef = useRef<any>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // Animate soundwaves when recording or speaking
  useEffect(() => {
    let interval: any;
    if (isRecording || isSpeaking) {
      interval = setInterval(() => {
        setAudioWaves(
          Array.from({ length: 12 }, () => Math.floor(Math.random() * 75) + 15)
        );
      }, 120);
    } else {
      setAudioWaves([20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20]);
    }
    return () => clearInterval(interval);
  }, [isRecording, isSpeaking]);

  // Clean up on unmount or close
  useEffect(() => {
    if (!isOpen) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      setIsRecording(false);
      setIsSpeaking(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const quickPrompts = [
    `Properties to rent in Sandton under 15000 ${currentCountry.currencyCode}`,
    `How to clear goods through Jebel Ali port to Durban`,
    `Find a certified solar installer with PV GreenCard`,
    `What are the AfCFTA rules of origin for food exports?`,
  ];

  const [ws, setWs] = useState<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Initialize WebSocket connection
  useEffect(() => {
    if (isOpen) {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const socket = new WebSocket(`${protocol}//${window.location.host}/live`);
      
      socket.onopen = () => {
        console.log('Gemini Live: WebSocket connected');
        setWs(socket);
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.audio) {
            playBase64Audio(data.audio);
          }
          if (data.interrupted) {
            stopPlayback();
          }
        } catch (err) {
          console.error('Error parsing WS message:', err);
        }
      };

      socket.onerror = (err) => console.error('Gemini Live WS Error:', err);
      socket.onclose = () => {
        console.log('Gemini Live: WebSocket closed');
        setWs(null);
      };

      return () => {
        socket.close();
      };
    }
  }, [isOpen]);

  const playbackContextRef = useRef<AudioContext | null>(null);
  const nextPlayTimeRef = useRef<number>(0);

  const playBase64Audio = async (base64Audio: string) => {
    try {
      if (!playbackContextRef.current) {
        playbackContextRef.current = new AudioContext({ sampleRate: 24000 });
        nextPlayTimeRef.current = playbackContextRef.current.currentTime;
      }
      
      const ctx = playbackContextRef.current;
      const binaryString = atob(base64Audio);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      const pcm16 = new Int16Array(bytes.buffer);
      const float32 = new Float32Array(pcm16.length);
      for (let i = 0; i < pcm16.length; i++) {
        float32[i] = pcm16[i] / 0x7FFF;
      }
      
      const audioBuffer = ctx.createBuffer(1, float32.length, 24000);
      audioBuffer.getChannelData(0).set(float32);
      
      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);
      
      const startTime = Math.max(ctx.currentTime, nextPlayTimeRef.current);
      source.start(startTime);
      nextPlayTimeRef.current = startTime + audioBuffer.duration;
      
      setIsSpeaking(true);
      source.onended = () => {
        if (ctx && ctx.currentTime >= nextPlayTimeRef.current - 0.1) {
          setIsSpeaking(false);
        }
      };
    } catch (err) {
      console.error('Error playing streaming audio:', err);
    }
  };

  const stopPlayback = () => {
    if (playbackContextRef.current) {
      playbackContextRef.current.close().catch(() => {});
      playbackContextRef.current = null;
    }
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current = null;
    }
    nextPlayTimeRef.current = 0;
    setIsSpeaking(false);
  };
  const handleStartListening = async () => {
    if (!ws || ws.readyState !== WebSocket.OPEN) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const audioContext = new AudioContext({ sampleRate: 16000 });
      audioContextRef.current = audioContext;
      
      const source = audioContext.createMediaStreamSource(stream);
      const processor = audioContext.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;

      processor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        // Convert Float32 to Int16 PCM
        const pcmData = new Int16Array(inputData.length);
        for (let i = 0; i < inputData.length; i++) {
          pcmData[i] = Math.max(-1, Math.min(1, inputData[i])) * 0x7FFF;
        }
        // Send as base64
        const base64 = btoa(String.fromCharCode(...new Uint8Array(pcmData.buffer)));
        ws.send(JSON.stringify({ audio: base64 }));
      };

      source.connect(processor);
      processor.connect(audioContext.destination);
      
      setIsRecording(true);
    } catch (err) {
      console.error('Error starting mic capture:', err);
    }
  };

  const handleStopListening = () => {
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsRecording(false);
  };

  const handleSendVoicePrompt = async (promptText: string) => {
    if (!promptText.trim() || isProcessing) return;

    const userTurn: TranscriptTurn = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: promptText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setTranscripts((prev) => [...prev, userTurn]);
    setUserSpokenText('');
    setIsProcessing(true);

    try {
      const response = await fetch('/api/ai/live-conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText,
          countryCode: currentCountry.isoCode,
          role: 'voice_concierge',
        }),
      });

      const data = await response.json();
      const modelReply = data.reply || `I've noted your request for ${currentCountry.name} commerce and verified vendors are available.`;

      const modelTurn: TranscriptTurn = {
        id: `ai_${Date.now()}`,
        sender: 'model',
        text: modelReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setTranscripts((prev) => [...prev, modelTurn]);

      // Play audio response if audioBase64 returned, or synthesize via SpeechSynthesis
      if (!muted) {
        if (data.audioBase64) {
          playBase64Audio(data.audioBase64);
        } else if ('speechSynthesis' in window) {
          playBrowserVoice(modelReply);
        }
      }
    } catch (err) {
      console.error('Live voice conversation error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const playBrowserVoice = (text: string) => {
    setIsSpeaking(true);
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-rose-500/20">
                <Radio className="w-5 h-5 animate-pulse" />
              </div>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900"></span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-base">Market Place Hub Live Voice</h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  gemini-3.8-live
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Real-Time Voice API • {currentCountry.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Switch to Text Chat */}
            <button
              onClick={() => {
                onClose();
                onOpenChatbot();
              }}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Switch to Text Chat"
            >
              <MessageSquare className="w-4 h-4" />
            </button>

            {/* Mute button */}
            <button
              onClick={() => {
                setMuted(!muted);
                if (!muted && window.speechSynthesis) {
                  window.speechSynthesis.cancel();
                  setIsSpeaking(false);
                }
              }}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title={muted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {muted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Visualizer & Mic Pulsing Stage */}
        <div className="py-8 px-6 flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 text-center relative overflow-hidden">
          {/* Background Ambient Glow */}
          <div className="absolute w-72 h-72 rounded-full bg-amber-500/10 blur-3xl pointer-events-none -top-10"></div>

          {/* Soundwave Frequency Bars */}
          <div className="flex items-center justify-center gap-1.5 h-16 mb-6">
            {audioWaves.map((height, idx) => (
              <div
                key={idx}
                style={{ height: `${height}%` }}
                className={`w-1.5 rounded-full transition-all duration-150 ${
                  isSpeaking
                    ? 'bg-amber-400 shadow-xs shadow-amber-400'
                    : isRecording
                    ? 'bg-rose-500 shadow-xs shadow-rose-500'
                    : 'bg-slate-700'
                }`}
              />
            ))}
          </div>

          {/* Main Interactive Mic Button */}
          <div className="relative mb-4">
            {isRecording && (
              <div className="absolute inset-0 rounded-full bg-rose-500/20 animate-ping pointer-events-none"></div>
            )}
            {isSpeaking && (
              <div className="absolute inset-0 rounded-full bg-amber-500/20 animate-ping pointer-events-none"></div>
            )}

            <button
              onClick={isRecording ? handleStopListening : handleStartListening}
              disabled={isProcessing}
              className={`w-20 h-20 rounded-full flex items-center justify-center text-white transition-all shadow-2xl active:scale-95 ${
                isRecording
                  ? 'bg-rose-600 hover:bg-rose-700 ring-4 ring-rose-500/40'
                  : isSpeaking
                  ? 'bg-amber-600 hover:bg-amber-700 ring-4 ring-amber-500/40'
                  : isProcessing
                  ? 'bg-slate-700 cursor-wait'
                  : 'bg-gradient-to-tr from-amber-500 to-rose-600 hover:opacity-95'
              }`}
            >
              {isProcessing ? (
                <RefreshCw className="w-8 h-8 animate-spin" />
              ) : isRecording ? (
                <MicOff className="w-8 h-8" />
              ) : (
                <Mic className="w-8 h-8" />
              )}
            </button>
          </div>

          {/* Status Label */}
          <div className="text-sm font-semibold mb-2">
            {isRecording ? (
              <span className="text-rose-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                Listening to you... Click to stop
              </span>
            ) : isSpeaking ? (
              <span className="text-amber-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                Speaking response...
              </span>
            ) : isProcessing ? (
              <span className="text-slate-300">Processing voice with gemini-3.8-live...</span>
            ) : (
              <span className="text-slate-400">Tap microphone to speak</span>
            )}
          </div>

          {userSpokenText && (
            <p className="text-xs text-slate-300 italic max-w-md px-4 py-1 rounded-lg bg-slate-800/80">
              "{userSpokenText}"
            </p>
          )}

          {/* Quick Prompts */}
          <div className="mt-5 w-full">
            <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider block mb-2">
              Or tap a spoken question:
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {quickPrompts.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendVoicePrompt(q)}
                  disabled={isRecording || isProcessing}
                  className="px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-300 text-xs text-left transition-colors border border-slate-700/60"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Conversation Transcript Feed */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 max-h-48 overflow-y-auto space-y-2.5">
          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
            Live Conversation Transcript
          </div>
          {transcripts.map((t) => (
            <div key={t.id} className="flex gap-2 text-xs">
              <span className={`font-bold ${t.sender === 'user' ? 'text-rose-400' : 'text-amber-400'}`}>
                {t.sender === 'user' ? 'You:' : 'Gemini 3.8 Live:'}
              </span>
              <span className="text-slate-300 leading-snug">{t.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
