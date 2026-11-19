import { useState } from 'react';
import { checkRoom } from './booking';
import { filterRooms } from './filter';
import { EQUIPMENT, ROOMS } from './rooms';
import { toMinutes } from './time';
import RoomFilter from './components/RoomFilter';
import RoomList from './components/RoomList';
import ResultPanel from './components/ResultPanel';

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

  // F5: any change of room, time or filter clears the old result in the same update,
  // so a result is never shown next to a room it was not checked for.
  const changed = <T,>(set: (value: T) => void) => (value: T) => {
    set(value);
    setResult(null);
    setError('');
  };

  const toggle = changed((item: string) =>
    setEquipment(list => (list.includes(item) ? list.filter(x => x !== item) : [...list, item])));

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
      <RoomFilter attendees={attendees} onAttendees={changed(setAttendees)} options={EQUIPMENT} selected={equipment} onToggle={toggle} />
      <RoomList rooms={visible} selectedId={room ? room.id : ''} onSelect={changed(setRoomId)} />
      <div className="row">
        <label>Current time<input type="time" value={now} onChange={e => changed(setNow)(e.target.value)} /></label>
        <label>Start<input type="time" value={start} onChange={e => changed(setStart)(e.target.value)} /></label>
        <label>End<input type="time" value={end} disabled={endOfDay} onChange={e => changed(setEnd)(e.target.value)} /></label>
        <label className="inline"><input type="checkbox" checked={endOfDay} onChange={e => changed(setEndOfDay)(e.target.checked)} /> Ends at 24:00</label>
      </div>
      <button onClick={check} disabled={!room}>Check availability</button>
      <ResultPanel room={room} result={result} error={error} />
    </main>
  );
}
