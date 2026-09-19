import type { Metadata } from "next";
import { Instrument_Sans, Newsreader } from "next/font/google";
import { ThemeProvider } from "@/providers/theme-provider";
import { RoleProvider } from "@/providers/role-provider";
import "./globals.css";

/** The interface typeface. Three weights, no more. */
const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

/** Math expressions and Reading and Writing passages only. */
const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "MOGSAT — Digital SAT preparation",
    template: "%s · MOGSAT",
  },
  description:
    "Practice the Digital SAT with a question bank, adaptive-style practice tests and progress tracking, with tutor oversight.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${instrumentSans.variable} ${newsreader.variable} h-full`}
    >
      <body className="min-h-full font-sans antialiased">
        <ThemeProvider>
          <RoleProvider>
            <a
              href="#main"
              className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-input focus:border focus:border-accent focus:bg-surface focus:px-4 focus:py-2 focus:text-[14px] focus:text-ink"
            >
              Skip to main content
            </a>
            {children}
          </RoleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
