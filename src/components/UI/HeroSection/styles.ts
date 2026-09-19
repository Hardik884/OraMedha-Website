'use client';
import { styled } from 'styled-components';
import hero_background from '../../../../public/images/grid_background.png';

export const Wrapper = styled.section`
  margin-top: 6.25rem;
`;

export const Inner = styled.div`
  background: url(${hero_background.src}) no-repeat;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 56rem;
  margin: 0 auto;
  text-align: center;
  background-position: top center;
  background-size: contain;
`;

export const Pill = styled.a`
  display: flex;
  padding: 0.375rem 0.75rem;
  justify-content: center;
  align-items: center;
  gap: 0.625rem;
  border-radius: 6.25rem;
  border: 0.2px solid #989898;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  margin-bottom: 1rem;
  cursor: pointer;
  text-decoration: none;
  transition: border-color 0.3s ease, background 0.3s ease;

  &:hover {
    border-color: var(--jade-hover);
    background: rgba(255, 255, 255, 0.22);
  }

  &:focus-visible {
    outline: 2px solid var(--jade-hover);
    outline-offset: 3px;
  }

  span {
    color: var(--light-gray);
    font-size: 1rem;
    font-weight: 400;
  }
`;

export const HeroTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding-bottom: 2rem;

  h1 {
    font-size: 6rem;
    font-weight: 400;
  }

  p {
    max-width: 41.75rem;
    color: #bdbdbd;
    font-size: 1.5rem;
    font-weight: 400;
    margin: 0 auto;
  }

  @media (max-width: 768px) {
    gap: 1rem;
    padding-bottom: 1.5rem;
    h1 {
      font-size: 2.5rem;
      font-weight: 400;
    }

    p {
      font-size: 1rem;
      line-height: 1.5rem;
    }
  }
`;

/**
 * The reassurance line under the demo button. Deliberately quieter than
 * `HeaderMainText p` — smaller than the hero body copy and a dimmer grey — so
 * it reads as a footnote to the call to action rather than a second sentence
 * of the pitch. No card, border or background: it is just text under a button.
 */
export const CtaSupportNote = styled.p`
  margin-top: 1rem;
  color: #8f8f8f;
  font-size: 0.9375rem;
  font-weight: 400;
  line-height: 1.375rem;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 0.8125rem;
    line-height: 1.25rem;
  }
`;

/**
 * The free-trial offer under the demo button. A step brighter and larger than
 * `CtaSupportNote`, which sits directly beneath it, and capped in width so the
 * long sentence breaks into two balanced lines rather than one stretched one.
 */
export const CtaTrialNote = styled.p`
  max-width: 34rem;
  margin: 1.25rem auto 0;
  color: #bdbdbd;
  font-size: 1.0625rem;
  font-weight: 400;
  line-height: 1.5rem;
  text-align: center;
  text-wrap: balance;

  /* The reassurance line follows with its own top margin; keep the pair
     reading as one stack rather than two separated blocks. */
  & + p {
    margin-top: 0.75rem;
  }

  @media (max-width: 768px) {
    max-width: 22rem;
    font-size: 0.9375rem;
    line-height: 1.375rem;
  }
`;
