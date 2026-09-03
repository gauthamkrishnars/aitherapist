'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  Send, 
  Loader2, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowLeft,
  Settings
} from 'lucide-react';
import Link from 'next/link';
import { EndSessionModal } from '@/components/EndSessionModal';
import { CrisisModal } from '@/components/CrisisModal';

function ChatContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const requestedSessionId = searchParams.get('session');

  const [session, setSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [endingSession, setEndingSession] = useState(false);
  const [sessionSummary, setSessionSummary] = useState(null);
  const [summaryModalOpen, setSummaryModalOpen] = useState(false);
  const [crisisModalOpen, setCrisisModalOpen] = useState(false);
  const [crisisAlert, setCrisisAlert] = useState(null);
  const [customKey, setCustomKey] = useState('');
  const [showKeyInput, setShowKeyInput] = useState(false);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, sending]);

  useEffect(() => {
    const savedKey = localStorage.getItem('clarity_custom_api_key');
    if (savedKey) setCustomKey(savedKey);
  }, []);

  useEffect(() => {
    initializeSession(requestedSessionId);
  }, [requestedSessionId]);

  const initializeSession = async (targetId) => {
    try {
      if (targetId) {
        const res = await fetch(`/api/sessions/${targetId}`);
        if (res.ok) {
          const data = await res.json();
          setSession(data.session);
          setMessages(data.session.messages || []);
          return;
        }
      }

      const listRes = await fetch('/api/sessions');
      if (listRes.ok) {
        const listData = await listRes.json();
        const active = listData.sessions?.find((s) => s.status === 'active');
        if (active) {
          router.replace(`/chat?session=${active.id}`);
          return;
        }
      }

      const createRes = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Personal Reflection' }),
      });

      if (createRes.ok) {
        const createData = await createRes.json();
        setSession(createData.session);
        setMessages(createData.session.messages || []);
        router.replace(`/chat?session=${createData.session.id}`);
      } else if (createRes.status === 401) {
        const guestAuth = await fetch('/api/auth/anonymous', { method: 'POST' });
        if (guestAuth.ok) {
          initializeSession(null);
        } else {
          router.push('/auth');
        }
      }
    } catch (error) {
      console.error('Session load error:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!input.trim() || sending) return;

    const userText = input.trim();
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    const tempUserMsg = {
      id: `temp-${Date.now()}`,
      role: 'user',
      content: userText,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);
    setSending(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: session?.id,
          message: userText,
          userApiKey: customKey || null,
        }),
      });

      const data = await res.json();

      if (data.isCrisis) {
        setCrisisAlert(data.message.content);
        setCrisisModalOpen(true);
      }

      if (data.message) {
        setMessages((prev) => [...prev.filter((m) => m.id !== tempUserMsg.id), tempUserMsg, data.message]);
      }
    } catch (err) {
      console.error('Send message error:', err);
    } finally {
      setSending(false);
    }
  };

  const handleEndSession = async () => {
    if (!session?.id || endingSession) return;
    setEndingSession(true);

    try {
      const res = await fetch(`/api/sessions/${session.id}/end`, {
        method: 'POST',
      });

      if (res.ok) {
        const data = await res.json();
        setSessionSummary({
          title: data.title,
          summary: data.summary,
          copingSteps: data.copingSteps,
        });
        setSummaryModalOpen(true);
      }
    } catch (err) {
      console.error('End session error:', err);
    } finally {
      setEndingSession(false);
    }
  };

  const handleStartFreshSession = async () => {
    setSummaryModalOpen(false);
    setSession(null);
    setMessages([]);
    router.replace('/chat');
    initializeSession(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleTextareaChange = (e) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 180)}px`;
  };

  const handleSaveCustomKey = (key) => {
    setCustomKey(key);
    localStorage.setItem('clarity_custom_api_key', key);
    setShowKeyInput(false);
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)] max-w-5xl mx-auto w-full px-2 sm:px-4 py-2 sm:py-4">
      
      {/* Top Session Action Bar */}
      <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-200 dark:border-slate-800 text-xs shrink-0">
        <div className="flex items-center gap-2 truncate">
          <Link
            href="/sessions"
            className="flex items-center gap-1 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span className="hidden xs:inline">History</span>
          </Link>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <span className="font-semibold text-slate-900 dark:text-white truncate max-w-[200px] sm:max-w-md">
            {session?.title || 'Active Consultation'}
          </span>
          {session?.status === 'completed' && (
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
              Completed
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            onClick={() => setShowKeyInput(!showKeyInput)}
            title="Configure model parameters (optional)"
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors shadow-xs"
          >
            <Settings className="h-3.5 w-3.5" />
          </button>

          <button
            onClick={handleEndSession}
            disabled={endingSession || messages.length <= 1}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium text-xs hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
          >
            {endingSession ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin text-slate-600 dark:text-slate-400" />
                <span>Summarizing...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="h-3.5 w-3.5 text-slate-500" />
                <span>End Session</span>
              </>
            )}
          </button>
        </div>
      </div>

      {showKeyInput && (
        <div className="mt-2 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs space-y-2 animate-in slide-in-from-top-2 duration-150 shrink-0">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-900 dark:text-white">External Inference Key (Optional)</span>
            <span className="text-[11px] text-slate-400 font-mono">OpenAI / Groq / OpenRouter</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            By default, Clarity operates via our local clinical engine. You may optionally attach an external API key for cloud model inference.
          </p>
          <div className="flex gap-2">
            <input
              type="password"
              value={customKey}
              onChange={(e) => setCustomKey(e.target.value)}
              placeholder="sk-..."
              className="flex-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2.5 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-slate-400"
            />
            <button
              onClick={() => handleSaveCustomKey(customKey)}
              className="px-3 py-1.5 rounded-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-medium text-xs hover:opacity-90"
            >
              Save Key
            </button>
          </div>
        </div>
      )}

      {crisisAlert && (
        <div className="mt-2 p-3 rounded-xl border border-rose-300 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 flex items-center justify-between gap-3 text-xs text-rose-900 dark:text-rose-200 shrink-0">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-rose-600 shrink-0" />
            <span className="font-semibold">Safety Notice: Emergency assistance is available 24/7.</span>
          </div>
          <button
            onClick={() => setCrisisModalOpen(true)}
            className="px-2.5 py-1 rounded-md bg-rose-600 text-white font-bold hover:bg-rose-700 shrink-0 text-xs"
          >
            Call 988
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto py-3 space-y-3.5 pr-1 sm:pr-2">
        {messages.map((msg, index) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id || index}
              className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed max-w-[88%] sm:max-w-[80%] whitespace-pre-wrap ${
                  isUser
                    ? 'rounded-tr-xs bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-xs'
                    : 'rounded-tl-xs border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] text-slate-800 dark:text-slate-200 shadow-xs'
                }`}
              >
                {!isUser && (
                  <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                    Clarity
                  </div>
                )}
                <p>{msg.content}</p>
              </div>
            </div>
          );
        })}

        {sending && (
          <div className="flex justify-start">
            <div className="rounded-2xl rounded-tl-xs border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] px-4 py-3 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 shadow-xs">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-500" />
              <span>Clarity is listening...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="pt-2 border-t border-slate-200 dark:border-slate-800 shrink-0">
        <form onSubmit={handleSendMessage} className="relative flex items-end gap-2">
          <div className="relative flex-1">
            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              placeholder="Share what you are feeling or experiencing..."
              disabled={sending}
              className="w-full resize-none rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0f172a] py-3 pl-3.5 pr-10 text-base sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400/20 max-h-40 overflow-y-auto leading-normal shadow-xs"
            />
          </div>

          <button
            type="submit"
            disabled={!input.trim() || sending}
            aria-label="Send message"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 disabled:opacity-40 transition-all shadow-xs cursor-pointer"
          >
            {sending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </form>

        <div className="flex items-center justify-between px-1 pt-1 text-[10px] text-slate-400 dark:text-slate-500 font-mono">
          <span>Press Enter to send, Shift+Enter for new line</span>
          <span>Confidential consultation</span>
        </div>
      </div>

      <EndSessionModal
        isOpen={summaryModalOpen}
        onClose={() => setSummaryModalOpen(false)}
        sessionSummary={sessionSummary}
        onStartNewSession={handleStartFreshSession}
      />

      <CrisisModal
        isOpen={crisisModalOpen}
        onClose={() => setCrisisModalOpen(false)}
      />

    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center p-8 text-slate-400 text-xs">
          <Loader2 className="h-5 w-5 animate-spin text-slate-500 mr-2" />
          <span>Opening private consultation room...</span>
        </div>
      }
    >
      <ChatContent />
    </Suspense>
  );
}
