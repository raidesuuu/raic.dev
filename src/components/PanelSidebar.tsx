import React from "react";

const PanelSidebar: React.FC = () => {
  return (
    <aside className="w-full lg:w-80 bg-gray-800 mb-5 lg:mb-0 lg:mr-5 text-white p-6 flex flex-col">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold">メニュー</h2>
      </div>
      <nav className="flex flex-col space-y-4">
        <a href="/account/panel" className="text-lg hover:bg-gray-700 rounded py-2 px-4">
          ホーム
        </a>
        <a href="/account/panel/subscriptions" className="text-lg hover:bg-gray-700 rounded py-2 px-4">
          サブスクリプション
        </a>
      </nav>
    </aside>
  );
};

export default PanelSidebar;
