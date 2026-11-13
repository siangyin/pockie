function parts(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return { year, month, day };
}

function toIso(year: number, month: number, day: number) {
  return `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function daysInMonth(year: number, month: number) {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

export function isIsoDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }
  const { year, month, day } = parts(value);
  if (month < 1 || month > 12 || day < 1) {
    return false;
  }
  return day <= daysInMonth(year, month);
}

export function addDays(value: string, days: number) {
  const { year, month, day } = parts(value);
  const date = new Date(Date.UTC(year, month - 1, day + days));
  return toIso(date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate());
}

export function addMonths(value: string, months: number) {
  const { year, month, day } = parts(value);
  const index = year * 12 + (month - 1) + months;
  const nextYear = Math.floor(index / 12);
  const nextMonth = index - nextYear * 12 + 1;
  return toIso(nextYear, nextMonth, Math.min(day, daysInMonth(nextYear, nextMonth)));
}

export function daysBetween(start: string, end: string) {
  const from = parts(start);
  const to = parts(end);
  const startTime = Date.UTC(from.year, from.month - 1, from.day);
  const endTime = Date.UTC(to.year, to.month - 1, to.day);
  return Math.round((endTime - startTime) / 86_400_000);
}

export function formatDisplayDate(value: string) {
  const [year, month, day] = value.split("-");
  if (!year || !month || !day) {
    return value;
  }
  return `${day}/${month}/${year}`;
}
