export const darkTheme = {
  colors: {
    background: '#0F1117',
    foreground: '#E8E8E8',
    primary: '#7C3AED',
    primaryForeground: '#FFFFFF',
    secondary: '#1A1B26',
    secondaryForeground: '#B0B0C0',
    muted: '#161820',
    mutedForeground: '#6B7280',
    border: '#2A2B38',
    card: '#1A1B26',
    cardForeground: '#E8E8E8',
    destructive: '#FF4444',
  },

  radius: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '0.75rem',
    lg: '1rem',
    xl: '1.5rem',
  },

  shadows: {
    sm: '0 1px 4px rgba(0,0,0,0.4)',
    md: '0 4px 16px rgba(0,0,0,0.5)',
    lg: '0 8px 32px rgba(124,58,237,0.2)',
  },

  fonts: {
    primary: "'Pretendard Variable', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },

  typography: {
    h1: { fontSize: '2.5rem', fontWeight: 700, letterSpacing: '-0.02em' },
    h2: { fontSize: '2rem', fontWeight: 600, letterSpacing: '-0.01em' },
    body: { fontSize: '1rem', fontWeight: 400, lineHeight: 1.6 },
    small: { fontSize: '0.875rem', fontWeight: 400 },
  },
} as const;

export type DarkTheme = typeof darkTheme;
