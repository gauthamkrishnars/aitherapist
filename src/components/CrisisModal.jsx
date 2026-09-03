import React, { useEffect } from 'react';
import { AlertTriangle, Phone, MessageSquare, ExternalLink, X, ShieldAlert, Heart } from 'lucide-react';
import { CRISIS_RESOURCES } from '@/lib/safety';

export function CrisisModal({ isOpen, onClose }) {
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="crisis-modal-title"
    >
      {/* Heavy attention backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
      />

      <div className="relative w-full max-w-xl rounded-2xl border-2 border-rose-500/80 bg-white dark:bg-[#0f172a] p-5 sm:p-7 shadow-2xl z-10 my-4 flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Header with emergency beacon */}
        <div className="flex items-start justify-between gap-3 border-b border-rose-100 dark:border-rose-950/60 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500 text-white shadow-md">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <h2 id="crisis-modal-title" className="text-lg sm:text-xl font-bold text-rose-950 dark:text-rose-200">
                You Are Not Alone. Help Is Here Right Now.
              </h2>
              <p className="text-xs text-rose-700 dark:text-rose-400 mt-0.5">
                Immediate, free, and confidential support is available 24/7.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close crisis dialog"
            className="rounded-lg p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Compassionate message */}
        <div className="mt-4 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 text-xs sm:text-sm text-rose-900 dark:text-rose-200 leading-relaxed">
          <p>
            If you are feeling overwhelmed, having thoughts of harming yourself, or in physical danger, please connect with a live counselor right away. People who care want to support you through this painful moment.
          </p>
        </div>

        {/* Emergency Resources Directory */}
        <div className="mt-4 space-y-2.5 overflow-y-auto max-h-[50vh] pr-1">
          {CRISIS_RESOURCES.map((res) => (
            <div
              key={res.name}
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-3 sm:p-4 transition-colors hover:border-rose-300 dark:hover:border-rose-800"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>{res.name}</span>
                    <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {res.country}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                    {res.details}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 shrink-0 pt-1.5 sm:pt-0">
                  {res.contact.includes('988') && (
                    <a
                      href="tel:988"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-bold shadow-xs hover:bg-rose-700 transition-colors"
                    >
                      <Phone className="h-3.5 w-3.5" />
                      <span>Call / Text 988</span>
                    </a>
                  )}

                  {res.contact.includes('741741') && (
                    <a
                      href="sms:741741?body=HOME"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold shadow-xs hover:opacity-90 transition-opacity"
                    >
                      <MessageSquare className="h-3.5 w-3.5" />
                      <span>Text 741741</span>
                    </a>
                  )}

                  {res.url && !res.contact.includes('988') && !res.contact.includes('741741') && (
                    <a
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                    >
                      <span>Connect</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-5 border-t border-slate-100 dark:border-slate-800 pt-3.5 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1">
            <Heart className="h-3.5 w-3.5 text-rose-500" />
            <span>You matter. Please take this step.</span>
          </span>

          <button
            onClick={onClose}
            className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            I am safe now
          </button>
        </div>

      </div>
    </div>
  );
}
