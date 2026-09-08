import type { Metadata } from "next";
import { Fraunces, Geist, Geist_Mono } from "next/font/google";
import { SidebarProvider } from "@/components/ui/sidebar";

import { TooltipProvider } from "@/components/ui/tooltip";
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/theme-toggle";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Ganesh",
  description: "Society management dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("theme");var d=t?t==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.classList.toggle("dark",d)}catch(e){}`,
          }}
        />
      </head>
      <body className="bg-background text-foreground">
        <TooltipProvider delayDuration={0}>
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              <header className="relative flex h-16 shrink-0 items-center gap-3 border-b border-border/60 bg-background/60 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/70">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-chart-1/40 to-transparent"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -bottom-px inset-x-0 h-6 bg-gradient-to-b from-chart-2/[0.04] to-transparent"
                />
                <SidebarTrigger className="-ml-1" />
                <Separator
                  orientation="vertical"
                  className="mr-1 data-[orientation=vertical]:h-5"
                />
                <div className="flex items-center gap-2">
                  <span className="font-heading text-base font-semibold tracking-tight">
                    Ganesh
                  </span>
                  <span className="hidden rounded-full border border-chart-2/30 bg-gradient-to-r from-chart-2/10 to-chart-1/10 px-2 py-0.5 text-[11px] font-medium text-chart-2 sm:inline-flex">
                    Vinayaka Chavithi
                  </span>
                </div>
                <div className="ml-auto flex items-center rounded-xl border border-border/60 bg-background/40 p-0.5 shadow-sm">
                  <ThemeToggle />
                </div>
              </header>
              <main className="flex flex-1 flex-col">{children}</main>
            </SidebarInset>
          </SidebarProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}