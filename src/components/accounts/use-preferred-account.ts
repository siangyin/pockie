"use client";

import { useEffect, useState } from "react";
import { useAccounts } from "@/components/accounts/accounts-provider";
import { preferredAccountId, readLastAccounts } from "@/lib/accounts/last-used";

export function usePreferredAccount(
  kind: "account" | "from" | "to",
  initial = "",
  excludeId = "",
) {
  const { accounts, ready } = useAccounts();
  const [accountId, setAccountId] = useState(initial);

  useEffect(() => {
    if (!ready) {
      return;
    }
    if (accountId && accountId !== excludeId) {
      return;
    }
    const last = readLastAccounts();
    const remembered =
      kind === "from" ? last.transferFromId : kind === "to" ? last.transferToId : last.accountId;
    const activeIds = accounts.filter((account) => !account.isArchived).map((account) => account.id);
    const next = preferredAccountId(activeIds, remembered, excludeId);
    if (next !== accountId) {
      setAccountId(next);
    }
  }, [accountId, accounts, excludeId, kind, ready]);

  return [accountId, setAccountId] as const;
}
