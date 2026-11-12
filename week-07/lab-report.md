# Week 07 — Lab report

**Name:** Yestay Ali
**Group:** Monday 16:00–19:00 practice group
**Date:** 6 November 2026

Fill in every section. **Do not delete, rename or renumber the headings.** The checker and the
grader find your answers by them. You can add rows to any table, but never remove its header.

---

## 1. Setup

| | |
| --- | --- |
| Project I continue (`week-06` = my Week 06 Bolt project, `starter` = the provided starter) | starter |
| Bolt project link (or `not shared`, and why) | not shared — I have no Week 06 Bolt project, so I used the provided `starter/` |
| Assistant that generated the tests (tool) | Claude (Anthropic), in the Claude app |
| Exact model (with its version, or `not displayed`) | claude-opus-5-5 |
| Where I ran the tests (Bolt terminal / my computer / Codespace) | Claude's cloud workspace (Linux, Node 22), the same commands as on a laptop |
| Vitest version (the `RUN  v…` line of a run) | 3.2.7 |
| Test command | `npx vitest run` (also `npm test`) inside `app/` |

---

## 2. Task 1 — baseline and the booking function

**Before editing:** where did the booking decision live in the project you started from?

| | |
| --- | --- |
| File and function (or "inside the page component") | inside the page component: `check()` in `src/App.tsx` |
| Its inputs | `s`, `e`, `n` (start, end, now in minutes, converted from the time inputs), the `blocked` checkbox state and `room.bookings` |
| What it returned | nothing: it set a local `ok` boolean and called `setResult(ok)` |
| How the page used it | `result` true shows "Available", false shows "Unavailable"; the validation message is set separately |

**What I changed to extract `canBook`.** Say which file it now lives in, what you moved, and why
the behaviour did not change. Also say which file of the page now calls it. 40 words or more.

<!-- Write below this line -->
The decision now lives in `app/src/booking.ts` as `export function canBook({ start, end, now, blocked, bookings })`. I moved the five conditions from `check()` in `App.tsx` in the same order and with the same operators (range check, `start > now`, `end - start > 120`, blocked, and `start < b.end && end > b.start` for every booking). The only change is that each rejection is now an early `return false` instead of `ok = false` in an if/else chain, which gives the same result. `App.tsx` now imports it with `import { canBook } from './booking'` and calls it with the converted minutes; the HH:MM conversion and the validation messages stay in the page. I checked in the browser that 11:00–12:00 is still Available and 10:30–11:30 is still Unavailable, and `tsc` and `vite build` still pass.

---

## 3. Task 2 — the test plan

Default fixture: `now = 540`, `blocked = false`, `bookings = [{ start: 600, end: 660 }]`, fresh
for every test. **The Expected column comes from AC1–AC4, never from the code.** Write the
**reason** for each expected result **before** you send the generation prompt.

| ID | Candidate / changed input | Expected | AC | Reason (in your words) |
| --- | --- | --- | --- | --- |
| T01 | 660–720 (touching after) | true | AC4 | The booking ends at 660 and the request starts at 660, so they only share an endpoint; AC4 allows touching |
| T02 | 540–570 (starts now) | false | AC1 | Start 540 equals now 540; AC1 needs start strictly after the current time |
| T03 | 720–720 (zero duration) | false | AC1 | Start equals end, so `start < end` is false and the interval is empty |
| T04 | 750–720 (reversed) | false | AC1 | End is before start, so `start < end` fails |
| T05 | 1380–1441 (past day end) | false | AC1 | End 1441 is after 1440 (24:00), outside the day |
| T06 | 720–840 (120 minutes) | true | AC2 | 840 − 720 = 120, and AC2 rejects only bookings longer than 120 |
| T07 | 720–841 (121 minutes) | false | AC2 | 121 minutes is longer than 120 |
| T08 | 570–600 (touching before) | true | AC4 | The request ends at 600 exactly when the booking starts; touching is allowed |
| T09 | 630–690 (partial overlap) | false | AC4 | Minutes 630–660 are inside both intervals |
| T10 | 570–690 (contains booking) | false | AC4 | The whole booking 600–660 lies inside the request |
| T11 | 615–645 (inside booking) | false | AC4 | The whole request lies inside the booking |
| T12 | 600–660 (identical interval) | false | AC4 | Same interval as the booking, so all 60 minutes overlap |
| T13 | 660–720, blocked = true | false | AC3 | Without the block this is T01 (Available); only the block makes it Unavailable |
| T14 | 630–690, bookings = [] | true | AC4 | Same times as T09, but there is nothing to overlap with, and AC1/AC2 hold |
| AC5 | an Available request — the bookings after the call equal the bookings before | true, data unchanged | AC5 | Checking must not add the request to the list or change the existing booking |
| X1 | 1320–1440 (ends exactly at 24:00) | true | AC1 | `end ≤ 1440` includes 1440, and 120 minutes is still allowed by AC2 |
| X2 | 660–720 with bookings 600–660 and 720–780 | true | AC4 | It touches one booking at each end but overlaps neither, so the loop must check both and allow it |

