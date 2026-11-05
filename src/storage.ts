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

export interface PlainPaperStore {
  version: 1;
  papers: Paper[];
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
const CURRENT_VERSION = 1;

/** Read the store. Returns a fresh empty store if none exists or it is malformed. */
export function loadStore(): PlainPaperStore {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as unknown;
      if (
        parsed &&
        typeof parsed === 'object' &&
        typeof (parsed as PlainPaperStore).version === 'number' &&
        Array.isArray((parsed as PlainPaperStore).papers)
      ) {
        return parsed as PlainPaperStore;
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
