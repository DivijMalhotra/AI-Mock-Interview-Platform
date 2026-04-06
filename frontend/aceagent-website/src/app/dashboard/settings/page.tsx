'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useDashboardCtx } from '../layout';
import {
  User,
  Bell,
  Shield,
  Palette,
  Volume2,
  Globe,
  ChevronRight,
  Camera,
  Mail,
  Key,
  Smartphone,
  Monitor,
} from 'lucide-react';

interface SettingToggleProps {
  label: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
  darkMode: boolean;
}

function SettingToggle({ label, description, enabled, onToggle, darkMode }: SettingToggleProps) {
  const text = darkMode ? '#f1f5f9' : '#0f172a';
  const sub = darkMode ? '#64748b' : '#9ca3af';
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0' }}>
      <div>
        <div style={{ color: text, fontSize: 13, fontWeight: 700, marginBottom: 2 }}>{label}</div>
        <div style={{ color: sub, fontSize: 11.5 }}>{description}</div>
      </div>
      <button
        onClick={onToggle}
        suppressHydrationWarning
        style={{
          width: 44, height: 24, borderRadius: 99, border: 'none', cursor: 'pointer',
          background: enabled ? '#7c3aed' : darkMode ? 'rgba(124,58,237,0.15)' : 'rgba(0,0,0,0.1)',
          position: 'relative', transition: 'background 0.2s', flexShrink: 0,
        }}
      >
        <motion.div
          animate={{ x: enabled ? 20 : 0 }}
          style={{
            width: 20, height: 20, borderRadius: '50%', background: '#fff',
            position: 'absolute', top: 2, left: 2,
            boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
          }}
        />
      </button>
    </div>
  );
}

const SECTIONS = [
  { icon: User, label: 'Profile', id: 'profile' },
  { icon: Bell, label: 'Notifications', id: 'notifications' },
  { icon: Shield, label: 'Privacy & Security', id: 'privacy' },
  { icon: Palette, label: 'Appearance', id: 'appearance' },
  { icon: Volume2, label: 'Audio & Video', id: 'audio' },
  { icon: Globe, label: 'Language', id: 'language' },
];

