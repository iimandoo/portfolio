'use client';

import { StyleProvider } from '@/styles/provider';
import { minimalTheme } from '@/styles/themes/minimal';

export default function MinimalLayout({ children }: { children: React.ReactNode }) {
  return <StyleProvider theme={minimalTheme}>{children}</StyleProvider>;
}
