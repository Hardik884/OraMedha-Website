'use client';
import Image from 'next/image';
import workspace_banner from '../../../../public/images/product/dashboard-workspace.png';
import workspace_banner_mobile from '../../../../public/images/product/workspace_banner_mobile.png';
import ParallaxText from '@/components/Common/ParallaxImages';
import {
  Wrapper,
  Inner,
  ImageContainer,
  ParallaxImages,
  Div,
  MarqueeItem,
} from './styles';
import RevealCover from '@/components/Common/RevealCover';
import { useIsMobile } from '../../../../libs/useIsMobile';
import { connectedAreas } from './constants';
import { SECTION_IDS } from '../../../../libs/useScrollToSection';
export const imageVariants = {
  hidden: {
    scale: 1.6,
  },
  visible: {
    scale: 1,
    transition: {
      duration: 1.4,
      ease: [0.6, 0.05, -0.01, 0.9],
      delay: 0.2,
    },
  },
};

const Featured = () => {
  const isMobile = useIsMobile();
  return (
    <Wrapper id={SECTION_IDS.product}>
      <Inner>
        <ImageContainer>
          <RevealCover />
          <Div
            variants={imageVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ amount: 0.25, once: true }}
          >
            {isMobile ? (
              <Image
                src={workspace_banner_mobile}
                alt="OraMedha's Today's Dashboard, showing the day's appointments, KPIs and live queue"
                fill
              />
            ) : (
              <Image
                src={workspace_banner}
                alt="OraMedha's Today's Dashboard, showing the day's appointments, KPIs and live queue"
                fill
              />
            )}
          </Div>
        </ImageContainer>
        <h2>One system for the way your clinic works</h2>
        <ParallaxImages>
          {/* Slow enough to read a passing label rather than to register as
              motion — the row names what the system covers, so it has to be
              legible while it drifts. */}
          <ParallaxText baseVelocity={-1.5}>
            {connectedAreas.map((area, i) => (
              <MarqueeItem key={i}>{area}</MarqueeItem>
            ))}
          </ParallaxText>
        </ParallaxImages>
      </Inner>
    </Wrapper>
  );
};

export default Featured;
