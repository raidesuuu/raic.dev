"use client";

// Header.tsx
import React, { useEffect, useState } from "react";
import { FaDiscord, FaGithub } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import DropdownItem from "./DropdownItem";

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.className.includes("dd-item")) {
        setTimeout(() => {
          setIsOpen(false);
        }, 10);
      }
    };

    document.addEventListener("mouseup", handleClickOutside);
  }, []);

  return (
    // <header className="bg-gray-900 p-4 flex justify-between items-center">
    //     <a href="/" className="text-3xl font-bold text-white">
    //         雷のサイト
    //     </a>
    //     <nav>
    //         <ul className="flex space-x-6 text-gray-300">
    //             <li>
    //                 <a href="/products" className="hover:text-white">製品</a>
    //             </li>
    //             <li>
    //                 <a href="/socials" className="hover:text-white">SNS</a>
    //             </li>
    //             <li>
    //                 <a href="/contact" className="hover:text-white">お問い合わせ</a>
    //             </li>
    //             <li>
    //                 <a href="/privacy" className="hover:text-white">プライバシーポリシー</a>
    //             </li>
    //             <li>
    //                 <a href="https://github.com/raidesuuu" className="flex items-center hover:text-white">
    //                     <FaGithub className="mr-1" /> GitHub
    //                 </a>
    //             </li>
    //         </ul>
    //     </nav>
    // </header>

    <header className="bg-gray-900 text-white flex flex-col md:flex-row justify-between items-center px-6 py-4">
      {/* Left Side: Logo */}
      <div className="flex items-center space-x-2">
        <a href="/">
          <span className="font-bold text-lg sm:text-xl">雷のサイト</span>
          <span className="ml-3 text-xs font-medium px-2.5 py-0.5 rounded bg-yellow-900 text-yellow-300">Beta</span>
        </a>
      </div>

      {/* Center: Search and Navigation */}
      <div className="flex flex-col md:flex-row flex-grow items-center justify-between space-y-4 md:space-y-0 md:ml-10 md:space-x-6 mt-4 md:mt-0">
        {/* Search Bar */}
        {/* <div className="relative flex items-center w-full md:w-auto">
            <input
                type="text"
                placeholder="Type any text..."
                className="bg-gray-800 text-white rounded-full py-1 pl-8 pr-3 w-full md:w-auto"
            />
            <CiText className='absolute left-2 top-1/2 transform -translate-y-1/2' />
        </div> */}

        {/* Navigation Links */}
        <nav className="flex flex-col md:flex-row space-y-2 md:space-y-0 space-x-0 md:space-x-4">
          <a href="/products" className="hover:text-blue-200">
            製品
          </a>
          <a href="/socials" className="hover:text-blue-200">
            SNS
          </a>
          <a href="/contact" className="hover:text-blue-200">
            お問い合わせ
          </a>
          <a href="/account/panel" className="hover:text-blue-200">
            パネル
          </a>
          <div className="relative">
            <button onClick={toggleDropdown} className="hover:text-blue-200">
              その他
            </button>
            {isOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 text-white rounded-md shadow-lg z-10">
                <DropdownItem url="/infomation/privacy" content="プライバシーポリシー"></DropdownItem>
                <DropdownItem url="/infomation/patchnote" content="パッチノート"></DropdownItem>
              </div>
            )}
          </div>
        </nav>
      </div>

      {/* Right Side: Icons */}
      <div className="flex items-center space-x-4 mt-4 md:mt-0">
        <a aria-label="Twitter" href="https://x.com/raic_dev">
          <FaXTwitter className="hover:text-gray-400" />
        </a>
        <a aria-label="Discord" href="https://discord.gg/tJTTM56Wg2">
          <FaDiscord className="hover:text-gray-400" />
        </a>
        <a aria-label="GitHub" href="https://github.com/raidesuuu">
          <FaGithub className="hover:text-gray-400" />
        </a>
      </div>
    </header>
  );
};

export default Header;
