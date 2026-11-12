# Week 08 — Lab report

**Name:** Yestay Ali
**Group:** Monday 16:00–19:00 practice group
**Date:** 6 November 2026

Fill in every section. **Do not delete, rename or renumber the headings.** The checker and the
grader find your answers by them. You can add rows to any table, but never remove its header.

---

## 1. Setup

| | |
| --- | --- |
| Assistant I debugged with (tool) | Claude (Anthropic), Claude app — two fresh chats |
| Exact model (with its version, or `not displayed`) | claude-opus-5-5 |
| Where the skill was installed (ChatGPT / Claude web / Claude Code / prompt-only simulation) | prompt-only simulation |
| Where I ran the tests (Bolt terminal / my computer / Codespace) | Claude's cloud workspace (Linux, Node 22), a clone of my se-practice repository |
| Vitest version (the `RUN  v…` line of a run) | 3.2.7 |
| Language of my booking module (`ts` or `js`) — the file I copied from `buggy/` | ts — `buggy/booking.ts` |

---

## 2. Task 1 — baseline, buggy code, failing tests

### 2.1 My Week 07 suite on my own code

The **real** output of your Week 07 suite, run in `week-08/app/` **before** you replace
anything. It should be green. If it is not, say why under the block.

```text
 RUN  v3.2.7 /home/claude/se-practice/week-08/app
 ✓ src/booking.test.ts (21 tests) 5ms
 Test Files  1 passed (1)
      Tests  21 passed (21)
   Start at  21:13:28
   Duration  262ms (transform 58ms, setup 0ms, collect 42ms, tests 5ms, environment 0ms, prepare 68ms)
```

### 2.2 The same suite on the provided canBook

You copied the whole `canBook` function from `buggy/booking.ts` (or `.js`) over yours and changed
nothing else. This is the real output:

```text
 RUN  v3.2.7 /home/claude/se-practice/week-08/app
 ❯ src/booking.test.ts (21 tests | 4 failed) 14ms
   ✓ canBook — AC1: valid interval after the current time > T02 AC1: 540–570 starts exactly at now, so it is not after now 1ms
   ✓ canBook — AC1: valid interval after the current time > T03 AC1: 720–720 has zero duration, so start < end fails 0ms
   ✓ canBook — AC1: valid interval after the current time > T04 AC1: 750–720 is reversed, so start < end fails 0ms
   ✓ canBook — AC1: valid interval after the current time > T05 AC1: 1380–1441 ends after 24:00 (1440) 0ms
   ✓ canBook — AC1: valid interval after the current time > X1 AC1: 1320–1440 ends exactly at 24:00 and lasts 120 minutes 0ms
   ✓ canBook — AC2: at most 120 minutes > T06 AC2: 720–840 is exactly 120 minutes and is allowed 0ms
   ✓ canBook — AC2: at most 120 minutes > T07 AC2: 720–841 is 121 minutes and is rejected 0ms
   ✓ canBook — AC3: blocked room > T13 AC3: 660–720 would be available, but the room is blocked 0ms
   × canBook — AC4: overlaps rejected, touching allowed > T01 AC4: 660–720 touches the end of the 600–660 booking 7ms
     → expected false to be true // Object.is equality
   × canBook — AC4: overlaps rejected, touching allowed > T08 AC4: 570–600 touches the start of the 600–660 booking 1ms
     → expected false to be true // Object.is equality
   ✓ canBook — AC4: overlaps rejected, touching allowed > T09 AC4: 630–690 partly overlaps 600–660 0ms
   ✓ canBook — AC4: overlaps rejected, touching allowed > T10 AC4: 570–690 contains the whole 600–660 booking 0ms
   ✓ canBook — AC4: overlaps rejected, touching allowed > T11 AC4: 615–645 lies inside the 600–660 booking 0ms
   ✓ canBook — AC4: overlaps rejected, touching allowed > T12 AC4: 600–660 is identical to the existing booking 0ms
   ✓ canBook — AC4: overlaps rejected, touching allowed > T14 AC4: 630–690 with no bookings has nothing to overlap 0ms
   × canBook — AC4: overlaps rejected, touching allowed > X2 AC4: 660–720 touches two bookings, 600–660 before and 720–780 after 1ms
     → expected false to be true // Object.is equality
   ✓ canBook — AC4: overlaps rejected, touching allowed > X3 AC4: 570–601 overlaps the start of the 600–660 booking by one minute 0ms
   ✓ canBook — AC4: overlaps rejected, touching allowed > X4 AC4: 659–720 overlaps the end of the 600–660 booking by one minute 0ms
   ✓ canBook — AC4: overlaps rejected, touching allowed > X5 AC4: 750–800 overlaps only the second booking (720–780) 0ms
   × canBook — AC5: the decision does not change the bookings > AC5: an Available request (660–720) leaves the bookings exactly as before 1ms
     → expected false to be true // Object.is equality
   ✓ canBook — AC5: the decision does not change the bookings > AC5: an Unavailable request (630–690) also leaves the bookings exactly as before 0ms
⎯⎯⎯⎯⎯⎯⎯ Failed Tests 4 ⎯⎯⎯⎯⎯⎯⎯
 FAIL  src/booking.test.ts > canBook — AC4: overlaps rejected, touching allowed > T01 AC4: 660–720 touches the end of the 600–660 booking
AssertionError: expected false to be true // Object.is equality
- Expected
+ Received
- true
+ false
 ❯ src/booking.test.ts:60:40
     58| describe('canBook — AC4: overlaps rejected, touching allowed', () => {
     59|   test('T01 AC4: 660–720 touches the end of the 600–660 booking', () =…
     60|     expect(canBook(request(660, 720))).toBe(true);
       |                                        ^
     61|   });
     62| 
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/4]⎯
 FAIL  src/booking.test.ts > canBook — AC4: overlaps rejected, touching allowed > T08 AC4: 570–600 touches the start of the 600–660 booking
AssertionError: expected false to be true // Object.is equality
- Expected
+ Received
- true
+ false
 ❯ src/booking.test.ts:64:40
     62| 
     63|   test('T08 AC4: 570–600 touches the start of the 600–660 booking', ()…
     64|     expect(canBook(request(570, 600))).toBe(true);
       |                                        ^
     65|   });
     66| 
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/4]⎯
 FAIL  src/booking.test.ts > canBook — AC4: overlaps rejected, touching allowed > X2 AC4: 660–720 touches two bookings, 600–660 before and 720–780 after
AssertionError: expected false to be true // Object.is equality
- Expected
+ Received
- true
+ false
 ❯ src/booking.test.ts:92:54
     90|       { start: 720, end: 780 },
     91|     ];
     92|     expect(canBook(request(660, 720, { bookings }))).toBe(true);
       |                                                      ^
     93|   });
     94| 
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/4]⎯
 FAIL  src/booking.test.ts > canBook — AC5: the decision does not change the bookings > AC5: an Available request (660–720) leaves the bookings exactly as before
AssertionError: expected false to be true // Object.is equality
- Expected
+ Received
- true
+ false
 ❯ src/booking.test.ts:120:20
    118|     const result = canBook(req);
    119| 
    120|     expect(result).toBe(true);
       |                    ^
    121|     expect(req.bookings).toEqual(before);
    122|     expect(JSON.stringify(req.bookings)).toBe(JSON.stringify([{ start:…
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/4]⎯
 Test Files  1 failed (1)
      Tests  4 failed | 17 passed (21)
   Start at  21:13:36
   Duration  279ms (transform 43ms, setup 0ms, collect 41ms, tests 14ms, environment 0ms, prepare 75ms)
```

