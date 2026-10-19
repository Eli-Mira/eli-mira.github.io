# ART DIRECTION — B / Impact frame

**Status:** Phase 2 production art direction (approved).  
**Reference:** `MASTER_BRIEF.md`, `../ART_DIRECTION.md` (Phase 1), `../proposals/b-impact-frame.html`, `../proposals/prototype.css`.  
**Approved by:** Eli (owner). Phase 3 reference implementation must match this document.

---

## 1. Identity contract

- ELI is the protagonist. His figure is the original anonymous faceted silhouette at `public/artwork/eli-abstract.svg` — no face, no identifying clothing, no likeness.
- LAIN is an ASCII signal identity. She appears as scripted typographic states, not as an illustrated character or a live model connection.
- The narrative line is literal and exact: **BUILT BY HUMAN. AMPLIFIED BY AI.**
- The core ethos is literal and exact: **ELI BUILDS. LAIN EXECUTES. TOGETHER, THEY EVOLVE.**
- No biography, no personal disclosures, no metrics, no fabricated achievements, no private model inventory, no repository secrets, no deployed URL. These stay local until explicitly approved.
- No copied anime artwork, no game assets, no proprietary layouts, no generated portrait, no SaaS card-template aesthetic.
- No serif type. All typefaces are sans-serif or monospace.

---

## 2. Composition — Impact frame

The approved B composition is an action-poster layout:

| Zone | Content | Visual weight |
|---|---|---|
| Left diagonal field | Blood-crimson polygon covering the left half; interrupted by a dark cut zone | Dominant background layer |
| Figure | Faceted Eli silhouette intersects the crimson field, rotated slightly counter-clockwise | Graphic anchor, mid-layer |
| Monogram | `ELI` in Archivo Black, enormous, rotated -8°, bottom-left zone | Graphic overlay |
| Headline column | Right-aligned text block: identity line, headline, intro, two actions | Primary reading flow |
| Lain badge | Compact ASCII signal in the lower hero corner, optional expanded lab later | Supporting layer |
| Diagonal slash | Thin signal-red stripe skewing through the hero field | Accent geometry |

This is a composition decision, not a palette change. The same void/carbon/blood/signal/bone/muted palette carries across all three Phase 1 directions; B uses the largest contiguous crimson area.

### 2.1 Desktop layout (≥ 1100px)

```
+---------------------------------------------------------------+
|  WORDMARK                        [Projects][AI Lab][Skills].. |
+---------------------------------------------------------------+
|  ┌─────────────────────────────┬─────────────────────────────┐|
|  │                             │  Human direction.           │|
|  │    IMPACT FIELD (crimson)   │  BUILT BY HUMAN.            │|
|  │                             │  AMPLIFIED BY AI.           │|
|  │      [FIGURE]               │                             │|
|  │      ELI (800px black)      │  I'm Eli. I build software  │|
|  │                             │  and explore what people    │|
|  │  / SLASH                    │  and AI can create together.│|
|  │                             │  [Projects]  [AI Lab]       │|
|  └─────────────────────────────┴─────────────────────────────┘|
|  LAIN ASCII badge (lower-right hero edge)                     |
+---------------------------------------------------------------+
|  ELI BUILDS. LAIN EXECUTES. TOGETHER, THEY EVOLVE.           |
+---------------------------------------------------------------+
```

### 2.2 Mobile layout (< 768px)

The hero stacks vertically. The headline and actions read first; the figure poster sits below as a full-width stage.

```
+------------------+
|  WORDMARK [Menu] |
+------------------+
|  HUMAN DIRECTION |
|  BUILT BY HUMAN. |
|  AMPLIFIED BY AI.|
|  Intro paragraph |
|  [Projects][AI]  |
+------------------+
|  [FIGURE + ELI]  |
|  (full-width     |
|   poster field)  |
+------------------+
|  LAIN badge      |
+------------------+
|  BRANDLINE       |
+------------------+
```

### 2.3 Short-screen fallback (< 600px viewport height)

- Hero minimum height drops to `min-height: 680px` (from 790px) to preserve headline legibility.
- The canvas scene hides behind the crimson field; the projected rings become static.
- The monogram `ELI` scales via `clamp(120px, 32vw, 240px)` to prevent overflow.
- The brandline text wraps to two lines if needed; no truncation.

---

## 3. Typography

