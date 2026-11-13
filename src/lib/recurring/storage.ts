import { isFrequency, type RecurringSchedule } from "@/lib/recurring/types";

const storageKey = "pockie.recurring";

function isSchedule(value: unknown): value is RecurringSchedule {
  if (!value || typeof value !== "object") {
    return false;
  }

  const schedule = value as RecurringSchedule;
  return (
    typeof schedule.id === "string" &&
    (schedule.type === "income" || schedule.type === "expense") &&
    typeof schedule.accountId === "string" &&
    typeof schedule.category === "string" &&
    Number.isInteger(schedule.amountMinor) &&
    schedule.amountMinor > 0 &&
    schedule.currency === "SGD" &&
    isFrequency(schedule.frequency) &&
    typeof schedule.startDate === "string" &&
    typeof schedule.isPaused === "boolean"
  );
}

export function readSchedules(): RecurringSchedule[] {
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) {
      return [];
    }

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(isSchedule);
  } catch {
    return [];
  }
}

export function writeSchedules(schedules: RecurringSchedule[]) {
  window.localStorage.setItem(storageKey, JSON.stringify(schedules));
}
