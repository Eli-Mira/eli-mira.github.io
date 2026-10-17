# Portfolio Design Direction

**Surface**: Decide/Learn — a recruiter or collaborator lands here to decide whether to engage.
**Audience**: Tech recruiters, hiring managers, fellow developers, potential collaborators.
**Visual language**: Glass-dark + premium utilitarian minimalism. Dark theme is intentional (developer identity, justified per antislop R-21).

## Dials

| Dial | Level | Rationale |
|------|-------|-----------|
| ENERGY | 2 (Balanced) | Professional portfolio, not an agency showcase. Presence without noise. |
| RHYTHM | 3 (Varied) | Each section earns its own composition. No template repetition. |
| MOTION | 1 (Hover only) | No endless loops or decorative animation. Scroll-fade reveals only. |

## Why these choices (R-31)

- **Dark theme**: developer portfolio convention. Cyan/teal accent reads clearly on deep navy.
- **Serif headings** (Instrument Serif): editorial hierarchy, distinguishes this from generic SaaS templates.
- **Sans body** (Geist Sans): clean, technical, readable at all sizes.
- **Mono labels** (JetBrains Mono): signals developer context without decoration.
- **One accent** (#5eeadf teal): sparse use on key actions and highlights only — zero accent elsewhere.
- **Glass on nav only**: dose cap of 1 element per R-10. No glass on cards or sidebars.
- **No gradients on text**: solid colors only. Gradient was decoration, not hierarchy.
- **No glow**: removed from avatar, cards, timeline nodes. Accent color carries emphasis instead.
- **No emojis**: replaced with text labels. Generic AI icons are a slop tell (R-04).
- **No statistics without real source**: removed fake stats (R-17). Only real counts shown.
- **Scroll-fade reveals**: subtle opacity + translate via IntersectionObserver. Respects `prefers-reduced-motion`.

## Palette (3 cores + 1 accent, per R-29)

```css
--bg:      #0a0e1a   /* page background       */
--surface: #111827   /* elevated sections     */
--card:    #1a2235   /* card and panel fills  */
--accent:  #5eeadf   /* teal — key actions    */
--text:    #e2e8f0   /* primary text          */
--muted:   #94a3b8   /* secondary text        */
--border:  #2a3450   /* structural borders    */
```

## Fonts

- **Body & UI**: Geist Sans (500, 600)
- **Headings**: Instrument Serif (400, 700)
- **Mono**: JetBrains Mono (400, 600)
