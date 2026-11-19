export type ProjectCat = 'web' | 'ai' | 'hw';
export type ArtKind = 'diff' | 'flow' | 'notes' | 'bars' | 'books' | 'rails' | 'rfid' | 'radar' | 'boxes' | 'ecg';

export interface Project {
  id: string;
  title: string;
  cats: ProjectCat[];
  tag: string;
  kind: string;
  year?: string;
  desc: string;
  /** Bullet points shown in the case-study panel. */
  highlights?: string[];
  stack: string[];
  art: ArtKind;
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
    id: 'specguard', title: 'SpecGuard', cats: ['web', 'ai'], tag: 'backend · ai', kind: 'API analysis platform', featured: true,
    desc: 'Reads OpenAPI specs and source code, then generates documentation, examples and test cases. Compares API versions to flag breaking changes in endpoints, request schemas and response contracts, and answers questions through a RAG assistant.',
    highlights: [
      'Diffs two API versions and flags breaking changes in endpoints, request schemas and response contracts',
      'Generates documentation, request examples and test cases from the spec and the code',
      'RAG assistant answers questions about the API from its own documents',
    ],
    stack: ['.NET Core', 'FastAPI', 'React', 'PostgreSQL', 'RAG'], art: 'diff', cover: 'projects/specguard.svg', repo: GH,
  },
  {
    id: 'selfhosted', title: 'Self-Hosted AI Support System', cats: ['ai', 'web'], tag: 'ai/ml · backend', kind: 'runs offline', featured: true,
    desc: 'Document Q&A with no cloud calls. Hierarchical chunking, a FAISS semantic index, and Llama-3.2-1B running locally through llama.cpp with quantization and GPU acceleration. Packaged in Docker and covered by 40+ API test cases at an 85% pass rate.',
    highlights: [
      'Hierarchical chunking feeding a FAISS semantic index',
      'Llama-3.2-1B served locally through llama.cpp, quantized and GPU-accelerated',
      'Shipped in Docker, with 40+ API test cases at an 85% pass rate',
    ],
    stack: ['Python', 'FastAPI', 'FAISS', 'llama.cpp', 'Docker'], art: 'flow', cover: 'projects/selfhosted.svg', repo: GH,
  },
  {
    id: 'fundoo', title: 'Fundoo Notes', cats: ['web'], tag: 'full-stack', kind: 'BridgeLabZ',
    desc: 'Notes app with a REST API secured by JWT, with Redis, NLog, NUnit tests and Swagger docs. The Angular frontend covers CRUD, reminders, labels and collaborators.',
    stack: ['ASP.NET Core', 'Angular', 'JWT', 'Redis', 'NUnit'], art: 'notes', repo: GH,
  },
  {
    id: 'jobmatrix', title: 'JobMatrix', cats: ['ai'], tag: 'ai/ml', kind: 'NLP matching',
    desc: 'Extracts text from PDF and DOCX resumes and job descriptions, scores them with TF-IDF and cosine similarity, then ranks the top 5 candidates for shortlisting.',
    stack: ['Python', 'Flask', 'scikit-learn', 'Pandas'], art: 'bars', repo: GH,
  },
  {
    id: 'bookstore', title: 'Bookstore', cats: ['web'], tag: 'backend + web', kind: 'BridgeLabZ',
    desc: 'Online bookstore built on ASP.NET WebForms with ADO.NET data access and a SQL Server database.',
    stack: ['ASP.NET WebForms', 'ADO.NET', 'SQL Server'], art: 'books', repo: GH,
  },
  {
    id: 'iot', title: 'IoT Train Track Switcher', cats: ['hw'], tag: 'hardware', kind: 'IoT',
    desc: 'Servo-driven track switching controlled from an ESP32, with state reported through ThingSpeak.',
    stack: ['ESP32', 'Servo', 'ThingSpeak'], art: 'rails', repo: GH,
  },
  {
    id: 'rfid', title: 'RFID Door Lock', cats: ['hw'], tag: 'hardware', kind: 'access control',
    desc: 'Card-based door lock built around an Arduino Nano and an RFID reader.',
    stack: ['Arduino Nano', 'RFID'], art: 'rfid', repo: GH,
  },
  {
    id: 'thirdeye', title: 'Third Eye', cats: ['hw'], tag: 'hardware', kind: 'assistive tech',
    desc: 'Obstacle detector for visually impaired users. An ultrasonic sensor measures distance and the device answers with a buzzer and a vibration motor.',
    stack: ['Arduino', 'Ultrasonic', 'Buzzer', 'Vibration motor'], art: 'radar', repo: GH,
  },
  {
    id: 'damage', title: 'Deep Object Damage Analysis', cats: ['ai'], tag: 'ai/ml', kind: 'computer vision',
    desc: 'Computer vision project that detects and analyses damage on objects using YOLOv3 and OpenCV.',
    stack: ['Python', 'OpenCV', 'YOLOv3'], art: 'boxes', repo: GH,
  },
  {
    id: 'health', title: 'Healthcare Chatbot', cats: ['ai'], tag: 'ai/ml', kind: 'NLP + classification',
    desc: 'Symptom assessment and disease prediction chatbot built around a decision-tree classifier trained on symptom datasets.',
    stack: ['Python', 'scikit-learn', 'spaCy', 'Pandas'], art: 'ecg', repo: GH,
  },
];

export const PROJECT_FILTERS: { f: 'all' | ProjectCat; label: string }[] = [
  { f: 'all', label: 'all' },
  { f: 'web', label: 'backend + web' },
  { f: 'ai', label: 'ai / ml' },
  { f: 'hw', label: 'hardware' },
];

/** Accent per project: hardware teal, pure AI violet, everything else periwinkle. */
export const projectTone = (p: Project) =>
  p.cats.includes('hw') ? 'var(--c-teal)' : p.cats.includes('ai') && !p.cats.includes('web') ? 'var(--c-violet)' : 'var(--c-peri)';
