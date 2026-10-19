# REDLINE // OVERDRIVE

The portfolio site. A React + Vite application, built and published by GitHub
Actions to **https://eli-mira.github.io**.

## What it is

Six destinations on one page:

| # | Destination | What it holds |
|---|---|---|
| 00 | Initialize | The impact-frame hero, a WebGL depth field, and the Lain ASCII badge |
| 01 | Operations | Five projects read at source level, with their stack, architecture, evidence and stated limits |
| 02 | Neural Lab | Lain's five ASCII states, the intel signal chain, and a 3D map of how the work connects |
| 03 | System Profile | Skill groups that each point at the code that proves them, plus the current learning path |
| 04 | Origin | What Eli builds and the standard the work is held to |
| 05 | Transmission | The contact channels and what each one is good for |

## Principles this site holds to

- **Nothing is claimed that cannot be inspected.** Every project states its
  current state, what it does not claim, and which files it was read from.
- **No live model, no tracking, no third-party requests.** Every asset is
  local, and the site works with the network off.
- **Motion is optional.** `prefers-reduced-motion` gives a static page that
  still shows everything, and the pause control stops ambient motion without
  stranding content at zero opacity.
- **The 3D is an enhancement, not a dependency.** Both WebGL scenes are lazy
  chunks; the page is complete and readable before they load, and if WebGL is
  unavailable the layout holds without them.

## Local development

```bash
npm install
npm run dev      # http://127.0.0.1:5174
```

## Verification

```bash
npm run lint          # ESLint, no errors
npm test               # content, motion and policy tests
npm run build          # production build
npm run test:built     # checks on the built output
npm run test:budget    # build size ceilings
npm run test:integrity # the released tree is unchanged
npm run preview        # serve the build on http://127.0.0.1:4179
npm run test:browser   # Playwright checks against the preview
```

`npm run test:browser` needs a Chromium build. On Windows, point
`CHROMIUM_PATH` at an existing one:

```bat
set CHROMIUM_PATH=C:\Users\<you>\AppData\Local\ms-playwright\chromium-<build>\chrome-win64\chrome.exe
npm run test:browser
```

## Security

The content security policy is in `scripts/policy.mjs`. The build fills the
script hashes in from the scripts that are really in the built page, so the
policy cannot stop matching them, and writes the policy into the page as a
meta tag.

**GitHub Pages does not read the `_headers` file.** That is a Netlify and
Cloudflare Pages convention, so a policy delivered that way never reaches
the browser. The meta tag is what protects the live site. The build still
writes a `_headers` file, carrying the same policy plus the directives a
meta tag cannot (`frame-ancestors`, and the response headers), for a front
end that can set them. `npm run serve:headers` serves the build with that
file applied, and the browser suite runs against it.

Two things GitHub Pages cannot do, and this site does not claim otherwise:
set `X-Frame-Options`, and deliver `frame-ancestors`. Both need a front end
in front of the site.

## Layout

```
src/
  components/   Lain badge and console, the WebGL scenes, navigation, UI
  data/         Content: projects, skills, lab pipeline, graph, origin
  motion/       Scroll system, pointer state, and the two 3D scenes
  pages/        The six destinations
  styles/       Tokens and the global stylesheet
docs/           Art direction, the design system, font licences
tests/          Content tests, byte-integrity tests, browser checks
```

## Content sources

Every project entry cites the source it was written from. The evidence trail
for the current phase lives in the project workspace, not in this repository.
