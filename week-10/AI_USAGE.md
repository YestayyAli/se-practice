# AI Usage Disclosure — Week 10

Required by the course academic policy (Generative AI use level **D — AI-integrated**).
You are responsible for the accuracy, testing and integrity of everything you submit,
including anything an AI tool produced.

| Tool | Exact model / plan | Used for | Which files it touched |
| --- | --- | --- | --- |
| Claude (claude.ai chat, project files uploaded as zip) | Claude Opus 5.5 (claude-opus-5-5) | read-only risk review (Task 2); the AGENTS.md summary (prompt 0) | none — "WITHOUT editing files"; it had no access to my repository |
| Claude (same chat) | Claude Opus 5.5 (claude-opus-5-5) | AGENTS.md review and patch draft (Task 6) | `app/AGENTS.md`, only after my approval (findings 1–7 approved, 8 rejected); I applied it myself |
| Claude (same chat) | Claude Opus 5.5 (claude-opus-5-5) | minimal patches for two risks (Task 8): the R1 regression test and the checkAvailability refactor | `app/src/booking.ts`, `app/src/App.tsx`, `app/src/booking.test.ts` — I reviewed each diff and applied it myself |
| Claude (same chat) | Claude Opus 5.5 (claude-opus-5-5); the first setup instructions came from Claude Haiku 5.5 in the same chat before I switched the model | step-by-step guidance (Git, Codespace); drafts of lab-report.md §2.3 analysis, §3.2 rows, §4 register, §5 audit, §6.2, §8.1–8.3 text, §9.1 rules; grammar fixes and shortening of my §10 | lab-report.md (only text I checked and pasted myself) |

**The review in Task 2 ran in a mode where the assistant could not edit, and `git status` showed no
change afterwards:** yes
<!-- If it edited anything, say what and how you undid it. -->

**I labelled every claim in lab-report.md §3.2 after opening the cited file myself:** yes

**Every change to `app/` was reviewed by me as a diff before I accepted it:** yes
<!-- Name anything you rejected in §8; name here anything you accepted without reading. -->

**I used another assistant as well (to explain a risk, to draft text in lab-report.md, …):** no
<!-- If "yes": which one, the exact model, and for which section. -->

**Every terminal output in lab-report.md was pasted from a real run, unedited:** yes

**I can explain every score in my register, and why my release decision follows from it, without
the assistant:** yes

**Anything I accepted from the AI without fully understanding it:**
The drafted rows and the code were checked against the files before I pasted them. The §10 conclusion is my own text; the assistant only fixed grammar and suggested removing one sentence to fit 150 words.

Signed: Yestay Ali
Date: 22.11.2026