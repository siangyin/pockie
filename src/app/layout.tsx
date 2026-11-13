import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: {
    default: "Pockie",
    template: "%s · Pockie",
  },
  description:
    "Your friendly money buddy. Track simply. Spend wisely. Save happily.",
};

export const viewport: Viewport = {
  themeColor: "#8ecae6",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-GB" className={`${nunito.variable} h-full antialiased`}>
      <body className={`${nunito.className} flex min-h-full flex-col`}>
        {children}
      </body>
    </html>
  );
}
