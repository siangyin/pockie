const maxMinor = 100_000_000_000;

export function formatMinorAsSgd(minor: number): string {
  const negative = minor < 0;
  const absolute = Math.abs(minor);
  const whole = Math.trunc(absolute / 100);
  const cents = String(absolute % 100).padStart(2, "0");
  const grouped = new Intl.NumberFormat("en-SG").format(whole);
  return `${negative ? "-" : ""}S$${grouped}.${cents}`;
}

export function minorToInput(minor: number): string {
  const whole = Math.trunc(Math.abs(minor) / 100);
  const cents = String(Math.abs(minor) % 100).padStart(2, "0");
  return `${minor < 0 ? "-" : ""}${whole}.${cents}`;
}

export function parseSgdToMinor(input: string): number | null {
  const trimmed = input.trim().replaceAll(",", "");
  if (!/^\d+(\.\d{1,2})?$/.test(trimmed)) {
    return null;
  }

  const [whole, fraction = ""] = trimmed.split(".");
  const minor = Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
  if (!Number.isSafeInteger(minor) || minor > maxMinor) {
    return null;
  }

  return minor;
}
