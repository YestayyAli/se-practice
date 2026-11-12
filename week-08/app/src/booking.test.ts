import { describe, test, expect } from 'vitest';
// The real module the page uses: App.tsx does `import { canBook } from './booking'`.
import { canBook, type BookingRequest, type Interval } from './booking';

// Fixed time: now is a plain number (09:00). No clock is read anywhere.
const NOW = 540;

// A fresh fixture for every test: a new request object and a new bookings array.
function request(start: number, end: number, changes: Partial<BookingRequest> = {}): BookingRequest {
  return {
    start,
    end,
    now: NOW,
    blocked: false,
    bookings: [{ start: 600, end: 660 }],
    ...changes,
  };
}

describe('canBook — AC1: valid interval after the current time', () => {
  test('T02 AC1: 540–570 starts exactly at now, so it is not after now', () => {
    expect(canBook(request(540, 570))).toBe(false);
  });

  test('T03 AC1: 720–720 has zero duration, so start < end fails', () => {
    expect(canBook(request(720, 720))).toBe(false);
  });

  test('T04 AC1: 750–720 is reversed, so start < end fails', () => {
    expect(canBook(request(750, 720))).toBe(false);
  });

  test('T05 AC1: 1380–1441 ends after 24:00 (1440)', () => {
    expect(canBook(request(1380, 1441))).toBe(false);
  });

  test('X1 AC1: 1320–1440 ends exactly at 24:00 and lasts 120 minutes', () => {
    expect(canBook(request(1320, 1440))).toBe(true);
  });
});

describe('canBook — AC2: at most 120 minutes', () => {
  test('T06 AC2: 720–840 is exactly 120 minutes and is allowed', () => {
    expect(canBook(request(720, 840))).toBe(true);
  });

  test('T07 AC2: 720–841 is 121 minutes and is rejected', () => {
    expect(canBook(request(720, 841))).toBe(false);
  });
});

describe('canBook — AC3: blocked room', () => {
  test('T13 AC3: 660–720 would be available, but the room is blocked', () => {
    expect(canBook(request(660, 720, { blocked: true }))).toBe(false);
  });
});

describe('canBook — AC4: overlaps rejected, touching allowed', () => {
  test('T01 AC4: 660–720 touches the end of the 600–660 booking', () => {
    expect(canBook(request(660, 720))).toBe(true);
  });

  test('T08 AC4: 570–600 touches the start of the 600–660 booking', () => {
    expect(canBook(request(570, 600))).toBe(true);
  });

  test('T09 AC4: 630–690 partly overlaps 600–660', () => {
    expect(canBook(request(630, 690))).toBe(false);
  });

  test('T10 AC4: 570–690 contains the whole 600–660 booking', () => {
    expect(canBook(request(570, 690))).toBe(false);
  });

  test('T11 AC4: 615–645 lies inside the 600–660 booking', () => {
    expect(canBook(request(615, 645))).toBe(false);
  });

  test('T12 AC4: 600–660 is identical to the existing booking', () => {
    expect(canBook(request(600, 660))).toBe(false);
  });

  test('T14 AC4: 630–690 with no bookings has nothing to overlap', () => {
    expect(canBook(request(630, 690, { bookings: [] }))).toBe(true);
  });

  test('X2 AC4: 660–720 touches two bookings, 600–660 before and 720–780 after', () => {
    const bookings: Interval[] = [
      { start: 600, end: 660 },
      { start: 720, end: 780 },
    ];
    expect(canBook(request(660, 720, { bookings }))).toBe(true);
  });

  // Added after the improvement prompt (section 6.2): one-minute overlaps and the second booking.
  test('X3 AC4: 570–601 overlaps the start of the 600–660 booking by one minute', () => {
    expect(canBook(request(570, 601))).toBe(false);
  });

  test('X4 AC4: 659–720 overlaps the end of the 600–660 booking by one minute', () => {
    expect(canBook(request(659, 720))).toBe(false);
  });

  test('X5 AC4: 750–800 overlaps only the second booking (720–780)', () => {
    const bookings: Interval[] = [
      { start: 600, end: 660 },
      { start: 720, end: 780 },
    ];
    expect(canBook(request(750, 800, { bookings }))).toBe(false);
  });
});

describe('canBook — AC5: the decision does not change the bookings', () => {
  test('AC5: an Available request (660–720) leaves the bookings exactly as before', () => {
    const req = request(660, 720);
    const before = structuredClone(req.bookings);

    const result = canBook(req);

    expect(result).toBe(true);
    expect(req.bookings).toEqual(before);
    expect(JSON.stringify(req.bookings)).toBe(JSON.stringify([{ start: 600, end: 660 }]));
  });

  test('AC5: an Unavailable request (630–690) also leaves the bookings exactly as before', () => {
    const req = request(630, 690);
    const before = structuredClone(req.bookings);

    expect(canBook(req)).toBe(false);
    expect(req.bookings).toEqual(before);
  });
});
