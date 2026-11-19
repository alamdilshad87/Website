# Md Dilshad Alam | Portfolio

Single-page portfolio for a developer + designer. Built with **Vite, React 19, TypeScript, Tailwind CSS v4, Motion and Lenis**. Output is a static site.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build into dist/
npm run preview    # serve the built dist/
npm run lint
```

## Where things live

```text
index.html               page shell, meta tags, fonts
public/                  served as-is (favicon, design slides, photos, project covers)
src/data/                ALL content: edit these to change the site
  site.ts                name, links, email, résumé path, section list
  projects.ts            work section + case studies (repo links, covers)
  chapters.ts            design reel chapters
  journey.ts             roles for the timeline
  skills.ts              toolbox groups
src/components/          one component per section, plus Nav, Cursor, CommandPalette
src/styles/index.css     design tokens, colour blocks and all section styles
scripts/optimize-images.mjs   turns source images into responsive WebP
assets-src/design/       original design slides (source for public/design)
```

## Common edits

- **Project links / covers:** `src/data/projects.ts`. Every project currently points `repo` at the GitHub profile; replace with each repository URL. Covers for SpecGuard and the Self-Hosted AI system are placeholder SVGs in `public/projects/`; drop real screenshots (1200x750) there and update `cover`.
- **Résumé:** put `resume.pdf` in `public/` and set `resume: 'resume.pdf'` in `src/data/site.ts`. The download button appears automatically.
- **Email:** `email` in `src/data/site.ts` (empty string hides it).
- **Photos:** keep camera originals outside the repo and run
  `npm run images -- "C:/path/to/photo folder"`. Crops and output names are listed at the top of the script.

## Effects

- Hero portrait rebuilt live from ~5,000 particles, as ASCII ("code") or print dots ("halftone"); particles flee the cursor, scatter on click and drift apart on scroll.
- Footer terminal you can type commands into (help, projects, contact, sudo hire-me).
- Sticker marquees, magnetic buttons, custom cursor with labels, smooth scrolling.
- Projects as sticky stacking cards, each opening a case-study drawer.
- Design reel pinned to the page: scrolling moves it sideways; chapter chips, arrows and keys jump to a slide; swipe strip on phones.
- Click-to-inspect Gantt timeline (accordion list on phones).
- Bento toolbox with "used in" tooltips and a ⌘K / Ctrl+K command palette.

All motion is switched off when the visitor has *reduce motion* enabled, and the custom cursor only appears with a mouse.

## Deploy

Any static host works (GitHub Pages, Netlify, Vercel, Cloudflare Pages). Build command `npm run build`, output folder `dist`. Asset paths are relative (`base: './'`), so it also works under a GitHub Pages project URL.

After deploying, add an `og:image` (1200x630) and its absolute URL in `index.html` so links preview well when shared.
