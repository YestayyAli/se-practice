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
| Baseline commit | 043394b |
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

```text
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
~~~tsx
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
~~~

src/booking.ts:
~~~ts
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
~~~

Please answer with: (1) at least three maintainability risks, each with the file/function and the line or code that shows it, and a priority; (2) a numbered plan of small steps, smallest safe step first, each step testable on its own. No code.
```

(Code fences inside the message are shown as `~~~` so that the block stays one block.)

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

- **Catalog:** `src/rooms.ts` holds 5 fictional rooms — Room A-101 (8 seats, projector + whiteboard, booking 10:00–11:00), Room B-204 (20, projector + whiteboard + video, no bookings), Lab C-310 (30, projector + computers, 11:00–13:00), Studio D-015 (4, whiteboard, 09:00–10:00 and 12:00–12:30) and Hall E-402 (60, projector + microphone + video, **blocked**). Equipment names: projector, whiteboard, video, computers, microphone.
- **Filter on the page:** a number field "Attendees" and one checkbox per equipment item. The list below shows only what `filterRooms(ROOMS, { attendees, equipment })` returns: capacity ≥ attendees (F1) and **all** ticked items (F2). Blocked rooms stay in the list with the label "— blocked" and are never Available (F3, decision in §5.2).
- **Empty state (F4):** "No room matches these requirements. Lower the number of attendees or untick some equipment." in an orange box; the Check button is disabled.
- **Room change (F5):** every change of room, time or filter clears the old result in the same update, so a result is never shown next to a room it was not checked for; the check itself is `checkRoom(ROOMS, room.id, …)`, which uses that room's own `blocked` and `bookings`.
- **Removed:** the page-level "Room blocked" checkbox (blocked now comes from the room) and the page's own start < end check (`canBook` decides; an "Unavailable" result now comes with a one-line explanation of what Unavailable can mean).

### 4.2 Demonstration

<!-- One row per screenshot in evidence/. Say what is on it: the filter values, the rooms shown,
     the room selected, the times entered and the result. -->

| Screenshot | What it shows |
| --- | --- |
| `evidence/filter-match.png` | Attendees 10, projector ticked: the list shows Room B-204 (20 seats), Lab C-310 (30) and Hall E-402 — blocked (60); Room A-101 (8 seats) and Studio D-015 (4 seats, no projector) are gone |
| `evidence/filter-empty.png` | Attendees 70, projector ticked: no room has 70 seats, the empty-state message is shown and the Check button is disabled (F4) |
| `evidence/switch-a.png` | Room A-101 selected, current time 09:00, 10:30–11:30: "Room A-101: Unavailable" — it overlaps A-101's own 10:00–11:00 booking, shown under Bookings of Room A-101 |
| `evidence/switch-b.png` | The same 09:00 and 10:30–11:30, Room B-204 selected and checked again: "Room B-204: Available" (B-204 has no bookings) — a different result from switch-a (F5) |
| `evidence/narrow.png` | 375 × 812 portrait: the filter, the rooms and the times stack in one column, no horizontal scroll (scrollWidth 375 = width); Hall E-402 checked → "Unavailable" with the explanation (F3, AC6) |

## 5. Refactoring (Task 3)

<!-- The diagrams are diagrams/before.puml and diagrams/after.puml (README section 8). -->

### 5.1 Module responsibilities after

