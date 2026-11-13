"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useAccounts } from "@/components/accounts/accounts-provider";
import { useBudgets } from "@/components/budgets/budgets-provider";
import { useCategories } from "@/components/categories/categories-provider";
import { Button } from "@/components/ui/button";
import { useTransactions } from "@/components/transactions/transactions-provider";
import { parseCsv } from "@/lib/csv";
import { budgetsCsv, downloadCsv, transactionsCsv } from "@/lib/export/sheets";
import {
  emptyMapping,
  importFields,
  previewImport,
  suggestMapping,
  type ImportField,
  type ImportMapping,
} from "@/lib/import/transactions";
import { namesFor } from "@/lib/categories";
import { formatMinorAsSgd } from "@/lib/money/sgd";

const fieldClassName =
  "h-12 w-full rounded-xl border border-input bg-card px-3 text-base font-medium";

const linkClassName =
  "text-sm font-bold text-ink underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring";

export function DataPort() {
  const { accounts, ready: accountsReady } = useAccounts();
  const { transactions, ready: transactionsReady, notice, importTransactions } = useTransactions();
  const { budgets, ready: budgetsReady } = useBudgets();
  const { categories, ready: categoriesReady } = useCategories();
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<string[][]>([]);
  const [mapping, setMapping] = useState<ImportMapping>(emptyMapping());
  const [fileError, setFileError] = useState("");
  const [includeDuplicates, setIncludeDuplicates] = useState(false);
  const [pasted, setPasted] = useState("");
  const ready = accountsReady && transactionsReady && budgetsReady && categoriesReady;

  const preview = useMemo(
    () =>
      previewImport(headers, rows, mapping, accounts, transactions, {
        expense: namesFor(categories, "expense"),
        income: namesFor(categories, "income"),
      }),
    [accounts, categories, headers, mapping, rows, transactions],
  );
  const readyRows = preview.filter((row) => row.status === "ready" && row.input);
  const duplicateRows = preview.filter((row) => row.status === "duplicate" && row.input);
  const toImport = includeDuplicates ? [...readyRows, ...duplicateRows] : readyRows;

  function loadText(text: string) {
    const parsed = parseCsv(text);
    if (parsed.length < 2) {
      setFileError("Add a header row and at least one transaction.");
      setHeaders([]);
      setRows([]);
      return;
    }
    const [headerRow, ...body] = parsed;
    setFileError("");
    setHeaders(headerRow);
    setRows(body);
    setMapping(suggestMapping(headerRow));
    setIncludeDuplicates(false);
  }

  function updateMapping(field: ImportField, value: string) {
    setMapping((current) => ({ ...current, [field]: value }));
  }

  function confirmImport() {
    importTransactions(toImport.flatMap((row) => (row.input ? [row.input] : [])));
    setHeaders([]);
    setRows([]);
    setPasted("");
    setMapping(emptyMapping());
  }

  return (
    <div>
      <Link href="/settings" className={linkClassName}>
        Settings
      </Link>
      <header className="mt-3 mb-5">
        <h1 className="text-2xl font-extrabold tracking-tight">Import / Export</h1>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          Download your transactions and budgets, or bring transactions in from a CSV. Amounts are
          in Singapore dollars.
        </p>
      </header>

      {notice ? (
        <p className="mb-4 rounded-2xl bg-amber-soft px-4 py-3 text-sm font-semibold" role="status">
          {notice}
        </p>
      ) : null}

      <section className="rounded-2xl bg-card p-4 ring-1 ring-border">
        <h2 className="font-semibold">Export</h2>
        <div className="mt-3 grid gap-3">
          <Button
            type="button"
            className="h-12 w-full text-base"
            disabled={!ready}
            onClick={() => downloadCsv("pockie-transactions.csv", transactionsCsv(transactions, accounts))}
          >
            Download transactions
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-12 w-full text-base"
            disabled={!ready}
            onClick={() => downloadCsv("pockie-budgets.csv", budgetsCsv(budgets))}
          >
            Download budgets
          </Button>
        </div>
      </section>

      <section className="mt-5">
        <h2 className="font-semibold">Import transactions</h2>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          The first row must name the columns, such as date, type, amount, category, and account.
          Dates can be 2026-11-13 or 13/11/2026.
        </p>
        <label htmlFor="csv-file" className="mt-4 grid gap-1.5 text-sm font-semibold">
          CSV file
          <input
            id="csv-file"
            type="file"
            accept=".csv,text/csv"
            className="text-sm font-medium"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (!file) {
                return;
              }
              void file.text().then(loadText);
            }}
          />
        </label>
        <label htmlFor="csv-paste" className="mt-4 grid gap-1.5 text-sm font-semibold">
          Or paste CSV
          <textarea
            id="csv-paste"
            rows={4}
            value={pasted}
            onChange={(event) => {
              setPasted(event.target.value);
              loadText(event.target.value);
            }}
            className="w-full rounded-xl border border-input bg-card px-3 py-3 text-base font-medium"
          />
        </label>
        {fileError ? <p className="mt-3 text-sm text-destructive">{fileError}</p> : null}

        {headers.length > 0 ? (
          <div className="mt-5 grid gap-4">
            {importFields.map((field) => (
              <label key={field.key} htmlFor={`map-${field.key}`} className="grid gap-1.5 text-sm font-semibold">
                {field.label}
                <select
                  id={`map-${field.key}`}
                  value={mapping[field.key]}
                  onChange={(event) => updateMapping(field.key, event.target.value)}
                  className={fieldClassName}
                >
                  <option value="">Not used</option>
                  {headers.map((header) => (
                    <option key={header} value={header}>
                      {header}
                    </option>
                  ))}
                </select>
              </label>
            ))}

            <p className="text-sm leading-6 text-muted-foreground">
              {readyRows.length} ready, {duplicateRows.length} possible duplicates,{" "}
              {preview.filter((row) => row.status === "invalid").length} need a fix.
            </p>
            <ul className="grid gap-3">
              {preview.slice(0, 30).map((row) => (
                <li key={row.line} className="rounded-2xl bg-card px-4 py-3 ring-1 ring-border">
                  <p className="font-bold">Row {row.line}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {row.status === "ready" ? "Ready" : row.status === "duplicate" ? "Possible duplicate" : "Needs a fix"}
                    {" · "}
                    {row.input ? formatMinorAsSgd(row.input.amountMinor) : row.message}
                  </p>
                </li>
              ))}
            </ul>
            {preview.length > 30 ? (
              <p className="text-sm text-muted-foreground">{preview.length - 30} more rows are not shown.</p>
            ) : null}
            <label className="flex items-start gap-3 text-sm font-semibold">
              <input
                type="checkbox"
                className="mt-1 size-4"
                checked={includeDuplicates}
                onChange={(event) => setIncludeDuplicates(event.target.checked)}
              />
              Import possible duplicates
            </label>
            <Button type="button" className="h-12 w-full text-base" disabled={!ready || toImport.length === 0} onClick={confirmImport}>
              Import {toImport.length} {toImport.length === 1 ? "transaction" : "transactions"}
            </Button>
          </div>
        ) : null}
      </section>
    </div>
  );
}
