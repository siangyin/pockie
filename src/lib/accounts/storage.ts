import { isAccountType, type Account } from "@/lib/accounts/types";

const storageKey = "pockie.accounts";

function isAccount(value: unknown): value is Account {
  if (!value || typeof value !== "object") {
    return false;
  }

  const account = value as Account;
  return (
    typeof account.id === "string" &&
    typeof account.name === "string" &&
    isAccountType(account.accountType) &&
    account.currency === "SGD" &&
    Number.isInteger(account.openingBalanceMinor) &&
    typeof account.openingBalanceDate === "string" &&
    typeof account.isArchived === "boolean"
  );
}

export function readAccounts(): Account[] {
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) {
      return [];
    }

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(isAccount);
  } catch {
    return [];
  }
}

export function writeAccounts(accounts: Account[]) {
  window.localStorage.setItem(storageKey, JSON.stringify(accounts));
}
