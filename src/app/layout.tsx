import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import React from "react";
import { Header } from "@/components/layout/header";
import { Toaster } from "@/components/ui/toaster";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});
export const metadata: Metadata = {
  title: "Workspace",
  description: "Collaborate with developers in you'r own personal space.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={cn("min-h-screen bg-background font-sans antialiased", fontSans.variable)}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {/* <HomeLayout>{children}</HomeLayout> */}
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}

function HomeLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95">
        <Header />
      </header>
      <main className="flex-1">
        <div className="w-full h-full">{children}</div>
      </main>
      {/* <footer>
        <div className="border-t">Footer Component</div>
      </footer> */}
    </div>
  );
}
