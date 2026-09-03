'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Copy, 
  Check, 
  MessageSquare, 
  CheckCircle2, 
  Calendar, 
  Sparkles, 
  HeartHandshake,
  Loader2
} from 'lucide-react';
import { formatSessionDate } from '../page';

export default function SessionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.id;

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchSession();
  }, [sessionId]);

  const fetchSession = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/sessions/${sessionId}`);
      if (res.ok) {
        const data = await res.json();
        setSession(data.session);
      } else if (res.status === 401) {
        router.push('/auth');
      } else {
        router.push('/sessions');
      }
    } catch (e) {
      console.error('Session fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!session) return;
    try {
      let copingList = [];
      try {
        if (session.copingSteps) copingList = JSON.parse(session.copingSteps);
      } catch (e) {}

      const text = `Session: ${session.title} (${formatSessionDate(session.createdAt)})\n\nSynthesis:\n${session.summary || 'No summary generated.'}\n\nCoping Plan:\n${copingList.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\n(Recorded via Clarity AI Therapist)`;
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.warn('Copy error', e);
    }
  };

  let copingSteps = [];
  try {
    if (session?.copingSteps) copingSteps = JSON.parse(session.copingSteps);
  } catch (e) {}

  return (
    <div className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6">
      
      {/* Back Button & Actions */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <Link
          href="/sessions"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to All Sessions</span>
        </Link>

        {session && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-700 shadow-xs transition-colors"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5 text-slate-400" />}
              <span>{copied ? 'Copied' : 'Export Plan'}</span>
            </button>

            <Link
              href={`/chat?session=${session.id}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <span>Resume Chat</span>
            </Link>
          </div>
        )}
      </div>

      {loading ? (
        <div className="space-y-4">
          <div className="h-8 w-64 rounded-xl skeleton-shimmer"></div>
          <div className="h-36 rounded-2xl skeleton-shimmer"></div>
          <div className="h-64 rounded-2xl skeleton-shimmer"></div>
        </div>
      ) : !session ? (
        <div className="text-center py-12 text-sm text-slate-500">Session not found.</div>
      ) : (
        <div className="space-y-6">
          
          {/* Title Header */}
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-1">
              <span>Recorded {formatSessionDate(session.createdAt)}</span>
              <span>•</span>
              <span className="capitalize">{session.status}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              {session.title}
            </h1>
          </div>

          {/* Synthesis & Coping Plan Card */}
          {session.summary && (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-emerald-50/40 dark:bg-emerald-950/20 p-5 sm:p-7 shadow-xs space-y-5">
              <div className="flex items-center gap-2.5 text-emerald-800 dark:text-emerald-300 font-bold text-sm">
                <HeartHandshake className="h-5 w-5" />
                <span>Therapeutic Synthesis & Coping Plan</span>
              </div>

              <div className="space-y-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Session Recap
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {session.summary}
                </p>
              </div>

              {copingSteps.length > 0 && (
                <div className="space-y-2.5 pt-2 border-t border-emerald-200/60 dark:border-emerald-900/40">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Actionable Coping Steps
                  </h3>
                  <div className="space-y-2">
                    {copingSteps.map((step, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 rounded-xl bg-white dark:bg-slate-900/80 p-3.5 border border-slate-200/80 dark:border-slate-800 shadow-xs"
                      >
                        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 text-xs font-bold mt-0.5">
                          {idx + 1}
                        </div>
                        <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                          {step}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Transcript stream */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Session Transcript ({session.messages?.length || 0} messages)
            </h2>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] p-4 sm:p-6 shadow-xs divide-y divide-slate-100 dark:divide-slate-800/60">
              {session.messages?.map((m) => {
                const isUser = m.role === 'user';
                return (
                  <div key={m.id} className="py-3.5 first:pt-0 last:pb-0">
                    <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                      <span className={`font-bold ${isUser ? 'text-slate-900 dark:text-white' : 'text-emerald-600 dark:text-emerald-400'}`}>
                        {isUser ? 'You' : 'Clarity AI Therapist'}
                      </span>
                      <span className="text-slate-400">
                        {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                      {m.content}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
