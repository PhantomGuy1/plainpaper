# Local Storage and Backup — Design

## Components

- **storage** — the module from add-a-paper, extended here with the migration
  hook. Reads and writes `plainpaper:data`.
- **migrate(store, target)** — walks the store from its `version` up to the
  current target, applying ordered per-step migrations. The single place
  future shape changes go.
- **exportBackup()** — serializes the store to JSON and downloads it.
- **importBackup(file)** — reads, parses, validates, warns, migrates, writes,
  re-renders.
- **FirstRun** — the empty-store welcome state on the home screen.

## Data

- Consumes `PlainPaperStore` from add-a-paper (extended by payday-buckets
  with `paydayPattern?`). The backup file is the store object itself:
  `{ version, papers, paydayPattern? }`. Importing an older backup that
  lacks `paydayPattern` is fine — the field is optional.
- Adds no stored fields. Owns the migration policy and the backup file
  contract.

## Behaviour

### Migration hook

`migrate(store, target)` compares `store.version` to `target` and applies
ordered step functions (`v1toV2`, and so on). There are no steps yet
(target is 1), so it is a pass-through. Future shape changes add a step and
bump the target. This is the only place migrations live, so old backups
never break. Storage reads run incoming stores through `migrate` so stored
data is always current.

### Export

Read the store, `JSON.stringify` it, wrap it in a `Blob` with type
`application/json`, and download it as `plainpaper-backup-{YYYY-MM-DD}.json`.
One tap, no network.

### Import

A file input lets the user pick a file. Read it as text and `JSON.parse` it
on the device. Validate: the result must be an object with a `version`
(number) and a `papers` (array). If not, show "This file is not a PlainPaper
backup." and stop — nothing is overwritten. If valid, show the warning
"Importing replaces everything on this device with this backup." with a
confirm and cancel. On confirm: `migrate(parsed, CURRENT_VERSION)`, write it
to localStorage, re-render. On cancel: do nothing.

### Privacy line and first run

The home screen always shows the privacy line exactly: "Your papers stay on
this device. Nothing is uploaded." When `papers.length === 0`, the home
screen shows a plain-words welcome that explains the app and a clear way to
add the first paper, in place of the per-group empty lines. (The per-group
empty states owned by due-first-dashboard still apply when some groups have
items and others do not.)

No account, no sign-in, no server, and no network calls anywhere in export,
import, the migration hook, or the first-run state.
