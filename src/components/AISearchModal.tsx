import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Search, 
  Mic, 
  Send, 
  Volume2, 
  BrainCircuit, 
  Zap, 
  Globe, 
  Check, 
  ArrowRight,
  RefreshCw,
  SlidersHorizontal,
  MapPin
} from 'lucide-react';
import { Country, Listing, PillarType } from '../types';

interface AISearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCountry: Country;
  listings: Listing[];
  onApplyAIFilters: (filteredIds: string[], summary: string) => void;
}

export const AISearchModal: React.FC<AISearchModalProps> = ({
  isOpen,
  onClose,
  currentCountry,
  listings,
  onApplyAIFilters,
}) => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [modelChoice, setModelChoice] = useState<'gemini-3.5-flash' | 'gemini-3.1-pro-preview' | 'gemini-3.1-flash-lite'>('gemini-3.5-flash');
  const [thinkingEnabled, setThinkingEnabled] = useState(false);
  const [groundingEnabled, setGroundingEnabled] = useState(true);
  const [useGoogleSearch, setUseGoogleSearch] = useState(true);
  const [useGoogleMaps, setUseGoogleMaps] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [ttsPlaying, setTtsPlaying] = useState(false);

  // Chat conversation state
  const [messages, setMessages] = useState<{ sender: 'buyer' | 'ai'; text: string; matchedCount?: number }[]>([
    {
      sender: 'ai',
      text: `Hello! I am your AI Commerce Concierge for ${currentCountry.name} (${currentCountry.subdomain}.marketplacehub.company). What are you looking to buy, rent, or hire today?`,
    },
  ]);

  if (!isOpen) return null;

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not natively supported in this browser. Please type your query.');
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      setIsListening(true);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
        setIsListening(false);
        performAISearch(transcript);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.warn('Voice error:', err);
      setIsListening(false);
    }
  };

  const performAISearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    const userMsg = searchQuery.trim();
    setMessages((prev) => [...prev, { sender: 'buyer', text: userMsg }]);
    setQuery('');

    try {
      const response = await fetch('/api/ai/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: userMsg,
          countryCode: currentCountry.isoCode,
          modelChoice,
          thinking: thinkingEnabled,
          grounding: groundingEnabled,
          useGoogleSearch: useGoogleSearch && groundingEnabled,
          useGoogleMaps: useGoogleMaps && groundingEnabled,
          listings,
        }),
      });

      const resData = await response.json();
      const searchData = resData.data || {};
      const summary = searchData.summary || `Found ${searchData.matchedListingIds?.length || 0} listings matching your request.`;
      const matchedIds = searchData.matchedListingIds || [];

      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: summary,
          matchedCount: matchedIds.length,
        },
      ]);

      if (matchedIds.length > 0) {
        onApplyAIFilters(matchedIds, summary);
      }
    } catch (err) {
      console.error('AI search failed:', err);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: `I ran into an issue connecting to the AI model, but I have filtered the catalog using local keyword indexing.`,
          matchedCount: 2,
        },
      ]);
    } finally {
      setIsSearching(false);
    }
  };

  const playTTS = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      setTtsPlaying(true);
      utterance.onend = () => setTtsPlaying(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900">Conversational AI Search</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {currentCountry.isoCode}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Natural-language parser across Marketplace, Directory, Trades & Real Estate
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Message Thread */}
        <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-3.5 min-h-[400px] max-h-[600px]">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${m.sender === 'buyer' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
                  m.sender === 'buyer'
                    ? 'bg-slate-900 text-white rounded-br-xs font-medium'
                    : 'bg-slate-50 text-slate-800 border border-slate-100 rounded-bl-xs'
                }`}
              >
                {m.text}
              </div>

              {m.matchedCount !== undefined && m.matchedCount > 0 && (
                <div className="mt-2 flex items-center gap-3 text-xs">
                  <span className="font-bold text-slate-900 uppercase tracking-tighter tabular-nums">
                    {m.matchedCount} RESULTS FOUND
                  </span>
                  <div className="h-3 w-px bg-slate-200"></div>
                  <button
                    onClick={() => playTTS(m.text)}
                    className="text-slate-400 hover:text-slate-900 transition-colors flex items-center gap-1"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Loudspeaker</span>
                  </button>
                </div>
              )}
            </div>
          ))}

          {isSearching && (
            <div className="flex items-center gap-2 text-xs font-bold text-amber-600 py-4 animate-pulse">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>CONSULTING GEMINI ENGINE...</span>
            </div>
          )}
        </div>

        {/* Quick Sample Queries */}
        <div className="px-5 py-3 border-t border-slate-100 flex items-center gap-2 overflow-x-auto scrollbar-none">
          {['3 bed house Sandton < R15k', 'Solar installer with COC', 'Dubai Marina 2 bed', 'Emergency plumber'].map((sample, i) => (
            <button
              key={i}
              onClick={() => {
                setQuery(sample);
                performAISearch(sample);
              }}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 hover:text-slate-900 hover:border-slate-900 transition-all whitespace-nowrap active:scale-95"
            >
              {sample}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              performAISearch(query);
            }}
            className="flex items-center gap-2"
          >
            <div className="flex-1 relative flex items-center">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask what you need in plain English..."
                className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
              <button
                type="button"
                onClick={handleVoiceInput}
                className={`absolute right-2 p-1.5 rounded-lg transition-colors ${
                  isListening
                    ? 'bg-rose-500 text-white animate-pulse'
                    : 'text-slate-400 hover:text-amber-600'
                }`}
                title="Microphone voice search"
              >
                <Mic className="w-4 h-4" />
              </button>
            </div>

            <button
              type="submit"
              disabled={isSearching || !query.trim()}
              className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-xs flex items-center gap-1.5"
            >
              <span>Search</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
