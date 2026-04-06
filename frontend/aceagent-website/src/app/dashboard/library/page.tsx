'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useDashboardCtx } from '../layout';
import {
  BookOpen,
  Search,
  ChevronRight,
  Star,
  Clock,
  BarChart2,
  Filter,
  Bookmark,
} from 'lucide-react';

const FILTERS = ['All', 'DSA', 'System Design', 'Behavioral', 'HR', 'Python', 'SQL'];

const LIBRARY = [
  { title: 'Arrays & Hashing Masterclass', category: 'DSA', questions: 45, avgScore: 78, difficulty: 'Medium', starred: true, color: '#8b5cf6' },
  { title: 'System Design — Scalable APIs', category: 'System Design', questions: 20, avgScore: 65, difficulty: 'Hard', starred: false, color: '#6366f1' },
  { title: 'STAR Method — Behavioral Pack', category: 'Behavioral', questions: 30, avgScore: 88, difficulty: 'Easy', starred: true, color: '#22d3ee' },
  { title: 'Python — Concurrency Deep Dive', category: 'Python', questions: 15, avgScore: null, difficulty: 'Hard', starred: false, color: '#ec4899' },
  { title: 'HR Essentials — Salary Negotiation', category: 'HR', questions: 12, avgScore: 91, difficulty: 'Easy', starred: false, color: '#f59e0b' },
  { title: 'Trees & Graphs — Advanced', category: 'DSA', questions: 35, avgScore: 72, difficulty: 'Hard', starred: true, color: '#8b5cf6' },
  { title: 'SQL — Window Functions', category: 'SQL', questions: 18, avgScore: null, difficulty: 'Medium', starred: false, color: '#22d3ee' },
  { title: 'System Design — Distributed Cache', category: 'System Design', questions: 10, avgScore: 68, difficulty: 'Hard', starred: false, color: '#6366f1' },
];

const DIFF_COLOR: Record<string, string> = {
  Easy: '#22d3ee',
  Medium: '#f59e0b',
  Hard: '#ef4444',
};

export default function LibraryPage() {
  const { darkMode, isMobile } = useDashboardCtx();
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const text = darkMode ? '#f1f5f9' : '#0f172a';
  const sub = darkMode ? '#64748b' : '#9ca3af';
  const cardBg = darkMode ? '#0c1032' : '#fff';
  const border = darkMode ? 'rgba(124,58,237,0.12)' : 'rgba(0,0,0,0.07)';

  const filtered = LIBRARY.filter(item => {
    if (activeFilter !== 'All' && item.category !== activeFilter) return false;
    if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: isMobile ? 26 : 32, fontWeight: 800, color: text, margin: 0, letterSpacing: -0.5 }}>Interview Library</h1>
        <p style={{ color: sub, fontSize: 14, marginTop: 4, marginBottom: 0 }}>Browse curated question packs across all interview domains.</p>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', maxWidth: 480, marginBottom: 20 }}>
        <Search size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: sub }} />
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search packs..."
          style={{
            width: '100%', padding: '10px 16px 10px 40px', borderRadius: 12,
            background: darkMode ? 'rgba(124,58,237,0.06)' : '#f3f4f6',
            border: `1px solid ${border}`, color: text, fontSize: 13, outline: 'none', fontFamily: 'inherit',
          }}
        />
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {FILTERS.map((cat) => (
          <button key={cat} onClick={() => setActiveFilter(cat)} suppressHydrationWarning
            style={{
              padding: '6px 16px', borderRadius: 99, fontSize: 12, fontWeight: 700,
              fontFamily: 'inherit', cursor: 'pointer', border: 'none',
              background: activeFilter === cat ? '#7c3aed' : darkMode ? 'rgba(124,58,237,0.08)' : 'rgba(0,0,0,0.05)',
              color: activeFilter === cat ? '#fff' : sub, transition: 'all 0.2s',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
        {filtered.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.03 * i }}
            whileHover={{ y: -2 }}
            style={{
              background: cardBg, border: `1px solid ${border}`, borderRadius: 18,
              padding: '22px', cursor: 'pointer', transition: 'transform 0.2s',
              position: 'relative',
            }}
          >
            {item.starred && (
              <Star size={14} style={{ position: 'absolute', top: 16, right: 16, color: '#f59e0b', fill: '#f59e0b' }} />
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: `${item.color}15`, border: `1px solid ${item.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BookOpen size={18} style={{ color: item.color }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ color: text, fontSize: 14, fontWeight: 700, lineHeight: 1.3 }}>{item.title}</div>
                <div style={{ display: 'flex', gap: 8, marginTop: 4, alignItems: 'center' }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: DIFF_COLOR[item.difficulty], background: `${DIFF_COLOR[item.difficulty]}15`, padding: '1px 8px', borderRadius: 99 }}>{item.difficulty}</span>
                  <span style={{ color: sub, fontSize: 11 }}>{item.category}</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: `1px solid ${border}`, paddingTop: 12 }}>
              <div style={{ display: 'flex', gap: 16 }}>
                <div style={{ color: sub, fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Bookmark size={10} /> {item.questions} Qs
                </div>
                {item.avgScore !== null && (
                  <div style={{ color: sub, fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <BarChart2 size={10} /> Avg: <span style={{ color: item.color, fontWeight: 700 }}>{item.avgScore}%</span>
                  </div>
                )}
              </div>
              <ChevronRight size={14} style={{ color: sub }} />
            </div>
          </motion.div>
        ))}
      </div>
    </>
  );
}
