import 'styled-components';

// 모든 테마(toss / minimal / dark / kakao / naver) 공통 구조 인터페이스.
// as const literal 타입 대신 string/number로 정의해 테마 간 호환성 확보.
declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      background: string;
      foreground: string;
      primary: string;
      primaryForeground: string;
      secondary: string;
      secondaryForeground: string;
      muted: string;
      mutedForeground: string;
      border: string;
      card: string;
      cardForeground: string;
      destructive: string;
      [key: string]: string; // 테마별 추가 색상 토큰 허용 (nav, badge 등)
    };
    radius: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
    shadows: {
      sm: string;
      md: string;
      lg: string;
    };
    fonts: {
      primary: string;
    };
    typography: {
      h1: { fontSize: string; fontWeight: number; letterSpacing?: string; lineHeight?: number };
      h2: { fontSize: string; fontWeight: number; letterSpacing?: string; lineHeight?: number };
      body: { fontSize: string; fontWeight: number; lineHeight?: number; letterSpacing?: string };
      small: { fontSize: string; fontWeight: number; letterSpacing?: string };
    };
  }
}
