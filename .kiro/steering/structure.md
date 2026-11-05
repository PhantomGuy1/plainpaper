# PlainPaper — Structure Steering

## Repo layout

```text
plainpaper/
├── .kiro/                  # Kiro project config — COMMITTED, never gitignored
│   ├── steering/           # Standing guidance for every task
│   ├── specs/              # One folder per feature (see below)
│   ├── hooks/              # *.kiro.hook automation files
│   └── agents/             # Custom agent definitions
│       └── plainpaper-builder.json
├── src/                    # All application source
├── LICENSE                 # MIT — added at repo creation
└── README.md
```

- `/.kiro` sits at the **project root**. App source lives in `src/`.
- Steering lives in `.kiro/steering/`, specs in `.kiro/specs/`,
  hooks in `.kiro/hooks/`, agents in `.kiro/agents/`.

## Specs

- **One spec folder per feature**, named in **kebab-case**
  (e.g. `.kiro/specs/payday-buckets/`).
- Every spec folder holds exactly these three files:
  - `requirements.md`
  - `design.md`
  - `tasks.md`
- **No spec, no feature.** A feature does not get built — not a stub,
  not a spike in `src/` — until its spec folder exists with all
  three files.

## Hooks

- Hooks are `*.kiro.hook` files in `.kiro/hooks/`.
- Each hook is a single JSON file in Kiro's agent-hook shape.

## Custom agent

- The project's custom agent is `.kiro/agents/plainpaper-builder.json`.
- Builds run through that agent so the steering, specs, and hooks above
  apply consistently.

## Hard rules

- **`/.kiro` is committed to the repo and must NEVER be gitignored.**
  This is a hackathon requirement: the steering, specs, hooks, and agent
  are part of the entry's evidence. Any `.gitignore` entry that would
  exclude `/.kiro` (or anything under it) is a defect — remove it.
- **MIT LICENSE at the project root**, added at repo creation.
- **No feature ships without a spec** ("no spec, no feature").
