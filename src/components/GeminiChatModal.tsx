import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Send, 
  Sparkles, 
  Bot, 
  User as UserIcon, 
  Volume2, 
  Compass, 
  MapPin, 
  Search, 
  Cpu, 
  RefreshCw, 
  ExternalLink, 
  BrainCircuit, 
  Zap, 
  Building2, 
  Truck, 
  ShieldCheck, 
  SlidersHorizontal,
  Flame
} from 'lucide-react';
import { Country } from '../types';
import { auth, saveChatSessionToFirestore } from '../lib/firebase';

interface ChatMessage {
  id: string;
  sender: 'user' | 'model';
  text: string;
  timestamp: string;
  modelUsed?: string;
  groundingMetadata?: {
    webSearchQueries?: string[];
    groundingChunks?: Array<{
      web?: { uri: string; title: string };
      maps?: { title: string; uri: string; address?: string };
    }>;
  };
}

interface GeminiChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCountry: Country;
  onOpenLiveVoice: () => void;
}

export const GeminiChatModal: React.FC<GeminiChatModalProps> = ({
  isOpen,
  onClose,
  currentCountry,
  onOpenLiveVoice,
}) => {
  const [role, setRole] = useState<'general_portal' | 'trade_advisor' | 'property_specialist' | 'artisan_scout' | 'b2b_logistics'>('general_portal');
  const [modelChoice, setModelChoice] = useState<'gemini-3.5-flash' | 'gemini-3.1-pro-preview' | 'gemini-3.1-flash-lite'>('gemini-3.5-flash');
  const [useGoogleSearch, setUseGoogleSearch] = useState(false);
  const [useGoogleMaps, setUseGoogleMaps] = useState(false);
  const [enableThinking, setEnableThinking] = useState(false);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init_1',
      sender: 'model',
      text: `Hello! I am your AI Commerce & Trade Concierge for ${currentCountry.name} (${currentCountry.currencyCode}) and the UAE. How can I assist you with marketplace items, vetted properties, certified artisans, or cross-border logistics today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      modelUsed: 'gemini-3.5-flash',
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  if (!isOpen) return null;

  const roles = [
    { id: 'general_portal', label: 'General Concierge', icon: Sparkles, desc: 'All-round guide for 4 pillars' },
    { id: 'trade_advisor', label: 'Trade & Customs', icon: Compass, desc: 'AfCFTA, tariff rules & UAE corridors' },
    { id: 'property_specialist', label: 'Property Specialist', icon: Building2, desc: 'Sandton & Dubai real estate' },
    { id: 'artisan_scout', label: 'Master Artisan Scout', icon: ShieldCheck, desc: 'Certified electricians & plumbers' },
    { id: 'b2b_logistics', label: 'Freight & Logistics', icon: Truck, desc: 'Walvis Bay, Beitbridge & Jebel Ali' },
  ];

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: input.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            sender: m.sender === 'user' ? 'buyer' : 'vendor',
            text: m.text,
          })),
          role,
          countryCode: currentCountry.isoCode,
          modelChoice,
          useGoogleSearch,
          useGoogleMaps,
          enableThinking,
        }),
      });

      const data = await response.json();
      const modelReply = data.reply || "I'm here to help you connect with verified vendors, properties, and services across Africa and the UAE.";

      const aiMessage: ChatMessage = {
        id: `ai_${Date.now()}`,
        sender: 'model',
        text: modelReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: data.modelUsed || modelChoice,
        groundingMetadata: data.groundingMetadata,
      };

      const updatedHistory = [...newMessages, aiMessage];
      setMessages(updatedHistory);

      // Save session to Firestore if user logged in
      const currentUser = auth.currentUser;
      if (currentUser) {
        saveChatSessionToFirestore(currentUser.uid, updatedHistory, role, modelChoice);
      }
    } catch (err) {
      console.error('Chat request failed:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `ai_err_${Date.now()}`,
          sender: 'model',
          text: `I had trouble connecting to the Gemini server. Please check your internet connection or try again. In the meantime, you can explore verified listings in ${currentCountry.name}.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          modelUsed: 'offline-fallback',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSpeakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-4xl h-[92vh] max-h-[820px] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Top Header */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-amber-500/20">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 dark:text-white text-base">AfriTrade & UAE Gemini Concierge</h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300">
                  {modelChoice}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Multi-Turn Intelligence • Active Region: {currentCountry.name} ({currentCountry.currencyCode})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Live Voice API Trigger */}
            <button
              onClick={() => {
                onClose();
                onOpenLiveVoice();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-white font-bold text-xs shadow-sm hover:opacity-95 transition-opacity"
              title="Switch to gemini-3.8-live Voice Mode"
            >
              <Flame className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Live Voice Mode</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Configuration Bar: Roles, Models, Grounding */}
        <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Role selector buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {roles.map((r) => {
              const Icon = r.icon;
              const isSelected = role === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => setRole(r.id as any)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl font-medium transition-all text-xs shrink-0 ${
                    isSelected
                      ? 'bg-amber-500 text-white font-semibold shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                  title={r.desc}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{r.label}</span>
                </button>
              );
            })}
          </div>

          {/* Model & Grounding Toggles */}
          <div className="flex items-center gap-2">
            {/* Model select */}
            <select
              value={modelChoice}
              onChange={(e) => setModelChoice(e.target.value as any)}
              className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl px-2.5 py-1 text-xs border-0 font-medium focus:ring-1 focus:ring-amber-500"
            >
              <option value="gemini-3.5-flash">gemini-3.5-flash (General)</option>
              <option value="gemini-3.1-pro-preview">gemini-3.1-pro-preview (Complex)</option>
              <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite (Fast)</option>
            </select>

            {/* Google Search Grounding toggle (gemini-3.5-flash only) */}
            {modelChoice === 'gemini-3.5-flash' && (
              <button
                onClick={() => {
                  setUseGoogleSearch(!useGoogleSearch);
                  if (!useGoogleSearch) setUseGoogleMaps(false); // mutually exclusive per SDK rules
                }}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-semibold transition-all border ${
                  useGoogleSearch
                    ? 'bg-blue-50 border-blue-300 text-blue-700 dark:bg-blue-950/60 dark:border-blue-700 dark:text-blue-300'
                    : 'bg-slate-100 dark:bg-slate-800 border-transparent text-slate-500 hover:text-slate-700'
                }`}
                title="Google Search Grounding via googleSearch tool"
              >
                <Search className="w-3 h-3" />
                <span>Search</span>
              </button>
            )}

            {/* Google Maps Grounding toggle (gemini-3.5-flash only) */}
            {modelChoice === 'gemini-3.5-flash' && (
              <button
                onClick={() => {
                  setUseGoogleMaps(!useGoogleMaps);
                  if (!useGoogleMaps) setUseGoogleSearch(false); // mutually exclusive per SDK rules
                }}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-semibold transition-all border ${
                  useGoogleMaps
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-700 dark:bg-emerald-950/60 dark:border-emerald-700 dark:text-emerald-300'
                    : 'bg-slate-100 dark:bg-slate-800 border-transparent text-slate-500 hover:text-slate-700'
                }`}
                title="Google Maps Grounding via googleMaps tool"
              >
                <MapPin className="w-3 h-3" />
                <span>Maps</span>
              </button>
            )}

            {/* Pro Thinking toggle (gemini-3.1-pro-preview only) */}
            {modelChoice === 'gemini-3.1-pro-preview' && (
              <button
                onClick={() => setEnableThinking(!enableThinking)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-semibold transition-all border ${
                  enableThinking
                    ? 'bg-purple-50 border-purple-300 text-purple-700 dark:bg-purple-950/60 dark:border-purple-700 dark:text-purple-300'
                    : 'bg-slate-100 dark:bg-slate-800 border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                <BrainCircuit className="w-3 h-3" />
                <span>Deep Thinking</span>
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Message Thread */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50/50 dark:bg-slate-950/30">
          {messages.map((m) => {
            const isUser = m.sender === 'user';
            return (
              <div
                key={m.id}
                className={`flex gap-3 max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                    isUser
                      ? 'bg-slate-900 dark:bg-slate-700 text-white'
                      : 'bg-amber-500 text-slate-950 shadow-sm shadow-amber-500/30'
                  }`}
                >
                  {isUser ? <UserIcon className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div
                  className={`rounded-2xl p-4 text-sm space-y-2 shadow-xs ${
                    isUser
                      ? 'bg-amber-600 text-white rounded-tr-none'
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-line leading-relaxed">{m.text}</p>

                  {/* Grounding metadata (Search queries / Web links / Map places) */}
                  {m.groundingMetadata?.webSearchQueries && m.groundingMetadata.webSearchQueries.length > 0 && (
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-700 text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
                      <div className="flex items-center gap-1 font-semibold text-blue-600 dark:text-blue-400">
                        <Search className="w-3 h-3" />
                        <span>Google Search Grounding Queries:</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {m.groundingMetadata.webSearchQueries.map((q, idx) => (
                          <span key={idx} className="bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-md text-[10px]">
                            {q}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Grounding web or map links */}
                  {m.groundingMetadata?.groundingChunks && m.groundingMetadata.groundingChunks.length > 0 && (
                    <div className="pt-1.5 flex flex-wrap gap-1.5 text-[11px]">
                      {m.groundingMetadata.groundingChunks.map((chunk, idx) => {
                        if (chunk.web) {
                          return (
                            <a
                              key={idx}
                              href={chunk.web.uri}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 hover:underline text-[10px]"
                            >
                              <span>{chunk.web.title || 'Source'}</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          );
                        }
                        if (chunk.maps) {
                          return (
                            <a
                              key={idx}
                              href={chunk.maps.uri}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-300 hover:underline text-[10px]"
                            >
                              <MapPin className="w-2.5 h-2.5" />
                              <span>{chunk.maps.title}</span>
                            </a>
                          );
                        }
                        return null;
                      })}
                    </div>
                  )}

                  {/* Footer metadata with time and TTS */}
                  <div
                    className={`flex items-center justify-between gap-2 pt-1 text-[10px] ${
                      isUser ? 'text-amber-200' : 'text-slate-400'
                    }`}
                  >
                    <span>{m.timestamp}</span>
                    {!isUser && (
                      <div className="flex items-center gap-2">
                        {m.modelUsed && (
                          <span className="font-mono text-[9px] bg-slate-100 dark:bg-slate-700 px-1.5 py-0.2 rounded text-slate-500">
                            {m.modelUsed}
                          </span>
                        )}
                        <button
                          onClick={() => handleSpeakText(m.text)}
                          className="hover:text-amber-500 transition-colors p-0.5"
                          title="Read message aloud"
                        >
                          <Volume2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3 max-w-[80%] mr-auto">
              <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 animate-pulse">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl rounded-tl-none p-4 text-sm flex items-center gap-2 text-slate-500">
                <RefreshCw className="w-4 h-4 animate-spin text-amber-500" />
                <span>Gemini is generating response...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask ${roles.find((r) => r.id === role)?.label} about ${currentCountry.name} commerce...`}
            className="flex-1 bg-slate-100 dark:bg-slate-800 border-0 rounded-2xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
            disabled={loading}
          />

          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="p-3 rounded-2xl bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold transition-all shadow-md shadow-amber-600/20 shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
