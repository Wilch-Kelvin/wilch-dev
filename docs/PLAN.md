# wilch.dev: codebase plan

Status: **phases 0–6 built locally** (2026-11-26), not pushed or deployed.
See *12. Build status* at the end.
Design source: Claude Design canvas "Kelvin's Portfolio"
(<https://claude.ai/artifact/4kxudMEvdKDjK27KzjNEEt>), saved in
`design/claude-design/project/Main.dc.html`.
Repo: <https://github.com/Wilch-Kelvin/wilch-dev> (empty today). This folder
(`~/Desktop/WilchDev`) is its local clone.

## 1. What we're building

A one-page portfolio (with room for more pages later) for recruiters and
collaborators. Sections, in order: sticky pill nav → Hero → 01 Projects
(4 expandable cards + 2 live demos) → 02 Academics timeline → 03 Resume
(education, skills, career path) → Contact card → footer.

**Success means:** loads fast on a phone (Lighthouse ≥ 95 on all four
scores), works with keyboard and screen reader, every word comes from one
content folder, and it deploys to Vercel from `main`.

## 2. Stack (from the Default Stack, web-only)

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 15 App Router, React 19, **static output** | A portfolio has no server data. Static pages are the fastest and cheapest to host. |
| Language | TypeScript strict, no `any` | Kelvin's rule; catches content typos at build time. |
| Styling | Tailwind CSS v4 + CSS custom properties for tokens | Tokens stay as CSS variables so theme/dark switches are one class on `<html>`. |
| Fonts | `next/font/google`: **Barlow Condensed** (all weights + italics; Kelvin's choice, replaces Roboto Flex) and Google Sans Code | Self-hosted at build, no layout shift. |
| Tests | Vitest + Testing Library, one Playwright journey | Logic tests for the demos; one smoke test that the page renders and links work. |
| Lint/format | ESLint 9, Prettier | |
| Hosting | Vercel (preview per branch, prod from `main`) | A push to `main` is a release. |

No Expo/mobile app: this product is web-only, but it is built **mobile
first** (390 px layouts designed first, then up).

## 3. Folder structure

```
WilchDev/
├─ design/claude-design/        # the Claude Design source (reference only, never imported)
├─ design-review/               # ui-ux-review reports
├─ docs/
│  ├─ PLAN.md                   # this file
│  └─ COPY.md                   # every string, with a "Change to" column
├─ public/
│  ├─ resume.pdf                # ⚠ to add
│  └─ og.png                    # social share image
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx             # fonts, <html> theme class, metadata
│  │  ├─ page.tsx               # composes the sections, nothing else
│  │  ├─ globals.css            # tokens (light/dark), keyframes, motion rules
│  │  ├─ sitemap.ts, robots.ts
│  │  └─ opengraph-image.tsx    # optional: generated OG image
│  ├─ content/                  # ALL copy and data, typed (schema first)
│  │  ├─ schema.ts              # types: Project, Course, Milestone, Skill, Link…
│  │  ├─ site.ts                # name, nav, hero, contact, footer
│  │  ├─ projects.ts            # the 4 projects
│  │  ├─ academics.ts           # timeline + current courses
│  │  ├─ resume.ts              # education, skills, career path
│  │  └─ skills4u.ts            # SKILL.md samples for the demo
│  ├─ lib/                      # pure functions, no React (tested)
│  │  ├─ theme.ts               # palette + dark → class names
│  │  ├─ button-code.ts         # button builder → highlighted code tokens
│  │  ├─ skill-file.ts          # SKILL.md sample → highlighted lines
│  │  └─ *.test.ts
│  ├─ components/
│  │  ├─ ui/                    # Button, Chip, Badge, SectionHeader, Shape (the SVG blobs)
│  │  ├─ layout/                # SiteNav, ScrollProgress, Footer, SkipLink, ThemeToggle
│  │  ├─ sections/              # Hero, Projects, Academics, Resume, Contact
│  │  ├─ projects/              # ProjectCard + one Art component per project
│  │  └─ demos/                 # ButtonBuilder, SkillFileViewer ("use client")
│  └─ hooks/                    # useTheme (system + saved choice)
├─ tests/e2e/home.spec.ts       # Playwright smoke journey
├─ CLAUDE.md                    # project rules for agents
└─ README.md
```

**Rule of thumb:** `content/` says *what*, `lib/` decides *how*, `components/`
only *draws*. Only the two demos and the theme toggle are client components;
everything else is a server component, so almost no JavaScript ships.

## 4. Content schema (written first)

```ts
// src/content/schema.ts (sketch)
export type ExternalLink = { label: string; href: `https://${string}` };
export type Project = {
  id: 'classping' | 'ro5n3r' | 'nativex' | 'skills4u';
  name: string;
  meta: string;              // "Flagship · classping.space"
  summary: string;
  chips: readonly string[];
  link: ExternalLink;
  tone: 'primary' | 'inverse' | 'tertiary' | 'secondary'; // card colour role
  status: 'live' | 'in-progress' | 'early-access';
};
export type Milestone = { state: 'done' | 'now' | 'next'; title: string; detail: string; courses?: readonly Course[] };
export type Course = { code: string; name: string };
```

Copy decisions from `docs/COPY.md` are applied in these files before or while
the components are built.

## 5. Design to code mapping

| Design piece | Production approach |
|---|---|
| Tokens (`--surface`, `--primary`, …) for 3 palettes × light/dark | `globals.css` as CSS variables; Tailwind v4 `@theme` maps them to utilities (`bg-primary`, `text-on-surface`). |
| Palette switcher (Indigo / Ocean / Ember) | Design-tool lever, not a site feature. **Proposal:** ship Indigo + Lime only; keep the other two in CSS as a hidden easter egg or drop them. |
| Dark mode | Follows the system, with a toggle saved in `localStorage` and set before paint (tiny inline script) to avoid a flash. |
| Spring/bounce easings (`linear(...)`) | Copied as CSS variables; they work in all current browsers. |
| Shape morph on hover (radius 36 → 56, button press squish) | Pure CSS, as in the design. |
| Expandable project cards (hover/focus reveals details) | Change to a real `<button aria-expanded>` disclosure so it works on tap and with screen readers; keep hover as an extra on desktop. |
| Scroll-driven reveals, parallax, progress bar | CSS `animation-timeline` with `@supports`; without support, content just shows (no JS fallback needed). |
| Reduced motion | Keep the global `prefers-reduced-motion` kill switch from the design. |
| SVG blobs (cookie, clover, flower, burst) | One `<Shape name="cookie12" />` component with the path data in `lib/shapes.ts`. |
| Button builder demo | Client component; `lib/button-code.ts` builds the code tokens (tested). |
| SKILL.md viewer | Client component; samples in `content/skills4u.ts`, ideally kept in sync with the real repo by copying at build time later. |

## 6. Design role

This site deliberately looks like **Material 3 Expressive / Ro5n3R** (Roboto
Flex, playful shapes, indigo + lime), not ClassPing's look. In the wiki it
should be `design_role: own`. It still meets the signature basics: AA contrast,
44 px targets, reduced motion. **Decided 2026-11-26 (Kelvin, §11):** dark mode is true black (`#000`), and
liquid glass is used on floating chrome (sticky nav, mobile menu sheet, hero
name tag and pause button) with hairlines and solid fallbacks for
`prefers-reduced-transparency`, `prefers-contrast: more` and no
`backdrop-filter`. In-flow cards stay tonal M3 fills with a 1px hairline.

## 7. Placeholders to fill before launch

- `[EXPECTED DATE]`: graduation date.
- `[ADD PDF LINK]`: resume PDF → `public/resume.pdf`.
- `[YOUR EMAIL]`: public contact email (or a contact form; a bare `mailto:` gets scraped by spam bots).
- LinkedIn link (missing from the design; recruiters expect it).
- Domain: `wilch.dev`? (bought or not yet).

## 8. Build phases (each a small branch + PR)

| # | Branch | Delivers | Done when |
|---|---|---|---|
| 0 | `chore/scaffold` | Next.js + TS strict + Tailwind v4 + ESLint/Prettier + Vitest + Playwright, CLAUDE.md, README | `lint`, `typecheck`, `test`, `build` all pass on an empty page |
| 1 | `feat/tokens-layout` | Tokens, fonts, dark mode, nav, skip link, footer, Shape component | Light/dark both pass AA; nav works at 390 px |
| 2 | `feat/content` | `content/` schema + data with the agreed copy | Typecheck proves every section has its data |
| 3 | `feat/sections` | Hero, Projects cards, Academics, Resume, Contact | Matches the design at 390 / 768 / 1440 |
| 4 | `feat/demos` | Button builder + SKILL.md viewer with tests | Logic tests pass; keyboard works |
| 5 | `feat/motion-polish` | Scroll reveals, parallax, progress bar, reduced motion | No layout shift; reduced motion is static |
| 6 | `chore/seo-launch` | Metadata, OG image, sitemap, robots, Vercel project, analytics (Vercel Web Analytics) | Lighthouse ≥ 95; preview URL reviewed by `@ui-ux-review` |
| 7 | release | Merge to `main` → production | Only after Kelvin says go |

## 9. Checks for every phase

`npm run lint` · `npm run typecheck` · `npm test` · `npm run build`, plus the
Playwright smoke test from phase 3 on. Say in each PR what wasn't verified.

## 10. Changes from the design review

From `design-review/2026-11-25-portfolio.md`. These change the build, not
just the wording:

| Finding | Goes into phase |
|---|---|
| Full name in `<title>`, hero, footer; meta description + OG image (B2) | 2, 6 |
| "Seeking [season year] internships" line in the hero (B3) | 2 |
| Working résumé PDF, `mailto:`, LinkedIn (B1) | 2, 3 |
| Project cards: summary + chips always visible, real disclosure button, ClassPing open by default (M1) | 3 |
| Real screenshots / short loops per project (M2) | 3 (Kelvin supplies images) |
| Skills: add Swift/SwiftUI, Git, Linux and a Security group (M3) | 2 (Kelvin confirms) |
| Mobile nav: logo + Résumé + menu below 640 px; Résumé is the filled button (M4) | 1 |
| Motion pause control; spins only on hover (M5) | 5 |
| One focus-ring token on every control (M6) | 1 |
| Timeline and career-path connectors drawn per item, no % positions (M7) | 3 |
| Hover lift only on clickable cards (M8) | 3 |
| "This term" courses come from data, not a hard-coded "Fall 2026" (m7) | 2 |
| Unique link labels ("View NativeX source") (m4) | 2 |
| Add a 404 page and résumé print styles | 6 |

## 11. Open questions for Kelvin

1. Which wording do you want changed? (Fill `docs/COPY.md`; the design review
   in `design-review/` has suggestions.) I made the changes already in the COPY.MD
2. Keep one palette, or keep the palette switcher as a visible feature?
keep one pelette
3. OK with the non-true-black dark surface and no glass (section 6)?
Lets put true black and make sure every element passes for light mode and dark mode
4. Email link vs contact form, and do you want LinkedIn added?
https://www.linkedin.com/in/kelvin-wilch-5705b1405/
kelvinmusiomi99@gmail.com

5. Domain name for production: wilch.dev

Change || For the font change it to this one, it will match the roundness and playful of the matrial UI: 
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">

## 12. Build status (2026-11-26)

| Phase | Branch | State |
|---|---|---|
| 0 | `chore/scaffold` | Done |
| 1 | `feat/tokens-layout` | Done: tokens in `src/theme/colors.ts`, AA tests, glass nav |
| 2 | `feat/content` | Done |
| 3 | `feat/sections` | Done |
| 4 | `feat/demos` | Done |
| 5 | `feat/motion-polish` | Done |
| 6 | `chore/seo-launch` (+ `perf/mobile-lcp`) | Done locally. Not done: Vercel project, Web Analytics, preview review |
| 7 | release | Waiting for Kelvin |

Each branch starts from the previous one, so `docs/build-notes` holds all of it.
Lighthouse (local static build, gzip): mobile 94 / 100 / 100 / 100, desktop
99 / 100 / 100 / 100. Re-measure on the Vercel preview.

Still to fill (all marked `TODO(Kelvin)` in `src/content/`): résumé PDF,
internship season and year, project screenshots, skills to confirm (Swift,
SwiftUI, Git, Chrome extensions; Linux and a Security group still open).
