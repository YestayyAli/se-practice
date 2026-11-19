// Booking rules: canBook (AC1–AC5, unchanged since Practice #07/#08) and checkRoom (F3, F5).
import type { Room } from './rooms';

export type Interval = { start: number; end: number };

export type BookingRequest = {
  start: number; // minutes after midnight, e.g. 600 = 10:00
  end: number; // minutes after midnight, 1440 = 24:00
  now: number; // the supplied current time, in minutes
  blocked: boolean; // true when the room is blocked
  bookings: Interval[]; // the room's existing bookings
};

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

// F3, F5: the chosen room's own blocked flag and bookings decide. An unknown id is not available.
export function checkRoom(
  rooms: Room[],
  roomId: string,
  { start, end, now }: { start: number; end: number; now: number },
): boolean {
  const room = rooms.find(r => r.id === roomId);
  if (!room) return false;
  return canBook({ start, end, now, blocked: room.blocked, bookings: room.bookings });
}
