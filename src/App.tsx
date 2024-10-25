import React, { useEffect } from 'react';
import { FaArrowDown, FaGithub } from 'react-icons/fa';
import { Routes, Route } from 'react-router-dom';
import PrivacyPolicy from '@pages/PrivacyPolicy';
import * as SocialsPage from '@pages/Socials';
import * as ProductsPage from '@pages/Products';
import * as ContactPage from '@pages/Contact';
import Products from '@components/Products';
import Socials from '@components/Socials';
import Contact from '@components/Contact';

const Home: React.FC = () => {
  const scrollClick = () => {
    window.scrollTo({ top: 1000, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-between text-center text-white">
      {/* ナビゲーションバー */}

      {/* メインコンテンツ */}
      <main className="flex-grow flex h-screen flex-col items-center justify-center w-full">
        <h1 className="text-6xl font-extrabold mb-4 bold-h1">
          雷のサイト
        </h1>
        <p className="text-xl mb-8 max-w-xl">
          Rai ChatとかVistaUpdaterとかDiscordのbot作ったりゲームしてる人
          <small>(React noob)</small>
        </p>

        <div className="flex space-x-4">
          <button className="button primary flex items-center" onClick={scrollClick}>
            スクロール <FaArrowDown className="text-white bounce ml-2" />
          </button>
          <a href="https://github.com/raidesuuu" className="button newtab secondary flex items-center space-x-2">
            <FaGithub /> <span>GitHub</span>
          </a>
        </div>
      </main>

      <Products />
      <Socials />
      <Contact />
    </div>
  );
};

const App: React.FC = () => {
  useEffect(() => {
    // .socialsクラスを持つすべてのリンク要素を取得
    const newTabLinks = document.querySelectorAll('.newtab');

    // すべてのリンクにtarget="_blank"とrel="noopener noreferrer"を追加
    newTabLinks.forEach((link) => {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
    });
  }, []);
  
  return (
    <Routes>
      <Route path="/" element={<Home />} /> {/* Home Component */}
      <Route path="/products" element={<ProductsPage.default />} /> {/* Home Component */}
      <Route path="/socials" element={<SocialsPage.default />} /> {/* Socials Component */}
      <Route path="/contact" element={<ContactPage.default />} /> { /* Contact Component */}
      <Route path="/privacy" element={<PrivacyPolicy />} /> {/* Privacy Policy */}
    </Routes>
  );
};

export default App;