| Role | Font | Weight | Use |
|---|---|---|---|
| Display headline | Barlow Condensed | 800 | Main hero title, section titles |
| Identity monogram | Archivo Black | 400 | The word `ELI` as a graphic object |
| Body / UI | Manrope | 400 / 600 / 700 | Paragraphs, navigation, buttons, labels |
| Lain / code | IBM Plex Mono | 400 | ASCII states, status badges, technical callouts |
| Technical display (project detail h3) | Space Grotesk | 700 | Project name headers in the operations archive |

### Scale

| Token | Size | Weight | Line height | Usage |
|---|---|---|---|---|
| `h1.hero` | `clamp(64px, 6vw, 106px)` | 800 | 1.02, skewed -4deg | Hero headline |
| `h2.section` | `clamp(48px, 5vw, 80px)` | 800 | 0.95 | Section titles |
| `h3.project` | `700 30px` | 700 | 1.1 | Project detail heading |
| `body.lg` | `16px` | 400 | 1.7 | Hero intro, long text |
| `body` | `15px` | 400 | 1.65 | Standard body |
| `body.sm` | `14px` | 400 | 1.6 | Annotations, captions |
| `mono` | `12px` | 400 | 1.5 | Status badges, Lain messages |
| `micro` | `11px` | 400 | 1.4 | Labels, disclosure text |

**Rules:**
- No serif typefaces anywhere in the production UI.
- The hero headline uses negative letter-spacing (`-0.025em`) to tighten the condensed display.
- The `ELI` monogram uses heavy negative tracking (`-0.07em`) and a rotation of -8°.
- Body text contrast is raised to `#d0c9cf` minimum (≈5.2:1 on void) from the Phase 1 cinematic-low `#bcb5bb` (~3.8:1) — this is a required fix from independent review Finding 4.
- Project-detail `h3` uses Space Grotesk only; it never appears as a page title or hero label.

---

## 4. Color roles

All tokens map directly to the Phase 1 palette. Roles are semantic, not decorative.

| Token | Value | Role |
|---|---|---|
| `--void` | `#09090C` | Page background, primary surface |
| `--carbon` | `#17171D` | Card/elevated surface, header bar |
| `--blood` | `#C31632` | Main diagonal field, primary accent area |
| `--signal` | `#FF3347` | Emphasis, active states, CTA outline, Lain highlights |
| `--bone` | `#F2F0EF` | Primary text, headings, inverse-button fill |
| `--muted` | `#A8A4A8` | Secondary text, annotations, disabled states |
| `--line` | `#363039` | Borders, dividers, grid overlays |
| `--deep-cut` | `#230911` | Dark cut zone inside the crimson field (shadow layer) |
| `--highlight` | `#FF92A5` | Canvas projected ring stroke, sub-accent |

**Semantic application:**
- `--blood` and `--deep-cut` are used **only** in the hero impact-field geometry. They do not appear as background color on project cards or panels elsewhere in the portfolio.
- `--signal` marks meaningful interactive state: focus-visible outline, selected tab shadow, active button fill.
- `--bone` is the text color for headlines and body copy. Muted body copy may use `--muted` at a minimum contrast of 4.5:1.
- `--line` defines structural boundaries (grid overlays, section dividers, tab borders) — never as decoration.

---

## 5. Geometry — Angular chamfers

B / Impact frame uses sharp-to-chamfered angles, never soft rounded corners on major structural elements.

| Element | Treatment |
|---|---|
| Hero impact field | Clip-path polygon with a hard diagonal; no border-radius |
| Action buttons | 2px chamfer on the leading (left for LTR) corners only |
| Project tab selected state | `box-shadow: inset 3px 0 var(--blood)` — colored bar, not a border |
| Lain console panel | 1px solid `#5b2434` border; 0px border-radius |
| Project archive cards | None (tab/detail pattern, not cards) |
| Skip-link | Rectangular, 0px border-radius |
| Motion toggle | 0px border-radius, 1px border `#4c3c44` |

Chamfer spec (2px):
```
clip-path: polygon(0 0, calc(100% - 2px) 0, 100% 2px, 100% 100%, 2px 100%, 0 calc(100% - 2px));
```

Apply chamfer only to interactive surfaces (buttons, tab triggers with active state). Do not chamfer decorative polygons or the impact field itself — those stay sharp.

---

## 6. Spacing and grid

### Base unit

| Token | Value |
|---|---|
| `--space-xs` | 4px |
| `--space-sm` | 8px |
| `--space-md` | 12px |
| `--space-lg` | 20px |
| `--space-xl` | 32px |
| `--space-2xl` | 48px |
| `--space-3xl` | 64px |
| `--space-4xl` | 96px |
| `--space-5xl` | 120px |
| `--space-6xl` | 160px |

