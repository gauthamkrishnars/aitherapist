import React, { useState } from 'react';
import { Copy, Check, ArrowRight, X, FileText } from 'lucide-react';
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
      const text = `Consultation Note: ${title}\n\nClinical Synthesis:\n${summary}\n\nAction Plan:\n${copingSteps.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\n(Recorded via Clarity)`;
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
        className="fixed inset-0 bg-[#121413]/70 backdrop-blur-sm transition-opacity"
      />

      <div className="relative w-full max-w-2xl rounded-2xl border border-[#E3DFD4] dark:border-[#2C332F] bg-white dark:bg-[#181C1A] p-6 sm:p-8 shadow-elevation z-10 my-4 flex flex-col animate-in zoom-in-95 duration-200 max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#EFECE4] dark:border-[#242A27] pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#DDD8CB] dark:border-[#2F3631] bg-[#F5F2EA] dark:bg-[#202623] text-[#34523C] dark:text-[#A8C2B0]">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h2 id="summary-modal-title" className="text-lg sm:text-xl font-serif font-normal text-[#1A1C20] dark:text-[#FAF8F5]">
                Consultation Synthesis & Action Plan
              </h2>
              <p className="text-xs text-[#6B7168] dark:text-[#9AA297]">
                {title || 'Session Reflection'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close summary modal"
            className="rounded-lg p-1.5 text-[#868C83] hover:text-[#1A1C20] dark:hover:text-white hover:bg-[#F2EFE8] dark:hover:bg-[#222724] transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="mt-4 overflow-y-auto space-y-5 pr-1 text-xs sm:text-sm">
          
          {/* Summary block */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#737970] dark:text-[#9EA59B]">
              Key Insights & Cognitive Themes
            </h3>
            <div className="rounded-xl border border-[#E7E3D8] dark:border-[#272E2A] bg-[#FAF9F5] dark:bg-[#151817] p-4 leading-relaxed text-[#272A26] dark:text-[#DCD9D0]">
              {summary}
            </div>
          </div>

          {/* Coping Steps Checklist */}
          {copingSteps && copingSteps.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#737970] dark:text-[#9EA59B]">
                  Recommended Grounding Practices
                </h3>
                <span className="text-[11px] font-mono text-[#666B62] font-medium">
                  {copingSteps.length} Practices
                </span>
              </div>

              <div className="space-y-2">
                {copingSteps.map((step, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 rounded-xl border border-[#E7E3D8] dark:border-[#272E2A] bg-white dark:bg-[#1E2320] p-3.5 shadow-subtle"
                  >
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#EAE6DC] dark:bg-[#2B342F] text-[#242825] dark:text-[#D5D0C3] font-mono text-xs mt-0.5">
                      {idx + 1}
                    </div>
                    <p className="text-xs sm:text-sm text-[#272A26] dark:text-[#DCD9D0] leading-relaxed">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer actions */}
        <div className="mt-5 border-t border-[#EFECE4] dark:border-[#242A27] pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={handleCopy}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg border border-[#D5D0C3] dark:border-[#2F3631] bg-white dark:bg-[#181C1A] text-[#282C27] dark:text-[#DDD9D0] text-xs font-medium hover:bg-[#F4F1E9] dark:hover:bg-[#222724] shadow-subtle transition-colors cursor-pointer"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-[#34523C]" /> : <Copy className="h-3.5 w-3.5 text-[#858B82]" />}
            <span>{copied ? 'Copied to Clipboard' : 'Copy Summary'}</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Link
              href="/sessions"
              onClick={onClose}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1 px-3.5 py-2 rounded-lg border border-[#D5D0C3] dark:border-[#2F3631] bg-white dark:bg-[#181C1A] text-[#282C27] dark:text-[#DDD9D0] text-xs font-medium hover:bg-[#F4F1E9] dark:hover:bg-[#222724] transition-colors"
            >
              <span>View Notes</span>
              <ArrowRight className="h-3 w-3" />
            </Link>

            <button
              onClick={() => {
                onClose();
                onStartNewSession();
              }}
              className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2 rounded-lg bg-[#233B2B] hover:bg-[#1B2F22] dark:bg-[#EAE8E2] dark:text-[#141A16] dark:hover:bg-white text-white text-xs font-medium shadow-subtle transition-colors cursor-pointer"
            >
              Start Fresh Session
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
