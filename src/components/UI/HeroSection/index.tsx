'use client';
import Image from 'next/image';
import {
  Wrapper,
  Inner,
  Pill,
  HeroTextContainer,
  CtaSupportNote,
  CtaTrialNote,
} from './styles';
import ic_chevron_right from '../../../../public/svgs/ic_chevron_right.svg';
import { GetStartedButton } from '@/components';
import MaskText from '@/components/Common/MaskText';
import { useIsMobile } from '../../../../libs/useIsMobile';
import {
  SECTION_IDS,
  useScrollToSection,
} from '../../../../libs/useScrollToSection';
import {
  ctaSupportLine,
  ctaTrialLine,
  mobileParagraphPhrases,
  mobilePhrases,
  paragraphPhrases,
  phrases,
} from './constants';

const HeroSection = () => {
  const isMobile = useIsMobile();
  const scrollToSection = useScrollToSection();
  const productHref = `#${SECTION_IDS.product}`;
  return (
    <Wrapper>
      <Inner>
        {/* It carries a chevron, so it has to lead somewhere: the product
            showcase directly below. */}
        <Pill
          href={productHref}
          onClick={(event) => scrollToSection(event, productHref)}
        >
          <span>Introducing OraMedha</span>
          <Image src={ic_chevron_right} alt="" aria-hidden />
        </Pill>
        <HeroTextContainer>
          {isMobile ? (
            <>
              <MaskText phrases={mobilePhrases} tag="h1" />
              <MaskText phrases={mobileParagraphPhrases} tag="p" />
            </>
          ) : (
            <>
              <MaskText phrases={phrases} tag="h1" />
              <MaskText phrases={paragraphPhrases} tag="p" />
            </>
          )}
        </HeroTextContainer>
        <GetStartedButton size="large" />
        <CtaTrialNote>{ctaTrialLine}</CtaTrialNote>
        <CtaSupportNote>{ctaSupportLine}</CtaSupportNote>
      </Inner>
    </Wrapper>
  );
};

export default HeroSection;