### Grid

- Desktop: 12-column grid, 7.2vw side margins, 24px gutters between columns.
- Max content width for text blocks: 1320px centered (same as Phase 1 prototype).
- Hero: the split is left-field (≈49%) / right-copy (≈48%) with a 3% gutter gap at ≥1100px.
- Section padding vertical: 100px top/bottom on desktop; 80px on tablet; 64px on mobile.

### Horizontal rhythm

- Navigation gap: 28px between links (desktop), 15px (tablet), stacking on mobile.
- Button group gap: 12px (desktop), 8px (mobile).
- Project tab button vertical padding: 22px 20px (desktop), 16px 8px (mobile).

---

## 7. Motion principles

| Principle | Implementation |
|---|---|
| Scene framing | Slow 3D-projected ring rotation on Canvas 2D; pointer motion adds ±7px horizontal, ±5px vertical parallax offset — never more. |
| Entry animation | Hero copy fades in from `translateY(12px)`, 0.7s ease-out; figure fades from opacity 0, 1s ease-in. Staggered: copy enters first, figure follows. |
| Slash diagonal | Static geometry; no animation. It anchors the composition. |
| Boot replay | Optional dialog; ~1.6s duration when not reduced. Skip button always available. |
| Scroll behavior | Native smooth scroll with `scroll-padding-top: 100px` (desktop), `30px` (mobile). No scroll hijacking. |
| Pointer response | Passive `pointermove` listener; only active on `pointerType === 'mouse'`. Touch devices do not trigger parallax. |
| Reduced motion | `prefers-reduced-motion: reduce` disables all `@keyframes` animations, cancels `requestAnimationFrame` loops, sets `scroll-behavior: auto`, and forces boot timer to 0. The pause toggle becomes disabled with label `Motion reduced`. |
| Pause toggle | `aria-pressed` reflects state; text toggles between `Pause motion` / `Resume motion` / `Motion reduced`. |

Motion tokens:
```css
--motion-duration-fast: 150ms;
--motion-duration-normal: 700ms;
--motion-duration-slow: 1000ms;
--motion-easing: cubic-bezier(0.22, 1, 0.36, 1);
```

No continuous aggressive flashing. No effects that require GPU compositing at >60fps on low-end devices (the canvas caps at ~29fps via the 34ms frame interval).

---

## 8. Keyboard and focus

| Element | Pattern |
|---|---|
| Skip link | Fixed top-left; reveals on `:focus` (`top: 12px`), hidden off-screen otherwise (`top: -100px`). |
| Navigation links | 44px minimum touch target; 11px mono font, 12px weight for label. Hover color shifts to `--signal`. |
| Motion toggle | 44px minimum touch target; `aria-pressed` reflects state; disabled when reduced-motion is active (visually distinct via `opacity: 0.6`). |
| Menu toggle (mobile) | `aria-expanded` reflects state; `Escape` closes menu and returns focus to the toggle button. |
| Project tabs | Vertical `tablist`; `ArrowDown` / `ArrowUp` navigates; `Home` / `End` jumps to first/last. `aria-selected` and `tabindex` update dynamically. |
| Focus visible | 3px solid `--bone` outline, 5px offset. Applied to `button:focus-visible`, `a:focus-visible`, `summary:focus-visible`. |
| Active state | `transform: translateY(1px)` on press for buttons and action links. |
| Disabled | `cursor: default; opacity: 0.6`. |

---

## 9. Lain ASCII states

Five scripted states, exact glyphs preserved from `src/data/lainStates.js` and the Phase 1 prototype. Each state has a fixed-width `pre` element, a live-region message, and a state label.

| State | Art preview (compact) | Message tone |
|---|---|---|
| `booting` | `.[ / / / / ].` frame | "Initializing this local, scripted interface. No AI service is connecting." |
| `idle` | `.[ : : : : ].` frame | "Choose a project in the archive. I only show the curated information included in this reference." |
| `processing` | `.[ > > > > ].` frame | "Processing-state demonstration. No private files, memory or local models are being accessed." |
| `speaking` | `.[ | | | | ].` frame | "Eli chooses the direction. I help explain the engineering. A case study needs evidence, not invented achievements." |
| `disconnected` | `.[ - - - - ].` frame | "Disconnected-state demonstration. The portfolio still works because it does not depend on a model connection." |

