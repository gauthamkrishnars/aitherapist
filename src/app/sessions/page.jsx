'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  BookOpen, 
  Search, 
  PlusCircle, 
  Calendar, 
  MessageSquare, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Loader2, 
  FileText 
} from 'lucide-react';

export function formatSessionDate(isoString) {
  if (!isoString) return '--';
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch (e) {
    return isoString.slice(0, 10);
  }
}

export default function SessionsDashboard() {
  const router = useRouter();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // 'all' | 'completed' | 'active'

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/sessions');
      if (res.ok) {
        const data = await res.json();
        setSessions(data.sessions || []);
      } else if (res.status === 401) {
        router.push('/auth');
      }
    } catch (e) {
      console.error('Fetch sessions error:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleStartNewSession = async () => {
    try {
      const res = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'New Reflection Session' }),
      });
      if (res.ok) {
        const data = await res.json();
        router.push(`/chat?session=${data.session.id}`);
      }
    } catch (e) {
      console.error('New session error:', e);
    }
  };

  const filteredSessions = sessions.filter((s) => {
    const matchesSearch =
      s.title?.toLowerCase().includes(search.toLowerCase()) ||
      s.summary?.toLowerCase().includes(search.toLowerCase());

    if (filter === 'completed') return matchesSearch && s.status === 'completed';
    if (filter === 'active') return matchesSearch && s.status === 'active';
    return matchesSearch;
  });

  return (
    <div className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Session History & Reflection Logs
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Review your past dialogues, therapeutic syntheses, and actionable coping plans.
          </p>
        </div>

        <button
          onClick={handleStartNewSession}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer shrink-0"
        >
          <PlusCircle className="h-4 w-4" />
          <span>New Session</span>
        </button>
      </div>

      {/* Search & Filter Strip */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search past logs by theme or keywords..."
            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] py-2.5 pl-9 pr-3 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-xs"
          />
        </div>

        <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 p-0.5 text-xs font-medium self-start sm:self-auto">
          <button
            onClick={() => setFilter('all')}
            className={`rounded-md px-3 py-1.5 transition-colors ${
              filter === 'all'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All ({sessions.length})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`rounded-md px-3 py-1.5 transition-colors ${
              filter === 'completed'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Completed
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`rounded-md px-3 py-1.5 transition-colors ${
              filter === 'active'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Active
          </button>
        </div>
      </div>

      {/* Content List */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 rounded-2xl skeleton-shimmer"></div>
          ))}
        </div>
      ) : filteredSessions.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] p-10 text-center space-y-3 shadow-xs">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400">
            <BookOpen className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {search ? 'No matching logs found' : 'No therapy sessions recorded yet'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            {search
              ? 'Try adjusting your search terms or clearing the filter.'
              : 'Start your first conversational session with Clarity to begin documenting your emotional journey.'}
          </p>
          {!search && (
            <button
              onClick={handleStartNewSession}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold text-xs shadow-xs hover:bg-emerald-700 transition-colors"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span>Begin First Session</span>
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredSessions.map((item) => {
            const isCompleted = item.status === 'completed';
            return (
              <Link
                key={item.id}
                href={isCompleted ? `/sessions/${item.id}` : `/chat?session=${item.id}`}
                className="group block rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] p-4 sm:p-5 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-sm transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1 text-[11px] font-mono font-medium px-2 py-0.5 rounded-full border ${
                        isCompleted
                          ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                          : 'border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-400'
                      }`}>
                        {isCompleted ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                        <span>{isCompleted ? 'Synthesized' : 'Active'}</span>
                      </span>

                      <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">
                        {formatSessionDate(item.createdAt)}
                      </span>
                    </div>

                    <h2 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {item.title}
                    </h2>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto text-xs font-mono text-slate-500">
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-3.5 w-3.5" />
                      <span>{item._count?.messages || 0} messages</span>
                    </span>
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white group-hover:translate-x-0.5 transition-all">
                      <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </div>
                </div>

                {item.summary && (
                  <p className="mt-2.5 text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 pt-2.5">
                    {item.summary}
                  </p>
                )}
              </Link>
            );
          })}
        </div>
      )}

    </div>
  );
}
