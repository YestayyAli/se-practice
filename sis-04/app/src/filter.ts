// Room filter: F1 (capacity >= attendees) and F2 (ALL selected equipment). Pure, does not change its input.
import type { Room } from './rooms';

export type RoomCriteria = { attendees: number; equipment: string[] };

export function filterRooms(rooms: Room[], { attendees, equipment }: RoomCriteria): Room[] {
  return rooms.filter(r => r.capacity >= attendees && equipment.every(item => r.equipment.includes(item)));
}
