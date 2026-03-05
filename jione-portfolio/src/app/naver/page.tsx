'use client';

import styled from 'styled-components';
import { HeroSection } from '@/components/sections/hero';
import { AboutSection } from '@/components/sections/about';
import { ProjectSection } from '@/components/sections/Project';
import { ContactSection } from '@/components/sections/contact';

const Main = styled.main`
  width: 100%;
  overflow-x: hidden;
`;

export default function NaverPage() {
  return (
    <Main>
      <HeroSection />
      <AboutSection />
      <ProjectSection />
      <ContactSection />
    </Main>
  );
}
