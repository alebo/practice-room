# Quiz workspace

Reusable HTML/CSS/JavaScript practice app with German UI and multilingual content. The public site is https://alebo.github.io/practice-room/. Repository paths, scripts, and documentation use English; learner-facing content may use any language.

## Layout and ownership

```text
app/                                  Shared quiz UI, scoring, reports, and styles
scripts/                              Content, build, publishing, and evidence tools
content/
  active-set.json                     Exercise shown at the homepage
  tests/biology-grade-8/
    test.json                         Test metadata
    sets/
      001-basics/quiz.json             Original single-answer exercise
      002-nutrients-and-digestion/
        quiz.json                     Authoritative question data
        questions.txt                 Optional author-provided handout
        solutions.txt                 Optional author-provided answer key
        assets/                       Optional published question images
    sources/                          LOCAL ONLY: study guide and original photos
private/
  learners/<learner-id>/               LOCAL ONLY: imported responses and reviews
    imports/                          Original copied reports or source notes
    attempts/<attempt-id>/
      report.txt                      Original imported report
      attempt.json                    Answers plus exact quiz snapshot and provenance
      review.json                     Verifier assessments and notes
    knowledge-gaps.json               Evidence grouped by skill
.agents/skills/quiz-content/           Project-local question-authoring skill
tests/                                Unit/browser checks and sample fixtures
deployment/pages-workflow.yml         Optional Actions workflow template
.playwright/                          Generated browser-test results and reports, ignored
dist/                                 Generated static site, ignored by Git
```

Keep the app and publishable questions/answer keys in this repository: the practice app already delivers answer keys to visitors, and versioning content with the engine makes deployments reproducible. Keep learner answers, assessments, knowledge-gap notes, and original study materials out of Git and the site deployment. Learners may explicitly share encrypted reports through PrivateBin; this is separate from the public site files. `.gitignore` excludes `private/` and test `sources/`; the builder copies only the app, explicit quiz data, supported image assets, and bundled Mermaid. Moving to a private content repository later is possible without changing the quiz schema; it is not needed for these public exercise sets.

The imported first-attempt evidence is under the local learner alias `learner-001`. Its provenance identifies it as reconstructed from existing notes, not a new online submission. No learner data is committed. Back up `private/` and `sources/` separately if needed; Git does not protect these local files.

## Preview and checks

Node.js 22 or newer is required.

```sh
npm ci
npm run sets:list
npm test
npm run build
npm start
```

Open http://127.0.0.1:4173. The homepage opens the active set; each set also has a stable route:

```text
/tests/biology-grade-8/001-basics/
/tests/biology-grade-8/002-nutrients-and-digestion/
```

Copied reports use the stable set URL even when a visitor starts at the homepage. All sets share the same app and Mermaid bundle. Browser progress is keyed by quiz ID, so sets do not overwrite one another.

For browser checks:

```sh
npx playwright install chromium
npm run test:browser
# Or use installed Google Chrome:
PLAYWRIGHT_CHANNEL=chrome npm run test:browser
```

Browser checks explicitly build with sample assets; ordinary builds and publishing exclude those test-only assets. The mixed-question fixture keeps FRQ, image, and diagram regression coverage independent of current content.

## Add and publish an exercise set

1. Create a set with English slugs:

   ```sh
   npm run set:new -- --test biology-grade-8 --set 003-targeted-practice --title "Gezielt weiterüben"
   ```

2. Replace the scaffold in `content/tests/biology-grade-8/sets/003-targeted-practice/quiz.json`. This JSON is the only app input; optional text handouts are reference documents, not a second runtime source. Put selected images in the set's `assets/`. Use the local `$quiz-content` skill for authoring conventions.
3. Choose the homepage set:

   ```sh
   npm run set:activate -- --test biology-grade-8 --set 003-targeted-practice
   npm test
   npm run build
   ```

   To preview a different homepage without saving that selection, use `npm run build -- --test biology-grade-8 --set 003-targeted-practice`.

4. Review locally, run relevant browser checks, and commit the app/content changes. Push source to `main` when sharing the changes.
5. When publication is requested, run:

   ```sh
   npm run publish:pages -- --dry-run  # Validate without changing GitHub
   npm run publish:pages
   ```

   The command requires committed app/content/tooling changes, refuses scaffold placeholders, runs unit checks, builds a clean site, and updates `gh-pages` without force-pushing. It uses the current `gh` login over HTTPS. No workflow permission is needed. Check the resulting deployment using `gh run list --repo alebo/practice-room --branch gh-pages`, then verify the live URL. A successful Git push alone does not verify deployment.

Each build includes all exercise sets, so old links remain usable when the homepage changes. Editing an existing set requires increasing its `version`. Saved browser attempts retain their own question snapshot and remain readable and copyable; the new version is used only after the visitor explicitly confirms a full restart. Prefer a new set for new exercises. Imports verify the report version and store a full quiz snapshot, preserving the meaning of previously imported answers. To import a report for an older edited version, restore that version of the set from Git first.

## Question format

