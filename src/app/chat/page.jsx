'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  Send, 
  Loader2, 
  ShieldAlert, 
  ArrowLeft,
  Settings,
  CheckCircle
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
    <div className="flex-1 flex flex-col h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)] max-w-4xl mx-auto w-full px-3 sm:px-6 py-3 sm:py-4">
      
      {/* Top Consultation Bar */}
      <div className="flex items-center justify-between gap-2 pb-3 border-b border-[#E7E3D8] dark:border-[#262C29] text-xs shrink-0">
        <div className="flex items-center gap-2 truncate">
          <Link
            href="/sessions"
            className="flex items-center gap-1 text-[#6A7067] hover:text-[#1F221E] dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span className="hidden xs:inline">Notes</span>
          </Link>
          <span className="text-[#CCC7BA] dark:text-[#3B423E]">•</span>
          <span className="font-serif text-sm font-semibold text-[#1A1C20] dark:text-[#EDEBE4] truncate max-w-[180px] sm:max-w-md">
            {session?.title || 'Personal Reflection'}
          </span>
          {session?.status === 'completed' && (
            <span className="text-[10px] font-sans px-1.5 py-0.5 rounded border border-[#DDD8CC] dark:border-[#353D38] bg-[#F2EFE8] dark:bg-[#1D221F] text-[#555A52]">
              Concluded
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            onClick={() => setShowKeyInput(!showKeyInput)}
            title="Inference configuration"
            className="p-1.5 rounded-lg border border-[#DDD8CB] dark:border-[#2C332E] bg-white dark:bg-[#191D1B] text-[#6A7067] hover:text-[#1A1C20] dark:hover:text-white transition-colors shadow-subtle"
          >
            <Settings className="h-3.5 w-3.5" />
          </button>

          <button
            onClick={handleEndSession}
            disabled={endingSession || messages.length <= 1}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#D5D0C3] dark:border-[#323A35] bg-white dark:bg-[#191D1B] text-[#292D28] dark:text-[#EDEAE2] font-medium text-xs hover:bg-[#F4F1E9] dark:hover:bg-[#222724] transition-colors shadow-subtle disabled:opacity-50 cursor-pointer"
          >
            {endingSession ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin text-[#60665D]" />
                <span>Synthesizing...</span>
              </>
            ) : (
              <>
                <CheckCircle className="h-3.5 w-3.5 text-[#60665D]" />
                <span>Conclude Session</span>
              </>
            )}
          </button>
        </div>
      </div>

      {showKeyInput && (
        <div className="mt-2 p-3.5 rounded-xl border border-[#DCD7CB] dark:border-[#2B322D] bg-white dark:bg-[#1A1E1C] text-xs space-y-2 animate-in slide-in-from-top-2 duration-150 shrink-0 shadow-subtle">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-[#1A1C20] dark:text-[#EDEBE4]">External Model Key (Optional)</span>
            <span className="text-[11px] text-[#7A8077] font-mono">OpenAI / Groq / OpenRouter</span>
          </div>
          <p className="text-[11px] text-[#63685F] dark:text-[#9EA59B]">
            By default, Clarity runs via our local clinical engine without requiring an external token. You may optionally connect an API key.
          </p>
          <div className="flex gap-2">
            <input
              type="password"
              value={customKey}
              onChange={(e) => setCustomKey(e.target.value)}
              placeholder="sk-..."
              className="flex-1 rounded-lg border border-[#DDD8CB] dark:border-[#333B36] bg-[#FAF9F6] dark:bg-[#131614] px-2.5 py-1.5 text-xs text-[#1A1C20] dark:text-[#EDEAE3] focus:outline-none focus:border-[#4E6754]"
            />
            <button
              onClick={() => handleSaveCustomKey(customKey)}
              className="px-3 py-1.5 rounded-lg bg-[#243B2C] dark:bg-[#EAE8E2] text-white dark:text-[#141A16] font-medium text-xs hover:opacity-90"
            >
              Save Key
            </button>
          </div>
        </div>
      )}

      {crisisAlert && (
        <div className="mt-2.5 p-3.5 rounded-xl border border-rose-300 dark:border-rose-900 bg-rose-50/80 dark:bg-rose-950/40 flex items-center justify-between gap-3 text-xs text-rose-900 dark:text-rose-200 shrink-0 shadow-subtle">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-rose-700 shrink-0" />
            <span className="font-medium">Safety Notice: Immediate support is available 24/7.</span>
          </div>
          <button
            onClick={() => setCrisisModalOpen(true)}
            className="px-2.5 py-1 rounded-md bg-rose-700 text-white font-semibold hover:bg-rose-800 shrink-0 text-xs cursor-pointer"
          >
            Emergency 988
          </button>
        </div>
      )}

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1 sm:pr-2">
        {messages.map((msg, index) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id || index}
              className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`rounded-2xl px-4 sm:px-5 py-3.5 text-xs sm:text-sm leading-relaxed max-w-[88%] sm:max-w-[80%] whitespace-pre-wrap ${
                  isUser
                    ? 'rounded-tr-xs bg-[#242825] text-[#FAF8F5] dark:bg-[#282F2A] shadow-subtle'
                    : 'rounded-tl-xs border border-[#E7E3D8] dark:border-[#2A312C] bg-white dark:bg-[#181C1A] text-[#1E211F] dark:text-[#E2DFD6] shadow-subtle'
                }`}
              >
                {!isUser && (
                  <div className="text-[11px] font-serif italic text-[#777D74] dark:text-[#9AA297] mb-1.5">
                    Clarity
                  </div>
                )}
                <p className="leading-relaxed">{msg.content}</p>
              </div>
            </div>
          );
        })}

        {sending && (
          <div className="flex justify-start">
            <div className="rounded-2xl rounded-tl-xs border border-[#E7E3D8] dark:border-[#2A312C] bg-white dark:bg-[#181C1A] px-4 py-3 text-xs text-[#6B7168] dark:text-[#9AA297] flex items-center gap-2 shadow-subtle">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-[#6B7168]" />
              <span className="font-serif italic">Clarity is listening...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Composer */}
      <div className="pt-2.5 border-t border-[#E7E3D8] dark:border-[#262C29] shrink-0">
        <form onSubmit={handleSendMessage} className="relative flex items-end gap-2">
          <div className="relative flex-1">
            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              placeholder="What would you like to explore today?..."
              disabled={sending}
              className="w-full resize-none rounded-xl border border-[#DCD7CB] dark:border-[#2C332E] bg-white dark:bg-[#181C1A] py-3 pl-3.5 pr-10 text-base sm:text-sm text-[#1A1C20] dark:text-[#EDEBE5] placeholder:text-[#969C93] focus:border-[#38533F] focus:outline-none focus:ring-2 focus:ring-[#38533F]/15 max-h-40 overflow-y-auto leading-normal shadow-subtle"
            />
          </div>

          <button
            type="submit"
            disabled={!input.trim() || sending}
            aria-label="Send message"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#233B2B] text-white hover:bg-[#1B2F22] dark:bg-[#EAE8E2] dark:text-[#141A16] dark:hover:bg-white disabled:opacity-40 transition-colors shadow-subtle cursor-pointer"
          >
            {sending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </form>

        <div className="flex items-center justify-between px-1 pt-1.5 text-[10px] text-[#7A8077] dark:text-[#8E958C]">
          <span>Press Enter to send, Shift+Enter for new line</span>
          <span>Confidential session</span>
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
        <div className="flex-1 flex items-center justify-center p-8 text-[#737871] text-xs">
          <Loader2 className="h-4 w-4 animate-spin text-[#4F6854] mr-2" />
          <span>Opening private consultation room...</span>
        </div>
      }
    >
      <ChatContent />
    </Suspense>
  );
}
