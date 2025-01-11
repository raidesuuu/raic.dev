"use client";

import LoadingScreen from "@/components/Loading";
import "@/styles.scss";
import { Suspense } from "react";
import Header from "@components/Header";
import Footer from "@components/Footer";
import { ThemeProvider } from "@/components/theme-provider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <title>雷のサイト</title>
        <meta name="description" content="雷のサイトへようこそ！" />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div id="root" className="flex flex-col min-h-screen">
            <Header />
            <Suspense fallback={<LoadingScreen />}>
              <main>{children}</main>
            </Suspense>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
