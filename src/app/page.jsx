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
  FileCheck2
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
      title: 'Empathetic Active Listening',
      description: 'Clarity does not lecture or impose unsolicited advice. It validates your emotional reality and provides a patient, non-judgmental space to process feeling.',
    },
    {
      icon: Compass,
      title: 'Cognitive Grounding',
      description: 'Identify automatic thought loops and gently ground your nervous system using evidence-informed Cognitive Behavioral and Acceptance techniques.',
    },
    {
      icon: FileCheck2,
      title: 'Actionable Summaries',
      description: 'Conclude each session with a concise clinical synthesis and 3 practical coping steps tailored to your personal circumstances.',
    },
    {
      icon: Lock,
      title: 'Private & Local Architecture',
      description: 'Begin immediately without an email address. Your conversations and reflection records remain confidential within your local session.',
    },
  ];

  return (
    <div className="flex-1 flex flex-col">
      
      {/* Hero Section */}
      <section className="relative pt-16 sm:pt-24 pb-16 sm:pb-24 border-b border-[#E8E5DC] dark:border-[#252A27] bg-[#FAF9F6] dark:bg-[#121413] transition-colors">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6 sm:space-y-7">
            
            {/* Clinical Identity Tag */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#DFDAD0] dark:border-[#2C332F] bg-[#F2EFE8] dark:bg-[#1A1E1C] px-3.5 py-1 text-xs font-medium text-[#464A44] dark:text-[#B6BDB8]">
              <span className="font-sans font-semibold tracking-wider uppercase text-[10px]">Clinical Reflection</span>
              <span className="text-[#C4BFAF] dark:text-[#454E48]">•</span>
              <span>Evidence-Informed Dialogue</span>
            </div>

            {/* Editorial Headline */}
            <h1 className="text-4xl sm:text-6xl font-serif font-normal tracking-tight text-[#1A1C20] dark:text-[#FAF8F5] leading-[1.14]">
              A quiet space to untangle your thoughts and regain clarity.
            </h1>

            {/* Editorial Subtitle */}
            <p className="text-base sm:text-lg text-[#5A5E58] dark:text-[#A8ADA6] max-w-2xl mx-auto leading-relaxed font-normal">
              Reflective, confidential conversation grounded in cognitive behavioral frameworks. Available whenever you need to explore challenges, untangle anxiety, or cultivate calm.
            </p>

            {/* Action Bar */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto">
              <button
                onClick={handleStartAnonymous}
                disabled={startingGuest}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#233B2B] hover:bg-[#1B2F22] dark:bg-[#EAE8E2] dark:text-[#141A16] dark:hover:bg-white px-7 py-3.5 text-sm font-medium text-white shadow-subtle transition-all disabled:opacity-60 cursor-pointer"
              >
                {startingGuest ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-white dark:text-[#141A16]" />
                    <span>Connecting Session...</span>
                  </>
                ) : (
                  <>
                    <span>Begin Anonymous Session</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              <Link
                href="/auth"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-[#DCD7CB] dark:border-[#2C332E] bg-white/80 dark:bg-[#1A1E1C] hover:bg-white dark:hover:bg-[#232925] px-6 py-3.5 text-sm font-medium text-[#2E312C] dark:text-[#DDD9D0] transition-colors shadow-subtle"
              >
                <span>Sign In / Create Account</span>
              </Link>
            </div>

            {/* Reassurance Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-3 text-xs text-[#737871] dark:text-[#8E958C]">
              <span className="flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-[#888E85]" />
                <span>No Email Required for Guests</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#888E85]" />
                <span>Encrypted Local History</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-[#888E85]" />
                <span>988 Crisis Guardrails</span>
              </span>
            </div>

          </div>

          {/* Consultation Dialogue Excerpt */}
          <div className="mt-14 sm:mt-18 rounded-2xl border border-[#E3DFD5] dark:border-[#29302C] bg-white dark:bg-[#191D1B] p-6 sm:p-8 shadow-card space-y-5">
            <div className="flex items-center justify-between border-b border-[#EFECE4] dark:border-[#242A27] pb-3 text-xs text-[#8A8F87] font-sans">
              <span className="font-semibold text-[#444842] dark:text-[#C5CCC6] uppercase tracking-wider text-[11px]">
                Clinical Reflection Excerpt
              </span>
              <span>Confidential Context</span>
            </div>

            {/* Client Dialogue */}
            <div className="flex justify-end">
              <div className="rounded-2xl rounded-tr-xs bg-[#242825] dark:bg-[#282F2A] px-4 py-3 text-xs sm:text-sm text-white max-w-[85%] leading-relaxed shadow-subtle">
                I feel exhausted constantly trying to manage everyone else’s expectations at work. By the evening, I have no emotional reserves left for myself.
              </div>
            </div>

            {/* Therapist Dialogue */}
            <div className="flex justify-start">
              <div className="rounded-2xl rounded-tl-xs border border-[#E8E4DA] dark:border-[#2E3631] bg-[#FAF9F5] dark:bg-[#151817] px-4 py-4 text-xs sm:text-sm text-[#272A28] dark:text-[#E2E0D8] max-w-[90%] leading-relaxed shadow-subtle space-y-2.5">
                <p>
                  Carrying the emotional weight of everyone’s demands takes a tremendous toll over time. It makes complete sense that you feel depleted when your own boundaries are continually being placed last.
                </p>
                <p className="text-xs text-[#6A7067] dark:text-[#9AA297] italic font-serif">
                  When you notice the automatic impulse to accept another task you do not have capacity for, what is the fear or guilt that surfaces first?
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Core Methodologies Section */}
      <section className="py-16 sm:py-24 bg-[#F5F3EC] dark:bg-[#0E100F] transition-colors">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto space-y-2.5 mb-14">
            <h2 className="text-2xl sm:text-3xl font-serif font-normal text-[#1A1C20] dark:text-[#FAF8F5]">
              Core Foundations of Care
            </h2>
            <p className="text-xs sm:text-sm text-[#666B63] dark:text-[#9CA398]">
              Methodological principles calibrated to assist intentional self-reflection and nervous system regulation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {pillars.map((item) => {
              const IconComp = item.icon;
              return (
                <div
                  key={item.title}
                  className="rounded-xl border border-[#E5E0D5] dark:border-[#262C28] bg-[#FAF9F6] dark:bg-[#181C1A] p-5 sm:p-6 shadow-subtle transition-all hover:border-[#D0CABE] dark:hover:border-[#38423C] flex flex-col justify-between"
                >
                  <div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#DDD8CB] dark:border-[#2C342F] bg-white dark:bg-[#202522] text-[#2E4A35] dark:text-[#ADC2B3] mb-4">
                      <IconComp className="h-5 w-5" />
                    </div>
                    <h3 className="text-base font-semibold text-[#1F221E] dark:text-[#EDEBE4] mb-2 font-serif">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#5D635A] dark:text-[#A3AAA0] leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Gentle Closing Callout */}
      <section className="py-16 sm:py-22 border-t border-[#E8E5DC] dark:border-[#252A27] bg-[#FAF9F6] dark:bg-[#121413] text-center transition-colors">
        <div className="mx-auto max-w-2xl px-4 space-y-4">
          <h2 className="text-2xl sm:text-3xl font-serif font-normal text-[#1A1C20] dark:text-[#FAF8F5]">
            Give yourself permission to pause today.
          </h2>
          <p className="text-xs sm:text-sm text-[#61665D] dark:text-[#9DA499] max-w-lg mx-auto leading-relaxed">
            No scheduling friction, no clinical appointments, and zero judgment. Begin a reflective session in a safe, private environment.
          </p>
          <div className="pt-2">
            <button
              onClick={handleStartAnonymous}
              disabled={startingGuest}
              className="inline-flex items-center gap-2 rounded-xl bg-[#233B2B] hover:bg-[#1B2F22] dark:bg-[#EAE8E2] dark:text-[#141A16] dark:hover:bg-white px-7 py-3.5 text-sm font-medium text-white shadow-subtle transition-colors cursor-pointer"
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
