---
name: prepare-sources
description: Extract downloaded or existing study materials into a complete, traceable text reference organized around a test topic. Use for preparing PDFs, scans, photographs, documents, and notes before authoring exercise sets; does not generate questions or publish source material.
---

# Prepare study sources

Create `content/tests/<test>/sources/source-content.txt` as a reusable UTF-8 reference for exercise generation. Preserve the complete readable educational content, with a topic index that helps authors find relevant material. This is a local derived source, not a replacement for the originals or a short study summary.

## Establish scope and inputs

- Read the user's test topic, grade, learning objectives, and exclusions, plus `content/tests/<test>/test.json` and any assignment or topic sheet. Record inferred scope as an assumption; ask only when ambiguity would materially change the extraction or classification.
- Inventory the study files recursively under the selected test's `sources/`. Exclude generated extraction outputs from the input inventory. Keep originals unchanged and respect an explicitly narrower source selection.
- Keep learner answers, marked learner work, assessments, and identifying information exclusively under `private/learners/`. Do not merge that evidence into the shared study reference. Use the quiz-content skill for learner-evidence processing.
- Confirm the output is ignored with `git check-ignore` using its intended path. Neither originals nor extracted text belong in Git, public assets, or a deployment.

## Extract and inspect

Use the available local tools appropriate to each format. Prefer embedded PDF/document text when readable; use OCR or direct visual transcription for scans and photographs. Preserve the source language, terminology, examples, questions, instructions, definitions, numbers, units, formulas, and meaningful annotations. Normalize layout artifacts only when meaning remains clear. Do not answer unsolved worksheet questions during extraction.

Inspect every page/image, including text extracted automatically. Check reading order, columns, captions, and easily confused symbols against the original. For diagrams, describe visible labels, arrows, relationships, and captions. For tables, preserve row/column headings and cell associations. Record the original location when a visual cannot be represented adequately as text; exercise authors must inspect it directly.

Mark unreadable text, uncertain OCR, missing pages, conflicting statements, and unsupported formats explicitly. Do not guess missing words or silently correct a source's factual claims. Keep transcription separate from any clearly labeled interpretation or suspected correction. Do not use outside knowledge to fill gaps as if it came from the supplied material.

## Write the reference

Use English section labels and filenames; retain source-language content. A useful layout is:

```text
TEST SCOPE
Test ID, topic, grade, objectives, exclusions, and assumptions.

SOURCE INVENTORY
S01 | relative/path.pdf | page count | SHA-256 | extraction method | status
S02 | relative/image.jpg | one image | SHA-256 | visual transcription | status

TOPIC INDEX
Topic or learning objective -> source IDs and page/image references.
Include prerequisites, material outside the stated scope, and scope gaps.

EXTRACTED CONTENT
[S01 | relative/path.pdf | PDF page 1 | printed page 7, if present]
Source heading and complete readable content ...
[Diagram description; location and unresolved visual details ...]

[S02 | relative/image.jpg | image 1]
...

OPEN ISSUES AND COVERAGE
Unreadable passages, missing or unsupported inputs, contradictions,
visuals requiring inspection, and objectives not covered by the sources.
```

Record hashes and page counts from actual files/tools, not estimates presented as facts. Source IDs plus paths and page/image references must make every passage traceable. Preserve the distinction between PDF page position and printed page numbering.

The topic index prioritizes what matters for the test; it does not filter away unrelated readable content from the selected files. Mark such sections as outside scope. Preserve prerequisites and boundary cases. Do not assume that a topic absent from existing exercise sets is outside the test scope. If identical pages are deduplicated, retain a reference for every original occurrence.

## Verify and maintain

Account for every selected file and every page/image as extracted, explicitly referenced duplicate, or unresolved. Compare the reference with the inventory and original material, especially negations, quantities, diagrams, and tables. State coverage limits rather than claiming a complete extraction while inputs remain unreadable.

When sources change, compare their hashes with the recorded inventory. Refresh affected passages and topic references; preserve unrelated material and any clearly labeled human notes. Treat changed/deleted sources and unresolved conflicts explicitly. Avoid overwriting an existing reference until the revised extraction has been checked.

Report the output path, covered files/pages, test scope, and remaining issues. For subsequent exercise generation, use [quiz-content](../quiz-content/SKILL.md): read this reference first, then inspect originals for uncertain or visually dependent material. Preparing sources alone does not authorize generating exercises, committing source content, or publishing.
