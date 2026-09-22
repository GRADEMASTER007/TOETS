export interface LegalPageItem {
  slug: string; // e.g. '/privacy-policy'
  title: string;
  category: 'core' | 'privacy' | 'rules' | 'ip' | 'commercial' | 'transparency' | 'social';
  categoryLabel: string;
  description: string;
  lastUpdated: string;
  interactiveType?: 'data-deletion' | 'facebook-deletion' | 'tiktok-deletion' | 'data-access' | 'data-correction' | 'data-portability' | 'dmca-takedown' | 'report-abuse' | 'disconnect-social';
  sections: Array<{
    heading: string;
    content: string | string[];
    subsections?: Array<{ title: string; text: string }>;
  }>;
}

export const LEGAL_PAGES_DATA: Record<string, LegalPageItem> = {
  // -------------------------------------------------------------
  // 1. CORE LEGAL PAGES
  // -------------------------------------------------------------
  '/privacy-policy': {
    slug: '/privacy-policy',
    title: 'Privacy Policy',
    category: 'core',
    categoryLabel: 'Core Legal',
    description: 'Comprehensive Privacy Policy detailing personal information collection, processing, security, and international transfers under POPIA, GDPR, and UAE Decree 45.',
    lastUpdated: 'September 22, 2026',
    sections: [
      {
        heading: '1. Introduction & Scope',
        content: [
          'Market Place Hub ("we", "our", or "us"), operating at marketplacehub.company across 54 African Union member states and the United Arab Emirates, is committed to safeguarding the privacy and personal data of our users, buyers, merchants, and service providers.',
          'This Privacy Policy applies to all services, regional country subdomains (e.g., za.marketplacehub.company, ae.marketplacehub.company), mobile interfaces, APIs, and integrated artificial intelligence tools.'
        ]
      },
      {
        heading: '2. Personal Information Collected',
        content: 'We collect information directly provided by you, automatically gathered from your devices, and received through authorized third-party integrations:',
        subsections: [
          { title: 'Account Information', text: 'Full name, email address, password hashes, profile picture, account status, and notification preferences.' },
          { title: 'Contact Information', text: 'Business address, physical location, phone number, WhatsApp contact handle, and verified business registration credentials.' },
          { title: 'Device & Browser Information', text: 'IP address, browser type, operating system version, device identifiers, regional locale, and screen resolution.' },
          { title: 'Log Information & Cookies', text: 'Server access timestamps, visited portal URLs, referring search terms, session identifiers, and preference tokens.' },
          { title: 'Payments & Transactions', text: 'Payment processor transaction tokens, order identifiers, boost subscription durations, currency codes, and billing receipts. Raw credit card numbers are processed directly via PCI-DSS Level 1 certified gateways (PayFast, Yoco, PayPal).' },
          { title: 'Listing & Communications Data', text: 'Product listings, service descriptions, direct seller inquiries, inquiry messages, customer reviews, and customer support tickets.' }
        ]
      },
      {
        heading: '3. AI Features & Synthetic Processing',
        content: [
          'Market Place Hub provides conversational search, trade advisory concierge services, and voice interactions powered by Google Gemini generative models. Prompts submitted to AI tools are processed to generate contextual marketplace results.',
          'We do not sell user prompt data to third parties. Prompts are scrubbed of raw payment credentials and personal sensitive attributes before model inference.'
        ]
      },
      {
        heading: '4. Social Media Integrations (Meta & TikTok)',
        content: [
          'When you connect via Facebook Login or TikTok Login Kit, we receive only the specific scopes you authorize (e.g., public profile name, avatar, verified email address).',
          'We never post to your social accounts without explicit consent. You can unlink your social account or request data deletion at any time via our dedicated compliance endpoints.'
        ]
      },
      {
        heading: '5. International Data Transfers & POPIA / GDPR / UAE Law',
        content: [
          'Because Market Place Hub operates across African trade corridors and the UAE, data may be transferred, stored, and processed across jurisdictions.',
          'South Africa (POPIA Act 4 of 2013): In accordance with Section 72 of POPIA, cross-border transfers occur only to recipients subject to laws or agreements establishing substantially similar adequacy standards.',
          'United Arab Emirates: Processing adheres to UAE Federal Decree-Law No. 45 of 2021 regarding Personal Data Protection.',
          'European Economic Area (GDPR): Standard Contractual Clauses (SCCs) are implemented where applicable for international transfers.'
        ]
      },
      {
        heading: '6. Data Retention & Security Measures',
        content: [
          'We retain personal information for the period necessary to fulfill transactional, tax, fraud-prevention, and legal requirements (typically 5 to 7 years for financial records). Inactive user accounts and associated drafts are archived or securely deleted.',
          'Technical safeguards include TLS 1.3 encryption in transit, AES-256 encryption at rest, tokenized authentication, multi-factor admin access, and role-based Firestore security rules.'
        ]
      },
      {
        heading: '7. Your Statutory Rights & Contacting Us',
        content: [
          'You have the right to access, rectify, port, object to processing, or request deletion of your personal information.',
          'For inquiries or to reach our Information Officer: privacy@marketplacehub.company | Legal & Regulatory Affairs, Market Place Hub, Sandton, South Africa & Business Bay, Dubai, UAE.'
        ]
      }
    ]
  },

  '/terms-of-service': {
    slug: '/terms-of-service',
    title: 'Terms of Service',
    category: 'core',
    categoryLabel: 'Core Legal',
    description: 'Master platform agreement establishing user responsibilities, acceptable use, marketplace rules, dispute resolution, and liability limitations.',
    lastUpdated: 'September 22, 2026',
    sections: [
      {
        heading: '1. Acceptance of Terms',
        content: 'By accessing or utilizing marketplacehub.company, its regional subdomains, or any associated service, you agree to be bound by these Terms of Service, our Privacy Policy, and Community Guidelines. If you do not agree, you must discontinue platform use immediately.'
      },
      {
        heading: '2. Eligibility & Account Registration',
        content: 'You must be at least 18 years of age or possess legal business authority to register an account. You agree to provide accurate, current, and complete registration information and safeguard your authentication credentials. You are strictly responsible for all activity conducted under your account.'
      },
      {
        heading: '3. Marketplace & Service Directory Rules',
        content: [
          'Market Place Hub serves as a multi-sided commercial nexus connecting buyers, vendors, registered businesses, property listers, and certified service artisans.',
          'Vendors warrant that all items, properties, and services posted comply with national consumer protection laws, licensing standards, and AfCFTA rules of origin.',
          'Counterfeit goods, unauthorized pharmaceutical products, stolen merchandise, unlicensed financial schemes, and deceptive listings are strictly prohibited.'
        ]
      },
      {
        heading: '4. AI-Generated Content & Tools',
        content: 'Our AI search, voice concierge, and translation features are automated aids. While we optimize for high precision, AI outputs are provided on an "as-is" basis and should not substitute for licensed legal, tax, architectural, or customs clearing advice.'
      },
      {
        heading: '5. Fees, Subscriptions & Boost Payments',
        content: 'Posting standard listings may be free or subject to regional category caps. Promotional Boost packages (Featured 7-Day, Featured 1-Month, Premium 3-Month) are billed in local currency via approved gateways. Subscriptions renew per stated terms unless cancelled before the renewal date.'
      },
      {
        heading: '6. Limitation of Liability & Disclaimers',
        content: 'To the maximum extent permitted by applicable law, Market Place Hub shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from transactions between buyers and sellers, vendor performance, or third-party service outages.'
      },
      {
        heading: '7. Governing Law & Dispute Resolution',
        content: 'These Terms shall be governed by and construed in accordance with the laws of South Africa and the commercial jurisdiction of the United Arab Emirates, without regard to conflict of law principles. Parties agree to resolve disputes through good-faith mediation prior to formal arbitration.'
      }
    ]
  },

  '/cookie-policy': {
    slug: '/cookie-policy',
    title: 'Cookie Policy',
    category: 'core',
    categoryLabel: 'Core Legal',
    description: 'Detailed disclosure of first-party and third-party cookies, tracking technologies, analytics, and browser preference controls.',
    lastUpdated: 'September 22, 2026',
    sections: [
      {
        heading: '1. What Are Cookies?',
        content: 'Cookies and local storage objects are small data files stored on your browser or device when you visit marketplacehub.company. They enable authentication, remember language and currency preferences, and ensure seamless portal performance.'
      },
      {
        heading: '2. Categories of Cookies We Use',
        content: 'We categorize our cookies into four distinct operational groups:',
        subsections: [
          { title: 'Strictly Essential Cookies', text: 'Required for core security, session state, country subdomain routing, and CSRF protection. These cannot be switched off.' },
          { title: 'Authentication & Account Cookies', text: 'Keep you signed in via Firebase Auth or social login providers, ensuring secure session management.' },
          { title: 'Functional & Preference Cookies', text: 'Store your chosen country (e.g. South Africa, UAE, Kenya), preferred currency, dark/light theme, and saved favorites.' },
          { title: 'Performance & Analytics Cookies', text: 'Help us understand listing view counts, search query efficiency, and page load speeds to continuously improve platform responsiveness.' }
        ]
      },
      {
        heading: '3. Third-Party Cookies',
        content: 'Third-party integrations such as Google Maps, Firebase, PayFast, Yoco, Meta Login, and TikTok Login may set cookies subject to their respective privacy disclosures. We do not permit unauthorized third-party cross-site advertising networks.'
      },
      {
        heading: '4. Managing Your Cookie Preferences',
        content: 'You can adjust your cookie settings at any time via our in-app Cookie Banner or configure your web browser (Chrome, Safari, Firefox, Edge) to block or alert you about cookies. Note that disabling essential cookies may impact platform functionality.'
      }
    ]
  },

  // -------------------------------------------------------------
  // 2. USER DATA & PRIVACY PAGES
  // -------------------------------------------------------------
  '/data-deletion': {
    slug: '/data-deletion',
    title: 'Customer Data Deletion',
    category: 'privacy',
    categoryLabel: 'Privacy & Data',
    description: 'Standard request procedure and working self-service mechanism to delete your account, personal data, and associated marketplace records.',
    lastUpdated: 'September 22, 2026',
    interactiveType: 'data-deletion',
    sections: [
      {
        heading: '1. Account & Personal Data Deletion Process',
        content: [
          'At Market Place Hub, we respect your fundamental right to be forgotten. Any user or vendor may request permanent deletion of their account profile, contact information, uploaded listings, customer reviews, and saved favorites.',
          'Upon receiving and verifying your request, our automated compliance engine purges your personal profile records across our primary datastores within 30 days.'
        ]
      },
      {
        heading: '2. Retention Exceptions Required by Law',
        content: 'Certain records cannot be immediately expunged where retention is required by tax legislation (SARS, UAE FTA), anti-money laundering obligations, or active unresolved transaction disputes.'
      },
      {
        heading: '3. Interactive Deletion Request Form',
        content: 'Please use the interactive form below to submit your deletion request. A unique tracking reference code will be generated immediately for your records.'
      }
    ]
  },

  '/facebook-data-deletion': {
    slug: '/facebook-data-deletion',
    title: 'Facebook Data Deletion Instructions',
    category: 'privacy',
    categoryLabel: 'Privacy & Data',
    description: 'Compliant Meta Platform deletion instructions and status callback verification for users connected via Facebook Login.',
    lastUpdated: 'September 22, 2026',
    interactiveType: 'facebook-deletion',
    sections: [
      {
        heading: '1. Meta Platform Compliance & Callback Mechanism',
        content: [
          'In accordance with Meta Platform Terms and Facebook Login policies, Market Place Hub provides this dedicated data deletion callback endpoint and instructions for users who created accounts or logged in using Facebook.',
          'When you remove our application from your Facebook App Settings, Facebook automatically transmits a signed data deletion request to our servers, or you may initiate it manually using the tool below.'
        ]
      },
      {
        heading: '2. How to Request Deletion via Facebook Settings',
        content: 'Follow these simple steps from your Facebook account:',
        subsections: [
          { title: 'Step 1', text: 'Log into your Facebook account and go to Settings & Privacy > Settings.' },
          { title: 'Step 2', text: 'Scroll down to "Apps and Websites" on the left navigation panel.' },
          { title: 'Step 3', text: 'Find "Market Place Hub" in your active or expired connected apps list.' },
          { title: 'Step 4', text: 'Click "Remove" and check the box to request deletion of data shared with Market Place Hub.' }
        ]
      },
      {
        heading: '3. Manual Facebook Deletion Request & Status Checker',
        content: 'If you want to request immediate deletion of data obtained via Facebook, enter your email or Facebook User ID below. You will receive a unique Confirmation Code and Status URL to track deletion progress.'
      }
    ]
  },

  '/tiktok-data-deletion': {
    slug: '/tiktok-data-deletion',
    title: 'TikTok Data Deletion Instructions',
    category: 'privacy',
    categoryLabel: 'Privacy & Data',
    description: 'Compliant TikTok for Developers instructions for data deletion, scope revocation, and tracking of TikTok Login records.',
    lastUpdated: 'September 22, 2026',
    interactiveType: 'tiktok-deletion',
    sections: [
      {
        heading: '1. TikTok Developer Policy & Data Governance',
        content: [
          'TikTok developer guidelines require developers to safeguard user data, provide clear deletion procedures, and allow users to revoke authorization at any time.',
          'Market Place Hub only collects the minimum authorized scopes (such as basic profile display name and avatar) when you utilize TikTok Login.'
        ]
      },
      {
        heading: '2. Revoking Authorization in the TikTok Mobile App',
        content: 'You can revoke access directly through TikTok at any time:',
        subsections: [
          { title: 'Step 1', text: 'Open the TikTok App on your mobile device.' },
          { title: 'Step 2', text: 'Go to your Profile > tap the Menu icon (three lines) > Settings and Privacy.' },
          { title: 'Step 3', text: 'Select "Security and permissions" > tap "Apps and services permissions".' },
          { title: 'Step 4', text: 'Find "Market Place Hub" and tap "Remove Access".' }
        ]
      },
      {
        heading: '3. Requesting TikTok Data Erasure on Market Place Hub',
        content: 'Use the interactive submission tool below to request total purge of TikTok-derived profile data from our servers. A formal confirmation ticket will be dispatched to your email.'
      }
    ]
  },

  '/data-access': {
    slug: '/data-access',
    title: 'Data Access Request (SAR)',
    category: 'privacy',
    categoryLabel: 'Privacy & Data',
    description: 'Submit a formal Subject Access Request under POPIA Section 23, GDPR Article 15, or UAE Decree 45.',
    lastUpdated: 'September 22, 2026',
    interactiveType: 'data-access',
    sections: [
      {
        heading: '1. Right to Access Personal Data',
        content: 'You have the statutory right to request confirmation of whether we hold personal information about you, receive a copy of that information, and obtain details on third-party processors who have access to your data.'
      },
      {
        heading: '2. Verification & Fulfillment Timelines',
        content: 'To prevent unauthorized data disclosures, we verify your identity prior to releasing personal records. Access reports are prepared in machine-readable format within 30 calendar days of verification.'
      }
    ]
  },

  '/data-correction': {
    slug: '/data-correction',
    title: 'Data Correction Request',
    category: 'privacy',
    categoryLabel: 'Privacy & Data',
    description: 'Submit corrections for inaccurate, incomplete, or outdated personal or business information.',
    lastUpdated: 'September 22, 2026',
    interactiveType: 'data-correction',
    sections: [
      {
        heading: '1. Rectification of Inaccurate Records',
        content: 'Under POPIA Section 24 and GDPR Article 16, you are entitled to request the correction or updating of any inaccurate, misleading, or obsolete personal information held by Market Place Hub.'
      },
      {
        heading: '2. Submitting Supporting Evidence',
        content: 'For business identity changes, company registration updates, or vendor KYC modifications, please submit relevant supporting documentation (e.g. CIPC certificate, Trade License) to expedite review.'
      }
    ]
  },

  '/data-portability': {
    slug: '/data-portability',
    title: 'Data Portability',
    category: 'privacy',
    categoryLabel: 'Privacy & Data',
    description: 'Export your account data, listing history, and customer interactions in standardized machine-readable JSON/CSV formats.',
    lastUpdated: 'September 22, 2026',
    interactiveType: 'data-portability',
    sections: [
      {
        heading: '1. Portable Data Export Right',
        content: 'You may request an export of your personal information, listing records, and transactional metadata in a structured, commonly used, and machine-readable format (JSON or CSV).'
      },
      {
        heading: '2. Direct Machine Transfer',
        content: 'Where technically feasible, our export service compiles your records into an encrypted download bundle accessible via secure link.'
      }
    ]
  },

  '/privacy-rights': {
    slug: '/privacy-rights',
    title: 'Your Privacy Rights',
    category: 'privacy',
    categoryLabel: 'Privacy & Data',
    description: 'Consolidated overview of statutory privacy protections under POPIA, GDPR, CCPA/CPRA, and UAE Federal Decree 45.',
    lastUpdated: 'September 22, 2026',
    sections: [
      {
        heading: '1. Global Privacy Framework Alignment',
        content: 'Market Place Hub unifies compliance across multiple regional statutes to ensure consistent, transparent protection for all users regardless of location.',
        subsections: [
          { title: 'South African POPIA Rights', text: 'Right to be notified of collection, access records, request correction or destruction, object on reasonable grounds, and lodge complaints with the Information Regulator.' },
          { title: 'UAE Personal Data Protection Law (Decree 45)', text: 'Right to obtain information, stop processing, request transfer, demand erasure, and restrict automated decisions.' },
          { title: 'European GDPR Rights', text: 'Articles 15 through 22 guaranteeing access, rectification, erasure ("right to be forgotten"), restriction, data portability, and objection.' },
          { title: 'California CCPA/CPRA Rights', text: 'Right to know, right to delete, right to correct, and right to opt-out of personal data sales or targeted advertising.' }
        ]
      }
    ]
  },

  '/do-not-sell-or-share': {
    slug: '/do-not-sell-or-share',
    title: 'Do Not Sell or Share My Personal Information',
    category: 'privacy',
    categoryLabel: 'Privacy & Data',
    description: 'Opt-out declaration and preference registration for users seeking to restrict commercial data sharing.',
    lastUpdated: 'September 22, 2026',
    sections: [
      {
        heading: '1. Our Pledge: We Do Not Sell Personal Data',
        content: 'Market Place Hub does not sell, rent, or trade your personal information to data brokers or third parties for monetary consideration. We only disclose data to fulfill your marketplace transactions and contracted platform services.'
      },
      {
        heading: '2. Registering Your Opt-Out Preference',
        content: 'If you reside in a jurisdiction granting statutory opt-out rights from cross-context behavioral advertising, you can record your opt-out signal by toggling your privacy preferences or contacting our Information Officer at privacy@marketplacehub.company.'
      }
    ]
  },

  // -------------------------------------------------------------
  // 3. WEBSITE / PLATFORM RULES
  // -------------------------------------------------------------
  '/community-guidelines': {
    slug: '/community-guidelines',
    title: 'Community Guidelines',
    category: 'rules',
    categoryLabel: 'Platform Rules',
    description: 'Core behavioral standards, anti-fraud rules, anti-harassment policies, and integrity protocols across our marketplace.',
    lastUpdated: 'September 22, 2026',
    sections: [
      {
        heading: '1. Safe, Honest & Respectful Commerce',
        content: 'Our mission is to foster fair, transparent cross-border trade between African markets and the UAE. We demand mutual respect, professional communication, and integrity from every buyer, vendor, and service provider.'
      },
      {
        heading: '2. Prohibited Behaviors',
        content: 'The following conduct results in immediate account suspension or legal escalation:',
        subsections: [
          { title: 'Fraud & Scams', text: 'Advance-fee fraud, deceptive pricing, phishing links, counterfeit certificates, fake escrow claims, or identity impersonation.' },
          { title: 'Harassment & Abuse', text: 'Threatening language, discriminatory speech, hate speech, extortion, or unauthorized disclosure of another person\'s private contact details.' },
          { title: 'Marketplace Manipulation', text: 'Review manipulation, fake inquiry generation, deliberate shill bidding, or spamming vendors with unsolicited advertisements.' },
          { title: 'Illegal & Dangerous Goods', text: 'Narcotics, unregistered firearms, pirated digital media, endangered wildlife flora/fauna, or hazardous materials.' }
        ]
      }
    ]
  },

  '/acceptable-use': {
    slug: '/acceptable-use',
    title: 'Acceptable Use Policy',
    category: 'rules',
    categoryLabel: 'Platform Rules',
    description: 'Technical infrastructure rules, API rate limits, security constraints, and automated crawler restrictions.',
    lastUpdated: 'September 22, 2026',
    sections: [
      {
        heading: '1. System Integrity & Security',
        content: 'Users shall not attempt to breach or test system vulnerabilities, reverse-engineer proprietary algorithms, inject malicious scripts, or circumvent authentication controls.'
      },
      {
        heading: '2. Scraping & Automated Access Restrictions',
        content: 'Automated data harvesting, high-frequency screen scraping, and unauthorized bulk crawler indexing that degrades server performance are strictly forbidden without written licensing agreements.'
      }
    ]
  },

  '/user-content-policy': {
    slug: '/user-content-policy',
    title: 'User Content Policy',
    category: 'rules',
    categoryLabel: 'Platform Rules',
    description: 'Rules governing photos, videos, descriptions, ratings, reviews, and promotional materials uploaded to the platform.',
    lastUpdated: 'September 22, 2026',
    sections: [
      {
        heading: '1. Ownership & License Grant',
        content: 'You retain copyright in original photographs, descriptions, and media you upload. By submitting content, you grant Market Place Hub a non-exclusive, worldwide, royalty-free license to display, optimize, and promote your listings across our portals.'
      },
      {
        heading: '2. Accuracy & Authenticity Standards',
        content: 'Listing images must accurately represent the actual product, property, or service offered. Watermarking containing competitor links, deceptive stock photos of unavailable items, or misleading specifications is prohibited.'
      }
    ]
  },

  '/marketplace-policy': {
    slug: '/marketplace-policy',
    title: 'Marketplace Policy',
    category: 'rules',
    categoryLabel: 'Platform Rules',
    description: 'Operational guidelines for buyers and sellers, listing quality thresholds, dispute protocols, and platform interventions.',
    lastUpdated: 'September 22, 2026',
    sections: [
      {
        heading: '1. Seller Requirements & KYC Verification',
        content: 'Sellers operating commercial storefronts, offering heavy machinery, or listing luxury real estate must undergo identity and business verification (KYC Tier 1 / Tier 2) to maintain active badges.'
      },
      {
        heading: '2. Buyer Protections & Safe Trade Protocols',
        content: 'We advise buyers to verify vendor badges, inspect high-value goods or certified properties prior to fund release, and conduct trade communications through official portal channels.'
      }
    ]
  },

  '/seller-terms': {
    slug: '/seller-terms',
    title: 'Seller & Vendor Terms',
    category: 'rules',
    categoryLabel: 'Platform Rules',
    description: 'Contractual terms for registered vendors, storefront management, inventory accuracy, and promotional boost terms.',
    lastUpdated: 'September 22, 2026',
    sections: [
      {
        heading: '1. Vendor Relationship & Independence',
        content: 'Vendors operate as independent business entities. Market Place Hub is not an employer, partner, or joint venturer. Vendors are exclusively liable for fulfillment, local statutory warranties, and tax collection.'
      },
      {
        heading: '2. Pricing, Invoicing & VAT/Taxation',
        content: 'Vendors must display transparent pricing in the appropriate local currency (e.g. ZAR, AED, KES, NGN) inclusive of mandatory sales tax or VAT as prescribed by national fiscal laws.'
      }
    ]
  },

  '/ai-policy': {
    slug: '/ai-policy',
    title: 'AI Usage & Governance Policy',
    category: 'rules',
    categoryLabel: 'Platform Rules',
    description: 'Responsible AI disclosures, model safety guardrails, synthetic generation transparency, and human oversight standards.',
    lastUpdated: 'September 22, 2026',
    sections: [
      {
        heading: '1. AI Deployment on Market Place Hub',
        content: [
          'Market Place Hub leverages Google Gemini AI models to assist users in conversational multi-lingual search, live voice interactions, and trade corridor insights.',
          'AI-assisted summaries are labeled transparently to ensure users distinguish automated assistance from human vendor representations.'
        ]
      },
      {
        heading: '2. Prohibited AI Uses',
        content: 'Users may not employ automated bots or AI tools to generate deceptive product reviews, flood vendors with simulated inquiries, or attempt jailbreaking of platform AI safety filters.'
      }
    ]
  },

  // -------------------------------------------------------------
  // 4. INTELLECTUAL PROPERTY PAGES
  // -------------------------------------------------------------
  '/copyright-policy': {
    slug: '/copyright-policy',
    title: 'Copyright Policy',
    category: 'ip',
    categoryLabel: 'Intellectual Property',
    description: 'Copyright protection, safe harbor provisions, proprietary platform assets, and infringement notices.',
    lastUpdated: 'September 22, 2026',
    sections: [
      {
        heading: '1. Intellectual Property Ownership',
        content: 'All platform code, user interface designs, logos, trademarks, database structures, and editorial materials on marketplacehub.company are protected under domestic and international copyright treaties.'
      },
      {
        heading: '2. Third-Party Content & Respect for Rights',
        content: 'We strictly respect the intellectual property of creators, photographers, and brands. Unauthorized reproduction of copyrighted imagery or proprietary catalogs is grounds for immediate takedown.'
      }
    ]
  },

  '/dmca': {
    slug: '/dmca',
    title: 'DMCA & Copyright Infringement Notice',
    category: 'ip',
    categoryLabel: 'Intellectual Property',
    description: 'Designated copyright agent contact, formal takedown notice specifications, and counter-notification procedure.',
    lastUpdated: 'September 22, 2026',
    interactiveType: 'dmca-takedown',
    sections: [
      {
        heading: '1. Designated Copyright Agent',
        content: 'In accordance with the Digital Millennium Copyright Act (17 U.S.C. § 512) and equivalent global copyright directives, our Designated Agent can be contacted at: copyright@marketplacehub.company | Subject: DMCA Notice of Infringement.'
      },
      {
        heading: '2. Submitting a Valid Notice',
        content: 'A valid infringement notice must include: physical or electronic signature, identification of copyrighted work, URL location of infringing material, your contact details, and a statement of good faith belief.'
      }
    ]
  },

  '/trademark-policy': {
    slug: '/trademark-policy',
    title: 'Trademark Policy',
    category: 'ip',
    categoryLabel: 'Intellectual Property',
    description: 'Rules regarding authentic brand names, registered marks, and strict prohibition of counterfeit merchandise.',
    lastUpdated: 'September 22, 2026',
    sections: [
      {
        heading: '1. Brand Protection & Anti-Counterfeiting',
        content: 'Vendors may not use registered trademarks or brand logos in a manner likely to cause confusion regarding official sponsorship or endorsement. Counterfeits and replica goods are strictly prohibited.'
      }
    ]
  },

  '/intellectual-property': {
    slug: '/intellectual-property',
    title: 'Intellectual Property Policy',
    category: 'ip',
    categoryLabel: 'Intellectual Property',
    description: 'Comprehensive overview of patents, trade secrets, proprietary software, and licensing governance.',
    lastUpdated: 'September 22, 2026',
    sections: [
      {
        heading: '1. Comprehensive IP Protection',
        content: 'Market Place Hub actively protects its patents, proprietary UI systems, AI concierge prompt engineering architectures, and trade secrets across all commercial territories.'
      }
    ]
  },

  '/content-removal': {
    slug: '/content-removal',
    title: 'Content Removal & Takedown Request',
    category: 'ip',
    categoryLabel: 'Intellectual Property',
    description: 'Interactive portal for rights holders, consumers, and law enforcement to request content takedowns.',
    lastUpdated: 'September 22, 2026',
    interactiveType: 'dmca-takedown',
    sections: [
      {
        heading: '1. Expedited Takedown Service',
        content: 'We review reports of copyright infringement, privacy breaches, non-consensual imagery, and defamatory content promptly. Valid claims receive immediate administrative action.'
      }
    ]
  },

  // -------------------------------------------------------------
  // 5. COMMERCIAL / LEGAL PAGES
  // -------------------------------------------------------------
  '/refund-policy': {
    slug: '/refund-policy',
    title: 'Refund & Cancellation Policy',
    category: 'commercial',
    categoryLabel: 'Commercial & Legal',
    description: 'Refund terms for digital promotions, featured boost tiers, vendor storefront subscriptions, and dispute resolutions.',
    lastUpdated: 'September 22, 2026',
    sections: [
      {
        heading: '1. Digital Boost Services & Subscriptions',
        content: [
          'Promotional Boost packages (Featured 7-Day, Featured 1-Month, Premium 3-Month) are digital marketing services executed upon payment confirmation.',
          'Refunds for promotional boosts may be requested within 24 hours of purchase if a technical defect prevented the listing from displaying. Once a boost period has commenced without technical disruption, fees are non-refundable.'
        ]
      },
      {
        heading: '2. Marketplace Physical Transactions',
        content: 'For goods purchased directly from third-party vendors, refund terms are governed by the vendor\'s stated return policy and applicable statutory consumer protection laws (e.g. South African Consumer Protection Act No. 68 of 2008).'
      }
    ]
  },

  '/shipping-policy': {
    slug: '/shipping-policy',
    title: 'Shipping & Delivery Policy',
    category: 'commercial',
    categoryLabel: 'Commercial & Legal',
    description: 'Cross-border logistics guidance, regional courier options, freight corridors, and customs clearing responsibilities.',
    lastUpdated: 'September 22, 2026',
    sections: [
      {
        heading: '1. Cross-Border Freight & Corridors',
        content: 'Market Place Hub facilitates commerce across SADC corridors, AfCFTA routes, and UAE maritime/air cargo channels (e.g. Jebel Ali to Durban or Mombasa). Vendors must disclose realistic handling times, tracking numbers, and incoterms (FOB, CIF, DDP).'
      },
      {
        heading: '2. Customs Duties & Import Taxes',
        content: 'Unless explicitly stated otherwise by the vendor, cross-border shipments may incur customs duties, clearance fees, and import VAT assessed by destination authorities. The recipient is responsible for customs clearance compliance.'
      }
    ]
  },

  '/returns-policy': {
    slug: '/returns-policy',
    title: 'Returns & Exchanges Policy',
    category: 'commercial',
    categoryLabel: 'Commercial & Legal',
    description: 'Framework for physical product returns, return merchandise authorizations (RMA), and vendor mediation.',
    lastUpdated: 'September 22, 2026',
    sections: [
      {
        heading: '1. Defective or Misdescribed Goods',
        content: 'Buyers receiving items that are damaged, materially defective, or not as described are entitled to prompt repair, replacement, or refund in accordance with statutory consumer warranties.'
      }
    ]
  },

  '/payment-policy': {
    slug: '/payment-policy',
    title: 'Payment Policy',
    category: 'commercial',
    categoryLabel: 'Commercial & Legal',
    description: 'Accepted payment gateways, encryption protocols, multi-currency processing, and anti-fraud protections.',
    lastUpdated: 'September 22, 2026',
    sections: [
      {
        heading: '1. Approved Payment Gateways & Currencies',
        content: [
          'We partner with PCI-DSS compliant payment gateways:',
          '• PayFast: South African Rand (ZAR) via Instant EFT, Debit Cards, and Masterpass.',
          '• Yoco: In-app Credit/Debit Card processing for South African merchants.',
          '• PayPal: Global currency processing (USD, EUR, GBP, AED) for cross-border and international buyers.'
        ]
      },
      {
        heading: '2. Payment Security & Fraud Prevention',
        content: 'All transactions utilize 256-bit SSL encryption and 3D Secure / OTP authentication. We do not store full payment card numbers on our servers.'
      }
    ]
  },

  '/subscription-policy': {
    slug: '/subscription-policy',
    title: 'Subscription & Billing Policy',
    category: 'commercial',
    categoryLabel: 'Commercial & Legal',
    description: 'Billing cycles, auto-renewals, plan upgrades/downgrades, and cancellation terms for vendor storefront tiers.',
    lastUpdated: 'September 22, 2026',
    sections: [
      {
        heading: '1. Storefront & Featured Placement Billing',
        content: 'Subscriptions for premium vendor placement are billed on a recurring monthly or quarterly cycle. Invoices and receipts are provided in your Vendor Dashboard.'
      },
      {
        heading: '2. Cancellation Rights',
        content: 'You may cancel recurring subscriptions at any time via your account settings. Cancellation halts future billings while your benefits continue until the end of the active paid period.'
      }
    ]
  },

  '/seller-fees': {
    slug: '/seller-fees',
    title: 'Seller Fees & Commission Policy',
    category: 'commercial',
    categoryLabel: 'Commercial & Legal',
    description: 'Transparent schedule of listing fees, promotional boost costs, and payment gateway processing tariffs.',
    lastUpdated: 'September 22, 2026',
    sections: [
      {
        heading: '1. Standard Listing Allocation',
        content: 'Standard listings are provided free of charge up to designated monthly category quotas, enabling artisans and small enterprises to trade without upfront barriers.'
      },
      {
        heading: '2. Optional Promotional Boost Tiers',
        content: 'Featured Boost plans range from 7-day high-visibility badges to 3-month multi-channel spotlights, clearly priced in local currency at checkout.'
      }
    ]
  },

  '/order-cancellation': {
    slug: '/order-cancellation',
    title: 'Order Cancellation Policy',
    category: 'commercial',
    categoryLabel: 'Commercial & Legal',
    description: 'Buyer and vendor cancellation windows prior to dispatch and handling of out-of-stock items.',
    lastUpdated: 'September 22, 2026',
    sections: [
      {
        heading: '1. Pre-Dispatch Cancellation',
        content: 'Buyers may request order cancellation prior to seller dispatch. Once an item is dispatched or a service appointment confirmed, standard return or rescheduling policies apply.'
      }
    ]
  },

  // -------------------------------------------------------------
  // 6. PLATFORM TRANSPARENCY PAGES
  // -------------------------------------------------------------
  '/about': {
    slug: '/about',
    title: 'About Us',
    category: 'transparency',
    categoryLabel: 'Transparency & Help',
    description: 'Our mission to unify commerce, professional services, and real estate across Africa and the UAE.',
    lastUpdated: 'September 22, 2026',
    sections: [
      {
        heading: '1. Unifying Continental Trade & Global Hubs',
        content: [
          'Market Place Hub (marketplacehub.company) is the premier digital gateway bridging commercial markets across 54 African countries and the United Arab Emirates.',
          'Our platform unites four core economic pillars: Consumer & B2B Marketplace, Verified Business Directory, Accredited Service Artisans, and Premium Real Estate Portals.',
          'With localized currency displays, regional subdomains (e.g. za.marketplacehub.company, ae.marketplacehub.company), and cutting-edge Gemini AI conversational tools, we empower traders of every scale to expand across borders.'
        ]
      }
    ]
  },

  '/contact': {
    slug: '/contact',
    title: 'Contact Us',
    category: 'transparency',
    categoryLabel: 'Transparency & Help',
    description: 'Official corporate communication channels, physical office locations, and operational support desks.',
    lastUpdated: 'September 22, 2026',
    sections: [
      {
        heading: '1. Get in Touch with Market Place Hub',
        content: 'We welcome inquiries from buyers, commercial vendors, corporate partners, and regulatory authorities:',
        subsections: [
          { title: 'General Support Desk', text: 'support@marketplacehub.company | Response time: within 24 business hours.' },
          { title: 'Merchant & Vendor Partnerships', text: 'vendors@marketplacehub.company' },
          { title: 'Privacy & Data Protection Officer', text: 'privacy@marketplacehub.company' },
          { title: 'Regional Headquarters (Africa)', text: 'Market Place Hub Africa Ltd, Sandton City Commercial Tower, Johannesburg, South Africa.' },
          { title: 'Regional Headquarters (Middle East)', text: 'Market Place Hub FZE, Business Bay Commercial Hub, Dubai, United Arab Emirates.' }
        ]
      }
    ]
  },

  '/help': {
    slug: '/help',
    title: 'Help Centre & Knowledge Base',
    category: 'transparency',
    categoryLabel: 'Transparency & Help',
    description: 'Frequently Asked Questions, tutorials for buyers and sellers, and troubleshooting guides.',
    lastUpdated: 'September 22, 2026',
    sections: [
      {
        heading: '1. Frequently Asked Questions',
        content: 'Browse answers to common questions:',
        subsections: [
          { title: 'How do I post a verified listing?', text: 'Click "Post Listing" in the header, select your category pillar, upload high-resolution images, input local pricing, and submit for fast approval.' },
          { title: 'How does multi-currency pricing work?', text: 'Listings automatically display in the official currency of the selected country portal, with instant conversion calculations available.' },
          { title: 'What is KYC Verification?', text: 'KYC confirms a vendor\'s legitimate business identity (CIPC / Trade License), displaying a verified blue shield on all active listings.' }
        ]
      }
    ]
  },

  '/privacy-contact': {
    slug: '/privacy-contact',
    title: 'Privacy Contact & Data Protection Officer',
    category: 'transparency',
    categoryLabel: 'Transparency & Help',
    description: 'Direct contact details for our Information Officer and Data Protection Officer under POPIA and GDPR.',
    lastUpdated: 'September 22, 2026',
    sections: [
      {
        heading: '1. Appointed Data Protection Officer',
        content: 'To exercise statutory rights or address privacy concerns, contact our Information Officer directly at privacy@marketplacehub.company. All inquiries receive formal acknowledgment within 48 hours.'
      }
    ]
  },

  '/report': {
    slug: '/report',
    title: 'Report a Problem',
    category: 'transparency',
    categoryLabel: 'Transparency & Help',
    description: 'Technical issue reporting, broken link notifications, and system feedback submission.',
    lastUpdated: 'September 22, 2026',
    sections: [
      {
        heading: '1. Help Us Improve the Platform',
        content: 'Encountering a bug, display glitch, or payment error? Report technical issues directly to tech@marketplacehub.company with your browser version and relevant screenshots.'
      }
    ]
  },

  '/report-abuse': {
    slug: '/report-abuse',
    title: 'Report Abuse & Suspicious Activity',
    category: 'transparency',
    categoryLabel: 'Transparency & Help',
    description: 'Direct reporting portal for suspected fraud, deceptive listings, scams, harassment, or counterfeit goods.',
    lastUpdated: 'September 22, 2026',
    interactiveType: 'report-abuse',
    sections: [
      {
        heading: '1. Zero Tolerance for Fraud & Abuse',
        content: 'We take fraud, scam listings, and harassment seriously. Reports submitted through this channel are routed to our trust & safety security team for rapid investigation and listing suspension.'
      }
    ]
  },

  '/security': {
    slug: '/security',
    title: 'Platform Security & Infrastructure',
    category: 'transparency',
    categoryLabel: 'Transparency & Help',
    description: 'Overview of enterprise-grade security controls, encryption, DDoS defense, and responsible vulnerability disclosure.',
    lastUpdated: 'September 22, 2026',
    sections: [
      {
        heading: '1. Multi-Layered Defense Architecture',
        content: 'Market Place Hub operates on containerized Google Cloud infrastructure with Cloud Armor DDoS mitigation, end-to-end TLS 1.3 encryption, and hardened Firestore security rules.'
      },
      {
        heading: '2. Responsible Vulnerability Disclosure',
        content: 'Security researchers identifying vulnerabilities are invited to report findings ethically to security@marketplacehub.company. We commit to prompt triage and coordinated disclosure.'
      }
    ]
  },

  '/accessibility': {
    slug: '/accessibility',
    title: 'Accessibility Statement',
    category: 'transparency',
    categoryLabel: 'Transparency & Help',
    description: 'Commitment to inclusive digital access and WCAG 2.1 Level AA conformance.',
    lastUpdated: 'September 22, 2026',
    sections: [
      {
        heading: '1. Digital Inclusivity Commitment',
        content: 'We are committed to making marketplacehub.company accessible to all users, including individuals with visual, auditory, cognitive, or physical impairments.'
      },
      {
        heading: '2. Conformance Standards',
        content: 'Our platform aims to conform to Web Content Accessibility Guidelines (WCAG) 2.1 Level AA specifications, featuring scalable typography, high-contrast dark/light modes, keyboard navigation, and semantic ARIA labeling.'
      }
    ]
  },

  '/legal-requests': {
    slug: '/legal-requests',
    title: 'Law Enforcement & Legal Requests',
    category: 'transparency',
    categoryLabel: 'Transparency & Help',
    description: 'Guidelines for law enforcement agencies, subpoenas, search warrants, and statutory data demands.',
    lastUpdated: 'September 22, 2026',
    sections: [
      {
        heading: '1. Valid Legal Process Requirement',
        content: 'Market Place Hub discloses non-public user records to law enforcement and regulatory authorities only upon receipt of valid judicial subpoenas, court orders, or statutory warrants issued by competent courts.'
      }
    ]
  },

  '/third-party-services': {
    slug: '/third-party-services',
    title: 'Third-Party Services & Integrations',
    category: 'transparency',
    categoryLabel: 'Transparency & Help',
    description: 'Comprehensive inventory of external cloud providers, mapping engines, and AI service providers.',
    lastUpdated: 'September 22, 2026',
    sections: [
      {
        heading: '1. Authorized Service Partners',
        content: 'To deliver our features, we integrate with vetted partners including Google Cloud Platform, Google GenAI (Gemini), Firebase Authentication, PayFast, Yoco, PayPal, Meta Platforms, and TikTok.'
      }
    ]
  },

  '/subprocessors': {
    slug: '/subprocessors',
    title: 'Authorized Subprocessors',
    category: 'transparency',
    categoryLabel: 'Transparency & Help',
    description: 'Official schedule of third-party data processors engaged under GDPR Article 28 and POPIA compliance.',
    lastUpdated: 'September 22, 2026',
    sections: [
      {
        heading: '1. List of Subprocessors',
        content: 'The following entities are authorized to process data on behalf of Market Place Hub:',
        subsections: [
          { title: 'Google Cloud Platform (GCP)', text: 'Hosting, serverless container execution, Cloud Run, and networking infrastructure.' },
          { title: 'Google Firebase', text: 'User identity authentication and Firestore document database management.' },
          { title: 'PayFast (Pty) Ltd', text: 'South African payment gateway and EFT processing.' },
          { title: 'Yoco Technologies', text: 'Credit and debit card processing for South African merchants.' },
          { title: 'PayPal Inc.', text: 'Global international currency transaction settlement.' }
        ]
      }
    ]
  },

  // -------------------------------------------------------------
  // 7. SOCIAL MEDIA INTEGRATION PAGES
  // -------------------------------------------------------------
  '/facebook-data-policy': {
    slug: '/facebook-data-policy',
    title: 'Facebook / Meta Login & Data Policy',
    category: 'social',
    categoryLabel: 'Social Integrations',
    description: 'Specific terms governing Facebook Login, requested Graph API permissions, and data protection compliance.',
    lastUpdated: 'September 22, 2026',
    sections: [
      {
        heading: '1. Facebook Login Purpose & Scope',
        content: 'We offer Facebook Login to streamline account creation and authentication. We request only your public profile (name and avatar) and verified email address. We do not access your friends list, timeline, or private messages.'
      }
    ]
  },

  '/facebook-permissions': {
    slug: '/facebook-permissions',
    title: 'Facebook Permissions & Scopes',
    category: 'social',
    categoryLabel: 'Social Integrations',
    description: 'Granular breakdown of Meta permissions requested, purpose justification, and revocation instructions.',
    lastUpdated: 'September 22, 2026',
    sections: [
      {
        heading: '1. Authorized Meta Permissions',
        content: 'A complete inventory of requested Facebook scopes:',
        subsections: [
          { title: 'public_profile', text: 'Used solely to pre-populate your user display name and profile image.' },
          { title: 'email', text: 'Used as your primary account identifier and to send critical transaction confirmations.' }
        ]
      }
    ]
  },

  '/disconnect-facebook': {
    slug: '/disconnect-facebook',
    title: 'Disconnect Facebook Account',
    category: 'social',
    categoryLabel: 'Social Integrations',
    description: 'Step-by-step instructions and interactive button to unlink your Facebook profile from Market Place Hub.',
    lastUpdated: 'September 22, 2026',
    interactiveType: 'disconnect-social',
    sections: [
      {
        heading: '1. Unlinking Your Facebook Credentials',
        content: 'You can decouple your Facebook identity from Market Place Hub at any time while retaining standard email/password access. Click the interactive button below or follow the Facebook App settings procedure.'
      }
    ]
  },

  '/tiktok-data-policy': {
    slug: '/tiktok-data-policy',
    title: 'TikTok Login & Data Policy',
    category: 'social',
    categoryLabel: 'Social Integrations',
    description: 'Compliance disclosure for TikTok Login Kit, user consent safeguards, and data processing limitations.',
    lastUpdated: 'September 22, 2026',
    sections: [
      {
        heading: '1. TikTok Login Kit Compliance',
        content: 'In compliance with TikTok developer guidelines, Market Place Hub uses TikTok Login strictly to verify identity. We do not obtain video upload authority, private message access, or user engagement tracking data.'
      }
    ]
  },

  '/tiktok-permissions': {
    slug: '/tiktok-permissions',
    title: 'TikTok Permissions & Scopes',
    category: 'social',
    categoryLabel: 'Social Integrations',
    description: 'Detailed explanation of TikTok scopes, consent management, and permission revocation.',
    lastUpdated: 'September 22, 2026',
    sections: [
      {
        heading: '1. Requested TikTok Scopes',
        content: 'We request exclusively:',
        subsections: [
          { title: 'user.info.basic', text: 'Provides your display name, profile avatar, and open_id to establish your verified marketplace buyer or vendor profile.' }
        ]
      }
    ]
  },

  '/disconnect-tiktok': {
    slug: '/disconnect-tiktok',
    title: 'Disconnect TikTok Account',
    category: 'social',
    categoryLabel: 'Social Integrations',
    description: 'Guidance and interactive workflow to unlink your TikTok account and delete TikTok cached tokens.',
    lastUpdated: 'September 22, 2026',
    interactiveType: 'disconnect-social',
    sections: [
      {
        heading: '1. Revoking TikTok Authorization',
        content: 'Disconnecting your TikTok account immediately removes stored access tokens and severs the third-party login integration.'
      }
    ]
  }
};

