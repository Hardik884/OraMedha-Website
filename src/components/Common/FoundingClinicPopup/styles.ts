'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { styled } from 'styled-components';

/* Same corner on every breakpoint: fixed to the viewport, clear of the header
   and, on phones, narrow enough that it never reaches the opposite edge. */
export const Wrapper = styled(motion.div)`
  position: fixed;
  top: 6.5rem;
  left: 1.25rem;
  z-index: 1200;
  width: 19rem;
  max-width: calc(100vw - 2.5rem);

  @media (max-width: 768px) {
    top: 5.5rem;
    left: 1rem;
    width: 17.5rem;
  }

  @media (max-width: 380px) {
    width: calc(100vw - 2rem);
  }
`;

/* The DemoDialog panel's own surface: the same #131313 card, hairline border
   and 0.75rem radius, so this reads as part of the same site rather than a
   bolted-on widget. */
export const Card = styled.div`
  position: relative;
  border-radius: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: #131313;
  box-shadow: 0 1.25rem 2.5rem rgba(0, 0, 0, 0.45);
  overflow: hidden;
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 0.625rem;
  right: 0.625rem;
  z-index: 1;
  width: 1.875rem;
  height: 1.875rem;
  display: grid;
  place-items: center;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 50%;
  background: rgba(7, 6, 6, 0.55);
  backdrop-filter: blur(4px);
  color: var(--white);
  font-size: 1rem;
  line-height: 1;
  cursor: pointer;
  transition: border-color 0.25s ease, background 0.25s ease;

  &:hover {
    border-color: rgba(255, 255, 255, 0.4);
    background: rgba(7, 6, 6, 0.75);
  }

  &:focus-visible {
    outline: 2px solid var(--jade-hover);
    outline-offset: 2px;
  }
`;

export const PosterFrame = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  background: var(--Background);
`;

export const Poster = styled(Image)`
  object-fit: cover;
  object-position: top center;
`;

export const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem 1.125rem 1.125rem;
`;

/* Small-caps eyebrow in the legible jade, same role as every eyebrow on the
   page (FinancialFuture, TrustSection, opengraph-image). */
export const Eyebrow = styled.p`
  color: var(--jade-legible);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

export const Headline = styled.p`
  color: var(--white);
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.4;
`;

export const CtaLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  color: var(--jade-legible);
  font-size: 0.9375rem;
  font-weight: 600;
  margin-top: 0.125rem;
  width: fit-content;
  transition: color 0.2s ease, gap 0.2s ease;

  &:hover {
    color: var(--white);
    gap: 0.5rem;
  }

  &:focus-visible {
    outline: 2px solid var(--jade-hover);
    outline-offset: 3px;
    border-radius: 0.25rem;
  }

  svg {
    flex-shrink: 0;
    transition: transform 0.2s ease;
  }

  &:hover svg {
    transform: translateX(0.125rem);
  }
`;