A quiz contains `id`, integer `version`, `language`, `title`, `subtitle`, `label`, and `questions`. Give every set a unique quiz ID and every question a stable ID. Existing IDs from previously published content are preserved for browser compatibility.

- MCQ: `type: "mcq"` (or omitted), `prompt`, `options: [{id, text}]`, `correct: [optionId, ...]`, and optional `explanation`.
- FRQ: `type: "frq"`, `prompt`; no options, automatic grade, or model answer. Plain multiline text only; skipping is allowed and answers can be edited in final review.
- Shared optional fields: `topic` (display label), `language`, `skills` (stable English concept tags, such as `digestion.mouth`), `image: {src: "./assets/example.svg", alt: "..."}`, `mermaid`, and `diagramDescription`.

Questions shuffle within sections: MCQs first, then FRQs. MCQ options also shuffle. Only the exact correct set earns a point; avoid position-dependent options. Browser answers use `localStorage` under `lernraum:<quiz-id>`, with the complete question snapshot, drafts, selections, order, and original/retry state. There is no app expiration. Reloading or reopening the same set restores the saved attempt. Copying does not clear it. Incompatible legacy data is preserved with a raw-data copy option until an explicit reset. Browser data clearing, private browsing, or unavailable storage can prevent persistence.

The UI remains German and content is rendered as plain text, except explicitly supplied images and Mermaid diagrams. FRQs are not automatically assessed. Retry scores remain separate from the original full-test report.

## Import answers and prepare targeted follow-up questions

Visitors finish a test and can either copy the report text or explicitly create an encrypted sharing link. The site does not automatically upload answers or collect identities. Save a received report in `private/learners/<learner-id>/imports/`, then:

```sh
npm run answers:import -- --learner learner-001 --test biology-grade-8 --set 002-nutrients-and-digestion --file private/learners/learner-001/imports/set-002-report.txt
npm run answers:gaps -- --learner learner-001
```

Import checks the title/version and matches every question and selected option to that quiz. It rejects mismatches and duplicate reports, preserves raw text and the quiz snapshot, and recalculates MCQ correctness. An ambiguous text report is rejected for manual clarification rather than guessed. The literal FRQ response “Nicht beantwortet” is treated as skipped because the copied text does not distinguish it from a blank answer.

### Share and import a PrivateBin link

At the end of a test, **Link erstellen** encrypts the current full-test report in the browser and uploads only ciphertext to `https://privatebin.net/`. The learner then presses **Link kopieren** and sends the full link to the verifier. No registration or application backend is required.

The selected instance currently allows three-day pastes and enforces a one-minute interval between uploads. The page reuses an existing unexpired link for unchanged answers. Editing an FRQ marks the existing link as outdated; creating a new link shares a new snapshot. Old links are not silently updated. Burn-after-reading and discussions are disabled. The app's report limit is 512 KiB.

```sh
npm run answers:import -- --learner learner-001 --test biology-grade-8 --set 002-nutrients-and-digestion --url 'https://privatebin.net/?PASTE_ID#KEY'
npm run answers:gaps -- --learner learner-001
```

Supply the complete URL, including the fragment after `#`. That fragment is the decryption key: anyone holding the complete link can read the report. The importer fetches ciphertext without sending the key, decrypts locally, and uses the same validated report import as `--file`. It accepts only `privatebin.net` HTTPS links; password-protected pastes are not supported. Full secret links are not written to import provenance or printed by the importer.

Sharing, import, and link expiry do not clear browser answers. A confirmed local restart clears the saved attempt and its local share link, but it does not delete a previously uploaded paste; the paste expires independently. If the service is unavailable or rate-limited, the report remains available for copying and later retry. Actual encrypted upload, official PrivateBin viewing, and CLI import were verified with synthetic data; the test pastes were deleted afterward.

Protocol reference: https://github.com/PrivateBin/PrivateBin/wiki/Encryption-format

For FRQs, edit the attempt's `review.json`: `assessment` is `unreviewed`, `correct`, `partial`, or `incorrect`; add `notes` explaining the evidence. MCQ scores remain derived from the selected answers; review notes may supplement them. Run `answers:gaps` again after review.

The resulting local `knowledge-gaps.json` groups evidence by `skills` (or `topic` as a fallback), recording the original prompt, missed correct options, incorrect selections, verifier notes, and attempt references. Unreviewed FRQs are listed separately and do not count as gaps. Import timestamps are not the dates when the learner took the test. Repeated attempts are retained as separate observations, not treated as independent proof of knowledge.

To create the next exercise, read this evidence, choose the concepts needing practice, and author a new set using those skill tags. Keep learner-specific rationale and attempt references in `private/`; publish only the resulting questions. This workflow supports evidence-based authoring; it does not automatically invent questions or infer mastery from a single answer.

## Hosting

The repository uses branch-based GitHub Pages publishing from `gh-pages`. The optional workflow in `deployment/pages-workflow.yml` can instead be installed under `.github/workflows/` when the GitHub token has workflow permission and Pages is switched to Actions. Both paths use the same content builder.
