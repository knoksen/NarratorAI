import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export const metadata: Metadata = {
  title: 'NarratorAI',
  description: 'Transform your documents into engaging audio narratives.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet"></link>
      </head>
      <body className="font-body antialiased bg-background text-foreground">
        <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
              <span className="inline-block size-2 rounded-full bg-primary" aria-hidden="true" />
              NarratorAI
            </Link>
            <nav className="hidden sm:flex items-center gap-2">
              <Link href="#steps" className="text-sm text-muted-foreground hover:text-foreground">How it works</Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Docs</Link>
              <ThemeToggle />
              <Button size="sm" className="ml-1">Get started</Button>
            </nav>
          </div>
        </header>
        <div className="mx-auto max-w-6xl px-4">
          {children}
        </div>
        <Toaster />
      </body>
    </html>
  );
}
