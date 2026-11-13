import { isIsoDate } from "@/lib/dates/iso";
import { parseSgdToMinor } from "@/lib/money/sgd";
import type { Account } from "@/lib/accounts/types";
import { isTransactionType, type Transaction, type TransactionType } from "@/lib/transactions/types";
import type { TransactionInput } from "@/components/transactions/transactions-provider";

export const importFields = [
  { key: "date", label: "Date" },
  { key: "type", label: "Type" },
  { key: "amount", label: "Amount" },
  { key: "category", label: "Category" },
  { key: "account", label: "Account" },
  { key: "toAccount", label: "To account" },
  { key: "merchant", label: "Merchant" },
  { key: "notes", label: "Notes" },
] as const;

export type ImportField = (typeof importFields)[number]["key"];

const aliases: Record<ImportField, string[]> = {
  date: ["date", "transaction date", "transactiondate"],
  type: ["type", "transaction type"],
  amount: ["amount", "value"],
  category: ["category"],
  account: ["account", "from", "from account", "from_account"],
  toAccount: ["to account", "to_account", "to", "counter account"],
  merchant: ["merchant", "payee", "description", "source"],
  notes: ["notes", "note", "memo"],
};

export type ImportMapping = Record<ImportField, string>;

export type ImportRow = {
  line: number;
  status: "ready" | "duplicate" | "invalid";
  message: string;
  input: TransactionInput | null;
};

function normaliseHeader(value: string) {
  return value.trim().toLowerCase().replaceAll("_", " ").replace(/\s+/g, " ");
}

export function emptyMapping(): ImportMapping {
  return {
    date: "",
    type: "",
    amount: "",
    category: "",
    account: "",
    toAccount: "",
    merchant: "",
    notes: "",
  };
}

export function suggestMapping(headers: string[]): ImportMapping {
  const mapping = emptyMapping();
  const normalised = headers.map(normaliseHeader);

  for (const field of importFields) {
    const index = normalised.findIndex((header) => aliases[field.key].includes(header));
    if (index >= 0) {
      mapping[field.key] = headers[index];
    }
  }

  return mapping;
}

function cell(row: string[], headers: string[], column: string) {
  const index = headers.indexOf(column);
  if (index < 0) {
    return "";
  }
  return row[index]?.trim() ?? "";
}

function parseDate(value: string) {
  if (isIsoDate(value)) {
    return value;
  }
  const match = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(value);
  if (!match) {
    return null;
  }
  const iso = `${match[3]}-${match[2].padStart(2, "0")}-${match[1].padStart(2, "0")}`;
  return isIsoDate(iso) ? iso : null;
}

function canonicalCategory(names: readonly string[], value: string) {
  return names.find((category) => category.toLowerCase() === value.toLowerCase()) ?? null;
}

export function duplicateKey(input: {
  type: string;
  transactionDate: string;
  amountMinor: number;
  accountId: string;
  category?: string | null;
  counterAccountId?: string | null;
}) {
  return [
    input.type,
    input.transactionDate,
    input.amountMinor,
    input.accountId,
    input.category ?? "",
    input.counterAccountId ?? "",
  ].join("|");
}

export function previewImport(
  headers: string[],
  rows: string[][],
  mapping: ImportMapping,
  accounts: Account[],
  transactions: Transaction[],
  categories: { expense: readonly string[]; income: readonly string[] },
): ImportRow[] {
  const active = accounts.filter((account) => !account.isArchived);
  const seen = new Set(transactions.map((transaction) => duplicateKey(transaction)));

  return rows.map((row, index) => {
    const dateValue = cell(row, headers, mapping.date);
    const typeValue = cell(row, headers, mapping.type).toLowerCase();
    const amountValue = cell(row, headers, mapping.amount).replace(/^S\$\s*/, "");
    const categoryValue = cell(row, headers, mapping.category);
    const accountValue = cell(row, headers, mapping.account);
    const toValue = cell(row, headers, mapping.toAccount);
    const date = parseDate(dateValue);
    const minor = parseSgdToMinor(amountValue);
    const account = active.find((item) => item.name.toLowerCase() === accountValue.toLowerCase());
    const other = active.find((item) => item.name.toLowerCase() === toValue.toLowerCase());

    let message = "";
    if (!mapping.date || !mapping.type || !mapping.amount || !mapping.account) {
      message = "Map date, type, amount, and account.";
    } else if (!date) {
      message = "Use a date such as 2026-11-13 or 13/11/2026.";
    } else if (!isTransactionType(typeValue)) {
      message = "Use expense, income, or transfer.";
    } else if (minor === null || minor <= 0) {
      message = "Enter an amount above 0, such as 12.50.";
    } else if (!account) {
      message = "Use the name of an active account.";
    } else if (typeValue === "transfer" && (!other || other.id === account.id)) {
      message = "A transfer needs two different accounts.";
    } else if (
      typeValue !== "transfer" &&
      !canonicalCategory(typeValue === "income" ? categories.income : categories.expense, categoryValue)
    ) {
      message = "Use a Pockie category, such as Groceries.";
    }

    if (message) {
      return { line: index + 2, status: "invalid", message, input: null };
    }

    const type = typeValue as TransactionType;
    const input: TransactionInput = {
      type,
      accountId: account!.id,
      counterAccountId: type === "transfer" ? other!.id : null,
      category: type === "transfer" ? null : canonicalCategory(type === "income" ? categories.income : categories.expense, categoryValue),
      amountMinor: minor!,
      transactionDate: date!,
      merchant: cell(row, headers, mapping.merchant),
      notes: cell(row, headers, mapping.notes),
    };
    const key = duplicateKey(input);
    if (seen.has(key)) {
      return { line: index + 2, status: "duplicate", message: "Possible duplicate.", input };
    }
    seen.add(key);
    return { line: index + 2, status: "ready", message: "Ready to import.", input };
  });
}
