# PlainPaper

PlainPaper turns bills, letters and school notes into one clear list — how much, by when, and which paycheck it comes from.

Your papers stay on this device. Nothing is uploaded.

**Status:** Foundation: Kiro steering, specs, hooks and builder agent in place; feature build in progress for Kiroween 2026.

## How it's built

PlainPaper is built spec-first with a Kiro CLI workflow:

- One spec per feature in `.kiro/specs/` — no spec, no feature.
- Standing guidance in `.kiro/steering/` (product, tech, structure, and the plain-English house voice).
- Automation hooks in `.kiro/hooks/` (build check on save, plain-English check, spec task tracking).
- A custom Kiro agent, `plainpaper-builder`, in `.kiro/agents/`.

Directed by Jonathan Ream, built by an AI agent operating Kiro CLI headlessly.

PlainPaper is free, private, and needs no account. Everything is stored locally in the browser; there is no server, no upload, and nothing to sign in to.

## Project layout

```text
plainpaper/
├── .kiro/
│   ├── steering/     # Product, tech, structure, plain-English guidance
│   ├── specs/        # One folder per feature: requirements, design, tasks
│   ├── hooks/        # *.kiro.hook automation files
│   └── agents/       # plainpaper-builder custom agent
├── src/              # Application source (Vite + vanilla TypeScript)
├── LICENSE           # MIT
└── README.md
```

## Run it

Placeholder — run instructions will be added once the app scaffold is in place.
