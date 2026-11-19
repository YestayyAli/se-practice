// The filter form: attendees and required equipment. It only reports what the user picked.
type Props = {
  attendees: number;
  onAttendees: (n: number) => void;
  options: string[];
  selected: string[];
  onToggle: (item: string) => void;
};

export default function RoomFilter({ attendees, onAttendees, options, selected, onToggle }: Props) {
  return (
    <fieldset className="filter">
      <legend>What do you need?</legend>
      <label>Attendees
        <input type="number" min={1} value={attendees} onChange={e => onAttendees(Number(e.target.value) || 0)} />
      </label>
      <div className="equipment">
        {options.map(item => (
          <label key={item} className="inline">
            <input type="checkbox" checked={selected.includes(item)} onChange={() => onToggle(item)} /> {item}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
