// Room catalog: data only. Fictional rooms; times are minutes after midnight (600 = 10:00).
import type { Interval } from './booking';

export type Room = {
  id: string;
  name: string;
  capacity: number;
  equipment: string[];
  blocked: boolean;
  bookings: Interval[];
};

export const EQUIPMENT: string[] = ['projector', 'whiteboard', 'video', 'computers', 'microphone'];

export const ROOMS: Room[] = [
  { id: 'a101', name: 'Room A-101', capacity: 8, equipment: ['projector', 'whiteboard'], blocked: false, bookings: [{ start: 600, end: 660 }] },
  { id: 'b204', name: 'Room B-204', capacity: 20, equipment: ['projector', 'whiteboard', 'video'], blocked: false, bookings: [] },
  { id: 'c310', name: 'Lab C-310', capacity: 30, equipment: ['projector', 'computers'], blocked: false, bookings: [{ start: 660, end: 780 }] },
  { id: 'd015', name: 'Studio D-015', capacity: 4, equipment: ['whiteboard'], blocked: false, bookings: [{ start: 540, end: 600 }, { start: 720, end: 750 }] },
  { id: 'e402', name: 'Hall E-402', capacity: 60, equipment: ['projector', 'microphone', 'video'], blocked: true, bookings: [] },
];
