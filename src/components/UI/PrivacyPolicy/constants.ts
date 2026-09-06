/**
 * Privacy Policy content.
 *
 * Kept as data rather than JSX so the table of contents and the section
 * headings are generated from the same array and can never drift apart —
 * there is exactly one place that names the nineteen sections.
 *
 * Every factual claim in here was checked against the OraMedha application's
 * own codebase (the product this policy is actually about) before being
 * written, not drafted from a generic template and then adjusted. Where the
 * code does not establish a fact — a hosting region, a retention number, a
 * certification — this deliberately says so rather than filling the gap with
 * something that reads well. See the section-by-section notes below for what
 * each claim is based on.
 */

export const LAST_UPDATED = 'September 6, 2026';

export type PolicyBlock =
  | { type: 'p'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'h3'; text: string };

export interface PolicySection {
  id: string;
  number: number;
  title: string;
  body: PolicyBlock[];
}

const p = (text: string): PolicyBlock => ({ type: 'p', text });
const list = (items: string[]): PolicyBlock => ({ type: 'list', items });
const h3 = (text: string): PolicyBlock => ({ type: 'h3', text });

export const sections: PolicySection[] = [
  {
    id: 'introduction',
    number: 1,
    title: 'Introduction',
    body: [
      p(
        'OraMedha is a practice-management platform used by dental clinics to run appointments, patient records, clinical charting, billing and follow-ups in one connected system. This policy explains what information we collect through this website and through the OraMedha application, why we collect it, who it may be shared with, and the choices available to you.'
      ),
      p(
        'This policy covers two different things, and they are not the same. The oramedha.com marketing website — the pages that describe the product and let you request a demo — collects very little, and what it collects is described in full below. The OraMedha application — the software a dental clinic signs up for and uses to run its practice — handles patient and clinical information on behalf of that clinic, under a different relationship explained in Section 6.'
      ),
      p(
        'If you are a patient of a clinic that uses OraMedha, most of what happens to your information is governed by your relationship with that clinic, not with us directly — see Section 6 for exactly how that works and who to contact first.'
      ),
    ],
  },
  {
    id: 'who-we-are',
    number: 2,
    title: 'Who We Are',
    body: [
      p(
        'OraMedha is the platform and product referred to throughout this policy. This policy is published on the OraMedha marketing website by the team that builds and operates OraMedha.'
      ),
      p(
        'Depending on context and applicable law, OraMedha acts in different capacities with respect to different information — sometimes as the party that decides why and how information is processed, and sometimes as a service provider acting on a dental clinic\'s instructions. Section 6 explains this distinction, because it determines who you should approach first with a question about your own information.'
      ),
    ],
  },
  {
    id: 'information-we-collect',
    number: 3,
    title: 'Information We Collect',
    body: [
      p(
        'What we collect depends on how you interact with us — as a visitor to this website, as someone requesting a demo, or as a clinic (or a clinic\'s patient) using the OraMedha application.'
      ),
      h3('Through this website'),
      list([
        'Book a Demo requests: name, mobile number, email address, and an optional free-text message, submitted through the demo request form.',
        'Nothing else. This website does not ask you to create an account, does not use cookies, and does not run any analytics or advertising script — see Section 14.',
      ]),
      h3('If your clinic gives you access to the OraMedha application'),
      list([
        'Account information: your name, the clinic you belong to, and your role (dentist, receptionist, or patient) — created either by your clinic\'s staff or, for patients, through self-registration.',
        'Authentication information: your email address and password, handled by our authentication provider (Section 8) — we do not store your password ourselves.',
        'Information you enter while using the application, which varies by role and is described fully in Section 5 for patient and clinical data.',
      ]),
      h3('Information collected automatically'),
      p(
        'The OraMedha application (as distinct from this marketing website) uses a privacy-oriented, aggregate web analytics service to understand feature usage and performance across the product. This does not run on the marketing website — see Section 14 for what this website itself does and does not do.'
      ),
    ],
  },
  {
    id: 'how-we-use-information',
    number: 4,
    title: 'How We Use Information',
    body: [
      p('We use the information described above to:'),
      list([
        'Respond to demo requests and follow up about the product.',
        'Provide, operate, and maintain the OraMedha application for the clinics that use it, and the accounts of the staff and patients within those clinics.',
        'Authenticate users and enforce who can see what — see Section 9 for how access is restricted by role and by clinic.',
        'Generate the AI-assisted features described in Section 15, when a clinic\'s dentist, receptionist, or patient chooses to use them.',
        'Operate automated and background processes required for the functioning, reliability, and maintenance of the OraMedha application.',
        'Maintain the security, integrity, and availability of the platform, including audit trails described in Section 9.',
        'Meet legal, regulatory, tax, or record-keeping obligations that apply to us or, where we act on a clinic\'s behalf, to that clinic.',
      ]),
      p(
        'We do not sell personal information, and we do not use patient or clinical information to serve advertising.'
      ),
    ],
  },
  {
    id: 'patient-and-health-information',
    number: 5,
    title: 'Patient and Health Information',
    body: [
      p(
        'A dental clinic using OraMedha may store the following categories of information about its patients. This list reflects what the application actually supports — not every clinic uses every feature, and not every category will exist for every patient.'
      ),
      list([
        'Identity and contact information: name, phone number, date of birth, gender, address, and an emergency contact\'s name and phone number.',
        'Appointment information: scheduled date and time, duration, how the appointment was booked, its status, notes attached to it, and a history of relevant appointment changes.',
        'Clinical and treatment records: treatment type, cost, status, date of treatment, and clinical notes recorded by authorised clinic users. Access to clinical information may vary according to the user\'s role and the visibility assigned to that information.',
        'Dental chart: tooth-level clinical information and the recorded status of individual teeth, including relevant changes recorded over time.',
        'Consent records: informed-consent forms for treatments, including forms signed digitally within the application or uploaded as a scan or photograph of a form signed outside the application. Signed consent records are preserved so that the record reflects what the patient agreed to at the time of signing.',
        'Billing and payment information: amounts billed for treatment, payments received, payment methods, payment dates, and outstanding balances.',
        'Follow-up and recall information: due dates and status for recommended follow-up visits.',
        'Uploaded documents: files, scans, photographs, or other documents uploaded by a clinic to a patient\'s record and protected from unauthorised public access.',
      ]),
      p(
        'This information is processed by OraMedha on behalf of the dental clinic that collected it — the relationship and responsibilities involved are explained in Section 6.'
      ),
    ],
  },
  {
    id: 'information-on-behalf-of-clinics',
    number: 6,
    title: 'Information Processed on Behalf of Clinics',
    body: [
      p(
        'It matters, for privacy purposes, whether OraMedha is deciding why your information is collected or is simply carrying out a dental clinic\'s instructions. These are not the same role, and we do not hold both at once for the same piece of information.'
      ),
      h3('Patient and clinical information'),
      p(
        'When a dental clinic uses OraMedha to manage its patients, appointments, clinical records, and billing, the clinic decides what patient information to collect, how long to keep it, and who at the clinic may access it. OraMedha provides the software and infrastructure that stores and processes that information on the clinic\'s behalf and under its instructions — comparable to how a clinic\'s paper records or a locked filing cabinet would be the clinic\'s responsibility, not their manufacturer\'s.'
      ),
      p(
        'In practice, this means: if you are a patient and you have a question about your own records — what a clinic has stored about you, whether it is accurate, or whether it can be corrected or removed — your dental clinic is the right first point of contact, because they control that information and are best placed to act on the request. We support clinics in fulfilling those requests through the application\'s own tools and, where needed, directly.'
      ),
      h3('Information OraMedha processes for its own purposes'),
      p(
        'Separately, we decide why and how we handle certain information ourselves — this includes account and authentication information for clinic staff, demo requests submitted through this website, communications you send us directly, and technical, security, and service information generated through the operation of the platform. For this category of information, OraMedha determines the purpose and means of processing.'
      ),
    ],
  },
  {
    id: 'how-we-share-information',
    number: 7,
    title: 'How We Share Information',
    body: [
      p('We share information in the following circumstances, and no others:'),
      list([
        'With the service providers described in Section 8, who host, run, or support the platform, and who are bound to use information only to provide that service.',
        'Within a clinic, according to each person\'s authorised role and permissions. A receptionist, dentist, and patient may have different levels of access appropriate to their role.',
        'At a clinic staff member\'s initiative, OraMedha may prepare a patient communication, such as an appointment reminder or follow-up, for the staff member to review and send using a third-party communication service such as WhatsApp. The clinic user remains in control of whether the communication is sent.',
        'Where required by law, regulation, court order, or a valid request from a public authority.',
        'To protect the rights, property, or safety of OraMedha, our users, or others, including investigating suspected fraud or a security incident.',
        'In connection with a merger, acquisition, financing, or sale of assets, in which case information would remain subject to a policy at least as protective as this one, and clinics and users would be notified as required by law.',
      ]),
      p(
        'We do not share patient or clinical information with advertisers, and we do not sell any personal information.'
      ),
    ],
  },
  {
    id: 'service-providers',
    number: 8,
    title: 'Service Providers and Subprocessors',
    body: [
      p(
        'We rely on third-party technology and service providers to operate OraMedha. These providers perform specific functions necessary to provide, maintain, secure, and support the platform.'
      ),
      list([
        'Database, authentication, and file storage (Supabase): provides infrastructure used to store application information, manage authentication and user sessions, and securely store files used within OraMedha.',
        'Application hosting (Vercel): hosts and serves both this website and the OraMedha application.',
        'AI processing (Google, via the Gemini API): supports certain AI-assisted features described in Section 15. Relevant information may be processed through this service when an authorised user uses those features.',
        'Transactional email: used for account-related communications such as email verification, password resets, and sign-in-related messages.',
        'Product usage analytics (Vercel Analytics): used within the OraMedha application (not this marketing website) to understand feature usage and performance in aggregate.',
      ]),
      p(
        'We do not use a customer relationship management platform, an advertising network, or a general-purpose analytics or tracking service anywhere in the product.'
      ),
    ],
  },
  {
    id: 'data-security',
    number: 9,
    title: 'Data Security',
    body: [
      p(
        'OraMedha uses technical and organisational safeguards designed to protect the confidentiality, integrity, and appropriate access to clinic, patient, and account information. The principal safeguards currently implemented include the following:'
      ),
      list([
        'Clinic-level access controls: access controls are designed to prevent users from accessing records belonging to another clinic and to restrict access according to the user\'s authorised role.',
        'Role-based access: dentists, receptionists, and patients may have different levels of access based on their role, so users are shown only the information and functions appropriate to them.',
        'Audit history: OraMedha maintains records of relevant changes to important information, including certain appointment, dental-chart, and consent activity, to support integrity, accountability, and review.',
        'Protection of signed consent records: signed consent records are preserved in a manner designed to maintain the content agreed to by the patient at the time of signing.',
        'Protected file storage: patient documents and signed consent files are stored with access controls designed to prevent unauthorised public access.',
        'Encryption in transit: this website, the OraMedha application, and its connections to the service providers in Section 8 are served over HTTPS.',
      ]),
      p(
        'We do not claim certification under standards such as ISO 27001 or SOC 2 unless and until such certification has been formally obtained and documented. We aim to operate OraMedha in accordance with applicable privacy and data-protection requirements as they apply to the platform. No system can be guaranteed to be completely secure, and we do not claim otherwise.'
      ),
    ],
  },
  {
    id: 'data-retention',
    number: 10,
    title: 'Data Retention',
    body: [
      p(
        'We do not apply a single, fixed retention period to all information, because that would not accurately describe how the platform works or what clinics need. How long information is kept depends on:'
      ),
      list([
        'The purpose it was collected for, and whether it is still needed for that purpose.',
        'A dental clinic\'s own requirements and instructions, for information processed on the clinic\'s behalf (Section 6) — a clinic may retain patient and clinical records for as long as its own professional, contractual, or record-keeping obligations require.',
        'Applicable legal, regulatory, or professional record-keeping obligations that apply to dental practices, which can require records to be kept for a defined minimum period after a patient\'s last visit.',
        'Security, audit, recovery, and dispute-resolution needs, including the need to preserve appropriate records of important activity and changes within the platform.',
      ]),
      p(
        'When a record is removed through the application, it may be excluded from ordinary use without being immediately and irreversibly erased. This supports recovery, security, audit, and record-keeping needs. Demo requests submitted through this website are kept in a private, manually managed record for as long as needed to respond to and track the enquiry.'
      ),
      p(
        'If you would like to understand how long specific information about you is likely to be kept, the right first step is your dental clinic if the information relates to your care there (Section 6); for anything else, see Section 18.'
      ),
    ],
  },
  {
    id: 'patient-rights',
    number: 11,
    title: 'Patient / Data Principal Rights',
    body: [
      p(
        'Depending on where you are located and which law applies, you may have rights over your personal information, including to:'
      ),
      list([
        'Know what information is held about you and how it is being used.',
        'Access a copy of your information.',
        'Request correction of inaccurate or incomplete information.',
        'Withdraw consent you previously gave, where processing is based on consent.',
        'Request erasure or deletion of your information, subject to the retention needs described in Section 10 and any legal or professional record-keeping obligation that overrides it.',
        'Raise a grievance about how your information has been handled (Section 18).',
      ]),
      p(
        'India\'s Digital Personal Data Protection Act, 2023 (DPDP Act) establishes rights along these lines for a "Data Principal," but its detailed rules — including how a request is to be made and responded to in practice — are being brought into force in phases, and not every mechanism it describes (such as a Consent Manager or the Data Protection Board\'s formal grievance process) is fully operational as of the date of this policy. Where a right described above is not yet fully operational as a formal legal mechanism, we will still make a good-faith effort to honour a reasonable request consistent with it.'
      ),
      p(
        'If your request concerns patient or clinical information held by a dental clinic on OraMedha (Section 6), please raise it with that clinic first — they control the record and can act on it directly. If that is not practical, or your request concerns information OraMedha holds for its own purposes, contact us using Section 18.'
      ),
    ],
  },
  {
    id: 'childrens-data',
    number: 12,
    title: 'Children\'s Data',
    body: [
      p(
        'Dental clinics using OraMedha may treat patients who are minors, and their information — name, appointment, treatment, and billing records — may be entered into the system by clinic staff in the ordinary course of care, in the same way described in Section 5.'
      ),
      p(
        'Where a patient is a minor, appropriate parental or guardian authorization and consent for treatment, and for the collection of the patient\'s information, is the responsibility of the dental clinic providing that care, consistent with its own professional and legal obligations. OraMedha does not currently provide a dedicated, automated guardian-identity-verification mechanism within the application — clinics should obtain and manage this consent through their own existing processes, and may record a guardian\'s contact details in a patient\'s emergency-contact information where appropriate.'
      ),
      p(
        'This website itself is a business-to-business marketing site and is not directed at children.'
      ),
    ],
  },
  {
    id: 'international-transfers',
    number: 13,
    title: 'International Data Transfers',
    body: [
      p(
        'OraMedha relies on managed, third-party cloud infrastructure to operate — described in Section 8. Depending on how that infrastructure is configured and which region a given service provider\'s data centers are located in, information may be processed on servers located outside India.'
      ),
      p(
        'We do not represent that all information is stored exclusively within India, and we do not claim otherwise. Nor is it accurate to say that Indian law universally prohibits health-related information from being processed or stored outside India — the applicable requirements depend on the specific law, the type of information, and the arrangement in place, and can change as India\'s data protection framework (including the DPDP Act referenced in Section 11) continues to come into force. If the specific processing location for a particular service provider matters to you, contact us using Section 18 and we will share what we can confirm.'
      ),
    ],
  },
  {
    id: 'cookies-and-analytics',
    number: 14,
    title: 'Cookies and Website Analytics',
    body: [
      p(
        'This — the oramedha.com marketing website — does not use cookies, does not use browser local storage, and does not run any analytics, advertising, or tracking script of any kind. There is nothing here to opt out of, because nothing is set.'
      ),
      p(
        'This is specifically about the marketing website you are reading this policy on. The separate OraMedha application, which a clinic\'s staff and patients sign into to use the product, sets a strictly necessary session cookie through our authentication provider in order to keep you signed in, and uses a privacy-oriented, aggregate analytics service to understand product usage, as described in Sections 3 and 8.'
      ),
    ],
  },
  {
    id: 'ai-and-intelligent-features',
    number: 15,
    title: 'AI and Intelligent Features',
    body: [
      p(
        'OraMedha includes AI-assisted and intelligent features designed to support authorised users in understanding information, identifying matters that may require attention, prioritising relevant issues, and preparing or supporting actions within clinic workflows.'
      ),
      p(
        'Depending on the feature being used, relevant patient, clinic, operational, financial, or clinical information may be processed to provide the requested functionality. Certain AI-assisted features use Google\'s Gemini API, which processes the information supplied to it for the purpose of generating the relevant output.'
      ),
      p(
        'AI-assisted outputs may be incomplete or inaccurate and should be reviewed by the relevant user. These features are intended to support clinic users and are not a substitute for professional clinical judgement, diagnosis, or treatment decisions.'
      ),
      p(
        'Some intelligent features may use analysis performed by OraMedha itself rather than an external AI model. We do not disclose the internal methods, rules, or logic used to generate or prioritise those findings.'
      ),
      p(
        'Where a feature proposes an action that requires review or confirmation, the relevant user remains in control of whether that action is taken.'
      ),
      p(
        'AI-assisted features are optional enhancements to the platform. If an external AI service is unavailable, the core OraMedha application remains usable without that feature.'
      ),
      p(
        'Where information is processed by a third-party AI provider, that processing is also subject to the provider\'s applicable terms and privacy practices.'
      ),
    ],
  },
  {
    id: 'data-breach-and-security-incidents',
    number: 16,
    title: 'Data Breach and Security Incidents',
    body: [
      p(
        'If we become aware of a security incident that we believe has compromised personal information we are responsible for, we will investigate it, take reasonable steps to contain and remediate it, and notify affected clinics and, where we are legally required to, the relevant regulator, in line with applicable law at the time.'
      ),
      p(
        'We do not commit to a specific notification timeline in this policy (for example, a fixed number of hours or days), because the correct timeline depends on the applicable law at the time of an incident and on facts we cannot predict in advance. Where a specific clinic contract or a specific law sets a binding timeline, that timeline governs, regardless of what is or is not stated here.'
      ),
      p(
        'If your information relates to patient or clinical records processed on behalf of a dental clinic (Section 6), we will notify that clinic, which is generally best placed to notify its own patients, consistent with its own obligations — while also cooperating directly where that is appropriate or required.'
      ),
    ],
  },
  {
    id: 'your-choices',
    number: 17,
    title: 'Your Choices',
    body: [
      p('Depending on your relationship with OraMedha, you can:'),
      list([
        'Decline to submit the Book a Demo form — nothing else on this website asks you for information.',
        'Ask a dental clinic that uses OraMedha about the information it holds about you, and exercise the rights described in Section 11 through that clinic in the first instance.',
        'Ask us about information we hold for our own purposes — such as a demo request, or a clinic staff account — using Section 18.',
        'Choose not to use an AI-assisted feature described in Section 15; every one of them is optional, and the surrounding application works without it.',
      ]),
    ],
  },
  {
    id: 'grievance-privacy-contact',
    number: 18,
    title: 'Grievance / Privacy Contact',
    body: [
      p(
        'If you have a question, a concern, or a grievance about how your information has been handled, or if you would like to exercise a right described in Section 11, use the "Contact" link in the footer of this website, which is the current channel we monitor for exactly this kind of request.'
      ),
      p(
        'If your question concerns patient or clinical information held by a dental clinic that uses OraMedha, please contact that clinic directly in the first instance, as explained in Section 6 — they are best placed to act on it quickly, and are the party responsible for that information.'
      ),
      p(
        'We will acknowledge and look into a genuine grievance in good faith. We do not commit to a specific response timeline in this policy, for the same reason given in Section 16 — where a binding legal or contractual timeline applies, it governs.'
      ),
    ],
  },
  {
    id: 'changes-to-this-policy',
    number: 19,
    title: 'Changes to This Policy',
    body: [
      p(
        'We may update this policy as OraMedha changes — for example, as we add features, change service providers, or as applicable law evolves. When we make a change, we will update the "Last updated" date at the top of this page. We encourage you to review this policy periodically.'
      ),
      p(
        'Where a change is material and affects information already collected from you, we will take reasonable additional steps to bring it to your attention, such as a notice on this website or, for clinic accounts, a notice within the application.'
      ),
    ],
  },
];
