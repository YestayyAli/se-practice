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

// Returns true (Available) or false (Unavailable). It never changes `bookings`.
export function canBook({ start, end, now, blocked, bookings }: BookingRequest): boolean {
  if (!(0 <= start && start < end && end <= 1440)) return false;
  if (!(start > now)) return false;
  if (end - start > 120) return false;
  if (blocked) return false;
  for (const b of bookings) {
    if (start < b.end && end > b.start) return false;
  }
  return true;
}
