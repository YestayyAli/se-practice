# Smart Campus Room Availability Checker — SIS 04

A small React + TypeScript page: choose the attendees and the equipment you need, pick one of the
rooms that match, enter the current time and a start/end, and check whether that room is available.
Fictional data only; no login, payments, network calls, browser storage or database.

## Setup

```bash
npm install
```

## Run

```bash
npm run dev
```

Then open the address Vite prints (usually http://localhost:5173).

## Test

```bash
npx vitest run
```

(`npm test` runs the same command.)

## Where things are

| File | What it holds |
| --- | --- |
| `src/rooms.ts` | `type Room`, `ROOMS` (5 fictional rooms), `EQUIPMENT` |
| `src/booking.ts` | `canBook` (AC1–AC5) and `checkRoom` (F3, F5) |
| `src/filter.ts` | `filterRooms` (F1, F2) |
| `src/time.ts` | `toMinutes` / `formatTime` for the page |
| `src/App.tsx`, `src/components/` | the page: state and rendering only |
| `src/*.test.ts` | Vitest tests (33) |
