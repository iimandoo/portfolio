'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import styled from 'styled-components';
import { motion, type Variants } from 'framer-motion';
import { resume } from '@data/resume';

const PROJECT_IMAGES: Record<string, string[]> = {};

const getImgSrc = (filename: string) => `/images/${encodeURIComponent(filename)}`;

const Section = styled.section`
  padding: 4rem 0;
  background-color: ${(props) => props.theme.colors.background};
  overflow: hidden;
`;

const SectionInner = styled.div`
  max-width: 72rem;
  margin: 0 auto;
  padding: 0 2rem;
`;

const Header = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: ${(props) => props.theme.typography.h2.fontSize};
  font-weight: ${(props) => props.theme.typography.h2.fontWeight};
  color: ${(props) => props.theme.colors.foreground};
  letter-spacing: ${(props) => props.theme.typography.h2.letterSpacing ?? '-0.02em'};
`;

const NavButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const NavBtn = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid ${(props) => props.theme.colors.border};
  background-color: ${(props) => props.theme.colors.card};
  color: ${(props) => props.theme.colors.foreground};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  transition: background-color 0.15s ease, border-color 0.15s ease;

  &:hover {
    background-color: ${(props) => props.theme.colors.secondary};
    border-color: ${(props) => props.theme.colors.foreground};
  }
`;

const SliderViewport = styled.div`
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  padding-bottom: 0.5rem;

  &::-webkit-scrollbar { display: none; }
`;

const SliderTrack = styled.div`
  display: flex;
  gap: 1.5rem;
  width: max-content;
`;

const Card = styled(motion.div)`
  flex: 0 0 400px;
  scroll-snap-align: start;
  background-color: ${(props) => props.theme.colors.card};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.radius.xl};
  overflow: hidden;
  cursor: pointer;
  transition: box-shadow 0.2s ease, transform 0.2s ease;

  &:hover {
    box-shadow: ${(props) => props.theme.shadows.md};
    transform: translateY(-3px);
  }
`;

const CardImageArea = styled.div`
  position: relative;
  width: 100%;
  height: 240px;
  overflow: hidden;
  background-color: ${(props) => props.theme.colors.muted};
`;

const CardImagePlaceholder = styled.div`
  width: 100%;
  height: 240px;
  background: linear-gradient(135deg,
    ${(props) => props.theme.colors.muted},
    ${(props) => props.theme.colors.secondary});
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PlaceholderLabel = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.mutedForeground};
  opacity: 0.6;
  text-align: center;
  padding: 1rem;
`;

const ImageDots = styled.div`
  position: absolute;
  bottom: 0.75rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.4rem;
  z-index: 2;
`;

const Dot = styled.button<{ $active: boolean }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  border: none;
  background-color: ${(props) => (props.$active ? '#fff' : 'rgba(255,255,255,0.45)')};
  cursor: pointer;
  padding: 0;
  transition: background-color 0.2s ease;
`;

const CardContent = styled.div`
  padding: 1.25rem 1.5rem 1.5rem;
`;

const CardBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  background-color: ${(props) => props.theme.colors.badge ?? props.theme.colors.primary};
  color: ${(props) => props.theme.colors.badgeForeground ?? props.theme.colors.primaryForeground};
  padding: 0.2rem 0.6rem;
  border-radius: ${(props) => props.theme.radius.xl};
  font-size: 0.72rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
`;

const CardMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.6rem;
`;

const CardDate = styled.span`
  font-size: 0.8125rem;
  color: ${(props) => props.theme.colors.mutedForeground};
`;

const MoreButton = styled.button`
  background: none;
  border: none;
  color: ${(props) => props.theme.colors.mutedForeground};
  cursor: pointer;
  font-size: 1.25rem;
  line-height: 1;
  padding: 0;
  transition: color 0.15s ease;

  &:hover { color: ${(props) => props.theme.colors.foreground}; }
`;

const CardTitle = styled.h3`
  font-size: 1.0625rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.foreground};
  line-height: 1.4;
  margin-bottom: 0.875rem;
`;

const CardTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
`;

const Tag = styled.span`
  font-size: 0.75rem;
  color: ${(props) => props.theme.colors.mutedForeground};
  background-color: ${(props) => props.theme.colors.secondary};
  padding: 0.2rem 0.5rem;
  border-radius: ${(props) => props.theme.radius.sm};

  &::before { content: '#'; }
`;

const cardVariants: Variants = {
  hidden: { opacity: 0, x: 24 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.45, delay: i * 0.08, ease: 'easeOut' },
  }),
};

function ProjectImageSlider({ images, title }: { images: string[]; title: string }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [imgError, setImgError] = useState(false);

  const handleDotClick = (i: number) => { setActiveIdx(i); setImgError(false); };

  if (imgError) {
    return (
      <CardImagePlaceholder>
        <PlaceholderLabel>{title}</PlaceholderLabel>
      </CardImagePlaceholder>
    );
  }

  return (
    <CardImageArea>
      <Image
        key={activeIdx}
        src={getImgSrc(images[activeIdx])}
        alt={`${title} ${activeIdx + 1}`}
        fill
        style={{ objectFit: 'cover' }}
        unoptimized
        onError={() => setImgError(true)}
      />
      {images.length > 1 && (
        <ImageDots>
          {images.map((_, i) => (
            <Dot
              key={i}
              $active={i === activeIdx}
              onClick={(e) => { e.stopPropagation(); handleDotClick(i); }}
              aria-label={`이미지 ${i + 1}`}
            />
          ))}
        </ImageDots>
      )}
    </CardImageArea>
  );
}

function formatYear(dateStr: string) {
  return dateStr === 'present' ? new Date().getFullYear().toString() : dateStr.slice(0, 4);
}

export function CardSlider() {
  const { Project } = resume;
  const viewportRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: -1 | 1) => {
    viewportRef.current?.scrollBy({ left: dir * 424, behavior: 'smooth' });
  };

  return (
    <Section id="projects">
      <SectionInner>
        <Header>
          <SectionTitle>프로젝트</SectionTitle>
          <NavButtons>
            <NavBtn onClick={() => scroll(-1)} aria-label="이전">&#8249;</NavBtn>
            <NavBtn onClick={() => scroll(1)} aria-label="다음">&#8250;</NavBtn>
          </NavButtons>
        </Header>

        <SliderViewport ref={viewportRef}>
          <SliderTrack>
            {Project.cases.map((c, i) => {
              const images = PROJECT_IMAGES[c.id] ?? [];
              const tags = (c.execution ?? '').split(/[,/·]/).map((t) => t.trim()).filter(Boolean).slice(0, 4);
              return (
                <Card
                  key={c.id}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                >
                  {images.length > 0 ? (
                    <ProjectImageSlider images={images} title={c.title} />
                  ) : (
                    <CardImagePlaceholder>
                      <PlaceholderLabel>{c.title}</PlaceholderLabel>
                    </CardImagePlaceholder>
                  )}
                  <CardContent>
                    <CardBadge>프로젝트</CardBadge>
                    <CardMeta>
                      <CardDate>{c.year ? formatYear(c.year) : '2024'}</CardDate>
                      <MoreButton aria-label="더보기">&#8942;</MoreButton>
                    </CardMeta>
                    <CardTitle>{c.title}</CardTitle>
                    <CardTags>
                      {tags.map((tag) => (
                        <Tag key={tag}>{tag}</Tag>
                      ))}
                    </CardTags>
                  </CardContent>
                </Card>
              );
            })}
          </SliderTrack>
        </SliderViewport>
      </SectionInner>
    </Section>
  );
}
