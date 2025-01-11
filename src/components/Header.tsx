"use client";

// Header.tsx
import React, { useEffect, useState } from "react";
import { FaDiscord, FaGithub, FaMoon, FaSun } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import Link from "next/link";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const theme = typeof window !== "undefined" ? useTheme() : null;

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      try {
        const target = event.target as HTMLElement;
        if (target.className) {
          if (target.className.includes("dd-item")) {
            setTimeout(() => {
              setIsOpen(false);
            }, 10);
          }
        }
      } catch (e) {}
    };

    document.addEventListener("mouseup", handleClickOutside);
  }, []);

  return (
    <header className={cn("fixed top-0 w-full", "flex items-center justify-between", "h-16 px-4", "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60", "z-40 border-b")}>
      {/* Left Side: Logo */}
      <div className="flex items-center justify-center sm:none space-x-2">
        <a href="/" className="flex items-center space-x-2">
          <span className="font-bold text-lg sm:text-xl">雷のサイト</span>
          <Badge className="align-middle" variant={"outline"}>Beta</Badge>
        </a>
      </div>

      {/* Center: Search and Navigation */}
      <div className="flex flex-col md:flex-row sm:hidden flex-grow items-center justify-between space-y-4 md:space-y-0 md:ml-10 md:space-x-6 mt-4 md:mt-0">
        {/* Search Bar */}
        {/* <div className="relative flex items-center w-full md:w-auto">
            <input
                type="text"
                placeholder="Type any text..."
                className="bg-grey-800  rounded-full py-1 pl-8 pr-3 w-full md:w-auto"
            />
            <CiText className='absolute left-2 top-1/2 transform -translate-y-1/2' />
        </div> */}

        {/* Navigation Links */}
        <nav className="flex flex-col sm:hidden md:flex-row space-y-2 md:space-y-0 space-x-0 md:space-x-1">
          <Button asChild variant={"link"}>
            <Link href="/products">製品</Link>
          </Button>
          <Button asChild variant={"link"}>
            <Link href="/socials">SNS</Link>
          </Button>
          <Button asChild variant={"link"}>
            <Link href="/contact">お問い合わせ</Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"link"} onClick={toggleDropdown}>
                その他
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href="/infomation/privacy">プライバシーポリシー</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/infomation/patchnote">パッチノート</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/infomation/ranks">サブスクリプション</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>

      {/* Right Side: Icons */}
      <div className="flex items-center space-x-4 mt-4 md:mt-0">
        <Button asChild>
          <Link href="/account/login">アカウント</Link>
        </Button>

        <a aria-label="Twitter" href="https://x.com/raic_dev">
          <FaXTwitter className="hover:text-grey-400" />
        </a>
        <a aria-label="Discord" href="https://discord.gg/tJTTM56Wg2">
          <FaDiscord className="hover:text-grey-400" />
        </a>
        <a aria-label="GitHub" href="https://github.com/raidesuuu">
          <FaGithub className="hover:text-grey-400" />
        </a>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <FaSun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <FaMoon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => theme?.setTheme("light")}>ライト</DropdownMenuItem>
            <DropdownMenuItem onClick={() => theme?.setTheme("dark")}>ダーク</DropdownMenuItem>
            <DropdownMenuItem onClick={() => theme?.setTheme("system")}>システム (既定)</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
      </div>
    </header>
  );
};

export default Header;
