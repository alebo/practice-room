# Lernraum – Biologie üben

A German practice quiz for GitHub Pages at `alebo/bio-2026-11`. Plain HTML, CSS and JavaScript; no accounts or server-side storage. The current published content is Übung 002: ten multiple-answer MCQs on nutrients and digestion, without liver questions.

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

Edit `site/questions.js`; put images in `site/assets/`. Each question has a stable `id`, `prompt`, optional `topic`, and optional `language` (defaults to German). MCQs use `type: 'mcq'` (or omit the type), `options` with stable IDs, and a `correct` array containing one or more option IDs. Optional `explanation` is shown after checking. Free-response questions use `type: 'frq'` without options, correct answers, or model answers. They support the same images and Mermaid diagrams as MCQs. Text is rendered as text, not HTML.

Images use `image: { src: './assets/example.svg', alt: 'Meaningful description' }`. Mermaid diagrams use `mermaid` for source and `diagramDescription` for an accessible text equivalent. Avoid options such as “all of the above”: options are shuffled. Increment the quiz `version` whenever content changes to invalidate obsolete saved attempts.

The regression fixture in `tests/fixtures/sample-quiz.js` covers FRQs, an SVG image, and a Mermaid flowchart independently of the published test. Mermaid is pinned and bundled locally; the deployed site does not fetch scripts or fonts from third-party CDNs. The build only publishes `site/` and the Mermaid library, excluding source photographs and notes elsewhere in this workspace.

## Behavior

MCQs appear first, followed by free-response questions. Questions are shuffled within each section; MCQ options are also shuffled for every attempt. Selection is submitted with “Antwort prüfen”. Only the exact set of correct answers earns a point. Checked MCQ answers cannot be changed. Free-response drafts save as the visitor types; blank answers are allowed. Free responses remain editable in the final review and receive no automatic grade. Visitors can review results, restart the full test, or retry questions missed in the most recent attempt. Retry scores apply only to that subset and remain separate from the original full-test results. The original report and free responses remain accessible during retries and after a reload. Restarting asks before replacing progress.

Selections, free-response drafts, checked answers, order, original reports and results are saved to localStorage in the current browser. Clearing browser data removes progress; if storage is blocked, the quiz still works for the current page session and shows a notice. Nothing is sent to a results server. Content and correct answers are public, as expected for a practice tool.

## Copyable report

“Ergebnis kopieren” copies a German plain-text report: test title, version and link; original MCQ score and per-question selected/correct answers; every FRQ prompt and current response (or “Nicht beantwortet”); and descriptions of question images or diagrams. No name field is collected. FRQs are explicitly ungraded. The report updates when a response is edited; copy it again to send the latest text. Retry scores do not replace the original MCQ score.

When clipboard access is unavailable, the report opens with all text selected for manual copying. Visitors can always inspect the report using “Bericht als Text ansehen / manuell kopieren”. Copying does not send the report anywhere: the visitor sends it to their chosen verifier.

Übung 002 is supplied in `uebungstests/002_vertiefung.js`, with matching questions and solutions text files. `site/questions.js` contains the published copy. Its distinct quiz ID gives it separate browser-local progress from the earlier sample.

## GitHub Pages

The live site uses the `gh-pages` branch as its publishing source, with generated `dist/` files at the branch root. Source code lives on `main`. After content changes, rebuild and publish the updated `dist/` contents to `gh-pages`. The URL is https://alebo.github.io/bio-2026-11/. Relative asset paths support this repository subpath.

An optional GitHub Actions workflow is supplied in `deployment/pages-workflow.yml`. To enable automatic deployment from `main`, authenticate with workflow permission, move the template to `.github/workflows/pages.yml`, and change Settings → Pages to **GitHub Actions**. The initial token lacked workflow permission, so the first deployment uses branch publishing.

Workflow reference: https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages
