import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { currentSeoYear } from "@/lib/content";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const seoYear = currentSeoYear();

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${seoYear} Locksmith Cost & 24/7 Emergency Dispatch in Texas`,
    template: `%s | ${SITE_NAME}`,
  },
  description: `Compare ${seoYear} Texas locksmith cost ranges and get 24/7 emergency dispatch by ZIP. Licensed techs in Houston, Austin, Dallas, and San Antonio. No-obligation estimates.`,
  keywords: [
    "locksmith cost Texas",
    "emergency locksmith quote",
    "24/7 locksmith dispatch",
    "Houston locksmith cost",
    "Austin locksmith estimate",
  ],
  verification: {
    other: {
      "msvalidate.01": "D27D217E588826A25341EA6F53D5DC3D",
    },
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="flex min-h-dvh max-w-full flex-col overflow-x-clip bg-white text-slate-900">
        {children}
      </body>
    </html>
  );
}
