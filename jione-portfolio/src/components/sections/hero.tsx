'use client';

import styled from 'styled-components';
import { motion, type Variants } from 'framer-motion';
import { resume } from '@/data/resume';

const HeroWrapper = styled.section`
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6rem 1.5rem;
  background: linear-gradient(
    160deg,
    ${(p) => p.theme.colors.background} 60%,
    ${(p) => p.theme.colors.secondary} 100%
  );
`;

const Inner = styled.div`
  max-width: 48rem;
  width: 100%;
  text-align: center;
`;

const RoleLabel = styled.span`
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: ${(p) => p.theme.colors.primary};
  margin-bottom: 1.25rem;
`;

const HeroName = styled.h1`
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 700;
  letter-spacing: -0.03em;
  color: ${(p) => p.theme.colors.foreground};
  line-height: 1.1;
  margin-bottom: 0.75rem;
`;

const HeroTitle = styled.p`
  font-size: clamp(1rem, 2.5vw, 1.25rem);
  font-weight: 500;
  color: ${(p) => p.theme.colors.secondaryForeground};
  margin-bottom: 1.75rem;
`;

const HeroBio = styled.p`
  font-size: 1rem;
  line-height: 1.8;
  color: ${(p) => p.theme.colors.mutedForeground};
  max-width: 38rem;
  margin: 0 auto 2.5rem;
`;

const GitHubLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.9375rem;
  font-weight: 600;
  color: ${(p) => p.theme.colors.primary};
  text-decoration: none;
  border-bottom: 1.5px solid ${(p) => p.theme.colors.primary};
  padding-bottom: 1px;
  transition: opacity 0.15s ease;

  &:hover {
    opacity: 0.7;
  }
`;

const ScrollIndicator = styled.div`
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  color: ${(p) => p.theme.colors.mutedForeground};
  font-size: 0.7rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;

  &::after {
    content: '';
    width: 1px;
    height: 32px;
    background: linear-gradient(to bottom, ${(p) => p.theme.colors.primary}, transparent);
  }
`;

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
};

export function HeroSection() {
  const { profile } = resume;

  return (
    <HeroWrapper>
      <Inner>
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          <motion.div variants={itemVariants}>
            <RoleLabel>{profile.subtitle}</RoleLabel>
          </motion.div>
          <motion.div variants={itemVariants}>
            <HeroName>{profile.name}</HeroName>
          </motion.div>
          <motion.div variants={itemVariants}>
            <HeroTitle>{profile.title}</HeroTitle>
          </motion.div>
          <motion.div variants={itemVariants}>
            <HeroBio>{profile.bio}</HeroBio>
          </motion.div>
          <motion.div variants={itemVariants}>
            <GitHubLink href={profile.social.github} target="_blank" rel="noopener noreferrer">
              <span className="material-symbols-outlined" style={{ fontSize: '1em' }}>
                code
              </span>
              GitHub
            </GitHubLink>
          </motion.div>
        </motion.div>
      </Inner>
      <ScrollIndicator>scroll</ScrollIndicator>
    </HeroWrapper>
  );
}