X1 and X2 are **your own two cases**: a boundary or a state that T01–T14 do not reach. Fill all
five columns.

---

## 4. Task 3 — the generation prompt and the first suite

**The prompt exactly as I sent it.** Use the deck's prompt with `[our test framework]` replaced by
`Vitest`, followed by the case table from section 3:

````text
Generate tests for the existing booking function using Vitest. Use AC1–AC6 and the reviewed case table below.

Import the real function used by the page. Keep its code unchanged. Use fixed time and fresh fixtures. Assert exact decisions and unchanged booking data.

Return the test file, run command, and AC mapping. Flag unclear requirements. We will run the tests ourselves.

AC1: Accept a candidate interval only when 0 ≤ start < end ≤ 1440 and start is after the supplied current time.
AC2: Reject a booking longer than 120 minutes.
AC3: Reject the request when the selected room is blocked.
AC4: Reject any interval that overlaps an existing booking; touching endpoints are allowed.
AC5: Show a clear Available / Unavailable decision without changing the existing booking data.
AC6: The page remains usable at desktop and narrow/mobile width and gives understandable validation feedback.

Case table (default fixture: now = 540, blocked = false, bookings = [{ start: 600, end: 660 }], fresh for every test):

| ID | Candidate / changed input | Expected | AC |
| --- | --- | --- | --- |
| T01 | 660–720 (touching after) | true | AC4 |
| T02 | 540–570 (starts now) | false | AC1 |
| T03 | 720–720 (zero duration) | false | AC1 |
| T04 | 750–720 (reversed) | false | AC1 |
| T05 | 1380–1441 (past day end) | false | AC1 |
| T06 | 720–840 (120 minutes) | true | AC2 |
| T07 | 720–841 (121 minutes) | false | AC2 |
| T08 | 570–600 (touching before) | true | AC4 |
| T09 | 630–690 (partial overlap) | false | AC4 |
| T10 | 570–690 (contains booking) | false | AC4 |
| T11 | 615–645 (inside booking) | false | AC4 |
| T12 | 600–660 (identical interval) | false | AC4 |
| T13 | 660–720, blocked = true | false | AC3 |
| T14 | 630–690, bookings = [] | true | AC4 |
| AC5 | an Available request — the bookings after the call equal the bookings before | true, data unchanged | AC5 |
| X1 | 1320–1440 (ends exactly at 24:00, 120 minutes) | true | AC1 |
| X2 | 660–720 with bookings = [{ start: 600, end: 660 }, { start: 720, end: 780 }] (touches two bookings) | true | AC4 |

The function, in src/booking.ts (the page imports it with `import { canBook } from './booking'`):

```ts
export type Interval = { start: number; end: number };

export type BookingRequest = {
  start: number; // minutes after midnight, e.g. 600 = 10:00
  end: number; // minutes after midnight, 1440 = 24:00
  now: number; // the supplied current time, in minutes
  blocked: boolean; // true when the room is blocked
  bookings: Interval[]; // the room's existing bookings
};

// Returns true (Available) or false (Unavailable). It never changes `bookings`.
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
```
````

**The assistant's answer: run command, AC mapping and any unclear requirements it flagged,
pasted unedited.** Its test file goes to `suites/first/` and is not pasted here:

````text
## Test file: `src/booking.test.ts`

[the test file is saved unedited in suites/first/booking.test.ts]

## Run command

```bash
npm install -D vitest     # skip if Vitest is already installed
npx vitest run src/booking.test.ts
```

The tests need Node 17 or later for `structuredClone`. The default `node` test environment is enough, so no DOM setup is needed.

## AC mapping

