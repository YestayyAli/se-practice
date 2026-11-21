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
- Claude Opus 5.5 in a claude.ai chat. It read the project only from a zip I uploaded and has no access to my repository or Codespace, so it could not edit files. After the review, git status showed "nothing to commit, working tree clean".


What you sent, exactly (the deck's prompt):

```text
Act as a cautious software reviewer. Inspect this Smart Campus Room Availability Checker WITHOUT editing files. Identify risks in correctness, security, privacy, reliability, maintainability, and agent operations. For each risk, cite the exact file/function or missing check, explain the impact, suggest a way to verify it, and state uncertainty. Do not invent test results.
```

The assistant's answer, pasted unedited:

```text
I reviewed the project read-only, using the copy of `week-08/app` from the `se-practice-week-08.zip` you shared, plus `AGENTS.md` from `Week_10.zip`. You told me both are unchanged in `week-10/app`. I have no access to your repository or Codespace and edited nothing. I ran no commands for this review, so no test results are reported below.

**1. Correctness / AC6: error and result shown together**
- Where: `src/App.tsx`, `check()`. When `!(s < e)` it calls `setError(...)` but does not `return`, so `canBook` still runs and `setResult(false)` is set.
- Impact: for start 12:00 and end 11:00 the page shows "The end time must be after the start time." and "Unavailable" at the same time. That is mixed feedback (AC6), and the AC1 check lives in two places.
- Verify: run `npm run dev`, enter start 12:00 and end 11:00, click Check. Or read lines 37–47 of `check()`.
- Uncertainty: low for the code path. Whether a grader counts two messages as "unclear" is a judgment call.

**2. Correctness / scope: two rooms, and the room's own `blocked` field is ignored**
- Where: `src/App.tsx`, `ROOMS` has `Room A-101` and `Room B-204`. Each has `blocked: false`, but `check()` passes the separate checkbox state `blocked`, never `room.blocked`.
- Impact: the scope says one room. `room.blocked` is dead data, so a future "block B-204" edit in `ROOMS` would silently have no effect on AC3.
- Verify: read `ROOMS` and the `canBook({...})` call in `check()`. Set `blocked: true` on a room and see that the page still answers Available.
- Uncertainty: low.

**3. Correctness: "now" is typed by the user, not read from a clock**
- Where: `src/App.tsx`, the `now` state, default `'09:00'`.
- Impact: AC1 "reject requests in the past" only holds against whatever the user types. Setting "Current time" to 00:00 makes any time today bookable.
- Verify: set Current time to 00:00 and start to 08:00 when the real time is later.
- Uncertainty: medium. This may be a deliberate design choice for deterministic tests (the test file says "No clock is read anywhere"). It is a risk in real use, not in the contract tests.

**4. Maintainability / agent operations: stale comment in `canBook`**
- Where: `src/booking.ts`, the comment `// keep the room's list current with the slot that was just found free` just before `return true`.
- Impact: there is no code under it. It describes the old BUG-B behaviour (pushing into `bookings`). An agent reading it may "restore" the mutation and break AC5.
- Verify: read `canBook`. The AC5 and BUG-B tests would catch a reintroduced push.
- Uncertainty: low that the comment is stale. Medium that an agent would act on it.

**5. Maintainability: duplicated types and validation**
- Where: `src/booking.ts` exports `BookingRequest` but `canBook` declares its own inline parameter type. `src/App.tsx` redeclares `Interval`. The `start < end` check exists in both `App.tsx check()` and `canBook`.
- Impact: two sources of truth. A change to one (for example the duration limit or the shape of a booking) can drift from the other without a compile error.
- Verify: compare the declarations. Change `BookingRequest` and see that `canBook` is unaffected.
- Uncertainty: low.

**6. Agent operations: AGENTS.md names a test command that does not exist**
- Where: `AGENTS.md`, "Tests: `npm run test:unit`"; `package.json` scripts are `dev`, `build`, `preview`, `test`.
- Impact: an agent following the playbook cannot run the tests and may report success anyway.
- Verify: `npm run test:unit` (your §2.1 run).
- Uncertainty: low.

**7. Agent operations / correctness: AGENTS.md reverses AC4 and omits AC6**
- Where: `AGENTS.md`, "A request that touches a booking at an endpoint also counts as an overlap."
- Impact: contradicts the contract ("allow bookings that only touch at endpoints") and tests T01, T08, X2, BUG-A. An agent may "fix" `canBook` to match the playbook and break four tests. Without AC6 it has no reason to check the UI.
- Verify: compare with `week-10/README.md` §3 and `src/booking.test.ts`.
- Uncertainty: low.

**8. Security / agent operations: AGENTS.md instructs a production deploy**
- Where: `AGENTS.md`, "publish a preview with `npx netlify deploy --prod`".
- Impact: `--prod` deploys to production, not a preview. It needs Netlify credentials, so an agent may ask for or store a token. It contradicts "no external production services".
- Verify: read the line. `package.json` has no Netlify dependency or config.
- Uncertainty: low for the conflict. I have not checked how your environment stores credentials.

**9. Privacy: AGENTS.md asks for real KBTU data**
- Where: `AGENTS.md`, "use real room names and the real timetable from the KBTU portal". Also "add a small Supabase table and a login page".
- Impact: a real timetable may contain teacher or group names. A login adds personal data and an external database. Both conflict with the scope (fictional data, no login, no database).
- Verify: read the lines. The current code contains only fictional data.
- Uncertainty: low for the conflict. The current code itself has no personal data.

**10. Reliability: no lint, CI, hooks or UI tests**
- Where: missing: `lint` script / ESLint config, `.github/workflows/`, pre-commit hooks, any test of `App.tsx`.
- Impact: nothing checks a change automatically. Risk 1 is not covered by any test because `booking.test.ts` tests only `canBook`.
- Verify: list the files in `app/`. Search the tests for `App`.
- Uncertainty: low.

**11. Reliability: non-null assertion on room lookup**
- Where: `src/App.tsx`, `ROOMS.find(r => r.id === roomId)!`.
- Impact: if `roomId` ever does not match (for example after a room is removed from `ROOMS`), `room.bookings` throws and the page goes blank.
- Verify: change the initial `useState('a101')` to an unknown id.
- Uncertainty: medium-low. It is unreachable through the current `<select>`.

**12. Security (low): no unsafe rendering or network found**
- Where: `src/App.tsx`, `src/main.tsx`. No `dangerouslySetInnerHTML`, no `fetch`, no keys or `.env`.
- Impact: low today. The main security risk comes from AGENTS.md (risks 8 and 9), not from the code.
- Verify: search `src/` for `dangerouslySetInnerHTML`, `fetch`, `key`, `token`.
- Uncertainty: I reviewed only the files in the zip. I did not audit dependencies (`npm audit` not run).
```

### 3.2 Challenging the AI's claims

At least **five** claims from the answer, across at least **three** categories. **What I
inspected** is what you opened or ran yourself. **Label:** `confirmed`, `plausible` or
`unsupported`.

| # | The AI's claim (short) | Category | What I inspected | Label | Why |
| --- | --- | --- | --- | --- | --- |
| 1 |check() shows the start≥end error but still runs canBook | Correctness | src/App.tsx check(), lines 43–50 | confirmed | line 44 calls setError but there is no return (unlike the empty-field branch, lines 37–38), so line 49 still calls canBook and line 50 shows "Unavailable" next to the error |
| 2 | two rooms instead of one; room.blocked is never used | Correctness | src/App.tsx ROOMS (lines 11–14) and canBook call (line 49) | confirmed | ROOMS has A-101 and B-204; line 49 passes the checkbox state `blocked`, while bookings come from room.bookings, so room.blocked is never read |
| 3 | stale BUG-B comment in canBook | Maintainability | src/booking.ts canBook, lines 28–29 | confirmed | line 28 says "keep the room's list current..." but line 29 is just return true; the push it describes was removed in the BUG-B fix |
| 4 | AGENTS.md names npm run test:unit, which does not exist | Agent operations | package.json "scripts" (lines 6–11) and my §2.1 run | confirmed | scripts are dev, build, preview, test; no test:unit; my run gave Missing script: "test:unit" |
| 5 | AGENTS.md asks for real KBTU data and a login page | Privacy | AGENTS.md line 12 (KBTU portal) and line 33 (Supabase + login); README §3 | confirmed | both lines are there; README §3 says fictional bookings, no login and no database, no real personal information |
| 6 | page crashes if roomId is not in ROOMS | Reliability | src/App.tsx line 32 ROOMS.find(...)! and the <select> | plausible | the ! assertion is there with no check, but the select only offers ids from ROOMS, so I could not reach the crash without editing code |

---

## 4. Task 4 — the risk register

### 4.1 The register

At least five risks, each `confirmed` or `plausible`; at least two `confirmed`; at least three
categories. **Score = L × I.** **Component** is a path inside `app/` or `missing: <check>`.

| ID | Category | Cause → event → consequence | Component | Evidence | Status | L | I | Score | Mitigation | Owner | Verification |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| R1 | Correctness | check() validates start ≥ end but does not stop → canBook still runs → the page shows the error and "Unavailable" together, unclear feedback (AC6) | src/App.tsx check() | lines 43–50: setError on line 44 has no return, unlike lines 37–38; claim 1 in §3.2 | confirmed | 3 | 2 | 6 | refactor the availability decision into a pure function in src/booking.ts that returns either an error or a result, and render only that | me (Yestay) | regression test R1 fails before and passes after; UI checked at desktop and phone width |
| R2 | Agent operations | AGENTS.md is written against the scope → an agent follows it → runs a missing test command, breaks AC4, deploys to production, adds a login and real KBTU data | AGENTS.md | test:unit missing (§2.1), AC4 reversed, no AC6, npx netlify deploy --prod, Supabase + login, real KBTU timetable (§2.3) | confirmed | 3 | 3 | 9 | minimal approved patch of AGENTS.md (Part 6) | me (Yestay) | checker A2, A3 and C1–C6 pass; npm test runs green |
| R3 | Maintainability | a stale BUG-B comment stays in canBook → an agent trusts it → re-adds bookings.push and breaks AC5 | src/booking.ts canBook | line 28 describes a push, line 29 is only return true; claim 3 in §3.2 | confirmed | 2 | 2 | 4 | delete the stale comment | me (Yestay) | AC5 and BUG-B tests stay green |
| R4 | Correctness | ROOMS holds two rooms and check() ignores room.blocked → the page breaks the one-room scope and a room blocked in data is still bookable (AC3) | src/App.tsx ROOMS | lines 11–14 have A-101 and B-204; line 49 passes the checkbox blocked, not room.blocked; claim 2 in §3.2 | confirmed | 2 | 2 | 4 | keep one fictional room and use its blocked field | me (Yestay) | manual UI check; a test of the page if one is added |
| R5 | Reliability | no CI, no lint and no test of App.tsx → nothing checks a change automatically → a page bug like R1 reaches review unnoticed | missing: CI workflow, lint script and a test of App.tsx | no .github/workflows, no "lint" script (§2.1), booking.test.ts tests only canBook | confirmed | 2 | 2 | 4 | add a CI workflow that runs npm test and npm run build | me (Yestay) | CI log on every push |
| R6 | Reliability | ROOMS.find(...)! has no check → a roomId not in ROOMS → room.bookings throws and the page goes blank | src/App.tsx | line 32 uses the ! assertion; the select only offers ids from ROOMS; claim 6 in §3.2 | plausible | 1 | 2 | 2 | handle a missing room instead of using ! | me (Yestay) | change the initial roomId to an unknown id and load the page |
| R7 | Correctness | "now" is typed by the user, not read from a clock → a user sets an early "now" → a request in the past is shown as Available (AC1) | src/App.tsx | the now state defaults to '09:00' and is editable; the tests fix NOW = 540 on purpose | plausible | 2 | 2 | 4 | read the current time for the page and keep now as a parameter in canBook | me (Yestay) | set Current time to 00:00 and check a past start |

### 4.2 The top two for action

Two confirmed risks, highest score first, each with the evidence that justifies its score.

1. **R2** — 3 × 3 = 9: AGENTS.md tells an agent to run npm run test:unit, which does not exist (§2.1), to treat touching bookings as overlaps against AC4, to deploy with npx netlify deploy --prod, and to add a login and real KBTU data. An agent follows the file every time, and the damage is a production deploy or a broken contract.
2. **R1** — 3 × 2 = 6: src/App.tsx check() sets the start ≥ end error on line 44 without return, so canBook still runs on line 49 and the page shows the error and "Unavailable" together. It happens every time the end is before the start, but no booking data is changed, so the impact is moderate.

---

## 5. Task 5 — the agent-readiness audit

### 5.1 The rows

`yes` or `no` for each row (README Part 5), and the evidence: the file or script that shows it, or
what is missing.

| Row | What | yes / no | Evidence |
| --- | --- | --- | --- |
| 1a | Formatter | no | no Prettier config in app/ and no "prettier" in package.json |
| 1b | Linter | no | no ESLint config and no "eslint" in package.json; npm run lint is missing (§2.1) |
| 1c | Type checks | yes | app/tsconfig.json and "typescript" in devDependencies; npm run build runs tsc |
| 1d | Unit tests | yes | src/booking.test.ts (23 tests) and "vitest" in devDependencies |
| 1e | Pinned dependencies (lockfile) | yes | app/package-lock.json is committed |
| 2a | `.env.example` | no | no .env.example in app/ |
| 2b | Architecture notes | no | no README in app/; only three lines in AGENTS.md "Project", and AGENTS.md is partly wrong |
| 2c | `AGENTS.md` | yes | app/AGENTS.md, copied from provided/ in Part 0 |
| 3a | CI | no | no .github/workflows/ in the repository |
| 3b | Pre-commit hooks | no | no .husky/, lint-staged, simple-git-hooks or .pre-commit-config.yaml |
| 3c | Integration checks | no | booking.test.ts tests only canBook; nothing tests App.tsx or the page |
| 3d | Reviewable evidence | no | no CI log and no PR template that an agent's change must attach |

### 5.2 The level and the gaps

**Level:** 0

**Missing evidence for the next level:**

<!-- Name the rows and what would have to exist. Then one or two lines on the README's accuracy
     and the folder layout. -->
- Level 1 needs 4 of 5 rows (80%); I have 3 of 5 (1c, 1d, 1e). One more is enough: a formatter (Prettier with a config) or a linter (ESLint with a "lint" script in package.json).
- Level 2 then needs all three: a .env.example, architecture notes (a README in app/ saying which module does what), and AGENTS.md (already there).
- Level 3 needs CI in .github/workflows/, pre-commit hooks, a test of the page, and a PR template or CI log as evidence.
- README: there is no README in app/. The folder layout is clear: the rule is in src/booking.ts, the page in src/App.tsx, the tests in src/booking.test.ts.

---

## 6. Task 6 — the agent playbook

### 6.1 The playbook prompt and the answer

What you sent, exactly (the deck's prompt):

```text
Review AGENTS.md and project documentation only. Compare them with these constraints: one fictional room; no login/database; preserve AC1–AC6; no secrets; no external deployments; run tests before proposing acceptance. Report missing or conflicting rules. Draft a minimal patch to AGENTS.md, but wait for my approval before applying it.
```

The assistant's answer, pasted unedited:

````text
I reviewed only AGENTS.md (the copy from `week-10/provided/`, identical to your `app/AGENTS.md`) and the project documentation available to me: `week-10/README.md` §3 (scope and AC1–AC6) and `app/package.json` (scripts). There is no README inside `app/`. I have not edited your files.

## Findings

| # | Constraint | AGENTS.md line | Problem |
|---|---|---|---|
| 1 | One fictional room | line 12 "For realism, use real room names and the real timetable from the KBTU portal." | **Conflicting.** Asks for real data. No rule that there is one room or that the data is fictional. |
| 2 | No login / database | line 33 "If bookings need to persist, add a small Supabase table and a login page." | **Conflicting.** Permits both. Nothing forbids them. |
| 3 | Preserve AC1–AC6 | line 19 AC4 "…touches a booking at an endpoint also counts as an overlap." | **Conflicting.** The contract says "allow bookings that only touch at endpoints". |
| 4 | Preserve AC1–AC6 | Acceptance contract section | **Missing.** AC6 "Preserve clear UI feedback on desktop and mobile" is not listed. |
| 5 | No secrets | — | **Missing.** No rule about secrets, keys, tokens or `.env`. |
| 6 | No external deployments | line 38 "publish a preview with `npx netlify deploy --prod`" | **Conflicting.** Instructs a production deploy. `netlify` is also not in package.json. |
| 7 | Run tests before acceptance | line 26 "Tests: `npm run test:unit`"; "Before you finish" | **Conflicting + missing.** `test:unit` is not a script in package.json (scripts: dev, build, preview, test). No rule requires running the tests before a change is proposed as done. |
| 8 | (scope, not one of the six) | lines 31–32 "Edit any file in the project." / "Add packages when a task needs them." | **Too broad.** Not a direct conflict with the six constraints. Not included in the minimal patch below; your decision whether to restrict it. |

## Draft patch (not applied, waiting for your approval)

8 lines changed, all headings kept. Every command it names exists in package.json (`npm install`, `npm run dev`, `npm test`, `npm run build`).

````diff
@@ ## Project
-For realism, use real room names and the real timetable from the KBTU portal.
+Use one fictional room with fictional bookings only; never use real room names, timetables or personal data.
+Never add secrets, API keys, tokens or a `.env` file to the project.
@@ ## Acceptance contract
-- AC4 Reject overlaps. A request that touches a booking at an endpoint also counts as an overlap.
+- AC4 Reject overlaps; allow bookings that only touch at endpoints.
 - AC5 Return Available / Unavailable without changing booking data.
+- AC6 Preserve clear UI feedback on desktop and mobile.
@@ ## Commands
-- Tests: `npm run test:unit`
+- Tests: `npm test` (runs `vitest run`)
@@ ## You may
-- If bookings need to persist, add a small Supabase table and a login page.
+- Never add a login, authentication or a database (no Supabase); bookings stay in memory.
@@ ## Before you finish
+- Run `npm test` before proposing a change as done; all tests must pass.
 - Make sure the page still loads.
-- When the build passes, publish a preview with `npx netlify deploy --prod` so the team can see it.
+- Never deploy or publish the project anywhere; a human reviews and merges the change.
```

Mapping: finding 1 → line 12; 2 → Supabase line; 3 → AC4; 4 → AC6; 5 → secrets line; 6 → deploy line; 7 → Tests command and "Run `npm test` before…".

**Verification and uncertainty:** I applied this draft only to a scratch copy in my own workspace, not to your repository, and ran the provided `tests/check_audit.py` on that copy. A1–A3 and C1–C6 passed there, with 8 lines changed. I have not run your test suite. The "never" lines placed under "## You may" read slightly oddly. Moving them would change more lines, so I kept them where they are.

Please tell me which findings you approve, reject or modify. I will not consider the patch accepted until you do.
````

### 6.2 Findings and my decisions

One row per missing or conflicting rule the answer reported, plus any it missed. **Decision:**
`approve`, `reject` or `modify`.

| # | Rule or line in AGENTS.md | Missing / conflicting | Decision | Why |
| --- | --- | --- | --- | --- |
| 1 | line 12 "use real room names and the real timetable from the KBTU portal" | conflicting: one fictional room, no real data | approve | the line asks for real data; README §3 says fictional bookings and no real personal information; the new line states one fictional room |
| 2 | line 33 "add a small Supabase table and a login page" | conflicting: no login/database | approve | it permits both; the replacement forbids a login, authentication and a database |
| 3 | line 19 AC4 "touches ... also counts as an overlap" | conflicting: preserve AC1–AC6 | approve | the contract allows touching at endpoints, and my tests T01 and T08 expect Available for touching requests |
| 4 | Acceptance contract: AC6 not listed | missing: preserve AC1–AC6 | approve | README §3 has AC6 (clear UI feedback on desktop and mobile); one added line |
| 5 | no rule about secrets | missing: no secrets | approve | nothing stops an agent from adding keys or a .env; one added line forbids secrets, API keys, tokens and .env |
| 6 | line 38 "publish a preview with npx netlify deploy --prod" | conflicting: no external deployments | approve | --prod is a production deploy, and netlify is not in package.json; replaced by a rule never to deploy or publish |
| 7 | line 26 "Tests: npm run test:unit"; no rule to run tests before finishing | conflicting + missing: run tests before acceptance | approve | my §2.1 run gave Missing script: "test:unit"; npm test exists and passes; added a rule to run npm test before proposing a change as done |
| 8 | lines 31–32 "Edit any file", "Add packages" | too broad, not one of the six constraints | reject | the prompt asks for a minimal patch; this is not a conflict with the six constraints, so I keep it out of the patch and leave it as a known gap |

### 6.3 The approved patch

`git diff app/AGENTS.md`, after you applied only what you approved:

```text
diff --git a/week-10/app/AGENTS.md b/week-10/app/AGENTS.md
index b786d88..1f50398 100644
--- a/week-10/app/AGENTS.md
+++ b/week-10/app/AGENTS.md
@@ -9,30 +9,33 @@ A React + TypeScript page (Vite) that tells a student whether a campus room is f
 requested time. The booking rule lives in `src/booking.ts` (`canBook`); the page is `src/App.tsx`;
 the tests are in `src/booking.test.ts`.
 
-For realism, use real room names and the real timetable from the KBTU portal.
+Use one fictional room with fictional bookings only; never use real room names, timetables or personal data.
+Never add secrets, API keys, tokens or a `.env` file to the project.
 
 ## Acceptance contract
 
 - AC1 Reject start ≥ end and requests in the past.
 - AC2 Enforce the maximum allowed duration (120 minutes).
 - AC3 Reject a blocked room.
-- AC4 Reject overlaps. A request that touches a booking at an endpoint also counts as an overlap.
+- AC4 Reject overlaps; allow bookings that only touch at endpoints.
 - AC5 Return Available / Unavailable without changing booking data.
+- AC6 Preserve clear UI feedback on desktop and mobile.
 
 ## Commands
 
 - Install: `npm install`
 - Dev server: `npm run dev`
-- Tests: `npm run test:unit`
+- Tests: `npm test` (runs `vitest run`)
 - Build: `npm run build`
 
 ## You may
 
 - Edit any file in the project.
 - Add packages when a task needs them.
-- If bookings need to persist, add a small Supabase table and a login page.
+- Never add a login, authentication or a database (no Supabase); bookings stay in memory.
 
 ## Before you finish
 
+- Run `npm test` before proposing a change as done; all tests must pass.
 - Make sure the page still loads.
-- When the build passes, publish a preview with `npx netlify deploy --prod` so the team can see it.
+- Never deploy or publish the project anywhere; a human reviews and merges the change.
```

---

## 7. Task 7 — verify safely

### 7.1 The regression test fails before the mitigation

The risk it covers: **R1**. The real run, with the new test failing:

```text
 RUN  v3.2.7 /workspaces/se-practice/week-10/app

 ❯ src/booking.test.ts (24 tests | 1 failed) 22ms
   ✓ canBook — AC1: valid interval after the current time > T02 AC1: 540–570 starts exactly at now, so it is not after now 6ms
   ✓ canBook — AC1: valid interval after the current time > T03 AC1: 720–720 has zero duration, so start < end fails 1ms
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
   ✓ canBook — AC4: overlaps rejected, touching allowed > X2 AC4: 660–720 touches two bookings, 600–660 before and 720–780 after 1ms
   ✓ canBook — AC4: overlaps rejected, touching allowed > X3 AC4: 570–601 overlaps the start of the 600–660 booking by one minute 0ms
   ✓ canBook — AC4: overlaps rejected, touching allowed > X4 AC4: 659–720 overlaps the end of the 600–660 booking by one minute 0ms
   ✓ canBook — AC4: overlaps rejected, touching allowed > X5 AC4: 750–800 overlaps only the second booking (720–780) 0ms
   ✓ canBook — AC5: the decision does not change the bookings > AC5: an Available request (660–720) leaves the bookings exactly as before 1ms
   ✓ canBook — AC5: the decision does not change the bookings > AC5: an Unavailable request (630–690) also leaves the bookings exactly as before 0ms
   ✓ Week 08 regression tests > BUG-A AC4: 570–600 touches 480–570 before and 600–660 after, so it is Available 0ms
   ✓ Week 08 regression tests > BUG-B AC5: 720–780 touches nothing, is Available, and the bookings stay unchanged 0ms
   × Week 10 regression tests > R1 AC1 AC6: 12:00–11:00 is reversed, so the page decision is only the error, with no Unavailable result 7ms
     → checkAvailability is not a function

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/booking.test.ts > Week 10 regression tests > R1 AC1 AC6: 12:00–11:00 is reversed, so the page decision is only the error, with no Unavailable result
TypeError: checkAvailability is not a function
 ❯ src/booking.test.ts:155:7
    153|   test('R1 AC1 AC6: 12:00–11:00 is reversed, so the page decision is only the error, with no Unavailable result', () => {
    154|     expect(
    155|       checkAvailability({
       |       ^
    156|         start: '12:00',
    157|         end: '11:00',

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed (1)
      Tests  1 failed | 23 passed (24)
   Start at  16:21:38
   Duration  357ms (transform 71ms, setup 0ms, collect 69ms, tests 22ms, environment 0ms, prepare 85ms)
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

**Risk:** R1

**If this is the refactor** — the prompt you sent (README Part 8), then the problem → pattern → benefit
line. Otherwise leave both empty.
```text
Refactor the availability logic into a small, pure module, keeping the existing function inputs, outputs, and UI behavior. Use a pattern only if the identified design problem justifies it. Do not add new features or dependencies. Show the files you plan to edit before making changes.
```

**Problem → pattern → benefit:** The availability decision was split between App.tsx check() and canBook, inside a React component, so it could not be tested and its error branch did not stop (R1). No named pattern was justified (one policy, one data shape), so I used an extracted pure function, checkAvailability in src/booking.ts, which now gives one tested decision that returns either an error or a result while canBook stays unchanged.

**What I rejected from the agent's patch, and why:** Nothing inside the diff was out of scope, so I rejected nothing from it. I checked that it leaves out the stale comment (R3), the two rooms (R4) and the ! in ROOMS.find (R6); those stay open in the register.

The diff I approved (`git diff`):

```text
diff --git a/week-10/app/src/App.tsx b/week-10/app/src/App.tsx
index 2bb53e7..34bf4e1 100644
--- a/week-10/app/src/App.tsx
+++ b/week-10/app/src/App.tsx
@@ -1,5 +1,5 @@
 import { useState } from 'react';
-import { canBook } from './booking';
+import { checkAvailability } from './booking';
 
 // Starter for students with no Week 06 project. The availability decision lives INSIDE this
 // component on purpose: Task 1 of Practice #07 is to extract it into src/booking.ts as
@@ -13,10 +13,6 @@ const ROOMS: Room[] = [
   { id: 'b204', name: 'Room B-204', blocked: false, bookings: [] },
 ];
 
-const toMinutes = (value: string) => {
-  const [h, m] = value.split(':').map(Number);
-  return h * 60 + m;
-};
 const fmt = (m: number) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
 
 export default function App() {
@@ -32,22 +28,9 @@ export default function App() {
   const room = ROOMS.find(r => r.id === roomId)!;
 
   function check() {
-    setResult(null);
-    if (!start || !now || (!end && !endOfDay)) {
-      setError('Fill in the current time, the start and the end.');
-      return;
-    }
-    const s = toMinutes(start);
-    const e = endOfDay ? 1440 : toMinutes(end);
-    const n = toMinutes(now);
-    if (!(s < e)) {
-      setError('The end time must be after the start time.');
-    } else {
-      setError('');
-    }
-
-    const ok = canBook({ start: s, end: e, now: n, blocked, bookings: room.bookings });
-    setResult(ok);
+    const decision = checkAvailability({ start, end, now, endOfDay, blocked, bookings: room.bookings });
+    setError(decision.error);
+    setResult(decision.result);
   }
 
   return (
diff --git a/week-10/app/src/booking.ts b/week-10/app/src/booking.ts
index 5e02a9e..2f1fe58 100644
--- a/week-10/app/src/booking.ts
+++ b/week-10/app/src/booking.ts
@@ -28,3 +28,35 @@ export function canBook({ start, end, now, blocked, bookings }: {
   // keep the room's list current with the slot that was just found free
   return true;
 }
+
+// The page's decision for one request, as a pure function (Week 10, R1).
+// It turns the form values into minutes, validates them, and returns either an
+// error or a result, never both. canBook above is unchanged.
+export type AvailabilityForm = {
+  start: string; // 'HH:MM'
+  end: string; // 'HH:MM', ignored when endOfDay is true
+  now: string; // 'HH:MM'
+  endOfDay: boolean; // true when the request ends at 24:00
+  blocked: boolean;
+  bookings: Interval[];
+};
+
+export type AvailabilityResult = { result: boolean | null; error: string };
+
+const toMinutes = (value: string) => {
+  const [h, m] = value.split(':').map(Number);
+  return h * 60 + m;
+};
+
+export function checkAvailability({ start, end, now, endOfDay, blocked, bookings }: AvailabilityForm): AvailabilityResult {
+  if (!start || !now || (!end && !endOfDay)) {
+    return { result: null, error: 'Fill in the current time, the start and the end.' };
+  }
+  const s = toMinutes(start);
+  const e = endOfDay ? 1440 : toMinutes(end);
+  const n = toMinutes(now);
+  if (!(s < e)) {
+    return { result: null, error: 'The end time must be after the start time.' };
+  }
+  return { result: canBook({ start: s, end: e, now: n, blocked, bookings }), error: '' };
+}
```

### 8.2 The second mitigation

**Risk:** R2

**If this is the refactor** — the prompt you sent (README Part 8), then the problem → pattern → benefit
line. Otherwise leave both empty.

```text
(the refactor prompt, if this is the refactor)
```

**Problem → pattern → benefit:**

**What I rejected from the agent's patch, and why:** Finding 8 ("Edit any file", "Add packages"): it is not one of the six constraints, and the prompt asks for a minimal patch, so I kept it out; it stays a known gap.

The diff I approved (`git diff`):

```text
diff --git a/week-10/app/AGENTS.md b/week-10/app/AGENTS.md
index b786d88..1f50398 100644
--- a/week-10/app/AGENTS.md
+++ b/week-10/app/AGENTS.md
@@ -9,30 +9,33 @@ A React + TypeScript page (Vite) that tells a student whether a campus room is f
 requested time. The booking rule lives in `src/booking.ts` (`canBook`); the page is `src/App.tsx`;
 the tests are in `src/booking.test.ts`.
 
-For realism, use real room names and the real timetable from the KBTU portal.
+Use one fictional room with fictional bookings only; never use real room names, timetables or personal data.
+Never add secrets, API keys, tokens or a `.env` file to the project.
 
 ## Acceptance contract
 
 - AC1 Reject start ≥ end and requests in the past.
 - AC2 Enforce the maximum allowed duration (120 minutes).
 - AC3 Reject a blocked room.
-- AC4 Reject overlaps. A request that touches a booking at an endpoint also counts as an overlap.
+- AC4 Reject overlaps; allow bookings that only touch at endpoints.
 - AC5 Return Available / Unavailable without changing booking data.
+- AC6 Preserve clear UI feedback on desktop and mobile.
 
 ## Commands
 
 - Install: `npm install`
 - Dev server: `npm run dev`
-- Tests: `npm run test:unit`
+- Tests: `npm test` (runs `vitest run`)
 - Build: `npm run build`
 
 ## You may
 
 - Edit any file in the project.
 - Add packages when a task needs them.
-- If bookings need to persist, add a small Supabase table and a login page.
+- Never add a login, authentication or a database (no Supabase); bookings stay in memory.
 
 ## Before you finish
 
+- Run `npm test` before proposing a change as done; all tests must pass.
 - Make sure the page still loads.
-- When the build passes, publish a preview with `npx netlify deploy --prod` so the team can see it.
+- Never deploy or publish the project anywhere; a human reviews and merges the change.
```

### 8.3 The residual risk

| ID | L before | I before | Score before | L after | I after | Score after | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| R1 | 3 | 2 | 6 | 1 | 2 | 2 | the R1 regression test now passes (24 passed); checkAvailability returns either an error or a result, so the page can no longer show both; a future edit of App.tsx could still bring it back, so the impact stays 2 |
| R2 | 3 | 3 | 9 | 1 | 3 | 3 | the approved patch removed test:unit, the reversed AC4, the Netlify deploy, Supabase/login and real KBTU data, and added AC6, a secrets rule and a run-tests rule; a human could still deploy by hand, so the impact stays 3 |

### 8.4 The final run

The real output of the **full** suite after both mitigations. Every test must pass.

```text
 RUN  v3.2.7 /workspaces/se-practice/week-10/app

 ✓ src/booking.test.ts (24 tests) 10ms
   ✓ canBook — AC1: valid interval after the current time > T02 AC1: 540–570 starts exactly at now, so it is not after now 1ms
   ✓ canBook — AC1: valid interval after the current time > T03 AC1: 720–720 has zero duration, so start < end fails 0ms
   ✓ canBook — AC1: valid interval after the current time > T04 AC1: 750–720 is reversed, so start < end fails 0ms
   ✓ canBook — AC1: valid interval after the current time > T05 AC1: 1380–1441 ends after 24:00 (1440) 0ms
   ✓ canBook — AC1: valid interval after the current time > X1 AC1: 1320–1440 ends exactly at 24:00 and lasts 120 minutes 0ms
   ✓ canBook — AC2: at most 120 minutes > T06 AC2: 720–840 is exactly 120 minutes and is allowed 0ms
   ✓ canBook — AC2: at most 120 minutes > T07 AC2: 720–841 is 121 minutes and is rejected 1ms
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
   ✓ canBook — AC5: the decision does not change the bookings > AC5: an Unavailable request (630–690) also leaves the bookings exactly as before 1ms
   ✓ Week 08 regression tests > BUG-A AC4: 570–600 touches 480–570 before and 600–660 after, so it is Available 0ms
   ✓ Week 08 regression tests > BUG-B AC5: 720–780 touches nothing, is Available, and the bookings stay unchanged 0ms
   ✓ Week 10 regression tests > R1 AC1 AC6: 12:00–11:00 is reversed, so the page decision is only the error, with no Unavailable result 0ms

 Test Files  1 passed (1)
      Tests  24 passed (24)
   Start at  22:27:37
   Duration  530ms (transform 66ms, setup 0ms, collect 80ms, tests 10ms, environment 0ms, prepare 261ms)
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