### 2.3 One failing test per bug

Add the two regression tests from README Part 1, step 5: one named `BUG-A` and one named `BUG-B`.
Run them **on the buggy code**. Both must fail here. That is the evidence that each test can see
its bug.

```text
 RUN  v3.2.7 /home/claude/se-practice/week-08/app
 ❯ src/booking.test.ts (23 tests | 6 failed) 16ms
   ✓ canBook — AC1: valid interval after the current time > T02 AC1: 540–570 starts exactly at now, so it is not after now 1ms
   ✓ canBook — AC1: valid interval after the current time > T03 AC1: 720–720 has zero duration, so start < end fails 0ms
   ✓ canBook — AC1: valid interval after the current time > T04 AC1: 750–720 is reversed, so start < end fails 0ms
   ✓ canBook — AC1: valid interval after the current time > T05 AC1: 1380–1441 ends after 24:00 (1440) 0ms
   ✓ canBook — AC1: valid interval after the current time > X1 AC1: 1320–1440 ends exactly at 24:00 and lasts 120 minutes 0ms
   ✓ canBook — AC2: at most 120 minutes > T06 AC2: 720–840 is exactly 120 minutes and is allowed 0ms
   ✓ canBook — AC2: at most 120 minutes > T07 AC2: 720–841 is 121 minutes and is rejected 0ms
   ✓ canBook — AC3: blocked room > T13 AC3: 660–720 would be available, but the room is blocked 0ms
   × canBook — AC4: overlaps rejected, touching allowed > T01 AC4: 660–720 touches the end of the 600–660 booking 6ms
     → expected false to be true // Object.is equality
   × canBook — AC4: overlaps rejected, touching allowed > T08 AC4: 570–600 touches the start of the 600–660 booking 1ms
     → expected false to be true // Object.is equality
   ✓ canBook — AC4: overlaps rejected, touching allowed > T09 AC4: 630–690 partly overlaps 600–660 0ms
   ✓ canBook — AC4: overlaps rejected, touching allowed > T10 AC4: 570–690 contains the whole 600–660 booking 0ms
   ✓ canBook — AC4: overlaps rejected, touching allowed > T11 AC4: 615–645 lies inside the 600–660 booking 0ms
   ✓ canBook — AC4: overlaps rejected, touching allowed > T12 AC4: 600–660 is identical to the existing booking 0ms
   ✓ canBook — AC4: overlaps rejected, touching allowed > T14 AC4: 630–690 with no bookings has nothing to overlap 0ms
   × canBook — AC4: overlaps rejected, touching allowed > X2 AC4: 660–720 touches two bookings, 600–660 before and 720–780 after 1ms
     → expected false to be true // Object.is equality
   ✓ canBook — AC4: overlaps rejected, touching allowed > X3 AC4: 570–601 overlaps the start of the 600–660 booking by one minute 0ms
   ✓ canBook — AC4: overlaps rejected, touching allowed > X4 AC4: 659–720 overlaps the end of the 600–660 booking by one minute 0ms
   ✓ canBook — AC4: overlaps rejected, touching allowed > X5 AC4: 750–800 overlaps only the second booking (720–780) 0ms
   × canBook — AC5: the decision does not change the bookings > AC5: an Available request (660–720) leaves the bookings exactly as before 1ms
     → expected false to be true // Object.is equality
   ✓ canBook — AC5: the decision does not change the bookings > AC5: an Unavailable request (630–690) also leaves the bookings exactly as before 0ms
   × Week 08 regression tests > BUG-A AC4: 570–600 touches 480–570 before and 600–660 after, so it is Available 1ms
     → expected false to be true // Object.is equality
   × Week 08 regression tests > BUG-B AC5: 720–780 touches nothing, is Available, and the bookings stay unchanged 2ms
     → expected [ { start: 600, end: 660 }, …(1) ] to deeply equal [ { start: 600, end: 660 } ]
⎯⎯⎯⎯⎯⎯⎯ Failed Tests 6 ⎯⎯⎯⎯⎯⎯⎯
 FAIL  src/booking.test.ts > canBook — AC4: overlaps rejected, touching allowed > T01 AC4: 660–720 touches the end of the 600–660 booking
AssertionError: expected false to be true // Object.is equality
- Expected
+ Received
- true
+ false
 ❯ src/booking.test.ts:60:40
     58| describe('canBook — AC4: overlaps rejected, touching allowed', () => {
     59|   test('T01 AC4: 660–720 touches the end of the 600–660 booking', () =…
     60|     expect(canBook(request(660, 720))).toBe(true);
       |                                        ^
     61|   });
     62| 
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/6]⎯
 FAIL  src/booking.test.ts > canBook — AC4: overlaps rejected, touching allowed > T08 AC4: 570–600 touches the start of the 600–660 booking
AssertionError: expected false to be true // Object.is equality
- Expected
+ Received
- true
+ false
 ❯ src/booking.test.ts:64:40
     62| 
     63|   test('T08 AC4: 570–600 touches the start of the 600–660 booking', ()…
     64|     expect(canBook(request(570, 600))).toBe(true);
       |                                        ^
     65|   });
     66| 
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/6]⎯
 FAIL  src/booking.test.ts > canBook — AC4: overlaps rejected, touching allowed > X2 AC4: 660–720 touches two bookings, 600–660 before and 720–780 after
AssertionError: expected false to be true // Object.is equality
- Expected
+ Received
- true
+ false
 ❯ src/booking.test.ts:92:54
     90|       { start: 720, end: 780 },
     91|     ];
     92|     expect(canBook(request(660, 720, { bookings }))).toBe(true);
       |                                                      ^
     93|   });
     94| 
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/6]⎯
 FAIL  src/booking.test.ts > canBook — AC5: the decision does not change the bookings > AC5: an Available request (660–720) leaves the bookings exactly as before
AssertionError: expected false to be true // Object.is equality
- Expected
+ Received
- true
+ false
 ❯ src/booking.test.ts:120:20
    118|     const result = canBook(req);
    119| 
    120|     expect(result).toBe(true);
       |                    ^
    121|     expect(req.bookings).toEqual(before);
    122|     expect(JSON.stringify(req.bookings)).toBe(JSON.stringify([{ start:…
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/6]⎯
 FAIL  src/booking.test.ts > Week 08 regression tests > BUG-A AC4: 570–600 touches 480–570 before and 600–660 after, so it is Available
AssertionError: expected false to be true // Object.is equality
- Expected
+ Received
- true
+ false
 ❯ src/booking.test.ts:140:54
    138|       { start: 600, end: 660 },
    139|     ];
    140|     expect(canBook(request(570, 600, { bookings }))).toBe(true);
       |                                                      ^
    141|   });
    142| 
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[5/6]⎯
 FAIL  src/booking.test.ts > Week 08 regression tests > BUG-B AC5: 720–780 touches nothing, is Available, and the bookings stay unchanged
AssertionError: expected [ { start: 600, end: 660 }, …(1) ] to deeply equal [ { start: 600, end: 660 } ]
- Expected
+ Received
  [
    {
      "end": 660,
      "start": 600,
    },
+   {
+     "end": 780,
+     "start": 720,
+   },
  ]
 ❯ src/booking.test.ts:148:26
    146| 
    147|     expect(canBook(req)).toBe(true);
    148|     expect(req.bookings).toEqual(before);
       |                          ^
    149|   });
    150| });
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[6/6]⎯
 Test Files  1 failed (1)
      Tests  6 failed | 17 passed (23)
   Start at  21:13:44
   Duration  275ms (transform 56ms, setup 0ms, collect 51ms, tests 16ms, environment 0ms, prepare 56ms)
```

