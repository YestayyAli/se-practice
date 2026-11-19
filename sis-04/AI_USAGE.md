# AI Usage Disclosure — SIS #04

Required by the course academic policy (Generative AI use level **D — AI-integrated**).
You are responsible for the accuracy, testing and integrity of everything you submit,
including anything an AI tool produced.

| Tool | Exact model / plan | Date | Used for | Which files it touched |
| --- | --- | --- | --- | --- |
| Claude (Anthropic), Claude app — fresh chat | claude-opus-5-5 | 12 Nov 2026 | codebase analysis (Task 1) — report §8.1 | none (answer only) |
| Claude, the same chat | claude-opus-5-5 | 12 Nov 2026 | improvement plan — report §8.2 | none (answer only) |
| Claude, the same chat | claude-opus-5-5 | 12 Nov 2026 | `filterRooms`, `checkRoom` and their first tests — report §8.3 | `app/src/filter.ts`, `app/src/booking.ts` (`checkRoom`), `app/src/filter.test.ts`, `app/src/booking.test.ts` (after my review) |
| Claude (Anthropic), Claude app — my main assistant chat | claude-opus-5-5 | 12–13 Nov 2026 | doing the work with me: bringing the week-08 app in, `rooms.ts`, the page changes and the component split (Tasks 2–3), running Vitest and `tsc`, the browser checks and the five screenshots (Playwright, headless Chromium), the diagrams, `app/README.md`, drafting report §1–§9, this file and `submission.yml`, preparing the commits | `app/src/*`, `app/README.md`, `diagrams/*.puml`, `evidence/*.png`, `report.md` §1–§9, `AI_USAGE.md`, `submission.yml` |

**The assistant wrote, or helped write, tests in `app/`:** yes
The checkRoom tests (F3, F5, unknown id, AC5), the INT test and the filter tests (F1, F2, F4, B5, B6) started from the exchange in §8.3. Their expected values were checked against F1–F5 and AC1–AC5 before the code existed (they ran red first), and deliberate mistakes in `filterRooms` (`some` instead of `every`, `>` instead of `>=`) made them fail. B1–B4 were added to my existing Week 07 test titles.

**Every run pasted in report.md was produced by my code on my machine (or Codespace), unedited:** no
They are unedited runs of the committed code, but they were produced in Claude's cloud workspace (Linux), not on my laptop. `npx vitest run` in `app/` reproduces them (33 passed).

**Every number in report.md section 7 was measured the way its row says:** yes

**I shared no credentials, keys or private data with any tool:** yes

**Everything I submitted, I can explain and defend in class — including filterRooms, checkRoom and
why each module exists:** yes

**Anything I accepted from the AI without fully understanding it:**
The Playwright scripts that took the screenshots in `evidence/` (they are not part of the submission); and in `app/src/App.tsx` the generic `changed(set)` helper syntax `<T,>(…)`.

Signed: Yestay Ali
Date: 13 November 2026