| AC | Covered by | Notes |
| --- | --- | --- |
| AC1 | T02, T03, T04, T05, X1 | Covers start = now, zero length, reversed, end 1441, and end exactly 1440 |
| AC2 | T06, T07 | 120 minutes is accepted, 121 is rejected |
| AC3 | T13 | A valid, touching interval is rejected only because the room is blocked |
| AC4 | T01, T08–T12, T14, X2 | Overlap, containment, inside, identical, touching on one side and both sides, no bookings |
| AC5 | Both AC5 tests, plus the no-change check in every table case | Covers the decision and unchanged data. The on-screen Available/Unavailable text is page-level and not tested here |
| AC6 | **Not covered** | This is a UI requirement. Unit tests of `canBook` can't check it (see below) |

Every case asserts the exact result with `toBe(true/false)`. Every case also checks that the request object, the bookings array and each booking object are unchanged, by reference and by deep equality. `canBook`'s code is untouched, and the tests import it from `./booking`, the same module the page uses.

## Unclear requirements

1. **AC6 can't be tested at this level.** Layout at desktop and mobile widths, and "understandable validation feedback", need component or end-to-end tests (for example Playwright at about 1280px and 375px). Also, `canBook` returns only a boolean, so it can't say *why* a request was rejected (past end of day, too long, blocked, or overlap). If the feedback should name the reason, the function or a wrapper needs to return reason codes. AC6 should say whether that is required.
2. **AC5 "show a clear decision"** is partly a UI requirement. These tests cover the decision and the unchanged data, not the wording or how it is displayed.
3. **AC1 "after the current time"** is read as strictly after (T02 rejects start = now). Please confirm. It's also not stated whether only `start` must be after `now`, or the whole interval.
4. **The `0 ≤ start` check is never tested on its own.** With now = 540, any negative start already fails the `start > now` check. To test that lower bound, you'd need a case like now = −10 with 0–30 accepted and −5–30 rejected, or the requirement should state that `now` is always ≥ 0.
5. **Inputs that aren't whole minutes or aren't valid numbers** (decimals, `NaN`, `Infinity`) aren't specified. Right now `NaN` gets rejected only because comparisons with it are false.
6. **The range of `now`** isn't defined: values below 0 or above 1440, or a `now` from another day.
7. **Data quality of existing bookings** isn't specified: malformed entries (start ≥ end), bookings that overlap each other, or unsorted lists.
8. **"Blocked"** is assumed to block the whole room for the whole day. If a block can cover only part of the day, AC3 and the data model need to change.
9. **Small gaps in the table you might add:** start one minute after now (541–600 → true), and a 120-minute booking that also overlaps (to confirm the overlap check still applies when the length is allowed).
````

The first suite was saved to `suites/first/` **before** I changed anything in it: yes

---

## 5. Task 4 — review of the first suite

Review it **before** you run it. Look at the imports, the expected values, isolation, duplicates
and skipped tests. Make one row per decision. At least **two** rows, and each one names the kind of
weakness (the deck's table: *no exception occurred* · *expected = current output* · *only valid
requests* · *mocked booking function*, or your own) and the AC that decides it.

| # | Test or part of the suite | What is weak or wrong | Decision: accept / revise / reject | AC or reason |
| --- | --- | --- | --- | --- |
| 1 | `it.each(cases)` for T01–T14, X1, X2 | Table-driven: the expected value comes from a variable (`toBe(c.expected)`), so a test cannot be read on its own and the course rules forbid `it.each` (own weakness: hidden expectations) | revise | AC1–AC4: one named test per case, each with a literal `.toBe(true)` / `.toBe(false)` |
| 2 | Imports and expected values | Imports the real `./booking`, no `vi.mock`, `now = 540`, and every expected value matches my section 3 table (no *expected = current output*, no *mocked booking function*) | accept | AC1–AC4 checked row by row against section 3 |
| 3 | `the returned decision is always a boolean` and `fixture sanity` tests | They never check a booking rule; a wrong `canBook` that returns any boolean still passes (*no exception occurred* kind of weakness) | reject | No AC; `.toBe(true/false)` already proves the type |
| 4 | Second AC5 test (630–690, Unavailable) | Uses the same input as T09; the AC5 rule asks for an **Available** request | revise | AC5: kept one AC5 test on Available 660–720, the Unavailable one is kept as an extra check |
| 5 | Missing boundaries | Only touching cases at 600/660; nothing one minute inside the booking, and nothing that overlaps the **second** booking (*only valid requests* for multi-booking) | revise | AC4: added X3 (570–601), X4 (659–720), X5 (750–800 over the second booking) |

