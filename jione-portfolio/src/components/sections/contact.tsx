'use client';

import styled from 'styled-components';
import { motion, type Variants } from 'framer-motion';
import { resume } from '@/data/resume';

const Section = styled.section`
  padding: 7rem 1.5rem;
  background-color: ${(p) => p.theme.colors.secondary};
  text-align: center;
`;

const Container = styled.div`
  max-width: 40rem;
  margin: 0 auto;
`;

const SectionLabel = styled.span`
  display: block;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: ${(p) => p.theme.colors.primary};
  margin-bottom: 0.75rem;
`;

const SectionTitle = styled.h2`
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  color: ${(p) => p.theme.colors.foreground};
  margin-bottom: 1rem;
`;

const Description = styled.p`
  font-size: 1rem;
  line-height: 1.7;
  color: ${(p) => p.theme.colors.mutedForeground};
  margin-bottom: 3rem;
`;

const InfoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  align-items: center;
  margin-bottom: 2.5rem;
`;

const InfoItem = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1rem;
  font-weight: 500;
  color: ${(p) => p.theme.colors.foreground};
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: ${(p) => p.theme.radius.lg};
  transition: background-color 0.15s ease, color 0.15s ease;

  &:hover {
    background-color: ${(p) => p.theme.colors.muted};
    color: ${(p) => p.theme.colors.primary};
  }
`;

const InfoLabel = styled.span`
  font-size: 0.8125rem;
  font-weight: 400;
  color: ${(p) => p.theme.colors.mutedForeground};
  min-width: 2.5rem;
  text-align: right;
`;

const Divider = styled.div`
  width: 2rem;
  height: 1px;
  background-color: ${(p) => p.theme.colors.border};
  margin: 0 auto 2rem;
`;

const GitHubButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9375rem;
  font-weight: 600;
  color: ${(p) => p.theme.colors.primaryForeground};
  background-color: ${(p) => p.theme.colors.primary};
  text-decoration: none;
  padding: 0.75rem 1.75rem;
  border-radius: ${(p) => p.theme.radius.lg};
  transition: opacity 0.15s ease, transform 0.15s ease;

  &:hover {
    opacity: 0.88;
    transform: translateY(-1px);
  }
`;

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

export function ContactSection() {
  const { profile } = resume;

  return (
    <Section id="contact">
      <Container>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          <motion.div variants={itemVariants}>
            <SectionLabel>Contact</SectionLabel>
            <SectionTitle>연락하기</SectionTitle>
            <Description>
              새로운 기회나 협업에 대해 언제든지 연락 주세요.
            </Description>
          </motion.div>

          <motion.div variants={itemVariants}>
            <InfoList>
              <InfoItem href={`mailto:${profile.email}`}>
                <InfoLabel>이메일</InfoLabel>
                <span className="material-symbols-outlined" style={{ fontSize: '1.1em' }}>
                  mail
                </span>
                {profile.email}
              </InfoItem>
              <InfoItem href={`tel:${profile.phone.replace(/-/g, '')}`}>
                <InfoLabel>전화</InfoLabel>
                <span className="material-symbols-outlined" style={{ fontSize: '1.1em' }}>
                  phone
                </span>
                {profile.phone}
              </InfoItem>
            </InfoList>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Divider />
            <GitHubButton href={profile.social.github} target="_blank" rel="noopener noreferrer">
              <span className="material-symbols-outlined" style={{ fontSize: '1.1em' }}>
                code
              </span>
              GitHub 방문하기
            </GitHubButton>
          </motion.div>
        </motion.div>
      </Container>
    </Section>
  );
}
