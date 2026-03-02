'use client';

import styled from 'styled-components';
import { HeroSection } from '@/components/sections/hero';
import { AboutSection } from '@/components/sections/about';
import { ImpactSection } from '@/components/sections/impact';
import { ContactSection } from '@/components/sections/contact';

const MainContainer = styled.main`
  width: 100%;
  overflow-x: hidden;
`;

export default function Home() {
  return (
    <MainContainer>
      <HeroSection />
      <AboutSection />
      <ImpactSection />
      <ContactSection />
    </MainContainer>
  );
}
