// The rooms that passed the filter, as a choice list, or the empty state (F4).
import type { Room } from '../rooms';

type Props = {
  rooms: Room[];
  selectedId: string;
  onSelect: (id: string) => void;
};

export default function RoomList({ rooms, selectedId, onSelect }: Props) {
  if (rooms.length === 0) {
    return <p className="empty">No room matches these requirements. Lower the number of attendees or untick some equipment.</p>;
  }
  return (
    <ul className="rooms">
      {rooms.map(r => (
        <li key={r.id}>
          <label className={`room ${r.id === selectedId ? 'selected' : ''}`}>
            <input type="radio" name="room" checked={r.id === selectedId} onChange={() => onSelect(r.id)} />
            <span className="room-name">{r.name}{r.blocked ? ' — blocked' : ''}</span>
            <span className="room-meta">{r.capacity} seats · {r.equipment.join(', ')}</span>
          </label>
        </li>
      ))}
    </ul>
  );
}