export const FOOTER_SECTIONS = [
  {
    title: 'Legal (Core)',
    links: [
      { label: 'Privacy Policy', path: '/privacy-policy' },
      { label: 'Terms of Service', path: '/terms-of-service' },
      { label: 'Cookie Policy', path: '/cookie-policy' },
      { label: 'Refund Policy', path: '/refund-policy' },
      { label: 'Shipping Policy', path: '/shipping-policy' },
      { label: 'Accessibility', path: '/accessibility' }
    ]
  },
  {
    title: 'Privacy & Data',
    links: [
      { label: 'Privacy Rights', path: '/privacy-rights' },
      { label: 'Customer Data Deletion', path: '/data-deletion' },
      { label: 'Data Access Request', path: '/data-access' },
      { label: 'Data Correction', path: '/data-correction' },
      { label: 'Data Portability', path: '/data-portability' },
      { label: 'Do Not Sell or Share', path: '/do-not-sell-or-share' }
    ]
  },
  {
    title: 'Platform Rules',
    links: [
      { label: 'Community Guidelines', path: '/community-guidelines' },
      { label: 'Acceptable Use', path: '/acceptable-use' },
      { label: 'User Content Policy', path: '/user-content-policy' },
      { label: 'Marketplace Policy', path: '/marketplace-policy' },
      { label: 'Seller Terms', path: '/seller-terms' },
      { label: 'AI Policy', path: '/ai-policy' }
    ]
  },
  {
    title: 'Intellectual Property',
    links: [
      { label: 'Copyright Policy', path: '/copyright-policy' },
      { label: 'DMCA / Takedown', path: '/dmca' },
      { label: 'Trademark Policy', path: '/trademark-policy' },
      { label: 'IP Policy', path: '/intellectual-property' },
      { label: 'Content Removal', path: '/content-removal' }
    ]
  },
  {
    title: 'Social Integrations',
    links: [
      { label: 'Facebook Data Deletion', path: '/facebook-data-deletion' },
      { label: 'TikTok Data Deletion', path: '/tiktok-data-deletion' },
      { label: 'Facebook Permissions', path: '/facebook-permissions' },
      { label: 'TikTok Permissions', path: '/tiktok-permissions' },
      { label: 'Disconnect Facebook', path: '/disconnect-facebook' },
      { label: 'Disconnect TikTok', path: '/disconnect-tiktok' }
    ]
  },
  {
    title: 'Help & Contact',
    links: [
      { label: 'Help Centre', path: '/help' },
      { label: 'Contact Us', path: '/contact' },
      { label: 'Report Abuse', path: '/report-abuse' },
      { label: 'Report a Problem', path: '/report' },
      { label: 'Security & ISO', path: '/security' },
      { label: 'Privacy Contact', path: '/privacy-contact' },
      { label: 'Legal Requests', path: '/legal-requests' }
    ]
  }
];
