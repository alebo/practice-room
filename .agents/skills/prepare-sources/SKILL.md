---
name: prepare-sources
description: Prepare downloaded or existing study materials as one comprehensive, traceable reference organized around a test topic. Use for PDFs, scans, photographs, documents, and notes before authoring exercises, or to improve an existing study guide; does not generate questions or publish source material.
---

# Prepare study sources

Maintain one reusable UTF-8 reference under `content/tests/<test>/sources/` for exercise generation. It should preserve the distinct educational content needed for the test and its prerequisites, organized by topic with references to the originals. It is a comprehensive working reference, not a brief revision sheet. A separate complete transcription and summary are not required.

## Choose the reference and scope

- Inspect existing derived references before creating a file. Improve a suitable `study-guide.txt` in place after checking its coverage and traceability; use `source-content.txt` for a new reference when none exists. For `biology-grade-8`, the existing `sources/study-guide.txt` is the reference to improve, not a reason to create a second overlapping file. An existing guide is not presumed verified merely because it exists.
- If several overlapping references exist, identify which will be maintained and reconcile unique material before retiring any duplicate. Do not silently delete or overwrite source material or human notes. Identify the chosen reference in the completion report so later authoring can find it.
- Read the user's test topic, grade, objectives, and exclusions, plus `test.json` and any assignment or topic sheet. Record inferred scope as an assumption; ask only when ambiguity materially changes what belongs in the reference. Distinguish exclusions for one exercise set from exclusions for the whole test: do not prune the reusable reference to match one set.
- Inventory the selected original study files recursively under `sources/`. Exclude derived guides and OCR outputs from the original-source inventory. Keep originals unchanged and respect an explicitly narrower source selection.
- Keep learner answers, assessments, and identifying information exclusively under `private/learners/`. For mixed worksheets, use the printed study material but separate learner annotations; do not promote a pupil's response into an authoritative fact. An existing guide that mixes these requires separation when it is revised. Use the quiz-content skill for learner-evidence processing.
- Confirm the reference is ignored with `git check-ignore` using its intended path. Neither originals nor the derived reference belong in Git, public assets, or a deployment.

## Read, extract, and consolidate

Use available local tools appropriate to the format. Prefer readable embedded text; use OCR or visual transcription for scans and photographs. Inspect every selected page/image, including automatically extracted text, to establish coverage and check reading order, columns, captions, and easily confused symbols.

Organize by topic and consolidate repetitions without losing distinct facts, definitions, conditions, exceptions, examples, instructions, worksheet tasks, quantities, units, formulas, or relationships. Preserve the source language and terminology. Faithful paraphrase is appropriate when meaning is unchanged; retain exact wording when it affects interpretation or an exercise, including negations and task constraints. Do not answer unsolved worksheet tasks during preparation.

For diagrams, describe visible labels, arrows, relationships, and captions. For tables, preserve headings and cell associations. Reference the original location when a visual cannot be adequately represented as text so an author can inspect it directly.

Account for material outside the test scope with a brief description, source location, and reason for exclusion; a full transcription of it is unnecessary. Retain prerequisites and borderline material rather than excluding it on an uncertain inference. A topic's absence from existing exercise sets is not evidence that it is outside scope. Keep references to all source occurrences when consolidating repeated material.

Mark unreadable text, uncertain OCR, missing pages, conflicting statements, and unsupported formats. Do not guess missing words, silently resolve disagreements, or correct factual claims without labeling the interpretation separately. Do not fill source gaps with outside knowledge presented as extracted content.

## Structure and traceability

Adapt the existing guide's organization where practical. Use English filenames and newly added structural labels; keep the educational content in its original language. The reference should contain:

- **Test scope:** topic, grade, objectives, exclusions, assumptions, and the date of the coverage check.
- **Source inventory:** stable source IDs, relative paths, actual page/image counts, file hashes, and processing status. Compute hashes from the files; do not invent them or infer page counts from filenames.
- **Topic-organized content:** comprehensive explanations and preserved examples/tasks, with source IDs and page/image references close to each fact group, table, or diagram description. A topic index is optional when the headings already provide navigation.
- **Coverage and open issues:** every source page/image accounted for as covered, consolidated with cited occurrences, outside scope with a reason, or unresolved. List missing objectives, contradictions, unreadable passages, and visuals requiring direct inspection.

For example, a content block can end with `[S03: images/page-03.jpg; S07: handout.pdf, PDF page 2 / printed page 8]`. Keep PDF position distinct from printed page numbering. A bibliography alone is insufficient if an author cannot trace a particular explanation or numerical claim to its source.

## Verify and maintain

Compare the reference with all selected originals, particularly negations, quantities, conditions, diagrams, and tables. Check that consolidation has retained distinct details and that scope exclusions are explicit. Describe it as comprehensive for the recorded scope only when the coverage check supports that claim; otherwise identify the remaining limits.

When sources change, compare their hashes with the inventory and refresh affected topics, citations, and coverage notes. Preserve unrelated content and clearly labeled human notes. Stage and check a revision before replacing the maintained reference. Do not create another permanent guide merely to refresh extraction.

A full verbatim transcription is optional when explicitly requested or when exact wording is the object of study. A separate short learner-facing revision sheet is optional when requested; derive it from the maintained reference and do not treat it as the source of truth. Temporary OCR output is a processing aid, not a second maintained authority.

Report the reference path, covered files/pages, scope, and remaining issues. For subsequent exercise generation, use [quiz-content](../quiz-content/SKILL.md): read the maintained reference first, then inspect originals for uncertain or visually dependent material. Preparing sources alone does not authorize generating exercises, committing source content, or publishing.
