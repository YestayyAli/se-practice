// Time helpers for the page: "HH:MM" <-> minutes after midnight. Formatting only, no booking rule.
export const toMinutes = (value: string): number => {
  const [h, m] = value.split(':').map(Number);
  return h * 60 + m;
};

export const formatTime = (minutes: number): string =>
  `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;
