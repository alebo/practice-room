# Project guidance

- Use English for repository paths, code identifiers, commands, and documentation. German UI and multilingual exercise content are intentional. Preserve existing published quiz/question IDs unless explicitly migrating them.
- Shared application code lives in `app/`. The canonical exercise data is `content/tests/<test>/sets/<set>/quiz.json`; do not recreate a shared questions file inside `app/`.
- Use `.agents/skills/quiz-content/SKILL.md` when preparing exercises or working with learner evidence.
- Learner answers, reviews, and knowledge-gap notes belong exclusively in ignored `private/learners/`. Never commit or publish them. Original study materials belong in ignored `content/tests/<test>/sources/`.
- `quiz.json` and explicitly selected set images are public content. Text handouts may be committed, but the site is built from JSON only.
- Run `npm test` and `npm run build` after content/tooling changes. Use `npm run test:browser` for UI and navigation changes. Browser tests include separate mixed-question fixtures.
- Publishing is an external action: use `npm run publish:pages` when the user requests publication. Do not hand-copy files or force-push the deployment branch. Verify the resulting Pages deployment and live page.
- Preserve unrelated user files. Include generic code, scripts, documentation, tests, and project-local skills in Git when asked to commit workspace changes.
