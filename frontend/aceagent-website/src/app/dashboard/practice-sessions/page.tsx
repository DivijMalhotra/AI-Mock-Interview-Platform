'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useDashboardCtx } from '../layout';
import {
  PlayCircle,
  Clock,
  Trophy,
  Filter,
  Plus,
  Loader2,
  ChevronRight,
  Zap,
  ArrowUpRight,
  Flame,
} from 'lucide-react';
import { startInterview } from '@/lib/api';

const CATEGORIES = ['All', 'DSA', 'System Design', 'Behavioral', 'HR', 'Python'];

const SESSIONS = [
  { title: 'Data Structures — Arrays & Hashing',  difficulty: 'Medium', duration: '32 min', score: 85, status: 'Completed', color: '#8b5cf6' },
  { title: 'System Design — URL Shortener',        difficulty: 'Hard',   duration: '45 min', score: 72, status: 'Completed', color: '#6366f1' },
  { title: 'Behavioral — Leadership Scenarios',    difficulty: 'Easy',   duration: '20 min', score: 91, status: 'Completed', color: '#22d3ee' },
  { title: 'Python — OOP Deep Dive',               difficulty: 'Medium', duration: '28 min', score: 78, status: 'Completed', color: '#ec4899' },
  { title: 'HR — Conflict Resolution',             difficulty: 'Easy',   duration: '15 min', score: 88, status: 'Completed', color: '#f59e0b' },
  { title: 'DSA — Graph Algorithms',               difficulty: 'Hard',   duration: '40 min', score: 65, status: 'Completed', color: '#8b5cf6' },
  { title: 'System Design — Chat Application',     difficulty: 'Hard',   duration: '50 min', score: null, status: 'In Progress', color: '#6366f1' },
  { title: 'Behavioral — Teamwork Assessment',     difficulty: 'Easy',   duration: '18 min', score: null, status: 'Not Started', color: '#22d3ee' },
];

const DIFF_COLOR: Record<string, string> = {
  Easy:   '#22d3ee',
  Medium: '#f59e0b',
  Hard:   '#ef4444',
};

export default function PracticeSessionsPage() {
  const { darkMode, isMobile } = useDashboardCtx();
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState('All');
  const [loading, setLoading] = useState(false);

  const text = darkMode ? '#f1f5f9' : '#0f172a';
  const sub = darkMode ? '#64748b' : '#9ca3af';
  const cardBg = darkMode ? '#0c1032' : '#fff';
  const border = darkMode ? 'rgba(124,58,237,0.12)' : 'rgba(0,0,0,0.07)';

  const handleNewSession = async () => {
    setLoading(true);
    try {
      const response = await startInterview('System Design', 'medium');
      if (response.data?.session_id) {
        router.push(`/interview/${response.data.session_id}`);
      }
    } catch (err) {
      console.error('Failed to start:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: isMobile ? 'flex-start' : 'center', justifyContent: 'space-between', marginBottom: 24, flexDirection: isMobile ? 'column' : 'row', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: isMobile ? 26 : 32, fontWeight: 800, color: text, margin: 0, letterSpacing: -0.5 }}>
            Practice Sessions
          </h1>
          <p style={{ color: sub, fontSize: 14, marginTop: 4, marginBottom: 0 }}>
            Start, resume, or review your AI-powered mock interviews.
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleNewSession}
          disabled={loading}
          suppressHydrationWarning
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '12px 24px', borderRadius: 12, border: 'none',
            background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
            color: '#fff', fontSize: 14, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
            fontFamily: 'inherit', boxShadow: '0 4px 20px rgba(124,58,237,0.4)',
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
          New Session
        </motion.button>
      </div>

      {/* Quick Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
        {[
          { icon: PlayCircle, label: 'Total Sessions', value: '24', color: '#8b5cf6' },
          { icon: Clock, label: 'Hours Practiced', value: '18.5h', color: '#22d3ee' },
          { icon: Trophy, label: 'Best Score', value: '96%', color: '#f59e0b' },
          { icon: Flame, label: 'Current Streak', value: '7 days', color: '#ec4899' },
        ].map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            style={{
              background: cardBg, border: `1px solid ${border}`, borderRadius: 16,
              padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 12,
            }}
          >
            <div style={{ width: 40, height: 40, borderRadius: 12, background: `${s.color}15`, border: `1px solid ${s.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <s.icon size={18} style={{ color: s.color }} />
            </div>
            <div>
              <div style={{ color: sub, fontSize: 11, fontWeight: 600, marginBottom: 2 }}>{s.label}</div>
              <div style={{ color: text, fontSize: 20, fontWeight: 900, fontFamily: "'Orbitron', sans-serif" }}>{s.value}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Category Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            suppressHydrationWarning
            style={{
              padding: '6px 16px', borderRadius: 99, fontSize: 12, fontWeight: 700,
              fontFamily: 'inherit', cursor: 'pointer', border: 'none',
              background: activeFilter === cat ? '#7c3aed' : darkMode ? 'rgba(124,58,237,0.08)' : 'rgba(0,0,0,0.05)',
              color: activeFilter === cat ? '#fff' : sub,
              transition: 'all 0.2s',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Sessions List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {SESSIONS.map((session, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.03 * i }}
            whileHover={{ background: darkMode ? 'rgba(124,58,237,0.06)' : 'rgba(0,0,0,0.02)' }}
            style={{
              background: cardBg, border: `1px solid ${border}`, borderRadius: 16,
              padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14,
              cursor: 'pointer', transition: 'background 0.15s',
            }}
          >
            <div style={{ width: 42, height: 42, borderRadius: 12, background: `${session.color}15`, border: `1px solid ${session.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <PlayCircle size={18} style={{ color: session.color }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: text, fontSize: 14, fontWeight: 700, marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{session.title}</div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: DIFF_COLOR[session.difficulty], background: `${DIFF_COLOR[session.difficulty]}15`, padding: '1px 8px', borderRadius: 99 }}>{session.difficulty}</span>
                <span style={{ color: sub, fontSize: 11 }}>{session.duration}</span>
              </div>
            </div>
            {session.score !== null ? (
              <div style={{ color: session.color, fontSize: 18, fontWeight: 900, fontFamily: "'Orbitron', sans-serif", flexShrink: 0 }}>{session.score}%</div>
            ) : (
              <span style={{ fontSize: 11, fontWeight: 700, color: session.status === 'In Progress' ? '#f59e0b' : sub, background: session.status === 'In Progress' ? 'rgba(245,158,11,0.1)' : darkMode ? 'rgba(124,58,237,0.08)' : 'rgba(0,0,0,0.05)', padding: '4px 12px', borderRadius: 99 }}>{session.status}</span>
            )}
            <ChevronRight size={16} style={{ color: sub, flexShrink: 0 }} />
          </motion.div>
        ))}
      </div>
    </>
  );
}
