export type ProjectCat = 'web' | 'ai' | 'hw';
export type ArtKind = 'diff' | 'flow' | 'notes' | 'bars' | 'rails' | 'ecg';
export type CardColor = 'peri' | 'teal' | 'paper' | 'orange' | 'violet';

export interface Project {
  id: string;
  title: string;
  cats: ProjectCat[];
  tag: string;
  kind: string;
  desc: string;
  /** Bullet points shown on the card and in the case-study panel. */
  highlights?: string[];
  stack: string[];
  art: ArtKind;
  /** Card background in the stacked Projects section. */
  color: CardColor;
  /** Cover image in /public. Falls back to the drawn art when missing. */
  cover?: string;
  /** TODO: replace with each project's own repository URL. */
  repo?: string;
  demo?: string;
  featured?: boolean;
}

const GH = 'https://github.com/alamdilshad87';

export const PROJECTS: Project[] = [
  {
    id: 'specguard', title: 'SpecGuard', cats: ['web', 'ai'], tag: 'backend · ai', kind: 'API analysis platform', featured: true, color: 'peri',
    desc: 'APIs change, and clients break without warning. SpecGuard reads an OpenAPI spec alongside the source code and turns it into documentation, tests and a clear list of what changed between versions.',
    highlights: [
      'Diffs two API versions and flags breaking changes in endpoints, request schemas and response contracts',
      'Generates documentation, request examples and test cases from the spec and the code',
      'RAG assistant answers questions about the API from its own documents',
    ],
    stack: ['.NET Core', 'FastAPI', 'React', 'PostgreSQL', 'RAG'], art: 'diff', cover: 'projects/specguard.svg', repo: GH,
  },
  {
    id: 'selfhosted', title: 'Self-Hosted AI Support System', cats: ['ai', 'web'], tag: 'ai/ml · backend', kind: 'runs offline', featured: true, color: 'teal',
    desc: 'A support assistant for teams that can’t send their documents to the cloud. It answers questions from internal docs with a small language model that runs entirely on local hardware.',
    highlights: [
      'Hierarchical chunking feeding a FAISS semantic index',
      'Llama-3.2-1B served locally through llama.cpp, quantized and GPU-accelerated',
      'Packaged in Docker and covered by 40+ API test cases',
    ],
    stack: ['Python', 'FastAPI', 'FAISS', 'llama.cpp', 'Docker'], art: 'flow', cover: 'projects/selfhosted.svg', repo: GH,
  },
  {
    id: 'fundoo', title: 'Fundoo Notes', cats: ['web'], tag: 'full-stack', kind: 'BridgeLabZ', color: 'paper',
    desc: 'A Keep-style notes app built during BridgeLabZ training. The ASP.NET Core API handles auth with JWT, caching with Redis and logging with NLog, with NUnit tests and Swagger docs. The Angular frontend covers notes, reminders, labels and collaborators.',
    stack: ['ASP.NET Core', 'Angular', 'JWT', 'Redis', 'NUnit'], art: 'notes', repo: GH,
  },
  {
    id: 'jobmatrix', title: 'JobMatrix', cats: ['ai'], tag: 'ai/ml', kind: 'NLP matching', color: 'orange',
    desc: 'Reads PDF and DOCX résumés, scores each one against a job description with TF-IDF and cosine similarity, and ranks the top five candidates for a shortlist.',
    stack: ['Python', 'Flask', 'scikit-learn', 'Pandas'], art: 'bars', repo: GH,
  },
  {
    id: 'iot', title: 'IoT Train Track Switcher', cats: ['hw'], tag: 'hardware', kind: 'IoT', color: 'violet',
    desc: 'A prototype that switches railway tracks with servo motors driven by an ESP32, and reports every switch’s position to a live ThingSpeak dashboard.',
    stack: ['ESP32', 'Servo', 'ThingSpeak'], art: 'rails', repo: GH,
  },
  {
    id: 'health', title: 'Healthcare Chatbot', cats: ['ai'], tag: 'ai/ml', kind: 'NLP + classification', color: 'peri',
    desc: 'A chatbot that asks about your symptoms and suggests likely conditions, using a decision-tree classifier trained on symptom datasets.',
    stack: ['Python', 'scikit-learn', 'spaCy', 'Pandas'], art: 'ecg', repo: GH,
  },
];

/** Accent per project: hardware teal, pure AI violet, everything else periwinkle. */
export const projectTone = (p: Project) =>
  p.cats.includes('hw') ? 'var(--c-teal)' : p.cats.includes('ai') && !p.cats.includes('web') ? 'var(--c-violet)' : 'var(--c-peri)';