---

## 3. Defect log

One row per defect. At least **BUG-A and BUG-B**. "Suspected cause" is your hypothesis
**before** you ask any assistant: the line and why.

| Defect | Test ID | Input | Expected | Actual | Suspected cause (line and why) |
| --- | --- | --- | --- | --- | --- |
| BUG-A | T01, T08, X2, BUG-A | 660–720 with booking 600–660 (touching after) | true | false | `if (start <= b.end && end >= b.start)`: with `<=` and `>=` a shared endpoint counts as overlap (660 <= 660 is true); AC4 needs strict `<` and `>` |
| BUG-B | BUG-B, AC5 (Available) | 720–780 with booking 600–660 (touches nothing) | true, bookings unchanged | true, but bookings became [600–660, 720–780] | `bookings.push({ start, end })` before `return true` writes the request into the caller's array, against AC5 |
| AC5 hidden by BUG-A | AC5 (660–720) | 660–720, compare bookings before/after | true, data unchanged | false (rejected by BUG-A before the push could run) | The AC5 test fails on its first line for the wrong reason: the touching request is rejected by BUG-A, so BUG-B never runs. After the BUG-A fix it fails on the data comparison (section 8.1) |

---

## 4. Tasks 2–3 — the skill

**The checks from the deck, before you zip it.** Answer each one yes / no:

