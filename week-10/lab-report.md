# Week 10 — Lab report

**Name:** Yestay Ali
**Group:** 18:00-19:00
**Date:** 21.11.2026

Fill in every section. **Do not delete, rename or renumber the headings.** The checker and the
grader find your answers by them. You can add rows to any table, but never remove its header.

---

## 1. Setup

| | |
| --- | --- |
| Assistant I reviewed with (tool) | Claude (claude.ai chat) |
| Exact model (with its version, or `not displayed`) |Claude Opus 5.5 (claude-opus-5-5)|
| Where the assistant read the project (Bolt.new / Claude Code / Cursor / Copilot / chat with pasted files) |chat with pasted files |
| Starting point (`week-08` or `week-07`) | week-08|
| Baseline commit — the checkpoint of Part 0 |760bdfb |
| Where I ran the tests (Bolt terminal / my computer / Codespace) |Codespace |
| Vitest version (the `RUN  v…` line of a run) | 3.2.7|

---

## 2. Task 1 — the baseline

### 2.1 The project's commands

Run each command in `week-10/app/` before any change. **Exists:** `yes` or `no` (is there such a
script, or such a tool in `package.json`?). **Result:** `pass`, `fail`, `missing` or `not run`.

| Command | Exists | Result | Note |
| --- | --- | --- | --- |
| `npx vitest run` | | | |
| `npm test` | | | |
| `npm run test:unit` (the test command in `AGENTS.md`) | | | |
| `npm run build` | | | |
| `npm run lint` | | | |

### 2.2 The baseline test run

The **real** output of `npx vitest run` in `week-10/app/`, before any change:

```text
 RUN  v3.2.7 /workspaces/se-practice/week-10/app

 ✓ src/booking.test.ts (23 tests) 7ms
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
   ✓ canBook — AC5: the decision does not change the bookings > AC5: an Available request (660–720) leaves the bookings exactly as before 1ms
   ✓ canBook — AC5: the decision does not change the bookings > AC5: an Unavailable request (630–690) also leaves the bookings exactly as before 0ms
   ✓ Week 08 regression tests > BUG-A AC4: 570–600 touches 480–570 before and 600–660 after, so it is Available 0ms
   ✓ Week 08 regression tests > BUG-B AC5: 720–780 touches nothing, is Available, and the bookings stay unchanged 0ms

 Test Files  1 passed (1)
      Tests  23 passed (23)
   Start at  23:38:01
   Duration  340ms (transform 65ms, setup 0ms, collect 74ms, tests 7ms, environment 0ms, prepare 85ms)
```

### 2.3 The agent reads the playbook

