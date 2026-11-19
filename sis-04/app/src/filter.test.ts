import { describe, test, expect } from 'vitest';
import { filterRooms } from './filter';
import type { Room } from './rooms';

// Fixed catalog for these tests only, independent of the demo ROOMS.
const CATALOG: Room[] = [
  { id: 'small', name: 'Small room', capacity: 4, equipment: ['whiteboard'], blocked: false, bookings: [] },
  { id: 'medium', name: 'Medium room', capacity: 10, equipment: ['projector', 'whiteboard'], blocked: false, bookings: [] },
  { id: 'large', name: 'Large room', capacity: 30, equipment: ['projector', 'video'], blocked: false, bookings: [] },
];

const ids = (rooms: Room[]) => rooms.map(r => r.id);

describe('filterRooms — capacity and equipment', () => {
  test('F1: 10 attendees leave only the rooms with 10 or more seats (medium, large)', () => {
    expect(ids(filterRooms(CATALOG, { attendees: 10, equipment: [] }))).toEqual(['medium', 'large']);
  });

  test('F2: projector + whiteboard leaves only medium; large has a projector but no whiteboard', () => {
    expect(ids(filterRooms(CATALOG, { attendees: 1, equipment: ['projector', 'whiteboard'] }))).toEqual(['medium']);
  });

  test('F4: 100 attendees match no room, so the list is empty', () => {
    expect(filterRooms(CATALOG, { attendees: 100, equipment: [] }).length === 0).toBe(true);
  });

  test('B5 F1: capacity exactly equal to attendees (10 seats, 10 people) is included', () => {
    expect(ids(filterRooms(CATALOG, { attendees: 10, equipment: [] })).includes('medium')).toBe(true);
  });

  test('B6 F1: capacity one below attendees (10 seats, 11 people) is excluded', () => {
    expect(ids(filterRooms(CATALOG, { attendees: 11, equipment: [] })).includes('medium')).toBe(false);
  });
});
