/** Site-wide settings. Edit these first. */
export const SITE = {
  name: 'Md Dilshad Alam',
  short: 'MDA',
  role: 'Developer + Designer',
  city: 'Chennai, IN',
  build: '2026.11',
  /**
   * Email, reversed and base64-encoded so it never appears as plain text in the
   * page or the bundle. Read it with getEmail(), only after a visitor asks for it.
   * Empty string hides every email row.
   */
  emailEnc: 'bW9jLmxpYW1nQGJvajc4ZGFoc2xpZG1hbGE=',
  /**
   * Web3Forms access key for the contact form (web3forms.com, free). It is safe to
   * publish. Empty: the form falls back to opening the visitor's mail app.
   */
  formKey: 'a72cac77-2e89-48ed-93be-441b7f5d40be',
  /** Résumé PDF in /public, for tech visitors. Empty hides the buttons. */
  resume: 'Md_Dilshad_Alam_Resume.pdf',
  /** Design portfolio PDF in /public, for creative visitors. Empty hides the buttons. */
  portfolio: 'Md_Dilshad_Alam_Design_Portfolio.pdf',
  github: 'https://github.com/alamdilshad87',
  linkedin: 'https://www.linkedin.com/in/alamdilshad87',
  behance: 'https://www.behance.net/alamdilshad87',
  credly: 'https://www.credly.com/users/alamdilshad87',
  coding: [
    { label: 'LeetCode', href: 'https://leetcode.com/u/alam_dilshad87' },
    { label: 'CodeChef', href: 'https://www.codechef.com/users/alam_dilshad87' },
    { label: 'HackerRank', href: 'https://www.hackerrank.com/profile/alam_dilshad87' },
  ],
  certs: ['AWS Academy Cloud Foundations', 'Google Cloud Study Jam', 'Hacktoberfest', 'GirlScript Summer of Code'],
} as const;

export const SECTIONS = [
  { id: 'about', label: 'about' },
  { id: 'projects', label: 'projects' },
  { id: 'design', label: 'design' },
  { id: 'journey', label: 'journey' },
  { id: 'stack', label: 'stack' },
  { id: 'contact', label: 'contact' },
] as const;

/** Decode the protected email address. Call it from event handlers, not during render. */
export const getEmail = () => (SITE.emailEnc ? [...atob(SITE.emailEnc)].reverse().join('') : '');

/** Resolve a file in /public against Vite's base, so paths work on any host. */
export const asset = (p: string) => `${import.meta.env.BASE_URL}${p.replace(/^\//, '')}`;

/** srcset helper for images produced by scripts/optimize-images.mjs */
export const srcSet = (base: string, widths: number[]) =>
  widths.map((w) => `${asset(`${base}-${w}.webp`)} ${w}w`).join(', ');
