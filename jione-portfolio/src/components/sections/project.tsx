'use client';

import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, type Variants } from 'framer-motion';
import { resume } from '@/data/resume';

/* ── Styled Components ─────────────────────────────────────────── */

const Section = styled.section`
  padding: 5rem 1.5rem;
  background-color: ${(p) => p.theme.colors.muted};

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
  margin-bottom: 3rem;
`;

const ProjectList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const CaseCard = styled.div<{ $hasImages: boolean }>`
  background-color: ${(p) => p.theme.colors.card};
  border-radius: ${(p) => p.theme.radius.xl};
  box-shadow: ${(p) => p.theme.shadows.sm};
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: box-shadow 0.25s ease;

  @media (min-width: 768px) {
    flex-direction: ${({ $hasImages }) => ($hasImages ? 'row' : 'column')};
  }

  &:hover {
    box-shadow: ${(p) => p.theme.shadows.md};
  }
`;

const CardBody = styled.div`
  padding: 2rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const ProjectTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: ${(p) => p.theme.colors.foreground};
`;

const ProjectMeta = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  flex-wrap: wrap;
`;

const MetaText = styled.span`
  font-size: 0.8125rem;
  color: ${(p) => p.theme.colors.mutedForeground};
`;

const RoleBadge = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${(p) => p.theme.colors.primary};
  background-color: ${(p) => p.theme.colors.secondary};
  padding: 0.15rem 0.5rem;
  border-radius: ${(p) => p.theme.radius.sm};
`;

const ProjectDesc = styled.p`
  font-size: 0.9375rem;
  line-height: 1.7;
  color: ${(p) => p.theme.colors.secondaryForeground};
`;

const HighlightList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  padding-left: 0;
`;

const HighlightItem = styled.li`
  font-size: 0.875rem;
  color: ${(p) => p.theme.colors.secondaryForeground};
  display: flex;
  gap: 0.5rem;
  align-items: flex-start;
  line-height: 1.55;

  &::before {
    content: '·';
    color: ${(p) => p.theme.colors.primary};
    font-weight: 700;
    flex-shrink: 0;
    margin-top: 0.05em;
  }
`;

const TagRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: 0.25rem;
`;

const Tag = styled.span`
  font-size: 0.75rem;
  font-weight: 500;
  color: ${(p) => p.theme.colors.mutedForeground};
  background-color: ${(p) => p.theme.colors.secondary};
  padding: 0.2rem 0.6rem;
  border-radius: ${(p) => p.theme.radius.md};
`;

/* ── 이미지 사이드 패널 ──────────────────────────────── */

const ImageSide = styled.div`
  display: flex;
  flex-direction: column;
  border-top: 1px solid ${(p) => p.theme.colors.border};
  min-height: 220px;

  @media (min-width: 768px) {
    border-top: none;
    border-left: 1px solid ${(p) => p.theme.colors.border};
    flex: 0 0 42%;
    min-height: unset;
  }
`;

/* 단일 이미지 래퍼 */
const ImageWrapper = styled.div`
  position: relative;
  flex: 1;
  min-height: 220px;
  background-color: ${(p) => p.theme.colors.secondary};
  cursor: pointer;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background-color: rgba(0, 0, 0, 0);
    transition: background-color 0.2s ease;
  }

  &:hover::after {
    background-color: rgba(0, 0, 0, 0.08);
  }
`;

/* ── 슬라이더 ──────────────────────────────────────── */

const SliderContainer = styled.div`
  position: relative;
  overflow: hidden;
  flex: 1;
  min-height: 220px;
`;

const SliderTrack = styled.div<{ $index: number }>`
  display: flex;
  width: 100%;
  height: 100%;
  transform: translateX(${({ $index }) => -$index * 100}%);
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
`;

const Slide = styled.div`
  position: relative;
  flex: 0 0 100%;
  min-height: 220px;
  background-color: ${(p) => p.theme.colors.secondary};
  cursor: pointer;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background-color: rgba(0, 0, 0, 0);
    transition: background-color 0.2s ease;
  }

  &:hover::after {
    background-color: rgba(0, 0, 0, 0.08);
  }
`;

const SlideNavButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  background-color: rgba(0, 0, 0, 0.45);
  color: #fff;
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  line-height: 1;
  transition: background-color 0.15s ease;

  &:hover {
    background-color: rgba(0, 0, 0, 0.7);
  }

  &[data-dir='prev'] {
    left: 0.5rem;
  }

  &[data-dir='next'] {
    right: 0.5rem;
  }
`;

const SliderDots = styled.div`
  position: absolute;
  bottom: 0.5rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.375rem;
  z-index: 10;
`;

const SliderDot = styled.button<{ $active: boolean }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  padding: 0;
  background-color: ${({ $active }) =>
    $active ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.45)'};
  transition: background-color 0.15s ease;
`;

/* ── 모달 ──────────────────────────────────────────── */

const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

const scaleIn = keyframes`
  from { opacity: 0; transform: scale(0.93); }
  to   { opacity: 1; transform: scale(1); }
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.88);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
  cursor: pointer;
  animation: ${fadeIn} 0.2s ease;
`;

const ModalContent = styled.div`
  position: relative;
  max-width: min(90vw, 960px);
  width: 100%;
  cursor: default;
  animation: ${scaleIn} 0.25s cubic-bezier(0.16, 1, 0.3, 1);
`;

const CloseButton = styled.button`
  position: absolute;
  top: -2.75rem;
  right: 0;
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.75rem;
  line-height: 1;
  padding: 0.25rem 0.5rem;
  transition: color 0.15s ease;

  &:hover {
    color: #ffffff;
  }
`;

