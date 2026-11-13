"use client";

import { useEffect, useState } from "react";

export function DateField({ id, label }: { id: string; label: string }) {
  const [today, setToday] = useState("");

  useEffect(() => {
    const value = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Singapore",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());
    setToday(value);
  }, []);

  return (
    <label htmlFor={id} className="grid gap-1.5 text-sm font-semibold">
      {label}
      <input
        key={today || "pending"}
        id={id}
        name={id}
        type="date"
        defaultValue={today}
        required
        className="h-12 rounded-xl border border-input bg-card px-3 text-base font-medium"
      />
    </label>
  );
}
