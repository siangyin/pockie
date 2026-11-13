import { addDays, addMonths } from "@/lib/dates/iso";
import type { Transaction } from "@/lib/transactions/types";
import type { Frequency, RecurringSchedule } from "@/lib/recurring/types";

const lookbackDays = 60;

export function occurrenceAt(startDate: string, frequency: Frequency, index: number) {
  if (frequency === "daily") {
    return addDays(startDate, index);
  }
  if (frequency === "weekly") {
    return addDays(startDate, index * 7);
  }
  if (frequency === "monthly") {
    return addMonths(startDate, index);
  }
  return addMonths(startDate, index * 12);
}

function firstIndexOnOrAfter(startDate: string, frequency: Frequency, target: string) {
  if (occurrenceAt(startDate, frequency, 0) >= target) {
    return 0;
  }

  let high = 1;
  while (occurrenceAt(startDate, frequency, high) < target && high < 20_000) {
    high *= 2;
  }

  let low = 0;
  while (low < high) {
    const mid = Math.floor((low + high) / 2);
    if (occurrenceAt(startDate, frequency, mid) < target) {
      low = mid + 1;
    } else {
      high = mid;
    }
  }

  return low;
}

export function nextOccurrence(schedule: RecurringSchedule, today: string) {
  if (schedule.isPaused) {
    return null;
  }

  const index = firstIndexOnOrAfter(schedule.startDate, schedule.frequency, addDays(today, 1));
  return occurrenceAt(schedule.startDate, schedule.frequency, index);
}

export function dueDates(schedule: RecurringSchedule, today: string) {
  if (schedule.isPaused) {
    return [];
  }

  const horizon = addDays(today, -lookbackDays);
  const dates: string[] = [];
  let index = firstIndexOnOrAfter(
    schedule.startDate,
    schedule.frequency,
    horizon > schedule.startDate ? horizon : schedule.startDate,
  );

  for (let step = 0; step < 80; step += 1) {
    const date = occurrenceAt(schedule.startDate, schedule.frequency, index);
    if (date > today) {
      break;
    }
    if (date >= schedule.startDate && date >= horizon) {
      dates.push(date);
    }
    index += 1;
  }

  return dates;
}

export function occurrenceKey(recurringId: string, occurrenceDate: string) {
  return `${recurringId}|${occurrenceDate}`;
}

export function dueTransactions(
  schedules: RecurringSchedule[],
  transactions: Transaction[],
  today: string,
  activeAccountIds: ReadonlySet<string>,
) {
  const seen = new Set(
    transactions
      .filter((transaction) => transaction.recurringId && transaction.occurrenceDate)
      .map((transaction) => occurrenceKey(transaction.recurringId!, transaction.occurrenceDate!)),
  );
  const now = new Date().toISOString();
  const additions: Transaction[] = [];

  for (const schedule of schedules) {
    if (!activeAccountIds.has(schedule.accountId)) {
      continue;
    }

    for (const date of dueDates(schedule, today)) {
      const key = occurrenceKey(schedule.id, date);
      if (seen.has(key)) {
        continue;
      }
      seen.add(key);
      additions.push({
        id: crypto.randomUUID(),
        type: schedule.type,
        accountId: schedule.accountId,
        counterAccountId: null,
        category: schedule.category,
        amountMinor: schedule.amountMinor,
        currency: "SGD",
        transactionDate: date,
        merchant: schedule.merchant,
        notes: schedule.notes,
        direction: null,
        recurringId: schedule.id,
        occurrenceDate: date,
        createdAt: now,
        updatedAt: now,
      });
    }
  }

  return additions;
}

export function upcomingSchedules(schedules: RecurringSchedule[], today: string) {
  const limit = addDays(today, 7);
  return schedules.flatMap((schedule) => {
    const nextDate = nextOccurrence(schedule, today);
    if (!nextDate || nextDate > limit) {
      return [];
    }
    return [{ schedule, nextDate }];
  });
}
