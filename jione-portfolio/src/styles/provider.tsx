'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useServerInsertedHTML } from 'next/navigation';
import { ServerStyleSheet, StyleSheetManager, ThemeProvider } from 'styled-components';
import type { DefaultTheme } from 'styled-components';

// SSR 스타일 주입 (FOUC 방지) — Next.js App Router + styled-components v6 필수
export function StyleProvider({
  children,
  theme,
}: {
  children: React.ReactNode;
  theme: DefaultTheme;
}) {
  const [styledComponentsStyleSheet] = useState(() => new ServerStyleSheet());

  // 선택된 테마를 로컬 스토리지에 저장해서 새로고침 후에도 유지
  const [option, setOption] = useState<ThemeOption>(() => {
    if (typeof window === 'undefined') return 'toss';
    const saved = localStorage.getItem('themeOption');
    return (
      saved && (saved === 'toss' || saved === 'kakao' || saved === 'kurly') ? saved : 'toss'
    ) as ThemeOption;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('themeOption', option);
    }
  }, [option]);

  useServerInsertedHTML(() => {
    const styles = styledComponentsStyleSheet.getStyleElement();
    styledComponentsStyleSheet.instance.clearTag();
    return <>{styles}</>;
  });

  const renderWithTheme = (theme: typeof themes.toss, child: React.ReactNode) => (
    <ThemeProvider theme={theme}>{child}</ThemeProvider>
  );

  const content = renderWithTheme(themes[option], children);

  const providerTree =
    typeof window !== 'undefined' ? (
      content
    ) : (
      <StyleSheetManager sheet={styledComponentsStyleSheet.instance}>{content}</StyleSheetManager>
    );

  return (
    <ThemeContext.Provider value={{ option, setOption }}>{providerTree}</ThemeContext.Provider>
  );
}
