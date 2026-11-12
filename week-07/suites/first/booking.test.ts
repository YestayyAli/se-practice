import { describe, it, expect } from 'vitest';
// Same module and export the page uses: `import { canBook } from './booking'`
import { canBook, type BookingRequest, type Interval } from './booking';

// Fixed "current time". canBook takes `now` as an argument and never reads a clock.
const NOW = 540; // 09:00

/** Fresh default fixture for every call: new request object and new bookings array. */
function defaultBookings(): Interval[] {
  return [{ start: 600, end: 660 }];
}

type Overrides = Partial<Omit<BookingRequest, 'start' | 'end'>>;

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
 * Calls canBook, then checks that the request, including the bookings, is unchanged:
 * - same bookings array reference
 * - same booking object references, in the same order
 * - deep-equal to a snapshot taken before the call
 */
function decideWithoutMutation(req: BookingRequest): boolean {
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

type Case = {
  id: string;
  ac: string;
  label: string;
  start: number;
  end: number;
  // A function, so every test gets newly built arrays and objects
  overrides?: () => Overrides;
  expected: boolean;
};

const cases: Case[] = [
  { id: 'T01', ac: 'AC4', label: 'touching after an existing booking', start: 660, end: 720, expected: true },
  { id: 'T02', ac: 'AC1', label: 'starts exactly at now', start: 540, end: 570, expected: false },
  { id: 'T03', ac: 'AC1', label: 'zero duration', start: 720, end: 720, expected: false },
  { id: 'T04', ac: 'AC1', label: 'reversed interval', start: 750, end: 720, expected: false },
  { id: 'T05', ac: 'AC1', label: 'ends past day end (1441)', start: 1380, end: 1441, expected: false },
  { id: 'T06', ac: 'AC2', label: 'exactly 120 minutes', start: 720, end: 840, expected: true },
  { id: 'T07', ac: 'AC2', label: '121 minutes', start: 720, end: 841, expected: false },
  { id: 'T08', ac: 'AC4', label: 'touching before an existing booking', start: 570, end: 600, expected: true },
  { id: 'T09', ac: 'AC4', label: 'partial overlap', start: 630, end: 690, expected: false },
  { id: 'T10', ac: 'AC4', label: 'contains an existing booking', start: 570, end: 690, expected: false },
  { id: 'T11', ac: 'AC4', label: 'inside an existing booking', start: 615, end: 645, expected: false },
  { id: 'T12', ac: 'AC4', label: 'identical to an existing booking', start: 600, end: 660, expected: false },
  {
    id: 'T13', ac: 'AC3', label: 'room blocked (otherwise valid)',
    start: 660, end: 720, overrides: () => ({ blocked: true }), expected: false,
  },
  {
    id: 'T14', ac: 'AC4', label: 'no existing bookings',
    start: 630, end: 690, overrides: () => ({ bookings: [] }), expected: true,
  },
  { id: 'X1', ac: 'AC1', label: 'ends exactly at 24:00 (1440), 120 minutes', start: 1320, end: 1440, expected: true },
  {
    id: 'X2', ac: 'AC4', label: 'touches two bookings, one on each side',
    start: 660, end: 720,
    overrides: () => ({ bookings: [{ start: 600, end: 660 }, { start: 720, end: 780 }] }),
    expected: true,
  },
];

describe('canBook — case table', () => {
  it.each(cases)('$id [$ac] $start–$end: $label → $expected', (c) => {
    const req = makeRequest(c.start, c.end, c.overrides?.() ?? {});
    const result = decideWithoutMutation(req);
    expect(result).toBe(c.expected); // exact boolean, not truthy/falsy
  });
});

describe('canBook — AC5: decision without changing booking data', () => {
  it('AC5 an Available request returns true and leaves the bookings exactly as before', () => {
    const req = makeRequest(660, 720);
    const before: Interval[] = structuredClone(req.bookings);

    const result = canBook(req);

    expect(result).toBe(true);
    expect(req.bookings).toStrictEqual(before);
    expect(req.bookings).toStrictEqual([{ start: 600, end: 660 }]);
  });

  it('AC5 an Unavailable request returns false and leaves the bookings exactly as before', () => {
    const req = makeRequest(630, 690); // overlaps
    const before: Interval[] = structuredClone(req.bookings);

    const result = canBook(req);

    expect(result).toBe(false);
    expect(req.bookings).toStrictEqual(before);
  });

  it('the returned decision is always a boolean, so the page can map it to Available/Unavailable', () => {
    expect(typeof canBook(makeRequest(660, 720))).toBe('boolean');
    expect(typeof canBook(makeRequest(630, 690))).toBe('boolean');
  });
});

describe('fixture sanity', () => {
  it('each makeRequest call returns a new bookings array', () => {
    const a = makeRequest(660, 720);
    const b = makeRequest(660, 720);
    expect(a.bookings).not.toBe(b.bookings);
    expect(a.bookings[0]).not.toBe(b.bookings[0]);
  });
});
