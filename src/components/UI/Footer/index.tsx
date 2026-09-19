'use client';
import { useState } from 'react';
import Image from 'next/image';
import ic_copyright from '../../../../public/svgs/ic_copyright.svg';
import { GetStartedButton, Logo } from '@/components';
import {
  SECTION_IDS,
  useScrollToSection,
} from '../../../../libs/useScrollToSection';

/**
 * Footer navigation.
 *
 * The Product column mirrors the header and points at the same sections, so
 * both navigations agree and neither carries a Pricing entry there is no page
 * for. "Contact us" discloses the two mailboxes rather than navigating, and
 * Privacy & Policy sits under Company, which is the only place it appears: it
 * used to be duplicated in the legal row below, one link too many for one
 * page. The remaining
 * entries are labels, not links: they name who the product is for, and are
 * styled as plain text so nothing invites a click that would go nowhere.
 *
 * The footer renders on every route, including `/privacy`, where these
 * sections don't exist — so each href carries the homepage's own path rather
 * than a bare hash. See libs/useScrollToSection for how that gets a visitor
 * there and onto the right section either way.
 */
type FooterEntry = {
  label: string;
  /** A section on the homepage. */
  href?: string;
  /** A real route on this site, not an in-page anchor. */
  route?: string;
  /** Reveals the contact addresses rather than navigating. */
  action?: 'contact';
};

/**
 * How to reach the company, revealed by "Contact us": two mailboxes, a phone
 * number, and the company's WhatsApp and social profiles, each with the href its
 * own protocol needs. `external` marks the ones that leave the site, which open
 * in a new tab; mailto: and tel: hand off to the visitor's own app instead.
 *
 * WhatsApp is the SAME number as the phone entry above it, in wa.me form: digits
 * only, country code first, no plus or spaces.
 */
const CONTACT_ITEMS: { label: string; href: string; external?: boolean }[] = [
  { label: 'hello@oramedha.com', href: 'mailto:hello@oramedha.com' },
  { label: 'support@oramedha.com', href: 'mailto:support@oramedha.com' },
  { label: '+91 83750 74216', href: 'tel:+918375074216' },
  { label: 'WhatsApp', href: 'https://wa.me/918375074216', external: true },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/getoramedha',
    external: true,
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/oramedha',
    external: true,
  },
];

const linksArr: { title: string; links: FooterEntry[] }[] = [
  {
    title: 'Product',
    links: [
      { label: 'Product', href: `/#${SECTION_IDS.product}` },
      { label: 'Intelligence', href: `/#${SECTION_IDS.intelligence}` },
      { label: 'FAQs', href: `/#${SECTION_IDS.security}` },
    ],
  },
  {
    title: 'For your clinic',
    links: [
      { label: 'Dentists' },
      { label: 'Receptionists' },
      { label: 'Clinic owners' },
      { label: 'Patients' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Contact us', action: 'contact' },
      { label: 'Privacy Policy', route: '/privacy' },
    ],
  },
];

import {
  Wrapper,
  Inner,
  FooterLogo,
  FooterMainContent,
  FooterMiddle,
  CallToAction,
  TextCtn,
  ActionCtn,
  CtaSupportNote,
  FooterNavigation,
  GridColumn,
  LinksContainer,
  FooterLink,
  FooterButton,
  FooterRouteLink,
  ContactEmails,
  ContactEmailLink,
  FooterBottom,
  CopyRight,
} from './styles';

const Footer = () => {
  const scrollToSection = useScrollToSection();
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <Wrapper>
      <Inner>
        <FooterLogo>
          <Logo size={56} />
        </FooterLogo>
        <FooterMainContent>
          <FooterMiddle>
            {/* The closing call to action. Book a Demo is the only thing the
                site asks for — there is no sign-in or account link anywhere. */}
            <CallToAction>
              <TextCtn>
                <h3>A clearer way to run your clinic.</h3>
                <p>
                  Bring your clinical work, operations and intelligence together
                  — so you can stay on top of what matters and keep your clinic
                  growing.
                </p>
                <ActionCtn>
                  <GetStartedButton size="default" />
                  {/* A reassurance line under the button, matching the hero's:
                      quieter than the paragraph above it, and no card of its
                      own — the closing ask is still just the demo. */}
                  <CtaSupportNote>
                    See how OraMedha could work for your clinic — with
                    onboarding and support included.
                  </CtaSupportNote>
                </ActionCtn>
              </TextCtn>
            </CallToAction>
            <FooterNavigation>
              {linksArr.map((column, i) => (
                <GridColumn key={i}>
                  <h3>{column.title}</h3>
                  <LinksContainer>
                    {column.links.map((link, j) => (
                      <li key={j}>
                        {link.href ? (
                          <FooterLink
                            href={link.href}
                            onClick={(event) =>
                              scrollToSection(event, link.href as string)
                            }
                          >
                            {link.label}
                          </FooterLink>
                        ) : link.route ? (
                          <FooterRouteLink href={link.route}>
                            {link.label}
                          </FooterRouteLink>
                        ) : link.action === 'contact' ? (
                          <>
                            <FooterButton
                              type="button"
                              aria-expanded={contactOpen}
                              aria-controls="footer-contact-emails"
                              onClick={() => setContactOpen((was) => !was)}
                            >
                              {link.label}
                            </FooterButton>
                            {/* Rendered either way and hidden with `hidden`, so
                                aria-controls always points at a real element. */}
                            <ContactEmails
                              id="footer-contact-emails"
                              hidden={!contactOpen}
                            >
                              {CONTACT_ITEMS.map((item) => (
                                <li key={item.href}>
                                  <ContactEmailLink
                                    href={item.href}
                                    {...(item.external
                                      ? {
                                          target: '_blank',
                                          rel: 'noopener noreferrer',
                                        }
                                      : {})}
                                  >
                                    {item.label}
                                  </ContactEmailLink>
                                </li>
                              ))}
                            </ContactEmails>
                          </>
                        ) : (
                          link.label
                        )}
                      </li>
                    ))}
                  </LinksContainer>
                </GridColumn>
              ))}
            </FooterNavigation>
          </FooterMiddle>
          <FooterBottom>
            <CopyRight>
              <Image src={ic_copyright} alt="" aria-hidden />
              OraMedha
            </CopyRight>
          </FooterBottom>
        </FooterMainContent>
      </Inner>
    </Wrapper>
  );
};

export default Footer;
