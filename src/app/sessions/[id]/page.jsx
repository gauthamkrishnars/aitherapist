'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Copy, 
  Check, 
  FileText
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

      const text = `Consultation Note: ${session.title} (${formatSessionDate(session.createdAt)})\n\nSynthesis:\n${session.summary || 'No summary generated.'}\n\nAction Plan:\n${copingList.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\n(Recorded via Clarity)`;
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
    <div className="flex-1 max-w-4xl mx-auto w-full px-3 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6">
      
      {/* Back Button & Actions */}
      <div className="flex items-center justify-between border-b border-[#E7E3D8] dark:border-[#262C29] pb-4">
        <Link
          href="/sessions"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#666C63] hover:text-[#1A1C20] dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Notes</span>
        </Link>

        {session && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#D5D0C3] dark:border-[#2C332F] bg-white dark:bg-[#181C1A] text-[#292D28] dark:text-[#DDD9D0] text-xs font-medium hover:bg-[#F4F1E9] dark:hover:bg-[#222724] shadow-subtle transition-colors cursor-pointer"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-[#3E6148]" /> : <Copy className="h-3.5 w-3.5 text-[#888E84]" />}
              <span>{copied ? 'Copied' : 'Export Plan'}</span>
            </button>

            <Link
              href={`/chat?session=${session.id}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#233B2B] hover:bg-[#1B2F22] dark:bg-[#EAE8E2] dark:text-[#141A16] dark:hover:bg-white text-white text-xs font-medium shadow-subtle transition-colors"
            >
              <span>Resume Consultation</span>
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
        <div className="text-center py-12 text-sm text-[#777D74]">Record not found.</div>
      ) : (
        <div className="space-y-6">
          
          {/* Title Header */}
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#83897F] mb-1">
              <span>Recorded {formatSessionDate(session.createdAt)}</span>
              <span>•</span>
              <span className="capitalize">{session.status}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-normal text-[#1A1C20] dark:text-[#FAF8F5]">
              {session.title}
            </h1>
          </div>

          {/* Synthesis & Action Plan Card */}
          {session.summary && (
            <div className="rounded-2xl border border-[#E0DCD1] dark:border-[#2C332F] bg-white dark:bg-[#181C1A] p-6 sm:p-8 shadow-card space-y-5">
              <div className="flex items-center gap-2.5 text-[#1F221E] dark:text-[#FAF8F5] font-serif font-medium text-base border-b border-[#F0ECE2] dark:border-[#242A26] pb-3">
                <FileText className="h-4 w-4 text-[#44664F]" />
                <span>Consultation Synthesis & Recommended Care Plan</span>
              </div>

              <div className="space-y-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#737970] dark:text-[#9EA59B]">
                  Clinical Synthesis
                </h3>
                <p className="text-xs sm:text-sm text-[#272A26] dark:text-[#DCD9D0] leading-relaxed">
                  {session.summary}
                </p>
              </div>

              {copingSteps.length > 0 && (
                <div className="space-y-3 pt-3 border-t border-[#F0ECE2] dark:border-[#242A26]">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-[#737970] dark:text-[#9EA59B]">
                    Actionable Coping Steps
                  </h3>
                  <div className="space-y-2.5">
                    {copingSteps.map((step, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 rounded-xl bg-[#FAF9F5] dark:bg-[#202523] p-4 border border-[#E8E4DA] dark:border-[#2A312D] shadow-subtle"
                      >
                        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#E5E0D5] dark:bg-[#2B342F] text-[#292D28] dark:text-[#D5D0C3] font-mono text-xs mt-0.5">
                          {idx + 1}
                        </div>
                        <p className="text-xs sm:text-sm text-[#292D28] dark:text-[#DDD9D0] leading-relaxed">
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
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[#737970] dark:text-[#9DA49A]">
              Dialogue Record ({session.messages?.length || 0} exchanges)
            </h2>

            <div className="rounded-2xl border border-[#E7E3D8] dark:border-[#272E2A] bg-white dark:bg-[#181C1A] p-4 sm:p-6 shadow-subtle divide-y divide-[#F0ECE2] dark:border-[#242A26]">
              {session.messages?.map((m) => {
                const isUser = m.role === 'user';
                return (
                  <div key={m.id} className="py-4 first:pt-0 last:pb-0">
                    <div className="flex items-center justify-between text-[11px] font-sans mb-1.5">
                      <span className={`font-semibold ${isUser ? 'text-[#1A1C20] dark:text-white' : 'font-serif italic text-[#587962] dark:text-[#9CB6A3]'}`}>
                        {isUser ? 'Client' : 'Clarity'}
                      </span>
                      <span className="text-[#898F85] font-mono text-[10px]">
                        {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-[#2D302C] dark:text-[#DDD9D0] leading-relaxed whitespace-pre-wrap">
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
