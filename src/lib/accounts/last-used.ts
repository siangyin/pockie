const storageKey = "pockie.lastAccounts";

type LastAccounts = {
  accountId: string | null;
  transferFromId: string | null;
  transferToId: string | null;
};

const empty: LastAccounts = {
  accountId: null,
  transferFromId: null,
  transferToId: null,
};

export function readLastAccounts(): LastAccounts {
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) {
      return empty;
    }
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") {
      return empty;
    }
    const value = parsed as LastAccounts;
    return {
      accountId: typeof value.accountId === "string" ? value.accountId : null,
      transferFromId: typeof value.transferFromId === "string" ? value.transferFromId : null,
      transferToId: typeof value.transferToId === "string" ? value.transferToId : null,
    };
  } catch {
    return empty;
  }
}

function writeLastAccounts(value: LastAccounts) {
  window.localStorage.setItem(storageKey, JSON.stringify(value));
}

export function rememberAccount(accountId: string) {
  writeLastAccounts({ ...readLastAccounts(), accountId });
}

export function rememberTransfer(fromId: string, toId: string) {
  writeLastAccounts({
    accountId: fromId,
    transferFromId: fromId,
    transferToId: toId,
  });
}

export function preferredAccountId(activeIds: string[], remembered: string | null, excludeId = "") {
  if (remembered && remembered !== excludeId && activeIds.includes(remembered)) {
    return remembered;
  }
  const choices = activeIds.filter((id) => id !== excludeId);
  if (choices.length === 1) {
    return choices[0];
  }
  return "";
}
