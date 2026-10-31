# Lernraum – Biologie üben

A German practice quiz for GitHub Pages at `alebo/bio-2026-11`. Plain HTML, CSS and JavaScript; no accounts or server-side storage. The initial content is explicitly labelled as a sample.

## Run locally

Requires Node.js 22 or newer.

```sh
npm ci
npm run build
npm start
```

Open http://127.0.0.1:4173. Rebuild after changing source files. `dist/` is generated and ignored by Git.

```sh
npm test
npx playwright install chromium
npm run test:browser
```

To use an installed Google Chrome instead of downloading Chromium: `PLAYWRIGHT_CHANNEL=chrome npm run test:browser`.

## Content

Edit `site/questions.js`; put images in `site/assets/`. Each question has a stable `id`, `prompt`, optional `topic`, optional `language` (defaults to German), `options` with stable IDs, and a `correct` array containing one or more option IDs. Optional `explanation` is shown after checking. Text is rendered as text, not HTML.

Images use `image: { src: './assets/example.svg', alt: 'Meaningful description' }`. Mermaid diagrams use `mermaid` for source and `diagramDescription` for an accessible text equivalent. Avoid options such as “all of the above”: options are shuffled. Increment the quiz `version` whenever content changes to invalidate obsolete saved attempts.

The sample demonstrates an SVG image and Mermaid flowchart. Mermaid is pinned and bundled locally; the deployed site does not fetch scripts or fonts from third-party CDNs. The build only publishes `site/` and the Mermaid library, excluding source photographs and notes elsewhere in this workspace.

## Behavior

Questions and answer options are shuffled for every attempt. Selection is submitted with “Antwort prüfen”. Only the exact set of correct answers earns a point. Checked answers cannot be changed. Visitors can review results, restart the full test, or retry questions missed in the most recent attempt. Retry scores apply only to that subset. Restarting asks before replacing progress.

Selections, checked answers, order and results are saved to localStorage in the current browser. Clearing browser data removes progress; if storage is blocked, the quiz still works for the current page session and shows a notice. Nothing is sent to a results server. Content and correct answers are public, as expected for a practice tool.

## GitHub Pages

The included workflow builds and deploys `dist/` on pushes to `main`. In repository Settings → Pages, select **GitHub Actions** as the source. The intended URL is https://alebo.github.io/bio-2026-11/ once deployment succeeds. Relative asset paths support this repository subpath.

Workflow reference: https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages
