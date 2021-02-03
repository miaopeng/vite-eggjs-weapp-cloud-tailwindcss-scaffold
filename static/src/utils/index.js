export const formatTime = (t) => {
  const date = new Date(t);
  const pad = (n) => (n < 10 ? `0${n}` : n);
  const [y, m, d] = [date.getFullYear(), date.getMonth() + 1, date.getDate()];
  const [hh, mm] = [date.getHours(), date.getMinutes()];
  return `${y}-${pad(m)}-${pad(d)} ${pad(hh)}:${pad(mm)}`;
};