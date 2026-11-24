import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { AIService } from '../services/aiService';
import { ChatMessage } from '../types';
import {
  Bot,
  Send,
  Sparkles,
  User,
  HelpCircle,
  RotateCcw,
  Languages,
  ShieldAlert,
} from 'lucide-react';

export const NagarSathiChatbot: React.FC = () => {
  const { language, setLanguage, setCurrentView } = useApp();
  const [chatLang, setChatLang] = useState<'en' | 'hi' | 'bg'>(language);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text:
        chatLang === 'hi' || chatLang === 'bg'
          ? 'नमस्ते! मैं **नगर साथी** (Nagar Sathi) हूँ — रीवा नगर निगम का AI नागरिक सहायक। आप मुझसे सड़क के गड्ढे, स्ट्रीटलाइट, कचरा या जलभराव की शिकायत दर्ज करने और ट्रैक करने के बारे में पूछ सकते हैं।'
          : 'Hello! I am **Nagar Sathi**, your official AI Civic Assistant for Smart Rewa Municipal Corporation. How can I help you report or track civic infrastructure today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      source: 'Verified Knowledge Base',
    },
  ]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const suggestedQuestions =
    chatLang === 'hi'
      ? [
          'सड़क में गड्ढे की शिकायत कैसे दर्ज करें?',
          'कचरा न उठने पर क्या करें?',
          'मेरी शिकायत का टिकट कैसे ट्रैक करें?',
          'रीवा नगर निगम का हेल्पलाइन नंबर क्या है?',
          'इहाँ सड़क मा बहुत बड़ा गड्ढा है (बघेली डेमो)',
        ]
      : [
          'How can I report a pothole?',
          'How do I complain about garbage overflow?',
          'What should I do if there is a water leakage?',
          'How can I track my complaint ticket?',
          'What documents are generally required for municipal birth/death registration?',
        ];

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const historyPayload = messages.map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const response = await AIService.civicAssistant({
        message: query,
        history: historyPayload,
        language: chatLang,
      });

      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: response.source,
        suggestedActions: response.suggestedActions,
        relatedCategory: response.relatedCategory,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      const fallbackMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text:
          chatLang === 'hi'
            ? 'क्षमा करें, नेटवर्क में विलंब है। आप ऊपर "समस्या दर्ज करें" बटन से सीधी शिकायत दर्ज कर सकते हैं।'
            : 'I am experiencing connectivity latency. You can directly log grievances using the "+ Report Issue" button.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: 'Deterministic Fallback',
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        role: 'assistant',
        text:
          chatLang === 'hi'
            ? 'बातचीत रीसेट हो गई है। आप किस नागरिक सेवा के बारे में जानना चाहते हैं?'
            : 'Conversation reset. How may I assist your civic inquiry in Rewa today?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-[#4d6657] via-[#3a4d42] to-[#26332c] text-white p-6 rounded-3xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center text-white shrink-0 shadow-inner">
            <Bot className="w-7 h-7 text-emerald-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold tracking-tight">Nagar Sathi (नगर साथी)</h1>
              <span className="text-[10px] font-bold bg-white/20 backdrop-blur-md border border-white/20 px-2 py-0.5 rounded uppercase">
                AI Civic Assistant
              </span>
            </div>
            <p className="text-xs text-stone-200 mt-0.5">
              Smart Rewa Municipal Intelligence Guide • Conservative & Verified
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          <div className="flex items-center bg-white/10 backdrop-blur-md rounded-xl p-1 border border-white/20 text-xs font-bold shadow-inner">
            <button
              onClick={() => {
                setChatLang('en');
                setLanguage('en');
              }}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                chatLang === 'en' ? 'bg-white text-stone-900 shadow-md font-bold' : 'text-white/80 hover:text-white'
              }`}
            >
              English
            </button>
            <button
              onClick={() => {
                setChatLang('hi');
                setLanguage('hi');
              }}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                chatLang === 'hi' ? 'bg-white text-stone-900 shadow-md font-bold' : 'text-white/80 hover:text-white'
              }`}
            >
              हिन्दी
            </button>
            <button
              onClick={() => {
                setChatLang('bg');
                setLanguage('bg');
              }}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                chatLang === 'bg' ? 'bg-purple-600 text-white shadow-md font-bold' : 'text-white/80 hover:text-white'
              }`}
              title="Bagheli support — Experimental POC"
            >
              बघेली
            </button>
          </div>

          <button
            onClick={handleResetChat}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/15 backdrop-blur-md"
            title="Reset Chat"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Experimental Dialect Disclaimer Banner */}
      <div className="bg-amber-50 dark:bg-amber-950/40 p-3.5 rounded-2xl border border-amber-300 dark:border-amber-900/60 flex items-start gap-2.5 text-xs text-amber-900 dark:text-amber-200">
        <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Verified Governance Guardrails:</span> Nagar Sathi never invents unverified government fees or rules. Bagheli dialect support is experimental for Rewa local testing.
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 h-[480px] overflow-y-auto space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-3 ${
              m.role === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-md ${
                m.role === 'user'
                  ? 'bg-[#5e7769] text-white'
                  : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
              }`}
            >
              {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`max-w-[80%] rounded-2xl p-4 text-xs md:text-sm leading-relaxed space-y-2 ${
                m.role === 'user'
                  ? 'bg-[#5e7769] text-white rounded-tr-xs shadow-md shadow-[#5e7769]/25'
                  : 'bg-[#f6edd4] dark:bg-stone-800/80 text-stone-900 dark:text-stone-100 border border-[#ebdcb9] dark:border-stone-700 rounded-tl-xs shadow-xs'
              }`}
            >
              <div className="whitespace-pre-wrap">{m.text}</div>

              {m.suggestedActions && m.suggestedActions.length > 0 && (
                <div className="pt-2 border-t border-stone-200 dark:border-stone-700 flex flex-wrap gap-1.5">
                  {m.suggestedActions.map((action, aIdx) => (
                    <button
                      key={aIdx}
                      type="button"
                      onClick={() => handleSend(action)}
                      className="px-2.5 py-1 rounded-lg bg-[#fdfaf0] dark:bg-stone-900 border border-[#ebdcb9] dark:border-stone-700 text-[11px] font-bold text-[#5e7769] dark:text-[#8ea899] hover:bg-[#f3e7c8] dark:hover:bg-stone-800 transition-colors cursor-pointer"
                    >
                      → {action}
                    </button>
                  ))}
                </div>
              )}

              <div
                className={`flex items-center justify-between text-[10px] pt-1 ${
                  m.role === 'user' ? 'text-emerald-100' : 'text-stone-500'
                }`}
              >
                <span>{m.timestamp}</span>
                {m.source && <span className="italic font-mono">{m.source}</span>}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-500 dark:text-indigo-300 flex items-center justify-center border border-indigo-400/30 shadow-xs">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="glass-card p-3 rounded-2xl rounded-tl-xs text-xs text-slate-600 dark:text-slate-300 animate-pulse backdrop-blur-md">
              Nagar Sathi is querying verified municipal guidance...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompt Chips */}
      <div className="space-y-2">
        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
          <HelpCircle className="w-3.5 h-3.5" /> Suggested Queries:
        </span>
        <div className="flex flex-wrap gap-2">
          {suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="text-xs font-semibold px-3 py-1.5 rounded-xl glass-card-hover text-slate-700 dark:text-slate-200 transition-all cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2 glass-panel p-2 rounded-2xl shadow-lg backdrop-blur-2xl border border-white/20 dark:border-white/10"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            chatLang === 'hi'
              ? 'सड़क, पानी, कचरा या वार्ड सेवा संबंधी सवाल पूछें...'
              : 'Ask about reporting potholes, garbage collection, water supply, or ward contacts...'
          }
          className="flex-1 bg-transparent px-3 py-2 text-xs md:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-hidden"
        />

        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="p-3 rounded-xl bg-[#5e7769] hover:bg-[#506659] text-white font-bold disabled:opacity-50 transition-colors shadow-md hover:shadow-[#5e7769]/25 cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
