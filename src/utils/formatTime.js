export function formatTime(t) {
  if (!t) return "-";
  return `${t.slice(0, 2)}:${t.slice(2)}`;
}
