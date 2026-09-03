'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, User, ArrowRight, Loader2, AlertCircle, ShieldCheck } from 'lucide-react';

export default function AuthPage() {
  const router = useRouter();
  const [tab, setTab] = useState('login'); // 'login' | 'register' | 'anonymous'

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (tab === 'login') {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to sign in.');
        router.push('/chat');
        router.refresh();
      } else if (tab === 'register') {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, name }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to create account.');
        router.push('/chat');
        router.refresh();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStartAnonymous = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/auth/anonymous', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to start anonymous session.');
      router.push('/chat');
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 sm:p-8 bg-[#FAF9F6] dark:bg-[#121413] transition-colors">
      <div className="w-full max-w-md space-y-6">
        
        {/* Header Title */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-serif font-normal tracking-tight text-[#1A1C20] dark:text-[#FAF8F5]">
            Welcome to Clarity
          </h1>
          <p className="text-xs text-[#63685F] dark:text-[#9DA499]">
            Sign in to access your consultation history or start an anonymous session.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-3 rounded-xl border border-[#DDD8CB] dark:border-[#2C332E] bg-[#EFECE3] dark:bg-[#1A1E1C] p-1 text-[11px] sm:text-xs font-medium">
          <button
            onClick={() => { setTab('login'); setError(null); }}
            className={`rounded-lg py-2 transition-all ${
              tab === 'login'
                ? 'bg-white dark:bg-[#252B27] text-[#1A1C20] dark:text-white shadow-subtle font-semibold'
                : 'text-[#63685F] dark:text-[#8E958C] hover:text-[#1A1C20] dark:hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setTab('register'); setError(null); }}
            className={`rounded-lg py-2 transition-all ${
              tab === 'register'
                ? 'bg-white dark:bg-[#252B27] text-[#1A1C20] dark:text-white shadow-subtle font-semibold'
                : 'text-[#63685F] dark:text-[#8E958C] hover:text-[#1A1C20] dark:hover:text-white'
            }`}
          >
            Register
          </button>
          <button
            onClick={() => { setTab('anonymous'); setError(null); }}
            className={`rounded-lg py-2 transition-all ${
              tab === 'anonymous'
                ? 'bg-white dark:bg-[#252B27] text-[#1A1C20] dark:text-white shadow-subtle font-semibold'
                : 'text-[#63685F] dark:text-[#8E958C] hover:text-[#1A1C20] dark:hover:text-white'
            }`}
          >
            Guest Mode
          </button>
        </div>

        {/* Error Callout */}
        {error && (
          <div className="rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/80 dark:bg-rose-950/20 p-3.5 flex items-start gap-2.5 text-xs text-rose-800 dark:text-rose-300 shadow-subtle">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Card */}
        <div className="rounded-2xl border border-[#E3DFD4] dark:border-[#282F2A] bg-white dark:bg-[#181C1A] p-6 sm:p-7 shadow-card space-y-4">
          
          {tab === 'anonymous' ? (
            <div className="space-y-4 text-center py-2">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#F4F1E8] dark:bg-[#222825] text-[#34523C] dark:text-[#A8C2B0]">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-serif font-normal text-[#1A1C20] dark:text-[#FAF8F5]">
                  Start an Anonymous Session
                </h3>
                <p className="text-xs text-[#666C63] dark:text-[#9AA297] max-w-xs mx-auto leading-relaxed">
                  No email address or password required. Your consultations and coping summaries remain completely isolated to this browser.
                </p>
              </div>

              <button
                onClick={handleStartAnonymous}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#233B2B] hover:bg-[#1B2F22] dark:bg-[#EAE8E2] dark:text-[#141A16] dark:hover:bg-white py-3 text-xs font-medium text-white shadow-subtle transition-colors disabled:opacity-60 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-white dark:text-[#141A16]" />
                    <span>Connecting Guest Session...</span>
                  </>
                ) : (
                  <>
                    <span>Enter as Anonymous Guest</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              
              {tab === 'register' && (
                <div className="space-y-1">
                  <label className="text-xs font-medium text-[#4B5047] dark:text-[#B6BDB4]">
                    Preferred Name or Alias
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-[#8C9288]" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alex"
                      className="w-full rounded-xl border border-[#DCD7CB] dark:border-[#2F3631] bg-[#FAF9F6] dark:bg-[#121413] py-2.5 pl-9 pr-3 text-base sm:text-sm text-[#1A1C20] dark:text-[#EDEBE5] placeholder:text-[#969C92] focus:border-[#38533F] focus:outline-none focus:ring-2 focus:ring-[#38533F]/15"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-medium text-[#4B5047] dark:text-[#B6BDB4]">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-[#8C9288]" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-[#DCD7CB] dark:border-[#2F3631] bg-[#FAF9F6] dark:bg-[#121413] py-2.5 pl-9 pr-3 text-base sm:text-sm text-[#1A1C20] dark:text-[#EDEBE5] placeholder:text-[#969C92] focus:border-[#38533F] focus:outline-none focus:ring-2 focus:ring-[#38533F]/15"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-[#4B5047] dark:text-[#B6BDB4]">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-[#8C9288]" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full rounded-xl border border-[#DCD7CB] dark:border-[#2F3631] bg-[#FAF9F6] dark:bg-[#121413] py-2.5 pl-9 pr-3 text-base sm:text-sm text-[#1A1C20] dark:text-[#EDEBE5] placeholder:text-[#969C92] focus:border-[#38533F] focus:outline-none focus:ring-2 focus:ring-[#38533F]/15"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-[#233B2B] hover:bg-[#1B2F22] dark:bg-[#EAE8E2] dark:text-[#141A16] dark:hover:bg-white py-3 text-xs font-medium text-white shadow-subtle transition-colors disabled:opacity-60 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-white dark:text-[#141A16]" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>{tab === 'login' ? 'Sign In to Clarity' : 'Create My Account'}</span>
                )}
              </button>
            </form>
          )}

        </div>

        <p className="text-center text-xs text-[#80867D] dark:text-[#888F84]">
          Protected local session encryption.
        </p>

      </div>
    </div>
  );
}