const ModalImageWrapper = styled.div`
  position: relative;
  aspect-ratio: 16 / 9;
  border-radius: ${(p) => p.theme.radius.xl};
  overflow: hidden;
  box-shadow: 0 32px 80px rgba(0, 0, 0, 0.6);
  background-color: #111;
`;

/* ── 애니메이션 ─────────────────────────────────────── */

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

/* ── 타입 ───────────────────────────────────────────── */

interface ModalState {
  src: string;
  alt: string;
}

/* ── 컴포넌트 ──────────────────────────────────────── */

export function ProjectSection() {
  const { projects } = resume;
  const [modal, setModal] = useState<ModalState | null>(null);
  const [slideIndices, setSlideIndices] = useState<Record<string, number>>({});

  const closeModal = useCallback(() => setModal(null), []);
  const getIdx = (id: string) => slideIndices[id] ?? 0;

  const goSlide = useCallback((id: string, total: number, dir: 1 | -1) => {
    setSlideIndices((prev) => ({
      ...prev,
      [id]: ((prev[id] ?? 0) + dir + total) % total,
    }));
  }, []);

  useEffect(() => {
    if (!modal) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [modal, closeModal]);

  return (
    <>
      <Section id="projects">
        <Container>
          <SectionLabel>Projects</SectionLabel>
          <SectionTitle>프로젝트</SectionTitle>
          <ProjectList>
            {projects.map((project, i) => {
              const screenshots = project.screenshots as readonly { src: string; alt: string }[];
              const hasImages = screenshots.length > 0;

              return (
                <motion.div
                  key={project.id}
                  custom={i}
                  variants={fadeUpVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-60px' }}
                >
                  <CaseCard $hasImages={hasImages}>
                    {/* 텍스트 영역 */}
                    <CardBody>
                      <ProjectTitle>{project.title}</ProjectTitle>
                      <ProjectMeta>
                        {project.company && <MetaText>{project.company}</MetaText>}
                        <MetaText>·</MetaText>
                        <MetaText>{project.year}</MetaText>
                        <RoleBadge>{project.role}</RoleBadge>
                      </ProjectMeta>
                      <ProjectDesc>{project.description}</ProjectDesc>
                      <HighlightList>
                        {project.highlights.map((h, hi) => (
                          <HighlightItem key={hi}>{h}</HighlightItem>
                        ))}
                      </HighlightList>
                      <TagRow>
                        {project.tags.map((tag) => (
                          <Tag key={tag}>{tag}</Tag>
                        ))}
                      </TagRow>
                    </CardBody>

                    {/* 이미지 1장 */}
                    {screenshots.length === 1 && (
                      <ImageSide>
                        <ImageWrapper
                          onClick={() => setModal({ src: screenshots[0].src, alt: project.title })}
                          role="button"
                          aria-label={`${project.title} 이미지 크게 보기`}
                        >
                          <Image
                            src={screenshots[0].src}
                            alt={project.title}
                            fill
                            style={{ objectFit: 'cover' }}
                            sizes="(max-width: 768px) 100vw, 42vw"
                          />
                        </ImageWrapper>
                      </ImageSide>
                    )}

                    {/* 이미지 2장 이상 — 슬라이더 */}
                    {screenshots.length >= 2 && (
                      <ImageSide>
                        <SliderContainer>
                          <SliderTrack $index={getIdx(project.id)}>
                            {screenshots.map((sc, si) => (
                              <Slide
                                key={sc.src}
                                onClick={() => setModal({ src: sc.src, alt: sc.alt })}
                                role="button"
                                aria-label={`${sc.alt} 크게 보기`}
                              >
                                <Image
                                  src={sc.src}
                                  alt={sc.alt}
                                  fill
                                  style={{ objectFit: 'cover' }}
                                  sizes="(max-width: 768px) 100vw, 42vw"
                                />
                              </Slide>
                            ))}
                          </SliderTrack>

                          <SlideNavButton
                            data-dir="prev"
                            onClick={(e) => {
                              e.stopPropagation();
                              goSlide(project.id, screenshots.length, -1);
                            }}
                            aria-label="이전 이미지"
                          >
                            ‹
                          </SlideNavButton>
                          <SlideNavButton
                            data-dir="next"
                            onClick={(e) => {
                              e.stopPropagation();
                              goSlide(project.id, screenshots.length, 1);
                            }}
                            aria-label="다음 이미지"
                          >
                            ›
                          </SlideNavButton>

                          <SliderDots>
                            {screenshots.map((_, di) => (
                              <SliderDot
                                key={di}
                                $active={getIdx(project.id) === di}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSlideIndices((prev) => ({ ...prev, [project.id]: di }));
                                }}
                                aria-label={`이미지 ${di + 1}로 이동`}
                              />
                            ))}
                          </SliderDots>
                        </SliderContainer>
                      </ImageSide>
                    )}
                  </CaseCard>
                </motion.div>
              );
            })}
          </ProjectList>
        </Container>
      </Section>

      {/* 이미지 모달 */}
      {modal && (
        <ModalOverlay onClick={closeModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={closeModal} aria-label="닫기">
              ×
            </CloseButton>
            <ModalImageWrapper>
              <Image
                src={modal.src}
                alt={modal.alt}
                fill
                style={{ objectFit: 'contain' }}
                sizes="min(90vw, 960px)"
                priority
              />
            </ModalImageWrapper>
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
}
