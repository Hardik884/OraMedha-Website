type FAQItem = {
  question: string;
  answer: string;
};

export const desktopHeaderPhrase = ['Frequently asked', 'questions'];
export const mobileHeaderPhrase = ['Frequently', 'asked', 'questions'];
export const animate = {
  initial: {
    y: '100%',
    opacity: 0,
  },
  open: (i: number) => ({
    y: '0%',
    opacity: 1,
    transition: { duration: 1, delay: 0.1 * i, ease: [0.33, 1, 0.68, 1] },
  }),
};

/**
 * Security answers describe what the application enforces today — per-clinic
 * isolation and role-based access, both enforced in the database rather than
 * only in the interface. No certification or compliance claim is made here,
 * because none has been verified.
 */
export const faqData: FAQItem[] = [
  {
    question: 'What does OraMedha actually cover?',
    answer:
      'OraMedha brings together the day-to-day work of a dental clinic — patients and their history, appointments, queue, dental charting, treatments and consent, billing and payments, follow-ups, analytics, and a patient portal. It can understand the clinic in context, surface what needs attention, and help you act on it.',
  },
  {
    question: 'What makes OraMedha different?',
    answer:
      'OraMedha is an intelligent system for running a dental clinic. It brings your day-to-day workflows together, surfaces what needs attention, prioritises what matters most, and helps turn those priorities into action — so you can spend less time figuring out what to do and more time running and growing your practice.',
  },
  {
    question: 'What kind of clinics is OraMedha built for?',
    answer:
      'OraMedha is built for dental clinics of all sizes — from solo and independent clinics to larger teams. The workflows stay simple for smaller clinics while giving growing teams the connected visibility and coordination they need.',
  },
  {
    question: 'Who in the clinic uses it?',
    answer:
      'OraMedha works whether you run the clinic yourself or with a team. Dentists, receptionists and clinic owners can work from the same connected system with views appropriate to their role, while patients have a separate portal for their own information.',
  },
  {
    question: 'What support do we get?',
    answer:
      'We help you get OraMedha set up, onboard your clinic, and answer day-to-day questions so you’re not left figuring everything out on your own.',
  },
  {
    question: 'How does OraMedha keep clinic data secure?',
    answer:
      'Through role-based access and clinic-level data isolation. Every record belongs to a clinic, and what a dentist, a receptionist or a patient can each read and change is defined per role — both enforced in the database itself, not only in the interface.',
  },
  {
    question: 'Who can access patient information in OraMedha?',
    answer:
      'Access is controlled by user roles and clinic-level permissions. Dentists, receptionists and clinic owners work in the same system, each with the view their job needs, and a patient portal account is scoped to that patient alone.',
  },
  {
    question: 'Is clinic data isolated from other clinics?',
    answer:
      'Yes. Each clinic’s information is kept separate, and users can access only the records associated with the clinic they are authorised to use.',
  },
  {
    question: 'What does OraMedha mean?',
    answer:
      'OraMedha brings together two ideas: "Ora", inspired by oral and dental care, and "Medha", a Sanskrit word associated with intelligence, wisdom and understanding. The name reflects what we are building — a system that brings greater intelligence and clarity to how a dental clinic is run.',
  },
];
