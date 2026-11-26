# Copy inventory

Every piece of text in the Claude Design version, in page order. Fill the
**Change to** column (leave it blank to keep the line). When we build, all of
this lives in `src/content/`, so a wording change is a one-file edit.

Lines marked ⚠ are placeholders that must be filled before launch.
The reviewer's suggested rewrites are in
`design-review/2026-11-25-portfolio.md` (Copy suggestions). Copy any you like
into **Change to**.

## Navigation

| ID | Current | Change to |
|---|---|---|
| nav.brand | Kelvin | |
| nav.1 | Projects | |
| nav.2 | Academics | |
| nav.3 | Resume | |
| nav.4 | Contact | |
| nav.cta | GitHub | Resume (filled button, review M4); GitHub becomes an icon link |
| nav.skip | Skip to projects | |

## Hero

| ID | Current | Change to |
|---|---|---|
| hero.title | Hi, I'm Kelvin. | |
| hero.body | I study Computer Science at the University of Southern Maine with a minor in Cybersecurity. I enjoy WebDev, Agentic Engineering, and I'm working my way toward DevOps and security. | |
| hero.cta1 | Curious | |
| hero.cta2 | Resume | |
| hero.seeking (new, B3) | | Seeking internships in software engineering, DevOps and security. ⚠ add season + year |

## 01 Projects

Project cards now show a summary (first sentence(s)) and chips always, with the
rest of the text behind a "More" button (review M1). The words are unchanged.

| ID | Current | Change to |
|---|---|---|
| work.eyebrow | Projects | |
| work.title | Stuff I'm building | |
| work.body | Four projects I'm putting hours into right now, from a campus app to an offline AI mentor. | |
| classping.meta | Flagship · classping.space | |
| classping.body | My main project. ClassPing is built for students around campus. It started as a web app and now has a Chrome extension, a native iOS app I'm writing in SwiftUI, and Android early access. | |
| classping.chips | Web app · Chrome extension · iOS · SwiftUI · Android early access | Web app · Chrome extension · iOS · SwiftUI · Android early access (4 chips, as in the design) |
| classping.cta | Visit ClassPing | |
| ro5n3r.meta | Chrome extension · JavaScript | |
| ro5n3r.body | Ro5n3R replaces Chrome's new tab page with Material-inspired widgets in fun, irregular shapes. A lot of this site's style comes straight from it. | |
| ro5n3r.chips | New tab page · Irregular widgets · Material-inspired | |
| nativex.meta | Desktop app · In progress | |
| nativex.body | An offline coding mentor for people new to agentic coding. It runs a local LLM behind a chat UI and ships with skills and agents you can customize, starting with web design. | |
| nativex.chips | Local LLM · Skills + agents · Windows + macOS | |
| skills4u.meta | Plugin marketplace · Python | |
| skills4u.body | A marketplace of Claude plugins I design. Each one packs skills, agents or scripts for a real job, like UI/UX design and review, project docs, wiki health checks and inventory audits, with evals to check they work. | |
| skills4u.chips | Claude plugins · Agent skills · Evals + tests | |
| card.cta | View on GitHub | View Ro5n3R on GitHub / View NativeX on GitHub / View Skills4u on GitHub (unique labels, review m4) |
| demos.eyebrow | Try it live | |
| demo1.meta | Live code · edit me | |
| demo1.title | Build an expressive button | |
| demo1.body | Change the label, corner radius and fill. The preview and the code update as you go. | |
| demo1.default | Ping me | |
| demo2.meta | Skill file · from Skills4u | |
| demo2.title | Read a real SKILL.md | |
| demo2.body | Every Skills4u plugin is built around a file like this. The description is what tells Claude when to load it. | |
| demo2.extras | Also in this plugin: … | Also in this plugin: (lists come from the real repo files) |
| demo2.cta | Open the repo | |
| work.more | See everything on GitHub | |

## 02 Academics

| ID | Current | Change to |
|---|---|---|
| acad.title | The Journey | |
| acad.body | Persuing a Bachelors Degree in University of Southern Maine. Here's where things stand. | Pursuing a Bachelor's degree at the University of Southern Maine. Here's where things stand. (spelling fixed) |
| acad.1 | Done · Associate Degree · Southern Maine Community College | |
| acad.2 | Done · Transferred to USM · B.S. in Computer Science with a minor in Cybersecurity | |
| acad.3 | Now · Fall 2026 · COS 322 Foundations of Machine Learning, ITT 451 Cyber Laws, Policies and Ethics, ITT 272 Networking I, MAT 295 Linear Algebra | Term heading and courses come from data (`academics.ts`), review m7 |
| acad.4 ⚠ | Next · B.S. Computer Science · Cybersecurity minor. Graduating [Dec 17th 2027] | Next · B.S. Computer Science · Cybersecurity minor. Graduating Dec 17, 2027 |

