'use client';

import { StyleProvider } from '@/styles/provider';
import { tossTheme } from '@/styles/themes/toss';

export default function TossLayout({ children }: { children: React.ReactNode }) {
  return <StyleProvider theme={tossTheme}>{children}</StyleProvider>;
}
