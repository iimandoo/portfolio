export const naverTheme = {
  colors: {
    background: '#FFFFFF',
    foreground: '#0D0D0D',
    primary: '#03C75A',
    primaryForeground: '#FFFFFF',
    secondary: '#F4F4F4',
    secondaryForeground: '#333333',
    muted: '#F8F8F8',
    mutedForeground: '#888888',
    border: '#E8E8E8',
    card: '#FFFFFF',
    cardForeground: '#0D0D0D',
    destructive: '#FF3333',
  },

  radius: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '0.75rem',
    lg: '1rem',
    xl: '1.25rem',
  },

  shadows: {
    sm: '0 1px 4px rgba(0,0,0,0.06)',
    md: '0 4px 20px rgba(0,0,0,0.08)',
    lg: '0 8px 40px rgba(0,0,0,0.12)',
  },

  fonts: {
    primary: "'Pretendard Variable', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },

  typography: {
    h1: { fontSize: '3.5rem', fontWeight: 300, letterSpacing: '-0.03em' },
    h2: { fontSize: '2.25rem', fontWeight: 400, letterSpacing: '-0.02em' },
    body: { fontSize: '1rem', fontWeight: 400, lineHeight: 1.65 },
    small: { fontSize: '0.875rem', fontWeight: 400 },
  },
} as const;

export type NaverTheme = typeof naverTheme;
