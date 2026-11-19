/** Site-wide settings. Edit these first. */
export const SITE = {
  name: 'Md Dilshad Alam',
  short: 'MDA',
  role: 'Developer + Designer',
  city: 'Chennai, IN',
  build: '2026.11',
  /** Public email shown in Contact. Empty string hides the row. */
  email: 'alamdilshad87job@gmail.com',
  /** Path or URL of a résumé PDF (e.g. 'resume.pdf' in /public). Empty hides the button. */
  resume: '',
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

/** Resolve a file in /public against Vite's base, so paths work on any host. */
export const asset = (p: string) => `${import.meta.env.BASE_URL}${p.replace(/^\//, '')}`;

/** srcset helper for images produced by scripts/optimize-images.mjs */
export const srcSet = (base: string, widths: number[]) =>
  widths.map((w) => `${asset(`${base}-${w}.webp`)} ${w}w`).join(', ');
