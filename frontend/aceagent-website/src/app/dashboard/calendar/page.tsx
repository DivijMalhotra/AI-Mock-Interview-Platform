'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useDashboardCtx } from '../layout';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, Video, BookOpen } from 'lucide-react';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const EVENTS: Record<number, { title: string; time: string; type: string; color: string }[]> = {
  8:  [{ title: 'System Design Mock', time: '10:00 AM', type: 'Interview', color: '#8b5cf6' }],
  12: [{ title: 'DSA Practice — Graphs', time: '2:00 PM', type: 'Practice', color: '#22d3ee' }],
  15: [{ title: 'Behavioral Review', time: '11:30 AM', type: 'Review', color: '#f59e0b' }],
  18: [{ title: 'Python Deep Dive', time: '3:00 PM', type: 'Practice', color: '#6366f1' }],
  22: [{ title: 'Full Mock — Google L5', time: '9:00 AM', type: 'Interview', color: '#ec4899' }],
  25: [{ title: 'HR Communication', time: '4:30 PM', type: 'Practice', color: '#22d3ee' }],
  28: [{ title: 'System Design — Uber', time: '10:00 AM', type: 'Interview', color: '#8b5cf6' }],
};

export default function CalendarPage() {
  const { darkMode, isMobile } = useDashboardCtx();
  const [currentMonth] = useState(new Date().getMonth());
  const [currentYear] = useState(new Date().getFullYear());
  const today = new Date().getDate();

  const text = darkMode ? '#f1f5f9' : '#0f172a';
  const sub = darkMode ? '#64748b' : '#9ca3af';
  const cardBg = darkMode ? '#0c1032' : '#fff';
  const border = darkMode ? 'rgba(124,58,237,0.12)' : 'rgba(0,0,0,0.07)';

  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: isMobile ? 26 : 32, fontWeight: 800, color: text, margin: 0, letterSpacing: -0.5 }}>Calendar</h1>
        <p style={{ color: sub, fontSize: 14, marginTop: 4, marginBottom: 0 }}>Schedule and track your interview prep sessions.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 320px', gap: 20 }}>
        {/* Calendar Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: 18, padding: '24px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <button suppressHydrationWarning style={{ background: 'none', border: `1px solid ${border}`, borderRadius: 10, padding: 8, cursor: 'pointer', color: sub, display: 'flex' }}><ChevronLeft size={16} /></button>
            <span style={{ color: text, fontSize: 18, fontWeight: 800 }}>{MONTHS[currentMonth]} {currentYear}</span>
            <button suppressHydrationWarning style={{ background: 'none', border: `1px solid ${border}`, borderRadius: 10, padding: 8, cursor: 'pointer', color: sub, display: 'flex' }}><ChevronRight size={16} /></button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
            {DAYS.map((d) => (
              <div key={d} style={{ textAlign: 'center', color: sub, fontSize: 11, fontWeight: 700, padding: '8px 0', textTransform: 'uppercase', letterSpacing: 1 }}>{d}</div>
            ))}
            {cells.map((day, i) => {
              const events = day ? EVENTS[day] : undefined;
              const isToday = day === today;
              return (
                <div
                  key={i}
                  style={{
                    textAlign: 'center', padding: '10px 4px', borderRadius: 12, cursor: day ? 'pointer' : 'default',
                    background: isToday ? '#7c3aed' : 'transparent',
                    border: events ? '1px solid rgba(124,58,237,0.3)' : '1px solid transparent',
                    transition: 'background 0.15s',
                    position: 'relative',
                  }}
                >
                  <span style={{ color: isToday ? '#fff' : day ? text : 'transparent', fontSize: 13, fontWeight: isToday ? 800 : 600 }}>
                    {day || '.'}
                  </span>
                  {events && (
                    <div style={{ position: 'absolute', bottom: 3, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 2 }}>
                      {events.map((e, j) => <div key={j} style={{ width: 4, height: 4, borderRadius: '50%', background: e.color }} />)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Upcoming Events Sidebar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: 18, padding: '20px', display: 'flex', flexDirection: 'column', gap: 4 }}
        >
          <div style={{ color: text, fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Upcoming Events</div>
          {Object.entries(EVENTS)
            .filter(([day]) => Number(day) >= today)
            .slice(0, 5)
            .map(([day, events], i) =>
              events.map((event, j) => (
                <motion.div
                  key={`${i}-${j}`}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12, padding: '12px',
                    borderRadius: 12, border: `1px solid ${border}`, marginBottom: 6,
                    cursor: 'pointer', transition: 'background 0.15s',
                  }}
                >
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: `${event.color}15`, border: `1px solid ${event.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {event.type === 'Interview' ? <Video size={15} style={{ color: event.color }} /> : <BookOpen size={15} style={{ color: event.color }} />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ color: text, fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{event.title}</div>
                    <div style={{ color: sub, fontSize: 11, display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                      <Clock size={10} /> {MONTHS[currentMonth].slice(0, 3)} {day} · {event.time}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
        </motion.div>
      </div>
    </>
  );
}
