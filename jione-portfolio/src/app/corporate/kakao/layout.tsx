'use client';
import { StyleProvider } from '@/styles/provider';
import { kakaoTheme } from '@/styles/themes/kakao';
export default function Layout({ children }: { children: React.ReactNode }) {
  return <StyleProvider theme={kakaoTheme}>{children}</StyleProvider>;
}
