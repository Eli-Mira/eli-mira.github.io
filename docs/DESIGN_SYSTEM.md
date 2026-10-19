# DESIGN SYSTEM — B / Impact frame

**Status:** Phase 2 production design tokens.  
**Scope:** React/Vite/JS/Tailwind homepage + one representative project section.  
**Parent brief:** `MASTER_BRIEF.md` · **Art direction:** `ART_DIRECTION.md` · **Phase 1 prototypes:** `../proposals/`  
**Deployment:** Unapproved. This document is a local reference, not a publish assertion.

---

## 1. Tokens overview

All values below are consumed through Tailwind CSS v4 theme variables or as CSS custom properties on `:root`. The token set is intentionally small — each value has a single, documented role. No decorative tokens that duplicate an existing one are introduced.

---

## 2. Color tokens

### 2.1 Palette

```css
:root {
  --void:    #09090C;
  --carbon:  #17171D;
  --blood:   #C31632;
  --signal:  #FF3347;
  --bone:    #F2F0EF;
  --muted:   #A8A4A8;
  --line:    #363039;
  --deep-cut:#230911;
  --highlight:#FF92A5;
}
```

### 2.2 Semantic roles

| Token | Semantic role | Where it appears | Where it does NOT appear |
|---|---|---|---|
| `--void` | Page canvas, primary background | `body`, `<main>` bg | Never on interactive surfaces (use `--carbon` instead) |
| `--carbon` | Elevated surface, header, console panel bg | Site header, Lain console, tab list bg | Never as body text background without a border |
| `--blood` | Impact field, selected-tab inset shadow | Hero left diagonal, tab `aria-selected` highlight | Never as text color or as section background outside hero |
| `--signal` | Active/selected state, accent highlights | Focus-visible fallback, `i` in wordmark, status badges, tab shadow | Never as primary text color (contrast is too low on carbon) |
| `--bone` | Primary text, inverse button fill | Headlines, body copy, skip-link bg | Never on `--blood` without a backing (see Figure disclaimer fix) |
| `--muted` | Secondary text, annotations | Captions, disclosure lines, disabled states | Never as the only means of conveying information (pair with icon or label) |
| `--line` | Structural boundaries | Grid overlays, section dividers, tab borders | Never as a fill color |
| `--deep-cut` | Shadow layer inside impact field | Hero inner cut polygon | Never outside the hero |
| `--highlight` | Sub-accent for decorative geometry | Canvas ring stroke | Never as text or interactive state color |

### 2.3 Contrast requirements

