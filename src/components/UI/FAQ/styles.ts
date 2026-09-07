'use client';
import { styled } from 'styled-components';
import { motion } from 'framer-motion';

export const Wrapper = styled.div`
  padding: 8.25rem 0 10rem;
`;

export const Inner = styled.div`
  width: 90%;
  max-width: 1440px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 6.25rem;

  /* Matched to TrustSection's headline, the section directly above: the FAQ
     is the page's quiet close, not a bigger statement than the one before it. */
  h1 {
    max-width: 56rem;
    font-size: 4.75rem;
    font-weight: 400;
  }

  @media (max-width: 768px) {
    h1 {
      font-size: 2.25rem;
    }
  }
`;

export const HeaderText = styled.h1`
  max-width: 56rem;
  font-size: 4.75rem;
  font-weight: 400;

  @media (max-width: 768px) {
    font-size: 2.25rem;
  }
`;

export const Accordion = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const AccordionItem = styled(motion.div)`
  display: flex;
  flex-direction: column;
  padding-bottom: 1rem;
  border-bottom: 0.0625rem solid #3d3d3d;
  overflow: hidden;
`;

export const Question = styled(motion.button)<{ $open: boolean }>`
  /* A real button: these rows toggle content, so they must be reachable and
     operable from the keyboard, not just clickable. */
  width: 100%;
  background: none;
  border: none;
  color: inherit;
  font-family: inherit;
  text-align: left;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  cursor: pointer;
  font-size: 1.5rem;
  font-weight: 500;
  margin-bottom: 1.5rem;
  padding: 0;

  /* The only signal that an item is open used to be the answer appearing.
     The chevron now points at its own state. */
  img {
    flex-shrink: 0;
    transition: transform 0.4s cubic-bezier(0.33, 1, 0.68, 1);
    transform: rotate(${({ $open }) => ($open ? '180deg' : '0deg')});
  }

  &:focus-visible {
    outline: 2px solid var(--jade-hover);
    outline-offset: 6px;
    border-radius: 2px;
  }

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

export const Answer = styled(motion.div)`
  color: var(--link-color);
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5rem;
`;
