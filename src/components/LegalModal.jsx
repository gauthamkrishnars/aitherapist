import React, { useEffect } from 'react';
import { X, Shield, FileText, AlertOctagon } from 'lucide-react';

export function LegalModal({ isOpen, mode, onClose }) {
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose();
    }
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isTerms = mode === 'terms';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-modal-title"
    >
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm transition-opacity"
      />

      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] p-5 sm:p-7 shadow-2xl z-10 my-4 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
              {isTerms ? <FileText className="h-4 w-4" /> : <Shield className="h-4 w-4" />}
            </div>
            <div>
              <h2 id="legal-modal-title" className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                {isTerms ? 'Terms of Service & Clinical Disclaimer' : 'Privacy & Data Protection Policy'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Effective: September 2026 • Version 2.1
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-lg p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Prominent Clinical Warning Callout */}
        <div className="mt-4 p-3.5 rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/20 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
          <AlertOctagon className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
          <p className="leading-relaxed">
            <strong>CRITICAL MEDICAL NOTICE:</strong> Clarity AI Therapist is an experimental computational dialogue system designed for emotional reflection and cognitive wellness support. It is <strong>NOT</strong> a licensed clinical psychologist, physician, or emergency crisis service. If you are experiencing suicidal thoughts or medical emergencies, contact 988 or 911 immediately.
          </p>
        </div>

        {/* Scrollable Legal Sections */}
        <div className="mt-4 overflow-y-auto pr-1 space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {isTerms ? (
            <>
              <section className="space-y-1">
                <h3 className="font-semibold text-slate-900 dark:text-white text-sm">1. Nature of the Service</h3>
                <p>
                  Clarity AI Therapist provides generative conversational support using automated natural language algorithms. The service does not establish a formal doctor-patient or therapist-client relationship. Nothing in this application constitutes medical diagnosis, psychiatric evaluation, or clinical prescription.
                </p>
              </section>

              <section className="space-y-1">
                <h3 className="font-semibold text-slate-900 dark:text-white text-sm">2. Emergency Protocols & Crisis Waiver</h3>
                <p>
                  You agree that you will not rely on Clarity AI Therapist in emergency situations involving potential harm to yourself or others. The application includes automated crisis detection algorithms; however, technology may fail or experience delays. In any acute distress, you agree to contact licensed emergency personnel or call/text 988.
                </p>
              </section>

              <section className="space-y-1">
                <h3 className="font-semibold text-slate-900 dark:text-white text-sm">3. Anonymous Sessions and User Accounts</h3>
                <p>
                  You may use the platform anonymously or via a registered account. Anonymous sessions are tied to a temporary session identifier. You are responsible for safeguarding any account credentials you create.
                </p>
              </section>

              <section className="space-y-1">
                <h3 className="font-semibold text-slate-900 dark:text-white text-sm">4. Limitation of Liability</h3>
                <p>
                  To the maximum extent permitted by applicable law, Clarity, its creators, authors, and affiliates disclaim all warranties and shall not be liable for any direct, indirect, incidental, or consequential damages resulting from advice, summaries, or conversational outputs generated by the artificial intelligence model.
                </p>
              </section>
            </>
          ) : (
            <>
              <section className="space-y-1">
                <h3 className="font-semibold text-slate-900 dark:text-white text-sm">1. Data Storage & Privacy Safeguards</h3>
                <p>
                  We treat psychological and emotional disclosures with rigorous confidentiality. Session transcripts and personalized coping plans are stored in an encrypted local database (SQLite/Prisma). We do not sell your personal reflections or chat logs to marketing brokers.
                </p>
              </section>

              <section className="space-y-1">
                <h3 className="font-semibold text-slate-900 dark:text-white text-sm">2. Anonymous Guest Protection</h3>
                <p>
                  When utilizing the "Anonymous Session" option, no personally identifiable email addresses or real names are collected. Your session history is isolated to your current device and can be removed at your discretion.
                </p>
              </section>

              <section className="space-y-1">
                <h3 className="font-semibold text-slate-900 dark:text-white text-sm">3. Language Model Transmission</h3>
                <p>
                  Conversational messages sent to the AI engine are processed strictly to generate empathetic responses and end of session recaps. Prompts sent to external inference endpoints adhere to zero data retention and no model training policies.
                </p>
              </section>

              <section className="space-y-1">
                <h3 className="font-semibold text-slate-900 dark:text-white text-sm">4. User Rights and Deletion</h3>
                <p>
                  You retain the right to clear your session history or delete your registered profile at any time via your session dashboard.
                </p>
              </section>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="mt-5 border-t border-slate-100 dark:border-slate-800 pt-3.5 flex items-center justify-between">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            GDPR & CCPA Aligned Standards
          </span>

          <button
            onClick={onClose}
            className="rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 active:scale-95 transition-colors shadow-xs"
          >
            I Understand
          </button>
        </div>

      </div>
    </div>
  );
}