---

## 6. Task 5 — running, diagnosing, improving

### 6.1 The first run

The **real** terminal output of the first run of the first suite, pasted unedited. Include the
`RUN  v…` line and the `Tests` summary line. A build message or the assistant saying "tests pass"
is not a run.

```text
 RUN  v3.2.7 /tmp/claude-0/-home-claude/1eda5b01-3edc-5079-b003-face1eadcafe/scratchpad/repo/week-07/app

 ✓ src/booking.test.ts (20 tests) 9ms

 Test Files  1 passed (1)
      Tests  20 passed (20)
   Start at  20:56:28
   Duration  290ms (transform 53ms, setup 0ms, collect 50ms, tests 9ms, environment 0ms, prepare 80ms)
```

**Each failure, diagnosed** (the deck's table: import/runner error · assertion mismatch · result
changing per run · no tests discovered). Write `none` in the first row if nothing failed.

| Failing test | Observed failure | First check | Test repair or implementation fix? | Action taken |
| --- | --- | --- | --- | --- |
| none | nothing failed: 20 passed (20) | I checked that the 20 tests import the real `./booking` and that their expected values match section 3 | neither — no implementation fix was needed | Kept `booking.ts` unchanged; improved the suite for the review findings in section 5 |

### 6.2 The improvement prompt

The deck's improvement prompt exactly as sent, followed by the actual output from 6.1. Then
paste the assistant's answer, unedited:

````text
Review this test suite against AC1–AC6 and our case table. Identify incorrect expectations, weak assertions, duplicated cases, and missing boundaries.

For each proposed change, explain the requirement and the defect it could detect. Improve the tests without changing correct expectations to match buggy behavior.

Use the actual failure output below. Separate test repairs from implementation fixes.

```
 RUN  v3.2.7 /tmp/claude-0/-home-claude/1eda5b01-3edc-5079-b003-face1eadcafe/scratchpad/repo/week-07/app

 ✓ src/booking.test.ts (20 tests) 9ms

 Test Files  1 passed (1)
      Tests  20 passed (20)
   Start at  20:56:28
   Duration  290ms (transform 53ms, setup 0ms, collect 50ms, tests 9ms, environment 0ms, prepare 80ms)
```

Our course checker also requires: one test per case with the ID in its title (no test.each / it.each), .toBe(true)/.toBe(false) for every T test, no vi.mock / .skip / .only, now as a number (no Date.now()).
````

**The assistant's answer, unedited:**

````text
## Review of the suite

This reviews the suite from my previous answer, which is what produced your output: 16 table cases, 3 AC5 tests and 1 fixture check, 20 tests in total.

**About the output:** it shows no failures. All 20 tests passed, so it gives no evidence of an implementation bug, and I'm proposing **no implementation fixes**. A full pass doesn't show that the suite is strong, though. The findings below are about defects it would miss and the course checker rules it breaks.

### Incorrect expectations
None. I checked every expected value against AC1–AC4 and the table, and all are correct. None of them were adjusted to fit the code.

### Course checker violations (test repairs)

| # | Problem | Rule | Change |
| --- | --- | --- | --- |
| R1 | All cases run through `it.each(cases)` | One test per case, ID in the title, no `it.each` | Write one `it('T01 …')` per case |
| R2 | `expect(result).toBe(c.expected)` | Every T test uses a literal `.toBe(true)` or `.toBe(false)` | Write the literal in each test. A checker that scans the source can't see a value that comes from a table |

`vi.mock`, `.skip`, `.only` and `Date.now()` are already absent, and `now` is the number `540`.

### Weak or duplicated assertions (test repairs)

| # | Problem | Requirement | Why change it |
| --- | --- | --- | --- |
| W1 | The "Unavailable leaves data unchanged" AC5 test uses the same input as T09 | AC5 | It's a duplicate. Every table case already checks that the request object, the bookings array and each booking are unchanged, both by reference and by `toStrictEqual`. **Removed.** |
| W2 | The `typeof … === 'boolean'` test | AC5 | `toBe(true)` and `toBe(false)` already require a boolean, so this test can never catch something the others miss. **Removed.** |
| W3 | The AC5 row checked only deep equality | AC5 | It now uses the shared helper, so it also catches an implementation that replaces the array with an equal copy or rebuilds the booking objects. |

Every case is isolated, meaning it breaks exactly one rule (for example, T13 is a valid touching interval that fails only because the room is blocked). So I found no case that could pass for the wrong reason.

