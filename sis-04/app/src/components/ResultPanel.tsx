// The outcome of a check and the chosen room's bookings. It shows what it is given.
import type { Room } from '../rooms';
import { formatTime } from '../time';

type Props = { room: Room | null; result: boolean | null; error: string };

export default function ResultPanel({ room, result, error }: Props) {
  return (
    <section className="outcome">
      {error && <p className="error">{error}</p>}
      {result !== null && (
        <p className={`result ${result ? 'available' : 'unavailable'}`}>
          {room?.name}: {result ? 'Available' : 'Unavailable'}
        </p>
      )}
      {result === false && (
        <p className="hint">Unavailable means at least one of: the start is not after the current time, the end is not after the
          start, it is longer than 120 minutes, it overlaps a booking of this room, or the room is blocked.</p>
      )}
      {room && (
        <>
          <h2>Bookings of {room.name}</h2>
          <ul>
            {room.bookings.length
              ? room.bookings.map((b, i) => <li key={i}>{formatTime(b.start)}–{formatTime(b.end)}</li>)
              : <li>none</li>}
          </ul>
        </>
      )}
    </section>
  );
}
