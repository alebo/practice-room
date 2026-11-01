---
name: quiz-content
description: Create, convert, or edit exercise sets for this project's online quiz, and use imported learner answers to prepare targeted follow-up practice. Use for MCQs, free-response questions, images, Mermaid diagrams, supported content formats, and local verifier evidence.
---

# Quiz content and learner evidence

Prepare content compatible with the quiz at https://alebo.github.io/practice-room/. This skill is project-local. Paths below are relative to the repository root, three directories above this skill folder.

## Source of truth

Before editing content, inspect `content/tests/<test>/sets/<set>/quiz.json` and `app/quiz.js` for validation, ordering, scoring, and report behavior. Inspect `app/app.js` when rendering matters. Treat the implementation as authoritative if it has changed since this skill was written.

Shared code is in `app/`. Each test has `content/tests/<test>/test.json`; each exercise set has one authoritative `quiz.json` and optional images under `assets/`. Repository paths and skill tags use English. Content may remain German or use another language. Preserve existing published IDs for browser compatibility.

`content/active-set.json` selects the homepage exercise. Every set also builds at `/tests/<test>/<set>/`. Use `npm run sets:list`, `npm run set:new -- --test ID --set ID --title TEXT`, and `npm run set:activate -- --test ID --set ID`; do not copy question files into app code. See `README.md` for preview and publishing commands. Creating content alone does not request deployment.

## Prepare and use study sources

When authoring from supplied materials, read `content/tests/<test>/sources/README.md` for provenance/status, then `sources/test-scope.txt` for the original announced topics and the maintained reference `sources/source-content.txt`. Originals live under `sources/originals/`; follow inventory links for private sources. Do not require both files or treat a short revision sheet as the source of truth. If the reference is missing, lacks verified coverage/traceability, or is stale against the source inventory/hashes, use [prepare-sources](../prepare-sources/SKILL.md) to improve it before generating source-dependent questions. Let the announced scope govern coverage; use the materials for classroom terminology and depth. Relevant general knowledge may fill missing coverage at the specified grade level. Record supplemental claims separately in the local reference with their rationale and verification references where needed; do not misattribute them to the photos. Verify uncertain, specialized, current, or legal answer-key claims against authoritative sources. Excess material does not independently expand scope. Use the reference's topic organization to select material; inspect originals for uncertain text and visual dependencies. Do not treat a missing objective in the sources as evidence that it is outside scope, or turn uncertain OCR into an answer key. Keep extraction outputs ignored and learner-specific evidence separate.

## Supported questions

| Type | Input and assessment |
| --- | --- |
| Single-answer MCQ | `type: 'mcq'` or omitted. One option ID in `correct`; visitor selects one option. |
| Multiple-answer MCQ | Same schema, with multiple option IDs in `correct`; visitor selects all applicable options. |
| Free response (FRQ) | `type: 'frq'`. Visitor writes multiline plain text. No automatic grading or model answer; an external verifier assesses the copied response. |

MCQs appear first, followed by FRQs. Questions shuffle within each section, and MCQ options shuffle independently. Questions must stand on their own: avoid references to question position, option letters, “all of the above,” or an assumed previous answer. Refer to an option's content if a reference is necessary.

MCQs award one point only for the exact correct set, with no partial credit. Visitors press **Antwort prüfen**, see the correct options and an optional explanation, then continue; checked MCQ answers cannot be edited. **Weiß ich nicht** submits an empty selection, shows the solution, and allows continuing. It earns no point, remains eligible for retry, and appears as **Nicht beantwortet** in the review and report. Imported evidence marks it as unanswered rather than inventing an incorrect choice. The **Zurück** button returns to earlier questions during an attempt. FRQs can be skipped, save drafts as the visitor types, and remain editable when revisited or in the final review. Navigation preserves later drafts across reloads; checked MCQs remain locked. Blank or whitespace-only responses appear as **Nicht beantwortet**.

Do not present attachments, drawing inputs, audio/video responses, automatic short-answer matching, numerical tolerance grading, Markdown/HTML rendering, or dedicated LaTeX rendering as existing features. A numerical or mathematical answer can be requested as an ungraded plain-text FRQ.

## Content schema

The `quiz.json` object contains `id`, integer `version`, default `language`, `title`, `subtitle`, `label`, and a `questions` array. Preserve stable IDs; increment `version` when changing test content. Browser attempts retain a full question snapshot and remain readable and copyable across version changes. Only an explicitly confirmed full restart replaces the saved answers with an attempt on the latest version. Incompatible legacy data is preserved for raw-data copying rather than overwritten.

Every question needs a unique stable `id` and a plain-text `prompt`. Optional fields shared by MCQs and FRQs:

- `topic`: short display label.
- `language`: language tag such as `de`, `en`, or `pl`; falls back to the quiz language. The UI and report labels stay German, while question content may use another language.
- `image: { src, alt }`: one question image. Store images under the exercise set's `assets/` folder and use a relative URL such as `./assets/cell.svg`. Provide a meaningful text equivalent in `alt`.
- `mermaid`: diagram source as a JSON string. Supply `diagramDescription` as a readable text equivalent. Mermaid is rendered locally with strict security settings; do not rely on embedded HTML or interactive links. Large diagrams can scroll horizontally.

Plain-text prompts, options, and explanations are not interpreted as Markdown or HTML. Images and diagrams belong to the question; there is no dedicated media field for an individual answer option.

For MCQs, provide `options: [{ id, text }, ...]`, with unique option IDs within each question, and a non-empty `correct` array of existing option IDs. Optional `explanation` appears after checking. Do not invent the correct answer or silently resolve an ambiguous source question; clarify material ambiguity with the user.