### Missing boundaries (new cases X3–X10, to be added to the reviewed table)

| ID | Input | Expected | AC | Defect it detects |
| --- | --- | --- | --- | --- |
| X3 | 541–600 | true | AC1 | The cutoff is off by one in the strict direction (for example `start > now + 1`). T02 only catches the lenient direction (`>=`). |
| X4 | 720–721 | true | AC1/AC2 | A minimum length was added that no requirement asks for (for example `end - start > 1`). T03 only checks zero length. |
| X5 | 570–601 | false | AC4 | A one-minute overlap at the booking's start is treated as touching (for example `end > b.start + 1`). |
| X6 | 659–720 | false | AC4 | The same mistake at the booking's end (for example `start < b.end - 1`). |
| X7 | 750–800, bookings = [600–660, 720–780] | false | AC4 | **Only the first booking is checked** (`bookings[0]`, or a `return` inside the loop). X2 is an Available case, so it can't catch this. |
| X8 | 630–690, bookings = [720–780, 600–660] | false | AC4 | The code assumes bookings are sorted, for example it stops early with `if (b.start >= end) break`. |
| X9 | 0–60, now = −1 | true | AC1 | The lower bound is wrong in the strict direction (for example `0 < start`). |
| X10 | −1–60, now = −1 | false | AC1 | The `0 ≤ start` check is missing. With now = 540 a negative start can never reach this check, so no other case covers it. |

X9 and X10 only make sense if a negative `now` is a valid input (see unclear items below).

## Revised test file: `src/booking.test.ts`

