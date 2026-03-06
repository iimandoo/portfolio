'use client';

import { StyleProvider } from '@/styles/provider';
import { naverTheme } from '@/styles/themes/naver';

export default function NaverLayout({ children }: { children: React.ReactNode }) {
  return <StyleProvider theme={naverTheme}>{children}</StyleProvider>;
}