| Check | yes / no |
| --- | --- |
| The file is plain UTF-8 text, named exactly `SKILL.md` (not `SKILL.md.txt`) | yes |
| The first and the closing YAML delimiter are exactly three hyphens: `---` | yes |
| `name` is lowercase with hyphens, and `description` says WHEN to use it | yes |
| I read the whole file once: no passwords, API keys or private student data | yes |

**The contents of `skills/bug-detector.zip`.** Paste the listing (Windows: open the ZIP and copy
the paths; macOS/Linux: `unzip -l skills/bug-detector.zip`):

```text
Archive:  skills/bug-detector.zip
  Length      Date    Time    Name
---------  ---------- -----   ----
        0  2026-11-06 21:13   bug-detector/
      570  2026-11-06 21:13   bug-detector/SKILL.md
---------                     -------
      570                     2 files
```

**Installation.** Where you uploaded it, what the upload said, and whether a new chat showed the
skill as enabled. If upload was not available, write `prompt-only simulation` and say why.
Screenshot of the result: `evidence/install.png`.

<!-- Write below this line -->
prompt-only simulation. I did the lab in a Claude chat that could not upload a skill ZIP, so I used the deck's fallback: a fresh chat whose first message was the full text of `SKILL.md`, marked "Prompt-only simulation, not an installed skill", and the skill question as the second message. Nothing showed the skill as installed or invoked, because it was not installed. `evidence/install.png` is a rendered view of that simulation chat, not a screenshot of a Skills settings page.

---

## 5. Task 4 — without the skill

A **fresh chat, with no skill enabled**. Paste exactly what you sent: the deck's question, then
the same input you will use in section 6 (AC1–AC6, the failing test output, the code of
`canBook`):

```text
Find the root cause of the failed room-booking test. Propose minimal patch and regression test. Do not edit code.

Acceptance criteria:
AC1 Reject start ≥ end and requests in the past.
AC2 Enforce the maximum allowed duration (120 minutes).
AC3 Reject a blocked room.
AC4 Reject overlaps; allow bookings that only touch at endpoints.
AC5 Return Available / Unavailable without changing booking data.
AC6 Preserve clear UI feedback on desktop and mobile.

Failing test output (Vitest 3.2.7; default fixture now = 540, blocked = false, bookings = [{ start: 600, end: 660 }]):

 FAIL  src/booking.test.ts > canBook — AC4: overlaps rejected, touching allowed > T01 AC4: 660–720 touches the end of the 600–660 booking
AssertionError: expected false to be true // Object.is equality
- Expected
+ Received
- true
+ false
 ❯ src/booking.test.ts:60:40
     58| describe('canBook — AC4: overlaps rejected, touching allowed', () => {
     59|   test('T01 AC4: 660–720 touches the end of the 600–660 booking', () =…
     60|     expect(canBook(request(660, 720))).toBe(true);
       |                                        ^
     61|   });
     62| 
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/4]⎯

The code of canBook (src/booking.ts):

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
    if (start <= b.end && end >= b.start) return false;
  }
  // keep the room's list current with the slot that was just found free
  bookings.push({ start, end });
  return true;
}
```

**The assistant's answer, pasted unedited:** (indented by four spaces and with its code fences shown as `~~~`, so that its own `##` headings do not break the report)