```ts
import { describe, it, expect } from 'vitest';
// Same module and export the page uses: `import { canBook } from './booking'`
import { canBook, type BookingRequest, type Interval } from './booking';

// Fixed "current time" as a plain number. canBook never reads a clock.
const NOW = 540; // 09:00

function defaultBookings(): Interval[] {
  return [{ start: 600, end: 660 }];
}

type Overrides = Partial<Omit<BookingRequest, 'start' | 'end'>>;

/** Fresh fixture on every call: new request object, new bookings array, new booking objects. */
function makeRequest(start: number, end: number, overrides: Overrides = {}): BookingRequest {
  return {
    start,
    end,
    now: NOW,
    blocked: false,
    bookings: defaultBookings(),
    ...overrides,
  };
}

/**
 * Calls the real canBook and checks (AC5) that the request is unchanged:
 * same bookings array, same booking objects in the same order,
 * and deep-equal to a snapshot taken before the call.
 */
function decide(req: BookingRequest): boolean {
  const snapshot = structuredClone(req);
  const bookingsRef = req.bookings;
  const itemRefs = [...req.bookings];

  const result = canBook(req);

  expect(req.bookings).toBe(bookingsRef);
  expect(req.bookings).toHaveLength(itemRefs.length);
  req.bookings.forEach((b, i) => expect(b).toBe(itemRefs[i]));
  expect(req).toStrictEqual(snapshot);

  return result;
}

describe('canBook — reviewed case table', () => {
  it('T01 [AC4] 660–720 touching after an existing booking → Available', () => {
    expect(decide(makeRequest(660, 720))).toBe(true);
  });

  it('T02 [AC1] 540–570 starts exactly at now → Unavailable', () => {
    expect(decide(makeRequest(540, 570))).toBe(false);
  });

  it('T03 [AC1] 720–720 zero duration → Unavailable', () => {
    expect(decide(makeRequest(720, 720))).toBe(false);
  });

  it('T04 [AC1] 750–720 reversed interval → Unavailable', () => {
    expect(decide(makeRequest(750, 720))).toBe(false);
  });

  it('T05 [AC1] 1380–1441 ends past day end → Unavailable', () => {
    expect(decide(makeRequest(1380, 1441))).toBe(false);
  });

  it('T06 [AC2] 720–840 exactly 120 minutes → Available', () => {
    expect(decide(makeRequest(720, 840))).toBe(true);
  });

  it('T07 [AC2] 720–841 121 minutes → Unavailable', () => {
    expect(decide(makeRequest(720, 841))).toBe(false);
  });

  it('T08 [AC4] 570–600 touching before an existing booking → Available', () => {
    expect(decide(makeRequest(570, 600))).toBe(true);
  });

  it('T09 [AC4] 630–690 partial overlap → Unavailable', () => {
    expect(decide(makeRequest(630, 690))).toBe(false);
  });

  it('T10 [AC4] 570–690 contains an existing booking → Unavailable', () => {
    expect(decide(makeRequest(570, 690))).toBe(false);
  });

  it('T11 [AC4] 615–645 inside an existing booking → Unavailable', () => {
    expect(decide(makeRequest(615, 645))).toBe(false);
  });

  it('T12 [AC4] 600–660 identical to an existing booking → Unavailable', () => {
    expect(decide(makeRequest(600, 660))).toBe(false);
  });

  it('T13 [AC3] 660–720 otherwise valid, room blocked → Unavailable', () => {
    expect(decide(makeRequest(660, 720, { blocked: true }))).toBe(false);
  });

  it('T14 [AC4] 630–690 with no existing bookings → Available', () => {
    expect(decide(makeRequest(630, 690, { bookings: [] }))).toBe(true);
  });

  it('AC5 [AC5] Available request (660–720) leaves the bookings exactly as before', () => {
    const req = makeRequest(660, 720);
    expect(decide(req)).toBe(true);
    expect(req.bookings).toStrictEqual([{ start: 600, end: 660 }]);
  });

  it('X1 [AC1] 1320–1440 ends exactly at 24:00, 120 minutes → Available', () => {
    expect(decide(makeRequest(1320, 1440))).toBe(true);
  });

  it('X2 [AC4] 660–720 touches two bookings, one on each side → Available', () => {
    const bookings = [{ start: 600, end: 660 }, { start: 720, end: 780 }];
    expect(decide(makeRequest(660, 720, { bookings }))).toBe(true);
  });
});

describe('canBook — added boundaries (pending table review)', () => {
  it('X3 [AC1] 541–600 starts one minute after now → Available', () => {
    expect(decide(makeRequest(541, 600))).toBe(true);
  });

  it('X4 [AC1/AC2] 720–721 one-minute booking → Available', () => {
    expect(decide(makeRequest(720, 721))).toBe(true);
  });

  it('X5 [AC4] 570–601 overlaps the booking start by one minute → Unavailable', () => {
    expect(decide(makeRequest(570, 601))).toBe(false);
  });

  it('X6 [AC4] 659–720 overlaps the booking end by one minute → Unavailable', () => {
    expect(decide(makeRequest(659, 720))).toBe(false);
  });

  it('X7 [AC4] 750–800 overlaps only the second booking → Unavailable', () => {
    const bookings = [{ start: 600, end: 660 }, { start: 720, end: 780 }];
    expect(decide(makeRequest(750, 800, { bookings }))).toBe(false);
  });

  it('X8 [AC4] 630–690 overlaps a booking listed second in unsorted bookings → Unavailable', () => {
    const bookings = [{ start: 720, end: 780 }, { start: 600, end: 660 }];
    expect(decide(makeRequest(630, 690, { bookings }))).toBe(false);
  });

  it('X9 [AC1] 0–60 with now = -1, start at lower bound 0 → Available', () => {
    expect(decide(makeRequest(0, 60, { now: -1 }))).toBe(true);
  });

  it('X10 [AC1] -1–60 with now = -1, start below 0 → Unavailable', () => {
    expect(decide(makeRequest(-1, 60, { now: -1 }))).toBe(false);
  });
});

describe('fixture sanity', () => {
  it('each makeRequest call builds new bookings (fresh fixtures)', () => {
    const a = makeRequest(660, 720);
    const b = makeRequest(660, 720);
    expect(a.bookings).not.toBe(b.bookings);
    expect(a.bookings[0]).not.toBe(b.bookings[0]);
  });
});
```

Run it with `npx vitest run src/booking.test.ts`. It should report 26 tests.

## Test repairs vs implementation fixes

**Test repairs (all in the file above):**
- R1, R2: one explicit test per case, each with a literal `.toBe(true)` or `.toBe(false)`.
- W1, W2: removed the duplicate Unavailable test and the `typeof` test.
- W3: the AC5 row now uses the full no-change helper.
- Added the boundary cases X3–X10.

**Implementation fixes: none.**
- Your run had no failures.
- Going through `canBook` by hand, I expect X3–X10 to pass as well. I haven't run them; you'll do that.
- If any of them fails on your machine, treat it as a bug in `canBook` and fix the code. Don't change the expectation, since each one follows directly from AC1 or AC4.

