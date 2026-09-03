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
        className="fixed inset-0 bg-[#121413]/70 backdrop-blur-sm transition-opacity"
      />

      <div className="relative w-full max-w-2xl rounded-2xl border border-[#E3DFD4] dark:border-[#2C332F] bg-white dark:bg-[#181C1A] p-6 sm:p-8 shadow-elevation z-10 my-4 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#EFECE4] dark:border-[#242A27] pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#DDD8CB] dark:border-[#2E3530] bg-[#F5F2EA] dark:bg-[#202522] text-[#34523C] dark:text-[#ADC2B3]">
              {isTerms ? <FileText className="h-4 w-4" /> : <Shield className="h-4 w-4" />}
            </div>
            <div>
              <h2 id="legal-modal-title" className="text-lg sm:text-xl font-serif font-normal text-[#1A1C20] dark:text-[#FAF8F5]">
                {isTerms ? 'Terms of Service & Clinical Disclaimer' : 'Privacy & Data Security Policy'}
              </h2>
              <p className="text-xs text-[#737970] dark:text-[#9AA297]">
                Effective: September 2026 • Version 2.2
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-lg p-1.5 text-[#868C83] hover:text-[#1A1C20] dark:hover:text-white hover:bg-[#F2EFE8] dark:hover:bg-[#222724] transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Clinical Warning Callout */}
        <div className="mt-4 p-4 rounded-xl border border-amber-200 dark:border-amber-950/60 bg-amber-50/70 dark:bg-amber-950/20 text-xs text-amber-950 dark:text-amber-200 flex items-start gap-2.5 shadow-subtle">
          <AlertOctagon className="h-4 w-4 shrink-0 text-amber-700 dark:text-amber-400 mt-0.5" />
          <p className="leading-relaxed">
            <strong>CRITICAL NOTICE:</strong> Clarity is an automated computational reflective tool. It is <strong>NOT</strong> a licensed clinical psychologist, physician, or emergency crisis dispatch service. If you are experiencing suicidal thoughts, self-harm impulses, or medical emergencies, contact 988 or 911 immediately.
          </p>
        </div>

        {/* Scrollable Legal Sections */}
        <div className="mt-4 overflow-y-auto pr-1 space-y-4 text-xs sm:text-sm text-[#464A44] dark:text-[#CCD1CB] leading-relaxed">
          {isTerms ? (
            <>
              <section className="space-y-1">
                <h3 className="font-serif font-medium text-[#1A1C20] dark:text-[#FAF8F5] text-sm">1. Nature of the Service</h3>
                <p>
                  Clarity provides reflective conversation using computational natural language modeling. The service does not establish a formal doctor-patient or psychotherapist-client relationship. Nothing in this application constitutes medical diagnosis, psychiatric evaluation, or clinical prescription.
                </p>
              </section>

              <section className="space-y-1">
                <h3 className="font-serif font-medium text-[#1A1C20] dark:text-[#FAF8F5] text-sm">2. Emergency Protocols & Crisis Waiver</h3>
                <p>
                  You agree that you will not rely on Clarity in emergency situations involving imminent harm to yourself or others. The application includes automated safety risk monitoring; however, algorithmic tools cannot replace human crisis intervention. In any acute distress, you agree to contact emergency services or call/text 988.
                </p>
              </section>

              <section className="space-y-1">
                <h3 className="font-serif font-medium text-[#1A1C20] dark:text-[#FAF8F5] text-sm">3. Anonymous Sessions & Accounts</h3>
                <p>
                  You may utilize Clarity anonymously or via a registered account. Anonymous sessions are tied to your current local browser instance. You are responsible for safeguarding any credentials you establish.
                </p>
              </section>

              <section className="space-y-1">
                <h3 className="font-serif font-medium text-[#1A1C20] dark:text-[#FAF8F5] text-sm">4. Limitation of Liability</h3>
                <p>
                  To the maximum extent permitted by applicable law, Clarity, its creators, and affiliates disclaim all warranties and shall not be held liable for decisions or reflections arising from conversational outputs.
                </p>
              </section>
            </>
          ) : (
            <>
              <section className="space-y-1">
                <h3 className="font-serif font-medium text-[#1A1C20] dark:text-[#FAF8F5] text-sm">1. Data Storage & Local Confidentiality</h3>
                <p>
                  We treat emotional reflections with strict confidentiality. Session transcripts and personalized coping plans are stored in an encrypted database. We do not sell or broker your personal disclosures.
                </p>
              </section>

              <section className="space-y-1">
                <h3 className="font-serif font-medium text-[#1A1C20] dark:text-[#FAF8F5] text-sm">2. Anonymous Guest Protection</h3>
                <p>
                  When selecting an anonymous guest session, no personally identifiable email address or real name is collected. Your session history is isolated to your current device.
                </p>
              </section>

              <section className="space-y-1">
                <h3 className="font-serif font-medium text-[#1A1C20] dark:text-[#FAF8F5] text-sm">3. Model Transmission</h3>
                <p>
                  Conversational messages sent to the reasoning engine are processed strictly to generate compassionate responses and end of session recaps, under zero retention agreements.
                </p>
              </section>

              <section className="space-y-1">
                <h3 className="font-serif font-medium text-[#1A1C20] dark:text-[#FAF8F5] text-sm">4. Data Deletion</h3>
                <p>
                  You retain the right to clear your session history or delete your registered profile at any time.
                </p>
              </section>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="mt-5 border-t border-[#EFECE4] dark:border-[#242A27] pt-4 flex items-center justify-between">
          <span className="text-xs text-[#737970] dark:text-[#8E958C]">
            GDPR & Health Data Aligned Standards
          </span>

          <button
            onClick={onClose}
            className="rounded-lg bg-[#233B2B] hover:bg-[#1B2F22] dark:bg-[#EAE8E2] dark:text-[#141A16] px-4 py-1.5 text-xs font-medium text-white shadow-subtle transition-colors cursor-pointer"
          >
            I Understand
          </button>
        </div>

      </div>
    </div>
  );
}
