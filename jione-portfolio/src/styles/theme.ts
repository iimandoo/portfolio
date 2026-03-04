// `theme.ts` contains three distinct brand themes
// Each theme reflects the brand's unique identity and mood

// #### Toss theme — Modern, minimalist, trustworthy
export const themeToss = {
  colors: {
    background: '#FFFFFF',
    foreground: '#1B1C1F',
    primary: '#3182F6', // Toss blue
    primaryForeground: '#FFFFFF',
    secondary: '#F2F4F6',
    secondaryForeground: '#4E5968',
    muted: '#F9FAFB',
    mutedForeground: '#8B95A1',
    border: '#E5E8EB',
    card: '#FFFFFF',
    cardForeground: '#1B1C1F',
    destructive: '#FF4D4F',
  },

  radius: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '0.75rem',
    lg: '1rem',
    xl: '1.5rem',
  },

  shadows: {
    sm: '0 1px 4px rgba(49, 130, 246, 0.08)',
    md: '0 4px 16px rgba(49, 130, 246, 0.12)',
    lg: '0 8px 32px rgba(49, 130, 246, 0.15)',
  },

  fonts: {
    primary: "'Pretendard Variable', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },

  typography: {
    h1: { fontSize: '2.25rem', fontWeight: 700, letterSpacing: '-0.02em' },
    h2: { fontSize: '1.875rem', fontWeight: 700, letterSpacing: '-0.02em' },
    body: { fontSize: '1rem', fontWeight: 400, lineHeight: 1.5 },
    small: { fontSize: '0.875rem', fontWeight: 400 },
  },
};

// #### Kakao theme — Warm, friendly, playful
export const themeKakao = {
  colors: {
    background: '#FFFBF0',
    foreground: '#2D2D2D',
    primary: '#FEE500', // Kakao Yellow
    primaryForeground: '#000000',
    secondary: '#FFF4D6',
    secondaryForeground: '#5A5A5A',
    muted: '#FFF8E7',
    mutedForeground: '#9B9B9B',
    border: '#FFE8A8',
    card: '#FFFCF8',
    cardForeground: '#2D2D2D',
    destructive: '#E60023',
  },

  radius: {
    xs: '0.5rem',
    sm: '0.75rem',
    md: '1rem',
    lg: '1.25rem',
    xl: '1.5rem',
  },

  shadows: {
    sm: '0 2px 6px rgba(254, 229, 0, 0.12)',
    md: '0 4px 14px rgba(254, 229, 0, 0.16)',
    lg: '0 8px 28px rgba(254, 229, 0, 0.20)',
  },

  fonts: {
    primary: "'Pretendard Variable', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },

  typography: {
    h1: { fontSize: '2.25rem', fontWeight: 700, letterSpacing: '-0.01em' },
    h2: { fontSize: '1.875rem', fontWeight: 700, letterSpacing: '-0.01em' },
    body: { fontSize: '1rem', fontWeight: 400, lineHeight: 1.6 },
    small: { fontSize: '0.875rem', fontWeight: 400 },
  },
};

// #### Kurly theme — Fresh, healthy, vibrant
export const themeKurly = {
  colors: {
    background: '#FAFAF8',
    foreground: '#1F2937',
    primary: '#1DB446', // Kurly green
    primaryForeground: '#FFFFFF',
    secondary: '#E8F5E9',
    secondaryForeground: '#2E7D32',
    muted: '#F1F5F0',
    mutedForeground: '#6B7280',
    border: '#D4E4CF',
    card: '#FFFFFF',
    cardForeground: '#1F2937',
    destructive: '#DC2626',
  },

  radius: {
    xs: '0.375rem',
    sm: '0.625rem',
    md: '0.875rem',
    lg: '1.125rem',
    xl: '1.5rem',
  },

  shadows: {
    sm: '0 1px 5px rgba(29, 180, 70, 0.10)',
    md: '0 4px 14px rgba(29, 180, 70, 0.12)',
    lg: '0 8px 28px rgba(29, 180, 70, 0.14)',
  },

  fonts: {
    primary: "'Pretendard Variable', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },

  typography: {
    h1: { fontSize: '2.25rem', fontWeight: 700, letterSpacing: '-0.02em' },
    h2: { fontSize: '1.875rem', fontWeight: 700, letterSpacing: '-0.02em' },
    body: { fontSize: '1rem', fontWeight: 400, lineHeight: 1.6 },
    small: { fontSize: '0.875rem', fontWeight: 400 },
  },
};

// 전역적으로 사용 가능한 테마 모음
export const themes = {
  toss: themeToss,
  kakao: themeKakao,
  kurly: themeKurly,
} as const;

export type Theme = typeof themeToss; // 모든 테마는 구조적으로 동일
export type ThemeName = keyof typeof themes;
