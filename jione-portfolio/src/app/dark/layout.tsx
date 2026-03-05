'use client';

import { StyleProvider } from '@/styles/provider';
import { darkTheme } from '@/styles/themes/dark';

export default function DarkLayout({ children }: { children: React.ReactNode }) {
  return (
    <StyleProvider theme={darkTheme}>
      <div style={{ minHeight: '100vh', backgroundColor: '#0F1117', color: '#E8E8E8' }}>
        {children}
      </div>
    </StyleProvider>
  );
}
