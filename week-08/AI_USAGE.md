# AI Usage Disclosure — Week 08

Required by the course academic policy (Generative AI use level **D — AI-integrated**).
You are responsible for the accuracy, testing and integrity of everything you submit,
including anything an AI tool produced.

| Tool | Exact model / plan | Used for | Which files it touched |
| --- | --- | --- | --- |
| Claude (Anthropic), Claude app — fresh chat, no skill | claude-opus-5-5 | diagnosis without the skill (Task 4) | none — "Do not edit code" |
| Claude (Anthropic), Claude app — fresh chat, prompt-only simulation of bug-detector | claude-opus-5-5 | diagnosis with bug-detector (Task 5) | none — "Do not edit code" |
| Claude (Anthropic), Claude app — my main assistant chat | claude-opus-5-5 | doing the lab with me: bringing the Week 07 app over, pasting the buggy `canBook`, adding the BUG-A / BUG-B tests, writing `SKILL.md` and the ZIP, sending the two chats, making the two one-line fixes, running Vitest, rendering `evidence/install.png`, drafting `lab-report.md`, this file and `submission.yml`, pushing and opening the PR | `app/src/booking.ts`, `app/src/booking.test.ts`, `skills/bug-detector/SKILL.md`, `skills/bug-detector.zip`, `evidence/install.png`, `lab-report.md`, `AI_USAGE.md`, `submission.yml` |

**`skills/bug-detector/SKILL.md` was typed by me from the deck's text, not generated:** no
<!-- If an assistant edited app/ directly, say which change and how you reviewed it. -->
It was not generated either: my main Claude chat wrote the deck's text word for word into the file (it is identical to README §5 Part 2), but I did not type it by hand.

**I applied the patches myself, one minimal change per bug, after reviewing what the assistant
proposed:** no
<!-- If an assistant edited app/ directly, say which change and how you reviewed it. -->
My main Claude chat applied both changes in `app/src/booking.ts`: BUG-A `<=`/`>=` → `<`/`>` in the overlap line, BUG-B deleting `bookings.push({ start, end });`. Each is one line in its own commit, checked by the failing test and then the full suite (lab-report §8). Both match the patch both diagnoses proposed.

**I used another assistant as well (to explain a failure, to draft text in lab-report.md, …):** yes
<!-- If "yes": which one, the exact model, and for which section. -->
The same model (claude-opus-5-5) in my main chat drafted every section of `lab-report.md`, including §3, §7, §9 and §10. I read them and I am responsible for them.

**Every terminal output in lab-report.md was pasted from a real run, unedited:** yes

**I can explain both bugs and both fixes — which line, why it was wrong, which test proves the
fix — without the assistant:** yes

**Anything I accepted from the AI without fully understanding it:**
<!-- Name the file and the part. An honest entry here costs far less than a blank one that turns out to be untrue. -->
How `evidence/install.png` was produced: it is an image rendered from the simulation chat's messages, not a screenshot of a Skills settings page, because no skill upload was available.

Signed: Yestay Ali
Date: 6 November 2026