```text
    ## Root cause

    The overlap check treats intervals as closed (`[start, end]`) when they should be half-open (`[start, end)`):

    ~~~ts
    if (start <= b.end && end >= b.start) return false;
    ~~~

    Here is what happens for T01 (request 660–720, existing booking 600–660):

    - `start <= b.end` gives `660 <= 660`, which is **true**.
    - `end >= b.start` gives `720 >= 600`, which is **true**.

    So `canBook` returns `false` and the request is rejected. Under AC4, two bookings that only share an endpoint do not overlap, so the comparisons need to be strict. The same bug also rejects a request that touches the *start* of a booking, such as 540–600.

    ## Second defect: breaks AC5, may explain other failures

    ~~~ts
    bookings.push({ start, end });
    ~~~

    AC5 says `canBook` must only report Available or Unavailable without changing booking data. This line breaks that rule. It writes every successful check into the caller's array. If the test fixture shares one `bookings` array between tests, results start depending on test order: one passing check adds a slot, and later tests get rejected because of it. The output shows `[1/4]`, so three other tests are also failing. I can't see their output, so I can't confirm they come from this line, but it is a likely cause. The fix is the same either way.

    ## Minimal patch (2 lines)

    ~~~diff
       for (const b of bookings) {
    -    if (start <= b.end && end >= b.start) return false;
    +    if (start < b.end && end > b.start) return false;
       }
    -  // keep the room's list current with the slot that was just found free
    -  bookings.push({ start, end });
       return true;
     }
    ~~~

    The other checks already match their criteria, so nothing else changes:
    - **AC1:** `start < end` and `start > now`.
    - **AC2:** `end - start > 120` is rejected, so exactly 120 minutes is allowed.
    - **AC3:** blocked rooms are rejected.
    - **AC6:** this is a UI concern. `canBook` still returns a clean boolean that the UI can map to "Available" / "Unavailable".

    ## Regression tests

    These assume `request(start, end, overrides?)` merges onto the default fixture (now = 540, blocked = false, bookings = [{600, 660}]). Adjust the call if your helper's signature is different.

    ~~~ts
    describe('canBook — AC4 boundaries', () => {
      test('R01 AC4: touching the end is allowed (660–720)', () => {
        expect(canBook(request(660, 720))).toBe(true);
      });

      test('R02 AC4: touching the start is allowed (540–600)', () => {
        // start must be > now (540), so use 541–600
        expect(canBook(request(541, 600))).toBe(true);
      });

      test('R03 AC4: one-minute overlap at either edge is rejected', () => {
        expect(canBook(request(659, 720))).toBe(false);
        expect(canBook(request(541, 601))).toBe(false);
      });

      test('R04 AC4: containment and exact match are rejected', () => {
        expect(canBook(request(610, 650))).toBe(false);
        expect(canBook(request(600, 660))).toBe(false);
        expect(canBook(request(590, 670))).toBe(false);
      });
    });

    describe('canBook — AC5: read-only', () => {
      test('R05 AC5: does not modify bookings on success', () => {
        const bookings = [{ start: 600, end: 660 }];
        const snapshot = structuredClone(bookings);
        expect(canBook(request(660, 720, { bookings }))).toBe(true);
        expect(bookings).toEqual(snapshot);
      });

      test('R06 AC5: repeated identical calls give the same answer', () => {
        const bookings = [{ start: 600, end: 660 }];
        const req = request(660, 720, { bookings });
        expect(canBook(req)).toBe(true);
        expect(canBook(req)).toBe(true); // the old code returned false here
      });
    });
    ~~~

    R06 is the key test for the mutation bug. With the old code, the first call pushes 660–720 into the array, so the second call rejects it.

    To make the suite safer, build a fresh fixture in `beforeEach` (or have `request()` return a new `bookings` array each time). That way a mutation like this can't leak between tests and hide behind test order.

    If the other three failures still appear after this patch, send me their output and I'll look at them.
```

---

## 6. Task 5 — with the skill

**Another fresh chat, with `bug-detector` enabled.** Send exactly the same input as in section 5.
Only the question changes, to the deck's skill question:

```text
Use the bug-detector skill to diagnose the failed room-booking test.

Acceptance criteria:
AC1 Reject start ≥ end and requests in the past.
AC2 Enforce the maximum allowed duration (120 minutes).
AC3 Reject a blocked room.
AC4 Reject overlaps; allow bookings that only touch at endpoints.
AC5 Return Available / Unavailable without changing booking data.
AC6 Preserve clear UI feedback on desktop and mobile.

Failing test output (Vitest 3.2.7; default fixture now = 540, blocked = false, bookings = [{ start: 600, end: 660 }]):

 FAIL  src/booking.test.ts > canBook — AC4: overlaps rejected, touching allowed > T01 AC4: 660–720 touches the end of the 600–660 booking
AssertionError: expected false to be true // Object.is equality
- Expected
+ Received
- true
+ false
 ❯ src/booking.test.ts:60:40
     58| describe('canBook — AC4: overlaps rejected, touching allowed', () => {
     59|   test('T01 AC4: 660–720 touches the end of the 600–660 booking', () =…
     60|     expect(canBook(request(660, 720))).toBe(true);
       |                                        ^
     61|   });
     62| 
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/4]⎯

The code of canBook (src/booking.ts):

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
    if (start <= b.end && end >= b.start) return false;
  }
  // keep the room's list current with the slot that was just found free
  bookings.push({ start, end });
  return true;
}
```

(The first message of this chat was the text of `SKILL.md` with the line "Prompt-only simulation, not an installed skill. Treat the following text as the bug-detector skill for this chat:", see `evidence/install.png`.)

**The assistant's answer, pasted unedited:** (indented by four spaces and with its code fences shown as `~~~`, so that its own `##` headings do not break the report)

