"use client";

import LoadingScreen from "@/components/Loading";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React, { lazy, Suspense, useEffect } from "react";
import { FaArrowDown, FaGithub } from "react-icons/fa";

const Products = lazy(() => import("@components/Products"));
const Socials = lazy(() => import("@components/Socials"));
const Contact = lazy(() => import("@components/Contact"));

const App: React.FC = () => {
  useEffect(() => {
    const newTabLinks = document.querySelectorAll(".newtab");
    newTabLinks.forEach((link) => {
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");
    });
  }, []);

  const scrollClick = () => {
    window.scrollTo({ top: 1000, behavior: "smooth" });
  };

  return (
    <Suspense fallback={<LoadingScreen />}>
      <div className="min-h-screen flex flex-col items-center justify-between text-center">
        <main className="flex-grow flex h-screen flex-col items-center justify-center w-full">
          <h1 className="text-6xl font-bold mb-4 bold-h1">雷のサイト</h1>
          <p className="text-xl mb-8 max-w-xl">
            Rai ChatとかVistaUpdaterとかDiscordのbot作ったりゲームしてる人
            <small>(React noob)</small>
          </p>

          <div className="flex space-x-4">
            <Button className="pt-6 pb-6" onClick={scrollClick}>
              スクロール <FaArrowDown className="bounce ml-2" />
            </Button>
            <Button asChild className="p-4 pt-6 pb-6" variant={"secondary"}>
              <Link href="https://github.com/raidesuuu">
                <FaGithub /> <span>GitHub</span>
              </Link>
            </Button>
          </div>
        </main>

        <Products />
        <Socials />
        <Contact />
      </div>
    </Suspense>
  );
};

export default App;
