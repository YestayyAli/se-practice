import { useEffect, useState } from 'react';
import { checkRoom } from './booking';
import { filterRooms } from './filter';
import { EQUIPMENT, ROOMS } from './rooms';

const toMinutes = (value: string) => {
  const [h, m] = value.split(':').map(Number);
  return h * 60 + m;
};
const fmt = (m: number) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;

export default function App() {
  const [attendees, setAttendees] = useState(1);
  const [equipment, setEquipment] = useState<string[]>([]);
  const [roomId, setRoomId] = useState('a101');
  const [now, setNow] = useState('09:00');
  const [start, setStart] = useState('11:00');
  const [end, setEnd] = useState('12:00');
  const [endOfDay, setEndOfDay] = useState(false);
  const [result, setResult] = useState<boolean | null>(null);
  const [error, setError] = useState('');

  const visible = filterRooms(ROOMS, { attendees, equipment });
  const room = visible.find(r => r.id === roomId) ?? null;

  // F5: any change of room, time or filter makes the old result stale.
  useEffect(() => {
    setResult(null);
    setError('');
  }, [roomId, now, start, end, endOfDay, attendees, equipment]);

  const toggle = (item: string) =>
    setEquipment(list => (list.includes(item) ? list.filter(x => x !== item) : [...list, item]));

  function check() {
    setResult(null);
    if (!room) {
      setError('Choose a room from the list first.');
      return;
    }
    if (!start || !now || (!end && !endOfDay)) {
      setError('Fill in the current time, the start and the end.');
      return;
    }
    setError('');
    const request = { start: toMinutes(start), end: endOfDay ? 1440 : toMinutes(end), now: toMinutes(now) };
    setResult(checkRoom(ROOMS, room.id, request));
  }

  return (
    <main className="page">
      <h1>Smart Campus Room Availability</h1>
      <fieldset className="filter">
        <legend>What do you need?</legend>
        <label>Attendees
          <input type="number" min={1} value={attendees} onChange={e => setAttendees(Number(e.target.value) || 0)} />
        </label>
        <div className="equipment">
          {EQUIPMENT.map(item => (
            <label key={item} className="inline">
              <input type="checkbox" checked={equipment.includes(item)} onChange={() => toggle(item)} /> {item}
            </label>
          ))}
        </div>
      </fieldset>
      {visible.length === 0 ? (
        <p className="empty">No room matches these requirements. Lower the number of attendees or untick some equipment.</p>
      ) : (
        <ul className="rooms">
          {visible.map(r => (
            <li key={r.id}>
              <label className={`room ${room && r.id === room.id ? 'selected' : ''}`}>
                <input type="radio" name="room" checked={!!room && r.id === room.id} onChange={() => setRoomId(r.id)} />
                <span className="room-name">{r.name}{r.blocked ? ' — blocked' : ''}</span>
                <span className="room-meta">{r.capacity} seats · {r.equipment.join(', ')}</span>
              </label>
            </li>
          ))}
        </ul>
      )}
      <div className="row">
        <label>Current time<input type="time" value={now} onChange={e => setNow(e.target.value)} /></label>
        <label>Start<input type="time" value={start} onChange={e => setStart(e.target.value)} /></label>
        <label>End<input type="time" value={end} disabled={endOfDay} onChange={e => setEnd(e.target.value)} /></label>
        <label className="inline"><input type="checkbox" checked={endOfDay} onChange={e => setEndOfDay(e.target.checked)} /> Ends at 24:00</label>
      </div>
      <button onClick={check} disabled={!room}>Check availability</button>
      {error && <p className="error">{error}</p>}
      {result !== null && room && (
        <p className={`result ${result ? 'available' : 'unavailable'}`}>{room.name}: {result ? 'Available' : 'Unavailable'}</p>
      )}
      {result === false && (
        <p className="hint">Unavailable means at least one of: the start is not after the current time, the end is not after the
          start, it is longer than 120 minutes, it overlaps a booking of this room, or the room is blocked.</p>
      )}
      {room && (
        <>
          <h2>Bookings of {room.name}</h2>
          <ul>{room.bookings.length ? room.bookings.map((b, i) => <li key={i}>{fmt(b.start)}–{fmt(b.end)}</li>) : <li>none</li>}</ul>
        </>
      )}
    </main>
  );
}