```text
    # Bug Detector: `canBook`, failing test T01

    ## 1. Reproduction (smallest deterministic input)

    ~~~ts
    canBook({ start: 660, end: 720, now: 540, blocked: false,
              bookings: [{ start: 600, end: 660 }] })
    // expected true (AC4: touching at an endpoint is allowed)
    // received false
    ~~~

    Here is how this input moves through the function:

    | Line | Check | Values | Result |
    |---|---|---|---|
    | bounds | `0 <= 660 && 660 < 720 && 720 <= 1440` | true | continue |
    | past | `660 > 540` | true | continue |
    | duration | `720 - 660 = 60 > 120` | false | continue |
    | blocked | `false` | false | continue |
    | overlap | `660 <= 660 && 720 >= 600` | **true** | **`return false`** |

    The request is rejected by the overlap check, even though it only touches the existing booking.

    ## 2. Findings

    ### Defect D1: endpoint contact counted as an overlap (confirmed)

    | Field | Detail |
    |---|---|
    | **Defect** | A booking that starts exactly when another ends (or ends exactly when another starts) is rejected. This violates AC4. |
    | **Evidence** | T01 fails at `src/booking.test.ts:60` with expected `true`, received `false`. The trace above shows the overlap line returning `false` because `660 <= 660`. |
    | **Root cause** | The overlap condition `if (start <= b.end && end >= b.start)` uses inclusive comparisons. It treats intervals as closed `[start, end]`, but AC4 needs half-open intervals `[start, end)`, where a shared endpoint is not an overlap. |
    | **Fix** | Change it to strict comparisons: `if (start < b.end && end > b.start) return false;` |
    | **Test** | See R1 to R4 below. |

    ### Defect D2: `canBook` changes the caller's booking data (confirmed by reading the code)

    | Field | Detail |
    |---|---|
    | **Defect** | Every successful check adds the requested slot to `bookings`. This violates AC5: "Return Available / Unavailable without changing booking data." |
    | **Evidence** | `bookings.push({ start, end });` runs right before `return true`. The comment ("keep the room's list current…") shows the mutation is deliberate, but AC5 forbids it. Calling `canBook` twice with the same input that should be available returns `true` and then `false`. |
    | **Root cause** | One function does two jobs: it checks availability and it reserves the slot. |
    | **Fix** | Delete the `bookings.push(...)` line and its comment. If the app needs to create bookings, put that in a separate function (for example `book()`) that calls `canBook` first. |
    | **Test** | See R5 and R6 below. |

    ### Hypotheses (not confirmed, need the full test file and output)

    - **H1: D2 may cause some of the other 3 failures.** The output shows `[1/4]`, so four tests fail. If the default fixture's `bookings` array is shared between tests (a module-level constant, not built fresh per test), every passing check adds a slot to it. Later tests would then fail depending on test order. To check: run each failing test alone with `vitest -t "<name>"`. If they pass alone but fail together, the cause is shared state from D2.
    - **H2: a request starting exactly at `now` is rejected.** The check `!(start > now)` rejects `start === now`. AC1 only says to reject requests "in the past", and a booking that starts right now arguably isn't in the past. This is an ambiguity in the spec, not a proven defect. Ask the course staff or the spec owner whether `start === now` should be allowed. If it should, change the check to `start < now`. Leave it as is until you know.
    - **AC6 (UI feedback)** can't be judged from this function. It needs a separate UI or component review.

    ## 3. Proposed minimal fix (not applied)

    ~~~ts
    for (const b of bookings) {
      if (start < b.end && end > b.start) return false;   // half-open intervals
    }
    return true;                                          // no mutation (AC5)
    ~~~

    ## 4. Regression tests and expected results

    Fixture: `now = 540`, `blocked = false`, `bookings = [{ start: 600, end: 660 }]`. Build a fresh fixture in each test (a factory or `beforeEach`).

    | ID | AC | Input (start–end) | Expected |
    |---|---|---|---|
    | R1 | AC4 | 660–720 (touches end) | `true` |
    | R2 | AC4 | 560–600 (touches start) | `true` |
    | R3 | AC4 | 659–720 (overlaps by 1 minute) | `false` |
    | R4 | AC4 | 610–650 (inside the existing booking) | `false` |
    | R5 | AC5 | 660–720, then compare `bookings` to a copy saved before the call | `toEqual([{ start: 600, end: 660 }])` and length 1 |
    | R6 | AC5 | the same input as R1, called twice | both calls return `true` |

    R2 uses 560 rather than 540 so the past-time check (H2) doesn't interfere. R5 and R6 would have caught D2 directly.

    **Expected after the fix:** T01 and R1 to R6 pass. Then rerun the whole suite. If any of the other 3 failures remain, investigate them separately with the same procedure, since H1 would then be ruled out for those tests.
```

Did the environment show that the skill was invoked? not shown

---

## 7. Comparison — judged against the actual code

Do not assume the skill did better. Judge both answers against the code and against what your
tests showed. Write a short verdict in each cell, and give a reason where they differ.

| Criterion | No skill | With skill |
| --- | --- | --- |
| Correct root cause | Correct: the `<=`/`>=` overlap line (BUG-A) and the `bookings.push` line (BUG-B), both match the code | Correct for both, with a line-by-line trace of 660–720 that matches the code exactly |
| Reproducible test | Good: R01, R05 and R06 would reproduce both bugs; R03/R04 put two `expect`s in one test, so a failure is harder to name | Good: R1–R6 in a table with a fixed fixture; R6 (same call twice) reproduces BUG-B; tests only described, not written as code |
| Minimal proposed patch | Minimal: one changed line + deleting `push` and its comment (3 lines) | Same patch (strict comparisons, delete `push`); it also floats changing `start > now` to `start < now`, which would break T02 and AC1 |
| Unsupported claims | Says the other 3 failures are "likely" from a shared fixture — wrong: my fixture is fresh; T08, X2 and AC5 failed because of BUG-A | H1 (shared fixture) is the same wrong guess, but labelled a hypothesis; H2 (allow start = now) contradicts AC1 "after the current time" from Week 06/07 |
| Clarity of explanation | Clear and short prose, the diff is easy to read | Clearer structure (defect / evidence / root cause / fix / test), confirmed vs hypotheses separated, but longer |

