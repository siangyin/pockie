const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function singaporeDate() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Singapore",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export function singaporeYearMonth() {
  return singaporeDate().slice(0, 7);
}

export function shiftYearMonth(yearMonth: string, delta: number) {
  const [yearText, monthText] = yearMonth.split("-");
  const year = Number(yearText);
  const month = Number(monthText);
  const index = year * 12 + (month - 1) + delta;
  const nextYear = Math.floor(index / 12);
  const nextMonth = index - nextYear * 12 + 1;
  return `${String(nextYear).padStart(4, "0")}-${String(nextMonth).padStart(2, "0")}`;
}

export function formatYearMonth(yearMonth: string) {
  const [year, month] = yearMonth.split("-");
  const name = monthNames[Number(month) - 1];
  return name ? `${name} ${year}` : yearMonth;
}

export function shortMonth(yearMonth: string) {
  const month = Number(yearMonth.split("-")[1]);
  return monthNames[month - 1]?.slice(0, 3) ?? yearMonth;
}

export function monthBounds(yearMonth: string) {
  const [yearText, monthText] = yearMonth.split("-");
  const year = Number(yearText);
  const month = Number(monthText);
  const last = new Date(Date.UTC(year, month, 0)).getUTCDate();
  return {
    start: `${yearMonth}-01`,
    end: `${yearMonth}-${String(last).padStart(2, "0")}`,
  };
}

export function isFullMonth(start: string, end: string) {
  const yearMonth = start.slice(0, 7);
  if (yearMonth !== end.slice(0, 7)) {
    return false;
  }
  const bounds = monthBounds(yearMonth);
  return start === bounds.start && end === bounds.end;
}