| Module or component | Responsibility |
| --- | --- |
| `src/rooms.ts` | Data only: `type Room`, `ROOMS` (5 fictional rooms), `EQUIPMENT` (the checkbox names) |
| `src/booking.ts` | Booking rules: `canBook` (AC1–AC5, body unchanged since Practice #08) and `checkRoom` (finds the room by id and calls `canBook` with its own `blocked` and `bookings`; unknown id → false) |
| `src/filter.ts` | `filterRooms`: capacity ≥ attendees (F1) and every selected item in the room's equipment (F2); returns a new array, changes nothing |
| `src/App.tsx` | Page state (filter, selected room, times, result, error) and wiring: calls `filterRooms` and `checkRoom`, clears the result on every change; no room data, no rule |
| `src/components/RoomFilter.tsx` | Renders the attendees field and the equipment checkboxes, reports changes |
| `src/components/RoomList.tsx` | Renders the rooms it is given as radio choices with seats and equipment, or the empty state (F4) |
| `src/components/ResultPanel.tsx` | Renders the error, the Available/Unavailable result and the chosen room's bookings |
| `src/time.ts` | `toMinutes` ("HH:MM" → minutes) and `formatTime` (minutes → "HH:MM") for the page |

### 5.2 Design decisions

<!-- At least two. The alternative is what you could have done instead (often what the assistant
     proposed). The why names an AC, an F-rule, a test or a risk from 3.1. -->

| Decision | Alternative I did not take | Why |
| --- | --- | --- |
| Blocked rooms stay in the filtered list, labelled "— blocked", and are reported Unavailable | Hide blocked rooms inside `filterRooms` | F1/F2 are about capacity and equipment; hiding blocked rooms would mix F3 into the filter. Keeping them visible shows the user why a large room is not offered, and F3 is enforced in one place, `checkRoom` → `canBook`, proven by the F3 and INT tests |
| `checkRoom(rooms, roomId, request)` looks the room up and passes its own `blocked` and `bookings` to the unchanged `canBook` | Let the page pass `room.bookings` and a `blocked` flag to `canBook` itself (as the baseline did) | Risk 1: the page's own `blocked` checkbox let a blocked room be Available. With `checkRoom` the page cannot pass another room's data; F5 test: the same 10:00–11:00 gives true in the free room and false in the busy one |
| The result is cleared inside every change handler (`changed(set)`), not in a `useEffect` | Clear it in a `useEffect` after each render (my first version, step 5–6) | The browser check found that the `useEffect` version showed "Room B-204: Unavailable" — the old A-101 result with the new room's name — for one render after switching. Clearing in the same update removed it (rechecked in the page, see §8.3) |

### 5.3 Duplication removed

<!-- One row per duplicated location that is gone. Count what you can point at, nothing else. -->

| Before (file / function, what was repeated) | After (where it lives now) |
| --- | --- |
| `src/App.tsx` (top) declared `type Interval` and `type Room` again, although `src/booking.ts` already exports `Interval` | One `Room` type in `src/rooms.ts` (built on `Interval` from `src/booking.ts`), imported by the filter, booking and the components |
| `src/booking.ts`, `canBook()`: the five request fields written twice — the exported `BookingRequest` and an inline parameter type | `canBook({ … }: BookingRequest)` — one type |
| "Blocked" kept twice: the `blocked` field of each room in `App.tsx` and the page's `blocked` checkbox state, and only the checkbox was used | Only `Room.blocked` in `src/rooms.ts`, read by `checkRoom()` |
| `src/App.tsx`, `check()`: `if (!(s < e))` repeated the start < end rule that `canBook()` already enforces (AC1) | Only in `canBook()`; the page shows the result and a one-line explanation |

## 6. Automated tests (Task 4)

### 6.1 Test plan

<!-- One row per required ID. A test may carry several IDs in its title,
     e.g. test('T06 B1 AC2: exactly 120 minutes is available', …) covers B1 and AC2. -->

| ID | Test title (as in the file) | Input → expected |
| --- | --- | --- |
| AC1 | `T02 AC1: 540–570 starts exactly at now, so it is not after now` | canBook 540–570, now 540 → false |
| AC2 | `T07 B2 AC2: 720–841 is 121 minutes and is rejected` | canBook 720–841 → false |
| AC3 | `T13 AC3: 660–720 would be available, but the room is blocked` | canBook 660–720, blocked → false |
| AC4 | `T09 B4 AC4: 630–690 partly overlaps 600–660` | canBook 630–690 with booking 600–660 → false |
| AC5 | `AC5: checking three rooms does not change the rooms or their bookings` | checkRoom on free, busy, shut → catalog equal to its clone; free still true |
| F1 | `F1: 10 attendees leave only the rooms with 10 or more seats (medium, large)` | filterRooms attendees 10 → ['medium', 'large'] |
| F2 | `F2: projector + whiteboard leaves only medium; large has a projector but no whiteboard` | filterRooms projector + whiteboard → ['medium'] |
| F3 | `F3 AC3: 10:00–11:00 in the blocked room is never available, even with no bookings` | checkRoom 'shut' 600–660, now 540 → false |
| F4 | `F4: 100 attendees match no room, so the list is empty` | filterRooms attendees 100 → length 0 → true |
| F5 | `F5: the same 10:00–11:00 is available in the free room and not in the busy room (its own 10:00–11:00 booking)` | checkRoom 'free' → true, 'busy' → false |
| B1 | `T06 B1 AC2: 720–840 is exactly 120 minutes and is allowed` | canBook 720–840 → true |
| B2 | `T07 B2 AC2: 720–841 is 121 minutes and is rejected` | canBook 720–841 → false |
| B3 | `T01 B3 AC4: 660–720 touches the end of the 600–660 booking` | canBook 660–720 with booking 600–660 → true |
| B4 | `T09 B4 AC4: 630–690 partly overlaps 600–660` | canBook 630–690 with booking 600–660 → false |
| B5 | `B5 F1: capacity exactly equal to attendees (10 seats, 10 people) is included` | filterRooms attendees 10 → includes 'medium' → true |
| B6 | `B6 F1: capacity one below attendees (10 seats, 11 people) is excluded` | filterRooms attendees 11 → includes 'medium' → false |
| INT | `INT F2 F3: filterRooms for 8 people with video returns free and shut; checkRoom on them gives true, then false` | filterRooms 8 + video → ['free','shut']; checkRoom free → true, shut → false |

### 6.2 Commands

<!-- The commands exactly as you typed them, from app/. -->

```text
cd sis-04/app
npm install
npx tsc --noEmit -p .
npx vitest run
```

### 6.3 Final run

<!-- The REAL output of the full run on your final code. Every test passes, and the number of
     tests equals what your test files hold (R2). -->

```text
RUN  v3.2.7 /tmp/claude-0/-home-claude/1eda5b01-3edc-5079-b003-face1eadcafe/scratchpad/sisrepo/sis-04/app
 ✓ src/booking.test.ts (28 tests) 8ms
 ✓ src/filter.test.ts (5 tests) 3ms
 Test Files  2 passed (2)
      Tests  33 passed (33)
   Start at  00:02:04
   Duration  538ms (transform 63ms, setup 0ms, collect 83ms, tests 11ms, environment 0ms, prepare 142ms)
```

## 7. Quality evaluation (Task 5)

<!-- Original = your baseline commit. Final = what you submit. "How I obtained it" says how you
     measured, so someone else could repeat it: "1.1 and 6.3 runs", "counted in 5.3",
     "git ls-files app/src". Do not invent a metric. Tests: write passed/total, e.g. 19/19. -->

| Measure | Original | Final | How I obtained it |
| --- | --- | --- | --- |
| Automated tests passed / total | 23/23 | 33/33 | The `Tests` line of the baseline run (§1.1) and of the final run (§6.3), both `npx vitest run` in `app/` |
| Duplicated logic locations removed | 0 (4 duplicated locations present) | 4 removed | Counted from the rows of §5.3, each visible in the diff between the baseline commit and the final commit |
| Code structure: modules and their responsibilities | 3 source modules: `App.tsx` (data + form + a rule + rendering), `booking.ts`, `main.tsx` | 9 source modules: `rooms.ts`, `booking.ts`, `filter.ts`, `time.ts`, `App.tsx`, 3 components, `main.tsx` | `git ls-files app/src` at the baseline commit and at the final commit, read against §5.1 (test files and CSS not counted) |
| Remaining limitation | No automated test of the page | Still no rendered UI test: the one-render stale result on room switching (§5.2) was found only by a browser check, and F4/F5 on the screen are proven by screenshots, not by Vitest | From the browser check in §8.3 and the test files: no `@testing-library/react` test exists |

## 8. AI evidence appendix

<!-- At least three exchanges, one ### 8.N block each: the analysis (Task 1), the plan, and at
     least one implementation, refactoring or test exchange. Copy the block for more.
     The prompt as you sent it; the output may be cut to the part you used, with "[…]" where
     you cut. Verified by: the test, run, file or check that confirmed it — not "it looked right". -->

### 8.1 Exchange 1

**Tool and model:** Claude (Anthropic), Claude app — one fresh chat for exchanges 1–3, model claude-opus-5-5
**Date:** 12 November 2026
**Purpose:** Task 1 — codebase analysis: maintainability risks with file/function references (the context message of §2.2)

**Prompt:**

```text
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
~~~tsx
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
~~~

src/booking.ts:
~~~ts
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
~~~

Please answer with: (1) at least three maintainability risks, each with the file/function and the line or code that shows it, and a priority; (2) a numbered plan of small steps, smallest safe step first, each step testable on its own. No code.
```

**Output used:**

```text
## Maintainability risks

Line numbers count from the first line of each file as you pasted it.

| # | Where | Evidence | Why it matters | Priority |
|---|---|---|---|---|
| R1 | `App.tsx` → `check()`, lines 43–50 | `if (!(s < e)) { setError(...) } else { setError('') }` has no `return`, so `canBook(...)` and `setResult(ok)` still run afterwards | The page shows an error and "Unavailable" at the same time, which goes against AC6 (clear feedback). The page and `canBook` (line 22) also each check start < end, so the two checks can drift apart. | High |
| R2 | `App.tsx` → `blocked` state (line 25), the checkbox (line 66) and the call on line 49 | `canBook({ ..., blocked, ... })` uses the checkbox value. The `blocked` field on `Room` (line 9) is never read. | Once the catalog has blocked rooms, a blocked room can still be reported as Available whenever the box is unticked. That breaks F3 and AC3. | High |
| R3 | `App.tsx` → `ROOMS.find(r => r.id === roomId)!`, line 32 | The `!` assumes the selected room always exists | With F1/F2, filtering can hide the selected room. `room` then becomes `undefined` and `room.bookings` (lines 49 and 74) crashes the page. | High |
| R4 | `App.tsx` → `result` state (line 29) and the `select` `onChange` (line 58) | `result` is only reset inside `check()` | If you change the room or a time, the old Available/Unavailable stays on screen for a room you are no longer looking at. That breaks F5. | Medium–High |
| R5 | `App.tsx`, lines 8–14 | The page has its own `Interval`/`Room` types and the hard-coded `ROOMS` | This copies `Interval` from `booking.ts` (line 5) and breaks your fixed layout, where `App` holds no room data. There are also no `capacity`/`equipment` fields, so F1/F2 have nothing to filter on. | High (blocks the feature) |
| R6 | `booking.ts` → `canBook`, line 29 | Comment: `// keep the room's list current with the slot that was just found free` | It reads like an invitation to add `bookings.push(...)`, which would break AC5 (no change to booking data). The comment describes something the code does not and must not do. | Medium |
| R7 | `booking.ts` → `canBook` parameter type, lines 15–21, compared with `BookingRequest` (lines 7–13) | The same shape is written twice: once as an exported type and once inline | If you change one, the other silently goes stale. `checkRoom` will need a shared type anyway. | Low–Medium |
| R8 | `booking.ts`, lines 22 and 24, and `App.tsx`, line 41 | The numbers `1440` and `120` appear in several places with no name | The AC2 limit and the end-of-day value can drift between the UI and the rule. | Low |
| R9 | `App.tsx` → `toMinutes` / `fmt`, lines 16–20 | Pure helpers sit inside the component file and have no tests | Empty or odd input produces `NaN`. It happens to give `false` today, but nothing tests that. | Low |

[…]

5. **Create `src/rooms.ts` (R5).** Add `type Room` with id, name, capacity, equipment, blocked and bookings, and at least four fictional rooms. Keep A-101 and B-204 with their current bookings, and make at least one room blocked. Write data tests: ids are unique, there are at least 4 rooms, every booking has start < end within 0–1440, and no room's bookings overlap.

[…]
```

**Problems found:** R3 ("filtering can hide the selected room … crashes the page") was a prediction, not something in the baseline: the baseline has no filter. R8/R9 (magic numbers, untested helpers) are real but low value for this task. Step 5 asked for data tests on the demo `ROOMS`, against the course rule (§3.3). The "start > now" note invites changing AC1.
**Changes made:** I kept R1, R2, R4, R5, R6, R7 as my risks 2, 1, 4, 3, 5, 6 after confirming each in the code and in the page; dropped R8/R9; rejected the ROOMS data tests and the start = now change (exchange 2).
**Verified by:** A browser run of the baseline page (Playwright, port 5174): A-101 11:00–12:00 → Available; switching to B-204 without checking still showed "Available" (risk 4); B-204 with "Room blocked" ticked → Unavailable, unticked → Available (risk 1); 12:00–11:00 → the error **and** "Unavailable" (risk 2). Risks 3, 5, 6 checked by reading `src/App.tsx` and `src/booking.ts`.

### 8.2 Exchange 2

**Tool and model:** Claude (Anthropic), Claude app — one fresh chat for exchanges 1–3, model claude-opus-5-5
**Date:** 12 November 2026
**Purpose:** The plan: correct the first plan and get the final numbered plan with test IDs

**Prompt:**

```text
Thanks. Three corrections before I commit the plan:
1. My course requires the tests to use a fixed catalog inside the test file, not the page's ROOMS, so a change to the demo data cannot change a result. So no data tests on ROOMS in step 5.
2. start > now stays exactly as it is: my T02 test (540–570 with now = 540 → false) and AC1 "after the current time" from Week 07 decide it.
3. I want every new rule test-first: write the test, see it fail, add the code, run all tests.
Please give me the final plan as at most 8 numbered steps, smallest safe step first, each with the test IDs it adds (my IDs: F1–F5, B5 = capacity exactly equal to attendees is included, B6 = capacity one below is excluded, INT = filterRooms then checkRoom on what it returned). Still no code.
```

**Output used:**

```text
## Final plan (8 steps)

Every new test uses a **fixed catalog written inside its own test file**, never the page's `ROOMS`. For every new rule the order is: write the test, run it and see it fail, write the code, then run all tests.

1. **Baseline and clean-up, with no change in behaviour.**
   - Run the 23 tests and record that they pass.
   - Delete the misleading "keep the room's list current" comment in `canBook`.
   - Make `canBook` use the exported `BookingRequest`/`Interval` types instead of its inline type.
   - **Adds:** no tests. The existing 23 must stay green.

2. **Move the room data into `src/rooms.ts`.**
   - Add `type Room` with id, name, capacity, equipment, blocked and bookings, and at least four fictional rooms. Keep A-101 and B-204 with their current bookings.
   - Make `App` import `ROOMS` and delete its local types and data.
   - **Adds:** no tests, because the demo data is not tested. Check: type-check, the 23 tests, and the page behaves as it did in step 1.

3. **`checkRoom` in `booking.ts`, test-first.**
   - Write the tests in `booking.test.ts` against a fixed catalog with one free room, one room with a booking and one blocked room. They fail because `checkRoom` doesn't exist yet.
   - Then add `checkRoom`. It finds the room, takes `blocked` and `bookings` from it and calls the unchanged `canBook`.
   - **Adds:** **F3** (a blocked room is Unavailable even for a free slot) and **F5** (the same slot gives different results for two rooms, so the chosen room's bookings are used).

4. **Capacity filter in `src/filter.ts`, test-first.**
   - Write the tests in `filter.test.ts` with a fixed catalog. They fail, then you add the capacity part of `filterRooms`.
   - **Adds:** **F1** (only rooms with enough capacity are returned), **B5** (capacity exactly equal to attendees is included) and **B6** (capacity one below is excluded).

[…]
```

**Problems found:** Its step 6 says INT and F4 "may pass straight away" and suggests changing an expected value on purpose to see red — fine as a check, but it would leave no failing run to record for them. It puts `checkRoom` before the filter; I kept that order.
**Changes made:** Used its 8 steps as the base of my §3.2, added step 7 (split the page into components and `src/time.ts`), which it had only as optional in exchange 1.
**Verified by:** The plan was committed as `sis-04: analysis and plan` before the first commit that changes `app/src` (`git log`: analysis and plan → step 1 → step 2 …).

### 8.3 Exchange 3

**Tool and model:** Claude (Anthropic), Claude app — one fresh chat for exchanges 1–3, model claude-opus-5-5
**Date:** 12 November 2026
**Purpose:** Implementation and tests: `filterRooms`, `checkRoom` and their tests, test-first

**Prompt:**

```text
Steps 1 and 2 are done and the 23 tests are green. Now step 3 and step 4, test-first.

Please give me ONLY:
(a) a Vitest test file src/filter.test.ts for filterRooms(rooms, { attendees, equipment }) from src/filter.ts, with a fixed catalog inside the file, one test per case, the IDs in the titles: F1, F2, F4, B5 (capacity exactly equal to attendees is included), B6 (capacity one below is excluded);
(b) the tests for checkRoom(rooms, roomId, { start, end, now }) to add to src/booking.test.ts, with their own fixed catalog: F3 (a blocked room is never available), F5 (same times, two rooms, different results because each uses its own bookings), an unknown id is not available, and AC5 (the rooms are not changed); and one INT test: filterRooms, then checkRoom on a room it returned;
(c) then the smallest implementation of filterRooms and of checkRoom (checkRoom must call the unchanged canBook with the chosen room's blocked and bookings).

Rules: import from vitest and the real modules, no mocks, no .skip/.only/.each, toBe(true)/toBe(false), expected values from F1–F5 and AC1–AC5, not from the code. Do not touch canBook or App.tsx.

src/rooms.ts:
~~~ts
// Room catalog: data only. Fictional rooms; times are minutes after midnight (600 = 10:00).
import type { Interval } from './booking';

export type Room = {
  id: string;
  name: string;
  capacity: number;
  equipment: string[];
  blocked: boolean;
  bookings: Interval[];
};

export const EQUIPMENT: string[] = ['projector', 'whiteboard', 'video', 'computers', 'microphone'];

export const ROOMS: Room[] = [
  { id: 'a101', name: 'Room A-101', capacity: 8, equipment: ['projector', 'whiteboard'], blocked: false, bookings: [{ start: 600, end: 660 }] },
  { id: 'b204', name: 'Room B-204', capacity: 20, equipment: ['projector', 'whiteboard', 'video'], blocked: false, bookings: [] },
  { id: 'c310', name: 'Lab C-310', capacity: 30, equipment: ['projector', 'computers'], blocked: false, bookings: [{ start: 660, end: 780 }] },
  { id: 'd015', name: 'Studio D-015', capacity: 4, equipment: ['whiteboard'], blocked: false, bookings: [{ start: 540, end: 600 }, { start: 720, end: 750 }] },
  { id: 'e402', name: 'Hall E-402', capacity: 60, equipment: ['projector', 'microphone', 'video'], blocked: true, bookings: [] },
];
~~~

src/booking.ts:
~~~ts
// Booking rules: canBook (AC1–AC5, unchanged since Practice #07/#08) and checkRoom (F3, F5).

export type Interval = { start: number; end: number };

export type BookingRequest = {
  start: number; // minutes after midnight, e.g. 600 = 10:00
  end: number; // minutes after midnight, 1440 = 24:00
  now: number; // the supplied current time, in minutes
  blocked: boolean; // true when the room is blocked
  bookings: Interval[]; // the room's existing bookings
};

export function canBook({ start, end, now, blocked, bookings }: BookingRequest): boolean {
  if (!(0 <= start && start < end && end <= 1440)) return false;
  if (!(start > now)) return false;
  if (end - start > 120) return false;
  if (blocked) return false;
  for (const b of bookings) {
    if (start < b.end && end > b.start) return false;
  }
  return true;
}
~~~
```

**Output used:**

```text
## (c) Smallest implementations

**New file `src/filter.ts`:**

~~~ts
// Room filter: F1 (capacity) and F2 (all selected equipment). Pure, does not change its input.
import type { Room } from './rooms';

export type RoomFilter = { attendees: number; equipment: string[] };

export function filterRooms(rooms: Room[], { attendees, equipment }: RoomFilter): Room[] {
  return rooms.filter(
    r => r.capacity >= attendees && equipment.every(item => r.equipment.includes(item)),
  );
}
~~~

**Add to `src/booking.ts` below `canBook`, which stays unchanged:**

~~~ts
import type { Room } from './rooms';

export function checkRoom(
  rooms: Room[],
  roomId: string,
  { start, end, now }: { start: number; end: number; now: number },
): boolean {
  const room = rooms.find(r => r.id === roomId);
  if (!room) return false;
  return canBook({ start, end, now, blocked: room.blocked, bookings: room.bookings });
}
~~~

[…]

## Two decisions these tests fix in place

- **Blocked rooms still appear in the filtered list** and are reported Unavailable (see INT and F3). `filterRooms` only applies F1 and F2. If you'd rather hide blocked rooms, change the INT expectation before you change the code, and record that decision in your report.
- **Selecting no equipment matches every room.** F1, F4, B5 and B6 all rely on this. It follows from "must contain ALL selected items": with nothing selected, every room has all of them.
```

**Problems found:** Its test titles were only the IDs and a rule ("F1: only rooms with capacity >= attendees are returned"), without the input; it used `it` while my file uses `test`. Nothing in the logic was wrong: I checked each expected value against F1–F5 by hand (e.g. 10 attendees → medium (10) and large (30), because F1 is ≥).
**Changes made:** Took `filterRooms` and `checkRoom` as given; rewrote the test titles to carry the input and the IDs (`B5 F1: capacity exactly equal to attendees (10 seats, 10 people) is included`), used `test`, added B1–B4 to my existing Week 07 titles (T06, T07, T01, T09), added the INT test only after `filter.ts` existed.
**Verified by:** Red, then green: with only the tests, `npx vitest run` gave `TypeError: checkRoom is not a function` (4 failed) and `Cannot find module './filter'`; after the code, 27/27 and then 33/33. A deliberate mutation of `filterRooms` (`every` → `some`) failed F1, F2 and B5, and `>=` → `>` failed F1 and B5, so the tests catch the classic mistakes; code restored, 33/33 again.

## 9. Checker results and known fails

<!-- Every check still FAIL or ERROR in your last run of python tests/check_sis.py, and why.
     The same IDs go in submission.yml known_fails. None left? Write: none. -->

| Check | Why it still fails |
| --- | --- |
| none | |

## 10. AI reflection (Task 6)

<!-- 200–300 words, your own words, no assistant. Answer all five:
     What context did you provide the AI assistant? Which generated suggestions were useful or
     incorrect? What did you personally verify? How did tests influence your engineering
     decisions? What would you improve next? -->

I provided the AI with a file map, the existing rules (AC1–AC6), feature requirements (F1–F5), key restrictions (no login, payments, databases or internet requests), and the full `App.tsx` and `booking.ts` files. For example, by comparing rule F3 with the `App.tsx` code, the AI identified that the "Room blocked" checkbox violated the rule because unchecking it made a blocked room appear available. I asked the AI to identify risks and create a step-by-step plan, not write code, to avoid unnecessary changes to the existing implementation.

Some of the helpful suggestions included the `filterRooms` and `checkRoom` code. I verified them with tests and incorporated them almost as-is. Regarding unnecessary advice, the AI suggested tests for the demo data in `ROOMS`, but according to the course rules, the tests check the rules on a fixed catalog within the test file. Therefore, I rejected this advice.

I verified every risk identified by the AI in the browser and in the code. I selected A-101 and clicked "check," then switched to B-204, and the previous "Available" result remained visible, even though no check had been performed for B-204. I also intentionally modified the filter, changing "every" to "some" and ">=" to ">", which caused tests F1, F2 and B5 to fail, confirming that they enforce the requirements, and then restored the code.

I wrote the tests first, they failed (red), then the code passed the test (green). So I knew that the new code was solving the right rule, and not something else.

I would add "@testing-library/react" so that F4 and F5 are checked automatically, since the tests only checked the functions, and no one checks the page automatically. The bug with the old result was found only in the browser.
