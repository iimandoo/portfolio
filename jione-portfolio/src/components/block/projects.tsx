'use client';

import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, type Variants } from 'framer-motion';
import { resume } from '@data/resume';

const Section = styled.section`
  padding: 5rem 1.5rem;
  background-color: ${(props) => props.theme.colors.background};
`;

const Container = styled.div`
  max-width: 64rem;
  margin: 0 auto;
`;

const SectionTitle = styled.h2`
  font-size: ${(props) => props.theme.typography.h2.fontSize};
  font-weight: ${(props) => props.theme.typography.h2.fontWeight};
  color: ${(props) => props.theme.colors.foreground};
  margin-bottom: 1rem;
  letter-spacing: ${(props) => props.theme.typography.h2.letterSpacing ?? '-0.02em'};
`;

const Intro = styled.p`
  font-size: 1.0625rem;
  line-height: 1.7;
  color: ${(props) => props.theme.colors.secondaryForeground};
  margin-bottom: 3rem;
  max-width: 48rem;
`;

const CaseCard = styled(motion.div)<{ $hasImages: boolean }>`
  background-color: ${(props) => props.theme.colors.card};
  border-radius: ${(props) => props.theme.radius.xl};
  box-shadow: ${(props) => props.theme.shadows.sm};
  overflow: hidden;
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  border: 1px solid ${(props) => props.theme.colors.border};

  @media (min-width: 768px) {
    flex-direction: ${({ $hasImages }) => ($hasImages ? 'row' : 'column')};
  }

  &:hover {
    box-shadow: ${(props) => props.theme.shadows.md};
  }
`;

const CardBody = styled.div`
  padding: 2rem;
  flex: 1;
`;

const CardTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.foreground};
  margin-bottom: 0.5rem;
`;

const CardCompany = styled.p`
  font-size: 0.875rem;
  color: ${(props) => props.theme.colors.mutedForeground};
  margin-bottom: 1rem;
`;

const CardDescription = styled.p`
  font-size: 0.9375rem;
  line-height: 1.7;
  color: ${(props) => props.theme.colors.secondaryForeground};
  margin-bottom: 0.75rem;
`;

const ImageSide = styled.div`
  display: flex;
  flex-direction: column;
  border-top: 1px solid ${(props) => props.theme.colors.border};

  @media (min-width: 768px) {
    border-top: none;
    border-left: 1px solid ${(props) => props.theme.colors.border};
    flex: 0 0 45%;
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  flex: 1;
  min-height: 200px;
  background-color: ${(props) => props.theme.colors.secondary};
  cursor: pointer;

  &:hover::after {
    content: '';
    position: absolute;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.08);
  }