Rendering rules:
- Font: `IBM Plex Mono`, 13px, line-height 1.15, color `#ff657b` (signal-adjacent red).
- `white-space: pre; text-align: center; user-select: none;`
- Minimum height: 130px to prevent layout shift between states.
- The ASCII block is decorative (`aria-hidden="true"` on the pre); the live-region `<p aria-live="polite">` carries the message for screen readers.
- No live model connection. No API calls. No private data access. This is hardcoded.

---

## 10. Eli figure treatment

Source: `public/artwork/eli-abstract.svg`.

Rules:
- The SVG is an anonymous faceted silhouette. No facial features, no identifiable clothing, no logos.
- `alt=""` (decorative); the descriptive role is carried by the adjacent `figure-label` span: "Original abstract figure / not a portrait".
- On desktop (B): the figure sits at `left: 4%`, `width: 43%`, `height: 105%`, `bottom: -15%`, with a `drop-shadow(30px 0 5px #23081280)` offset to the right, rotated -5°.
- On mobile: the figure scales to `width: 95%`, `height: 110%`, positioned at `right: -7%`, `bottom: -16%` so it fills the poster stage below the headline.
- The figure-label moves from over the crimson field (legibility risk — see Phase 1 Finding 1) to a darker overlay zone or a semi-transparent dark backing with `--bone` text in production. This is a required fix.

---

## 11. Navigation

Five anchors matching the portfolio structure:
1. `#operations` — Projects archive
2. `#neural-lab` — AI Lab / Lain interface
3. `#system-profile` — Skills
4. `#origin` — About / Eli
5. `#transmission` — Contact

Mobile: collapses to a full-width overlay beneath the header (76px height on mobile, 88px on desktop). Background: `#171019`. Border: 1px `#6c2d40`. Links: 14px Manrope, 8px 12px padding.

Wordmark: `REDLINE <span><i>//</i> OVERDRIVE</span>` — Barlow Condensed 23px / mono 11px subline. `i` is `--signal` colored.

---

## 12. Operations archive (representative project section)

The approved B layout for the projects section uses a **two-panel tab + detail** pattern, not a card grid:

```
+---------------------------------------------------------------+
|  OPERATIONS ARCHIVE                                           |
|  Real project names. Honest status. Case-study content stays  |
|  in review until the evidence is ready.                       |
+---------------------------------------------------------------+
|  [Gesture Control    ]  |  Release status in review            |
|  [UpgradeAtlas     ]  |  A college project being developed...  |
|  [EliLain Intel    ]  |  Stack: React, Laravel, PostgreSQL     |
|  [AlphaPOS         ]  |  Scope to confirm; identity pending    |
+---------------------------------------------------------------+
```

Left panel: tab list with `aria-selected` state. Selected tab has `background: #2a101b; color: --bone; box-shadow: inset 3px 0 var(--blood)`. Right panel: project detail with status badge, h3 name, description, technical notes, and an evidence disclosure line.

Each project card in the archive includes:
- `status` badge (mono, 11px, `#ff8798` on `#37111f` background)
- `h3` project name (Space Grotesk, 700, 30px)
- `p` description (Manrope, 14px, `#beb3bc`)
- `p.disclosure` (Mono, 11px, `--muted`) with evidence source and boundary statement

No project is presented as completed or shipped unless explicitly confirmed by Eli. Current statuses in `src/data/projects.js` are taken from Phase 0 content audit findings.

---

## 13. Neural lab section

Reserved for Lain's expanded ASCII interface. Layout: two-column grid on desktop (1fr / 1.1fr, 60px gap), stacking to single column on mobile.

Left column: section title "Neural lab. Meet the intelligence.", intro paragraph, boot replay button.
Right column: Lain console panel with ASCII output, state controls (5 buttons), live-region message, and a `local-note` footer: "Scripted preview / no API / no private memory".

The model inventory (`src/data/models.js`) is intentionally empty (`[]`). The placeholder note reads: "The local-model collection and comparisons are not published in this reference." This section is a structural placeholder — content will be added only when Eli approves real material.

---

## 14. System profile / Skills

Skills are listed from `src/data/skills.js` — three evidence-backed entries with tool names and source references. No proficiency percentages. No invented qualifications. Format:

```
[Python / computer vision]  Python, OpenCV, MediaPipe  — Gesture Control source
[Current web stack]         React, JavaScript, Tailwind CSS, Vite  — This portfolio reference
[College project stack]     Laravel, PostgreSQL  — UpgradeAtlas declared stack; project in development
```

No expandable accordion or animated progress bars. Clean list, clear evidence citation.

---

## 15. Origin / About

