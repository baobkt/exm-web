import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Telemetry } from '@/components/Telemetry';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'AP Biology Practice · exm-web',
    template: '%s',
  },
  description:
    'Targeted AP Biology practice with worked explanations. Built for the May 2027 AP Bio exam cycle.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Telemetry />
        <div className="flex-1">{children}</div>
        <footer className="border-t border-zinc-200 bg-zinc-50 px-5 py-4 text-xs leading-5 text-zinc-500 dark:border-zinc-800 dark:bg-black dark:text-zinc-500 sm:px-6">
          <p className="mx-auto max-w-3xl">
            We log anonymous, device-scoped session events (questions seen, answers, scores) to
            understand what students find useful. No accounts. No personal data. No IP addresses
            stored by us.
          </p>
        </footer>
      </body>
    </html>
  );
}
