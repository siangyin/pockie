"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, Plus, PieChart, Receipt, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/", label: "Home", icon: House },
  { href: "/transactions", label: "Transactions", icon: Receipt },
  { href: "/add", label: "Add", icon: Plus, prominent: true },
  { href: "/budgets", label: "Budgets", icon: PieChart },
  { href: "/settings", label: "Settings", icon: Settings },
] as const;

function isCurrent(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-full flex-1 flex-col bg-background">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col">
        <main className="flex-1 px-4 pt-6 pb-28">{children}</main>
      </div>
      <nav
        aria-label="Primary"
        className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-card/95 backdrop-blur-md"
      >
        <ul className="mx-auto grid h-16 w-full max-w-md grid-cols-5 pb-[env(safe-area-inset-bottom)]">
          {items.map((item) => {
            const current = isCurrent(pathname, item.href);
            const Icon = item.icon;

            if ("prominent" in item) {
              return (
                <li key={item.href} className="relative">
                  <Link
                    href={item.href}
                    aria-current={current ? "page" : undefined}
                    className="flex h-full flex-col items-center justify-end pb-1.5 text-[11px] font-semibold text-ink focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring"
                  >
                    <span className="absolute top-0 left-1/2 flex size-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-tiger text-ink shadow-md">
                      <Icon aria-hidden="true" className="size-7" />
                    </span>
                    {item.label}
                  </Link>
                </li>
              );
            }

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={current ? "page" : undefined}
                  className={cn(
                    "flex h-full flex-col items-center justify-center gap-1 px-1 text-[11px] font-semibold leading-tight focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring",
                    current ? "text-ink" : "text-muted-foreground",
                  )}
                >
                  <Icon aria-hidden="true" className="size-5" />
                  <span className="text-center">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
