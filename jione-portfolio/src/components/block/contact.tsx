'use client';

import styled from 'styled-components';
import { motion, type Variants } from 'framer-motion';
import { resume } from '@data/resume';

const ContactWrapper = styled.section`
  padding: 5rem 1.5rem;
  background-color: ${(props) => props.theme.colors.muted};
`;

const Container = styled.div`
  max-width: 40rem;
  margin: 0 auto;
  text-align: center;
`;

const SectionTitle = styled.h2`
  font-size: ${(props) => props.theme.typography.h2.fontSize};
  font-weight: ${(props) => props.theme.typography.h2.fontWeight};
  color: ${(props) => props.theme.colors.foreground};
  margin-bottom: 1rem;
`;

const SectionDesc = styled.p`
  font-size: 1rem;
  color: ${(props) => props.theme.colors.mutedForeground};
  margin-bottom: 2.5rem;
  line-height: 1.6;
`;

const ContactInfoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: center;
  margin-bottom: 2rem;
`;

const ContactInfoItem = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  color: ${(props) => props.theme.colors.foreground};
  text-decoration: none;
  font-weight: 500;
  transition: color 0.15s ease;

  &:hover {
    color: ${(props) => props.theme.colors.primary};
  }
`;

const ContactLabel = styled.span`
  font-size: 0.875rem;
  color: ${(props) => props.theme.colors.mutedForeground};
  min-width: 3rem;
  text-align: right;
`;

const GitHubLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: ${(props) => props.theme.colors.primary};
  color: ${(props) => props.theme.colors.primaryForeground};
  border-radius: ${(props) => props.theme.radius.md};
  font-weight: 600;
  font-size: 0.9375rem;
  text-decoration: none;
  transition: opacity 0.15s ease;

  &:hover { opacity: 0.85; }
`;

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export function ContactSection() {
  const { profile } = resume;
  return (
    <ContactWrapper id="contact">
      <Container>
        <motion.div variants={itemVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <SectionTitle>연락하기</SectionTitle>
          <SectionDesc>함께 만들어갈 프로젝트가 있다면 편하게 연락 주세요.</SectionDesc>
          <ContactInfoList>
            <ContactInfoItem href={`mailto:${profile.email}`}>
              <ContactLabel>이메일</ContactLabel>
              {profile.email}
            </ContactInfoItem>
            {profile.phone && (
              <ContactInfoItem href={`tel:${profile.phone}`}>
                <ContactLabel>전화</ContactLabel>
                {profile.phone}
              </ContactInfoItem>
            )}
          </ContactInfoList>
          {profile.social.github && (
            <GitHubLink href={profile.social.github} target="_blank" rel="noopener noreferrer">
              GitHub →
            </GitHubLink>
          )}
        </motion.div>
      </Container>
    </ContactWrapper>
  );
}
