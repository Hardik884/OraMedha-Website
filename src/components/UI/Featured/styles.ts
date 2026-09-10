'use client';
import { motion } from 'framer-motion';
import { styled } from 'styled-components';

export const Wrapper = styled.section``;

export const Inner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 6.25rem auto 0;
  max-width: 1440px;
  width: 90%;

  h2 {
    color: var(--link-color);
    font-size: 1.25rem;
    font-weight: 500;
    text-transform: uppercase;
    text-align: center;
    margin-top: 6.5rem;
  }

  @media (max-width: 768px) {
    margin-top: 5rem;

    h2 {
      font-size: 1rem;
      font-weight: 500;
      margin-top: 3.75rem;
    }
  }
`;

export const ImageContainer = styled.div`
  max-width: 85rem;
  margin: 0 auto;
  position: relative;
  width: 100%;
  overflow: hidden;
  border-radius: 0.75rem;

  img {
    object-fit: cover;
    /* The banner is a screenshot, not a photo: anchor the crop to the top-left
       so the product's navigation and page header stay in frame at every width,
       instead of the centre-crop a photograph wants. */
    object-position: left top;
    border-radius: 0.75rem;
  }

  @media (max-width: 768px) {
    border-radius: 0.5rem;

    img {
      height: 23.75rem;
    }
  }

  /* A screenshot cropped to a phone-shaped slot has to stop somewhere, and it
     will not always be on a row boundary. Fading the last few pixels into the
     page means the cut reads as the panel continuing rather than as a broken
     image. Mobile only: the desktop banners are wide enough to end cleanly. */
  @media (max-width: 768px) {
    &::after {
      position: absolute;
      content: '';
      left: 0;
      right: 0;
      bottom: 0;
      height: 3.5rem;
      background: linear-gradient(
        180deg,
        rgba(7, 6, 6, 0) 0%,
        var(--Background, #070606) 100%
      );
      pointer-events: none;
      z-index: 2;
    }
  }
`;

export const ParallaxImages = styled.div`
  position: relative;
  /*
   * \`width: 100%\` is load-bearing, not decoration.
   *
   * This is a centred item in a column flex container, so with no width of its
   * own it is shrink-to-fit: it took the marquee's max-content width — 859px of
   * nowrap text — and only the max-width kept it there. On a phone that is more
   * than twice the viewport, and the strip took the page's horizontal scroll
   * with it, hidden behind the blanket \`overflow-x\` on the body. Bound to the
   * container instead; the max-width still decides the size on every layout
   * wide enough to reach it, so nothing above the breakpoint moves.
   */
  width: 100%;
  max-width: 53.7rem;
  margin: 3rem auto 0;
`;

/* One entry in the scrolling list of connected clinic areas. Sits in the slot
   the press-logo strip used to occupy, and keeps its rhythm. */
export const MarqueeItem = styled.span`
  /* Doubled selector: the global \`.scroller span\` rule that lays out the
     marquee's four repeats is more specific than a single generated class, and
     would otherwise force each item to \`display: block\` and stack them. */
  && {
    display: inline-block;
    margin-right: 3rem;
    color: var(--link-color);
    font-size: 1.5rem;
    font-weight: 400;
    white-space: nowrap;
  }

  @media (max-width: 768px) {
    && {
      margin-right: 2rem;
      font-size: 1.125rem;
    }
  }
`;

export const Div = styled(motion.div)`
  position: relative;
  height: 35rem;
  overflow: hidden;

  @media (max-width: 599px) {
    height: 23.75rem;
    
     img {
      object-fit: cover;
     }
  }
`;
