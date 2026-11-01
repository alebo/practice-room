---
name: download-materials
description: Download Google Drive folders into this project with rclone, including study materials and learner evidence. Use when asked to fetch or import files from a Drive folder link; does not create exercises or publish downloaded files.
---

# Download materials

Use an existing rclone remote to copy the requested folder's contents locally. Keep the remote unchanged.

## Choose the destination

- Store original study materials in `content/tests/<test>/sources/originals/`, optionally in a named batch subfolder. Preserve original filenames and nested directories. Infer the test from the request and existing project structure; ask if it is ambiguous.
- Store learner answers, reviews, and other learner evidence exclusively in `private/learners/`.
- Respect an explicit destination when it complies with those project rules. If it conflicts, explain the required private location and resolve the destination before copying.
- Confirm the destination is ignored with `git check-ignore` using a prospective file path. Do not place downloads in public set assets or commit them automatically.

## Discover and inspect

1. Check `command -v rclone` and `rclone listremotes`. Do not print rclone configuration files or credentials. If no usable authenticated remote exists, explain what setup is missing; do not start interactive authentication without the user.
2. Extract the folder ID from `/folders/<id>` in the supplied Drive URL. The `/u/3/` browser account selector does not select an rclone account. Discover remotes rather than hard-coding the account used in a previous session.
3. List the requested folder using the selected remote and a per-command root override:

   ```sh
   rclone lsf "$drive_remote" --drive-root-folder-id "$folder_id" --max-depth 2
   ```

   Here `drive_remote` includes its trailing colon. If access is denied, check another relevant configured remote or ask for the correct account. An empty listing alone does not prove that an inaccessible folder is empty.
4. Inspect the local destination for collisions. Preserve unrelated files. Use a separate subfolder for conflicting material unless replacement is explicitly intended.

If network access is blocked by the sandbox, retry through the tool's network/escalation approval mechanism. Do not change credentials or global rclone configuration to work around a sandbox error. Stop on unresolved authentication or permission errors and report the blocker.

## Copy and verify

```sh
rclone copy "$drive_remote" "$destination" \
  --drive-root-folder-id "$folder_id" \
  --immutable --stats 10s --stats-one-line --log-level INFO

rclone check "$drive_remote" "$destination" \
  --drive-root-folder-id "$folder_id" --one-way
```

`copy` downloads the folder's contents directly into the destination, including nested directories. Never use `sync` or `move` for a download request. `--immutable` prevents replacing differing existing files; resolve conflicts instead of silently skipping them or removing the flag without authorization to replace.

Wait for the transfer to finish and inspect its exit status before checking. One-way verification permits unrelated local files and compares source files against their downloaded counterparts. For Google-native documents or unsupported hashes, inspect the installed rclone Drive help, choose appropriate exports if needed, and state any verification limits instead of claiming checksum verification.

Report the destination, downloaded file count and size from actual output, verification result, and any failures or exclusions. Do not generate quizzes, upload learner data, or publish as part of downloading.


## Prepare study sources after downloading

For study materials, follow [prepare-sources](../prepare-sources/SKILL.md) after download verification to maintain one comprehensive, topic-organized reference under the ignored `content/tests/<test>/sources/`. Use the standard `sources/README.md`, `sources/source-content.txt`, and `sources/originals/` layout for every test. Migrate a legacy guide rather than retaining a second maintained filename. Preserve distinct relevant content with source/page references and an explicit coverage check, rather than creating parallel transcription and summary files. If the user explicitly requests download only, stop after verification and report the preparation step as outstanding. Learner-evidence downloads stay under `private/learners/` and must not enter this study reference. Neither workflow creates or publishes exercise sets automatically.

For download-only requests, still create or update `sources/README.md` with provenance and verification status; mark reference preparation as pending rather than creating a placeholder `source-content.txt`.
