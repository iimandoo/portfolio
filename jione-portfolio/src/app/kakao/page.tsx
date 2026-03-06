'use client';

import styled from 'styled-components';
import { resume } from '@/data/resume';
import { HeroSection } from '@/components/sections/hero';
import { AboutSection } from '@/components/sections/about';
import { ProjectSection } from '@/components/sections/Project';
import { ContactSection } from '@/components/sections/contact';

/* ── 카카오 전용 다크 네비게이션 ─────────────────────── */

const NavBar = styled.nav`
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: #1a1a1a;
  padding: 0 2rem;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const NavLogo = styled.span`
  font-size: 1.1rem;
  font-weight: 900;
  color: ${(p) => p.theme.colors.primary};
  letter-spacing: -0.02em;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 1.75rem;

  @media (max-width: 480px) {
    gap: 1rem;
  }
`;

const NavLink = styled.a`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.15s ease;

  &:hover {
    color: ${(p) => p.theme.colors.primary};
    font-weight: 700;
  }
`;

/* ── 메인 ──────────────────────────────────────────── */

const Main = styled.main`
  width: 100%;
  overflow-x: hidden;
`;

export default function KakaoPage() {
  const { profile } = resume;

  return (
    <>
      <NavBar>
        <NavLogo>{profile.name}</NavLogo>
        <NavLinks>
          <NavLink href="#about">경력</NavLink>
          <NavLink href="#projects">프로젝트</NavLink>
          <NavLink href="#contact">연락</NavLink>
        </NavLinks>
      </NavBar>
      <Main>
        <HeroSection />
        <AboutSection />
        <ProjectSection />
        <ContactSection />
      </Main>
    </>
  );
}
