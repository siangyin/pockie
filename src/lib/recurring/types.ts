export const frequencies = ["daily", "weekly", "monthly", "yearly"] as const;

export type Frequency = (typeof frequencies)[number];

export const frequencyLabels: Record<Frequency, string> = {
  daily: "Daily",
  weekly: "Weekly",
  monthly: "Monthly",
  yearly: "Yearly",
};

export type RecurringSchedule = {
  id: string;
  type: "income" | "expense";
  accountId: string;
  category: string;
  amountMinor: number;
  currency: "SGD";
  frequency: Frequency;
  startDate: string;
  merchant: string;
  notes: string;
  isPaused: boolean;
  createdAt: string;
  updatedAt: string;
};

export function isFrequency(value: string): value is Frequency {
  return frequencies.some((frequency) => frequency === value);
}
