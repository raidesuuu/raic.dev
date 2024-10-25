"use client"

// Header.tsx
import React, { useEffect, useState } from 'react';
import { CiText } from 'react-icons/ci';
import { FaDiscord, FaGithub } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import DropdownItem from './DropdownItem';

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
                }, 10)
            }
        };

        document.addEventListener('mouseup', handleClickOutside);
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

        <header className="bg-gray-900 text-white flex justify-between items-center px-6 py-4">
            {/* Left Side: Logo */}
            <div className="flex items-center ml-48 space-x-2">
                <a href="/">
                    <span className="font-bold text-xl">雷のサイト</span>
                    <span className="bg-yellow-100 text-yellow-800 ml-3 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300">Beta</span>
                </a>
            </div>

            {/* Center: Search and Navigation */}
            <div className="flex flex-grow items-center justify-center space-x-6">
                {/* Search Bar */}
                <div className="relative flex items-center">
                    <input
                        type="text"
                        placeholder="Type any text..."
                        className="bg-gray-800 text-white rounded-full py-1 pl-8 pr-3"
                    />
                    <CiText className='absolute left-2 top-1/2 transform -translate-y-1/2' />
                </div>

                {/* Navigation Links */}
                <nav className="flex space-x-4">
                    <a href="/products" className="hover:text-blue-200">製品</a>
                    <a href="/socials" className="hover:text-blue-200">SNS</a>
                    <a href="/contact" className="hover:text-blue-200">お問い合わせ</a>
                    <div className="relative">
                        <button onClick={toggleDropdown} className="hover:text-blue-200">
                            その他
                        </button>
                        {isOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-gray-800 text-white rounded-md shadow-lg z-10">
                                <DropdownItem url="/privacy" content="プライバシーポリシー"></DropdownItem>
                            </div>
                        )}
                    </div>
                </nav>
            </div>

            {/* Right Side: Icons */}
            <div className="flex items-center mr-48 space-x-4">
                <a aria-label="Twitter" href="https://x.com/raic_dev"><FaXTwitter className="hover:text-gray-400" /></a>
                <a aria-label="Discord" href="https://discord.gg/tJTTM56Wg2"><FaDiscord className="hover:text-gray-400" /></a>
                <a aria-label="GitHub" href="https://github.com/raidesuuu"><FaGithub className="hover:text-gray-400" /></a>
            </div>

            <hr className='w-100 h-10 text-red-100'></hr>
        </header>
    );
};

export default Header;
