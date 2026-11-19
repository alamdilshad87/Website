import { PROJECTS } from './projects';

export interface Skill { name: string; level?: 'learning' | 'basic' }
export interface SkillGroup { c: string; glyph: string; tone: string; span: 'wide' | 'tall' | 'one'; i: Skill[] }

const s = (name: string, level?: Skill['level']): Skill => ({ name, level });

export const SKILLS: SkillGroup[] = [
  { c: 'Backend', glyph: '{ }', tone: 'var(--c-orange)', span: 'wide',
    i: ['ASP.NET Core', 'Web API', 'ADO.NET', 'JWT', 'Redis', 'NLog', 'Swagger', 'NUnit', 'FastAPI', 'Flask'].map((n) => s(n)) },
  { c: 'AI / ML', glyph: '∇', tone: 'var(--c-violet)', span: 'tall',
    i: ['RAG', 'FAISS', 'llama.cpp', 'PyTorch', 'scikit-learn', 'OpenCV', 'YOLOv3', 'spaCy', 'NLTK', 'NumPy', 'Pandas'].map((n) => s(n)) },
  { c: 'Frontend', glyph: '</>', tone: 'var(--c-peri)', span: 'one',
    i: [s('Angular'), s('React'), s('RxJS'), s('HTML5 / CSS3'), s('JavaScript')] },
  { c: 'Languages', glyph: 'λ', tone: 'var(--c-teal)', span: 'one',
    i: ['C#', 'Python', 'Java', 'C++', 'C', 'JavaScript', 'HTML', 'CSS'].map((n) => s(n)) },
  { c: 'Databases', glyph: '▤', tone: 'var(--c-peri)', span: 'one',
    i: [s('SQL Server'), s('MySQL'), s('MongoDB'), s('PostgreSQL', 'basic'), s('Redis'), s('Firestore')] },
  { c: 'Cloud + DevOps', glyph: '⇡', tone: 'var(--c-teal)', span: 'one',
    i: [s('Docker'), s('Git'), s('GitHub'), s('Postman'), s('Render'), s('Vercel'), s('AWS (EC2, S3)', 'basic'), s('Google Cloud'), s('Linux', 'basic')] },
  { c: 'Creative', glyph: '✱', tone: 'var(--c-orange)', span: 'wide',
    i: ['Photoshop', 'Illustrator', 'Figma', 'Premiere Pro', 'After Effects', 'CorelDRAW', 'Photography', 'VFX'].map((n) => s(n)) },
  { c: 'Hardware', glyph: '⏚', tone: 'var(--c-violet)', span: 'one',
    i: ['Arduino', 'ESP32', 'RFID', 'Raspberry Pi', 'ThingSpeak', 'Ultrasonic sensors'].map((n) => s(n)) },
];

const norm = (x: string) => x.toLowerCase().replace(/[^a-z0-9#+]/g, '');

/** Projects whose stack mentions this skill. Short names must match exactly to avoid "C" matching "C#". */
export function usedIn(name: string): string[] {
  const n = norm(name);
  if (n.length < 2) return [];
  if (name === 'Photoshop' || name === 'Illustrator') return ['14 design chapters'];
  return PROJECTS.filter((p) =>
    p.stack.some((t) => {
      const x = norm(t);
      if (n.length <= 4 || x.length <= 4) return x === n;
      return x === n || x.includes(n) || n.includes(x);
    }),
  ).map((p) => p.title);
}