Text sourced from `content.json` origin field: "I'm Eli, a computer science student, developer and AI enthusiast. I work on software projects and experiment with AI systems."

No age, no location, no medical disclosure, no employer names, no email, no family relationship. These were present in the old portfolio and are excluded per Phase 0 discovery requirements. Full biographical wording will be supplied by Eli before publication.

---

## 16. Transmission / Contact

Contact section contains:
- GitHub link to `https://github.com/Eli-Mira` (`target="_blank" rel="noopener noreferrer"`)
- Optional resume.pdf link (only if Eli provides a real file; placeholder must not fabricate a URL)
- No form. No public email. No social media links without approval.

---

## 17. Reference milestone

**Phase 2+3 scope is intentionally limited.** The production reference implements exactly two destinations:

1. **Homepage** (`/`) — Hero (Impact frame composition) + brandline + brief intro.
2. **Operations section** (`/operations` or inline `#operations`) — The two-panel project archive with all four projects from `src/data/projects.js`.

Everything else (Neural Lab, System Profile, Origin, Transmission) is structured as empty anchor targets or placeholder sections with visible honest messaging. No fabricated content is injected.

**Reference implementation stack:**
- React 19 + Vite 8 + JavaScript (not TypeScript)
- Tailwind CSS v4 via `@tailwindcss/vite`
- No Motion for React (not yet justified; CSS keyframes and the Canvas 2D component handle all animation)
- No Three.js / WebGL
- No paid dependencies
- Fonts: locally hosted TTF files in `src/assets/fonts/`, served via `@font-face` in the Tailwind theme

**Not in scope for this milestone:**
- Full six-page site
- Project screenshots or demo videos
- Live deployment
- GitHub repository creation or push
- Model inventory content
- Resume PDF

---

## 18. What is explicitly excluded

- Any biography beyond the single origin sentence from `content.json`.
- Project completion claims, performance benchmarks, or deployment URLs.
- Personal contact information (email, phone, location).
- Private repository links or source code excerpts.
- Model endpoints or local LLM configuration details.
- Any asset copied from Serial Experiments Lain, Cyberpunk 2077, Activetheory.net, Bruno Simon, or Lusion.
- Serif typography anywhere in the interface.
- Card-template makeover aesthetics (shadow-lifted cards on white/gray, SaaS-style feature lists).
- Generic gradient backgrounds without the diagonal geometric structure.
- Continuous flashing or autoplay video.

---

## 19. Known trade-offs from Phase 1 review

| Finding | Resolution in Phase 2 |
|---|---|
| B figure-label contrast against crimson field (Finding 1) | Label moved to a semi-transparent dark backing zone; text color raised to `--bone`. |
| Body/intro contrast ~3.8:1 (Finding 4) | Body text raised to minimum `#d0c9cf` (~5.2:1 on void). Cinematic-low contrast is not carried into production. |
| Review bar will leak into public output (Finding 5) | Production build hides `.reviewbar` via `data-phase="2"` selector; reviewbar is Phase 1 only. |
| Mobile monogram crowding at 320px (Finding 3) | Monogram uses `clamp(120px, 32vw, 240px)` on mobile; shifted to `right: 2%` with breathing room. |

These are fixes, not new features. The composition stays B.

---

## 20. Asset provenance

| Asset | Source | License |
|---|---|---|
| `eli-abstract.svg` | Original vector study authored locally for this brief | Proprietary / Eli-owned |
| `display.ttf` (Barlow Condensed) | `fonts.gstatic.com/s/barlowcondensed/v13/...` | SIL OFL |
| `impact.ttf` (Archivo Black) | `fonts.gstatic.com/s/archivoblack/v23/...` | SIL OFL |
| `body.ttf` (Manrope) | `raw.githubusercontent.com/google/fonts/.../Manrope[wght].ttf` | SIL OFL |
| `mono.ttf` (IBM Plex Mono) | `fonts.gstatic.com/s/ibmplexmono/v20/...` | SIL OFL |
| `favicon.ico` | Original favicon, slash motif | Proprietary / Eli-owned |
| Font license texts | `docs/licenses/*.OFL.txt` | SIL OFL v1.1 |

Exact download sources and byte sizes are recorded in `proposals/assets/fonts/sources.json`.

---

**Document version:** 1.0 · 2026-10-17 · B / Impact frame approved · References `MASTER_BRIEF.md`, `../ART_DIRECTION.md`, `../proposals/b-impact-frame.html`, `../proposals/prototype.css`, `../DISCOVERY.md`, `../evidence/independent-design-review.md`.
