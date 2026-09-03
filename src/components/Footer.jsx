'use client';

import React from 'react';
import Link from 'next/link';
import { ExternalLink, Phone, ShieldAlert, Heart } from 'lucide-react';

export function Footer({ onOpenLegal, onOpenCrisis }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#070b14] transition-colors">
      
      {/* Crisis Warning Banner inside footer */}
      <div className="border-b border-slate-200/80 dark:border-slate-800/80 bg-rose-50/50 dark:bg-rose-950/20 py-3 px-4">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-rose-900 dark:text-rose-300 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-rose-600 shrink-0" />
            <span>If you are facing an urgent crisis or having thoughts of self-harm, please reach out to immediate human support.</span>
          </div>
          <button
            onClick={onOpenCrisis}
            className="inline-flex items-center gap-1 font-bold underline underline-offset-2 hover:text-rose-700 dark:hover:text-rose-200 shrink-0"
          >
            <span>Dial or Text 988</span>
            <ExternalLink className="h-3 w-3" />
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand & Purpose */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600 text-white font-mono font-bold text-xs shadow-sm">
                Ψ
              </div>
              <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
                Clarity AI Therapist
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md leading-relaxed">
              A private computational sanctuary for emotional reflection, cognitive grounding, and conversational support. Built on evidence-informed CBT and ACT communication frameworks.
            </p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 italic max-w-md">
              Notice: Clarity is not a licensed physician or clinical psychotherapist. It provides algorithmic conversational reflection and is not a substitute for clinical diagnosis or prescription care.
            </p>
          </div>

          {/* Quick Navigation */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
              Platform
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link
                  href="/chat"
                  className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  Start Therapy Session
                </Link>
              </li>
              <li>
                <Link
                  href="/sessions"
                  className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  Session History Logs
                </Link>
              </li>
              <li>
                <Link
                  href="/auth"
                  className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  Create Account / Guest
                </Link>
              </li>
              <li>
                <button
                  onClick={onOpenCrisis}
                  className="text-rose-600 dark:text-rose-400 hover:underline transition-colors"
                >
                  Emergency Helplines
                </button>
              </li>
            </ul>
          </div>

          {/* Legal and Compliance */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
              Compliance & Privacy
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button
                  onClick={() => onOpenLegal('terms')}
                  className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  Terms & Clinical Disclaimer
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegal('privacy')}
                  className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  Privacy & Data Retention
                </button>
              </li>
              <li>
                <a
                  href="https://988lifeline.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <span>988 Suicide & Crisis Lifeline</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.crisistextline.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <span>Crisis Text Line (741741)</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-slate-200 dark:border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
          <div>
            © {currentYear} Clarity AI Therapist. Private local execution.
          </div>
          <div className="flex items-center gap-1">
            <span>Designed for mindful emotional clarity.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