export default function SettingsPage() {
  const { darkMode, isMobile } = useDashboardCtx();
  const [activeSection, setActiveSection] = useState('profile');
  const [toggles, setToggles] = useState({
    emailNotif: true, pushNotif: false, weeklyReport: true,
    twoFA: true, sessionRecording: false, dataSharing: false,
    darkMode: true, compactMode: false,
    noiseCancellation: true, autoCamera: true,
  });

  const text = darkMode ? '#f1f5f9' : '#0f172a';
  const sub = darkMode ? '#64748b' : '#9ca3af';
  const cardBg = darkMode ? '#0c1032' : '#fff';
  const border = darkMode ? 'rgba(124,58,237,0.12)' : 'rgba(0,0,0,0.07)';

  const toggle = (key: keyof typeof toggles) =>
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: isMobile ? 26 : 32, fontWeight: 800, color: text, margin: 0, letterSpacing: -0.5 }}>Settings</h1>
        <p style={{ color: sub, fontSize: 14, marginTop: 4, marginBottom: 0 }}>Manage your account preferences and configuration.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '220px 1fr', gap: 20 }}>
        {/* Sidebar Nav */}
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
          style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: 18, padding: '12px', display: 'flex', flexDirection: isMobile ? 'row' : 'column', gap: 2, flexWrap: isMobile ? 'wrap' : 'nowrap' }}
        >
          {SECTIONS.map((s) => (
            <button key={s.id} onClick={() => setActiveSection(s.id)} suppressHydrationWarning
              style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 12,
                border: 'none', cursor: 'pointer', fontFamily: 'inherit', width: isMobile ? 'auto' : '100%',
                background: activeSection === s.id ? (darkMode ? 'rgba(124,58,237,0.15)' : 'rgba(124,58,237,0.08)') : 'transparent',
                borderLeft: !isMobile && activeSection === s.id ? '3px solid #7c3aed' : '3px solid transparent',
                color: activeSection === s.id ? text : sub, fontSize: 13, fontWeight: activeSection === s.id ? 700 : 500,
                transition: 'all 0.2s',
              }}
            >
              <s.icon size={16} /> {s.label}
            </button>
          ))}
        </motion.div>

        {/* Content */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={activeSection}
          style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: 18, padding: '24px' }}
        >
          {activeSection === 'profile' && (
            <>
              <div style={{ color: text, fontSize: 16, fontWeight: 800, marginBottom: 20 }}>Profile Settings</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg, #8b5cf6, #6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 22, fontWeight: 800, position: 'relative' }}>
                  D
                  <div style={{ position: 'absolute', bottom: -2, right: -2, width: 24, height: 24, borderRadius: '50%', background: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `2px solid ${cardBg}` }}>
                    <Camera size={10} style={{ color: '#fff' }} />
                  </div>
                </div>
                <div>
                  <div style={{ color: text, fontSize: 16, fontWeight: 700 }}>Divij Malhotra</div>
                  <div style={{ color: sub, fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}><Mail size={10} /> divijmalhotra0112@gmail.com</div>
                </div>
              </div>
              {[
                { label: 'Full Name', value: 'Divij Malhotra' },
                { label: 'Email', value: 'divijmalhotra0112@gmail.com' },
                { label: 'Phone', value: '+91 •••••• 7890' },
                { label: 'Role', value: 'Software Engineer' },
              ].map((field, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: `1px solid ${border}` }}>
                  <span style={{ color: sub, fontSize: 12, fontWeight: 600 }}>{field.label}</span>
                  <span style={{ color: text, fontSize: 13, fontWeight: 600 }}>{field.value}</span>
                </div>
              ))}
            </>
          )}

          {activeSection === 'notifications' && (
            <>
              <div style={{ color: text, fontSize: 16, fontWeight: 800, marginBottom: 8 }}>Notification Preferences</div>
              <SettingToggle label="Email Notifications" description="Receive session reminders and results via email" enabled={toggles.emailNotif} onToggle={() => toggle('emailNotif')} darkMode={darkMode} />
              <div style={{ borderTop: `1px solid ${border}` }} />
              <SettingToggle label="Push Notifications" description="Browser push alerts for upcoming interviews" enabled={toggles.pushNotif} onToggle={() => toggle('pushNotif')} darkMode={darkMode} />
              <div style={{ borderTop: `1px solid ${border}` }} />
              <SettingToggle label="Weekly Progress Report" description="AI-generated weekly summary of your performance" enabled={toggles.weeklyReport} onToggle={() => toggle('weeklyReport')} darkMode={darkMode} />
            </>
          )}

          {activeSection === 'privacy' && (
            <>
              <div style={{ color: text, fontSize: 16, fontWeight: 800, marginBottom: 8 }}>Privacy & Security</div>
              <SettingToggle label="Two-Factor Authentication" description="Add an extra layer of security to your account" enabled={toggles.twoFA} onToggle={() => toggle('twoFA')} darkMode={darkMode} />
              <div style={{ borderTop: `1px solid ${border}` }} />
              <SettingToggle label="Session Recording" description="Allow AI to record and analyze interview sessions" enabled={toggles.sessionRecording} onToggle={() => toggle('sessionRecording')} darkMode={darkMode} />
              <div style={{ borderTop: `1px solid ${border}` }} />
              <SettingToggle label="Anonymous Data Sharing" description="Share anonymized usage data to improve AI models" enabled={toggles.dataSharing} onToggle={() => toggle('dataSharing')} darkMode={darkMode} />
            </>
          )}

          {activeSection === 'appearance' && (
            <>
              <div style={{ color: text, fontSize: 16, fontWeight: 800, marginBottom: 8 }}>Appearance</div>
              <SettingToggle label="Dark Mode" description="Use dark theme across the application" enabled={toggles.darkMode} onToggle={() => toggle('darkMode')} darkMode={darkMode} />
              <div style={{ borderTop: `1px solid ${border}` }} />
              <SettingToggle label="Compact Mode" description="Reduce spacing for a denser interface" enabled={toggles.compactMode} onToggle={() => toggle('compactMode')} darkMode={darkMode} />
            </>
          )}

          {activeSection === 'audio' && (
            <>
              <div style={{ color: text, fontSize: 16, fontWeight: 800, marginBottom: 8 }}>Audio & Video</div>
              <SettingToggle label="AI Noise Cancellation" description="Filter background noise during sessions" enabled={toggles.noiseCancellation} onToggle={() => toggle('noiseCancellation')} darkMode={darkMode} />
              <div style={{ borderTop: `1px solid ${border}` }} />
              <SettingToggle label="Auto-Enable Camera" description="Automatically turn on camera when joining a session" enabled={toggles.autoCamera} onToggle={() => toggle('autoCamera')} darkMode={darkMode} />
            </>
          )}

          {activeSection === 'language' && (
            <>
              <div style={{ color: text, fontSize: 16, fontWeight: 800, marginBottom: 16 }}>Language & Region</div>
              {[
                { label: 'Language', value: 'English (US)' },
                { label: 'Timezone', value: 'IST (UTC+5:30)' },
                { label: 'Date Format', value: 'DD/MM/YYYY' },
              ].map((field, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: `1px solid ${border}`, cursor: 'pointer' }}>
                  <span style={{ color: text, fontSize: 13, fontWeight: 600 }}>{field.label}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: sub, fontSize: 13 }}>{field.value}</span>
                    <ChevronRight size={14} style={{ color: sub }} />
                  </div>
                </div>
              ))}
            </>
          )}
        </motion.div>
      </div>
    </>
  );
}