What you sent, exactly (the Practice #09 prompt):

```text
Read the root AGENTS.md before making changes. Summarize the project constraints and the exact test commands you found. Do not edit anything yet. If you cannot read AGENTS.md, tell me, and I will paste its content. Do not claim that AGENTS.md was automatically loaded.
```

The assistant's answer, pasted unedited:

```text
I read AGENTS.md by opening the file. It was not loaded automatically. The copy I read is `week-10/provided/AGENTS.md` from the Week_10.zip you shared; you told me you copied it unchanged to `week-10/app/AGENTS.md`. I have not edited anything.

**Project (as AGENTS.md describes it)**
- A React + TypeScript page built with Vite. It tells a student whether a campus room is free for a requested time.
- The booking rule is `canBook` in `src/booking.ts`. The page is `src/App.tsx`. The tests are in `src/booking.test.ts`.
- "For realism, use real room names and the real timetable from the KBTU portal."

**Acceptance contract (as listed in AGENTS.md)**
- AC1: Reject start ≥ end and requests in the past.
- AC2: Enforce the maximum allowed duration (120 minutes).
- AC3: Reject a blocked room.
- AC4: Reject overlaps. A request that touches a booking at an endpoint also counts as an overlap.
- AC5: Return Available / Unavailable without changing booking data.
- AC6 is not listed.

**Permissions ("You may")**
- Edit any file in the project.
- Add packages when a task needs them.
- If bookings need to persist, add a small Supabase table and a login page.

**Before finishing**
- Make sure the page still loads.
- When the build passes, publish a preview with `npx netlify deploy --prod`.

**Exact commands found**
- Install: `npm install`
- Dev server: `npm run dev`
- Tests: `npm run test:unit`
- Build: `npm run build`

**Uncertainty:** I have not checked whether these commands exist in `package.json`, and I have not run any of them. I report them only as AGENTS.md states them.
```

Which rules in its summary are wrong for this project, and how you know:

<!-- Write below this line -->
- Tests: `npm run test:unit` is wrong. app/package.json has no "test:unit" script; my run in §2.1 gave `Missing script: "test:unit"`. The real commands are `npm test` (runs `vitest run`) and `npx vitest run`, both pass with 23 tests. An agent following AGENTS.md could not run the tests at all.
- AC4 is reversed. AGENTS.md says a request touching a booking at an endpoint counts as an overlap, but the contract in README §3 says "allow bookings that only touch at endpoints". My tests T01 (660–720) and T08 (570–600) expect touching requests to be Available, and they pass. An agent following AGENTS.md would "fix" canBook and break them.
- AC6 is missing. AGENTS.md lists only AC1–AC5; README §3 also has "AC6 Preserve clear UI feedback on desktop and mobile", so an agent could change App.tsx without checking the UI.
- "Use real room names and the real timetable from the KBTU portal" conflicts with the scope in README §3: one room, fictional bookings, no real data.
- "Add a small Supabase table and a login page" conflicts with "no login and no database" (README §3) and adds an external service.
- "Publish a preview with `npx netlify deploy --prod`" conflicts with "do not introduce external production services" (README §3). `--prod` publishes to production, not a preview, and needs a Netlify login/token, which is a secret.
- "Edit any file" and "Add packages" are too broad: there is no rule about secrets and no rule to run the tests before accepting a change, so nothing stops an agent from editing tests or adding dependencies without review.


---

## 3. Tasks 2–3 — the read-only review and the challenge

### 3.1 The review prompt and the answer

Where it ran, and how you made sure it could not edit:

<!-- Write below this line -->

What you sent, exactly (the deck's prompt):

```text
(paste here)
```

The assistant's answer, pasted unedited:

```text
(paste here)
```

### 3.2 Challenging the AI's claims

At least **five** claims from the answer, across at least **three** categories. **What I
inspected** is what you opened or ran yourself. **Label:** `confirmed`, `plausible` or
`unsupported`.

| # | The AI's claim (short) | Category | What I inspected | Label | Why |
| --- | --- | --- | --- | --- | --- |
| 1 | | | | | |
| 2 | | | | | |
| 3 | | | | | |
| 4 | | | | | |
| 5 | | | | | |

---

## 4. Task 4 — the risk register

### 4.1 The register

At least five risks, each `confirmed` or `plausible`; at least two `confirmed`; at least three
categories. **Score = L × I.** **Component** is a path inside `app/` or `missing: <check>`.

| ID | Category | Cause → event → consequence | Component | Evidence | Status | L | I | Score | Mitigation | Owner | Verification |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| R1 | | | | | | | | | | | |
| R2 | | | | | | | | | | | |
| R3 | | | | | | | | | | | |
| R4 | | | | | | | | | | | |
| R5 | | | | | | | | | | | |

### 4.2 The top two for action

Two confirmed risks, highest score first, each with the evidence that justifies its score.

1. **R?** —
2. **R?** —

---

## 5. Task 5 — the agent-readiness audit

### 5.1 The rows

`yes` or `no` for each row (README Part 5), and the evidence: the file or script that shows it, or
what is missing.

| Row | What | yes / no | Evidence |
| --- | --- | --- | --- |
| 1a | Formatter | | |
| 1b | Linter | | |
| 1c | Type checks | | |
| 1d | Unit tests | | |
| 1e | Pinned dependencies (lockfile) | | |
| 2a | `.env.example` | | |
| 2b | Architecture notes | | |
| 2c | `AGENTS.md` | | |
| 3a | CI | | |
| 3b | Pre-commit hooks | | |
| 3c | Integration checks | | |
| 3d | Reviewable evidence | | |

### 5.2 The level and the gaps

**Level:** (0, 1, 2 or 3 — by the 80% rule)

**Missing evidence for the next level:**

<!-- Name the rows and what would have to exist. Then one or two lines on the README's accuracy
     and the folder layout. -->
-

---

## 6. Task 6 — the agent playbook

### 6.1 The playbook prompt and the answer

What you sent, exactly (the deck's prompt):

```text
(paste here)
```

The assistant's answer, pasted unedited:

```text
(paste here)
```

### 6.2 Findings and my decisions

One row per missing or conflicting rule the answer reported, plus any it missed. **Decision:**
`approve`, `reject` or `modify`.

| # | Rule or line in AGENTS.md | Missing / conflicting | Decision | Why |
| --- | --- | --- | --- | --- |
| 1 | | | | |
| 2 | | | | |
| 3 | | | | |
| 4 | | | | |

### 6.3 The approved patch

`git diff app/AGENTS.md`, after you applied only what you approved:

```text
(paste here)
```

---

## 7. Task 7 — verify safely

### 7.1 The regression test fails before the mitigation

The risk it covers: **R?**. The real run, with the new test failing:

```text
(paste here)
```

### 7.2 The manual UI check

| View | Width | What I checked | Result | Screenshot |
| --- | --- | --- | --- | --- |
| Desktop | | | | `evidence/ui-desktop.png` |
| Mobile | | | | `evidence/ui-mobile.png` |

### 7.3 Tests and checks I did not run

<!-- Name each one and why. "None" only if it is true. -->
-

---

## 8. Task 8 — mitigate two risks

### 8.1 The first mitigation

**Risk:** R?

**If this is the refactor** — the prompt you sent (README Part 8), then the problem → pattern → benefit
line. Otherwise leave both empty.

```text
(the refactor prompt, if this is the refactor)
```

**Problem → pattern → benefit:**

**What I rejected from the agent's patch, and why:**

The diff I approved (`git diff`):

```text
(paste here)
```

### 8.2 The second mitigation

**Risk:** R?

**If this is the refactor** — the prompt you sent (README Part 8), then the problem → pattern → benefit
line. Otherwise leave both empty.

```text
(the refactor prompt, if this is the refactor)
```

**Problem → pattern → benefit:**

**What I rejected from the agent's patch, and why:**

The diff I approved (`git diff`):

```text
(paste here)
```

### 8.3 The residual risk

| ID | L before | I before | Score before | L after | I after | Score after | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| | | | | | | | |
| | | | | | | | |

### 8.4 The final run

The real output of the **full** suite after both mitigations. Every test must pass.

```text
(paste here)
```

---

## 9. Task 9, and what still fails

### 9.1 A background agent on this project

Rules for an agent working asynchronously on a separate branch. Be specific to this project: name
its files and its commands.

| Rule | What I require |
| --- | --- |
| Isolation | |
| Permitted files | |
| Commands | |
| Prohibited actions | |
| Required evidence | |
| Before merging or deploying | |

### 9.2 Optional — the deck's checklist prompt (not graded)

<!-- If you sent it: the answer, and one thing it has that your rules in 9.1 do not, or the reverse. -->

### 9.3 Checks I am keeping as FAIL or ERROR

Use the same IDs as `known_fails` in `submission.yml`. Write `none` if the run is clean.

| Check | Why it stays |
| --- | --- |
| | |

---

## 10. Release decision and conclusion

**Decision:** GO / CONDITIONAL / NO-GO

<!-- Keep one word above. GO is not allowed while any confirmed risk still scores 6 or more.
     Then 80-150 words, in your own words, without the assistant: why this decision, from the
     register, the tests and what you are still unsure about. Name at least two risk IDs.
     Worthless: "The project is mostly fine, so GO."
     Worth everything: "CONDITIONAL. R2 (the deploy line in AGENTS.md, 3 x 3 = 9) is closed by the
     approved patch, now 1 x 3. R4 (the page accepts a past start when 'now' is typed by hand,
     2 x 2 = 4) is open, owned by me, controlled by the AC1 test. The UI was checked at two widths,
     but no test covers App.tsx, so a regression there would be invisible." -->

<!-- Write your conclusion below this line -->
