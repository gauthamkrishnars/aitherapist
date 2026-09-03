'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ShieldCheck, 
  ArrowRight, 
  Lock, 
  CheckCircle2, 
  Loader2,
  HeartHandshake,
  Compass,
  FileCheck2,
  Clock
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const [startingGuest, setStartingGuest] = useState(false);

  const handleStartAnonymous = async () => {
    try {
      setStartingGuest(true);
      const res = await fetch('/api/auth/anonymous', { method: 'POST' });
      if (res.ok) {
        const sessionRes = await fetch('/api/sessions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: 'Personal Reflection' }),
        });
        if (sessionRes.ok) {
          const sessionData = await sessionRes.json();
          router.push(`/chat?session=${sessionData.session.id}`);
          return;
        }
      }
      router.push('/chat');
    } catch (e) {
      router.push('/chat');
    } finally {
      setStartingGuest(false);
    }
  };

  const pillars = [
    {
      icon: HeartHandshake,
      title: 'Active Empathetic Listening',
      description: 'Clarity does not lecture or offer unsolicited advice. It validates your emotional reality and provides a calm sounding board.',
    },
    {
      icon: Compass,
      title: 'Cognitive Grounding',
      description: 'Identify automatic thought patterns and practice evidence-informed exercises grounded in CBT and ACT frameworks.',
    },
    {
      icon: FileCheck2,
      title: 'Actionable Session Summaries',
      description: 'Conclude each conversation with a clear synthesis and practical coping strategies tailored to your situation.',
    },
    {
      icon: Lock,
      title: 'Private & Local Architecture',
      description: 'Begin instantly without an email address. Conversations and coping records are protected within your local session.',
    },
  ];

  return (
    <div className="flex-1 flex flex-col">
      
      {/* Hero Section */}
      <section className="relative pt-14 sm:pt-24 pb-16 sm:pb-28 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#090d16] transition-colors">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            
            {/* Clean Professional Category Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 px-3.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-300">
              <span className="font-mono text-slate-400">CLINICAL COMPANION</span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span>Evidence-Informed Dialogue</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-slate-950 dark:text-white leading-[1.12]">
              A quiet space to untangle your thoughts.
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
              Structured, non-judgmental conversational reflection grounded in cognitive behavioral therapy. Available whenever you need to process an experience.
            </p>

            {/* Call to Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
              <button
                onClick={handleStartAnonymous}
                disabled={startingGuest}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 px-6 py-3.5 text-sm font-semibold text-white shadow-xs transition-colors disabled:opacity-60 cursor-pointer"
              >
                {startingGuest ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Connecting Session...</span>
                  </>
                ) : (
                  <>
                    <span>Start Anonymous Session</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              <Link
                href="/auth"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/80 px-6 py-3.5 text-sm font-semibold text-slate-800 dark:text-slate-200 transition-colors shadow-xs"
              >
                <span>Create Account</span>
              </Link>
            </div>

            {/* Micro reassurance line */}
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-3 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-slate-400" />
                <span>Zero Email Required for Guests</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-slate-400" />
                <span>Confidential Storage</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-slate-400" />
                <span>988 Crisis Guardrails</span>
              </span>
            </div>

          </div>

          {/* Clean Clinical Dialogue Card */}
          <div className="mt-14 sm:mt-18 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-[#0f1523] p-5 sm:p-7 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200/70 dark:border-slate-800 pb-3 text-xs text-slate-400 font-mono">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                SAMPLE CONSULTATION
              </span>
              <span>CONFIDENTIAL</span>
            </div>

            {/* Client message */}
            <div className="flex justify-end">
              <div className="rounded-2xl rounded-tr-xs bg-slate-900 dark:bg-slate-800 px-4 py-3 text-xs sm:text-sm text-white max-w-[85%] leading-relaxed shadow-xs">
                I feel completely drained trying to manage everyone’s expectations at work. By the evening, I have no energy left for myself.
              </div>
            </div>

            {/* Therapist message */}
            <div className="flex justify-start">
              <div className="rounded-2xl rounded-tl-xs border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#151c2e] px-4 py-3.5 text-xs sm:text-sm text-slate-800 dark:text-slate-200 max-w-[90%] leading-relaxed shadow-xs space-y-2">
                <p>
                  Carrying the emotional weight of everyone else’s needs takes an immense toll over time. It makes complete sense that you are feeling depleted when your own boundaries are constantly being postponed.
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  When you notice the urge to accept another commitment you don’t have capacity for, what is the fear or expectation that surfaces first?
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 4 Pillars Section */}
      <section className="py-16 sm:py-24 bg-slate-50 dark:bg-[#070b14] transition-colors">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto space-y-2 mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Core Methodologies
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Structured to facilitate intentional self-reflection and actionable emotional regulation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {pillars.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <div
                  key={item.title}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] p-5 shadow-xs transition-colors hover:border-slate-300 dark:hover:border-slate-700 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 mb-3">
                      <IconComp className="h-4 w-4" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final Callout */}
      <section className="py-14 sm:py-20 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#090d16] text-center transition-colors">
        <div className="mx-auto max-w-2xl px-4 space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Take a moment for your mental clarity.
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
            No scheduling delays, no clinical appointments, and zero judgment. Speak privately in a protected environment.
          </p>
          <div className="pt-2">
            <button
              onClick={handleStartAnonymous}
              disabled={startingGuest}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 px-6 py-3 text-sm font-semibold text-white shadow-xs transition-colors cursor-pointer"
            >
              <span>Begin Session</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
