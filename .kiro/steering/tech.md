# PlainPaper — Tech Steering

Stack decisions are recorded here and held. Changing one requires a
deliberate steering edit, not a mid-task substitution.

## Stack

- **Vite + vanilla TypeScript**, single-page app.
- No UI framework. No component library. The app is small enough that
  plain TypeScript and the DOM are the whole toolkit.

## Styling

- **ONE hand-written CSS file.** No CSS framework, no preprocessor,
  no utility-class library.
- **System fonts only.** No webfonts, no font downloads.
- Large type, high contrast — the Simplicity Gate applies to reading,
  not just wording. A tired person in the morning must be able to read
  every screen at arm's length.

## No external anything

- **NO external assets, webfonts, frameworks, or APIs.**
- Nothing is fetched at runtime from a third party.
- **$0 and key-free:** the finished app needs no API key, no paid plan,
  and no account to run — for the user or for us.

## Data

- Data lives in **browser localStorage** only. There is no backend
  and no sync.
- Storage shape: a **single versioned array of paper items** — one stored
  object carrying a `version` field alongside the array, so future shape
  changes can migrate old data instead of breaking it.
- JSON export/import is the backup and restore path, handled entirely
  on the device.

## Calendar

- Calendar files are generated **client-side**: build the `.ics` content
  in the browser and deliver it as a **Blob download**.
- No calendar account connection, no calendar API.

## Hosting

- **Static hosting only** — Netlify-class static hosting, with
  GitHub Pages as the fallback.
- The deploy artifact is plain static files. If it needs a server
  process, it is wrong.

## Credentials

- **The only credential in this project is the Kiro tooling used to
  build it.**
- The app itself holds no keys, tokens, or secrets — because it talks
  to nothing.
