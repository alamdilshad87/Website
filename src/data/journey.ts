export type LaneKey = 'eng' | 'aar' | 'srk' | 'edu';
export type Group = 'eng' | 'cre' | 'edu';

export interface Role {
  id: string;
  lane: LaneKey;
  org: string;
  role: string;
  /** 'YYYY-MM' start month */
  s: string;
  /** 'YYYY-MM' end month, inclusive, or 'now' */
  e: string;
  note: string;
  photo?: { base: string; caption: string };
}

export const ROLES: Role[] = [
  { id: 'r1', lane: 'eng', org: 'BridgeLabZ', role: '.NET Developer with Angular', s: '2025-10', e: '2026-01',
    note: 'Four-month internship and training. Built the Fundoo Notes API and its Angular frontend, alongside smaller .NET exercises in payroll, data parsing and testing.' },
  { id: 'r2', lane: 'aar', org: 'AARUUSH', role: 'Volunteer', s: '2022-10', e: '2023-09', note: 'Started on the ground team of SRMIST’s national techno-management fest.' },
  { id: 'r3', lane: 'aar', org: 'AARUUSH', role: 'Committee Member, Creatives and Highlights', s: '2023-09', e: '2024-10', note: 'Designed posters, social creatives and highlight content for the fest.' },
  { id: 'r4', lane: 'aar', org: 'AARUUSH', role: 'Head of Creatives', s: '2024-09', e: '2025-09', note: 'Ran the creatives team and mentored 100+ members.',
    photo: { base: 'photos/team-aaruush', caption: 'Team AARUUSH, main stage' } },
  { id: 'r5', lane: 'aar', org: 'AARUUSH', role: 'Organiser', s: '2025-04', e: '2026-04', note: 'Mentored 250+ members across the organising team.',
    photo: { base: 'photos/aaruush-organiser', caption: 'AARUUSH ’25' } },
  { id: 'r6', lane: 'srk', org: 'SRMKZILLA', role: 'Editorial (GFX) Member', s: '2023-09', e: '2024-10', note: 'Designed graphics and editorial posts for SRMIST’s open-source community.' },
  { id: 'r7', lane: 'srk', org: 'SRMKZILLA', role: 'Editorial Lead', s: '2024-10', e: '2025-09', note: 'Led the editorial and graphics team, from briefs to final posts.' },
  { id: 'r8', lane: 'srk', org: 'SRMKZILLA', role: 'Mentor', s: '2025-09', e: 'now', note: 'Guiding the next editorial team, with a focus on consistent design.' },
  { id: 'r9', lane: 'edu', org: 'SRMIST Kattankulathur', role: 'B.Tech, Computer Science and Engineering', s: '2022-06', e: '2026-05',
    note: 'Graduated in 2026 with a CGPA of 8.99.', photo: { base: 'photos/graduation', caption: 'Convocation, SRMIST' } },
];

export const LANES: { k: LaneKey; name: string; grp: string; g: Group; c: string }[] = [
  { k: 'eng', name: 'BridgeLabZ', grp: 'engineering', g: 'eng', c: 'var(--c-teal)' },
  { k: 'aar', name: 'AARUUSH', grp: 'creative + leadership', g: 'cre', c: 'var(--c-orange)' },
  { k: 'srk', name: 'SRMKZILLA', grp: 'creative + leadership', g: 'cre', c: 'var(--c-violet)' },
  { k: 'edu', name: 'SRMIST', grp: 'education', g: 'edu', c: 'var(--c-peri)' },
];

/* ---- month maths. The chart spans START to the end of the year after the latest role. ---- */
const START = { y: 2022, m: 6 };
const toIdx = (s: string) => {
  const [y, m] = s.split('-').map(Number);
  return (y - START.y) * 12 + (m - START.m);
};
const now = new Date();
export const NOW_IDX = (now.getFullYear() - START.y) * 12 + now.getMonth() + 1 - START.m;
const lastEnd = Math.max(NOW_IDX + 1, ...ROLES.map((r) => (r.e === 'now' ? 0 : toIdx(r.e) + 1)));
/** Total months shown, rounded up to the end of a calendar year. */
export const TOTAL = lastEnd + ((12 - ((lastEnd + START.m - 1) % 12)) % 12);
export const YEARS = Array.from({ length: Math.ceil((TOTAL + START.m - 1) / 12) }, (_, i) => START.y + i);
export const yearPos = (y: number) => Math.max(0, ((y - START.y) * 12 - (START.m - 1)) / TOTAL);

export const startIdx = (r: Role) => toIdx(r.s);
export const endIdx = (r: Role) => (r.e === 'now' ? Math.min(TOTAL, NOW_IDX + 1) : toIdx(r.e) + 1);

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const fmt = (s: string) => (s === 'now' ? 'present' : `${MONTHS[Number(s.split('-')[1]) - 1]} ${s.split('-')[0]}`);
export const duration = (r: Role) => {
  const m = endIdx(r) - startIdx(r);
  const y = Math.floor(m / 12), mm = m % 12;
  return [y ? `${y} yr${y > 1 ? 's' : ''}` : '', mm ? `${mm} mo` : ''].filter(Boolean).join(' ');
};