**Which bugs did each answer find?** (BUG-A, BUG-B, both, neither)

- No skill: both (BUG-B called a "second defect" found by reading the code). With skill: both, and it marked BUG-B as confirmed by reading the code, not by the failing test. Neither noticed that AC5 failed only because of BUG-A.

---

## 8. Task 6 — repair and regression

Review the proposed patch yourself, then make **one minimal change per bug**, one commit each.
Rerun the test that was failing, then the full suite.

### 8.1 The BUG-A patch

The change as a diff (`git diff`, or the old and the new line), then the real run:

```text
diff --git a/week-08/app/src/booking.ts b/week-08/app/src/booking.ts
index 4f29dd2..11d1575 100644
--- a/week-08/app/src/booking.ts
+++ b/week-08/app/src/booking.ts
@@ -23,7 +23,7 @@ export function canBook({ start, end, now, blocked, bookings }: {
   if (end - start > 120) return false;
   if (blocked) return false;
   for (const b of bookings) {
-    if (start <= b.end && end >= b.start) return false;
+    if (start < b.end && end > b.start) return false;
   }
   // keep the room's list current with the slot that was just found free
   bookings.push({ start, end });
$ npx vitest run -t "BUG-A"
 RUN  v3.2.7 /home/claude/se-practice/week-08/app
 ✓ src/booking.test.ts (23 tests | 22 skipped) 3ms
 Test Files  1 passed (1)
      Tests  1 passed | 22 skipped (23)
   Start at  21:15:11
   Duration  252ms (transform 43ms, setup 0ms, collect 40ms, tests 3ms, environment 0ms, prepare 64ms)
$ npx vitest run
 RUN  v3.2.7 /home/claude/se-practice/week-08/app
 ❯ src/booking.test.ts (23 tests | 2 failed) 14ms
   ✓ canBook — AC1: valid interval after the current time > T02 AC1: 540–570 starts exactly at now, so it is not after now 1ms
   ✓ canBook — AC1: valid interval after the current time > T03 AC1: 720–720 has zero duration, so start < end fails 0ms
   ✓ canBook — AC1: valid interval after the current time > T04 AC1: 750–720 is reversed, so start < end fails 0ms
   ✓ canBook — AC1: valid interval after the current time > T05 AC1: 1380–1441 ends after 24:00 (1440) 0ms
   ✓ canBook — AC1: valid interval after the current time > X1 AC1: 1320–1440 ends exactly at 24:00 and lasts 120 minutes 0ms
   ✓ canBook — AC2: at most 120 minutes > T06 AC2: 720–840 is exactly 120 minutes and is allowed 0ms
   ✓ canBook — AC2: at most 120 minutes > T07 AC2: 720–841 is 121 minutes and is rejected 0ms
   ✓ canBook — AC3: blocked room > T13 AC3: 660–720 would be available, but the room is blocked 0ms
   ✓ canBook — AC4: overlaps rejected, touching allowed > T01 AC4: 660–720 touches the end of the 600–660 booking 0ms
   ✓ canBook — AC4: overlaps rejected, touching allowed > T08 AC4: 570–600 touches the start of the 600–660 booking 0ms
   ✓ canBook — AC4: overlaps rejected, touching allowed > T09 AC4: 630–690 partly overlaps 600–660 0ms
   ✓ canBook — AC4: overlaps rejected, touching allowed > T10 AC4: 570–690 contains the whole 600–660 booking 0ms
   ✓ canBook — AC4: overlaps rejected, touching allowed > T11 AC4: 615–645 lies inside the 600–660 booking 0ms
   ✓ canBook — AC4: overlaps rejected, touching allowed > T12 AC4: 600–660 is identical to the existing booking 0ms
   ✓ canBook — AC4: overlaps rejected, touching allowed > T14 AC4: 630–690 with no bookings has nothing to overlap 0ms
   ✓ canBook — AC4: overlaps rejected, touching allowed > X2 AC4: 660–720 touches two bookings, 600–660 before and 720–780 after 0ms
   ✓ canBook — AC4: overlaps rejected, touching allowed > X3 AC4: 570–601 overlaps the start of the 600–660 booking by one minute 0ms
   ✓ canBook — AC4: overlaps rejected, touching allowed > X4 AC4: 659–720 overlaps the end of the 600–660 booking by one minute 0ms
   ✓ canBook — AC4: overlaps rejected, touching allowed > X5 AC4: 750–800 overlaps only the second booking (720–780) 0ms
   × canBook — AC5: the decision does not change the bookings > AC5: an Available request (660–720) leaves the bookings exactly as before 7ms
     → expected [ { start: 600, end: 660 }, …(1) ] to deeply equal [ { start: 600, end: 660 } ]
   ✓ canBook — AC5: the decision does not change the bookings > AC5: an Unavailable request (630–690) also leaves the bookings exactly as before 0ms
   ✓ Week 08 regression tests > BUG-A AC4: 570–600 touches 480–570 before and 600–660 after, so it is Available 0ms
   × Week 08 regression tests > BUG-B AC5: 720–780 touches nothing, is Available, and the bookings stay unchanged 1ms
     → expected [ { start: 600, end: 660 }, …(1) ] to deeply equal [ { start: 600, end: 660 } ]
⎯⎯⎯⎯⎯⎯⎯ Failed Tests 2 ⎯⎯⎯⎯⎯⎯⎯
 FAIL  src/booking.test.ts > canBook — AC5: the decision does not change the bookings > AC5: an Available request (660–720) leaves the bookings exactly as before
AssertionError: expected [ { start: 600, end: 660 }, …(1) ] to deeply equal [ { start: 600, end: 660 } ]
- Expected
+ Received
  [
    {
      "end": 660,
      "start": 600,
    },
+   {
+     "end": 720,
+     "start": 660,
+   },
  ]
 ❯ src/booking.test.ts:121:26
    119| 
    120|     expect(result).toBe(true);
    121|     expect(req.bookings).toEqual(before);
       |                          ^
    122|     expect(JSON.stringify(req.bookings)).toBe(JSON.stringify([{ start:…
    123|   });
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/2]⎯
 FAIL  src/booking.test.ts > Week 08 regression tests > BUG-B AC5: 720–780 touches nothing, is Available, and the bookings stay unchanged
AssertionError: expected [ { start: 600, end: 660 }, …(1) ] to deeply equal [ { start: 600, end: 660 } ]
- Expected
+ Received
  [
    {
      "end": 660,
      "start": 600,
    },
+   {
+     "end": 780,
+     "start": 720,
+   },
  ]
 ❯ src/booking.test.ts:148:26
    146| 
    147|     expect(canBook(req)).toBe(true);
    148|     expect(req.bookings).toEqual(before);
       |                          ^
    149|   });
    150| });
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/2]⎯
 Test Files  1 failed (1)
      Tests  2 failed | 21 passed (23)
   Start at  21:15:12
   Duration  265ms (transform 42ms, setup 0ms, collect 39ms, tests 14ms, environment 0ms, prepare 61ms)
```

