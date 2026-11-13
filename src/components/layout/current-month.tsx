"use client";

import { useEffect, useState } from "react";

export function CurrentMonth() {
  const [label, setLabel] = useState("This month");

  useEffect(() => {
    const month = new Intl.DateTimeFormat("en-GB", {
      month: "long",
      year: "numeric",
      timeZone: "Asia/Singapore",
    }).format(new Date());
    setLabel(month);
  }, []);

  return <p className="text-right text-sm font-semibold whitespace-nowrap text-muted-foreground">{label}</p>;
}