## Still unclear
1. **Negative `now` (X9, X10):** these cases assume a negative `now` is a valid input. If the team decides `now` is always ≥ 0, drop them, and then the `0 ≤ start` check can't be reached through `canBook` at all.
2. **X3–X10 aren't in the reviewed table yet.** The table should be updated so that the checker and the table match.
3. **AC6** (layout at desktop and mobile widths, validation feedback) and the on-screen part of AC5 are still untested. They need component or end-to-end tests. "Understandable feedback" also needs a rejection reason, and `canBook` only returns a boolean.
4. **"After the current time" is read as strictly after** (T02, X3). Please confirm. Inputs that aren't whole minutes or valid numbers (`NaN`, decimals) are still unspecified.
````

**What I took from it:** I accepted R1/R2 (one test per case, literal `.toBe`), W1/W2 (drop the duplicate and the `typeof` test), and its X5, X6, X7 as my X3, X4, X5. I rejected X9/X10 (negative `now` is not a valid input on the page and no AC defines it) and did not add X3/X4/X8 to keep the suite focused. No implementation fix was proposed or made.

### 6.3 The final run

The **real** output of the final suite (`booking.test.*` beside your module), after every
change and after restoring the correct code from section 7. Every test must pass. If a real defect
is still open, leave its test failing and explain it in 9.1.

```text
 RUN  v3.2.7 /tmp/claude-0/-home-claude/1eda5b01-3edc-5079-b003-face1eadcafe/scratchpad/repo/week-07/app
 ✓ src/booking.test.ts (21 tests) 6ms
 Test Files  1 passed (1)
      Tests  21 passed (21)
   Start at  20:58:15
   Duration  268ms (transform 66ms, setup 0ms, collect 55ms, tests 6ms, environment 0ms, prepare 58ms)
```

---

## 7. Task 6 — deliberate defects

You need a reviewed, passing suite first. Then introduce **one** defect at a time in your booking
module, leave the tests unchanged, run, record, and **restore** the code. A syntax or import
error does not count as detection.

| Trial | Intentional change | Detected / Survived | Failing test ID(s) | If it survived: why, and what you added |
| --- | --- | --- | --- | --- |
| M1 | Reject duration >= 120 instead of > 120 | Detected | T06, X1 | — |
| M2 | Treat touching endpoints as an overlap | Detected | T01, T08, X2, AC5 | — |
| M3 | Remove the blocked-room rejection | Detected | T13 | — |

**The run of each mutant, pasted unedited.** Paste the `Tests` summary line and the failing test
names at least:

```text
--- M1: duration >= 120 rejected ---
⎯⎯⎯⎯⎯⎯⎯ Failed Tests 2 ⎯⎯⎯⎯⎯⎯⎯
 FAIL  src/booking.test.ts > canBook — AC1: valid interval after the current time > X1 AC1: 1320–1440 ends exactly at 24:00 and lasts 120 minutes
 FAIL  src/booking.test.ts > canBook — AC2: at most 120 minutes > T06 AC2: 720–840 is exactly 120 minutes and is allowed
      Tests  2 failed | 19 passed (21)
--- M2: touching endpoints as overlap ---
⎯⎯⎯⎯⎯⎯⎯ Failed Tests 4 ⎯⎯⎯⎯⎯⎯⎯
 FAIL  src/booking.test.ts > canBook — AC4: overlaps rejected, touching allowed > T01 AC4: 660–720 touches the end of the 600–660 booking
 FAIL  src/booking.test.ts > canBook — AC4: overlaps rejected, touching allowed > T08 AC4: 570–600 touches the start of the 600–660 booking
 FAIL  src/booking.test.ts > canBook — AC4: overlaps rejected, touching allowed > X2 AC4: 660–720 touches two bookings, 600–660 before and 720–780 after
 FAIL  src/booking.test.ts > canBook — AC5: the decision does not change the bookings > AC5: an Available request (660–720) leaves the bookings exactly as before
      Tests  4 failed | 17 passed (21)
--- M3: blocked-room rejection removed ---
⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯
 FAIL  src/booking.test.ts > canBook — AC3: blocked room > T13 AC3: 660–720 would be available, but the room is blocked
      Tests  1 failed | 20 passed (21)
```

All three changes reverted, and the full suite run again (section 6.3): yes

---

## 8. Task 7 — manual UI checks

Use `now = 09:00` and an existing `10:00–11:00` booking. Do them in the page in a browser. Save a
screenshot of each as `evidence/ui-1.png` … `evidence/ui-5.png`. Take **ui-4 at phone width**
(about 375 px, portrait).

