'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  X,
  Send,
  Trash2,
  Bot,
  User,
  ShieldCheck,
  ChevronDown,
  Loader2,
  HelpCircle,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  source?: 'gemini' | 'local_fallback';
  timestamp: string;
}

const SUGGESTED_PROMPTS = [
  'Who is Sidhartha Rayudu?',
  'What is GenVision?',
  'What is his technical stack?',
  'Tell me about his education',
  'How can I contact him?',
];

export function PortfolioAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const msgCounter = useRef(100);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init',
      sender: 'assistant',
      text: "Hello! I am Sidhartha Rayudu's interactive AI assistant. I can answer questions about his verified engineering projects (like GenVision, BhuYanthra, Robohatch, SmartDonum), technical skills, education at Sathyabama, and contact channels. What would you like to know?",
      source: 'local_fallback',
      timestamp: 'Online',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Listen to global open event
  useEffect(() => {
    function handleOpenAssistant() {
      setIsOpen(true);
    }
    window.addEventListener('open-portfolio-assistant', handleOpenAssistant);
    return () => {
      window.removeEventListener('open-portfolio-assistant', handleOpenAssistant);
    };
  }, []);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      inputRef.current?.focus();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    if (query.length > 500) {
      return;
    }

    const nextUserIndex = msgCounter.current++;
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const userMsg: ChatMessage = {
      id: `u-${nextUserIndex}`,
      sender: 'user',
      text: query,
      timestamp: nowStr,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query }),
      });

      const nextAssistantIndex = msgCounter.current++;
      const currentNowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      if (res.status === 429) {
        setMessages((prev) => [
          ...prev,
          {
            id: `a-${nextAssistantIndex}`,
            sender: 'assistant',
            text: 'You have reached the rate limit for inquiries. Please wait a moment before asking another question.',
            source: 'local_fallback',
            timestamp: currentNowStr,
          },
        ]);
        return;
      }

      const data = await res.json();
      const assistantMsg: ChatMessage = {
        id: `a-${nextAssistantIndex}`,
        sender: 'assistant',
        text: data.text || "I apologize, but I couldn't process that query. Please try again or explore the sections above.",
        source: data.source || 'local_fallback',
        timestamp: currentNowStr,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      const errIndex = msgCounter.current++;
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${errIndex}`,
          sender: 'assistant',
          text: 'The assistant connection is temporarily disrupted. You can reach Sidhartha directly via the contact form.',
          source: 'local_fallback',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    const clearIndex = msgCounter.current++;
    setMessages([
      {
        id: `init-${clearIndex}`,
        sender: 'assistant',
        text: 'Chat history cleared. How else can I assist you with Sidhartha’s portfolio?',
        source: 'local_fallback',
        timestamp: 'Online',
      },
    ]);
  };

  const renderFormattedText = (content: string) => {
    // Basic Markdown bold & bullet line splitting
    const lines = content.split('\n');
    return (
      <div className="space-y-1.5 text-xs sm:text-sm leading-relaxed">
        {lines.map((line, idx) => {
          if (!line.trim()) {
            return <div key={idx} className="h-1" />;
          }

          // Parse **bold** markers
          const parts = line.split(/(\*\*.*?\*\*)/g);
          const renderedParts = parts.map((part, pIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return (
                <strong key={pIdx} className="font-semibold text-cyan-300">
                  {part.slice(2, -2)}
                </strong>
              );
            }
            return part;
          });

          if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
            return (
              <div key={idx} className="flex items-start gap-1.5 pl-1 text-neutral-300">
                <span className="text-cyan-400 font-bold">•</span>
                <span>{renderedParts}</span>
              </div>
            );
          }

          return (
            <p key={idx} className="text-neutral-300">
              {renderedParts}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <>
      {/* Floating Launcher Trigger */}
      <div className="fixed bottom-6 right-6 z-40">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            data-magnetic="true"
            aria-label="Open AI Assistant"
            className="group relative flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-950 p-0 text-cyan-400 shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 border border-cyan-500/40 hover:border-cyan-400"
          >
            {/* Ambient Pulse Ring */}
            <span className="absolute -inset-1 rounded-2xl bg-cyan-400/20 blur-md group-hover:bg-cyan-400/30 animate-pulse transition" />
            
            <div className="relative flex h-full w-full items-center justify-center rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-950">
              <Sparkles className="h-6 w-6 text-cyan-400 transition-transform group-hover:rotate-12" />
              
              {/* Online Notification Pill */}
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-cyan-400 ring-2 ring-neutral-950" />
              </span>
            </div>
          </button>
        )}
      </div>

      {/* Expandable Chat Drawer */}
      {isOpen && (
        <div
          role="dialog"
          aria-labelledby="assistant-title"
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex h-[540px] max-h-[85vh] w-[calc(100vw-32px)] sm:w-[420px] flex-col overflow-hidden rounded-3xl border border-cyan-500/40 bg-neutral-950/95 shadow-2xl shadow-cyan-950/50 backdrop-blur-2xl animate-in fade-in slide-in-from-bottom-5 duration-200"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-neutral-800/80 bg-neutral-900/60 px-4 py-3.5 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
                <Bot className="h-5 w-5" />
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-neutral-950" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 id="assistant-title" className="text-sm font-semibold tracking-tight text-white">
                    Sidhartha AI
                  </h3>
                  <span className="rounded bg-cyan-500/10 px-1.5 py-0.5 text-[10px] font-mono font-medium text-cyan-400 border border-cyan-500/20">
                    v7.2
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-neutral-400">
                  <ShieldCheck className="h-3 w-3 text-cyan-400" />
                  <span>Ground Truth • Verified Knowledge</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleClearHistory}
                title="Clear chat history"
                className="rounded-lg p-1.5 text-neutral-400 transition hover:bg-neutral-800 hover:text-neutral-200"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close assistant"
                className="rounded-lg p-1.5 text-neutral-400 transition hover:bg-neutral-800 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3.5">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border text-xs ${
                      isUser
                        ? 'border-neutral-700 bg-neutral-800 text-neutral-300'
                        : 'border-cyan-500/30 bg-cyan-500/10 text-cyan-400'
                    }`}
                  >
                    {isUser ? <User className="h-3.5 w-3.5" /> : <Sparkles className="h-3.5 w-3.5" />}
                  </div>

                  <div
                    className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 shadow-sm ${
                      isUser
                        ? 'bg-neutral-800 text-neutral-100 rounded-tr-sm border border-neutral-700/60'
                        : 'bg-neutral-900/90 text-neutral-200 rounded-tl-sm border border-cyan-500/25'
                    }`}
                  >
                    {renderFormattedText(msg.text)}

                    <div className="mt-1.5 flex items-center justify-between text-[10px] text-neutral-500">
                      <span>{msg.timestamp}</span>
                      {!isUser && (
                        <span className="font-mono text-[9px] text-cyan-400/80">
                          {msg.source === 'gemini' ? 'Gemini 2.5 Flash' : 'Verified Knowledge Engine'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-start gap-2.5">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-cyan-500/30 bg-cyan-500/10 text-cyan-400">
                  <Sparkles className="h-3.5 w-3.5 animate-spin" />
                </div>
                <div className="rounded-2xl rounded-tl-sm border border-cyan-500/25 bg-neutral-900/90 px-4 py-3 text-xs text-neutral-400 flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-cyan-400 animate-bounce" />
                  <span className="inline-block h-2 w-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.2s]" />
                  <span className="inline-block h-2 w-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.4s]" />
                  <span className="ml-1 text-[11px] font-mono text-cyan-400/80">Consulting profile...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggested Prompts Chips */}
          <div className="border-t border-neutral-900 bg-neutral-950/80 px-3 py-2">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] scrollbar-none">
              <span className="shrink-0 text-neutral-500 font-mono text-[10px]">Suggested:</span>
              {SUGGESTED_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  disabled={isLoading}
                  onClick={() => handleSendMessage(prompt)}
                  className="shrink-0 rounded-full border border-neutral-800 bg-neutral-900/80 px-2.5 py-1 text-neutral-300 transition hover:border-cyan-500/50 hover:bg-cyan-500/10 hover:text-cyan-300 disabled:opacity-50"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Input Bar */}
          <div className="border-t border-neutral-800/80 bg-neutral-900/80 p-3">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <div className="relative flex-1">
                <input
                  ref={inputRef}
                  type="text"
                  maxLength={500}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about projects, stack, contact..."
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950/90 px-3.5 py-2 text-xs text-neutral-100 placeholder-neutral-500 transition focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
                />
                <span className="absolute right-2.5 top-2.5 text-[9px] font-mono text-neutral-500">
                  {input.length}/500
                </span>
              </div>

              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500 text-neutral-950 transition hover:bg-cyan-400 disabled:opacity-40 disabled:hover:bg-cyan-500"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-3.5 w-3.5" />
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
