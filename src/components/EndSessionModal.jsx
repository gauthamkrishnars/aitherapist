import React, { useState } from 'react';
import { CheckCircle2, Sparkles, Copy, Check, ArrowRight, X, HeartHandshake } from 'lucide-react';
import Link from 'next/link';

export function EndSessionModal({ 
  isOpen, 
  onClose, 
  sessionSummary, 
  onStartNewSession 
}) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !sessionSummary) return null;

  const { title, summary, copingSteps } = sessionSummary;

  const handleCopy = async () => {
    try {
      const text = `Therapy Session Summary: ${title}\n\nKey Insights:\n${summary}\n\nSuggested Coping Steps:\n${copingSteps.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\n(Generated via Clarity AI Therapist)`;
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.warn('Clipboard write error', e);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="summary-modal-title"
    >
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm transition-opacity"
      />

      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] p-5 sm:p-7 shadow-2xl z-10 my-4 flex flex-col animate-in zoom-in-95 duration-200 max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
              <HeartHandshake className="h-5 w-5" />
            </div>
            <div>
              <h2 id="summary-modal-title" className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                Session Completed & Synthesized
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {title || 'Therapeutic Reflection'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close summary modal"
            className="rounded-lg p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="mt-4 overflow-y-auto space-y-5 pr-1 text-xs sm:text-sm">
          
          {/* Summary block */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Therapeutic Synthesis
            </h3>
            <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 p-4 leading-relaxed text-slate-700 dark:text-slate-300">
              {summary}
            </div>
          </div>

          {/* Coping Steps Checklist */}
          {copingSteps && copingSteps.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Suggested Actionable Coping Steps
                </h3>
                <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-medium">
                  {copingSteps.length} Practices
                </span>
              </div>

              <div className="space-y-2">
                {copingSteps.map((step, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-3 shadow-xs"
                  >
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 mt-0.5">
                      <span className="text-[11px] font-bold">{idx + 1}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-normal">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer actions */}
        <div className="mt-5 border-t border-slate-100 dark:border-slate-800 pt-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={handleCopy}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-700 shadow-xs transition-colors"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5 text-slate-400" />}
            <span>{copied ? 'Copied to Clipboard' : 'Copy Summary & Plan'}</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Link
              href="/sessions"
              onClick={onClose}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1 px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              <span>Session Logs</span>
              <ArrowRight className="h-3 w-3" />
            </Link>

            <button
              onClick={() => {
                onClose();
                onStartNewSession();
              }}
              className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              Start New Session
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