`;

const SliderContainer = styled.div`
  position: relative;
  overflow: hidden;
  flex: 1;
  min-height: 200px;
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
  min-height: 200px;
  background-color: ${(props) => props.theme.colors.secondary};
  cursor: pointer;

  &:hover::after {
    content: '';
    position: absolute;
    inset: 0;
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
  border: none;
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.25rem;
  line-height: 1;
  transition: background-color 0.15s ease;

  &:hover { background-color: rgba(0, 0, 0, 0.7); }
  &[data-dir='prev'] { left: 0.5rem; }
  &[data-dir='next'] { right: 0.5rem; }
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
  border: none;
  padding: 0;
  cursor: pointer;
  background-color: ${({ $active }) => $active ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.45)'};
  transition: background-color 0.15s ease;
`;

const ImgFallback = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg,
    ${(props) => props.theme.colors.muted},
    ${(props) => props.theme.colors.secondary});
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ImgFallbackLabel = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.mutedForeground};
  opacity: 0.7;
  text-align: center;
  padding: 1rem;
`;

const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const scaleIn = keyframes`from { opacity: 0; transform: scale(0.92); } to { opacity: 1; transform: scale(1); }`;

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
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.75rem;
  line-height: 1;
  padding: 0.25rem 0.5rem;
  cursor: pointer;
  &:hover { color: #ffffff; }
`;

const ModalImageWrapper = styled.div`
  position: relative;
  aspect-ratio: 16 / 9;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 32px 80px rgba(0, 0, 0, 0.6);
`;

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: 'easeOut' },
  }),
};

interface ModalState { src: string; alt: string; }

export function ProjectsSection() {
  const { Project } = resume;
  const [modal, setModal] = useState<ModalState | null>(null);
  const [slideIndices, setSlideIndices] = useState<Record<string, number>>({});
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  const closeModal = useCallback(() => setModal(null), []);
  const getIdx = (id: string) => slideIndices[id] ?? 0;
  const markErr = (key: string) => setImgErrors((prev) => ({ ...prev, [key]: true }));
  const hasErr = (key: string) => imgErrors[key] ?? false;

  const goSlide = useCallback((id: string, total: number, dir: 1 | -1) => {
    setSlideIndices((prev) => ({
      ...prev,
      [id]: ((prev[id] ?? 0) + dir + total) % total,
    }));
  }, []);

  useEffect(() => {
    if (!modal) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeModal(); };
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
          <SectionTitle>프로젝트</SectionTitle>
          <Intro>{Project.intro}</Intro>
          {Project.cases.map((c, i) => {
            const images = ('images' in c ? c.images : []) as readonly string[];
            return (
              <CaseCard
                key={c.id}
                $hasImages={images.length > 0}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
              >
                <CardBody>
                  <CardTitle>{c.title}</CardTitle>
                  {'company' in c && <CardCompany>{c.company}</CardCompany>}
                  {'description' in c && <CardDescription>{c.description}</CardDescription>}
                  <CardDescription>{c.execution}</CardDescription>
                  {'tools' in c && c.tools && (
                    <CardDescription style={{ fontSize: '0.8125rem' }}>Tools: {c.tools}</CardDescription>
                  )}
                </CardBody>

                {images.length === 1 && (
                  <ImageSide>
                    <ImageWrapper onClick={() => !hasErr(`${c.id}_0`) && setModal({ src: images[0], alt: c.title })}>
                      {hasErr(`${c.id}_0`) ? (
                        <ImgFallback><ImgFallbackLabel>{c.title}</ImgFallbackLabel></ImgFallback>
                      ) : (
                        <Image src={images[0]} alt={c.title} fill style={{ objectFit: 'cover' }} sizes="(max-width: 768px) 100vw, 45vw" onError={() => markErr(`${c.id}_0`)} />
                      )}
                    </ImageWrapper>
                  </ImageSide>
                )}

                {images.length >= 2 && (
                  <ImageSide>
                    <SliderContainer>
                      <SliderTrack $index={getIdx(c.id)}>
                        {images.map((src, idx) => (
                          <Slide key={src} onClick={() => !hasErr(`${c.id}_${idx}`) && setModal({ src, alt: `${c.title} ${idx + 1}` })}>
                            {hasErr(`${c.id}_${idx}`) ? (
                              <ImgFallback><ImgFallbackLabel>{c.title}</ImgFallbackLabel></ImgFallback>
                            ) : (
                              <Image src={src} alt={`${c.title} ${idx + 1}`} fill style={{ objectFit: 'cover' }} sizes="(max-width: 768px) 100vw, 45vw" onError={() => markErr(`${c.id}_${idx}`)} />
                            )}
                          </Slide>
                        ))}
                      </SliderTrack>
                      <SlideNavButton data-dir="prev" onClick={(e) => { e.stopPropagation(); goSlide(c.id, images.length, -1); }} aria-label="이전">&#8249;</SlideNavButton>
                      <SlideNavButton data-dir="next" onClick={(e) => { e.stopPropagation(); goSlide(c.id, images.length, 1); }} aria-label="다음">&#8250;</SlideNavButton>
                      <SliderDots>
                        {images.map((_, idx) => (
                          <SliderDot key={idx} $active={getIdx(c.id) === idx} onClick={(e) => { e.stopPropagation(); setSlideIndices((prev) => ({ ...prev, [c.id]: idx })); }} />
                        ))}
                      </SliderDots>
                    </SliderContainer>
                  </ImageSide>
                )}
              </CaseCard>
            );
          })}
        </Container>
      </Section>

      {modal && (
        <ModalOverlay onClick={closeModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={closeModal}>&#215;</CloseButton>
            <ModalImageWrapper>
              <Image src={modal.src} alt={modal.alt} fill style={{ objectFit: 'contain' }} sizes="min(90vw, 960px)" priority />
            </ModalImageWrapper>
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
}
