'use client';

import React from 'react';
import Link from 'next/link';
import { ExternalLink, ShieldAlert } from 'lucide-react';

export function Footer({ onOpenLegal, onOpenCrisis }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#070b14] transition-colors">
      
      {/* Crisis Warning Banner */}
      <div className="border-b border-slate-200/80 dark:border-slate-800/80 bg-rose-50/50 dark:bg-rose-950/20 py-3 px-3 sm:px-4">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-rose-900 dark:text-rose-300 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-rose-600 shrink-0" />
            <span className="leading-snug">If you are facing an urgent crisis or having thoughts of self-harm, connect with immediate human support.</span>
          </div>
          <button
            onClick={onOpenCrisis}
            className="inline-flex items-center gap-1 font-semibold underline underline-offset-2 hover:text-rose-700 dark:hover:text-rose-200 shrink-0 cursor-pointer"
          >
            <span>Dial or Text 988</span>
            <ExternalLink className="h-3 w-3" />
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-8">
          
          {/* Brand & Purpose (Wordmark only) */}
          <div className="sm:col-span-2 space-y-2.5">
            <div className="flex items-center gap-1.5">
              <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
                Clarity
              </span>
              <span className="text-xs font-mono text-slate-400 font-normal">
                / Consult
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md leading-relaxed">
              A private digital environment for structured emotional reflection, cognitive grounding, and non-judgmental conversational support. Built on evidence-informed CBT and ACT principles.
            </p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 italic max-w-md leading-normal">
              Notice: Clarity is not a licensed physician or psychiatric clinic. It provides automated conversational reflection and is not a substitute for clinical diagnosis, emergency medical dispatch, or psychiatric medication.
            </p>
          </div>

          {/* Quick Navigation */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
              Platform
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link
                  href="/chat"
                  className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  Start Consultation
                </Link>
              </li>
              <li>
                <Link
                  href="/sessions"
                  className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  Session History
                </Link>
              </li>
              <li>
                <Link
                  href="/auth"
                  className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  Account / Guest Access
                </Link>
              </li>
              <li>
                <button
                  onClick={onOpenCrisis}
                  className="text-rose-600 dark:text-rose-400 hover:underline transition-colors cursor-pointer"
                >
                  Emergency Helplines (988)
                </button>
              </li>
            </ul>
          </div>

          {/* Legal and Compliance */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
              Policies & Care
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button
                  onClick={() => onOpenLegal('terms')}
                  className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                >
                  Terms & Clinical Disclaimer
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegal('privacy')}
                  className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                >
                  Privacy & Data Security
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

        <div className="border-t border-slate-200 dark:border-slate-800/80 pt-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400 text-center sm:text-left">
          <div>
            © {currentYear} Clarity. All rights reserved.
          </div>
          <div>
            Designed for mindful emotional clarity.
          </div>
        </div>
      </div>
    </footer>
  );
}
