'use client';

import styled from 'styled-components';
import { HeroSection } from '@/components/block/hero';
import { AboutSection } from '@/components/block/about';
import { ProjectsSection } from '@/components/block/projects';
import { ContactSection } from '@/components/block/contact';

const Main = styled.main`
  width: 100%;
  overflow-x: hidden;
`;

export default function Page() {
  return (
    <Main>
      <HeroSection />
      <AboutSection />
      <ProjectsSection />
      <ContactSection />
    </Main>
  );
}
