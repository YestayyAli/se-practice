# SIS #04 — Report: Evolving the Smart Campus Room Availability Checker

<!-- The ONLY file you write prose in. Keep every numbered heading (## 1. … ## 10.), every
     ### sub-heading and every **Label:** word — the checker finds your answers by them.
     Replace every "(write here)" and "(paste here)". Delete these <!-- --> comments if you like. -->

## 1. Setup and starting point

<!-- Model: the exact model with its version, as the tool shows it ("ChatGPT" is a tool, not a
     model). If the tool does not show it, write: not displayed
     Starting point: week-08 | week-07 | sis-03 | starter   (README section 3)
     Baseline commit: the commit that brings your starting point into sis-04/app/ UNCHANGED —
     git rev-parse --short HEAD right after that commit. It is your "initial version". -->

| Item | Value |
| --- | --- |
| Assistant (tool) | Claude (Anthropic), Claude app — a fresh chat for the analysis |
| Assistant model | claude-opus-5-5 |
| Starting point | week-08 |
| Baseline commit | 089d484 |
| Language (ts or js) | ts |
| Vitest version | 3.2.7 |
| Where I ran the tests | Claude's cloud workspace (Linux, Node 22), the same `npx vitest run` as on a laptop |

### 1.1 Baseline run

<!-- Before you change anything: run the tests of your starting point inside app/ and paste the
     REAL output. No tests yet (starter, sis-03)? Paste the run anyway: Vitest prints
     "No test files found". That is your honest "original" number, 0/0. -->

```text
RUN  v3.2.7 /tmp/claude-0/-home-claude/1eda5b01-3edc-5079-b003-face1eadcafe/scratchpad/sisrepo/sis-04/app
 ✓ src/booking.test.ts (23 tests) 5ms
 Test Files  1 passed (1)
      Tests  23 passed (23)
   Start at  23:52:18
   Duration  250ms (transform 50ms, setup 0ms, collect 50ms, tests 5ms, environment 0ms, prepare 62ms)
```

## 2. Context for the assistant

### 2.1 Repository map

<!-- The concise map you gave the assistant: the files that matter and one line each on what
     they do. A tree is fine:  src/App.tsx — the page, holds the rooms and the form … -->

```text
sis-04/app/
├── index.html            — Vite entry page, mounts #root
├── package.json          — React 18 + Vite 5 + TypeScript; devDependency vitest 3; script "test": "vitest run"
├── src/main.tsx          — renders <App /> into #root
├── src/App.tsx           — the whole page: 2 hard-coded rooms (id, name, blocked, bookings), toMinutes()/fmt() time helpers,
│                           form state (room, now, start, end, "ends at 24:00", "room blocked" checkbox), check() validates
│                           the inputs and calls canBook, shows Available/Unavailable and the room's bookings
├── src/booking.ts        — canBook({ start, end, now, blocked, bookings }): boolean — AC1–AC5 (from Practice #07/#08)
├── src/booking.test.ts   — 23 Vitest tests for canBook (T01–T14, AC5, X1–X5, BUG-A, BUG-B)
└── src/index.css         — layout, responsive grid, result colours
```

### 2.2 The context message as sent

<!-- The whole first message of your analysis chat: the map, AC1–AC6, F1–F5 and the constraints
     (no login, payments, live APIs or database; fictional data only). Unedited. -->

````text
I am extending a small React + TypeScript app (Smart Campus Room Availability Checker). Please analyse it for maintainability risks with file/function references, and give me a short plan of small, safe steps. Please do not rewrite anything: I want a plan, not a full rewrite, and no code yet.

Repository map:
sis-04/app/
├── index.html            — Vite entry page, mounts #root
├── package.json          — React 18 + Vite 5 + TypeScript; devDependency vitest 3; script "test": "vitest run"
├── src/main.tsx          — renders <App /> into #root
├── src/App.tsx           — the whole page: 2 hard-coded rooms (id, name, blocked, bookings), toMinutes()/fmt() time helpers,
│                           form state (room, now, start, end, "ends at 24:00", "room blocked" checkbox), check() validates
│                           the inputs and calls canBook, shows Available/Unavailable and the room's bookings
├── src/booking.ts        — canBook({ start, end, now, blocked, bookings }): boolean — AC1–AC5 (from Practice #07/#08)
├── src/booking.test.ts   — 23 Vitest tests for canBook (T01–T14, AC5, X1–X5, BUG-A, BUG-B)
└── src/index.css         — layout, responsive grid, result colours

Requirements I must preserve (AC1–AC6):
AC1 Reject start ≥ end and requests in the past.
AC2 Enforce the maximum allowed duration (120 minutes).
AC3 Reject a blocked room.
AC4 Reject overlaps; allow bookings that only touch at endpoints.
AC5 Return Available / Unavailable without changing booking data.
AC6 Clear, responsive feedback on desktop and mobile.

New feature: a catalog of at least four fictional rooms, each with id, name, capacity, equipment list, blocked status and its own bookings. Show only the rooms that satisfy the user's selection. The availability check must use the chosen room's bookings.
F1 Capacity filter: room capacity must be greater than or equal to the requested attendees.
F2 Equipment filter: the room must contain ALL selected required items.
F3 A blocked room cannot be reported as available.
F4 Show a clear empty state when no rooms match.
F5 Changing the selected room must refresh the availability result appropriately.

Fixed layout for the result: src/rooms.ts (type Room + const ROOMS), src/filter.ts (filterRooms(rooms, { attendees, equipment })), src/booking.ts (canBook unchanged + checkRoom(rooms, roomId, { start, end, now }) that calls canBook), App.tsx + components import these and hold no room data or rule of their own.

Constraints: no login, payments, live APIs or database; no browser storage or network calls; fictional data only. Tests are Vitest, real modules, no mocks.

src/App.tsx:
```tsx
import { useState } from 'react';
import { canBook } from './booking';

// Starter for students with no Week 06 project. The availability decision lives INSIDE this
// component on purpose: Task 1 of Practice #07 is to extract it into src/booking.ts as
// canBook({ start, end, now, blocked, bookings }) without changing what the page does.

type Interval = { start: number; end: number };
type Room = { id: string; name: string; blocked: boolean; bookings: Interval[] };

const ROOMS: Room[] = [
  { id: 'a101', name: 'Room A-101', blocked: false, bookings: [{ start: 600, end: 660 }] },
  { id: 'b204', name: 'Room B-204', blocked: false, bookings: [] },
];

const toMinutes = (value: string) => {
  const [h, m] = value.split(':').map(Number);
  return h * 60 + m;
};
const fmt = (m: number) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;

export default function App() {
  const [roomId, setRoomId] = useState('a101');
  const [now, setNow] = useState('09:00');
  const [blocked, setBlocked] = useState(false);
  const [start, setStart] = useState('11:00');
  const [end, setEnd] = useState('12:00');
  const [endOfDay, setEndOfDay] = useState(false);
  const [result, setResult] = useState<boolean | null>(null);
  const [error, setError] = useState('');

  const room = ROOMS.find(r => r.id === roomId)!;

  function check() {
    setResult(null);
    if (!start || !now || (!end && !endOfDay)) {
      setError('Fill in the current time, the start and the end.');
      return;
    }
    const s = toMinutes(start);
    const e = endOfDay ? 1440 : toMinutes(end);
    const n = toMinutes(now);
    if (!(s < e)) {
      setError('The end time must be after the start time.');
    } else {
      setError('');
    }

    const ok = canBook({ start: s, end: e, now: n, blocked, bookings: room.bookings });
    setResult(ok);
  }

  return (
    <main className="page">
      <h1>Smart Campus Room Availability</h1>
      <div className="row">
        <label>Room
          <select value={roomId} onChange={e => setRoomId(e.target.value)}>
            {ROOMS.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
        </label>
        <label>Current time<input type="time" value={now} onChange={e => setNow(e.target.value)} /></label>
        <label>Start<input type="time" value={start} onChange={e => setStart(e.target.value)} /></label>
        <label>End<input type="time" value={end} disabled={endOfDay} onChange={e => setEnd(e.target.value)} /></label>
        <label className="inline"><input type="checkbox" checked={endOfDay} onChange={e => setEndOfDay(e.target.checked)} /> Ends at 24:00</label>
        <label className="inline"><input type="checkbox" checked={blocked} onChange={e => setBlocked(e.target.checked)} /> Room blocked</label>
      </div>
      <button onClick={check}>Check availability</button>
      {error && <p className="error">{error}</p>}
      {result !== null && (
        <p className={`result ${result ? 'available' : 'unavailable'}`}>{result ? 'Available' : 'Unavailable'}</p>
      )}
      <h2>Existing bookings</h2>
      <ul>{room.bookings.length ? room.bookings.map((b, i) => <li key={i}>{fmt(b.start)}–{fmt(b.end)}</li>) : <li>none</li>}</ul>
    </main>
  );
}
```

src/booking.ts:
```ts
// The availability decision, extracted from App.tsx (Practice #07, Task 1).
// The conditions are copied from the page unchanged.

export type Interval = { start: number; end: number };

export type BookingRequest = {
  start: number; // minutes after midnight, e.g. 600 = 10:00
  end: number; // minutes after midnight, 1440 = 24:00
  now: number; // the supplied current time, in minutes
  blocked: boolean; // true when the room is blocked
  bookings: Interval[]; // the room's existing bookings
};

export function canBook({ start, end, now, blocked, bookings }: {
  start: number;
  end: number;
  now: number;
  blocked: boolean;
  bookings: { start: number; end: number }[];
}): boolean {
  if (!(0 <= start && start < end && end <= 1440)) return false;
  if (!(start > now)) return false;
  if (end - start > 120) return false;
  if (blocked) return false;
  for (const b of bookings) {
    if (start < b.end && end > b.start) return false;
  }
  // keep the room's list current with the slot that was just found free
  return true;
}
```

Please answer with: (1) at least three maintainability risks, each with the file/function and the line or code that shows it, and a priority; (2) a numbered plan of small steps, smallest safe step first, each step testable on its own. No code.
````

## 3. Codebase analysis (Task 1)

### 3.1 Maintainability risks

<!-- At least three, found in YOUR starting code. "Where" names a file or a function(),
     e.g. src/App.tsx, check(). Evidence is what you saw, not what the assistant said.
     Priority: High / Medium / Low. -->

| # | Risk | Where (file / function) | Evidence | Priority |
| --- | --- | --- | --- | --- |
| 1 | The page has its own `blocked` checkbox, so "blocked" belongs to the form, not to a room; a blocked room is Available whenever the box is unticked (F3, AC3) | `src/App.tsx`, `const [blocked, setBlocked] = useState(false)` and `canBook({ …, blocked, … })` in `check()` | The `blocked` field of every room in `ROOMS` is never read; I ticked/unticked the box in the browser and the same room changed between Available and Unavailable | High |
| 2 | `check()` shows an error and still computes a result: 12:00–11:00 gives "The end time must be after the start time." **and** "Unavailable" at the same time (AC6) | `src/App.tsx`, `check()`: `if (!(s < e)) { setError(…) } else { setError('') }` has no `return` | Read the code, then checked it in the page (Week 07 U3 screenshot shows the same branch) | High |
| 3 | Room data and its types live inside the page, with no `capacity` or `equipment`, so F1/F2 have nothing to filter and the UI holds data | `src/App.tsx`, `type Interval`, `type Room` and `const ROOMS` at the top of the file | Two rooms hard-coded in `App.tsx`; `Interval` is declared again in `src/booking.ts` | High |
| 4 | Changing the room keeps the old result on screen, so the page can show a result for a room you are no longer looking at (F5) | `src/App.tsx`, `<select onChange={e => setRoomId(…)}>` — only `check()` resets `result` | Checked A-101 11:00–12:00 (Available), switched to B-204: "Available" stayed although nothing was checked for B-204 | Medium |
| 5 | A stale comment invites the bug we removed in Practice #08 | `src/booking.ts`, `canBook()`: `// keep the room's list current with the slot that was just found free` before `return true` | The line it described (`bookings.push`) was deleted for BUG-B; the comment stayed and now says the opposite of AC5 | Medium |
| 6 | The parameter type of `canBook` is written twice | `src/booking.ts`: exported `BookingRequest` and the inline `{ start: number; … bookings: { start: number; end: number }[] }` in `canBook()` | Same five fields in two places; tests import `BookingRequest`, `canBook` does not use it | Low |

### 3.2 Improvement plan — before editing

<!-- Numbered, in the order you will do it, smallest safe step first. Written BEFORE you change
     code: the commit that adds this section comes before the commit that changes app/src. -->

1. Clean-up with no change in behaviour: delete the stale comment in `canBook()` and make it use the exported `BookingRequest` type (risks 5, 6). Run the 23 tests.
2. Create `src/rooms.ts` with `type Room` (id, name, capacity, equipment, blocked, bookings) and 5 fictional rooms; `App.tsx` imports `ROOMS` and loses its own types and data (risk 3). Run the 23 tests, check the page.
3. `checkRoom(rooms, roomId, { start, end, now })` in `src/booking.ts`, test-first: F3, F5, unknown id, AC5, written against a fixed catalog inside the test file (risk 1).
4. `filterRooms(rooms, { attendees, equipment })` in `src/filter.ts`, test-first: F1, B5, B6, then F2 (ALL items), then F4 and INT.
5. Switch the page to the rules: `check()` calls `checkRoom`, the "Room blocked" checkbox goes, `check()` returns after an input error (risks 1, 2).
6. Filter UI: attendees and equipment inputs, only the rooms `filterRooms` returns, a clear empty state, and the result cleared whenever the room, a time or a filter changes (F4, F5, risk 4).
7. Split the page: time helpers into `src/time.ts`, the filter, the room list and the result into components that only render props. Run all tests after each move.
8. Diagrams before/after, five screenshots, final run, quality table.

### 3.3 One AI suggestion I rejected or modified

| Suggestion (as the assistant made it) | Decision | Why — with the AC, F-rule, test or file behind it |
| --- | --- | --- |
| "Create `src/rooms.ts` … Write data tests: ids are unique, there are at least 4 rooms, every booking has start < end within 0–1440, and no room's bookings overlap." (plan step 5) | Rejected | The course rule (README §9) is a fixed catalog inside the test file, not the page's `ROOMS`, so a change to the demo data cannot change a result. Tests must prove F1–F5 and AC1–AC5, which are rules, not the demo data. I told the assistant, and its revised plan (exchange 2) dropped them. |

## 4. Feature extension (Task 2)

### 4.1 What I added

<!-- Short: the catalog (how many rooms, which equipment), how the filter is chosen on the page,
     what the empty state says, what happens to an old result when the room changes. -->

(write here)

### 4.2 Demonstration

<!-- One row per screenshot in evidence/. Say what is on it: the filter values, the rooms shown,
     the room selected, the times entered and the result. -->

| Screenshot | What it shows |
| --- | --- |
| `evidence/filter-match.png` | (write here) |
| `evidence/filter-empty.png` | (write here) |
| `evidence/switch-a.png` | (write here) |
| `evidence/switch-b.png` | (write here) |
| `evidence/narrow.png` | (write here) |

## 5. Refactoring (Task 3)

<!-- The diagrams are diagrams/before.puml and diagrams/after.puml (README section 8). -->

### 5.1 Module responsibilities after

| Module or component | Responsibility |
| --- | --- |
| `src/rooms.ts` | (write here) |
| `src/booking.ts` | (write here) |
| `src/filter.ts` | (write here) |
| (write here) | (write here) |

### 5.2 Design decisions

<!-- At least two. The alternative is what you could have done instead (often what the assistant
     proposed). The why names an AC, an F-rule, a test or a risk from 3.1. -->

| Decision | Alternative I did not take | Why |
| --- | --- | --- |
| (write here) | (write here) | (write here) |
| (write here) | (write here) | (write here) |

### 5.3 Duplication removed

<!-- One row per duplicated location that is gone. Count what you can point at, nothing else. -->

| Before (file / function, what was repeated) | After (where it lives now) |
| --- | --- |
| (write here) | (write here) |

## 6. Automated tests (Task 4)

### 6.1 Test plan

<!-- One row per required ID. A test may carry several IDs in its title,
     e.g. test('T06 B1 AC2: exactly 120 minutes is available', …) covers B1 and AC2. -->

| ID | Test title (as in the file) | Input → expected |
| --- | --- | --- |
| AC1 | (write here) | (write here) |
| AC2 | (write here) | (write here) |
| AC3 | (write here) | (write here) |
| AC4 | (write here) | (write here) |
| AC5 | (write here) | (write here) |
| F1 | (write here) | (write here) |
| F2 | (write here) | (write here) |
| F3 | (write here) | (write here) |
| F4 | (write here) | (write here) |
| F5 | (write here) | (write here) |
| B1 | (write here) | (write here) |
| B2 | (write here) | (write here) |
| B3 | (write here) | (write here) |
| B4 | (write here) | (write here) |
| B5 | (write here) | (write here) |
| B6 | (write here) | (write here) |
| INT | (write here) | (write here) |

### 6.2 Commands

<!-- The commands exactly as you typed them, from app/. -->

```text
(paste here)
```

### 6.3 Final run

<!-- The REAL output of the full run on your final code. Every test passes, and the number of
     tests equals what your test files hold (R2). -->

```text
(paste here)
```

## 7. Quality evaluation (Task 5)

<!-- Original = your baseline commit. Final = what you submit. "How I obtained it" says how you
     measured, so someone else could repeat it: "1.1 and 6.3 runs", "counted in 5.3",
     "git ls-files app/src". Do not invent a metric. Tests: write passed/total, e.g. 19/19. -->

| Measure | Original | Final | How I obtained it |
| --- | --- | --- | --- |
| Automated tests passed / total | (write here) | (write here) | (write here) |
| Duplicated logic locations removed | (write here) | (write here) | (write here) |
| Code structure: modules and their responsibilities | (write here) | (write here) | (write here) |
| Remaining limitation | (write here) | (write here) | (write here) |

## 8. AI evidence appendix

<!-- At least three exchanges, one ### 8.N block each: the analysis (Task 1), the plan, and at
     least one implementation, refactoring or test exchange. Copy the block for more.
     The prompt as you sent it; the output may be cut to the part you used, with "[…]" where
     you cut. Verified by: the test, run, file or check that confirmed it — not "it looked right". -->

### 8.1 Exchange 1

**Tool and model:** (write here)
**Date:** (write here)
**Purpose:** (write here)

**Prompt:**

```text
(paste here)
```

**Output used:**

```text
(paste here)
```

**Problems found:** (write here)
**Changes made:** (write here)
**Verified by:** (write here)

### 8.2 Exchange 2

**Tool and model:** (write here)
**Date:** (write here)
**Purpose:** (write here)

**Prompt:**

```text
(paste here)
```

**Output used:**

```text
(paste here)
```

**Problems found:** (write here)
**Changes made:** (write here)
**Verified by:** (write here)

### 8.3 Exchange 3

**Tool and model:** (write here)
**Date:** (write here)
**Purpose:** (write here)

**Prompt:**

```text
(paste here)
```

**Output used:**

```text
(paste here)
```

**Problems found:** (write here)
**Changes made:** (write here)
**Verified by:** (write here)

## 9. Checker results and known fails

<!-- Every check still FAIL or ERROR in your last run of python tests/check_sis.py, and why.
     The same IDs go in submission.yml known_fails. None left? Write: none. -->

| Check | Why it still fails |
| --- | --- |
| (write here) | (write here) |

## 10. AI reflection (Task 6)

<!-- 200–300 words, your own words, no assistant. Answer all five:
     What context did you provide the AI assistant? Which generated suggestions were useful or
     incorrect? What did you personally verify? How did tests influence your engineering
     decisions? What would you improve next? -->

(write here)
