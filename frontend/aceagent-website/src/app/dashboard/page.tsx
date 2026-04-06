'use client';

import { useDashboardCtx } from './layout';
import StatsRow from './StatsRow';
import ScoreTrendChart from './ScoreTrendChart';
import UpcomingInterview from './UpcomingInterview';
import RecentAnalysis from './RecentAnalysis';
import AIFeedbackPanel from './AIFeedbackPanel';
import ReadinessScore from './ReadinessScore';
import PracticeDuration from './PracticeDuration';

export default function DashboardPage() {
  const { darkMode, isMobile, isTablet } = useDashboardCtx();

  const gridTemplateColumns = isMobile
    ? '1fr'
    : isTablet
    ? '1fr 1fr'
    : '1fr 300px 280px';

  const secondaryGridColumns = isMobile
    ? '1fr'
    : isTablet
    ? '1fr 1fr'
    : '1fr 300px 240px';

  return (
    <>
      <div style={{ marginBottom: 24, textAlign: isMobile ? 'center' : 'left' }}>
        <h1
          style={{
            fontSize: isMobile ? 26 : 32,
            fontWeight: 800,
            color: darkMode ? '#f1f5f9' : '#0f172a',
            margin: 0,
            letterSpacing: -0.5,
          }}
        >
          Dashboard
        </h1>
        <p
          style={{
            color: darkMode ? '#64748b' : '#6b7280',
            fontSize: 14,
            marginTop: 4,
            marginBottom: 0,
          }}
        >
          Track your interview prep, scores, and AI-powered feedback.
        </p>
      </div>

      <StatsRow dark={darkMode} />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: gridTemplateColumns,
          gap: 20,
          marginTop: 20,
        }}
      >
        <ScoreTrendChart dark={darkMode} />
        <UpcomingInterview dark={darkMode} />
        <RecentAnalysis dark={darkMode} />
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: secondaryGridColumns,
          gap: 20,
          marginTop: 20,
        }}
      >
        <AIFeedbackPanel dark={darkMode} />
        <ReadinessScore dark={darkMode} />
        <PracticeDuration dark={darkMode} />
      </div>
    </>
  );
}