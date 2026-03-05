'use client';

import styled from 'styled-components';
import { motion, type Variants } from 'framer-motion';
import { resume } from '@/data/resume';

const Section = styled.section`
  padding: 5rem 1.5rem;
  background-color: ${(p) => p.theme.colors.background};

  @media (min-width: 768px) {
    padding: 7rem 2rem;
  }
`;

const Container = styled.div`
  max-width: 64rem;
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
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  color: ${(p) => p.theme.colors.foreground};
  margin-bottom: 2.5rem;
`;

const Grid = styled.div`
  display: grid;
  gap: 4rem;

  @media (min-width: 1024px) {
    grid-template-columns: 3fr 2fr;
    gap: 5rem;
  }
`;

/* ── 경력 타임라인 ─────────────────────────────────── */

const TimelineList = styled.div`
  display: flex;
  flex-direction: column;
`;

const TimelineItem = styled.div`
  position: relative;
  padding-left: 1.75rem;
  padding-bottom: 2.5rem;

  &:last-child {
    padding-bottom: 0;
  }

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 7px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: ${(p) => p.theme.colors.primary};
  }

  &::after {
    content: '';
    position: absolute;
    left: 3.5px;
    top: 15px;
    bottom: 0;
    width: 1px;
    background-color: ${(p) => p.theme.colors.border};
  }

  &:last-child::after {
    display: none;
  }
`;

const TimelineCompany = styled.div`
  font-size: 0.9375rem;
  font-weight: 700;
  color: ${(p) => p.theme.colors.foreground};
`;

const TimelineMeta = styled.div`
  display: flex;
  gap: 0.6rem;
  align-items: baseline;
  flex-wrap: wrap;
  margin-top: 0.2rem;
`;

const TimelinePosition = styled.span`
  font-size: 0.8125rem;
  font-weight: 600;
  color: ${(p) => p.theme.colors.primary};
`;

const TimelinePeriod = styled.span`
  font-size: 0.8rem;
  color: ${(p) => p.theme.colors.mutedForeground};
`;

const TimelineDesc = styled.p`
  font-size: 0.875rem;
  color: ${(p) => p.theme.colors.secondaryForeground};
  margin-top: 0.4rem;
  line-height: 1.6;
`;

/* ── 기술 스택 ──────────────────────────────────────── */

const SkillsStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
`;

const CategoryName = styled.h4`
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${(p) => p.theme.colors.mutedForeground};
  margin-bottom: 0.625rem;
`;

const SkillTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
`;

const SkillTag = styled.span<{ $level: string }>`
  display: inline-block;
  padding: 0.25rem 0.65rem;
  border-radius: ${(p) => p.theme.radius.xl};
  font-size: 0.8rem;
  font-weight: 500;
  background-color: ${(p) =>
    p.$level === 'expert'
      ? p.theme.colors.primary
      : p.$level === 'advanced'
        ? p.theme.colors.secondary
        : p.theme.colors.muted};
  color: ${(p) =>
    p.$level === 'expert' ? p.theme.colors.primaryForeground : p.theme.colors.secondaryForeground};
  transition: transform 0.15s ease;

  &:hover {
    transform: translateY(-1px);
  }
`;

/* ── 애니메이션 ─────────────────────────────────────── */

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] },
  }),
};

const formatPeriod = (date: string) => (date === 'present' ? '현재' : date.replace('-', '.'));

/* ── 컴포넌트 ──────────────────────────────────────── */

export function AboutSection() {
  const { career, skills } = resume;

  return (
    <Section id="about">
      <Container>
        <Grid>
          {/* 경력 */}
          <div>
            <SectionLabel>Career</SectionLabel>
            <SectionTitle>경력</SectionTitle>
            <TimelineList>
              {career.experiences.map((exp, i) => (
                <motion.div
                  key={exp.id}
                  custom={i}
                  variants={fadeUpVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-60px' }}
                >
                  <TimelineItem>
                    <TimelineCompany>{exp.company}</TimelineCompany>
                    <TimelineMeta>
                      <TimelinePosition>{exp.position}</TimelinePosition>
                      <TimelinePeriod>
                        {formatPeriod(exp.period.start)} – {formatPeriod(exp.period.end)}
                      </TimelinePeriod>
                    </TimelineMeta>
                    <TimelineDesc>{exp.description}</TimelineDesc>
                  </TimelineItem>
                </motion.div>
              ))}
            </TimelineList>
          </div>

          {/* 기술 */}
          <div>
            <SectionLabel>Skills</SectionLabel>
            <SectionTitle>기술 스택</SectionTitle>
            <SkillsStack>
              {skills.categories.map((cat, ci) => (
                <motion.div
                  key={cat.name}
                  custom={ci}
                  variants={fadeUpVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-60px' }}
                >
                  <div>
                    <CategoryName>{cat.name}</CategoryName>
                    <SkillTags>
                      {cat.skills.map((skill) => (
                        <SkillTag key={skill.name} $level={skill.level}>
                          {skill.name}
                        </SkillTag>
                      ))}
                    </SkillTags>
                  </div>
                </motion.div>
              ))}
            </SkillsStack>
          </div>
        </Grid>
      </Container>
    </Section>
  );
}
