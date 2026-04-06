'use client';

import { motion } from 'framer-motion';
import { useDashboardCtx } from '../layout';
import {
  TrendingUp,
  TrendingDown,
  BarChart2,
  Target,
  BrainCircuit,
  Clock,
  Zap,
  Award,
} from 'lucide-react';

const SKILLS = [
  { name: 'Data Structures',  score: 82, trend: 'up',   change: '+5',  color: '#8b5cf6' },
  { name: 'System Design',    score: 74, trend: 'up',   change: '+12', color: '#6366f1' },
  { name: 'Behavioral',       score: 91, trend: 'up',   change: '+3',  color: '#22d3ee' },
  { name: 'Problem Solving',  score: 78, trend: 'down', change: '-2',  color: '#ec4899' },
  { name: 'Communication',    score: 88, trend: 'up',   change: '+7',  color: '#f59e0b' },
  { name: 'Python Proficiency',score: 85, trend: 'up',  change: '+4',  color: '#8b5cf6' },
];

const WEEKLY_DATA = [
  { week: 'W1', score: 68 },
  { week: 'W2', score: 72 },
  { week: 'W3', score: 71 },
  { week: 'W4', score: 78 },
  { week: 'W5', score: 82 },
  { week: 'W6', score: 80 },
  { week: 'W7', score: 85 },
  { week: 'W8', score: 84 },
];

export default function PerformancePage() {
  const { darkMode, isMobile } = useDashboardCtx();

  const text = darkMode ? '#f1f5f9' : '#0f172a';
  const sub = darkMode ? '#64748b' : '#9ca3af';
  const cardBg = darkMode ? '#0c1032' : '#fff';
  const border = darkMode ? 'rgba(124,58,237,0.12)' : 'rgba(0,0,0,0.07)';
  const maxScore = Math.max(...WEEKLY_DATA.map(d => d.score));

  return (
    <>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: isMobile ? 26 : 32, fontWeight: 800, color: text, margin: 0, letterSpacing: -0.5 }}>Performance Insights</h1>
        <p style={{ color: sub, fontSize: 14, marginTop: 4, marginBottom: 0 }}>Deep-dive into your strengths, weaknesses, and progress over time.</p>
      </div>

      {/* Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
        {[
          { icon: Target, label: 'Avg Score', value: '82%', color: '#8b5cf6' },
          { icon: BrainCircuit, label: 'AI Feedback Rating', value: 'A-', color: '#22d3ee' },
          { icon: Clock, label: 'Avg Session Time', value: '28m', color: '#f59e0b' },
          { icon: Award, label: 'Top Percentile', value: 'Top 15%', color: '#ec4899' },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: 16, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 12 }}
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

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 20 }}>
        {/* Progress Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: 18, padding: '24px' }}
        >
          <div style={{ color: text, fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Weekly Progress</div>
          <div style={{ color: sub, fontSize: 12, marginBottom: 24 }}>Performance score trend over 8 weeks</div>

          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 160 }}>
            {WEEKLY_DATA.map((d, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#8b5cf6' }}>{d.score}</span>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(d.score / 100) * 120}px` }}
                  transition={{ duration: 0.6, delay: i * 0.06 }}
                  style={{
                    width: '100%', borderRadius: '8px 8px 0 0',
                    background: i === WEEKLY_DATA.length - 1 ? 'linear-gradient(180deg, #7c3aed, #4c1d95)' : darkMode ? 'rgba(124,58,237,0.2)' : 'rgba(124,58,237,0.12)',
                  }}
                />
                <span style={{ fontSize: 10, color: sub, fontWeight: 600 }}>{d.week}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Skill Breakdown */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: 18, padding: '24px' }}
        >
          <div style={{ color: text, fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Skill Breakdown</div>
          <div style={{ color: sub, fontSize: 12, marginBottom: 20 }}>Performance by category</div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {SKILLS.map((skill, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ color: text, fontSize: 13, fontWeight: 600 }}>{skill.name}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ color: skill.color, fontSize: 13, fontWeight: 800 }}>{skill.score}%</span>
                    <span style={{
                      fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 2,
                      color: skill.trend === 'up' ? '#22c55e' : '#ef4444',
                    }}>
                      {skill.trend === 'up' ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                      {skill.change}
                    </span>
                  </div>
                </div>
                <div style={{ height: 6, background: darkMode ? 'rgba(124,58,237,0.08)' : 'rgba(0,0,0,0.06)', borderRadius: 99, overflow: 'hidden' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.score}%` }}
                    transition={{ duration: 0.8, delay: 0.05 * i + 0.3 }}
                    style={{ height: '100%', background: skill.color, borderRadius: 99 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </>
  );
}
