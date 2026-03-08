'use client';

import styled from 'styled-components';
import { motion, type Variants } from 'framer-motion';
import { resume } from '@data/resume';

const Footer = styled.footer`
  padding: 5rem 2rem;
  background-color: ${(props) => props.theme.colors.nav ?? props.theme.colors.foreground};
`;

const Container = styled.div`
  max-width: 72rem;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.5rem;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

const FooterLogo = styled.p`
  font-size: 1.5rem;
  font-weight: 900;
  color: ${(props) => props.theme.colors.primary};
  letter-spacing: -0.03em;
`;

const FooterDesc = styled.p`
  font-size: 0.9375rem;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.6;
  max-width: 28rem;
`;

const ContactLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: flex-start;

  @media (min-width: 768px) {
    align-items: flex-end;
  }
`;

const ContactLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9375rem;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.15s ease;

  &:hover {
    color: ${(props) => props.theme.colors.primary};
  }
`;

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export function Contact() {
  const { profile } = resume;
  return (
    <Footer id="contact">
      <Container>
        <motion.div variants={itemVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <FooterLogo>{profile.name}</FooterLogo>
          <FooterDesc style={{ marginTop: '0.75rem' }}>{profile.bio}</FooterDesc>
        </motion.div>
        <motion.div variants={itemVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <ContactLinks>
            <ContactLink href={`mailto:${profile.email}`}>
              <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>mail</span>
              {profile.email}
            </ContactLink>
            {profile.phone && (
              <ContactLink href={`tel:${profile.phone}`}>
                <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>call</span>
                {profile.phone}
              </ContactLink>
            )}
            {profile.social.github && (
              <ContactLink href={profile.social.github} target="_blank" rel="noopener noreferrer">
                <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>code</span>
                GitHub
              </ContactLink>
            )}
          </ContactLinks>
        </motion.div>
      </Container>
    </Footer>
  );
}
