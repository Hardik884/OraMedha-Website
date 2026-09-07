'use client';
import Link from 'next/link';
import { styled } from 'styled-components';

export const Wrapper = styled.footer`
  padding-bottom: 3.5rem;
`;

export const Inner = styled.main`
  width: 90%;
  max-width: 1440px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 3.75rem;

  @media (max-width: 768px) {
    gap: 2.5rem;
  }
`;

export const FooterLogo = styled.div`
  @media (max-width: 768px) {
    /* The lockup is sized from its own font-size, so one override rescales it. */
    > div {
      font-size: 40px;
    }
  }
`;

export const FooterMainContent = styled.div`
  display: flex;
  flex-direction: column;
  padding: 3.75rem 0 3.25rem;
  border-top: 0.0625rem solid #3d3d3d;
  gap: 3.25rem;
`;

export const FooterMiddle = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  gap: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 3.5rem;
  }
`;

/* The dashed box that held the app-store QR code. OraMedha has no mobile app
   to point at, so the slot keeps its shape and carries the closing call to
   action instead. */
export const CallToAction = styled.div`
  display: flex;
  gap: 0.75rem;
  padding: 1.75rem 1.5rem;
  border-radius: 0.5rem;
  border: 1px dashed var(--White, #fff);
`;

export const TextCtn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  h3 {
    max-width: 19.5625rem;
    font-size: 1.5rem;
    font-weight: 500;
  }

  p {
    max-width: 19.5625rem;
    color: var(--link-color);
    font-size: 1.25rem;
    font-weight: 400;
  }

  @media (max-width: 768px) {
    h3 {
      font-size: 1.25rem;
    }

    p {
      font-size: 1rem;
    }
  }
`;

export const ActionCtn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.75rem;
  margin-top: 0.5rem;
`;

/**
 * The reassurance line under Book a Demo, mirroring the hero's. `&&` because
 * `TextCtn p` above is a descendant selector and would otherwise win: this
 * paragraph is deliberately smaller and dimmer than the pitch it sits under,
 * and it gets no card or border of its own.
 */
export const CtaSupportNote = styled.p`
  && {
    max-width: 19.5625rem;
    color: #8f8f8f;
    font-size: 0.9375rem;
    font-weight: 400;
    line-height: 1.375rem;
  }

  @media (max-width: 768px) {
    && {
      font-size: 0.8125rem;
      line-height: 1.25rem;
    }
  }
`;

export const FooterNavigation = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;

  @media (max-width: 768px) {
    grid-template-columns: 1fr 1fr;
    gap: 3rem 3.75rem;
  }
`;

export const GridColumn = styled.div`
  display: flex;
  min-width: 12.5rem;
  width: 100%;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;

  @media (max-width: 768px) {
    min-width: auto;
  }
`;

export const LinksContainer = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  /* Type only. The pointer and the underline-on-hover live on the two
     components below, so an entry looks clickable exactly when it is —
     several of these columns are labels for who the product serves, not
     links to pages this site has. */
  li {
    color: #efefef;
    font-size: 1rem;
    font-weight: 400;
  }
`;

/* The Product column's entries are real anchors and Contact opens the demo
   dialog. These carry the affordance the list used to give every item. */
const footerAction = `
  position: relative;
  display: inline-block;
  color: inherit;
  font: inherit;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  text-decoration: none;

  &::after {
    position: absolute;
    content: '';
    width: 100%;
    height: 1px;
    background-color: #efefef;
    left: 0;
    bottom: -5px;
    transform: scaleX(0);
    transition: transform 0.5s cubic-bezier(0.165, 0.84, 0.44, 1);
    transform-origin: center;
  }

  &:hover::after,
  &:focus-visible::after {
    transform: scaleX(1);
  }

  &:focus-visible {
    outline: 2px solid var(--jade-hover);
    outline-offset: 3px;
    border-radius: 2px;
  }
`;

export const FooterLink = styled.a`
  ${footerAction}
`;

export const FooterButton = styled.button`
  ${footerAction}
`;

export const FooterBottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;

  @media (max-width: 768px) {
    flex-wrap: wrap;
  }
`;

/* A real route, not an in-page anchor, so it is a plain flex row rather than
   the LinksContainer's <ul> — there is only ever the one entry here. */
export const LegalLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

export const LegalLink = styled(Link)`
  ${footerAction}
  color: #efefef;
  font-size: 1rem;

  @media (max-width: 768px) {
    font-size: 0.875rem;
  }
`;

export const CopyRight = styled.div`
  font-size: 1rem;
  font-weight: 400;
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    font-size: 0.875rem;
    gap: 0.25rem;
  }
`;
