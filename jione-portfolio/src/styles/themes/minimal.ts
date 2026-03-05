export const minimalTheme = {
  colors: {
    background: '#FFFFFF',
    foreground: '#000000',
    primary: '#000000',
    primaryForeground: '#FFFFFF',
    secondary: '#F5F5F5',
    secondaryForeground: '#333333',
    muted: '#FAFAFA',
    mutedForeground: '#888888',
    border: '#E0E0E0',
    card: '#FFFFFF',
    cardForeground: '#000000',
    destructive: '#CC0000',
  },

  radius: {
    xs: '0',
    sm: '2px',
    md: '4px',
    lg: '6px',
    xl: '8px',
  },

  shadows: {
    sm: '0 1px 2px rgba(0,0,0,0.04)',
    md: '0 2px 8px rgba(0,0,0,0.06)',
    lg: '0 4px 16px rgba(0,0,0,0.08)',
  },

  fonts: {
    primary: "'Pretendard Variable', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },

  typography: {
    h1: { fontSize: '3rem', fontWeight: 300, letterSpacing: '-0.03em' },
    h2: { fontSize: '2rem', fontWeight: 300, letterSpacing: '-0.02em' },
    body: { fontSize: '1rem', fontWeight: 400, lineHeight: 1.75 },
    small: { fontSize: '0.875rem', fontWeight: 400 },
  },
} as const;

export type MinimalTheme = typeof minimalTheme;
