'use client';

import { GNB } from '@/components/corporate/gnb';
import { Hero } from '@/components/corporate/hero';
import { CardSlider } from '@/components/corporate/card-slider';
import { Career } from '@/components/corporate/career';
import { Contact } from '@/components/corporate/contact';

export default function Page() {
  return (
    <>
      <GNB />
      <Hero />
      <CardSlider />
      <Career />
      <Contact />
    </>
  );
}
