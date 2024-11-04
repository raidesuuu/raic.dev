"use client";

import LoadingScreen from "@/components/Loading";
import "@/styles.scss";
import { Suspense } from "react";
import Header from "@components/Header";
import Footer from "@components/Footer";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <title>雷のサイト</title>
        <meta name="description" content="雷のサイトへようこそ！" />
      </head>
      <body>
        <div id="root" className="flex flex-col min-h-screen bg-gray-950 text-white">
          <Header />
          <Suspense fallback={<LoadingScreen />}>{children}</Suspense>
          <Footer />
        </div>
      </body>
    </html>
  );
}