| Foreground | Background | Ratio | Pass |
|---|---|---|---|
| `--bone` (#F2F0EF) | `--void` (#09090C) | 15.8:1 | AA ✓ AAA ✓ |
| `--bone` (#F2F0EF) | `--carbon` (#17171D) | 14.9:1 | AA ✓ AAA ✓ |
| `#d0c9cf` (raised body) | `--void` (#09090C) | 5.2:1 | AA ✓ AAA ✗ (large text only) |
| `--signal` (#FF3347) | `--void` (#09090C) | 4.6:1 | AA ✓ |
| `--muted` (#A8A4A8) | `--void` (#09090C) | 4.1:1 | AA ✗ — never used alone for body text |
| `#ff8798` (status badge) | `#37111f` (badge bg) | 5.8:1 | AA ✓ |

**Rule:** `--muted` may appear on `--void` only for non-essential annotations (≤12px, decorative labels). Body copy and headings must meet AA (4.5:1) minimum. This is a hard gate — no exceptions for aesthetics.

---

## 3. Typography tokens

### 3.1 Typefaces (local TTF, no CDN)

| Name | File | Google / source | License |
|---|---|---|---|
| `display` | `src/assets/fonts/display.ttf` | Barlow Condensed v13 | SIL OFL |
| `impact` | `src/assets/fonts/impact.ttf` | Archivo Black v23 | SIL OFL |
| `body` | `src/assets/fonts/body.ttf` | Manrope [wght] variable | SIL OFL |
| `mono` | `src/assets/fonts/mono.ttf` | IBM Plex Mono v20 | SIL OFL |
| `technical` | `src/assets/fonts/technical.ttf` | Space Grotesk v22 | SIL OFL |

`@font-face` declarations go in the Tailwind theme or a dedicated CSS file imported by `src/main.jsx`:

```css
@font-face {
  font-family: 'Barlow';
  src: url('./assets/fonts/display.ttf') format('truetype');
  font-weight: 800;
  font-display: swap;
}
@font-face {
  font-family: 'Archivo';
  src: url('./assets/fonts/impact.ttf') format('truetype');
  font-weight: 400;
  font-display: swap;
}
@font-face {
  font-family: 'Manrope';
  src: url('./assets/fonts/body.ttf') format('truetype');
  font-weight: 400 700;
  font-display: swap;
}
@font-face {
  font-family: 'Plex';
  src: url('./assets/fonts/mono.ttf') format('truetype');
  font-weight: 400;
  font-display: swap;
}
@font-face {
  font-family: 'Space';
  src: url('./assets/fonts/technical.ttf') format('truetype');
  font-weight: 700;
  font-display: swap;
}
```

Fallback stacks:
- `--font-display: Barlow, Impact, sans-serif;`
- `--font-body: Manrope, Arial, sans-serif;`
- `--font-mono: Plex, ui-monospace, monospace;`
- `--font-technical: Space, Arial, sans-serif;`

### 3.2 Scale

| Token | Size | Weight | Letter-spacing | Line-height | Usage |
|---|---|---|---|---|---|
| `text-hero` | `clamp(64px, 6vw, 106px)` | 800 | -0.025em | 1.02 (skewed -4deg on B) | Hero headline |
| `text-section` | `clamp(48px, 5vw, 80px)` | 800 | -0.02em | 0.95 | Section titles |
| `text-h3` | `30px` | 700 | 0 | 1.1 | Project name header |
| `text-lg` | `16px` | 400 | 0 | 1.7 | Hero intro paragraph |
| `text-base` | `15px` | 400 | 0.02em | 1.65 | Body copy |
| `text-sm` | `14px` | 400 | 0 | 1.6 | Annotations, captions |
| `text-mono` | `12px` | 400 | 0.06em | 1.5 | Status badges, labels |
| `text-micro` | `11px` | 400 | 0.06em | 1.4 | Disclosure text, legend |

**Rules:**
- No serif fonts anywhere in the token set.
- The hero headline on B is skewed `-4deg` via `transform: skewY(-4deg)`.
- The `ELI` monogram uses `transform: rotate(-8deg)` with `-0.07em` letter-spacing.
- Body copy must use `#d0c9cf` or lighter (≥5.2:1 on void) — the Phase 1 `#bcb5bb` (~3.8:1) is removed from production.

---

## 4. Spacing tokens

All spacing derives from a 4px base. No arbitrary pixel values in component CSS — use the tokens.

| Token | Value |
|---|---|
| `space-1` | 4px |
| `space-2` | 8px |
| `space-3` | 12px |
| `space-4` | 20px |
| `space-5` | 32px |
| `space-6` | 48px |
| `space-7` | 64px |
| `space-8` | 96px |
| `space-9` | 120px |
| `space-10` | 160px |

### 4.1 Layout grid

| Breakpoint | Side margin | Gutter | Max content width |
|---|---|---|---|
| ≥ 1100px | 7.2vw | 24px (between columns) | 1320px |
| 768–1099px | 5vw | 24px | 1320px |
| < 768px | 24px | 16px | 100% (no max-width clamp) |

### 4.2 Section padding

| Token | Desktop | Tablet | Mobile |
|---|---|---|---|
| `section-v` | 100px top/bottom | 80px | 64px |
| `section-h` | 7.2vw | 5vw | 24px |

### 4.3 Component spacing

| Component | Token usage |
|---|---|
| Navigation links gap | `space-5` (32px) desktop → `space-2` (8px) mobile |
| Button group gap | `space-3` (12px) desktop → `space-2` (8px) mobile |
| Project tab button | padding: `space-4` Y × `space-2` X |
| Project detail panel | padding: `space-5` Y × `space-6` X desktop → `space-4` Y × `space-2` X mobile |
| Header height | 88px desktop → 76px mobile |
| Hero min-height | 680px desktop → 790px mobile (portrait orientation) |

---

## 5. Border and radius tokens

| Token | Value | Usage |
|---|---|---|
| `radius-none` | 0px | Major structural elements, impact field, console panel |
| `radius-chamfer` | 2px | Interactive surfaces (buttons, tab triggers active state) — applied via `clip-path`, not `border-radius` |
| `radius-sm` | 4px | Small badges, tags |

Chamfer clip-path (2px, leading-corner only for buttons):
```css
.chamfer-leading {
  clip-path: polygon(0 0, calc(100% - 2px) 0, 100% 2px, 100% 100%, 2px 100%, 0 calc(100% - 2px));
}
```
Apply only to interactive elements. Decorative polygons and the impact field use `border-radius: 0` (sharp).

---

## 6. Motion tokens

| Token | Value | Usage |
|---|---|---|
| `motion-fast` | 150ms | Hover state transitions |
| `motion-normal` | 700ms | Hero copy entry fade |
| `motion-slow` | 1000ms | Figure entry fade |
| `motion-ease` | `cubic-bezier(0.22, 1, 0.36, 1)` | All ease-out transitions |
| `motion-boot` | 1600ms | Boot dialog duration (skippable) |
| `motion-frame-interval` | 34ms | Canvas animation throttle (~29fps cap) |

**Reduced motion:** `prefers-reduced-motion: reduce` cancels all `@keyframes` animations, disables `requestAnimationFrame` in the canvas component, sets `scroll-behavior: auto`, and freezes the boot timer at 0. The motion toggle becomes disabled.

**No motion exceptions:** There are no autoplay effects, no infinite spinning elements, no flashing. The canvas runs at a capped ~29fps and pauses when the hero is off-screen (IntersectionObserver) or the tab is hidden (`document.hidden`).

---

## 7. Component specifications

### 7.1 Site header

| Property | Value |
|---|---|
| Height | 88px desktop / 76px mobile |
| Background | `transparent` (over hero), `--carbon` when scrolled past hero (scroll-driven, not required for Phase 2) |
| Border-bottom | 1px `--line` (concept-b variant: `#30212a`) |
| Z-index | 10 |
| Wordmark | Barlow 800, 23px, `--signal` for `i` (the `//`) |
| Nav links | Manrope 400, 12px, 11px letter-spacing, 28px gap |
| Mobile nav | Full-width overlay, `--carbon` bg, 1px `#6c2d40` border |

### 7.2 Hero (B / Impact frame)

| Property | Value |
|---|---|
| Position | `relative; isolation: isolate; overflow: hidden` |
| Min-height | 680px desktop / 790px mobile |
| Max-height | 940px |
| Impact field | `clip-path: polygon(0 0, 100% 0, 80% 100%, 0 100%); background: --blood` |
| Impact cut | `background: --deep-cut; clip-path: polygon(0 45%, 100% 0, 95% 14%, 0 100%)` |
| Impact slash | `background: --signal; transform: skewX(-16deg); width: 4%` |
| Figure | `position: absolute; left: 4%; width: 43%; height: 105%; bottom: -15%; transform: rotate(-5deg)` |
| Monogram ELI | `position: absolute; left: 4.4vw; bottom: 9%; font: 400 clamp(130px, 18vw, 300px)/0.8 Archivo; transform: rotate(-8deg)` |
| Hero copy | `margin-left: 49%; width: 48%; padding-top: clamp(80px, 10vh, 130px)` |
| Canvas | `position: absolute; inset: 0; z-index: 1` (behind field and figure) |
| Lain badge | `position: absolute; right: 7.2vw; bottom: 22px; max-width: 265px` |

### 7.3 Action buttons

| Property | Value |
|---|---|
| Primary | `background: --bone; color: --void; chamfer-leading clip-path; min-height: 48px; padding: 0 28px; font: 11px Plex mono` |
| Secondary | `background: transparent; border: 1px solid #4c3c44; chamfer-leading clip-path; min-height: 48px; padding: 0 28px; font: 11px Plex mono` |
| Hover | `color: --signal` (secondary only); primary stays bone |
| Active | `transform: translateY(1px)` |
| Focus-visible | `outline: 3px solid --bone; outline-offset: 5px` |

### 7.4 Project tabs

| Property | Value |
|---|---|
| Container | Vertical `tablist`, `role="tablist"`, `aria-orientation="vertical"` |
| Tab button | `background: transparent; border-bottom: 1px solid #30252e; text-align: left; padding: 22px 20px; min-height: 64px; font: 600 15px Manrope; color: --muted` |
| Tab selected | `background: #2a101b; color: --bone; box-shadow: inset 3px 0 --blood` |
| Tab status chip | `font: 10px Plex; color: #b5a5af` |
| Keyboard | ArrowDown/ArrowUp navigate; Home/End jump; Enter/Space activates |

### 7.5 Project detail panel

| Property | Value |
|---|---|
| Container | `padding: 32px 40px desktop / 28px 8px mobile` |
| Status badge | `font: 11px Plex; color: #ff8798; background: #37111f; padding: 5px 8px; display: inline-block; margin-bottom: 20px` |
| Project h3 | `font: 700 30px Space; margin: 0 0 18px` |
| Description | `font: 400 14px Manrope; color: #beb3bc; max-width: 55ch` |
| Disclosure | `font: 11px/1.8 Plex; color: --muted; margin-top: 25px` |

### 7.6 Lain console

| Property | Value |
|---|---|
| Container | `border: 1px solid #5b2434; background: #0d0b10; padding: 24px; min-width: 0` |
| Console head | `font: 11px Plex; display: flex; justify-content: space-between; color: #cfc0c9; margin-bottom: 14px` |
| ASCII pre | `font: 13px/1.15 Plex; color: #ff657b; margin: 18px 0 20px; min-height: 130px; white-space: pre; text-align: center; user-select: none; aria-hidden: true` |
| State label | `font: 11px Plex; color: --signal` |
| Live message | `aria-live: polite; font: 12px Manrope; color: --bone` |
| State controls | 5 buttons in a row; `aria-pressed` reflects active state; `role="group"; aria-label="Lain animation states"` |
| Footer note | `font: 10px Plex; color: --muted; margin-top: 16px` |

### 7.7 Brandline

| Property | Value |
|---|---|
| Background | `--blood` tinted dark: `#201018` |
| Border-top | 0 (B variant; other concepts use 1px `--line`) |
| Text | `font: 800 14px Barlow; text-transform: uppercase; letter-spacing: 0.02em; padding: 22px 7.2vw` |
| Subtext | `font: 11px Plex; color: --muted; margin-top: 8px` |
| Mobile | `flex-direction: column; align-items: flex-start; gap: 7px; padding: 22px 24px; font-size: 10px` |

---

## 8. Responsive rules

| Breakpoint | Trigger | Key changes |
|---|---|---|
| ≥ 1100px | `min-width: 1100px` | Full desktop: 12-col grid, side margins 7.2vw, nav horizontal, hero split 49%/48% |
| 768–1099px | `min-width: 768px` and `max-width: 1099px` | Navigation gap shrinks to 15px; hero copy margin-left 5vw; figure width 55%; section padding 80px |
| < 768px | `max-width: 767px` | Stack layout: hero copies first, figure poster below; mobile menu ( Escape to close); brandline stacks; project archive becomes single-column; monogram scales to `clamp(120px, 32vw, 240px)` |
| < 600px height | `max-height: 600px` (orientation probe) | Hero min-height drops to 680px; canvas becomes static; brandline text may wrap |

**Breakpoint rationale:** Three breakpoints match the Phase 1 smoke test viewports (320, 768, 1100, 1440). The 768px and 1100px breakpoints are where layout shifts occur; everything between is fluid via `clamp()` and percentage widths.

---

## 9. Accessibility rules

| Rule | Implementation |
|---|---|
| Skip link | Fixed top-left, reveals on focus, `z-index: 30`, `background: --bone; color: --void; padding: 12px` |
| Focus visible | 3px solid `--bone`, 5px offset on `button:focus-visible`, `a:focus-visible`, `summary:focus-visible` |
| Touch targets | All interactive elements ≥ 44px height (per WCAG 2.5.5) |
| Motion toggle | `aria-pressed` reflects state; disabled + labeled `Motion reduced` when `prefers-reduced-motion` is active |
| Project tabs | `role="tablist"`, `role="tab"`, `role="tabpanel"`, `aria-selected`, `aria-controls`, keyboard navigable with Arrow keys |
| Lain ASCII | `pre` is `aria-hidden="true"`; the message paragraph has `aria-live="polite"` |
| Figure disclaimer | Legible against the crimson field — moved to a dark backing zone with `--bone` text (fixes Phase 1 Finding 1) |
| HTML lang | `<html lang="en">` |
| Meta robots | `<meta name="robots" content="noindex,nofollow">` during development |

---

## 10. Missing assets (honest disclosure)

The following assets are intentionally absent. The UI must not fabricate replacements:

| Asset | Status | Placeholder behavior |
|---|---|---|
| Project screenshots | Not approved | Omit; the operations section shows text-only case studies |
| Demo video / GIF | Not approved | Omit; no placeholder video element |
| Personal portrait | Explicitly declined | `eli-abstract.svg` faceted silhouette is used; no photo path |
| `resume.pdf` | Not provided | Link is omitted; contact section shows GitHub only |
| Real model inventory | Intentionally empty | `src/data/models.js` exports `[]` with a note that inventory is not published |
| AlphaPOS codebase identity | Unresolved | Listed as "Scope to confirm" with no stack or architecture assumed |
| Public GitHub repo for portfolio | Not created | No `<a href="...">` to a non-existent repo; GitHub link goes to `Eli-Mira` org only |
| Live deployment URL | Unapproved | No `<base>` tag, no canonical URL, no deploy configuration |

If a slot cannot be filled with approved evidence, the section remains a structural placeholder with a visible honest label (e.g., "Content awaiting review" rather than a blank space).

---

## 11. Folder architecture

Production structure (what Phase 2+3 must follow):

```
portfolio/
├── public/
│   ├── artwork/
│   │   └── eli-abstract.svg       # Original faceted silhouette
│   ├── project-images/             # Empty — wait for approved screenshots
│   └── favicon.ico                 # Original slash favicon
├── src/
│   ├── assets/
│   │   └── fonts/
│   │       ├── display.ttf         # Barlow Condensed
│   │       ├── impact.ttf          # Archivo Black
│   │       ├── body.ttf            # Manrope
│   │       └── mono.ttf            # IBM Plex Mono
│   ├── components/
│   │   ├── character/
│   │   │   └── LainBadge.jsx       # Inline ASCII badge (hero)
│   │   ├── motion/
│   │   │   ├── ImpactScene.jsx     # Canvas 2D projected scene
│   │   │   └── useMotionSettings.js # reduced-motion + pause state
│   │   ├── navigation/
│   │   │   └── Navigation.jsx      # Header + mobile menu
│   │   └── ui/                     # Reserved for Phase 3+ component library
│   ├── data/
│   │   ├── lainStates.js           # 5 ASCII state strings + messages
│   │   ├── models.js               # [] — empty, intentionally
│   │   ├── projects.js             # 4 projects with honest statuses
│   │   └── skills.js               # 3 evidence-backed skill entries
│   ├── pages/                      # Reserved: Home.jsx, Operations.jsx, etc.
│   ├── styles/
│   │   └── global.css              # @font-face, :root tokens, base styles
│   ├── App.jsx                     # Route to current page
│   └── main.jsx                    # CreateRoot mount
├── docs/
│   ├── ART_DIRECTION.md            # This document (direction)
│   ├── DESIGN_SYSTEM.md            # This file (tokens)
│   └── licenses/
│       ├── body-OFL.txt
│       ├── display-OFL.txt
│       ├── impact-OFL.txt
│       └── mono-OFL.txt
├── tests/                          # Browser smoke suite (Phase 1)
├── .gitignore
├── .gitattributes
├── eslint.config.js
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

**Rules:**
- No new top-level directories without owner approval.
- `public/project-images/` must remain empty until Eli supplies approved screenshots.
- `src/components/ui/` is reserved but empty — Phase 2 does not add components here.
- `src/pages/` is reserved — Phase 2 builds the homepage and operations section as inline sections within `App.jsx` / `Home.jsx`, not as separate route files (single-page anchor navigation only at this milestone).

---

## 12. Reference milestone (Phase 2+3)

**What is built:**
1. Homepage: hero (Impact frame), brandline, brief intro footer.
2. Operations section: two-panel project archive with all four projects from `src/data/projects.js`.

**What is NOT built:**
- Neural Lab page (structural placeholder only)
- System Profile page (structural placeholder only)
- Origin page (placeholder with existing origin sentence)
- Transmission page (GitHub link only)
- Full router setup (anchor-based single-page navigation only)
- Production build optimization (no code splitting, no lazy loading)
- Deployment configuration

**Tech stack:**
- React 19.3.1
- Vite 8.3.4
- JavaScript (ES modules)
- Tailwind CSS v4.3.3 via `@tailwindcss/vite`
- `@vitejs/plugin-react` 6.1.2
- `eslint` 10.13.0 with `eslint-plugin-react-hooks` 7.1.1

**Not used:**
- Motion for React (no justified need at this milestone)
- TypeScript
- Three.js / WebGL
- Backend / API
- Paid dependencies

---

## 13. What is not approved

| Item | Status |
|---|---|
| Deployment to GitHub Pages | Not approved |
| Public git repository | Not created |
| Additional project case studies beyond `src/data/projects.js` | Not approved |
| Real resume.pdf link | No file provided |
| Project screenshots | Not approved |
| Model inventory content | Not approved |
| Expanded biography | Not approved |
| Real demo video/GIF | Not approved |

Any of these items appearing in production output before owner approval is a violation of this design system.

---

**Document version:** 1.0 · 2026-10-17 · B / Impact frame approved tokens.  
**Cross-reference:** `ART_DIRECTION.md` · `../MASTER_BRIEF.md` · `../proposals/prototype.css` · `../proposals/b-impact-frame.html` · `../DISCOVERY.md` · `../evidence/independent-design-review.md` · `../evidence/browser-results.json`.
