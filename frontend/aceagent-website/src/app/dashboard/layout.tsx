'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import DashboardSidebar from './DashboardSidebar';
import DashboardHeader from './DashboardHeader';

interface DashboardCtx {
  darkMode: boolean;
  isMobile: boolean;
  isTablet: boolean;
}

const DashboardContext = createContext<DashboardCtx>({
  darkMode: true,
  isMobile: false,
  isTablet: false,
});

export function useDashboardCtx() {
  return useContext(DashboardContext);
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const isMob = width < 768;
      const isTab = width >= 768 && width < 1200;
      setIsMobile(isMob);
      setIsTablet(isTab);
      if (isMob || isTab) {
        setSidebarCollapsed(true);
      } else {
        setSidebarCollapsed(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <DashboardContext.Provider value={{ darkMode, isMobile, isTablet }}>
      <div
        style={{
          display: 'flex',
          minHeight: '100vh',
          width: '100vw',
          background: darkMode ? '#050816' : '#f0f4f0',
          fontFamily: "'Space Grotesk', sans-serif",
          transition: 'background 0.3s',
        }}
      >
        <DashboardSidebar
          collapsed={sidebarCollapsed}
          isMobile={isMobile}
          onToggle={() => setSidebarCollapsed((prev) => !prev)}
          dark={darkMode}
        />

        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minWidth: 0,
          }}
        >
          <DashboardHeader
            dark={darkMode}
            isMobile={isMobile}
            onToggleDark={() => setDarkMode((prev) => !prev)}
            onToggleSidebar={() => setSidebarCollapsed((prev) => !prev)}
          />

          <div
            style={{
              flex: 1,
              padding: isMobile ? '20px 16px' : '28px 28px 40px',
              background: darkMode ? '#050816' : '#f0f4f0',
              transition: 'background 0.3s',
              overflowY: 'auto',
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </DashboardContext.Provider>
  );
}