## 03 Resume

| ID | Current | Change to |
|---|---|---|
| resume.title | The short version | |
| resume.body | Where I've studied and the tools I actually use. Grab the PDF for the full thing. | |
| resume.cta ⚠ | Download PDF ([ADD PDF LINK]) | Download PDF ⚠ shows "PDF coming soon" until public/resume.pdf exists |
| resume.edu | Education: B.S. Computer Science (In progress) · Associate Degree (Completed) | |
| resume.skills.lang | Languages: Python, Java, JavaScript, TypeScript | Languages: Python, Java, JavaScript, TypeScript, Swift ⚠ confirm |
| resume.skills.web | Web: React 18, HTML5, CSS3, Tailwind CSS | |
| resume.skills.tools (new, M3) | | Tools: SwiftUI, Git, Chrome extensions ⚠ confirm; Linux / Security group still open |
| resume.path.title | Where I'm headed | |
| resume.path.1 | Software engineering · Web, extensions and iOS | |
| resume.path.2 | DevOps · Into Linux and self-hosting | |
| resume.path.3 | Cybersecurity · The long-term goal | |

## Contact and footer

| ID | Current | Change to |
|---|---|---|
| contact.title | Let's build something! | |
| contact.body | Got a project, a role, or a question? Hit me up. | |
| contact.github | github.com/Wilch-Kelvin | |
| contact.email ⚠ | [kelvinmusiomi99@gmail.com] | Shown after the page loads (address assembled in the browser to slow scrapers), plus a Copy button |
| contact.linkedin (new, B1) | | LinkedIn → linkedin.com/in/kelvin-wilch-5705b1405 |
| footer.copy | © 2026 Kelvin | © 2026 Kelvin Wilch (full name, review B2) |
| footer.tagline | Design Inspired by Flow | |
| footer.top | Back to top | |

## Revamp to the mockups (2026-11-26, branch `feat/revamp-motion`)

Wording or visibility changes made while matching the five mockups. Kelvin's
existing copy was kept wherever the mockups showed older wording (see the
second table).

| ID | Before | Now |
|---|---|---|
| hero.eyebrow (new) | | CS + Cybersecurity @ USM (lime mono chip above the greeting) |
| hero.portraitAlt (new) | | Kelvin Wilch smiling, with shoulder-length locs and a black headband (alt text of the hero photo) |
| hero.monogram | K (always shown) | K, now only shown if the photo is missing or fails to load |
| hero.seeking | Lime chip under the buttons | Same words, now a quiet line with a pulsing dot (the lime chip style moved to the eyebrow) |
| nav.cta (desktop) | Resume (filled), GitHub icon | GitHub ↗ (filled) + Resume as a normal link, as in the mockup. Mobile unchanged: Resume (filled) + menu (review M4) |
| section numbers | 01 / 02 / 03 inside the shape badges | Removed; plain shape badge + eyebrow, as in the mockups |
| card.more | "More" + chevron | Round chevron only; accessible name is still "More about {project}" |
| project summary + chips + link | Always visible (review M1), ClassPing open by default | Behind the chevron for every card (mockup 2). `openByDefault` in `projects.ts` re-opens one |
| resume.path numbers | 1 / 2 / 3 inside mixed shapes | Removed; three identical cookie nodes joined by a curve |

### Mockup wording **not** applied (Kelvin to decide)

| ID | Live (kept) | Mockup shows |
|---|---|---|
| hero.body | …I enjoy WebDev, Agentic Engineering, and I'm working my way toward DevOps and security. | …I build for the web, the browser and iOS, and I'm working my way toward DevOps and security. |
| hero.cta1 | Curious | See my projects |
| work.body | Four projects I'm putting hours into right now… | Four projects I'm putting real hours into right now… |
| acad.body | Pursuing a Bachelor's degree at the University of Southern Maine. Here's where things stand. | I finished my associate degree at Southern Maine Community College, then transferred to the University of Southern Maine. Here's where things stand. |
| resume.cta | "PDF coming soon" pill until `public/resume.pdf` exists | Download PDF button + "[ADD PDF LINK]" note |
| resume.skills | Languages incl. Swift, plus a Tools group (TODO confirm) | Languages + Web only |