| # | Action | Expected observation | AC | What I observed | Pass / Fail / Not testable |
| --- | --- | --- | --- | --- | --- |
| U1 | Check 11:00–12:00, unblocked | Available, with the fixed sample booking | AC5 | "Available" in green; Existing bookings still shows 10:00–11:00 | Pass |
| U2 | Enable blocked, then check again | Unavailable replaces the earlier result | AC3, AC5 | "Unavailable" replaced "Available"; only one result is shown | Pass |
| U3 | Clear a required input and submit | Understandable validation feedback | AC6 | Start cleared: "Fill in the current time, the start and the end." and no Available/Unavailable result | Pass |
| U4 | Use a narrow (phone) width | Controls and result remain usable | AC6 | At 375 × 812 the inputs stack in one column, no horizontal scroll, button and "Available" visible | Pass |
| U5 | Repeat the checks on the same data | Existing bookings remain unchanged | AC5 | Four checks in a row (11–12, 10:30–11:30, 11–12, 09:30–10:00); the list stayed 10:00–11:00 every time | Pass |

---

## 9. Comparison and what still fails

### 9.1 Checks I am keeping as FAIL or ERROR

Use the same IDs as `known_fails` in `submission.yml`. Write `none` if the run is clean.

| Check | Why it stays |
| --- | --- |
| none | |

### 9.2 Original and improved suites

| Measure | First suite | Improved suite |
| --- | --- | --- |
| Executed / passed / failed | 20 / 20 / 0 | 21 / 21 / 0 |
| Requirements with meaningful tests (AC IDs and gaps) | AC1–AC5 covered, but T01–T14 hidden in one `it.each` with `toBe(c.expected)`; two tests check no AC; AC6 not covered | AC1–AC5, one named test per case with a literal expected value; AC6 only by the manual UI checks |
| Selected mutants detected | 3 of 3 (M1 2 failed, M2 4 failed, M3 1 failed) | 3 of 3 (M1: T06, X1; M2: T01, T08, X2, AC5; M3: T13) |
| Accepted / revised / rejected tests | — (as generated) | 1 accepted (imports and expectations), 3 revised (it.each split, AC5, added X3–X5), 1 rejected (typeof and fixture-sanity tests) |
| Remaining limitations | No test above 1440 for start, no second booking overlap, no AC6 | Still no AC6 in unit tests, no check of invalid existing bookings, no negative `now` |

### 9.3 What no AC decides

Call your function with `bookings = [{ start: 700, end: 650 }]` (a reversed existing booking)
and a request of 660–720. What does it return? Does any AC say what it should return? (This is
the value you declare in `submission.yml` under `assumptions.invalid_existing_booking`.)

- It returns `true` (Available). The overlap test is `start < b.end && end > b.start`, and `660 < 650` is false, so the reversed booking is treated as "no overlap". No AC says what to do with an invalid existing booking: AC1 only talks about the candidate interval. I think `false` would be safer, because a broken booking should not let a room be double-booked, but I did not change the code because no AC asks for it.

---

## 10. Conclusion (120–180 words)

<!-- Answer all three in your own words, without the assistant:
     (a) Which mistake in the FIRST suite would have let a wrong canBook pass, and how did you find it?
     (b) What does your final green run prove, and what does it NOT prove? Use a mutant or a UI check.
     (c) One testing limitation that remains.
     Worthless: "The AI tests were good and they all passed."
     Worth everything: "The first suite expected T06 (exactly 120 minutes) to be rejected. That
     contradicts AC2, and it failed on a correct canBook. If I had changed the code to make it
     pass, M1 would have become the real behaviour." -->

<!-- Write your conclusion below this line -->
The first suite had correct expected values, but it put T01–T14 into one `it.each` with `toBe(c.expected)`. If the table row for T06 had said false, the test would still look fine and would push me to change correct code; I found this by reading the suite before running it. It also never checked the second booking in the list, so a `canBook` that only looked at `bookings[0]` would pass; I added X5 (750–800) for that. My final green run shows that the 21 cases behave as AC1–AC5 say, and the mutants prove the suite reacts: M1 failed T06 and X1, M2 failed T01, T08, X2 and AC5, and M3 failed T13. It does not prove that the page is usable: the green run never sees the screen, so AC6 was only checked by hand in U3 and U4. One limitation remains: no AC decides what happens with a reversed existing booking, and my function returns true for it.