For FRQs, omit `options`, `correct`, and `explanation`. Do not put a model answer or grading rubric in the public question file as though it will be hidden from visitors. Prepare verifier-only guidance separately if requested.

Examples of question objects (use JSON syntax in the set file):

```json
{
  "id": "photosynthesis-inputs",
  "type": "mcq",
  "topic": "Fotosynthese",
  "skills": ["photosynthesis.inputs"],
  "prompt": "Welche Stoffe benötigt eine Pflanze für die Fotosynthese?",
  "options": [
    {"id": "water", "text": "Wasser"},
    {"id": "co2", "text": "Kohlenstoffdioxid"},
    {"id": "oxygen", "text": "Sauerstoff"}
  ],
  "correct": ["water", "co2"],
  "explanation": "Wasser und Kohlenstoffdioxid sind Ausgangsstoffe der Fotosynthese."
}
```

```json
{
  "id": "explain-darkness",
  "type": "frq",
  "language": "de",
  "topic": "Fotosynthese",
  "skills": ["photosynthesis.light"],
  "prompt": "Wie wirkt sich Dunkelheit auf die Fotosynthese aus? Begründe deine Antwort."
}
```

## Copyable verifier report

The **Ergebnis zur Prüfung teilen** section prioritizes creating and copying a share link. **Als Text kopieren** is the secondary alternative, with a manual text preview in the same section. It produces plain text containing:

- Test label, title, version, and link.
- Original full-test MCQ score and per-question results, selected answers, and correct answers.
- Every FRQ prompt and its current edited response, or **Nicht beantwortet**; FRQs are explicitly ungraded.
- Image `alt` descriptions and `diagramDescription` text. Visuals are not embedded, and Mermaid source is not included; the test link supplies visual context.

Write media descriptions with this report in mind. They must communicate the relevant visual information without unnecessarily giving away the answer. Preserve multilingual text and line breaks in free responses.

No name field or central result collection exists. Visitors send the copied report themselves. Manual text selection is available if clipboard access fails. Retrying missed MCQs keeps the original full-test report and FRQ answers; retry scores are separate. A confirmed full restart replaces the saved attempt. Answers use localStorage without an application expiry; copying, reloading, and reopening do not clear them. Browser data clearing or unavailable storage can still remove or prevent persistence. Browser-local storage is not a verifier-grade audit trail, and public practice questions include their correct answers in the shipped source.

## Use learner evidence for follow-up sets

Learner data belongs only in ignored `private/learners/<learner-id>/`. Never commit responses, verifier notes, or knowledge-gap files or include them in site deployments. A learner may explicitly share an encrypted result through the PrivateBin button; never upload answers automatically. Raw source material belongs in ignored `content/tests/<test>/sources/`; selected published question images go in the set's `assets/`.

Import a copied report with:

```sh
npm run answers:import -- --learner learner-001 --test biology-grade-8 --set 002-nutrients-and-digestion --file private/learners/learner-001/imports/report.txt
npm run answers:gaps -- --learner learner-001
```

For a learner's PrivateBin link, use `--url` instead of `--file`:

```sh
npm run answers:import -- --learner learner-001 --test biology-grade-8 --set 002-nutrients-and-digestion --url 'https://privatebin.net/?PASTE_ID#KEY'
```

The full link including `#KEY` is required and grants access to the report; keep it out of Git and public messages. The importer accepts only the configured `privatebin.net` HTTPS service, retrieves ciphertext without transmitting the key, decrypts locally, and imports the original full-test report. Password-protected pastes are unsupported. Do not claim a successful import if the link expired, decryption failed, or the quiz version does not match. Use the retained browser report or original quiz version to resolve the issue.

The app's **Link erstellen** button uploads only on a learner's explicit action. Links currently expire after three days; the service limits uploads to one per minute. Link creation/copying does not reset browser answers. FRQ edits require a new link to share the changed report. Existing links remain snapshots until they expire; local reset does not remotely delete a paste.

Read `knowledge-gaps.json` and the referenced attempt's `attempt.json`/`review.json` when authoring targeted practice. Each import preserves raw text and the exact quiz snapshot. Report version mismatches and ambiguous parsing require clarification, not guessed answer matches. Existing baseline evidence may be reconstructed from notes; check provenance and do not describe its import date as the date of the test.

Use missed correct options, incorrect selections, and verifier observations as evidence. `skills` are stable English concept tags shared across exercise sets (for example `nutrients.roles`, `digestion.mouth`, `digestion.stomach`). Match these tags to prior sets so the summaries can connect repeated concepts. Do not equate one wrong answer with a proven misconception or count unreviewed FRQs as failed. Inspect repeated attempts and dates before claiming improvement or persistent gaps.

For FRQs, the verifier records `unreviewed`, `correct`, `partial`, or `incorrect` and explanatory `notes` in the local `review.json`; regenerate the gap summary after editing. MCQ correctness stays derived from the selected options. Author a new set focused on the observed gaps, respecting user exclusions. Keep learner-specific rationale and evidence references local; the resulting questions and general skill tags may be public.

## Check and publish content

Run `npm test` and `npm run build` after editing question data. Use browser checks for new media or interaction changes; see `README.md`. The mixed-question sample lives in `tests/fixtures/` and is used only for regression coverage. Keep it independent of published content.

`npm run publish:pages` publishes all sets and the selected homepage, using committed code/content and a clean build. Use it when publication is requested, then verify the Pages deployment and live URL. Do not manually synchronize duplicate question files. Ordinary builds exclude private evidence, source materials, text handouts, and test-only assets.