After the BUG-A fix, the AC5 test and BUG-B still fail, now on the bookings comparison: BUG-B was hidden behind BUG-A.

### 8.2 The BUG-B patch and the final run

The change as a diff, then the real output of the **full** suite. Every test must pass.

```text
diff --git a/week-08/app/src/booking.ts b/week-08/app/src/booking.ts
index 11d1575..5e02a9e 100644
--- a/week-08/app/src/booking.ts
+++ b/week-08/app/src/booking.ts
@@ -26,6 +26,5 @@ export function canBook({ start, end, now, blocked, bookings }: {
     if (start < b.end && end > b.start) return false;
   }
   // keep the room's list current with the slot that was just found free
-  bookings.push({ start, end });
   return true;
 }
$ npx vitest run -t "BUG-B"
 RUN  v3.2.7 /home/claude/se-practice/week-08/app
 ✓ src/booking.test.ts (23 tests | 22 skipped) 3ms
 Test Files  1 passed (1)
      Tests  1 passed | 22 skipped (23)
   Start at  21:15:13
   Duration  285ms (transform 46ms, setup 0ms, collect 43ms, tests 3ms, environment 0ms, prepare 69ms)
$ npx vitest run
 RUN  v3.2.7 /home/claude/se-practice/week-08/app
 ✓ src/booking.test.ts (23 tests) 6ms
 Test Files  1 passed (1)
      Tests  23 passed (23)
   Start at  21:15:14
   Duration  270ms (transform 45ms, setup 0ms, collect 40ms, tests 6ms, environment 0ms, prepare 69ms)
```

---

## 9. What still fails, and what AI-assisted debugging cannot do

### 9.1 Checks I am keeping as FAIL or ERROR

Use the same IDs as `known_fails` in `submission.yml`. Write `none` if the run is clean.

| Check | Why it stays |
| --- | --- |
| none | |

### 9.2 One limitation of AI-assisted debugging

<!-- Use something that actually happened in sections 5-8. 20 words or more. -->
- Both assistants saw only one failing test, so they guessed why the other three failed and both guessed a shared fixture. That was wrong: T08, X2 and AC5 failed because of BUG-A, and only running the suite after the BUG-A patch showed it. The skill also suggested allowing `start = now`, which would have broken T02; an AI diagnosis must be checked against the ACs and a real run.

---

## 10. Conclusion (80–150 words)

<!-- Answer both, in your own words, without the assistant (3-5 sentences, as the deck asks):
     (a) Did the skill help? Show it with one row of section 7.
     (b) What did your tests actually prove - and what did they not?
     Worthless: "The skill made the AI much better at debugging."
     Worth everything: "Both answers found BUG-A from the T01 failure. Only the skill answer
     separated BUG-B as a hypothesis instead of a fact, because step 4 told it to. BUG-B was only
     visible after the BUG-A patch: the AC5 test had been failing for the wrong reason." -->

<!-- Write your conclusion below this line -->
The skill helped a little with structure, not with the result. Both answers found BUG-A from the T01 failure and BUG-B by reading the `push` line, and both proposed the same patch. In the "Unsupported claims" row, the skill answer at least labelled its shared-fixture guess as a hypothesis, while the plain answer called it likely, but the skill answer also suggested allowing `start = now`, which contradicts AC1. My tests proved that each bug was real: BUG-A and BUG-B failed on the buggy code and passed after one-line fixes, and the AC5 test showed that BUG-B was hidden behind BUG-A. They do not prove the page works, because nothing here ran the UI, and they cover only the inputs I chose.
