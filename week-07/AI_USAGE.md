# AI Usage Disclosure — Week 07

Required by the course academic policy (Generative AI use level **D — AI-integrated**).
You are responsible for the accuracy, testing and integrity of everything you submit,
including anything an AI tool produced.

| Tool | Exact model / plan | Used for | Which files it touched |
| --- | --- | --- | --- |
| Claude (Anthropic), Claude app — a fresh chat that only received the deck's prompt | claude-opus-5-5 | the first test suite (Task 3) | `suites/first/booking.test.ts` (saved unedited), the answer in `lab-report.md` §4 |
| Claude, the same chat | claude-opus-5-5 | the improvement prompt (Task 5) | its answer in `lab-report.md` §6.2; I took R1/R2, W1/W2 and three boundary cases into `app/src/booking.test.ts` |
| Claude (Anthropic), Claude app — my main assistant chat | claude-opus-5-5 | doing the lab with me: extracting `canBook`, writing the final suite, running Vitest, the three mutants, the five UI screenshots (taken with Playwright in a headless browser), and drafting `lab-report.md`, this file and `submission.yml` | `app/src/booking.ts`, `app/src/App.tsx`, `app/src/booking.test.ts`, `app/package.json`, `evidence/ui-1.png` … `ui-5.png`, `lab-report.md`, `AI_USAGE.md`, `submission.yml` |

**I used an assistant to extract `canBook` (Task 1), or to fix a defect in it:** yes
<!-- If "yes": which change, in which file, and how you checked that the behaviour did not change. -->
Claude moved the five conditions from `check()` in `App.tsx` into `app/src/booking.ts` without changing them. The behaviour was checked with `tsc`, `vite build`, the browser checks U1–U5 and the 21 tests, which follow the AC table, not the code. No defect fix was needed.

**I used another assistant as well (to explain a failure, to draft text in lab-report.md, …):** yes
<!-- If "yes": which one, the exact model, and for which section. -->
The same Claude model (claude-opus-5-5) in my main chat drafted the text of `lab-report.md`, including §3 reasons, §5, §9 and §10. I read every section and I am responsible for it.

**`suites/first/` holds the assistant's first test file exactly as it generated it:** yes

**Every terminal output in lab-report.md was pasted from a real run, unedited:** yes

**I can explain every test in my final suite — its input, its expected result and the AC behind
it — without the assistant:** yes

**Anything I accepted from the AI without fully understanding it:**
<!-- Name the file and the part. An honest entry here costs far less than a blank one that turns out to be untrue. -->
The `structuredClone` / reference checks in the first suite's `decideWithoutMutation` helper (`suites/first/booking.test.ts`) — I kept the simpler `toEqual` + `JSON.stringify` comparison in my final suite.

Signed: Yestay Ali
Date: 6 November 2026
