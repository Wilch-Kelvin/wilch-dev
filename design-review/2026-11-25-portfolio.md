# UI/UX review: portfolio design (2026-11-25)

Reviewer: `ui-ux-review` agent. Target: `design/claude-design/project/Main.dc.html`.
Read from source only (not rendered), so mobile notes need a real 375 px check.

## Scores

| Area | Score | Reason |
|---|---|---|
| Flow | 6/10 | Good order, but résumé and contact (the recruiter's two jobs) are dead ends today. |
| Accessibility | 6/10 | Skip link, reduced motion, labels, 44 px targets. Gaps: endless motion with no pause, missing button focus rings, weak rings on dark cards, details hidden until hover. |
| Signature fit | 5/10 | Material 3 Expressive, not the signature. Fine for a personal site if chosen on purpose. |
| Distinctiveness | 8.5/10 | Morphing shapes, spring radii and live demos. Weak spot: abstract art instead of real product screens. |

## Blockers

- **B1 Placeholders and dead links.** Download PDF links to `#resume`; email is `[YOUR EMAIL]` linking to itself; `[EXPECTED DATE]`. Fix: real PDF with `download` + "Updated Nov 2026", real `mailto:`, add LinkedIn, fill the date.
- **B2 Full name missing.** Only "Kelvin" in nav, H1, footer, title. Fix: "Kelvin Wilch | Computer Science and Cybersecurity student" title, full name in hero, meta description, OG image.
- **B3 No ask.** Hero never says what Kelvin is looking for. Fix: "Seeking [season year] internships in software engineering, DevOps and security."

## Major

- **M1** Project details hidden behind hover. Show summary + chips always; real `<button aria-expanded>` disclosure; ClassPing open by default.
- **M2** Cards show decoration, not products. Add real screenshots or short loops with alt text.
- **M3** Résumé doesn't back the pitch: no Swift/SwiftUI, Git, Linux, no security evidence, no outcomes. "Cybersecurity: the long-term goal" undersells it.
- **M4** Mobile nav wraps to 2–3 sticky rows. Below ~640 px: logo + Résumé + menu. Make Résumé/Contact the filled button, not GitHub.
- **M5** ~20 endlessly spinning shapes with no visitor control (WCAG 2.2.2). Add a pause control or spin only on hover; keep reduced-motion rule.
- **M6** Focus ring only on links; buttons/inputs use browser default; `--primary` ring ~2:1 on dark cards. One two-ring token on every control.
- **M7** Academics timeline dots hard-coded at 4-column percentages; misaligned at ~900–1090 px. Career curve has the same issue. Draw connectors per item.
- **M8** Hover lift on cards that aren't clickable. Scope it to interactive cards.

## Minor

- m1 Skills4u tile names and viewer tab names differ. Use one set.
- m2 Inventory description has literal quote marks (data bug).
- m3 "Read a real SKILL.md" shows only the frontmatter.
- m4 "View on GitHub" ×3 — same accessible name. Make labels unique.
- m5 Button builder code uses `class="btn"` / `var(--primary)`; no Copy or Reset.
- m6 12–13 px mono labels are small.
- m7 "Fall 2026" hard-coded; wrong from January 2027.
- m8 Ember palette contrast unchecked.
- m9 Contact heading cramped at 375 px.

## Polish

- Keep "Built with a lot of rounded corners."; maybe add "Built with Next.js, deployed on Vercel".
- If smooth scroll is added, gate it on `prefers-reduced-motion: no-preference`.
- Test the "Kelvin." width animation for layout shift while fonts load.

## Signature fit

Roboto Flex instead of geometric sans, 36–56 px morphing cards, `#131218` dark (not true black), tonal fills (no glass). Springs and reduced motion match. Treat it as its own identity and record that in CLAUDE.md. The "Ocean" palette here (`#00677F`) isn't ClassPing's Ocean; rename it if kept.

## Copy suggestions

Facts in [brackets] are for Kelvin to supply.

| Where | Current | Suggested |
|---|---|---|
| Hero chip | CS + Cybersecurity @ USM | Computer Science student · Cybersecurity minor · University of Southern Maine |
| H1 | Hi, I'm Kelvin. | Kelvin Wilch. I build software and I'm learning to secure it. |
| Hero body | …working my way toward DevOps and security. | …I build web apps, browser extensions and an iOS app, and I'm focused on DevOps and security. Seeking [season year] internships. |
| Hero buttons | See my projects / Resume | View projects / Download résumé (PDF) |
| Nav button | GitHub | Résumé or Contact (GitHub as a plain link) |
| Projects H2 | Stuff I'm building | Selected projects |
| Projects sub | …putting real hours into right now… offline AI mentor. | Four projects I'm actively building, from a campus app to an offline coding assistant. |
| ClassPing | My main project. ClassPing is built for students around campus. | A [problem it solves] for [who]. Started as a web app; now also a Chrome extension, a native SwiftUI iOS app and Android early access. [N users, if true]. |
| Ro5n3R | …Material-inspired widgets in fun, irregular shapes… | A Chrome extension that replaces the new tab page with customisable widgets in expressive shapes. Built in JavaScript with Chrome's extension APIs. Its design language is the basis for this site. |
| NativeX | An offline coding mentor for people new to agentic coding… | A desktop app that helps beginners learn to code with AI, entirely offline. A local language model runs behind a chat interface, with customisable lesson modules, starting with web design. |
| Skills4u | A marketplace of Claude plugins I design… | A collection of reusable add-ons for AI coding assistants (Claude plugins). Each automates a real workflow (UI review, docs, wiki and inventory audits) and is covered by automated tests and evaluations. |
| Card buttons | View on GitHub ×3 / Open the repo | View Ro5n3R source / View NativeX source / View Skills4u on GitHub (say if a repo is private) |
| Demo labels | Live code · edit me / Try it live | Interactive demo + one line on what it shows |
| Demo 2 title | Read a real SKILL.md | Inside a Skills4u plugin |
| Demo extras | Also in this plugin: … | Also included: … (shorter) |
| More link | See everything on GitHub | More projects on GitHub |
| Academics H2 | The Journey | Education |
| Academics intro | I finished my associate degree… Here's where things stand. | Associate degree in [field], Southern Maine Community College ([year]). Now a B.S. student in Computer Science at the University of Southern Maine. |
| Timeline | "Transferred to USM" and "Next: B.S." repeat the degree | Merge: In progress · B.S. Computer Science, Cybersecurity minor · Expected [month year]; courses under "This term" |
| Resume H2 | The short version | Résumé |
| Resume sub | …the tools I actually use. Grab the PDF… | Education, skills and focus areas. The PDF has the full detail. |
| Download | Download PDF | Download résumé (PDF) |
| Career card | Where I'm headed: …Into Linux and self-hosting / The long-term goal | Focus areas: Software engineering (web, extension and iOS apps) · DevOps (Linux, deployment, self-hosting) · Security (secure engineering and defence, cybersecurity minor) |
| Contact H2 | Let's build something. | Hiring or collaborating? Let's talk. |
| Contact body | …Hit me up. | Reach out about an internship, a project or my work. [I usually reply within N days.] |
| Footer | © 2026 Kelvin | © 2026 Kelvin Wilch |
| Skip link | Skip to projects | Skip to main content |

## Hard to carry into code

1. Design Component runtime (`<x-dc>`, `<sc-for>`, `{{ }}`, `DCLogic`) → rebuild in React; palette/dark/motion are editor props, not site features.
2. Inline styles repeated dozens of times → `Chip`, `Button`, `Card`, `SectionHeader`, `ShapeBadge`, one shape sprite; tokens in one theme file.
3. Ship one palette (Indigo + Lime).
4. Fonts: confirm `next/font/google` exposes Roboto Flex `wdth`/`opsz` and Google Sans Code; else `next/font/local`.
5. Scroll-driven animation isn't in Firefox by default; `@supports` fallback must leave content visible.
6. `linear()` springs degrade to no bounce; fine.
7. Content in data files, not JSX (fixes "Fall 2026" staleness); consider reading real SKILL.md at build time.
8. Only demos (and disclosures / theme toggle) are client components.
9. Profile ~20 infinite animations on a mid-range phone.
10. Rebuild hard-coded timeline geometry from the DOM.
11. Add favicon, metadata, OG image, robots, 404, résumé print styles, PDF in `public/`.
12. Only real "state" is a 404 page.
13. Check Ro5n3R, NativeX and skills4u repos are public before launch.

## Top 3

1. Make the page work for recruiters (B1–B3).
2. Prove the work (M1–M3).
3. Cut jargon with the copy table; motion control (M5) and focus rings (M6).
