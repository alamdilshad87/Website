export type ChapterCat = 'events' | 'social' | 'print' | 'merch';

export interface Chapter {
  n: number;
  t: string;
  sub: string;
  cat: ChapterCat;
  yr: string;
  /** Base names of files in public/design (without -800/-1500.webp). */
  img: string[];
  d: string;
  /** Optional behind-the-scenes photo shown next to the chapter notes. */
  photo?: { base: string; caption: string };
}

const raw: Omit<Chapter, 'n'>[] = [
  { t: 'Pro Nite', sub: 'Vivek Patil, sand artist', cat: 'events', yr: '2024', img: ['pro-nite'],
    d: 'Poster for the Pro Nite with sand artist Vivek Patil. Warm gradients and deep shadows echo the flow of sand. The brief was to turn a live, fleeting art form into a still image that keeps its energy.',
    photo: { base: 'photos/des-poster', caption: 'The printed poster, signed by Vivek Patil' } },
  { t: 'Comedy Night', sub: 'Maheep Singh, stand-up comedian', cat: 'events', yr: '2024', img: ['comedy-night'],
    d: 'Pro Nite poster for Maheep Singh. Playful emoji motifs, a textured red ground and heavy type carry the mood of the show.' },
  { t: 'Tech Rally + Induction', sub: 'Motorsport event and orientation post', cat: 'events', yr: '2025', img: ['tech-rally'],
    d: 'A tech rally with TVS Apache that built up to AARUUSH, and the induction post that welcomed new members. Teal and green for speed, violet and magenta for the orientation.' },
  { t: 'Instagram Stories', sub: 'Social media design', cat: 'social', yr: '2023 to 2025', img: ['stories'],
    d: 'Vertical, mobile-first stories for festivals, student organisations and campus communities: event promos, greetings, awareness campaigns and announcements.' },
  { t: 'Festive Wall', sub: 'Greetings, one system', cat: 'social', yr: '2023 to 2025', img: ['festive-wall'],
    d: 'Greetings for Easter, Raksha Bandhan, Puthandu, Rath Yatra, Diwali, Krishna Janmashtami and Children’s Day. Each has its own illustration style and palette, all under one brand.' },
  { t: 'Posters', sub: 'Events, ideas, impact', cat: 'print', yr: '2023 to 2025', img: ['posters-1', 'posters-2'],
    d: 'Posters for fests, technical events, workshops and competitions, including MILAN, AARUUSH, Mozofest and Mozo Hack. Each one starts from the event’s own story.' },
  { t: 'Carousels', sub: 'Stories, one swipe at a time', cat: 'social', yr: '2023 to 2025', img: ['carousel-promised-land', 'carousel-aaruush-times'],
    d: 'Swipeable sequences. A documentary-style series on the Arab-Israeli conflict for a Model UN society, and AARUUSH Times, a newspaper-style set for campus and tech news.' },
  { t: 'Workshop Series', sub: 'Speakers, sub-topics, schedules', cat: 'print', yr: '2023 to 2025', img: ['workshop-series'],
    d: 'Promotional posters for workshop series, with speakers, sub-topics and schedules in clear hierarchies. They flex across sizes without losing the identity.' },
  { t: 'Banners', sub: 'Ceremonies and talks', cat: 'print', yr: '2023 to 2025', img: ['banners'],
    d: 'Banners for ceremonies, talks and institutional events. Speakers, dates and venues are arranged to read at large-format distance.' },
  { t: 'Standees', sub: 'Stand tall', cat: 'print', yr: '2024', img: ['standees'],
    d: 'Standees for the LANStorm gaming competitions at AARUUSH ’24. Bold type, character art and prize details that read from a distance.' },
  { t: 'T-Shirts', sub: 'Wear the spirit', cat: 'merch', yr: '2025', img: ['t-shirts'],
    d: 'The SRM Run eco-run tee and AARUUSH organiser and committee tees, with personalised details and close-up print placement.' },
  { t: 'Bag Tags + Placards', sub: 'Small things, sharp details', cat: 'merch', yr: '2022 to 2025', img: ['bag-tags-placards'],
    d: 'Lanyard-style bag tags for AARUUSH events, and table placards for summits and Model UN committees.' },
  { t: 'ID Cards', sub: 'One identity, every team', cat: 'merch', yr: '2024', img: ['id-cards'],
    d: 'Event ID cards for AARUUSH ’24 that share one identity across teams, with role-specific graphics and fields that stay functional.' },
  { t: 'Tickets', sub: 'More than access', cat: 'merch', yr: '2023 to 2025', img: ['tickets'],
    d: 'Registration tickets that carry practical information and the event’s personality, with clear fields and a strong hierarchy.' },
];

export const CHAPTERS: Chapter[] = raw.map((c, i) => ({ ...c, n: i + 1 }));

export const CHAPTER_FILTERS: { f: 'all' | ChapterCat; label: string }[] = [
  { f: 'all', label: 'all' },
  { f: 'events', label: 'events' },
  { f: 'social', label: 'social' },
  { f: 'print', label: 'posters + banners' },
  { f: 'merch', label: 'merch + print' },
];

export const CAT_LABEL: Record<ChapterCat, string> = {
  events: 'events', social: 'social', print: 'posters + banners', merch: 'merch + print',
};

export const pad2 = (n: number) => String(n).padStart(2, '0');
