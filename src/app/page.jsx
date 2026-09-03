'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  HeartHandshake, 
  ShieldCheck, 
  Brain, 
  Sparkles, 
  ArrowRight, 
  LifeBuoy, 
  Lock, 
  CheckCircle2, 
  Loader2, 
  FileText 
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const [startingGuest, setStartingGuest] = useState(false);

  const handleStartAnonymous = async () => {
    try {
      setStartingGuest(true);
      const res = await fetch('/api/auth/anonymous', { method: 'POST' });
      if (res.ok) {
        // Create initial session
        const sessionRes = await fetch('/api/sessions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: 'First Reflection Session' }),
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
      title: 'Active Empathetic Listening',
      description: 'Clarity does not lecture or rush to give unsolicited advice. It validates your emotional reality and helps untangle racing thoughts.',
    },
    {
      title: 'Cognitive Behavioral Grounding',
      description: 'Identify automatic negative thought loops and gently ground your nervous system with evidence-informed exercises.',
    },
    {
      title: 'Actionable Session Recaps',
      description: 'When you end a session, Clarity generates a practical recap and 3 personalized coping steps tailored to your specific situation.',
    },
    {
      title: 'Uncompromising Local Privacy',
      description: 'Start completely anonymous without an email. Chat logs and coping records are stored in your encrypted local session.',
    },
  ];

  return (
    <div className="flex-1 flex flex-col">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 sm:pt-20 pb-16 sm:pb-24 border-b border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#0b0f17] transition-colors">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-5">
            
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-mono text-emerald-700 dark:text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
              <span>Confidential AI Therapy Companion</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-950 dark:text-white leading-[1.15]">
              A calm space to untangle your thoughts.
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Experience empathetic, non-judgmental conversational reflection grounded in cognitive behavioral therapy. Available anytime you need to speak.
            </p>

            {/* Call to Actions */}
            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
              <button
                onClick={handleStartAnonymous}
                disabled={startingGuest}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 px-6 py-3.5 text-sm font-bold text-white shadow-sm transition-all disabled:opacity-60 cursor-pointer"
              >
                {startingGuest ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                    <span>Preparing Private Session...</span>
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
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 px-6 py-3.5 text-sm font-semibold text-slate-800 dark:text-slate-200 transition-colors"
              >
                <span>Create Account</span>
              </Link>
            </div>

            {/* Micro reassurance line */}
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 pt-2 text-xs text-slate-500 dark:text-slate-400 font-mono">
              <span className="flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-slate-400" />
                <span>Zero Email Required for Guests</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                <span>Free & Confidential</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-blue-500" />
                <span>988 Crisis Guardrails</span>
              </span>
            </div>

          </div>

          {/* Realistic Dialogue Card Mockup */}
          <div className="mt-12 sm:mt-16 max-w-2xl mx-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#0f172a] p-5 sm:p-7 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-3 text-xs font-mono text-slate-400">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                <span>Active Dialogue Preview</span>
              </span>
              <span>Session #402</span>
            </div>

            {/* User message */}
            <div className="flex justify-end">
              <div className="rounded-2xl rounded-tr-xs bg-slate-900 dark:bg-emerald-600 px-4 py-3 text-xs sm:text-sm text-white max-w-[85%] leading-relaxed">
                I feel like I am constantly running on empty trying to keep everyone happy at work. By the time I get home, I have nothing left for myself.
              </div>
            </div>

            {/* Therapist message */}
            <div className="flex justify-start">
              <div className="rounded-2xl rounded-tl-xs border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#162035] px-4 py-3.5 text-xs sm:text-sm text-slate-800 dark:text-slate-200 max-w-[90%] leading-relaxed shadow-xs space-y-2">
                <p>
                  That constant depletion is a heavy burden to carry alone. It sounds like you have been sacrificing your own emotional reserves to keep the peace around you, leaving you empty.
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  When you notice that impulse to say yes to another demand, what is the fear or guilt that whispers in the background?
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 4 Pillars Section */}
      <section className="py-14 sm:py-20 bg-slate-50 dark:bg-[#070b14] transition-colors">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto space-y-2 mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Grounding principles of Clarity
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Carefully calibrated to assist self-reflection without judgment or pretense.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {pillars.map((item, idx) => (
              <div
                key={item.title}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] p-5 shadow-xs transition-all hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-2">
                    0{idx + 1}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Callout */}
      <section className="py-12 sm:py-16 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#090d16] text-center transition-colors">
        <div className="mx-auto max-w-3xl px-4 space-y-4">
          <h2 className="text-xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Take a moment for your mental space today.
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
            No waiting rooms, no clinical appointments, and zero judgment. Speak freely in a private environment.
          </p>
          <div className="pt-2">
            <button
              onClick={handleStartAnonymous}
              disabled={startingGuest}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 px-6 py-3 text-sm font-bold text-white shadow-xs transition-all cursor-pointer"
            >
              <span>Begin Session Now</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
