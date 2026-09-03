'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  HeartHandshake, 
  PlusCircle, 
  BookOpen, 
  LifeBuoy, 
  LogOut, 
  User, 
  Menu, 
  X,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export function Header({ onOpenCrisis }) {
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    fetchUser();
  }, [pathname]);

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (data.authenticated) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (e) {
      setUser(null);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      router.push('/auth');
      router.refresh();
    } catch (e) {
      console.warn('Logout error', e);
    }
  };

  const handleNewSession = async () => {
    try {
      const res = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'New Reflection Session' }),
      });
      if (res.ok) {
        const data = await res.json();
        router.push(`/chat?session=${data.session.id}`);
      } else {
        router.push('/chat');
      }
    } catch (e) {
      router.push('/chat');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-[#090d16]/95 backdrop-blur-md transition-colors">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        <div className="flex h-14 sm:h-16 items-center justify-between gap-3">
          
          {/* Brand Logo */}
          <Link 
            href="/" 
            className="flex items-center gap-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-lg py-1 group shrink-0"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-600 text-white font-mono font-bold text-sm shadow-sm group-hover:bg-emerald-700 transition-colors">
              Ψ
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white font-sans">
                Clarity <span className="hidden xs:inline font-normal text-slate-500 dark:text-slate-400">Therapy</span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            <Link
              href="/chat"
              className={`rounded-md px-3 py-1.5 transition-colors ${
                pathname.startsWith('/chat')
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              Session Chat
            </Link>

            <Link
              href="/sessions"
              className={`rounded-md px-3 py-1.5 transition-colors ${
                pathname === '/sessions'
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              Session History
            </Link>

            <button
              onClick={onOpenCrisis}
              className="rounded-md px-3 py-1.5 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors font-medium flex items-center gap-1.5"
            >
              <LifeBuoy className="h-4 w-4" />
              <span>Crisis Support</span>
            </button>
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            
            {/* New Session Button */}
            {user && (
              <button
                onClick={handleNewSession}
                title="Initialize a new therapy session"
                className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-xs transition-colors"
              >
                <PlusCircle className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>New Session</span>
              </button>
            )}

            {/* Crisis Quick Button for Mobile */}
            <button
              onClick={onOpenCrisis}
              className="md:hidden flex h-8 px-2 items-center justify-center gap-1 rounded-lg border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 text-xs font-semibold"
            >
              <LifeBuoy className="h-3.5 w-3.5" />
              <span>988</span>
            </button>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* User Account / Auth Actions */}
            {user ? (
              <div className="flex items-center gap-1.5">
                <div className="hidden lg:flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-2.5 py-1 text-xs text-slate-700 dark:text-slate-300">
                  <User className="h-3.5 w-3.5 text-slate-400" />
                  <span className="font-medium truncate max-w-[110px]">{user.name}</span>
                  {user.isAnonymous && (
                    <span className="text-[10px] font-mono px-1 rounded bg-slate-200 dark:bg-slate-800 text-slate-500">
                      Guest
                    </span>
                  )}
                </div>

                <button
                  onClick={handleLogout}
                  title="Log out"
                  aria-label="Log out"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 shadow-xs transition-colors"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <Link
                href="/auth"
                className="inline-flex items-center justify-center rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 text-xs font-semibold shadow-xs transition-colors"
              >
                Sign In
              </Link>
            )}

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="md:hidden flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300"
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] px-4 py-3 space-y-2 animate-in slide-in-from-top-2 duration-150">
          <div className="grid grid-cols-2 gap-2 pb-2">
            <Link
              href="/chat"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center py-2 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200"
            >
              Session Chat
            </Link>

            <Link
              href="/sessions"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center py-2 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200"
            >
              Session History
            </Link>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenCrisis();
              }}
              className="text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-1 py-1"
            >
              <LifeBuoy className="h-3.5 w-3.5" />
              <span>Emergency 988 Lifeline</span>
            </button>

            {user ? (
              <span className="text-slate-400 text-xs">
                {user.name} ({user.isAnonymous ? 'Guest' : 'Member'})
              </span>
            ) : (
              <Link
                href="/auth"
                onClick={() => setMobileMenuOpen(false)}
                className="text-emerald-600 font-semibold"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
