export const accountTypes = [
  { value: "cash", label: "Cash" },
  { value: "bank", label: "Bank account" },
  { value: "credit_card", label: "Credit card" },
  { value: "ewallet", label: "E-wallet" },
  { value: "other", label: "Other" },
] as const;

export type AccountType = (typeof accountTypes)[number]["value"];

export type Account = {
  id: string;
  name: string;
  accountType: AccountType;
  currency: "SGD";
  openingBalanceMinor: number;
  openingBalanceDate: string;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
};

export function accountTypeLabel(accountType: AccountType): string {
  return accountTypes.find((type) => type.value === accountType)?.label ?? "Other";
}

export function isAccountType(value: string): value is AccountType {
  return accountTypes.some((type) => type.value === value);
}
