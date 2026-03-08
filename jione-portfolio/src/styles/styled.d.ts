import "styled-components";

declare module "styled-components" {
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
      [key: string]: string;
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
      h1: {
        fontSize: string;
        fontWeight: number;
        letterSpacing?: string;
        lineHeight?: number;
      };
      h2: {
        fontSize: string;
        fontWeight: number;
        letterSpacing?: string;
        lineHeight?: number;
      };
      body: {
        fontSize: string;
        fontWeight: number;
        lineHeight?: number;
        letterSpacing?: string;
      };
      small: { fontSize: string; fontWeight: number; letterSpacing?: string };
    };
  }
}
