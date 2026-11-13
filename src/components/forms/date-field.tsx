"use client";

import { useEffect, useState } from "react";

function singaporeToday() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Singapore",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export function DateField({
  id,
  label,
  defaultDate,
}: {
  id: string;
  label: string;
  defaultDate?: string;
}) {
  const [value, setValue] = useState(defaultDate ?? "");

  useEffect(() => {
    setValue(defaultDate || singaporeToday());
  }, [defaultDate]);

  return (
    <label htmlFor={id} className="grid gap-1.5 text-sm font-semibold">
      {label}
      <input
        key={value || "pending"}
        id={id}
        name={id}
        type="date"
        defaultValue={value}
        required
        className="h-12 rounded-xl border border-input bg-card px-3 text-base font-medium"
      />
    </label>
  );
}
