export const kakaoTheme = {
  colors: {
    background: '#FFFFFF',
    foreground: '#1A1A1A',
    primary: '#FEE500',
    primaryForeground: '#1A1A1A',
    secondary: '#F7F7F7',
    secondaryForeground: '#3C3C3C',
    muted: '#F0F0F0',
    mutedForeground: '#767676',
    border: '#E8E8E8',
    card: '#FFFFFF',
    cardForeground: '#1A1A1A',
    destructive: '#F03E3E',
    // Kakao 전용 추가 색상
    nav: '#1A1A1A',
    navForeground: '#FFFFFF',
    badge: '#FEE500',
    badgeForeground: '#1A1A1A',
  },

  radius: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '0.75rem',
    lg: '1rem',
    xl: '1.25rem',
  },

  shadows: {
    sm: '0 1px 4px rgba(0,0,0,0.05)',
    md: '0 4px 16px rgba(0,0,0,0.08)',
    lg: '0 8px 24px rgba(0,0,0,0.10)',
  },

  fonts: {
    primary:
      "'Pretendard Variable', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },

  typography: {
    h1: { fontSize: '2.5rem', fontWeight: 700, letterSpacing: '-0.02em' },
    h2: { fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.01em' },
    body: { fontSize: '1rem', fontWeight: 400, lineHeight: 1.6 },
    small: { fontSize: '0.875rem', fontWeight: 400 },
  },
} as const;

export type KakaoTheme = typeof kakaoTheme;
