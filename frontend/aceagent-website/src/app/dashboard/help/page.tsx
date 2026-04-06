'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useDashboardCtx } from '../layout';
import {
  HelpCircle,
  Search,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  BookOpen,
  Video,
  Mail,
  ExternalLink,
  Zap,
} from 'lucide-react';

const FAQ = [
  { q: 'How does the AI evaluate my interview?', a: 'Our AI uses a multi-modal approach — analyzing your video feed for eye contact, posture, and expressions, while simultaneously processing your verbal responses for content quality, structure, and articulation. The combined evaluation produces scores across Communication, Technical Depth, Confidence, and Problem Solving.' },
  { q: 'Can I retake an interview session?', a: 'Yes! You can start a new session with the same parameters anytime from the Practice Sessions page. Previous scores are retained for comparison. The AI will also adapt its questions based on areas that need improvement.' },
  { q: 'How accurate is the Suspicious Track Monitor?', a: 'The integrity monitor uses computer vision to track gaze direction, face presence, and audio anomalies. It has been trained on 100K+ session samples and achieves 95%+ accuracy for tab-switching and off-screen reading detection.' },
  { q: 'What interview types are supported?', a: 'We currently support DSA (Data Structures & Algorithms), System Design, Behavioral/Leadership, HR Communication, Python Deep Dive, and SQL query interviews. More domains are being added regularly.' },
  { q: 'Is my session data private?', a: 'Absolutely. All session recordings and evaluations are encrypted (AES-256) and stored in your private workspace. You can delete any session data at any time from Settings → Privacy & Security. We never share individual session data.' },
  { q: 'How do I improve my Readiness Score?', a: 'Your Readiness Score is a weighted composite of your recent session performance, consistency (streak), skill coverage, and improvement velocity. Practice regularly across all categories, focus on weak areas identified in AI Feedback, and maintain a steady daily practice streak.' },
];

export default function HelpPage() {
  const { darkMode, isMobile } = useDashboardCtx();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState('');

  const text = darkMode ? '#f1f5f9' : '#0f172a';
  const sub = darkMode ? '#64748b' : '#9ca3af';
  const cardBg = darkMode ? '#0c1032' : '#fff';
  const border = darkMode ? 'rgba(124,58,237,0.12)' : 'rgba(0,0,0,0.07)';

  const filtered = FAQ.filter(f => {
    if (!searchQuery) return true;
    return f.q.toLowerCase().includes(searchQuery.toLowerCase()) || f.a.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: isMobile ? 26 : 32, fontWeight: 800, color: text, margin: 0, letterSpacing: -0.5 }}>Help Center</h1>
        <p style={{ color: sub, fontSize: 14, marginTop: 4, marginBottom: 0 }}>Find answers, guides, and support for AceAgent.</p>
      </div>

      {/* Quick Links */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 14, marginBottom: 28 }}>
        {[
          { icon: BookOpen, label: 'Documentation', desc: 'Read the full guide to using AceAgent.', color: '#8b5cf6' },
          { icon: Video, label: 'Video Tutorials', desc: 'Watch step-by-step walkthroughs.', color: '#22d3ee' },
          { icon: MessageCircle, label: 'Contact Support', desc: 'Reach out to our team for help.', color: '#ec4899' },
        ].map((link, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            whileHover={{ y: -2 }}
            style={{
              background: cardBg, border: `1px solid ${border}`, borderRadius: 18,
              padding: '22px', cursor: 'pointer', transition: 'transform 0.2s',
            }}
          >
            <div style={{ width: 42, height: 42, borderRadius: 12, background: `${link.color}15`, border: `1px solid ${link.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
              <link.icon size={20} style={{ color: link.color }} />
            </div>
            <div style={{ color: text, fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{link.label}</div>
            <div style={{ color: sub, fontSize: 12, marginBottom: 12 }}>{link.desc}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#7c3aed', fontSize: 12, fontWeight: 700 }}>
              Learn More <ExternalLink size={11} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* FAQ */}
      <div style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: 18, padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ color: text, fontSize: 16, fontWeight: 800 }}>Frequently Asked Questions</div>
        </div>

        <div style={{ position: 'relative', marginBottom: 20 }}>
          <Search size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: sub }} />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search FAQs..."
            style={{
              width: '100%', padding: '10px 16px 10px 40px', borderRadius: 12,
              background: darkMode ? 'rgba(124,58,237,0.06)' : '#f3f4f6',
              border: `1px solid ${border}`, color: text, fontSize: 13, outline: 'none', fontFamily: 'inherit',
            }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {filtered.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.03 * i }}
              style={{
                borderRadius: 14, border: `1px solid ${border}`,
                overflow: 'hidden', transition: 'all 0.2s',
              }}
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                suppressHydrationWarning
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '14px 18px', background: 'transparent', border: 'none',
                  cursor: 'pointer', color: text, fontSize: 13, fontWeight: 700,
                  fontFamily: 'inherit', textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <HelpCircle size={15} style={{ color: '#7c3aed', flexShrink: 0 }} />
                  {faq.q}
                </div>
                {openFaq === i ? <ChevronUp size={16} style={{ color: sub, flexShrink: 0 }} /> : <ChevronDown size={16} style={{ color: sub, flexShrink: 0 }} />}
              </button>
              {openFaq === i && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  style={{
                    padding: '0 18px 16px 43px',
                    color: sub, fontSize: 12.5, lineHeight: 1.7,
                  }}
                >
                  {faq.a}
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
}
