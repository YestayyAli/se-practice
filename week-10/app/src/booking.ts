// The availability decision, extracted from App.tsx (Practice #07, Task 1).
// The conditions are copied from the page unchanged.

export type Interval = { start: number; end: number };

export type BookingRequest = {
  start: number; // minutes after midnight, e.g. 600 = 10:00
  end: number; // minutes after midnight, 1440 = 24:00
  now: number; // the supplied current time, in minutes
  blocked: boolean; // true when the room is blocked
  bookings: Interval[]; // the room's existing bookings
};

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
    if (start < b.end && end > b.start) return false;
  }
  // keep the room's list current with the slot that was just found free
  return true;
}

// The page's decision for one request, as a pure function (Week 10, R1).
// It turns the form values into minutes, validates them, and returns either an
// error or a result, never both. canBook above is unchanged.
export type AvailabilityForm = {
  start: string; // 'HH:MM'
  end: string; // 'HH:MM', ignored when endOfDay is true
  now: string; // 'HH:MM'
  endOfDay: boolean; // true when the request ends at 24:00
  blocked: boolean;
  bookings: Interval[];
};

export type AvailabilityResult = { result: boolean | null; error: string };

const toMinutes = (value: string) => {
  const [h, m] = value.split(':').map(Number);
  return h * 60 + m;
};

export function checkAvailability({ start, end, now, endOfDay, blocked, bookings }: AvailabilityForm): AvailabilityResult {
  if (!start || !now || (!end && !endOfDay)) {
    return { result: null, error: 'Fill in the current time, the start and the end.' };
  }
  const s = toMinutes(start);
  const e = endOfDay ? 1440 : toMinutes(end);
  const n = toMinutes(now);
  if (!(s < e)) {
    return { result: null, error: 'The end time must be after the start time.' };
  }
  return { result: canBook({ start: s, end: e, now: n, blocked, bookings }), error: '' };
}
