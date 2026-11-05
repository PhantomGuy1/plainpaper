// PlainPaper storage — the versioned localStorage store.
// Key:  plainpaper:data
// Shape: { version: 1, papers: Paper[] }
// Owned by the add-a-paper spec (see .kiro/specs/add-a-paper/design.md).
// No network calls. Everything stays on this device.

export type PaperType = 'bill' | 'letter' | 'school-note' | 'appointment' | 'other';

export interface Paper {
  id: string; // stable unique id, assigned on save
  title: string; // required, trimmed, non-empty
  type: PaperType; // required
  sender?: string; // who sent it (optional)
  amount?: string; // how much, Bill only, stored as typed (optional)
  dueDate?: string; // ISO YYYY-MM-DD from a date input (optional)
  ref?: string; // phone number or reference (optional)
  createdAt: number; // ms timestamp; entry order for deterministic sort
  done?: boolean; // true when in the Done list (owned by due-first-dashboard)
  doneAt?: number; // ms timestamp when marked done (owned by due-first-dashboard)
}

export interface PaydayPattern {
  day1: number; // 1–31, set by the user (owned by payday-buckets)
  day2: number; // 1–31, set by the user (owned by payday-buckets)
}

export interface PlainPaperStore {
  version: 1;
  papers: Paper[];
  paydayPattern?: PaydayPattern; // owned by payday-buckets
}

/** A paper before it has been assigned an id and createdAt. */
export type NewPaper = {
  title: string;
  type: PaperType;
  sender?: string;
  amount?: string;
  dueDate?: string;
  ref?: string;
};

const STORAGE_KEY = 'plainpaper:data';
export const CURRENT_VERSION = 1;

/** Does a parsed value look like a PlainPaper store? It must be an object with
 *  a numeric `version` and an array `papers`. The optional `paydayPattern` is
 *  not checked here — its absence is valid (older backups lack it). Shared by
 *  loadStore and the import path so both apply the same check. */
export function isValidStore(value: unknown): boolean {
  return (
    value !== null &&
    typeof value === 'object' &&
    typeof (value as PlainPaperStore).version === 'number' &&
    Array.isArray((value as PlainPaperStore).papers)
  );
}

/** A mutable view of the store used while migrating, where `version` is a
 *  plain number (not the literal `1`) so migration steps can bump it. */
type MutableStore = {
  version: number;
  papers: Paper[];
  paydayPattern?: PaydayPattern;
};

/** Ordered per-version migration steps. Step `i` upgrades the store from
 *  version `i+1` to `i+2` (MIGRATIONS[0] is the v1->v2 step). There are no
 *  steps yet — the current target is 1 — so this array is empty. Future shape
 *  changes add a step here and bump CURRENT_VERSION. */
const MIGRATIONS: Array<(store: MutableStore) => void> = [];

/** Walk a store from its `version` up to `target`, applying ordered per-step
 *  migrations. This is the single place future shape changes go, so old
 *  backups never break. There are no steps yet (target 1), so this is a
 *  pass-through. The store is shallow-copied first so the caller's object is
 *  never mutated. Storage reads run incoming stores through here so on-disk
 *  data is always current.
 *
 *  (see .kiro/specs/local-storage-and-backup/design.md) */
export function migrate(store: PlainPaperStore, target: number): PlainPaperStore {
  // Shallow-copy all own fields so migrations never mutate the caller's
  // object, and copy the papers array so per-paper steps can replace entries.
  const current: MutableStore = { ...store, papers: [...store.papers] };
  while (current.version < target) {
    const step = MIGRATIONS[current.version - 1];
    if (step) step(current);
    current.version = current.version + 1;
  }
  return current as PlainPaperStore;
}

/** Read the store. Returns a fresh empty store if none exists or it is
 *  malformed. Incoming stores run through `migrate` so stored data is always
 *  current. */
export function loadStore(): PlainPaperStore {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as unknown;
      if (isValidStore(parsed)) {
        return migrate(parsed as PlainPaperStore, CURRENT_VERSION);
      }
    } catch {
      // A broken payload is ignored; we fall back to a fresh store.
    }
  }
  return { version: CURRENT_VERSION, papers: [] };
}

/** Persist the store to localStorage. */
export function saveStore(store: PlainPaperStore): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

/** Initialize an empty versioned store on first run. No-op if one already exists. */
export function ensureStore(): void {
  if (localStorage.getItem(STORAGE_KEY) === null) {
    saveStore({ version: CURRENT_VERSION, papers: [] });
  }
}

/** Append a paper to the store, persist it, and return the saved paper. */
export function addPaper(input: NewPaper): Paper {
  const store = loadStore();
  const paper: Paper = {
    id: uuid(),
    createdAt: Date.now(),
    title: input.title,
    type: input.type,
  };
  // Optional details are stored only when the user entered them.
  if (input.sender !== undefined) paper.sender = input.sender;
  if (input.amount !== undefined) paper.amount = input.amount;
  if (input.dueDate !== undefined) paper.dueDate = input.dueDate;
  if (input.ref !== undefined) paper.ref = input.ref;
  store.papers.push(paper);
  saveStore(store);
  return paper;
}

/** Mark a paper Done, or move it back to the open groups. Persists the change.
 *  Owned by the due-first-dashboard spec (see .kiro/specs/due-first-dashboard/design.md). */
export function setPaperDone(id: string, done: boolean): void {
  const store = loadStore();
  const paper = store.papers.find((p) => p.id === id);
  if (!paper) return;
  if (done) {
    paper.done = true;
    paper.doneAt = Date.now();
  } else {
    paper.done = false;
    delete paper.doneAt;
  }
  saveStore(store);
}

/** Save the payday pattern (two days of the month) to the store. Owned by the
 *  payday-buckets spec (see .kiro/specs/payday-buckets/design.md). Stored only
 *  on this device; nothing is uploaded. */
export function savePaydayPattern(pattern: PaydayPattern): void {
  const store = loadStore();
  store.paydayPattern = pattern;
  saveStore(store);
}

/** Generate a UUID. Uses crypto.randomUUID when available, with a v4 fallback. */
function uuid(): string {
  if (typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  bytes[6] = (bytes[6] & 0x0f) | 0x40; // version 4
  bytes[8] = (bytes[8] & 0x3f) | 0x80; // variant
  const hex = [...bytes].map((b) => b.toString(16).padStart(2, '0'));
  return `${hex[0]}${hex[1]}${hex[2]}${hex[3]}-${hex[4]}${hex[5]}-${hex[6]}${hex[7]}-${hex[8]}${hex[9]}-${hex[10]}${hex[11]}${hex[12]}${hex[13]}${hex[14]}${hex[15]}`;
}
