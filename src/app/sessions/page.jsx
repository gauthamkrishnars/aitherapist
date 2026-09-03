'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  BookOpen, 
  Search, 
  PlusCircle, 
  MessageSquare, 
  ArrowRight
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
        body: JSON.stringify({ title: 'Personal Reflection' }),
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
    <div className="flex-1 max-w-5xl mx-auto w-full px-3 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E7E3D8] dark:border-[#262C29] pb-4 sm:pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-normal text-[#1A1C20] dark:text-[#FAF8F5]">
            Consultation History & Notes
          </h1>
          <p className="text-xs sm:text-sm text-[#666B63] dark:text-[#9EA59B] mt-1">
            Review your past dialogues, syntheses, and actionable coping plans.
          </p>
        </div>

        <button
          onClick={handleStartNewSession}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#233B2B] hover:bg-[#1B2F22] dark:bg-[#EAE8E2] dark:text-[#141A16] dark:hover:bg-white text-white font-medium text-xs shadow-subtle transition-colors cursor-pointer shrink-0 self-start sm:self-auto"
        >
          <PlusCircle className="h-4 w-4" />
          <span>New Session</span>
        </button>
      </div>

      {/* Search & Filter Strip */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-[#8C9288]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search past notes by keyword..."
            className="w-full rounded-xl border border-[#DCD7CB] dark:border-[#2C332E] bg-white dark:bg-[#181C1A] py-2.5 pl-9 pr-3 text-base sm:text-sm text-[#1A1C20] dark:text-[#EDEBE4] placeholder:text-[#969C92] focus:border-[#38533F] focus:outline-none focus:ring-2 focus:ring-[#38533F]/15 shadow-subtle"
          />
        </div>

        <div className="flex items-center rounded-lg border border-[#DDD8CB] dark:border-[#2B322D] bg-[#EFECE3] dark:bg-[#1A1E1C] p-0.5 text-xs font-medium self-start sm:self-auto">
          <button
            onClick={() => setFilter('all')}
            className={`rounded-md px-3 py-1.5 transition-colors ${
              filter === 'all'
                ? 'bg-white dark:bg-[#252B27] text-[#1A1C20] dark:text-white font-semibold shadow-subtle'
                : 'text-[#63685F] dark:text-[#8E958C] hover:text-[#1A1C20] dark:hover:text-white'
            }`}
          >
            All ({sessions.length})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`rounded-md px-3 py-1.5 transition-colors ${
              filter === 'completed'
                ? 'bg-white dark:bg-[#252B27] text-[#1A1C20] dark:text-white font-semibold shadow-subtle'
                : 'text-[#63685F] dark:text-[#8E958C] hover:text-[#1A1C20] dark:hover:text-white'
            }`}
          >
            Completed
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`rounded-md px-3 py-1.5 transition-colors ${
              filter === 'active'
                ? 'bg-white dark:bg-[#252B27] text-[#1A1C20] dark:text-white font-semibold shadow-subtle'
                : 'text-[#63685F] dark:text-[#8E958C] hover:text-[#1A1C20] dark:hover:text-white'
            }`}
          >
            Active
          </button>
        </div>
      </div>

      {/* Content List */}
      {loading ? (
        <div className="space-y-3.5">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-28 rounded-2xl skeleton-shimmer"></div>
          ))}
        </div>
      ) : filteredSessions.length === 0 ? (
        <div className="rounded-2xl border border-[#E5E0D5] dark:border-[#262C28] bg-white dark:bg-[#181C1A] p-8 sm:p-14 text-center space-y-3 shadow-subtle">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#F4F1E9] dark:bg-[#222724] text-[#757B72]">
            <BookOpen className="h-5 w-5" />
          </div>
          <h3 className="text-base font-serif font-normal text-[#1A1C20] dark:text-[#EDEBE5]">
            {search ? 'No matching records found' : 'No consultations documented yet'}
          </h3>
          <p className="text-xs text-[#6A7067] dark:text-[#9AA297] max-w-sm mx-auto leading-relaxed">
            {search
              ? 'Try adjusting your search terms or clearing the filter.'
              : 'Begin your first reflection session with Clarity to begin documenting your insights and coping steps.'}
          </p>
          {!search && (
            <button
              onClick={handleStartNewSession}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#233B2B] hover:bg-[#1B2F22] dark:bg-[#EAE8E2] dark:text-[#141A16] text-white font-medium text-xs shadow-subtle transition-colors"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span>Begin First Session</span>
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3.5">
          {filteredSessions.map((item) => {
            const isCompleted = item.status === 'completed';
            return (
              <Link
                key={item.id}
                href={isCompleted ? `/sessions/${item.id}` : `/chat?session=${item.id}`}
                className="group block rounded-xl border border-[#E5E0D5] dark:border-[#262C28] bg-white dark:bg-[#181C1A] p-5 shadow-subtle hover:border-[#D0CABE] dark:hover:border-[#38423C] transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded border border-[#E0DCD1] dark:border-[#2E3631] bg-[#F7F5EF] dark:bg-[#1F2421] text-[#555B52] dark:text-[#9DA59B]">
                        {isCompleted ? 'Synthesized' : 'Active'}
                      </span>

                      <span className="text-xs text-[#82887F] dark:text-[#7D847B] font-mono">
                        {formatSessionDate(item.createdAt)}
                      </span>
                    </div>

                    <h2 className="text-base font-serif font-normal text-[#1A1C20] dark:text-[#FAF8F5] group-hover:text-[#2E4A35] dark:group-hover:text-[#CEDAD1] transition-colors">
                      {item.title}
                    </h2>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-start sm:self-auto text-xs font-mono text-[#7D837A] pt-1 sm:pt-0">
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-3.5 w-3.5" />
                      <span>{item._count?.messages || 0} messages</span>
                    </span>
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FAF8F5] dark:bg-[#202522] text-[#8C9289] group-hover:text-[#1A1C20] dark:group-hover:text-white transition-colors">
                      <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </div>
                </div>

                {item.summary && (
                  <p className="mt-2.5 text-xs text-[#5D635A] dark:text-[#9EA59B] line-clamp-2 leading-relaxed border-t border-[#F0ECE2] dark:border-[#252C28] pt-2.5">
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
